document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth < 768;

    const titleContainer = document.getElementById('typing-post-title');
    const heroImage = document.querySelector('.hero-image');
    const authorTargets = document.querySelectorAll('#typing-author-card .typing-target');

    function typeEffect(element, speed, callback) {
        if (!element) return;
        
        const ghost = element.querySelector('.type-ghost');
        const lettersSpan = element.querySelector('.letters');
        const cursor = element.querySelector('.cursor');
        
        if (!ghost || !lettersSpan) return;

        const text = ghost.textContent.trim();

        if (isMobile) {
            lettersSpan.textContent = text;
            if (cursor) cursor.style.display = 'none';
            if (callback) callback();
            return;
        }

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

    if (titleContainer) {
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

    function runAuthorSequence(index = 0) {
        if (index >= authorTargets.length) return;

        const target = authorTargets[index];
        const speed = target.classList.contains('author-bio') ? 25 : 50;

        typeEffect(target, speed, () => {
            runAuthorSequence(index + 1);
        });
    }

    setTimeout(() => {
        runAuthorSequence();
    }, isMobile ? 0 : 1500);
});