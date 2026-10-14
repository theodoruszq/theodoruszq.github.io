const buttons = document.querySelectorAll('[data-language]');
function setLanguage(language) {
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-Hans';
  buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
  document.title = language === 'en' ? 'QuickTranslate · Text & Screenshot Translation for Mac' : 'QuickTranslate · Mac 文字与截图翻译';
}
buttons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
setLanguage((navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en');
