let selectedElements = [];
let currentHover = null;
let isLongPress = false;

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

  let longPressTimer;

  const clickHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.ctrlKey || isLongPress) {
      selectElement(e.target);
      isLongPress = false;
      return;
    }

    document.body.removeEventListener('mouseover', hoverHandler, true);
    document.body.removeEventListener('click', clickHandler, true);
    document.body.removeEventListener('touchstart', touchStartHandler, true);
    document.body.removeEventListener('touchend', touchEndHandler, true);
    document.body.removeEventListener('touchmove', touchMoveHandler, true);

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

  const touchStartHandler = (e) => {
    longPressTimer = setTimeout(() => {
      isLongPress = true;
      selectElement(e.target);
    }, 600);
  };

  const touchEndHandler = (e) => {
    clearTimeout(longPressTimer);
    if (isLongPress) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const touchMoveHandler = () => {
    clearTimeout(longPressTimer);
  };

  document.body.addEventListener('mouseover', hoverHandler, true);
  document.body.addEventListener('click', clickHandler, true);
  document.body.addEventListener('touchstart', touchStartHandler, true);
  document.body.addEventListener('touchend', touchEndHandler, true);
  document.body.addEventListener('touchmove', touchMoveHandler, true);
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

function openChatSidebar() {
  if (document.getElementById('llogos-chat-sidebar')) return;
  const sidebar = document.createElement('div');
  sidebar.id = 'llogos-chat-sidebar';
  Object.assign(sidebar.style, {
    position: 'fixed',
    top: '0',
    right: '0',
    bottom: '0',
    width: '350px',
    backgroundColor: '#1e1e1e',
    borderLeft: '1px solid #444',
    zIndex: '2147483647',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-2px 0 5px rgba(0,0,0,0.8)'
  });
  const header = document.createElement('div');
  header.id = 'llogos-chat-header';
  Object.assign(header.style, {
    flex: '0 0 auto',
    padding: '8px',
    background: '#333',
    borderBottom: '1px solid #444',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  });
  const title = document.createElement('div');
  title.id = 'llogos-chat-title';
  title.textContent = 'Chat';
  title.style.fontWeight = 'bold';
  const closeBtn = document.createElement('button');
  closeBtn.id = 'llogos-chat-close';
  closeBtn.textContent = '✖';
  Object.assign(closeBtn.style, {
    background: 'none',
    border: 'none',
    color: '#eee',
    fontSize: '16px',
    cursor: 'pointer'
  });
  closeBtn.addEventListener('click', () => sidebar.remove());
  header.appendChild(title);
  header.appendChild(closeBtn);
  sidebar.appendChild(header);
  const messagesContainer = document.createElement('div');
  messagesContainer.id = 'llogos-chat-messages';
  Object.assign(messagesContainer.style, {
    flex: '1 1 auto',
    padding: '8px',
    overflowY: 'auto',
    color: '#eee'
  });

  const initialMsg = document.createElement('div');
  initialMsg.id = 'llogos-chat-initial-message';
  Object.assign(initialMsg.style, {
    marginBottom: '8px',
    color: '#ccc',
    fontStyle: 'italic'
  });
  initialMsg.textContent = "Describe the update you'd like to make to this site";
  messagesContainer.appendChild(initialMsg);
  sidebar.appendChild(messagesContainer);
  const inputContainer = document.createElement('div');
  inputContainer.id = 'llogos-chat-input-container';
  Object.assign(inputContainer.style, {
    flex: '0 0 auto',
    padding: '8px',
    borderTop: '1px solid #444',
    display: 'flex'
  });
  const input = document.createElement('textarea');
  input.id = 'llogos-chat-input';
  input.rows = 2;
  input.placeholder = 'Ask about modifications...';
  Object.assign(input.style, {
    flex: '1',
    resize: 'none',
    backgroundColor: '#2e2e2e',
    border: '1px solid #444',
    color: '#eee',
    padding: '4px',
    borderRadius: '4px'
  });
  const sendBtn = document.createElement('button');
  sendBtn.id = 'llogos-chat-send';
  sendBtn.textContent = 'Send';
  Object.assign(sendBtn.style, {
    marginLeft: '4px',
    backgroundColor: '#333',
    border: 'none',
    color: '#eee',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer'
  });
  sendBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    addMessageToContainer('You', text);
    input.value = '';
    chrome.runtime.sendMessage({ type: 'chat-message', prompt: text });
  });
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendBtn.click();
    }
  });
  inputContainer.appendChild(input);
  inputContainer.appendChild(sendBtn);
  sidebar.appendChild(inputContainer);
  document.body.appendChild(sidebar);
}

function addMessageToContainer(sender, text, isError) {
  const container = document.getElementById('llogos-chat-messages');
  if (!container) return;
  const msgDiv = document.createElement('div');
  Object.assign(msgDiv.style, { marginBottom: '8px' });
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

function generateSelector(el) {
  const tag = el.tagName.toLowerCase();
  const classString = el.className ? '.' + el.className.trim().replace(/\s+/g, '.') : '';
  return `${tag}${classString}`;
}

if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'start-inspect') {
      inspectMode();
    } else if (msg.type === 'inject-userscript' && msg.script) {
      const s = document.createElement('script');
      s.textContent = msg.script;
      (document.head || document.documentElement).appendChild(s);
      s.remove();
      showLLMResponse(msg.script);
    } else if (msg.type === 'open-chat') {
      openChatSidebar();
    } else if (msg.type === 'chat-response') {
      if (msg.error) {
        addMessageToContainer('Error', msg.error, true);
      } else {
        addMessageToContainer('AI', msg.response);
      }
    }
  });
}

if (typeof module !== 'undefined') {
  module.exports = { generateSelector };
}
