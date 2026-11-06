// Journal index: search, topic filter (also reachable as blog.html?topic=...), and the
// visitor's own reading progress on each card (saved in this browser by blogs.js).
document.addEventListener('DOMContentLoaded', () => {
    const cards = [...document.querySelectorAll('.blog-card[data-slug]')];
    const chips = [...document.querySelectorAll('.jr-chip')];
    const input = document.getElementById('jr-query');
    const status = document.querySelector('.jr-status');
    const empty = document.querySelector('.jr-empty');
    if (!cards.length) return;
    const t = (s) => (window.I18N ? window.I18N.t(s) : s);

    // Reading progress written by the post pages
    let progress = {};
    try { progress = JSON.parse(localStorage.getItem('journal-progress') || '{}'); } catch (e) { /* storage unavailable */ }
    cards.forEach(card => {
        const entry = progress[card.dataset.slug];
        if (!entry || entry.max < 5) return;
        const pct = Math.min(100, Math.round(entry.max));
        const bar = card.querySelector('.jr-progress');
        const label = card.querySelector('.jr-read');
        if (bar) {
            bar.hidden = false;
            bar.firstElementChild.style.width = pct + '%';
        }
        if (label) {
            label.hidden = false;
            label.textContent = pct >= 90 ? t('Read') : t(`${pct}% read`);
            label.classList.toggle('is-done', pct >= 90);
        }
    });

    // Search text comes from what the visitor sees (already translated)
    const haystack = new Map(cards.map(c => [c, `${c.querySelector('h2').textContent} ${c.querySelector('p').textContent} ${c.querySelector('.category-tag').textContent}`.toLowerCase()]));
    let topic = 'all';

    const apply = () => {
        const q = (input ? input.value : '').trim().toLowerCase();
        let shown = 0;
        cards.forEach(card => {
            const ok = (topic === 'all' || card.dataset.topic === topic) && (!q || q.split(/\s+/).every(w => haystack.get(card).includes(w)));
            card.hidden = !ok;
            if (ok) shown++;
        });
        chips.forEach(c => {
            const on = c.dataset.topic === topic;
            c.classList.toggle('is-active', on);
            c.setAttribute('aria-pressed', String(on));
        });
        document.querySelector('.blog-grid').classList.toggle('is-filtered', topic !== 'all' || !!q);
        if (empty) empty.hidden = shown > 0;
        if (status) status.textContent = (topic === 'all' && !q) ? '' : t(`Showing ${shown} of ${cards.length} posts`);
    };

    chips.forEach(c => c.addEventListener('click', () => {
        topic = c.dataset.topic;
        const url = new URL(location.href);
        if (topic === 'all') url.searchParams.delete('topic'); else url.searchParams.set('topic', topic);
        history.replaceState(null, '', url);
        apply();
    }));
    if (input) input.addEventListener('input', apply);
    document.querySelector('.jr-reset')?.addEventListener('click', () => {
        topic = 'all';
        if (input) input.value = '';
        history.replaceState(null, '', location.pathname);
        apply();
        input?.focus();
    });

    const fromUrl = new URLSearchParams(location.search).get('topic');
    if (fromUrl && chips.some(c => c.dataset.topic === fromUrl)) topic = fromUrl;
    apply();
});
