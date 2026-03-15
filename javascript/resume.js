document.addEventListener('DOMContentLoaded', () => {
    // 1. CACHE ALL ELEMENTS (Do this once, not inside functions)
    const nameEl = document.getElementById('typing-name');
    const roleEl = document.getElementById('typing-role');
    const contactBar = document.querySelector('.contact-bar');

    if (!nameEl || !roleEl) return;

    // Cache nested elements to avoid repeated lookups
    const nameGhost = nameEl.querySelector('.type-ghost');
    const roleGhost = roleEl.querySelector('.type-ghost');
    
    if (!nameGhost || !roleGhost) return;

    const nameText = nameGhost.textContent;
    const roleText = roleGhost.textContent;

    /**
     * OPTIMIZED TYPING ENGINE
     * Uses a frame-based approach for smoother mobile rendering
     */
    function typeElement(element, text, speed, callback) {
        const lettersSpan = element.querySelector('.letters');
        const cursor = element.querySelector('.cursor');
        let i = 0;
        let lastTime = 0;

        function type(currentTime) {
            // Only update if enough time (speed) has passed
            if (currentTime - lastTime >= speed) {
                if (i <= text.length) {
                    lettersSpan.textContent = text.substring(0, i);
                    i++;
                    lastTime = currentTime;
                } else {
                    if (cursor) cursor.style.display = 'none';
                    if (callback) callback();
                    return; // End animation
                }
            }
            requestAnimationFrame(type);
        }
        requestAnimationFrame(type);
    }

    // 2. SEQUENCED ANIMATION
    // We keep your 3s delay to account for the site loader
    setTimeout(() => {
        typeElement(nameEl, nameText, 60, () => {
            typeElement(roleEl, roleText, 40, () => {
                if (contactBar) contactBar.classList.add('visible');
            });
        });
    }, 3000);

    /**
     * OPTIMIZED DOWNLOAD MODAL
     */
    const downloadBtn = document.querySelector('.download-btn');
    const modal = document.getElementById('download-modal');
    const fill = document.querySelector('.loading-bar-fill');

    if (downloadBtn && modal && fill) {
        downloadBtn.addEventListener('click', () => {
            // Reset state
            fill.style.cssText = 'transition: none; width: 0%;';
            modal.classList.add('active');

            // Using double RAF to ensure the reset is rendered before the animation starts
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    fill.style.transition = 'width 5s linear';
                    fill.style.width = '100%';
                });
            });

            // Close modal after completion
            setTimeout(() => {
                modal.classList.remove('active');
            }, 5000);
        }, { passive: true }); // Improved scroll performance
    }
});