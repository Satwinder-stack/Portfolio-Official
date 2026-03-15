document.addEventListener('DOMContentLoaded', () => {
    const nameEl = document.querySelector('#typing-name');
    const roleEl = document.querySelector('#typing-role');
    const contactBar = document.querySelector('.contact-bar');

    // Safety check: ensure elements exist before proceeding
    if (!nameEl || !roleEl) return;

    const nameText = nameEl.querySelector('.type-ghost').textContent;
    const roleText = roleEl.querySelector('.type-ghost').textContent;

    function typeElement(element, text, speed, callback) {
        const lettersSpan = element.querySelector('.letters');
        const cursor = element.querySelector('.cursor');
        let i = 0;

        function type() {
            if (i <= text.length) {
                lettersSpan.textContent = text.substring(0, i);
                i++;
                setTimeout(type, speed);
            } else {
                cursor.style.display = 'none'; 
                if (callback) callback();
            }
        }
        type();
    }

    /**
     * THE ABSOLUTE FIX: 
     * We wait 3 seconds (2.5s loader + 0.5s fade) 
     * so the user actually sees the typing start.
     */
    setTimeout(() => {
        typeElement(nameEl, nameText, 60, () => {
            typeElement(roleEl, roleText, 40, () => {
                if (contactBar) contactBar.classList.add('visible');
            });
        });
    }, 3000); 
});








document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.querySelector('.download-btn');
    const modal = document.getElementById('download-modal');
    const fill = document.querySelector('.loading-bar-fill');

    if (downloadBtn && modal && fill) {
        downloadBtn.addEventListener('click', () => {
            // 1. Reset the bar immediately (no transition)
            fill.style.transition = 'none';
            fill.style.width = '0%';
            
            // 2. Show the modal
            modal.classList.add('active');

            // 3. Use requestAnimationFrame to wait for the next frame
            // This ensures the browser "sees" the 0% width first
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    fill.style.transition = 'width 5s linear';
                    fill.style.width = '100%';
                });
            });

            // 4. Close after 5 seconds
            setTimeout(() => {
                modal.classList.remove('active');
            }, 5000);
        });
    }
});