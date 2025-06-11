console.log('Options script loaded');

document.addEventListener("DOMContentLoaded", () => {
  console.log('Options page DOMContentLoaded');
  const apiKeyInput = document.getElementById("apiKey");
  const status = document.getElementById("status");

  chrome.storage.local.get("llmApiKey", (result) => {
    console.log('Retrieved API key from storage', !!result.llmApiKey);
    if (result.llmApiKey) {
      apiKeyInput.value = result.llmApiKey;
    }
  });

  document.getElementById("saveKey").addEventListener("click", () => {
    console.log('Save API key clicked');
    const key = apiKeyInput.value;
    chrome.storage.local.set({ llmApiKey: key }, () => {
      status.textContent = "Key saved!";
    });
  });

  document.getElementById("clearKey").addEventListener("click", () => {
    console.log('Clear API key clicked');
    chrome.storage.local.remove("llmApiKey", () => {
      apiKeyInput.value = "";
      status.textContent = "Key cleared.";
    });
  });
});