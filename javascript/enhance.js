// Shared progressive enhancements: scroll progress, back-to-top, scroll reveal,
// count-up stats, gallery lightbox and copy-to-clipboard. Loaded with `defer` on every page.
(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const body = document.body;

    if (document.getElementById('mobile-bottom-nav')) body.classList.add('has-pill-nav');

    // 1. Scroll progress (blog posts already have their own reading bar)
    if (!document.querySelector('.progress-container')) {
        const bar = document.createElement('div');
        bar.className = 'scroll-progress';
        bar.setAttribute('aria-hidden', 'true');
        body.appendChild(bar);

        const update = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
        };
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update, { passive: true });
        update();
    }

    // 2. Back to top
    const toTop = document.createElement('button');
    toTop.className = 'back-to-top';
    toTop.type = 'button';
    toTop.setAttribute('aria-label', 'Back to top');
    toTop.innerHTML = '&#8593;';
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
    body.appendChild(toTop);
    const toggleTop = () => toTop.classList.toggle('is-shown', window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', toggleTop, { passive: true });
    toggleTop();

    // 3. Scroll reveal for explicit [data-reveal] elements plus common blocks on pages
    //    that have no entrance animations of their own (About and Projects animate themselves)
    const AUTO_REVEAL = [
        '.home-panel', '.home-section .project-card', '.section-more',
        '.project-meta', '.video-wrapper', '.gallery-item', '.details-card', '.action-bar', '.project-navigation',
        '.sidebar-card', '.resume-section', '.objective', '.download-section',
        '.blog-card',
        '.social-item', '.featured-testimonial', '.thumbnails', '#contact-form'
    ];
    if (!reduceMotion && 'IntersectionObserver' in window) {
        const targets = new Set(document.querySelectorAll('[data-reveal]'));
        AUTO_REVEAL.forEach(sel => document.querySelectorAll(sel).forEach(el => targets.add(el)));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

        targets.forEach(el => {
            // Stagger siblings that reveal together
            const siblings = el.parentElement ? [...el.parentElement.children].filter(c => targets.has(c)) : [];
            const index = Math.min(siblings.indexOf(el), 3);
            if (index > 0) el.style.setProperty('--reveal-delay', `${index * 60}ms`);
            el.classList.add('reveal');
            observer.observe(el);
        });
    }

    // 4. Count-up numbers: <span data-count="15" data-suffix="+">15+</span>
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
        const run = (el) => {
            const end = Number(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            const start = performance.now();
            const DURATION = 1200;
            const tick = (now) => {
                const p = Math.min((now - start) / DURATION, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(end * eased) + suffix;
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                run(entry.target);
                countObserver.unobserve(entry.target);
            });
        }, { threshold: 0.6 });
        counters.forEach(el => countObserver.observe(el));
    }

    // 5. Lightbox for project galleries
    const galleries = document.querySelectorAll('[data-lightbox], .gallery-grid');
    if (galleries.length) {
        const box = document.createElement('div');
        box.className = 'sj-lightbox';
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-modal', 'true');
        box.setAttribute('aria-label', 'Image viewer');
        box.innerHTML = `
            <img alt="">
            <button type="button" class="lb-close" aria-label="Close">&times;</button>
            <button type="button" class="lb-prev" aria-label="Previous image">&#8249;</button>
            <button type="button" class="lb-next" aria-label="Next image">&#8250;</button>
            <span class="lb-count"></span>`;
        body.appendChild(box);
        const img = box.querySelector('img');
        const count = box.querySelector('.lb-count');
        let images = [];
        let current = 0;
        let opener = null;

        const show = (i) => {
            current = (i + images.length) % images.length;
            // Always the full-size original (src), not the smaller copy picked for the card (currentSrc)
            img.src = images[current].src;
            img.alt = images[current].alt;
            count.textContent = `${current + 1} / ${images.length}`;
            box.querySelector('.lb-prev').hidden = box.querySelector('.lb-next').hidden = images.length < 2;
        };
        const open = (list, i, trigger) => {
            images = list;
            opener = trigger;
            show(i);
            box.classList.add('is-open');
            document.documentElement.style.overflow = 'hidden';
            box.querySelector('.lb-close').focus();
        };
        const close = () => {
            box.classList.remove('is-open');
            document.documentElement.style.overflow = '';
            if (opener) opener.focus();
        };

        galleries.forEach(gallery => {
            const list = [...gallery.querySelectorAll('img')];
            list.forEach((im, i) => {
                im.classList.add('is-zoomable');
                im.setAttribute('tabindex', '0');
                im.setAttribute('role', 'button');
                im.addEventListener('click', () => open(list, i, im));
                im.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(list, i, im); }
                });
            });
        });
        box.querySelector('.lb-close').addEventListener('click', close);
        box.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
        box.querySelector('.lb-next').addEventListener('click', () => show(current + 1));
        box.addEventListener('click', (e) => { if (e.target === box) close(); });
        window.addEventListener('keydown', (e) => {
            if (!box.classList.contains('is-open')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowRight') show(current + 1);
            if (e.key === 'ArrowLeft') show(current - 1);
        });
    }

    // 6. Demo videos (<video data-autoplay preload="none">): play only while visible on larger screens.
    //    Phones, data-saver and reduced-motion users get the poster and tap to play, so nothing downloads up front.
    const demoVideos = document.querySelectorAll('video[data-autoplay]');
    const saveData = navigator.connection && navigator.connection.saveData;
    if (demoVideos.length && window.innerWidth > 768 && !saveData && !reduceMotion && 'IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.play().catch(() => {});
                else entry.target.pause();
            });
        }, { threshold: 0.4 });
        demoVideos.forEach(video => videoObserver.observe(video));
    }

    // 7. Copy to clipboard: <button data-copy="text">
    document.querySelectorAll('[data-copy]').forEach(btn => {
        const label = btn.textContent;
        btn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(btn.dataset.copy);
                btn.textContent = 'Copied!';
            } catch (e) {
                window.location.href = `mailto:${btn.dataset.copy}`;
                return;
            }
            btn.classList.add('is-copied');
            setTimeout(() => { btn.textContent = label; btn.classList.remove('is-copied'); }, 1800);
        });
    });
})();
