function generateUserScript(selectors) {
  return `// ==UserScript==
// @name Hide Elements
// @match *://*/*
// ==/UserScript==

(function() {
  document.querySelectorAll('${selectors}').forEach(el => el.style.display = 'none');
})();`;
}

if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "elements-selected") {
      console.log("User selected elements:", message.elements);
      const selectors = message.elements.map(el => el.selector).join(", ");
      const userscript = generateUserScript(selectors);

      chrome.tabs.sendMessage(sender.tab.id, {
        type: "inject-userscript",
        script: userscript
      });
    }
  });
}

if (typeof module !== 'undefined') {
  module.exports = { generateUserScript };
}