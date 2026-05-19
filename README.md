<p align="left">
  <img src="./icons/icon-128.png" alt="HIPAA Shield" width="96" height="96" />
</p>

# HIPAA Shield

A Chromium browser extension that warns when Protected Health Information (PHI) is being typed or pasted into form fields — especially **AI chat interfaces like ChatGPT, Claude, Gemini, Copilot, and Perplexity**, which are the fastest-growing source of casual HIPAA violations in independent healthcare practices.

**100% client-side. No network calls. Ever.**

Built by [Patient Protect](https://patient-protect.com). Landing page + install guide: [patient-protect.com/hipaa-shield](https://patient-protect.com/hipaa-shield).

## Why this exists

Healthcare staff increasingly paste patient notes into consumer AI tools to summarize, rewrite, or draft from. Most of those tools don't sign a Business Associate Agreement (BAA), don't qualify as HIPAA-eligible at the consumer tier, and may use inputs for training. From the practice's standpoint, every paste is a potentially reportable disclosure under [HIPAA's Privacy Rule](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164#subpart-E).

The browser is where the disclosure happens. So that's where the alert needs to be.

## What it detects

| Rule | Default | Severity | Pattern |
|---|---|---|---|
| Social Security Number | on | high | Standard SSN format with format validation |
| Date of birth | on | high | MM/DD/YYYY 1900–2099 |
| Credit card number | on | high | Visa/MC/Amex/Discover + Luhn check |
| Medical Record Number | on | high | MRN-prefixed identifiers |
| ICD-10 diagnosis code | on | low | Standard ICD-10 format |
| Phone number | off | medium | Standard US phone formats |
| Email address | off | medium | Standard email |
| Diagnosis terms | off | low | Clinical keyword patterns |

Each rule is toggleable in the extension popup. Some are off by default to keep noise low; turn them on if your workflow needs them.

## What it does *not* do

- No telemetry. The extension never makes a network request.
- No data leaves your browser, ever — including matched content, page URLs, or usage stats.
- No identification of individual practices, users, or workflows.
- No keystroke logging (only detection on existing text).
- No analytics, ads, or upsell.

Verify by reading [`src/content-script.js`](./src/content-script.js) — it's under 250 lines.

## Install (developer mode)

This is a pre-release. The extension is not yet on the Chrome Web Store. To install locally:

1. Clone or download this repo
2. Open Chrome → `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked**
5. Select this repo's root folder
6. The extension is now active on all sites

Works on Chrome, Edge, Brave, Arc, and other Chromium-based browsers. (Firefox version planned — Manifest V3 conversion in progress.)

## How it works

The content script attaches input listeners to every text input, textarea, and contenteditable element on every page. When text matches one of the enabled regex rules (with Luhn validation on credit cards), a banner appears immediately above the input warning the user. The banner is dismissible per-input.

Architecture:

```
hipaa-shield/
├── manifest.json              # Manifest V3 spec
├── src/
│   ├── content-script.js      # Detection + UI injection
│   ├── content-script.css     # Banner styles (scoped)
│   ├── service-worker.js      # Background — initializes defaults
│   ├── popup.html             # Settings panel
│   ├── popup.js               # Settings logic
│   └── popup.css              # Settings styles
├── icons/                     # 16/48/128 PNG icons
└── README.md / LICENSE / PRIVACY.md
```

## Limitations (be honest)

- **False positives happen.** A real US phone number that's actually a customer service line for an unrelated service still trips the phone rule. That's why phone/email are off by default.
- **False negatives happen.** A patient name without identifiers is PHI under HIPAA but is essentially undetectable via regex without false-positive flood. Names are deliberately excluded.
- **No EHR / portal whitelisting yet.** A future version will recognize known healthcare-compliant input fields (Epic, Athena, etc.) and suppress warnings inside them.
- **Pure-regex detection, no ML.** Smart enough to be useful, not smart enough to replace policy and training.

The extension is a **net** for the casual leaks — it's not a substitute for workforce training, a written AI-use policy, or platform-level DLP.

## What problem this actually solves

A medical assistant pastes a chart note into ChatGPT to summarize. They didn't think of it as a disclosure. The banner pops up: "Possible PHI detected — date of birth, SSN." The MA closes the tab.

That's the intervention. It happens at the moment of the choice, not in retrospect during an audit.

## License

MIT — see [LICENSE](./LICENSE).

The code is free to use, modify, redistribute, and fork. Forks improving detection accuracy or adding healthcare-platform whitelisting are welcome.

## Companion resources

- [HIPAA Shield landing page](https://patient-protect.com/hipaa-shield) — features, FAQ, hosted privacy policy
- [Patient Protect HIPAA Toolkit](https://github.com/patient-protect/hipaa-toolkit) — open reference data (glossary, acronyms, identifiers, state laws, templates)
- [Patient Protect](https://patient-protect.com) — the HIPAA compliance platform for independent practices
- [Patient Protect free tools](https://patient-protect.com/free-tools) — 20+ free HIPAA resources
- [Is ChatGPT HIPAA compliant?](https://patient-protect.com/post/is-chatgpt-hipaa-compliant-ai-patient-data-risk) — the context

## Contributing

PRs welcome. High-value contributions:
- Additional detection rules (especially specialty-specific identifiers)
- Healthcare-platform whitelists
- Firefox Manifest V3 port
- Internationalization (non-US patterns)

## Privacy policy

- In this repo: [PRIVACY.md](./PRIVACY.md)
- Hosted version: [patient-protect.com/hipaa-shield/privacy](https://patient-protect.com/hipaa-shield/privacy)

Summary: nothing leaves your browser, ever.
