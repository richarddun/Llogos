let selectedElements = [];
let currentHover = null;

function hoverElement(el) {
  if (currentHover && currentHover !== el) {
    currentHover.classList.remove('llogos-hover');
  }
  currentHover = el;
  if (!el.classList.contains('llogos-hover') && !el.classList.contains('llogos-selected')) {
    el.classList.add('llogos-hover');
  }
}

function selectElement(el) {
  if (!selectedElements.includes(el)) {
    el.classList.remove('llogos-hover');
    el.classList.add('llogos-selected');
    selectedElements.push(el);
  }
}

function clearHighlights() {
  selectedElements.forEach(el => el.classList.remove('llogos-selected'));
  if (currentHover) currentHover.classList.remove('llogos-hover');
  selectedElements = [];
  currentHover = null;
}

function inspectMode() {
  const hoverHandler = (e) => {
    e.stopPropagation();
    hoverElement(e.target);
  };

  const clickHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.ctrlKey) {
      selectElement(e.target);
      return;
    }

    document.body.removeEventListener('mouseover', hoverHandler, true);
    document.body.removeEventListener('click', clickHandler, true);

    if (!selectedElements.includes(e.target)) {
      selectedElements.push(e.target);
    }

    const elementsData = selectedElements.map(el => ({
      html: el.outerHTML,
      selector: generateSelector(el)
    }));

    chrome.runtime.sendMessage({ type: 'elements-selected', elements: elementsData });

    clearHighlights();
  };

  document.body.addEventListener('mouseover', hoverHandler, true);
  document.body.addEventListener('click', clickHandler, true);
}

function showLLMResponse(scriptText) {
  const box = document.createElement('div');
  box.className = 'llogos-response';

  const close = document.createElement('button');
  close.textContent = 'Close';
  close.addEventListener('click', () => box.remove());

  const pre = document.createElement('pre');
  pre.textContent = scriptText;

  box.appendChild(close);
  box.appendChild(pre);
  document.body.appendChild(box);

}

function generateSelector(el) {
  const tag = el.tagName.toLowerCase();
  const classString = el.className ? '.' + el.className.trim().replace(/\s+/g, '.') : '';
  return `${tag}${classString}`;
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'start-inspect') {
    inspectMode();
  } else if (msg.type === 'inject-userscript' && msg.script) {
    const s = document.createElement('script');
    s.textContent = msg.script;
    (document.head || document.documentElement).appendChild(s);
    s.remove();
    showLLMResponse(msg.script);
  }
});
