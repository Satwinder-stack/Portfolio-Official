/**
 * Global Typing Engine
 * Optimized for tech stacks, collab headings, and project titles
 * Includes mobile bypass for screen widths < 768px
 */
const TypeEngine = {
    run: (elements, duration, delayAfter = 3000) => {
        elements.forEach((el) => {
            // 1. Capture data if not already stored
            if (!el.dataset.fullText) {
                const iconElement = el.querySelector('i');
                // Store text and icon separately for clean restoration
                el.dataset.fullText = el.textContent.trim();
                el.dataset.iconHTML = iconElement ? iconElement.outerHTML : '';
            }

            const { fullText, iconHTML } = el.dataset;

            // 2. MOBILE BYPASS: Instant restoration
            if (window.innerWidth < 768) {
                // Kill any active loops immediately
                if (el.typeTimeout) {
                    clearTimeout(el.typeTimeout);
                    el.typeTimeout = null;
                }
                
                // Set static content (Icon + Text)
                el.innerHTML = `${iconHTML} ${fullText}`;
                return; 
            }
            
            // 3. DESKTOP ANIMATION SETUP
            if (el.typeTimeout) clearTimeout(el.typeTimeout);
            el.textContent = ''; 

            const isCollab = el.tagName === 'H2';
            const isCard = el.tagName === 'H3';
            const prefix = isCollab ? 'collab' : (isCard ? 'project' : 'tech');

            // 4. Inject structure with Ghost text for layout stability
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
                // Check mobile again inside the loop for safety (e.g. window resize)
                if (window.innerWidth < 768) {
                    el.innerHTML = `${iconHTML} ${fullText}`;
                    return;
                }

                if (charIndex <= fullText.length) {
                    letterSpan.textContent = fullText.substring(0, charIndex);
                    charIndex++;
                    typingWrapper.classList.add(`${prefix}-cursor`);
                    el.typeTimeout = setTimeout(type, speed);
                } else {
                    // Animation finished
                    typingWrapper.classList.remove(`${prefix}-cursor`);
                    
                    // Trigger the loop delay
                    el.typeTimeout = setTimeout(() => {
                        charIndex = 0;
                        if (letterSpan) letterSpan.textContent = '';
                        type();
                    }, delayAfter);
                }
            };

            type();
        });
    }
};