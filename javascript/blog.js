document.addEventListener('DOMContentLoaded', () => {
    // 1. Safety check for the global TypeEngine
    if (!window.TypeEngine) return;

    /**
     * SETUP BLOG TYPING
     * Connects blog card elements to the central typing engine.
     */
    const blogElements = document.querySelectorAll('.blog-card h3, .blog-card p');
    const TOTAL_DURATION = 2000; 

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            
            if (entry.isIntersecting) {
                if (el.dataset.isTyping !== "true") {
                    el.dataset.isTyping = "true";
                    
                    const text = el.dataset.fullText;
                    // Speed = Duration / Length
                    const speed = TOTAL_DURATION / text.length;

                    window.TypeEngine.run(el, text, speed, () => {
                        const cursor = el.querySelector('.cursor');
                        if (cursor) cursor.classList.remove('blog-cursor');
                    });
                }
            } else {
                // Reset when scrolled away
                if (el.typeFrame) cancelAnimationFrame(el.typeFrame);
                el.dataset.isTyping = "false";
                const letters = el.querySelector('.letters');
                if (letters) letters.textContent = '';
            }
        });
    }, { threshold: 0.1 });

    // Initialize once
    blogElements.forEach(el => {
        const text = el.textContent.trim();
        el.dataset.fullText = text;
        
        // Setup structure without clearing existing dataset
        el.innerHTML = `
            <div class="blog-type-container" style="display: grid;">
                <span class="blog-ghost" style="grid-area: 1/1; visibility: hidden;">${text}</span>
                <span class="blog-typing" style="grid-area: 1/1;">
                    <span class="letters"></span><span class="cursor blog-cursor">|</span>
                </span>
            </div>
        `;
        observer.observe(el);
    });
});