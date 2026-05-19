/**
 * HIPAA Shield — content script.
 *
 * Runs in every page. Monitors text input fields for PHI patterns
 * and shows an inline warning when one is detected.
 *
 * Architecture:
 *   1. Regex catalog of unambiguous PHI patterns
 *   2. Listener attached to text inputs / textareas / contenteditable
 *   3. Debounced check on input (250ms)
 *   4. Warning banner injected above the matching element
 *
 * Privacy:
 *   - No network calls. Ever.
 *   - No telemetry.
 *   - Content of matches never leaves the user's browser.
 *   - Per-rule toggles stored locally via chrome.storage.local.
 */

(function () {
  "use strict";

  // ── PHI detection rules ─────────────────────────────────────────
  // Each rule must be high-precision (low false-positive rate).
  // The cost of a false positive is noise; the cost of a false
  // negative is a HIPAA violation. We err toward catching more.
  const RULES = [
    {
      id: "ssn",
      label: "Social Security Number",
      // XXX-XX-XXXX or XXXXXXXXX (9 digits with optional dashes/spaces)
      pattern: /\b(?!000|666|9\d{2})\d{3}[-\s]?(?!00)\d{2}[-\s]?(?!0000)\d{4}\b/g,
      severity: "high",
    },
    {
      id: "dob",
      label: "Date of birth",
      // MM/DD/YYYY, MM-DD-YYYY, MM.DD.YYYY (year 1900-2099)
      pattern: /\b(0?[1-9]|1[0-2])[\/\-.](0?[1-9]|[12]\d|3[01])[\/\-.](19|20)\d{2}\b/g,
      severity: "high",
    },
    {
      id: "phone",
      label: "Phone number",
      pattern: /\b(?:\+?1[-.\s]?)?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
      severity: "medium",
    },
    {
      id: "email",
      label: "Email address",
      pattern: /\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\b/g,
      severity: "medium",
    },
    {
      id: "credit-card",
      label: "Credit card number",
      // Visa, Mastercard, Amex, Discover — Luhn-checked below
      pattern: /\b(?:4\d{12}(?:\d{3})?|5[1-5]\d{14}|3[47]\d{13}|6(?:011|5\d{2})\d{12})\b/g,
      severity: "high",
      luhnCheck: true,
    },
    {
      id: "mrn",
      label: "Medical record number (MRN)",
      // Common pattern: "MRN" or "MR#" followed by digits
      pattern: /\b(?:MRN|MR\s?#|Medical\s?Record\s?(?:Number|#)?)[\s:]*([A-Z]?\d{5,12})\b/gi,
      severity: "high",
    },
    {
      id: "icd-10",
      label: "ICD-10 diagnosis code",
      // Letter + 2 digits + optional decimal + up to 4 alphanumerics
      pattern: /\b[A-TV-Z]\d{2}(?:\.[A-Z0-9]{1,4})?\b/g,
      severity: "low",
    },
    {
      id: "diagnosis-keywords",
      label: "Clinical diagnosis terms",
      // Combination of high-PHI-risk clinical terms
      pattern: /\b(?:diagnosed\s+with|diagnosis\s+of|prescribed|prescribing|administering|treatment\s+for)\s+([a-z]+(?:\s+[a-z]+){0,3})/gi,
      severity: "low",
    },
  ];

  // Defaults — user can disable any rule via the popup.
  const DEFAULT_ENABLED = {
    ssn: true,
    dob: true,
    phone: false, // lots of false positives in normal browsing
    email: false, // ditto
    "credit-card": true,
    mrn: true,
    "icd-10": true,
    "diagnosis-keywords": false, // experimental
  };

  let enabled = { ...DEFAULT_ENABLED };

  // Load user preferences
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.local.get(["enabledRules"], (result) => {
      if (result.enabledRules) {
        enabled = { ...DEFAULT_ENABLED, ...result.enabledRules };
      }
    });
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.enabledRules) {
        enabled = { ...DEFAULT_ENABLED, ...changes.enabledRules.newValue };
      }
    });
  }

  // ── Luhn check for credit cards ─────────────────────────────────
  function luhn(num) {
    const digits = num.replace(/\D/g, "").split("").map(Number);
    let sum = 0;
    let alt = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let d = digits[i];
      if (alt) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
      alt = !alt;
    }
    return sum % 10 === 0;
  }

  // ── Detection ────────────────────────────────────────────────────
  function detect(text) {
    const findings = [];
    if (!text || text.length < 4) return findings;

    for (const rule of RULES) {
      if (!enabled[rule.id]) continue;
      rule.pattern.lastIndex = 0;
      let match;
      while ((match = rule.pattern.exec(text)) !== null) {
        if (rule.luhnCheck && !luhn(match[0])) continue;
        findings.push({
          ruleId: rule.id,
          label: rule.label,
          severity: rule.severity,
          match: match[0],
        });
        // Cap matches per rule to avoid runaway loops
        if (findings.filter((f) => f.ruleId === rule.id).length >= 5) break;
      }
    }
    return findings;
  }

  // ── Banner UI ────────────────────────────────────────────────────
  function buildBanner(findings) {
    const banner = document.createElement("div");
    banner.className = "hipaa-shield-banner";
    banner.setAttribute("role", "alert");
    banner.setAttribute("aria-live", "polite");

    const grouped = {};
    for (const f of findings) {
      grouped[f.label] = (grouped[f.label] || 0) + 1;
    }
    const labels = Object.entries(grouped)
      .map(([label, count]) => (count > 1 ? `${label} (×${count})` : label))
      .join(", ");

    const high = findings.some((f) => f.severity === "high");

    banner.dataset.severity = high ? "high" : "medium";
    banner.innerHTML = `
      <span class="hipaa-shield-icon" aria-hidden="true">⚠</span>
      <div class="hipaa-shield-content">
        <strong class="hipaa-shield-title">HIPAA Shield: possible PHI detected</strong>
        <div class="hipaa-shield-detail">${escapeHtml(labels)}</div>
        <div class="hipaa-shield-hint">
          If you're entering this into a tool that doesn't have a HIPAA BAA
          (most consumer AI tools don't), this may be a reportable disclosure.
        </div>
      </div>
      <button class="hipaa-shield-dismiss" aria-label="Dismiss" type="button">×</button>
    `;

    banner.querySelector(".hipaa-shield-dismiss").addEventListener("click", () => {
      banner.remove();
    });

    return banner;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Each element gets at most one active banner; track on the element.
  const BANNER_KEY = "__hipaaShieldBanner";

  function showBanner(target, findings) {
    if (target[BANNER_KEY] && document.body.contains(target[BANNER_KEY])) {
      target[BANNER_KEY].remove();
    }
    const banner = buildBanner(findings);
    target[BANNER_KEY] = banner;
    // Insert immediately above the input
    const parent = target.parentElement || document.body;
    parent.insertBefore(banner, target);
  }

  function clearBanner(target) {
    if (target[BANNER_KEY]) {
      target[BANNER_KEY].remove();
      target[BANNER_KEY] = null;
    }
  }

  // ── Input wiring ─────────────────────────────────────────────────
  function getInputText(el) {
    if (el.isContentEditable) return el.innerText || "";
    if (typeof el.value === "string") return el.value;
    return "";
  }

  function shouldWatch(el) {
    if (!el || el.dataset.hipaaShield === "ignore") return false;
    if (el.tagName === "TEXTAREA") return true;
    if (el.tagName === "INPUT") {
      const t = (el.type || "text").toLowerCase();
      return [
        "text",
        "search",
        "url",
        "tel",
        "email",
        "password",
      ].includes(t);
    }
    return el.isContentEditable === true;
  }

  // Debounce timer per element
  function attach(el) {
    if (el.dataset.hipaaShieldAttached === "1") return;
    el.dataset.hipaaShieldAttached = "1";

    let timer = null;
    const handler = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const text = getInputText(el);
        const findings = detect(text);
        if (findings.length > 0) {
          showBanner(el, findings);
        } else {
          clearBanner(el);
        }
      }, 250);
    };
    el.addEventListener("input", handler, { passive: true });
    el.addEventListener("paste", () => setTimeout(handler, 0));
    el.addEventListener("blur", () => {
      // Keep banner visible briefly after blur
      setTimeout(() => {
        if (el[BANNER_KEY]) {
          el[BANNER_KEY].classList.add("hipaa-shield-faded");
        }
      }, 400);
    });
  }

  function scan(root) {
    const candidates = root.querySelectorAll(
      "input, textarea, [contenteditable='true'], [contenteditable='']",
    );
    candidates.forEach((el) => {
      if (shouldWatch(el)) attach(el);
    });
  }

  // Initial scan
  scan(document);

  // Watch for new inputs added to the DOM (e.g., dynamic chat UIs)
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (shouldWatch(node)) attach(node);
        if (node.querySelectorAll) scan(node);
      }
    }
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
