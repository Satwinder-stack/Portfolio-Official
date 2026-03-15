/**
 * Global Typing Engine
 * Optimized for tech stacks, collab headings, and project titles
 */
const TypeEngine = {
    run: (elements, duration, delayAfter = 3000) => {
        elements.forEach((el) => {
            // 1. Capture data if not already stored
            if (!el.dataset.fullText) {
                const iconElement = el.querySelector('i');
                el.dataset.fullText = el.textContent.trim();
                el.dataset.iconHTML = iconElement ? iconElement.outerHTML : '';
            }

            const { fullText, iconHTML } = el.dataset;
            
            // 2. Clear existing timeouts and text to prevent layout "ghosting"
            if (el.typeTimeout) clearTimeout(el.typeTimeout);
            el.textContent = ''; 

            // 3. Determine specific classes based on tag
            const isCollab = el.tagName === 'H2';
            const isCard = el.tagName === 'H3';
            const prefix = isCollab ? 'collab' : (isCard ? 'project' : 'tech');

            // 4. Inject the new structure (Using the dynamic prefix)
            el.innerHTML = `
                <div class="${prefix}-type-container">
                    <span class="${prefix}-ghost">${iconHTML} ${fullText}</span>
                    <span class="${prefix}-typing ${prefix}-cursor">${iconHTML} <span class="letters"></span></span>
                </div>`;

            const letterSpan = el.querySelector('.letters');
            const typingWrapper = el.querySelector(`.${prefix}-typing`);
            let charIndex = 0;
            const speed = duration / fullText.length;

            const type = () => {
                if (charIndex <= fullText.length) {
                    letterSpan.textContent = fullText.substring(0, charIndex);
                    charIndex++;
                    typingWrapper.classList.add(`${prefix}-cursor`);
                    el.typeTimeout = setTimeout(type, speed);
                } else {
                    typingWrapper.classList.remove(`${prefix}-cursor`);
                    el.typeTimeout = setTimeout(() => {
                        charIndex = 0;
                        letterSpan.textContent = '';
                        type();
                    }, delayAfter);
                }
            };
            type();
        });
    }
};