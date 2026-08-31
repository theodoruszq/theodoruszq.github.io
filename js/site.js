(() => {
  // Preserve bookmarks to the first version's homepage sections.
  const legacySections = { '#blogs': '/posts/', '#creations': '/creations/' };
  if (['/', '/index.html'].includes(location.pathname) && Object.hasOwn(legacySections, location.hash)) {
    location.replace(legacySections[location.hash]);
    return;
  }

  const messages = {
    zh: {
      about: '关于我', blogs: '博客', creations: '作品',
      recentBlogs: '最近的文章', recentCreations: '最近的作品',
      skip: '跳到正文', navigation: '主要导航', language: '界面语言',
      chooseChinese: '使用中文界面', chooseEnglish: 'Use English interface',
      email: '邮箱', readMore: '阅读全文', story: '制作记录',
      readArticle: '阅读：', backBlogs: '← 返回博客', postNavigation: '文章导航',
      originalPost: '最初发布于 WordPress', watchVideo: '在 YouTube 观看视频',
      blogDescription: '一些日常、想法和折腾的记录。',
      creationDescription: '为了自己用，也为了做出来的那一点开心。',
      hello: '他叫 Zhou Qiang，一名 AI 时代的观察者与试验者。他在ByteDance工作了几年，是一名算法工程师，参与过有趣的、无趣的、成功的、失败的几个或大或小的项目。',
      interests: '最近，他在驱动一些视觉生成模型的单点能力，也在探索 AI Agent 的可能性。',
      writing: '他希望通过不断尝试和创作，在这个快速变化的时代，留下属于自己的几个脚印。',
      family: '哦，他还有一个幸福的小家，和一个可爱的好大儿。',
      portrait: 'Zhou Qiang 和儿子的像素风合影', personalProject: '个人项目',
      inspired: '布局参考', notFound: '这个页面不在这里了。', home: '返回首页',
      counterLabel: '全站浏览', counterLoading: '',
      counterUnavailable: ' · 暂不可用',
      counterPrivate: ' · 已尊重浏览器隐私偏好',
      counterNotice: '由不蒜子提供累计浏览次数，并非独立访客数。正式站点会向统计服务发送站点域名；服务也会接收到访问者的 IP 和浏览器信息。',
    },
    en: {
      about: 'About', blogs: 'Blogs', creations: 'Creations',
      recentBlogs: 'Recent blogs', recentCreations: 'Recent creations',
      skip: 'Skip to content', navigation: 'Main navigation', language: 'Interface language',
      chooseChinese: '使用中文界面', chooseEnglish: 'Use English interface',
      email: 'Email', readMore: 'Read more', story: 'Making of',
      readArticle: 'Read: ', backBlogs: '← Blogs', postNavigation: 'Article navigation',
      originalPost: 'Originally published on WordPress', watchVideo: 'Watch on YouTube',
      blogDescription: 'Notes on everyday life, ideas, and things I tinker with.',
      creationDescription: 'Things made for myself, and for the joy of making them.',
      hello: 'He is Qiang Zhou, an observer and experimenter in the age of AI. He has spent a few years at ByteDance as an algorithm engineer, working on projects big and small: some interesting, some dull, some successful, some unsuccessful.',
      interests: 'Lately, he has been working on a few modest, narrowly focused capabilities of visual generation models, while also exploring the possibilities of AI agents.',
      writing: 'Through continued experimentation and creation, he hopes to leave a few footprints of his own in this rapidly changing world.',
      family: 'Oh, and he has a happy little family, with a sweet boy.',
      portrait: 'Pixel-art portrait of Qiang Zhou and his son', personalProject: 'Personal project',
      inspired: 'Layout inspired by', notFound: "This page isn't here anymore.", home: 'Back home',
      counterLabel: 'Site views', counterLoading: '',
      counterUnavailable: ' · Unavailable',
      counterPrivate: ' · Browser privacy preference respected',
      counterNotice: 'Cumulative page views provided by Busuanzi, not unique visitors. On the live site, the service receives the site domain, along with the visitor IP address and browser information.',
    },
  };

  const preferenceKey = 'digital-reality.language';
  const supported = (value) => value === 'zh' || value === 'en';
  function preferredLanguage() {
    try {
      const saved = localStorage.getItem(preferenceKey);
      if (supported(saved)) return saved;
    } catch { /* The switch still works if storage is unavailable. */ }
    return 'en';
  }

  // A direct article URL selects that translation, even if a different UI preference is saved.
  let locale = supported(document.body.dataset.contentLocale) ? document.body.dataset.contentLocale : preferredLanguage();
  let viewCount = null;
  let counterState = 'counterLoading';
  const counter = document.querySelector('[data-visit-count]');
  const counterNote = document.querySelector('[data-counter-note]');

  function renderCounter() {
    if (!counter) return;
    counter.textContent = viewCount === null ? '—' : new Intl.NumberFormat(locale).format(viewCount);
    counterNote.textContent = counterState ? messages[locale][counterState] : '';
  }

  function applyLanguage(language) {
    locale = language;
    document.documentElement.lang = language === 'zh' ? 'zh-Hans' : 'en';
    for (const node of document.querySelectorAll('[data-text-zh][data-text-en]')) {
      node.textContent = node.getAttribute(`data-text-${language}`);
      node.lang = document.documentElement.lang;
    }
    for (const node of document.querySelectorAll('[data-content-zh][data-content-en]')) {
      node.setAttribute('content', node.getAttribute(`data-content-${language}`));
    }
    for (const node of document.querySelectorAll('[data-href-zh][data-href-en]')) {
      node.setAttribute('href', node.getAttribute(`data-href-${language}`));
    }
    for (const node of document.querySelectorAll('[data-content-entry]')) node.lang = document.documentElement.lang;
    // Both article bodies are static HTML. Switching does not fetch or count another page view.
    const translations = document.querySelectorAll('[data-translation]');
    for (const translation of translations) {
      translation.hidden = translation.dataset.translation !== language;
      for (const anchor of translation.querySelectorAll('[data-anchor-id]')) {
        anchor.id = translation.hidden ? `${translation.dataset.translation}--${anchor.dataset.anchorId}` : anchor.dataset.anchorId;
      }
    }
    if (translations.length) {
      const path = document.body.getAttribute(`data-url-${language}`);
      if (path && location.pathname !== path) history.replaceState(null, '', path + location.search + location.hash);
      document.body.dataset.contentLocale = language;
    }
    for (const link of document.querySelectorAll('a[href], link[type="application/rss+xml"]')) {
      if (link.hasAttribute('data-locale')) continue;
      const href = link.getAttribute('href');
      const post = href.match(/^\/(?:en\/)?posts\/([a-z0-9_-]+)\/$/);
      if (post) link.setAttribute('href', `${language === 'en' ? '/en' : ''}/posts/${post[1]}/`);
      if (/^\/(posts\/)?index(\.en)?\.xml$/.test(href)) link.setAttribute('href', href.replace(/index(\.en)?\.xml$/, `index${language === 'en' ? '.en' : ''}.xml`));
    }
    for (const node of document.querySelectorAll('[data-i18n]')) {
      const value = messages[locale][node.dataset.i18n];
      if (value !== undefined) {
        node.textContent = value;
        node.lang = document.documentElement.lang;
      }
    }
    for (const attribute of ['aria-label', 'title', 'alt']) {
      for (const node of document.querySelectorAll(`[data-i18n-${attribute}]`)) {
        const key = node.getAttribute(`data-i18n-${attribute}`);
        if (messages[locale][key] !== undefined) node.setAttribute(attribute, messages[locale][key]);
      }
    }
    for (const node of document.querySelectorAll('[data-article-title]')) {
      node.setAttribute('aria-label', messages[locale].readArticle + node.dataset.articleTitle);
    }
    for (const node of document.querySelectorAll('[data-ui-date]')) {
      const date = new Date(`${node.getAttribute('datetime')}T00:00:00Z`);
      if (!Number.isNaN(date.getTime())) {
        node.textContent = new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
          year: 'numeric', month: locale === 'zh' ? 'long' : 'short', day: 'numeric', timeZone: 'UTC',
        }).format(date);
        node.lang = document.documentElement.lang;
      }
    }
    for (const node of document.querySelectorAll('[data-reading-minutes]')) {
      node.textContent = locale === 'zh' ? `${node.dataset.readingMinutes} 分钟` : `${node.dataset.readingMinutes} min read`;
      node.lang = document.documentElement.lang;
    }
    for (const button of document.querySelectorAll('[data-locale]')) {
      if (button.tagName === 'A') {
        if (button.dataset.locale === locale) button.setAttribute('aria-current', 'true');
        else button.removeAttribute('aria-current');
      } else button.setAttribute('aria-pressed', String(button.dataset.locale === locale));
    }
    const page = document.body.dataset.page;
    if (page === 'blogs' || page === 'creations') document.title = `${messages[locale][page]} · Digital Reality`;
    if (page === 'notFound') document.title = locale === 'zh' ? '页面未找到 · Digital Reality' : 'Page not found · Digital Reality';
    renderCounter();
  }

  for (const button of document.querySelectorAll('[data-locale]')) {
    button.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0) return;
      const language = button.dataset.locale;
      if (!supported(language)) return;
      event.preventDefault();
      try { localStorage.setItem(preferenceKey, language); } catch { /* Session-only fallback. */ }
      applyLanguage(language);
    });
  }
  applyLanguage(locale);
  for (const control of document.querySelectorAll('.language-switch')) control.hidden = false;

  // Only the live GitHub Pages origin can increment the shared counter.
  // No visitor token, cookies, article path, URL query, or fragment is sent.
  async function loadCounter() {
    if (!counter) return;
    if (location.origin !== 'https://theodoruszq.github.io') {
      counterState = '';
      renderCounter();
      return;
    }
    if (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true) {
      counterState = 'counterPrivate';
      renderCounter();
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    try {
      const response = await fetch('https://busuanzi.9420.ltd/api', {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        headers: { 'x-bsz-referer': 'https://theodoruszq.github.io/' },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Counter unavailable');
      const result = await response.json();
      const count = result?.data?.site_pv;
      if (result.success !== true || !Number.isSafeInteger(count) || count < 0) throw new Error('Invalid count');
      viewCount = count;
      counterState = '';
    } catch {
      counterState = 'counterUnavailable';
    } finally {
      clearTimeout(timeout);
      renderCounter();
    }
  }

  // Start once per page load, never on language switches or speculative prerenders.
  if (document.prerendering) document.addEventListener('prerenderingchange', loadCounter, { once: true });
  else loadCounter();
})();
