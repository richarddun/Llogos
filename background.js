chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "elements-selected") {
    console.log("User selected elements:", message.elements);
    const selectors = message.elements.map(el => el.selector).join(", ");

    const userscript = `// ==UserScript==\n// @name Hide Elements\n// @match *://*/*\n// ==/UserScript==\n
(function() {
  document.querySelectorAll('${selectors}').forEach(el => el.style.display = 'none');
})();`;

    chrome.tabs.sendMessage(sender.tab.id, {
      type: "inject-userscript",
      script: userscript
    });
  }
});