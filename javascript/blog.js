function setupBlogTyping() {
    // Select both headings and paragraphs within the blog cards
    const blogElements = document.querySelectorAll('.blog-card h3, .blog-card p');
    const TOTAL_DURATION = 2000; // Both H3 and P will finish in exactly 2 seconds

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            
            if (entry.isIntersecting) {
                if (el.dataset.isTyping !== "true") {
                    startSyncedTyping(el, TOTAL_DURATION);
                }
            } else {
                // Reset when scrolled away so it can re-type
                if (el.typeTimeout) clearTimeout(el.typeTimeout);
                const letterSpan = el.querySelector('.letters');
                if (letterSpan) letterSpan.textContent = '';
                el.dataset.isTyping = "false";
            }
        });
    }, { threshold: 0.1 });

    blogElements.forEach(el => {
        if (!el.dataset.fullText) {
            el.dataset.fullText = el.textContent.trim();
            el.innerHTML = `
                <div class="blog-type-container">
                    <span class="blog-ghost">${el.dataset.fullText}</span>
                    <span class="blog-typing"><span class="letters"></span></span>
                </div>
            `;
        }
        observer.observe(el);
    });
}

function startSyncedTyping(el, duration) {
    el.dataset.isTyping = "true";
    const fullText = el.dataset.fullText;
    const letterSpan = el.querySelector('.letters');
    const typingWrapper = el.querySelector('.blog-typing');
    let charIndex = 0;

    // The Magic: Speed = Total Time / Number of characters
    const speed = duration / fullText.length;

    function run() {
        if (charIndex <= fullText.length) {
            letterSpan.textContent = fullText.substring(0, charIndex);
            charIndex++;
            typingWrapper.classList.add('blog-cursor');
            el.typeTimeout = setTimeout(run, speed);
        } else {
            typingWrapper.classList.remove('blog-cursor');
        }
    }
    run();
}

document.addEventListener('DOMContentLoaded', () => {
    // ... your other scripts (sidebar, etc.)
    
    setupBlogTyping(); 
});