document.addEventListener("DOMContentLoaded", () => {
  const apiKeyInput = document.getElementById("apiKey");
  const status = document.getElementById("status");

  chrome.storage.local.get("llmApiKey", (result) => {
    if (result.llmApiKey) {
      apiKeyInput.value = result.llmApiKey;
    }
  });

  document.getElementById("saveKey").addEventListener("click", () => {
    const key = apiKeyInput.value;
    chrome.storage.local.set({ llmApiKey: key }, () => {
      status.textContent = "Key saved!";
    });
  });

  document.getElementById("clearKey").addEventListener("click", () => {
    chrome.storage.local.remove("llmApiKey", () => {
      apiKeyInput.value = "";
      status.textContent = "Key cleared.";
    });
  });
});