// Renders project titles and tech labels immediately. Kept as `TypeEngine.run(elements)`
// so projects.js and carousel-logic.js can call it without knowing about the change.
const TypeEngine = {
    run: (elements) => {
        elements.forEach((el) => {
            if (!el.dataset.fullText) {
                const iconElement = el.querySelector('.tech-dot, i');
                el.dataset.fullText = el.textContent.trim();
                el.dataset.iconHTML = iconElement ? iconElement.outerHTML : '';
            }
            const { fullText, iconHTML } = el.dataset;
            if (el.typeTimeout) clearTimeout(el.typeTimeout);
            el.innerHTML = iconHTML ? `${iconHTML} ${fullText}` : fullText;
        });
    }
};
