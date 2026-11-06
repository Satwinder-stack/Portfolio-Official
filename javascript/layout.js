// Shared page chrome (home intro, header, footer) written once and reused by every page.
// Include it synchronously as the first thing in <body>:
//     <script src="../javascript/layout.js"></script>
// and call SiteLayout.footer() from an inline script where the footer belongs.
(function () {
    const script = document.currentScript;
    const root = script.getAttribute('src').replace(/javascript\/layout\.js$/, '');
    const page = (file) => `${root}pages/${file}`;
    const img = (file) => `${root}images/${file}`;
    const html = document.documentElement;

    // Mirror the <html> theme class onto <body> before any content renders
    if (html.classList.contains('light-theme')) {
        document.body.classList.add('light-theme');
    }

    // Language options keep their own names (lang/translate="no") so they read the same in every language
    const pageLang = html.getAttribute('lang') || 'en';
    const langOption = (code, label) =>
        `<option value="${code}" lang="${code}"${pageLang === code ? ' selected' : ''}>${label}</option>`;

    const current = window.location.pathname.split('/').pop() || 'index.html';
    const navLink = (file, label) => {
        const active = current === file ? ' aria-current="page"' : '';
        return `<a href="${page(file)}"${active}>${label}</a>`;
    };

    // Mobile / tablet menu: numbered links with a one-line description, and language buttons
    const mnavLink = (file, num, label, desc) => {
        const active = current === file ? ' aria-current="page"' : '';
        return `<li><a href="${page(file)}"${active}><span class="mnav-num">${num}</span><span class="mnav-text"><span class="mnav-label">${label}</span><span class="mnav-desc">${desc}</span></span></a></li>`;
    };
    const mnavLang = (code, label) =>
        `<button type="button" class="mnav-lang" data-lang="${code}" lang="${code}" aria-pressed="${pageLang === code}">${label}</button>`;

    // Short intro, shown once per session on the home page (theme-init.js sets html.intro-active).
    // The bar follows real loading: DOM ready, fonts ready, then window load.
    const INTRO_MIN_MS = 800;
    const INTRO_MAX_MS = 2200;
    const intro = html.classList.contains('intro-active') ? `
<div id="intro" aria-hidden="true">
    <div class="intro-inner">
        <svg class="intro-mark" viewBox="0 0 64 64">
            <circle class="intro-ring" cx="32" cy="32" r="29"/>
            <text x="32" y="41" text-anchor="middle">SJ</text>
        </svg>
        <p class="intro-name">SATWINDER <span>JEERH</span></p>
        <p class="intro-role">Full-Stack Developer · IT Infrastructure · DevOps</p>
        <div class="intro-bar"><span></span></div>
    </div>
</div>` : '';

    const header = `
<header>
    <div class="brand">
        <a href="${root}index.html" aria-label="Home">
            <img src="${img('logo dark mode.webp')}" alt="Satwinder Jeerh logo" class="logo-dark" loading="lazy" decoding="async">
            <img src="${img('logo light mode.webp')}" alt="Satwinder Jeerh logo" class="logo-light" loading="lazy" decoding="async">
        </a>
    </div>

    <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mnav">
        <span class="mt-bars" aria-hidden="true"><span></span><span></span><span></span></span>
    </button>

    <nav id="main-nav" class="main-nav" aria-label="Main navigation">
        ${navLink('about.html', 'ABOUT')}
        ${navLink('projects.html', 'PROJECTS')}
        ${navLink('blog.html', 'BLOG')}
        ${navLink('resume.html', 'RESUME')}
        ${navLink('contact.html', 'CONTACT')}

        <button id="theme-toggle" class="theme-btn-rect" type="button">
            <svg class="hd-ico hd-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
            <svg class="hd-ico hd-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
            <span class="visually-hidden">Switch theme, current: </span><span class="mode-text">NIGHT</span>
        </button>

        <label class="lang-switch" translate="no">
            <span class="visually-hidden">Language</span>
            <svg class="lang-globe" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>
            <select class="lang-select">
                ${langOption('en', 'EN')}${langOption('fil', 'FIL')}${langOption('ja', '日本語')}
            </select>
        </label>
    </nav>
</header>
<div class="mnav" id="mnav" hidden>
    <div class="mnav-backdrop" data-mnav-close></div>
    <div class="mnav-panel" role="dialog" aria-modal="true" aria-label="Menu">
        <nav aria-label="Main navigation">
            <ol class="mnav-links">
                ${mnavLink('about.html', '01', 'ABOUT', 'Story, skills and recognition')}
                ${mnavLink('projects.html', '02', 'PROJECTS', 'Demos, case studies and team work')}
                ${mnavLink('blog.html', '03', 'BLOG', 'Notes on AI and development')}
                ${mnavLink('resume.html', '04', 'RESUME', 'Experience, education and certificates')}
                ${mnavLink('contact.html', '05', 'CONTACT', 'Send a message or find me online')}
            </ol>
        </nav>
        <div class="mnav-settings">
            <div class="mnav-setting">
                <span class="mnav-setting-label">Theme</span>
                <button type="button" class="mnav-theme" id="mnav-theme">
                    <svg class="mnav-ico mnav-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
                    <svg class="mnav-ico mnav-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
                    <span class="visually-hidden">Switch theme, current: </span><span class="mode-text">NIGHT</span>
                </button>
            </div>
            <div class="mnav-setting">
                <span class="mnav-setting-label">Language</span>
                <div class="mnav-langs" role="group" aria-label="Language" translate="no">
                    ${mnavLang('en', 'EN')}${mnavLang('fil', 'FIL')}${mnavLang('ja', '日本語')}
                </div>
            </div>
        </div>
        <div class="mnav-foot">
            <p class="mnav-status"><span class="mnav-dot" aria-hidden="true"></span>Open to opportunities & collaborations</p>
            <div class="mnav-contact">
                <a class="mnav-mail" href="mailto:it.satwinder.jeerh@gmail.com">it.satwinder.jeerh@gmail.com</a>
                <a class="mnav-social" href="https://github.com/Satwinder-stack" target="_blank" rel="noopener" aria-label="GitHub"><img src="${img('white github.webp')}" alt="" width="18" height="18"></a>
                <a class="mnav-social" href="https://www.linkedin.com/in/satwinder-jeerh-120331322" target="_blank" rel="noopener" aria-label="LinkedIn"><img src="${img('white linkedin.webp')}" alt="" width="18" height="18"></a>
            </div>
        </div>
    </div>
</div>`;

    const footer = `
<footer class="site-footer">
    <div class="ft-wrap">
        <div class="ft-brand">
            <a class="ft-name" href="${root}index.html">SATWINDER <span>JEERH</span></a>
            <p class="ft-role">Full-Stack Developer · IT Infrastructure · DevOps</p>
            <p class="ft-status"><span class="ft-dot" aria-hidden="true"></span>Open to opportunities & collaborations</p>
            <div class="ft-actions">
                <a class="ft-cta" href="${page('contact.html')}">Contact Me</a>
                <a class="ft-social" href="https://github.com/Satwinder-stack" target="_blank" rel="noopener" aria-label="GitHub">
                    <img src="${img('white github.webp')}" alt="" loading="lazy" width="18" height="18"/>
                </a>
                <a class="ft-social" href="https://www.linkedin.com/in/satwinder-jeerh-120331322" target="_blank" rel="noopener" aria-label="LinkedIn">
                    <img src="${img('white linkedin.webp')}" alt="" loading="lazy" width="18" height="18"/>
                </a>
                <a class="ft-social" href="mailto:it.satwinder.jeerh@gmail.com" aria-label="Email">
                    <img src="${img('white email.webp')}" alt="" loading="lazy" width="18" height="18"/>
                </a>
            </div>
        </div>

        <nav class="ft-nav" aria-label="Footer navigation">
            <div class="ft-group">
                <h2 class="ft-heading">ABOUT</h2>
                <ul>
                    <li><a href="${page('about.html#Header')}">Meet the Developer</a></li>
                    <li><a href="${page('about.html#Badges')}">Badges</a></li>
                    <li><a href="${page('about.html#Certificates')}">Certificates</a></li>
                    <li><a href="${page('about.html#Achievements')}">Achievements</a></li>
                </ul>
            </div>
            <div class="ft-group">
                <h2 class="ft-heading">PROJECTS</h2>
                <ul>
                    <li><a href="${page('projects.html#Featured')}">Project Video</a></li>
                    <li><a href="${page('projects.html#Projects')}">Project List</a></li>
                    <li><a href="${page('projects.html#Projects')}">Languages</a></li>
                    <li><a href="${page('projects.html#Collaborations')}">Collaborative Projects</a></li>
                </ul>
            </div>
            <div class="ft-group">
                <h2 class="ft-heading">BLOGS</h2>
                <ul>
                    <li><a href="${page('blogs/ai-stagnation.html')}">AI Stagnation</a></li>
                    <li><a href="${page('blogs/ai-tool-or-human.html')}">AI: Tool or human</a></li>
                    <li><a href="${page('blogs/ai-vs-traditional.html')}">AI vs Traditional</a></li>
                    <li><a href="${page('blogs/human-dependency.html')}">Human Dependency</a></li>
                </ul>
            </div>
            <div class="ft-group">
                <h2 class="ft-heading">RESUME</h2>
                <ul>
                    <li><a href="${page('resume.html#Objective')}">About me</a></li>
                    <li><a href="${page('resume.html')}">How to Contact</a></li>
                    <li><a href="${page('resume.html#Education')}">Education</a></li>
                    <li><a href="${page('resume.html#Experience')}">Experience</a></li>
                </ul>
            </div>
            <div class="ft-group">
                <h2 class="ft-heading">CONTACT</h2>
                <ul>
                    <li><a href="${page('contact.html#Socials')}">Phone No.</a></li>
                    <li><a href="${page('contact.html#Socials')}">Email</a></li>
                    <li><a href="${page('contact.html#Socials')}">Linkedin</a></li>
                    <li><a href="${page('contact.html#Testimonials')}">Testimonials</a></li>
                </ul>
            </div>
        </nav>
    </div>
    <div class="ft-bottom">
        <p>© 2026 Satwinder Jeerh</p>
        <p class="ft-built">
            <span class="ft-badges" aria-hidden="true">
                <img src="${img('html.webp')}" alt="" loading="lazy" width="16" height="16"/><img src="${img('css-3.webp')}" alt="" loading="lazy" width="16" height="16"/><img src="${img('js.webp')}" alt="" loading="lazy" width="16" height="16"/>
            </span>
            Built with HTML, CSS & JavaScript
        </p>
    </div>
</footer>`;

    script.insertAdjacentHTML('beforebegin', intro + header);

    // Language switcher: remember the choice and reload in that language
    document.querySelectorAll('.mnav-lang').forEach(btn => btn.addEventListener('click', () => {
        if (btn.dataset.lang === pageLang) return;
        try { localStorage.setItem('lang', btn.dataset.lang); } catch (e) {}
        window.location.reload();
    }));
    document.querySelectorAll('.lang-select').forEach(select => select.addEventListener('change', () => {
        try { localStorage.setItem('lang', select.value); } catch (e) {}
        window.location.reload();
    }));

    if (intro) {
        try { sessionStorage.setItem('hasSeenIntro', 'true'); } catch (e) {}
        const start = performance.now();
        const bar = document.querySelector('#intro .intro-bar span');
        let progress = 0;
        let finished = false;
        const advance = (value) => {
            progress = Math.max(progress, value);
            if (bar) bar.style.transform = `scaleX(${progress})`;
        };
        const finish = () => {
            if (finished) return;
            finished = true;
            advance(1);
            const wait = Math.max(0, INTRO_MIN_MS - (performance.now() - start)) + 250;
            setTimeout(() => {
                const el = document.getElementById('intro');
                html.classList.remove('intro-active');
                html.classList.add('intro-finished');
                if (!el) return;
                el.classList.add('intro-done');
                setTimeout(() => el.remove(), 700);
            }, wait);
        };

        requestAnimationFrame(() => advance(0.2));
        document.addEventListener('DOMContentLoaded', () => advance(0.55));
        if (document.fonts) document.fonts.ready.then(() => advance(0.8));
        window.addEventListener('load', finish);
        setTimeout(finish, INTRO_MAX_MS);
    }

    window.SiteLayout = {
        footer() {
            document.currentScript.insertAdjacentHTML('beforebegin', footer);
        }
    };
})();
