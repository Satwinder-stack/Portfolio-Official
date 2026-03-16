document.addEventListener('DOMContentLoaded', () => {
    // 1. CACHE ALL ELEMENTS
    const nameEl = document.getElementById('typing-name');
    const roleEl = document.getElementById('typing-role');
    const contactBar = document.querySelector('.contact-bar');
    const BREAKPOINT = 768;
    const isMobile = window.innerWidth <= BREAKPOINT;

    if (!nameEl || !roleEl) return;

    const nameGhost = nameEl.querySelector('.type-ghost');
    const roleGhost = roleEl.querySelector('.type-ghost');
    
    if (!nameGhost || !roleGhost) return;

    const nameText = nameGhost.textContent;
    const roleText = roleGhost.textContent;

    function typeElement(element, text, speed, callback) {
        const lettersSpan = element.querySelector('.letters');
        const cursor = element.querySelector('.cursor');
        
        if (isMobile) {
            if (lettersSpan) lettersSpan.textContent = text;
            if (cursor) cursor.style.display = 'none';
            if (callback) callback();
            return;
        }

        let i = 0;
        let lastTime = 0;

        function type(currentTime) {
            if (currentTime - lastTime >= speed) {
                if (i <= text.length) {
                    lettersSpan.textContent = text.substring(0, i);
                    i++;
                    lastTime = currentTime;
                } else {
                    if (cursor) cursor.style.display = 'none';
                    if (callback) callback();
                    return;
                }
            }
            requestAnimationFrame(type);
        }
        requestAnimationFrame(type);
    }

    if (isMobile) {
        typeElement(nameEl, nameText, 0, () => {
            typeElement(roleEl, roleText, 0, () => {
                if (contactBar) contactBar.classList.add('visible');
            });
        });
    } else {
        setTimeout(() => {
            typeElement(nameEl, nameText, 60, () => {
                typeElement(roleEl, roleText, 40, () => {
                    if (contactBar) contactBar.classList.add('visible');
                });
            });
        }, 3000);
    }

    const downloadBtn = document.querySelector('.download-btn');
    const modal = document.getElementById('download-modal');
    const fill = document.querySelector('.loading-bar-fill');

    if (downloadBtn && modal && fill) {
        downloadBtn.addEventListener('click', () => {
            fill.style.cssText = 'transition: none; width: 0%;';
            modal.classList.add('active');

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const duration = isMobile ? '3s' : '5s';
                    fill.style.transition = `width ${duration} linear`;
                    fill.style.width = '100%';
                });
            });

            setTimeout(() => {
                modal.classList.remove('active');
            }, isMobile ? 3000 : 5000);
        }, { passive: true });
    }
});