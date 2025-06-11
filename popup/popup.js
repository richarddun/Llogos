console.log('LLogos popup script loaded');

document.getElementById("openSettings").addEventListener("click", () => {
  console.log('Settings button clicked');
  chrome.runtime.openOptionsPage();
});

document.getElementById("inspectBtn").addEventListener("click", () => {
  console.log('Start Inspect Mode clicked');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "start-inspect" });
  });
});

document.getElementById("openChatBtn").addEventListener("click", () => {
  console.log('Open Chat clicked');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "open-chat" });
  });
});