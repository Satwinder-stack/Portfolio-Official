// Blog posts: reading bar, "On this page" contents with the current section highlighted and
// time left, links to each section, copy buttons on code, sharing, and remembering how far
// the visitor read (this browser only) so the Journal can show it and the post can resume.
document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('.post-body');
    if (!body) return;
    const t = (s) => (window.I18N ? window.I18N.t(s) : s);
    const slug = location.pathname.split('/').pop().replace(/\.html$/, '');
    const bar = document.getElementById('myBar');
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) requestAnimationFrame(() => heroImage.classList.add('visible'));

    // Small status message (copy confirmations)
    const toast = document.createElement('div');
    toast.className = 'pv-toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
    let toastTimer;
    const say = (msg) => {
        toast.textContent = msg;
        toast.classList.add('is-visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
    };
    const copy = async (text) => {
        try { await navigator.clipboard.writeText(text); return true; } catch (e) { return false; }
    };

    // Section ids and links
    const headings = [...body.querySelectorAll('h2, h3')];
    headings.forEach((h, i) => {
        const slugged = h.textContent.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 48);
        h.id = h.id || (slugged ? `${slugged}` : `section-${i + 1}`);
        const a = document.createElement('a');
        a.className = 'pv-anchor';
        a.href = `#${h.id}`;
        a.setAttribute('aria-label', t('Copy a link to this section'));
        a.textContent = '#';
        a.addEventListener('click', async (e) => {
            e.preventDefault();
            history.replaceState(null, '', `#${h.id}`);
            h.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (await copy(location.href)) say(t('Link copied'));
        });
        h.appendChild(a);
    });

    // Contents: sidebar on wide screens, a collapsible block at the top of the post otherwise
    const tocItem = (h) => `<li class="pv-toc-${h.tagName.toLowerCase()}"><a href="#${h.id}">${h.firstChild.textContent.trim()}</a></li>`;
    const sideList = document.querySelector('.pv-toc-list');
    if (sideList) sideList.innerHTML = headings.map(tocItem).join('');
    const inline = document.createElement('details');
    inline.className = 'pv-toc-inline';
    inline.innerHTML = `<summary><span>${t('On this page')}</span><span class="pv-left"></span></summary><ol class="pv-toc-list">${headings.map(tocItem).join('')}</ol>`;
    body.insertBefore(inline, body.firstElementChild);
    const tocLinks = [...document.querySelectorAll('.pv-toc-list a')];
    tocLinks.forEach(a => a.addEventListener('click', (e) => {
        const target = document.getElementById(a.getAttribute('href').slice(1));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', a.getAttribute('href'));
        if (inline.contains(a)) inline.open = false;
    }));

    // Code blocks: copy button
    body.querySelectorAll('pre').forEach(pre => {
        const wrap = document.createElement('div');
        wrap.className = 'pv-code';
        pre.parentNode.insertBefore(wrap, pre);
        wrap.appendChild(pre);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pv-copy';
        btn.textContent = t('Copy');
        btn.addEventListener('click', async () => {
            if (await copy(pre.innerText)) {
                btn.textContent = t('Copied');
                setTimeout(() => { btn.textContent = t('Copy'); }, 1600);
            }
        });
        wrap.appendChild(btn);
    });

    // Sharing
    const canonical = document.querySelector('link[rel="canonical"]')?.href || location.href.split('#')[0];
    const title = document.querySelector('.post-title')?.textContent.trim() || document.title;
    document.querySelectorAll('.pv-share-btn').forEach(el => {
        const kind = el.dataset.share;
        if (kind === 'linkedin') el.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}`;
        if (kind === 'email') el.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(canonical)}`;
        if (kind === 'copy') el.addEventListener('click', async () => { if (await copy(canonical)) say(t('Link copied')); });
        if (kind === 'native' && navigator.share) {
            el.hidden = false;
            el.addEventListener('click', () => navigator.share({ title, url: canonical }).catch(() => {}));
        }
    });

    // Reading progress through the post body, time left, current section, saved position
    // Time left follows the post's stated reading time ("8 min read"), falling back to word count
    const stated = (document.querySelector('.post-meta')?.textContent.match(/(\d+)\D*$/) || [])[1];
    const totalMinutes = Number(stated) || Math.max(1, Math.round(body.innerText.trim().split(/\s+/).length / 200));
    const leftEls = [...document.querySelectorAll('.pv-left')];
    let stored = {};
    try { stored = JSON.parse(localStorage.getItem('journal-progress') || '{}'); } catch (e) { /* storage unavailable */ }
    const entry = stored[slug] || { max: 0, at: 0 };
    let lastSave = 0;

    const update = (save = true) => {
        const doc = document.documentElement;
        const pageRatio = doc.scrollHeight > innerHeight ? scrollY / (doc.scrollHeight - innerHeight) : 1;
        if (bar) bar.style.width = `${Math.min(100, pageRatio * 100)}%`;

        const r = body.getBoundingClientRect();
        const read = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / r.height));
        const left = Math.ceil(totalMinutes * (1 - read));
        const leftText = read >= 0.98 ? t('Finished') : t(`${left} min left`);
        leftEls.forEach(el => { el.textContent = leftText; });

        let current = -1;
        headings.forEach((h, i) => { if (h.getBoundingClientRect().top < innerHeight * 0.33) current = i; });
        tocLinks.forEach(a => {
            const on = current >= 0 && a.getAttribute('href') === `#${headings[current].id}`;
            a.classList.toggle('is-current', on);
            if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
        });

        const now = Date.now();
        if (save && now - lastSave > 800) {
            lastSave = now;
            entry.max = Math.max(entry.max || 0, Math.round(read * 100));
            entry.at = pageRatio;
            stored[slug] = entry;
            try { localStorage.setItem('journal-progress', JSON.stringify(stored)); } catch (e) { /* storage unavailable */ }
        }
    };
    let ticking = false;
    addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { update(); ticking = false; });
    }, { passive: true });
    addEventListener('resize', () => update(false));

    // Offer to resume where the visitor stopped last time
    const resumeAt = entry.at;
    if (!location.hash && resumeAt > 0.08 && resumeAt < 0.9 && entry.max < 98) {
        const pill = document.createElement('div');
        pill.className = 'pv-resume';
        pill.innerHTML = `<span>${t('Continue where you left off?')}</span><button type="button" class="pv-resume-go">${t('Continue')}</button><button type="button" class="pv-resume-close" aria-label="${t('Dismiss')}">×</button>`;
        document.body.appendChild(pill);
        requestAnimationFrame(() => pill.classList.add('is-visible'));
        const close = () => { pill.classList.remove('is-visible'); setTimeout(() => pill.remove(), 300); };
        pill.querySelector('.pv-resume-go').addEventListener('click', () => {
            const doc = document.documentElement;
            scrollTo({ top: resumeAt * (doc.scrollHeight - innerHeight), behavior: 'smooth' });
            close();
        });
        pill.querySelector('.pv-resume-close').addEventListener('click', close);
        setTimeout(close, 12000);
    }

    // First paint only; the saved position changes once the visitor actually scrolls
    update(false);
});
