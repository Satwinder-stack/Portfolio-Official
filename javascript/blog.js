document.addEventListener('DOMContentLoaded', () => {
    // 0. MOBILE CHECK
    const isMobile = window.innerWidth < 768;

    // 1. Safety check for the global TypeEngine
    if (!window.TypeEngine) return;

    const blogElements = document.querySelectorAll('.blog-card h3, .blog-card p');
    const TOTAL_DURATION = 2000; 

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            
            if (entry.isIntersecting) {
                // MOBILE BYPASS: Don't trigger observer logic on mobile
                if (isMobile) return;

                if (el.dataset.isTyping !== "true") {
                    el.dataset.isTyping = "true";
                    const text = el.dataset.fullText;
                    const speed = TOTAL_DURATION / (text.length || 1);

                    window.TypeEngine.run(el, text, speed, () => {
                        const cursor = el.querySelector('.cursor');
                        if (cursor) cursor.classList.remove('blog-cursor');
                    });
                }
            } else if (!isMobile) {
                // Reset only on Desktop
                if (el.typeFrame) cancelAnimationFrame(el.typeFrame);
                el.dataset.isTyping = "false";
                const letters = el.querySelector('.letters');
                if (letters) letters.textContent = '';
            }
        });
    }, { threshold: 0.1 });

    // 2. INITIALIZE ELEMENTS
    blogElements.forEach(el => {
        const text = el.textContent.trim();
        el.dataset.fullText = text;
        
        if (isMobile) {
            // MOBILE: Set static content immediately
            el.innerHTML = text;
        } else {
            // DESKTOP: Setup structure for typing animation
            el.innerHTML = `
                <div class="blog-type-container" style="display: grid;">
                    <span class="blog-ghost" style="grid-area: 1/1; visibility: hidden;">${text}</span>
                    <span class="blog-typing" style="grid-area: 1/1;">
                        <span class="letters"></span><span class="cursor blog-cursor">|</span>
                    </span>
                </div>
            `;
            observer.observe(el);
        }
    });
});