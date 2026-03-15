document.addEventListener('DOMContentLoaded', () => {
    // 1. CACHE ALL ELEMENTS (Absolute Strategy)
    const titleContainer = document.getElementById('typing-post-title');
    const heroImage = document.querySelector('.hero-image');
    const authorTargets = document.querySelectorAll('#typing-author-card .typing-target');

    /**
     * UNIFIED TYPING ENGINE
     * Uses a non-blocking frame-based approach
     */
    function typeEffect(element, speed, callback) {
        if (!element) return;
        
        const ghost = element.querySelector('.type-ghost');
        const lettersSpan = element.querySelector('.letters');
        const cursor = element.querySelector('.cursor');
        
        if (!ghost || !lettersSpan) return;

        const text = ghost.textContent.trim();
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
                    return; // End frame loop
                }
            }
            requestAnimationFrame(type);
        }
        requestAnimationFrame(type);
    }

    // 2. POST TITLE SEQUENCE
    // We delay the start slightly to ensure the site loader has faded
    if (titleContainer) {
        setTimeout(() => {
            typeEffect(titleContainer, 40, () => {
                if (heroImage) {
                    // Using requestAnimationFrame to ensure smooth fade-in
                    requestAnimationFrame(() => {
                        heroImage.classList.add('visible');
                    });
                }
            });
        }, 1000); 
    }

    // 3. AUTHOR CARD SEQUENCE (Recursive Chaining)
    function runAuthorSequence(index = 0) {
        if (index >= authorTargets.length) return;

        const target = authorTargets[index];
        const speed = target.classList.contains('author-bio') ? 25 : 50;

        typeEffect(target, speed, () => {
            // Start next section immediately after current one finishes
            runAuthorSequence(index + 1);
        });
    }

    // Start Author sequence after a small buffer
    setTimeout(() => {
        runAuthorSequence();
    }, 1500);
});