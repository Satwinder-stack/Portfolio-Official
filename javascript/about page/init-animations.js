document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth < 768;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Type the hero name and role once, quickly. Everything else on the page is shown as-is.
    const nameH1 = document.querySelector('.hero-text h1');
    const roleH2 = document.querySelector('.hero-text h2');

    if (window.TypeEngine && nameH1 && !isMobile && !reduceMotion) {
        const nameText = nameH1.textContent.trim();
        const roleText = roleH2 ? roleH2.textContent.trim() : '';
        if (roleH2) roleH2.style.visibility = 'hidden';

        // Wait for the web font so the measured heights match the final text, then hold
        // each heading's full height while it types so nothing below shifts
        const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
        fontsReady.then(() => {
            [nameH1, roleH2].forEach(el => { if (el) el.style.minHeight = `${el.offsetHeight}px`; });
            window.TypeEngine.run(nameH1, nameText, 40, () => {
                if (!roleH2) return;
                roleH2.style.visibility = '';
                window.TypeEngine.run(roleH2, roleText, 16);
            });
        });
    }

    // Fade sections in the first time they scroll into view
    const fxObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('fx-visible');
            fxObserver.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.fx-reveal, .fx-rise').forEach(el => fxObserver.observe(el));
});
