// Single-page version of the extension logic
let selectedElements = [];
let currentHover = null;

// --- API key helpers ---
function getApiKey() {
  return localStorage.getItem('llmApiKey') || '';
}

function setApiKey(key) {
  localStorage.setItem('llmApiKey', key);
}

function removeApiKey() {
  localStorage.removeItem('llmApiKey');
}

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

function generateSelector(el) {
  const tag = el.tagName.toLowerCase();
  const classString = el.className ? '.' + el.className.trim().replace(/\s+/g, '.') : '';
  return `${tag}${classString}`;
}

function generateUserScript(selectors) {
  return `// ==UserScript==\n// @name Hide Elements\n// @match *://*/*\n// ==/UserScript==\n\n(function() {\n  document.querySelectorAll('${selectors}').forEach(el => el.style.display = 'none');\n})();`;
}

function injectUserScript(script) {
  const s = document.createElement('script');
  s.textContent = script;
  (document.head || document.documentElement).appendChild(s);
  s.remove();
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

function inspectMode() {
  clearHighlights();
  const hoverHandler = e => {
    e.stopPropagation();
    hoverElement(e.target);
  };
  const clickHandler = e => {
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
    const selectors = selectedElements.map(el => generateSelector(el)).join(', ');
    const script = generateUserScript(selectors);
    injectUserScript(script);
    showLLMResponse(script);
    clearHighlights();
  };
  document.body.addEventListener('mouseover', hoverHandler, true);
  document.body.addEventListener('click', clickHandler, true);
}

function addMessageToContainer(sender, text, isError) {
  const container = document.getElementById('llogos-chat-messages');
  if (!container) return;
  const msgDiv = document.createElement('div');
  msgDiv.style.marginBottom = '8px';
  const senderSpan = document.createElement('span');
  senderSpan.style.fontWeight = 'bold';
  senderSpan.textContent = sender + ': ';
  const contentSpan = document.createElement('span');
  if (isError) contentSpan.style.color = 'red';
  contentSpan.textContent = text;
  msgDiv.appendChild(senderSpan);
  msgDiv.appendChild(contentSpan);
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function openChatSidebar() {
  if (document.getElementById('llogos-chat-sidebar')) return;
  const sidebar = document.createElement('div');
  sidebar.id = 'llogos-chat-sidebar';
  document.body.appendChild(sidebar);

  const header = document.createElement('div');
  header.id = 'llogos-chat-header';
  const title = document.createElement('div');
  title.textContent = 'Chat';
  title.style.fontWeight = 'bold';
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✖';
  closeBtn.addEventListener('click', () => sidebar.remove());
  header.appendChild(title);
  header.appendChild(closeBtn);
  sidebar.appendChild(header);

  const messagesContainer = document.createElement('div');
  messagesContainer.id = 'llogos-chat-messages';
  const initialMsg = document.createElement('div');
  initialMsg.style.marginBottom = '8px';
  initialMsg.style.color = '#ccc';
  initialMsg.style.fontStyle = 'italic';
  initialMsg.textContent = "Describe the update you'd like to make to this site";
  messagesContainer.appendChild(initialMsg);
  sidebar.appendChild(messagesContainer);

  const inputContainer = document.createElement('div');
  inputContainer.id = 'llogos-chat-input-container';
  const input = document.createElement('textarea');
  input.id = 'llogos-chat-input';
  input.rows = 2;
  input.placeholder = 'Ask about modifications...';
  const sendBtn = document.createElement('button');
  sendBtn.id = 'llogos-chat-send';
  sendBtn.textContent = 'Send';
  sendBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    addMessageToContainer('You', text);
    input.value = '';

    const apiKey = getApiKey();
    if (!apiKey) {
      addMessageToContainer('System', 'API key not set. Please set your API key below.', true);
      return;
    }

    const systemPrompt = 'You are a helpful AI assisting a user in modifying the current web page. Provide JavaScript code snippets to change the page\'s DOM based on the user\'s requests.';
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text }
    ];

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages
      })
    })
      .then(res => res.json())
      .then(data => {
        const resp = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        addMessageToContainer('AI', resp || '[No response]');
      })
      .catch(err => {
        addMessageToContainer('AI', err.toString(), true);
      });
  });
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendBtn.click();
    }
  });
  inputContainer.appendChild(input);
  inputContainer.appendChild(sendBtn);
  sidebar.appendChild(inputContainer);
}

document.getElementById('inspectBtn').addEventListener('click', inspectMode);
document.getElementById('openChatBtn').addEventListener('click', openChatSidebar);
document.getElementById('clearBtn').addEventListener('click', clearHighlights);

const apiKeyInput = document.getElementById('apiKey');
const keyStatus = document.getElementById('keyStatus');
if (apiKeyInput) {
  apiKeyInput.value = getApiKey();
  document.getElementById('saveKey').addEventListener('click', () => {
    setApiKey(apiKeyInput.value.trim());
    if (keyStatus) keyStatus.textContent = 'Key saved!';
  });
  document.getElementById('clearKey').addEventListener('click', () => {
    removeApiKey();
    apiKeyInput.value = '';
    if (keyStatus) keyStatus.textContent = 'Key cleared.';
  });
}
