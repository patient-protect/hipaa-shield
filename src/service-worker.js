/**
 * HIPAA Shield — background service worker.
 *
 * Lightweight: just initializes default settings on install.
 * No telemetry, no network calls, no message handling beyond
 * what's needed for the popup.
 */

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["enabledRules"], (result) => {
    if (!result.enabledRules) {
      chrome.storage.local.set({
        enabledRules: {
          ssn: true,
          dob: true,
          phone: false,
          email: false,
          "credit-card": true,
          mrn: true,
          "icd-10": true,
          "diagnosis-keywords": false,
        },
      });
    }
  });
});
