const selected = [];

function highlight(el) {
  if (!selected.includes(el)) {
    el.classList.add('highlight');
    selected.push(el);
  }
}

function clearSelection() {
  selected.forEach(el => el.classList.remove('highlight'));
  selected.length = 0;
}

function simulateLLMAction() {
  selected.forEach(el => {
    el.style.textAlign = 'left';
    el.style.backgroundColor = '#d6f5d6';
    el.textContent += ' (Left aligned)';
  });
}

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => highlight(card));
});
