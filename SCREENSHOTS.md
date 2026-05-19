# Screenshots — required for Chrome Web Store submission

The Web Store requires at least 1 screenshot; 3–5 is the sweet spot for conversion. All must be 1280×800 (preferred) or 640×400.

## The 5 screenshots to take

### 1. `01-chatgpt-warning.png` — the money shot

What it shows: ChatGPT with the warning banner appearing above the chat input.

How to capture:
- Install the extension (developer mode load-unpacked of this folder)
- Go to https://chatgpt.com
- Paste into the chat input:
  ```
  Patient John D. Smith, DOB 03/15/1985, MRN: AB123456789, SSN 123-45-6789. Diagnosis: J45.40 asthma.
  ```
- Wait ~1 second — the orange/red banner appears above the input
- Capture the chat input + banner together (Mac: Cmd+Shift+4, drag)

### 2. `02-popup-settings.png` — the settings panel

What it shows: The extension popup with rule toggles.

How to capture:
- Click the purple HIPAA Shield icon in the toolbar
- The settings popup opens with the rule list
- Screenshot it (Mac: Cmd+Shift+4, then Spacebar, click the popup)

### 3. `03-claude-warning.png` — cross-platform

What it shows: Claude.ai (or Gemini) showing the same warning, demonstrating cross-platform support.

How to capture:
- Open https://claude.ai (or https://gemini.google.com)
- Paste the same test string from #1
- Screenshot showing the banner

### 4. `04-gmail-compose.png` — not just AI

What it shows: Gmail compose flagging PHI, demonstrating breadth beyond AI tools.

How to capture:
- Open https://mail.google.com
- Compose a new email
- In the body, type: `Patient follow-up needed: DOB 03/15/1985, MRN AB123456789`
- Screenshot showing the banner above the compose area

### 5. `05-clean-state.png` — quiet on safe pages (optional)

What it shows: A normal web page (e.g., google.com search) where the extension is silent.

How to capture:
- Open https://google.com
- Type something innocuous like `weather chicago`
- Screenshot to show NO banner appears

## Tips

- Light mode browser usually looks more professional than dark mode
- Close irrelevant tabs to reduce visual noise
- Use a window roughly 1280 wide for clean capture
- Save to a folder like `~/Desktop/hipaa-shield-screenshots/` for organization
- If a capture is wider than 1280, crop in Preview (Cmd+K)
- DO NOT include any real PHI — only the fake test string above

## What to do with them

Put the final 5 PNG files in `store-assets/screenshots/` (already gitignored if needed, or commit them — they're not sensitive). Then upload to the Chrome Web Store dev console.
