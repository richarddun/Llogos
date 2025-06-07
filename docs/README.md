# 🧪 LLogos Playground — Dev Sandbox for Agentic Updates

This directory (`/docs`) contains a self-contained testbed for developing and previewing behavior for the LLogos browser extension.

It is used for **safe, sandboxed iteration** — particularly on mobile devices or with agentic assistants such as OpenAI Codex or Copilot Workspace.

---

## 📌 Key Concepts

- `playground.html` is a standalone UI to simulate DOM interactions and userscript-style behaviors
- `playground.js` contains logic that would eventually be ported to `content/contentScript.js`
- Styling lives in `style.css`
- The goal is to try things in this context before applying to the actual extension

---

## 🤖 Agent Task Guidelines

If you are an AI agent contributing to this project:

- Always work inside `docs/` unless explicitly instructed otherwise
- Prefer modifying `playground.js` and modularizing into `lib/` if needed
- Do not modify the extension’s `manifest.json`, `background.js`, or popup UI unless directed
- Human review is required before promoting any logic back into `/content`

---

## 🧬 Example Flow

1. Agent adds a new interaction pattern to `playground.js`
2. Maintainer tests it live via GitHub Pages
3. Maintainer asks agent to port the logic into `content/`
4. PR is created for the main extension

---

## ✅ Best Practices

- Keep logic modular and declarative
- Avoid using APIs not supported in Firefox extensions
- Make UI interactions reversible (e.g., preview vs. apply)

---

🌀 “Playground first. Extension second.” That’s the LLogos way.
