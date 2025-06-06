# 🧠 LLogos — Natural Language Userscript Generator

LLogos is a Firefox browser extension that empowers users to describe visual changes they'd like to make to a webpage using natural language. It leverages LLMs to convert those requests into Tampermonkey-style userscripts.

> “I want to hide all profile pictures.” → Click → Select → Generate userscript

---

## 🚀 Features (Current Implementation)

### ✅ Manifest V2 Extension (Firefox)
- Uses `manifest_version: 2` for maximum scripting freedom.
- Designed exclusively for Firefox.

### 🧰 Popup UI
- `Start Inspect Mode` button triggers a content script to enter hover/click inspection.
- `Settings` button opens a separate options page to manage your LLM API key.

### 🔎 Inspect Mode
- Hover over any number of elements on a page.
- Click one final time to confirm selection.
- Highlighted elements are gathered for LLM prompt preparation.

### 💡 DOM Snapshot & Selector Collection
- For each selected element:
  - Captures its `outerHTML`
  - Generates a basic CSS selector (tag + classes)

### 🧠 Background Logic
- Currently mocks an LLM response.
- Uses all provided selectors to generate a userscript that hides those elements.
- Injects the script live into the page.

---

## 🧪 How to Run Locally (Development Mode)

1. Clone this repository:
   ```bash
   git clone https://github.com/your-name/llogos.git
   cd llogos

    Open Firefox and go to about:debugging

    Click This Firefox → Load Temporary Add-on...

    Select the manifest.json file from the root of this project.

📂 Folder Structure

llogos/
├── manifest.json
├── background.js
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── options/
│   ├── options.html
│   └── options.js
├── content/
│   ├── contentScript.js
│   └── highlighter.css
├── icons/
│   └── icon-48.png
│   └── icon-96.png

🔐 API Key Handling

    Stored locally using chrome.storage.local.

    Accessible only to the extension itself.

    Managed from the Settings page (options.html).

🧭 Flow Overview

    User clicks Start Inspect Mode.

    Content script enables hover + selection mode.

    User selects multiple elements → final click confirms.

    Background receives DOM snapshots + selectors.

    Mock LLM generates userscript.

    Script is injected and executed immediately.

🔮 Planned / Suggested Next Steps
🛠 Development Features

Replace mock LLM with real API call (e.g., OpenAI, Claude, Ollama, etc.)

DOM filtering or summarization to optimize token use

Persistent script saving per domain (like Tampermonkey)

Visual preview before injection

    “Undo” injected script option

✨ UX Features

Natural language prompt entry box

Live userscript editor panel

Script sharing/export (.user.js file format)

    Auto-group similar DOM patterns for advanced manipulation

🤝 Contributions

If you'd like to contribute ideas, code, or fixes, open a pull request or start a discussion in issues.
🧬 License

MIT — free to adapt, build on, and share with attribution.

    LLogos — because sometimes all you need is the right word to reshape the web.


