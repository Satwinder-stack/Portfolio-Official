document.addEventListener('DOMContentLoaded', () => {
    const titleContainer = document.querySelector('#typing-post-title');
    const heroImage = document.querySelector('.hero-image');
    
    if (!titleContainer) return;

    const ghostText = titleContainer.querySelector('.type-ghost').textContent;
    const lettersSpan = titleContainer.querySelector('.letters');
    const cursor = titleContainer.querySelector('.cursor');
    
    let i = 0;
    const speed = 40; // Milliseconds per character

    function typeTitle() {
        if (i <= ghostText.length) {
            lettersSpan.textContent = ghostText.substring(0, i);
            i++;
            setTimeout(typeTitle, speed);
        } else {
            // Typing finished
            cursor.style.display = 'none';
            // Fade in the hero image
            if (heroImage) heroImage.classList.add('visible');
        }
    }

    // Start typing
    typeTitle();
});

document.addEventListener('DOMContentLoaded', () => {
    const targets = document.querySelectorAll('#typing-author-card .typing-target');
    
    async function typeSection(element) {
        const ghost = element.querySelector('.type-ghost');
        const lettersSpan = element.querySelector('.letters');
        const cursor = element.querySelector('.cursor');
        const text = ghost.textContent.trim();
        
        // Show cursor for this section
        if (cursor) cursor.style.display = 'inline-block';

        for (let i = 0; i <= text.length; i++) {
            lettersSpan.textContent = text.substring(0, i);
            // Speed: faster for name/title, slightly slower for bio
            const speed = element.classList.contains('author-bio') ? 25 : 50;
            await new Promise(resolve => setTimeout(resolve, speed));
        }

        // Hide cursor when finished with this section
        if (cursor) cursor.style.display = 'none';
    }

    async function startAuthorTyping() {
        // Wait a bit after page load
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Type each section in order
        for (const target of targets) {
            await typeSection(target);
        }
    }

    startAuthorTyping();
});