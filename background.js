console.log('LLogos background script loaded');

function generateUserScript(selectors) {
  return `// ==UserScript==
// @name Hide Elements
// @match *://*/*
// ==/UserScript==

(function() {
  document.querySelectorAll('${selectors}').forEach(el => el.style.display = 'none');
})();`;
}

// Listen for keyboard shortcut to open the chat sidebar
if (typeof chrome !== 'undefined' && chrome.commands && chrome.commands.onCommand) {
  chrome.commands.onCommand.addListener(command => {
    console.log('Command received:', command);
    if (command === "open-chat-sidebar") {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs[0] && tabs[0].id) {
          console.log('Opening chat sidebar via command');
          chrome.tabs.sendMessage(tabs[0].id, { type: "open-chat" });
        }
      });
    }
  });
}

if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background received message:', message.type);
    if (message.type === "elements-selected") {
      console.log("User selected elements:", message.elements);
      const selectors = message.elements.map(el => el.selector).join(", ");
      const userscript = generateUserScript(selectors);

      console.log('Sending userscript to tab');
      chrome.tabs.sendMessage(sender.tab.id, {
        type: "inject-userscript",
        script: userscript
      });
    } else if (message.type === "chat-message") {
      chrome.storage.local.get("llmApiKey", ({ llmApiKey }) => {
        console.log('Processing chat message');
        if (!llmApiKey) {
          chrome.tabs.sendMessage(sender.tab.id, {
            type: "chat-response",
            error: "API key not set. Please set your API key in settings."
          });
          return;
        }
        const systemPrompt = "You are a helpful AI assisting a user in modifying the current web page. Provide JavaScript code snippets to change the page's DOM based on the user's requests.";
        const messages = [
          { role: "system", content: systemPrompt },
          { role: "user", content: message.prompt }
        ];
        fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${llmApiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages
          })
        })
          .then(response => response.json())
          .then(data => {
            console.log('Received chat completion');
            const resp = data.choices && data.choices[0] && data.choices[0].message.content;
            chrome.tabs.sendMessage(sender.tab.id, {
              type: "chat-response",
              response: resp
            });
          })
          .catch(error => {
            console.error('Chat completion failed', error);
            chrome.tabs.sendMessage(sender.tab.id, {
              type: "chat-response",
              error: error.toString()
            });
          });
      });
    }
  });
}

if (typeof module !== 'undefined') {
  module.exports = { generateUserScript };
}