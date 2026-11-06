// Technology filter, screenshot badges and the phone "Show all" toggle for the project grid.
document.addEventListener('DOMContentLoaded', () => {
    const chips = [...document.querySelectorAll('.pj-chip')];
    const cards = [...document.querySelectorAll('.projects-grid .project-card')];
    const status = document.getElementById('filter-status');
    const more = document.querySelector('.pj-more');
    if (!chips.length || !cards.length) return;

    const PHONE_LIMIT = 6;
    let current = 'all';
    let expanded = false;
    const tagsOf = (card) => (card.dataset.tags || '').toLowerCase().split(/\s+/);
    const matches = (card, filter) => filter === 'all' || tagsOf(card).includes(filter);

    // Counts on each chip; hide chips that would match nothing
    chips.forEach(chip => {
        const count = cards.filter(card => matches(card, chip.dataset.filter)).length;
        chip.querySelector('.pj-count').textContent = count;
        if (!count) chip.hidden = true;
    });

    // Badge cards that open a screenshot gallery so the click target is obvious
    cards.forEach(card => {
        const shots = (card.dataset.gallery || '').split(',').map(x => x.trim()).filter(Boolean).length;
        if (!shots) return;
        const badge = document.createElement('span');
        badge.className = 'pj-shots';
        badge.textContent = `${shots} screenshots`;
        card.appendChild(badge);
    });

    const apply = () => {
        const compact = window.innerWidth < 768 && !expanded && current === 'all';
        let matched = 0;
        let shown = 0;
        cards.forEach(card => {
            const isMatch = matches(card, current);
            if (isMatch) matched++;
            const visible = isMatch && (!compact || matched <= PHONE_LIMIT);
            card.classList.toggle('is-filtered-out', !visible);
            if (visible) shown++;
        });

        const label = chips.find(c => c.dataset.filter === current).dataset.label;
        status.textContent = current === 'all'
            ? `Showing ${shown} of ${cards.length} projects`
            : `Showing ${matched} project${matched === 1 ? '' : 's'} built with ${label}`;

        if (more) {
            more.hidden = !(compact && matched > PHONE_LIMIT);
            more.textContent = `Show all ${cards.length} projects`;
        }
    };

    chips.forEach(chip => chip.addEventListener('click', () => {
        current = chip.dataset.filter;
        chips.forEach(c => {
            const active = c === chip;
            c.classList.toggle('is-active', active);
            c.setAttribute('aria-pressed', String(active));
        });
        apply();
    }));

    if (more) more.addEventListener('click', () => {
        expanded = true;
        apply();
        const next = cards[PHONE_LIMIT];
        if (next) next.focus({ preventScroll: true });
    });

    let resizeFrame = null;
    window.addEventListener('resize', () => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(apply);
    }, { passive: true });

    apply();
});
