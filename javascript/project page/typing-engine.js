
const TypeEngine = {
    run: (elements, duration, delayAfter = 3000) => {
        elements.forEach((el) => {
            if (!el.dataset.fullText) {
                const iconElement = el.querySelector('i');
                el.dataset.fullText = el.textContent.trim();
                el.dataset.iconHTML = iconElement ? iconElement.outerHTML : '';
            }

            const { fullText, iconHTML } = el.dataset;

            if (window.innerWidth < 768) {
                if (el.typeTimeout) {
                    clearTimeout(el.typeTimeout);
                    el.typeTimeout = null;
                }
                
                el.innerHTML = `${iconHTML} ${fullText}`;
                return; 
            }
            
            if (el.typeTimeout) clearTimeout(el.typeTimeout);
            el.textContent = ''; 

            const isCollab = el.tagName === 'H2';
            const isCard = el.tagName === 'H3';
            const prefix = isCollab ? 'collab' : (isCard ? 'project' : 'tech');

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
                    typingWrapper.classList.remove(`${prefix}-cursor`);
                    
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