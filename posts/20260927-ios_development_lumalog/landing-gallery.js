(() => {
  const triggers = [...document.querySelectorAll('.image-zoom')];
  const dialog = document.getElementById('image-viewer');
  if (!dialog || !triggers.length || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('.viewer-image');
  const frame = dialog.querySelector('.viewer-image-frame');
  let index = 0;
  let opener;
  let previousOverflow = '';
  let swipeStart;
  const labels = {
    zh: ['图片查看器', '点击放大图片', '上一张', '下一张', '关闭', '左右滑动或使用方向键切换 · Esc 关闭'],
    en: ['Image viewer', 'Enlarge image', 'Previous image', 'Next image', 'Close', 'Swipe or use arrow keys to browse · Esc to close']
  };
  function render() {
    const source = triggers[index].querySelector('img');
    image.src = source.src;
    image.alt = source.alt;
    dialog.querySelector('.viewer-caption').textContent = [...triggers[index].closest('figure').querySelector('figcaption').children].map(part => part.textContent).join(' · ');
    dialog.querySelector('.viewer-count').textContent = `${index + 1} / ${triggers.length}`;
  }
  function translate() {
    const copy = labels[document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'];
    dialog.setAttribute('aria-label', copy[0]);
    triggers.forEach(trigger => {
      trigger.setAttribute('aria-label', `${copy[1]}: ${trigger.querySelector('img').alt}`);
      trigger.querySelector('.zoom-label').textContent = copy[1];
    });
    ['.viewer-prev', '.viewer-next', '.viewer-close'].forEach((selector, i) => dialog.querySelector(selector).setAttribute('aria-label', copy[i + 2]));
    dialog.querySelector('.viewer-hint').textContent = copy[5];
    if (dialog.open) render();
  }
  function move(delta) {
    index = (index + delta + triggers.length) % triggers.length;
    render();
  }
  triggers.forEach((trigger, i) => trigger.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    index = i;
    opener = trigger;
    render();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    dialog.querySelector('.viewer-close').focus();
  }));
  dialog.querySelector('.viewer-prev').addEventListener('click', () => move(-1));
  dialog.querySelector('.viewer-next').addEventListener('click', () => move(1));
  dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    swipeStart = undefined;
    opener?.focus();
  });
  frame.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch') return;
    swipeStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    frame.setPointerCapture(event.pointerId);
  });
  frame.addEventListener('pointerup', event => {
    if (!swipeStart || swipeStart.id !== event.pointerId) return;
    const dx = event.clientX - swipeStart.x;
    const dy = event.clientY - swipeStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1);
    swipeStart = undefined;
  });
  frame.addEventListener('pointercancel', () => { swipeStart = undefined; });
  new MutationObserver(translate).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  translate();
})();
