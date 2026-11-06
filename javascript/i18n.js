// Page translation. theme-init.js picks the language and, for Filipino or Japanese, loads
// i18n/<lang>.js (window.I18N_DICT) before the body. This file then swaps English text for the
// translation: whole elements for paragraphs with inline markup, then text nodes and attributes.
// A MutationObserver translates text that scripts insert later (filter status, testimonials, etc.).
(function () {
    const html = document.documentElement;
    const lang = html.getAttribute('lang') || 'en';
    const dict = window.I18N_DICT;

    window.I18N = { lang, t: (s) => s };

    if (lang === 'en' || !dict) {
        html.classList.remove('i18n-pending');
        return;
    }

    const norm = (s) => s.replace(/\s+/g, ' ').trim();
    const ATTRS = ['alt', 'placeholder', 'aria-label', 'title', 'data-title', 'data-purpose', 'data-learned', 'data-date', 'data-lang', 'data-label'];
    const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'PRE', 'CODE', 'TEXTAREA']);
    const patterns = (dict.patterns || []).map(([en, tr]) => {
        const source = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{(\d)\\\}/g, '(.+?)');
        return [new RegExp(`^${source}$`), tr];
    });

    const translate = (raw) => {
        const key = norm(raw);
        if (!key) return null;
        if (Object.prototype.hasOwnProperty.call(dict.text, key)) return dict.text[key];
        for (const [re, tr] of patterns) {
            const m = key.match(re);
            if (m) return tr.replace(/\{(\d)\}/g, (_, i) => dict.text[m[+i + 1]] || m[+i + 1]);
        }
        return null;
    };
    window.I18N.t = (s) => translate(s) || s;

    // Keep surrounding whitespace so inline spacing between nodes is preserved
    const swapText = (node) => {
        const value = node.nodeValue;
        const tr = translate(value);
        if (tr === null || tr === norm(value)) return;
        const lead = value.match(/^\s*/)[0];
        const trail = value.match(/\s*$/)[0];
        node.nodeValue = lead + tr + trail;
    };

    const skipped = (el) => {
        for (let e = el; e; e = e.parentElement) if (SKIP.has(e.tagName)) return true;
        return false;
    };

    const translateTree = (root) => {
        if (!root || root.nodeType !== 1 || skipped(root)) return;

        // 1. Paragraphs whose translation reorders inline markup
        if (dict.html) {
            root.querySelectorAll('p, li, h1, h2, h3, h4, blockquote, figcaption').forEach(el => {
                const tr = dict.html[norm(el.innerHTML)];
                if (tr) el.innerHTML = tr;
            });
        }

        // 2. Text nodes
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: (n) => (skipped(n.parentElement) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT)
        });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(swapText);

        // 3. Attributes
        [root, ...root.querySelectorAll('*')].forEach(el => ATTRS.forEach(a => {
            const v = el.getAttribute(a);
            if (!v) return;
            const tr = translate(v);
            if (tr !== null) el.setAttribute(a, tr);
        }));
    };

    translateTree(document.body);
    const title = translate(document.title);
    if (title) document.title = title;
    html.classList.remove('i18n-pending');

    // Later changes made by other scripts; records caused by our own edits are discarded
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(m => {
            if (m.type === 'characterData') swapText(m.target);
            else if (m.type === 'attributes') {
                const v = m.target.getAttribute(m.attributeName);
                const tr = v && translate(v);
                if (tr) m.target.setAttribute(m.attributeName, tr);
            } else m.addedNodes.forEach(n => (n.nodeType === 3 ? swapText(n) : translateTree(n)));
        });
        observer.takeRecords();
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
})();
