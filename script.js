(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const languageToggle = document.getElementById('languageToggle');
  const header = document.querySelector('.site-header');
  const showMoreButton = document.getElementById('showMorePublications');
  const conferenceList = document.querySelector('.conference-list');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const backToTop = document.getElementById('backToTop');

  const storedTheme = localStorage.getItem('yubin-site-theme');
  const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (preferredDark ? 'dark' : 'light');
  root.dataset.theme = initialTheme;
  updateThemeLabel(initialTheme);

  const storedLanguage = localStorage.getItem('yubin-site-language') || 'en';
  setLanguage(storedLanguage);

  themeToggle?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;
    localStorage.setItem('yubin-site-theme', nextTheme);
    updateThemeLabel(nextTheme);
  });

  languageToggle?.addEventListener('click', () => {
    const nextLanguage = root.lang === 'ko' ? 'en' : 'ko';
    setLanguage(nextLanguage);
    localStorage.setItem('yubin-site-language', nextLanguage);
  });

  function setLanguage(language) {
    root.lang = language;
    if (languageToggle) {
      languageToggle.textContent = language === 'ko' ? 'English' : '한국어';
      languageToggle.setAttribute('aria-label', language === 'ko' ? '영어로 전환' : '한국어로 전환');
      languageToggle.setAttribute('title', language === 'ko' ? '영어로 전환' : '한국어로 전환');
    }
    document.title = language === 'ko' ? '김유빈 | 연구 포트폴리오' : 'Yubin Kim | Research Portfolio';
  }

  function updateThemeLabel(theme) {
    const isDark = theme === 'dark';
    themeToggle?.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    if (themeMeta) themeMeta.setAttribute('content', isDark ? '#0d111b' : '#f5f7fb');
  }

  showMoreButton?.addEventListener('click', () => {
    const expanded = conferenceList?.classList.toggle('expanded') ?? false;
    const enLabel = showMoreButton.querySelector('.lang-en');
    const koLabel = showMoreButton.querySelector('.lang-ko');
    if (enLabel) enLabel.textContent = expanded ? 'Show fewer presentations ↑' : 'Show all presentations ↓';
    if (koLabel) koLabel.textContent = expanded ? '발표 접기 ↑' : '발표 전체 보기 ↓';
    showMoreButton.setAttribute('aria-expanded', String(expanded));
  });


  backToTop?.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

    const sections = [...document.querySelectorAll('main section[id]')];
    const navLinks = [...document.querySelectorAll('[data-nav]')];
    const activeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.toggle('active', link.dataset.nav === entry.target.id));
        }
      });
    }, { rootMargin: '-28% 0px -62% 0px', threshold: 0 });
    sections.forEach((section) => activeObserver.observe(section));
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
  }

  window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 8), { passive: true });
  const currentYear = document.getElementById('currentYear');
  if (currentYear) currentYear.textContent = new Date().getFullYear();
})();
