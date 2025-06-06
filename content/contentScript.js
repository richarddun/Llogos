let selectedElements = [];

function highlightElement(el) {
  if (!el.classList.contains("llogos-highlight")) {
    el.classList.add("llogos-highlight");
    selectedElements.push(el);
  }
}

function inspectMode() {
  const hoverHandler = (e) => {
    e.stopPropagation();
    highlightElement(e.target);
  };

  document.body.addEventListener("mouseover", hoverHandler, true);

  document.body.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.body.removeEventListener("mouseover", hoverHandler);

    const elementsData = selectedElements.map((el) => ({
      html: el.outerHTML,
      selector: generateSelector(el)
    }));

    chrome.runtime.sendMessage({ type: "elements-selected", elements: elementsData });

    selectedElements.forEach(el => el.classList.remove("llogos-highlight"));
    selectedElements = [];
  }, { once: true });
}

function generateSelector(el) {
  const tag = el.tagName.toLowerCase();
  const classString = el.className ? "." + el.className.trim().replace(/\s+/g, ".") : "";
  return `${tag}${classString}`;
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "start-inspect") {
    inspectMode();
  } else if (msg.type === "inject-userscript" && msg.script) {
    const s = document.createElement("script");
    s.textContent = msg.script;
    (document.head || document.documentElement).appendChild(s);
    s.remove();
  }
});