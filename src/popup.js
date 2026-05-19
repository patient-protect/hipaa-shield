const DEFAULTS = {
  ssn: true,
  dob: true,
  phone: false,
  email: false,
  "credit-card": true,
  mrn: true,
  "icd-10": true,
  "diagnosis-keywords": false,
};

function init() {
  chrome.storage.local.get(["enabledRules"], (result) => {
    const settings = { ...DEFAULTS, ...(result.enabledRules || {}) };
    document.querySelectorAll("input[type='checkbox'][data-rule]").forEach((el) => {
      el.checked = settings[el.dataset.rule] !== false && settings[el.dataset.rule] !== undefined;
    });
  });

  document.querySelectorAll("input[type='checkbox'][data-rule]").forEach((el) => {
    el.addEventListener("change", () => {
      chrome.storage.local.get(["enabledRules"], (result) => {
        const settings = { ...DEFAULTS, ...(result.enabledRules || {}) };
        settings[el.dataset.rule] = el.checked;
        chrome.storage.local.set({ enabledRules: settings });
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", init);
