document.getElementById("openSettings").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

document.getElementById("inspectBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "start-inspect" });
  });
});

document.getElementById("openChatBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "open-chat" });
  });
});