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
      visitorMap: '访客分布地图',
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
      visitorMap: 'Visitor map',
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

  // ---- Visitor world map ----
  // A 90x45 dot grid (4° cells) run-length encoded per row as `<count><0|1>` tokens
  // separated by commas; rows separated by semicolons. Data is local, no request.
  const WORLD_MAP = '90x45:900;900;210,61,10,131,90,21,160,21,200;140,11,10,11,20,21,90,101,200,21,60,51,60,21,90;140,51,10,11,10,41,50,81,190,11,30,11,10,131,30,21,80;10,511,30,11,10,11,50,11,260;50,201,20,21,30,31,40,21,60,31,10,391;30,51,10,121,50,21,180,41,20,321,10,11,40;120,111,30,41,170,21,10,291,50,21,40;130,181,130,11,10,351,30,11,50;140,151,10,21,120,371,90;140,151,160,31,10,31,30,21,10,211,10,11,90;140,121,170,21,50,11,10,51,10,191,130;150,111,190,31,60,211,40,11,100;160,91,180,61,10,11,30,211,150;160,51,30,11,170,151,10,171,150;170,41,200,131,10,41,30,121,160;190,21,10,11,180,131,10,41,40,41,10,51,170;210,31,170,141,10,21,50,21,40,31,180;230,11,30,11,130,151,80,11,60,11,180;250,51,120,161,180,11,130;260,61,150,101,120,21,20,11,160;250,71,150,91,140,11,10,21,160;250,101,130,71,200,11,30,21,90;250,111,120,71,180,11,50,31,80;260,101,120,71,230,11,10,11,90;260,91,130,71,10,11,190,31,10,11,90;270,81,130,61,20,11,180,71,80;270,61,160,51,20,11,160,101,70;270,61,160,41,210,91,70;270,51,180,21,220,31,10,51,70;270,41,490,31,50,11,10;270,21,610;270,21,580,11,20;260,31,610;260,21,620;900;900;900;280,11,270,61,30,171,80;190,11,60,41,120,201,10,251,20;80,201,120,461,40;80,181,60,21,40,471,50;20,11,40,811,20;900';

  function decodeWorldMap(data) {
    const [dims, rows] = data.split(':');
    const [w, h] = dims.split('x').map(Number);
    const dots = [];
    rows.split(';').forEach((row, y) => {
      let x = 0;
      for (const token of row.split(',')) {
        const count = parseInt(token.slice(0, -1), 10);
        const land = token.endsWith('1');
        if (land) {
          for (let i = 0; i < count; i++) dots.push([x + i, y]);
        }
        x += count;
      }
    });
    return { w, h, dots };
  }

  // Start once per page load, never on language switches or speculative prerenders.
  const start = () => { loadCounter(); loadVisitorMap(); };
  if (document.prerendering) document.addEventListener('prerenderingchange', start, { once: true });
  else start();

  async function loadVisitorMap() {
    const map = document.querySelector('[data-visitor-map]');
    if (!map) return;
    const svg = map.querySelector('svg');
    if (!svg) return;
    const ns = 'http://www.w3.org/2000/svg';
    for (const [x, y] of decodeWorldMap(WORLD_MAP).dots) {
      const dot = document.createElementNS(ns, 'circle');
      dot.setAttribute('cx', x + 0.5);
      dot.setAttribute('cy', y + 0.5);
      dot.setAttribute('r', 0.32);
      svg.appendChild(dot);
    }
    map.hidden = false;
    if (location.origin !== 'https://theodoruszq.github.io') return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    try {
      const response = await fetch(`https://ipwho.is/?lang=${locale === 'zh' ? 'zh-CN' : 'en'}`, {
        mode: 'cors',
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Geolocation unavailable');
      const geo = await response.json();
      if (geo.success !== true || !Number.isFinite(geo.latitude) || !Number.isFinite(geo.longitude)) throw new Error('Invalid geolocation');
      const marker = document.createElementNS(ns, 'circle');
      marker.setAttribute('class', 'visitor-marker');
      marker.setAttribute('cx', (geo.longitude + 180) / 4);
      marker.setAttribute('cy', (90 - geo.latitude) / 4);
      marker.setAttribute('r', 0.85);
      svg.appendChild(marker);
      const caption = map.querySelector('[data-visitor-caption]');
      if (caption) {
        const flag = geo.flag && geo.flag.emoji ? `${geo.flag.emoji} ` : '';
        caption.textContent = `${flag}${geo.country}${geo.city ? ' · ' + geo.city : ''}`;
      }
    } catch {
      // The map stays visible without a marker if geolocation is unavailable.
    } finally {
      clearTimeout(timeout);
    }
  }
})();
