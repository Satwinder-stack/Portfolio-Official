document.addEventListener('DOMContentLoaded', () => {
    // 0. MOBILE CHECK (Disable typing/delays < 768px)
    const isMobile = window.innerWidth < 768;

    // 1. CACHE ALL ELEMENTS
    const titleContainer = document.getElementById('typing-post-title');
    const heroImage = document.querySelector('.hero-image');
    const authorTargets = document.querySelectorAll('#typing-author-card .typing-target');

    /**
     * UNIFIED TYPING ENGINE
     */
    function typeEffect(element, speed, callback) {
        if (!element) return;
        
        const ghost = element.querySelector('.type-ghost');
        const lettersSpan = element.querySelector('.letters');
        const cursor = element.querySelector('.cursor');
        
        if (!ghost || !lettersSpan) return;

        const text = ghost.textContent.trim();

        // MOBILE BYPASS: Instant reveal
        if (isMobile) {
            lettersSpan.textContent = text;
            if (cursor) cursor.style.display = 'none';
            if (callback) callback();
            return;
        }

        // DESKTOP LOGIC
        let i = 0;
        let lastTime = 0;
        if (cursor) cursor.style.display = 'inline-block';

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

    // 2. POST TITLE SEQUENCE
    if (titleContainer) {
        // Remove delay on mobile (0ms vs 1000ms)
        setTimeout(() => {
            typeEffect(titleContainer, 40, () => {
                if (heroImage) {
                    requestAnimationFrame(() => {
                        heroImage.classList.add('visible');
                    });
                }
            });
        }, isMobile ? 0 : 1000); 
    }

    // 3. AUTHOR CARD SEQUENCE
    function runAuthorSequence(index = 0) {
        if (index >= authorTargets.length) return;

        const target = authorTargets[index];
        const speed = target.classList.contains('author-bio') ? 25 : 50;

        typeEffect(target, speed, () => {
            runAuthorSequence(index + 1);
        });
    }

    // Start Author sequence immediately on mobile
    setTimeout(() => {
        runAuthorSequence();
    }, isMobile ? 0 : 1500);
});