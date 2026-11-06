document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    body.classList.add('ready');

    const isMobile = window.innerWidth <= 768;
    const FADE_MS = 200;
    const prefetched = new Set();

    const isInternalPage = (link) => {
        const href = link.getAttribute('href');
        if (!href || /^(tel:|mailto:|https?:|#)/.test(href) || link.target || link.hasAttribute('download')) return false;
        return /\.html(#.*)?$/.test(href);
    };

    // Warm the browser cache for a page as soon as the visitor shows intent (hover or touch)
    const prefetch = (link) => {
        const url = link.href.split('#')[0];
        if (prefetched.has(url) || url === window.location.href.split('#')[0]) return;
        prefetched.add(url);
        const hint = document.createElement('link');
        hint.rel = 'prefetch';
        hint.href = url;
        document.head.appendChild(hint);
    };

    // Restore visibility when the page comes back from the back/forward cache
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            body.classList.remove('page-leaving');
            document.querySelectorAll('.nav-progress').forEach(bar => bar.remove());
        }
    });

    document.querySelectorAll('a').forEach(link => {
        if (!isInternalPage(link)) return;

        link.addEventListener('mouseenter', () => prefetch(link), { passive: true });
        link.addEventListener('touchstart', () => prefetch(link), { passive: true });

        link.addEventListener('click', function(e) {
            if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

            const bar = document.createElement('div');
            bar.className = 'nav-progress';
            body.appendChild(bar);
            requestAnimationFrame(() => bar.classList.add('is-running'));

            if (isMobile) return;

            e.preventDefault();
            const href = this.getAttribute('href');
            body.classList.add('page-leaving');
            setTimeout(() => { window.location.href = href; }, FADE_MS);
        });
    });
});
