/**
 * Global Typing Engine
 * Optimized for tech stacks, collab headings, and project titles
 * Includes mobile bypass for screen widths < 787px
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

            // 2. MOBILE BYPASS: If screen < 787px, show static content and exit
            if (window.innerWidth < 787) {
                el.innerHTML = `${iconHTML} ${fullText}`;
                if (el.typeTimeout) clearTimeout(el.typeTimeout);
                return;
            }
            
            // 3. Clear existing timeouts and text for animation setup
            if (el.typeTimeout) clearTimeout(el.typeTimeout);
            el.textContent = ''; 

            // 4. Determine specific classes based on tag
            const isCollab = el.tagName === 'H2';
            const isCard = el.tagName === 'H3';
            const prefix = isCollab ? 'collab' : (isCard ? 'project' : 'tech');

            // 5. Inject the animation structure
            el.innerHTML = `
                <div class="${prefix}-type-container">
                    <span class="${prefix}-ghost">${iconHTML} ${fullText}</span>
                    <span class="${prefix}-typing ${prefix}-cursor">${iconHTML} <span class="letters"></span></span>
                </div>`;

            const letterSpan = el.querySelector('.letters');
            const typingWrapper = el.querySelector(`.${prefix}-typing`);
            let charIndex = 0;
            const speed = duration / (fullText.length || 1);

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