// Loaded synchronously in <head> so the correct theme is applied before the first paint.
(function () {
    const html = document.documentElement;
    let isManual = false;
    let manualTheme = null;
    let hasSeenIntro = false;

    try {
        isManual = sessionStorage.getItem('themeManualOverride') === 'true';
        manualTheme = sessionStorage.getItem('selectedTheme');
        hasSeenIntro = sessionStorage.getItem('hasSeenIntro') === 'true';
    } catch (e) {}

    const hour = new Date().getHours();
    const autoTheme = hour >= 6 && hour < 18 ? 'light-theme' : 'dark-theme';
    const theme = isManual && manualTheme ? manualTheme : autoTheme;

    html.classList.add(theme);

    // The home page plays a short intro once per session (skipped for reduced-motion users)
    const file = window.location.pathname.split('/').pop();
    const isHome = file === '' || file === 'index.html';
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isHome && !hasSeenIntro && !reduceMotion) {
        html.classList.add('intro-active', 'has-intro');
    }

    // Language: saved choice, otherwise the browser's language on a first visit, otherwise English.
    // Filipino and Japanese load their dictionary synchronously so pages never flash in English.
    const LANGS = ['en', 'fil', 'ja'];
    let lang = null;
    try { lang = localStorage.getItem('lang'); } catch (e) {}
    if (!LANGS.includes(lang)) {
        const browser = (navigator.language || 'en').toLowerCase();
        lang = browser.startsWith('ja') ? 'ja' : (browser.startsWith('fil') || browser.startsWith('tl')) ? 'fil' : 'en';
    }
    html.setAttribute('lang', lang);
    if (lang !== 'en') {
        const root = document.currentScript.getAttribute('src').replace(/javascript\/theme-init\.js$/, '');
        html.classList.add('i18n-pending');
        document.write(`<script src="${root}i18n/${lang}.js"><\/script>`);
        // Safety net: never keep the page hidden if translation fails to run
        setTimeout(() => html.classList.remove('i18n-pending'), 2500);
    }
})();
