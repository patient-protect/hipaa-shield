# Privacy Policy — HIPAA Shield

Last updated: 2026-05-19

## Plain English

The HIPAA Shield extension does not collect, transmit, store on any server, or share any data. Period.

Everything the extension does happens entirely inside your browser, on your device, in your local session. No information about you, the websites you visit, the text you type, what the extension detects, or whether you have the extension installed is ever sent to Patient Protect or any third party.

## In detail

**Data collection.** The extension does not collect personal information, browsing history, form contents, detection results, telemetry, analytics, error logs, or any other data.

**Network requests.** The extension makes no network requests of any kind. There are no calls to any server, including Patient Protect's own infrastructure. This is enforced by the absence of any `host_permissions` in the [manifest](./manifest.json) and by the absence of any `fetch` or `XMLHttpRequest` calls in the source.

**Local storage.** The extension uses `chrome.storage.local` only to remember which detection rules you've toggled on or off in the popup settings. This data lives only on your device. It is not synced, shared, or transmitted.

**Permissions.** The extension requests only:
- `storage` — to remember your rule toggles
- `<all_urls>` in the content script — to run the detection on every page you visit (the actual detection is purely local)

**No code injection from servers.** The extension does not load remote code. All JavaScript and CSS shipped with the extension is what you see in this repository.

**No analytics.** No Google Analytics, no error reporting, no usage tracking. The extension cannot tell us how many people have installed it or what it has detected — and that is intentional.

## Source code

This extension is open source under the MIT license. You can audit the entire codebase yourself. The detection logic is in [`src/content-script.js`](./src/content-script.js).

## Updates to this policy

If this policy changes in any future version, the change will be documented here and in the repository's changelog. If a future version adds any data collection or transmission, the manifest permissions and this policy will be explicit about it.

## Contact

For questions about this privacy policy: privacy@patient-protect.com
For the project broadly: https://github.com/patient-protect/hipaa-shield
