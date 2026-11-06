
document.addEventListener('DOMContentLoaded', () => {
    const BREAKPOINT = 768;
    const isMobile = window.innerWidth <= BREAKPOINT;
    const body = document.body;
    const html = document.documentElement;

    // 1. MENU (tablet and phone): panel under the header with the page dimmed behind it.
    // Closes with the toggle, Escape, a tap outside, or choosing a link; focus stays inside while open.
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('mnav');
    if (toggle && menu) {
        const panel = menu.querySelector('.mnav-panel');
        const focusables = () => [toggle, ...panel.querySelectorAll('a, button')].filter(el => el.offsetParent !== null);
        const label = (key) => (window.I18N ? window.I18N.t(key) : key);

        const setOpen = (open) => {
            const header = document.querySelector('header');
            if (open) {
                menu.style.setProperty('--mnav-top', `${Math.max(0, header.getBoundingClientRect().bottom)}px`);
                menu.hidden = false;
                requestAnimationFrame(() => menu.classList.add('is-open'));
                html.classList.add('mnav-locked');
                setTimeout(() => panel.querySelector('a')?.focus({ preventScroll: true }), 50);
            } else {
                menu.classList.remove('is-open');
                html.classList.remove('mnav-locked');
                setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 260);
            }
            toggle.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', label(open ? 'Close menu' : 'Open menu'));
        };
        const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

        toggle.addEventListener('click', () => setOpen(!isOpen()));
        menu.addEventListener('click', (e) => {
            if (e.target.closest('[data-mnav-close]') || e.target.closest('.mnav-links a')) setOpen(false);
        });
        document.addEventListener('keydown', (e) => {
            if (!isOpen()) return;
            if (e.key === 'Escape') {
                setOpen(false);
                toggle.focus();
            } else if (e.key === 'Tab') {
                const items = focusables();
                const first = items[0];
                const last = items[items.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        });
        // Back to the desktop layout: close the panel
        window.matchMedia('(min-width: 1101px)').addEventListener('change', (e) => { if (e.matches && isOpen()) setOpen(false); });
    }

    // 2. THEME ENGINE 
    const syncThemeClasses = (isLight) => {
        html.classList.toggle('light-theme', isLight);
        body.classList.toggle('light-theme', isLight);
    };

    const updateUI = (isInitialLoad = false) => {
        const isLight = body.classList.contains('light-theme');
        
        document.querySelectorAll('.mode-text').forEach(label => {
            label.textContent = isLight ? 'LIGHT' : 'NIGHT';
        });

        const descText = isLight 
            ? "Most of my mornings start the same way: a decent cup of coffee and a bit of quiet before the day gets busy. I spend my time building things that actually work by turning messy ideas into something clean and usable."
            : "There's something about the environment being quiet that makes it easier to focus. I usually do my best work at night — just me, a keyboard, and enough coffee to finally figure out a solution.";
        
        const quoteText = isLight
            ? "“One coffee at a time, one problem solved at a time.”"
            : "“The best ideas usually show up when everyone else is asleep.”";

        const description = document.querySelector('.descriptionHome');
        const quote = document.querySelector('.quote');

        if (isInitialLoad) {
            if (description) description.textContent = descText;
            if (quote) quote.textContent = quoteText;
        } else {
            fadeAndSwap(description, descText);
            fadeAndSwap(quote, quoteText);
        }
    };

    const fadeAndSwap = (element, newText) => {
        if (!element) return;
        element.style.opacity = '0';
        setTimeout(() => {
            element.textContent = newText;
            element.style.opacity = '1';
        }, 400);
    };

    const initTheme = () => {
        const savedTheme = sessionStorage.getItem('selectedTheme');
        const isManual = sessionStorage.getItem('themeManualOverride') === 'true';

        if (isManual && savedTheme) {
            syncThemeClasses(savedTheme === 'light-theme');
        } else {
            const hour = new Date().getHours();
            syncThemeClasses(hour >= 6 && hour < 18);
        }
        updateUI(true);
    };

    // Theme Toggle Listener
    document.addEventListener('click', (e) => {
        const themeBtn = e.target.closest('#theme-toggle, #sidebar-theme-toggle, #mnav-theme, .mode-text');
        if (themeBtn) {
            const isNextLight = !body.classList.contains('light-theme');
            syncThemeClasses(isNextLight);
            sessionStorage.setItem('themeManualOverride', 'true');
            sessionStorage.setItem('selectedTheme', isNextLight ? 'light-theme' : 'dark-theme');
            updateUI(false);
        }
    });

    // Deep links like about.html#Badges: scroll once layout has settled, leaving room for the header
    const scrollToHash = () => {
        if (!window.location.hash) return;
        const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
        if (!target) return;
        const headerOffset = isMobile ? 80 : 140;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerOffset, behavior: 'instant' });
    };
    window.addEventListener('load', scrollToHash);

    initTheme();

    // Header: stays at the top, slides away while scrolling down and returns on the way up.
    // --hdr-offset tells other sticky bars how much room the visible header takes.
    const siteHeader = document.querySelector('header');
    if (siteHeader) {
        let lastY = window.scrollY;
        let ticking = false;
        const setOffset = (shown) => html.style.setProperty('--hdr-offset', shown ? `${(parseFloat(getComputedStyle(siteHeader).top) || 0) + siteHeader.offsetHeight}px` : '0px');
        const update = () => {
            const y = window.scrollY;
            const menuOpen = html.classList.contains('mnav-locked');
            const hide = !menuOpen && y > siteHeader.offsetHeight * 2 && y > lastY + 2;
            const show = menuOpen || y < lastY - 2 || y <= siteHeader.offsetHeight;
            if (hide) siteHeader.classList.add('is-hidden');
            else if (show) siteHeader.classList.remove('is-hidden');
            siteHeader.classList.toggle('is-scrolled', y > 8);
            setOffset(!siteHeader.classList.contains('is-hidden') && y > 0);
            lastY = y;
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        // Keyboard users tabbing into the header always get it back
        siteHeader.addEventListener('focusin', () => siteHeader.classList.remove('is-hidden'));
        update();
    }

    const pageWrapper = document.querySelector('.page-wrapper');
    const header = document.querySelector('header');
    if (pageWrapper) pageWrapper.classList.add('animate-trigger');
    if (header) header.classList.add('animate-trigger');
});


// Background parallax and cursor glow (desktop only). The loop runs only while the pointer moves,
// so an idle page does no work.
if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const bodyRef = document.body;
    let tX = 0, tY = 0, cX = 0, cY = 0, mouseX = 0, mouseY = 0, frame = null;

    const step = () => {
        cX += (tX - cX) * 0.12;
        cY += (tY - cY) * 0.12;
        bodyRef.style.setProperty('--mouse-x', `${mouseX}px`);
        bodyRef.style.setProperty('--mouse-y', `${mouseY}px`);
        bodyRef.style.setProperty('--parallax-x', `${cX.toFixed(2)}px`);
        bodyRef.style.setProperty('--parallax-y', `${cY.toFixed(2)}px`);
        const settling = Math.abs(tX - cX) > 0.05 || Math.abs(tY - cY) > 0.05;
        frame = settling ? requestAnimationFrame(step) : null;
    };

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        tX = (e.clientX / window.innerWidth - 0.5) * 16;
        tY = (e.clientY / window.innerHeight - 0.5) * 8;
        if (!frame) frame = requestAnimationFrame(step);
    }, { passive: true });
}