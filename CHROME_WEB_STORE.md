# Chrome Web Store — Listing & Publishing Checklist

Everything needed to submit HIPAA Shield to the Chrome Web Store. Copy/paste the fields below into the developer dashboard at:
https://chrome.google.com/webstore/devconsole

---

## 1. Identity

| Field | Value |
|---|---|
| **Name** | HIPAA Shield — PHI Detection for Browsers |
| **Item type** | Extension |
| **Visibility** | Public |
| **Distribution** | All regions (or restrict to United States only — your call) |

---

## 2. Description fields

### Short description (132 chars max)

```
Detects Protected Health Information typed into browser forms — especially AI chat tools. 100% client-side. Zero telemetry.
```

(131 characters — right under the limit)

### Detailed description (16,000 chars max)

```
HIPAA Shield warns when Protected Health Information (PHI) is typed or pasted into browser forms — especially AI chat tools like ChatGPT, Claude, Gemini, Copilot, and Perplexity, which don't sign HIPAA Business Associate Agreements at their default tiers.

When the extension detects PHI in a text field, a warning banner appears immediately above the input, alerting the user before they hit "send."

WHY THIS MATTERS

Healthcare staff increasingly paste patient information into consumer AI tools to summarize, rewrite, or draft from. Most of those tools don't qualify as HIPAA-eligible at the consumer tier and may use inputs for training. From the practice's standpoint, every paste is a potentially reportable disclosure under HIPAA's Privacy Rule. The intervention has to happen at the moment of the choice, not in retrospect during an audit.

WHAT IT DETECTS

The extension detects eight categories of PHI in any input field:

• Social Security Numbers (with prefix validation)
• Date of birth (MM/DD/YYYY 1900–2099)
• Credit card numbers (Visa, Mastercard, Amex, Discover — Luhn-validated)
• Medical Record Numbers (MRN-prefixed identifiers)
• Phone numbers (US formats)
• Email addresses
• ICD-10 diagnosis codes
• Clinical diagnosis terms

Each rule is individually toggleable in the extension popup. SSN, date of birth, credit card, MRN, and ICD-10 are enabled by default. Phone, email, and diagnosis terms are off by default to reduce noise during normal browsing.

WHERE IT WORKS

The extension scans every text input, textarea, and contenteditable field on every page. It's especially useful for:

• ChatGPT (chatgpt.com)
• Claude (claude.ai)
• Google Gemini
• Microsoft Copilot
• Perplexity
• Gmail compose
• Any web form, textarea, or rich text editor on any site

PRIVACY — 100% CLIENT-SIDE

The extension makes zero network requests. No telemetry. No analytics. No error reporting. No usage tracking.

• Manifest declares zero host_permissions
• Source code contains zero fetch or XMLHttpRequest calls
• Detection runs entirely in your browser, on your device
• Local storage is used only to remember your rule toggles
• No remote code injection — all JavaScript and CSS ships in the extension

Full privacy policy: https://patient-protect.com/hipaa-shield/privacy

Verify the source: https://github.com/patient-protect/hipaa-shield (MIT license, under 250 lines of detection logic)

WHAT IT IS NOT

This extension catches casual disclosures at the moment of entry. It is not a substitute for:

• Workforce HIPAA training
• A written AI-use policy
• Business Associate Agreements with HIPAA-eligible vendors
• Platform-level data loss prevention
• Continuous compliance monitoring

It's a net for the easy leaks — not a replacement for the compliance program around them.

OPEN SOURCE

Released under the MIT license. Pull requests welcome. The project lives at github.com/patient-protect/hipaa-shield.

ABOUT PATIENT PROTECT

Patient Protect is a security-first HIPAA compliance platform for independent healthcare practices. We publish 20+ free tools and resources at patient-protect.com/free-tools, including a comprehensive risk assessment, breach intelligence dashboard, citable open dataset, and open reference data on GitHub.

This extension is one of those free tools. There is no paid tier of the extension itself. We built it because the gap between what HIPAA requires and what staff actually do in a browser is the fastest-growing breach category in independent healthcare — and the browser is where the intervention has to live.

QUESTIONS, FEEDBACK, OR ISSUES

GitHub issues: https://github.com/patient-protect/hipaa-shield/issues
Privacy questions: privacy@patient-protect.com
Patient Protect: https://patient-protect.com
```

### Category

**Productivity** (primary). The "Privacy & Security" category would also work; pick whichever Google's UI offers.

### Language

English (United States)

---

## 3. Single purpose statement

When the dev console asks for a "Single purpose statement", use:

```
HIPAA Shield has a single purpose: detect Protected Health Information (PHI) being typed or pasted into web form fields and warn the user via a visible banner. All detection runs locally in the browser; no data is ever transmitted.
```

---

## 4. Permission justifications

The Web Store reviewer will ask why we need each permission. Use these:

### `storage`

```
Used exclusively to remember which detection rules the user has toggled on or off in the popup settings panel. Settings are stored locally via chrome.storage.local and never transmitted off the device.
```

### Content script on `<all_urls>` (Host permission)

```
The extension's sole purpose is to detect PHI in text input fields. PHI can be typed on any website — AI chat tools (chatgpt.com, claude.ai, gemini.google.com, copilot.microsoft.com, perplexity.ai), email composition interfaces, web-based EHR portals, social media platforms where staff might accidentally paste patient information, and any web form. Restricting to a predefined allowlist would defeat the extension's purpose: the fastest-growing breach category is exactly the unexpected disclosure to a tool the practice did not anticipate. The content script reads input field values locally to run regex pattern matching; no input content is ever transmitted off the user's device.
```

### Remote code (Question: "Does your extension include remote code?")

**Answer: No.** All JavaScript and CSS used by the extension is bundled in the package. No remote code is fetched or executed.

### Data usage (Question: "Does your extension collect user data?")

**Answer: No data collected.** Check the boxes:

- [x] Personally identifiable information — NOT collected
- [x] Health information — NOT collected
- [x] Financial and payment information — NOT collected
- [x] Authentication information — NOT collected
- [x] Personal communications — NOT collected
- [x] Location — NOT collected
- [x] Web history — NOT collected
- [x] User activity — NOT collected
- [x] Website content — NOT collected

### Privacy practices (Required attestation)

Check the boxes:

- [x] I do not sell or transfer user data to third parties, outside of the approved use cases
- [x] I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- [x] I do not use or transfer user data to determine creditworthiness or for lending purposes

---

## 5. URLs

| Field | Value |
|---|---|
| **Homepage URL** | https://patient-protect.com/hipaa-shield |
| **Support URL** | https://github.com/patient-protect/hipaa-shield/issues |
| **Privacy Policy** | https://patient-protect.com/hipaa-shield/privacy |

---

## 6. Graphic assets

| Asset | Required? | Dimensions | Where in this repo |
|---|---|---|---|
| Store icon | Yes (taken from manifest) | 128×128 | `icons/icon-128.png` |
| Screenshots | Yes (1–5) | 1280×800 or 640×400 | YOU take these — see SCREENSHOTS.md |
| Small promo tile | Optional but recommended | 440×280 | `store-assets/promo-small.png` |
| Marquee promo tile | Optional (required for featured placement) | 1400×560 | `store-assets/promo-marquee.png` |
| Large promo tile | Optional (legacy) | 920×680 | `store-assets/promo-large.png` |

---

## 7. Upload the package

The extension package is built as `hipaa-shield.zip` at the repo root. Upload that single zip file to the dev console — it contains:

- `manifest.json`
- `icons/` (16, 48, 128)
- `src/` (content script, service worker, popup)

To regenerate the zip after changes:
```bash
cd /path/to/hipaa-shield
rm -f hipaa-shield.zip
zip -r hipaa-shield.zip manifest.json icons/ src/ -x "*.DS_Store"
```

---

## 8. Submit

1. Fill in all sections in the dev console
2. Upload the zip
3. Upload screenshots
4. Upload promotional tiles (optional — but improves discoverability)
5. Save draft, then **Submit for review**
6. Google review: typically 1–3 business days
7. If rejected: response will explain why; fix and resubmit (usually faster on resubmission)

---

## 9. Post-launch

Once approved and live:

- Get the Chrome Web Store URL (format: `https://chromewebstore.google.com/detail/{ID}`)
- Update `app/hipaa-shield/page.tsx` to replace the "Install Instructions" button with a real "Add to Chrome" button linking to the live listing
- Submit the URL to IndexNow + GSC
- Announce: HIPAA Pulse newsletter, X/LinkedIn, mention in the mission blog
- Add the Chrome Web Store link to the GitHub repo README
- Plan Firefox port (separate Web Store, similar process)

---

## Likely review concerns and how we've already addressed them

| Concern | How we address it |
|---|---|
| Broad host permissions (`<all_urls>`) | Documented single purpose; PHI can occur on any site |
| Content scripts on every page | Doesn't read DOM beyond input field values; doesn't transmit anything |
| Telemetry / data collection | None. Zero network requests in the source. |
| Privacy policy | Public URL on patient-protect.com |
| Source available | Open source on GitHub, MIT licensed |
| Vague single purpose | Clear single-purpose statement included |

If a reviewer pushes back on host permissions, our response: the extension cannot fulfill its single purpose with a narrower permission scope because PHI disclosure happens on whatever site the user opens — by definition unpredictable, often to AI tools that did not exist when the policy was written.
