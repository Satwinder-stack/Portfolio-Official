function setupDetailsTyping() {
    const descriptions = document.querySelectorAll('.description');
    const TOTAL_DURATION = 2000; // 2 seconds for both sections to finish

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            
            if (entry.isIntersecting) {
                if (el.dataset.isTyping !== "true") {
                    startDetailsLoop(el, TOTAL_DURATION);
                }
            } else {
                // Reset on scroll away
                if (el.typeTimeout) clearTimeout(el.typeTimeout);
                const letterSpan = el.querySelector('.letters');
                if (letterSpan) letterSpan.textContent = '';
                el.dataset.isTyping = "false";
            }
        });
    }, { threshold: 0.1 });

    descriptions.forEach(p => {
        // Check if we've already wrapped this element
        if (p.querySelector('.description-ghost')) return; 

        const currentHTML = p.innerHTML.trim();
        p.dataset.fullHTML = currentHTML;
        
        // Clear and wrap
        p.innerHTML = `
            <div class="description-type-container" style="display: grid;">
                <span class="description-ghost">${currentHTML}</span>
                <span class="description-typing"><span class="letters"></span></span>
            </div>
        `;
        observer.observe(p);
    });
}

function startDetailsLoop(el, duration) {
    el.dataset.isTyping = "true";
    const fullHTML = el.dataset.fullHTML;
    const letterSpan = el.querySelector('.letters');
    const typingWrapper = el.querySelector('.description-typing');
    
    // 1. Create an array of "tokens" (either a character or a full HTML tag like <br>)
    const tokens = fullHTML.match(/(<[^>]+>|[^<])/g) || [];
    let tokenIndex = 0;
    
    // 2. Speed = Total duration / number of tokens (not just characters)
    const speed = duration / tokens.length;

    function run() {
        if (tokenIndex < tokens.length) {
            // Add the next token (char or tag)
            const currentOutput = tokens.slice(0, tokenIndex + 1).join('');
            letterSpan.innerHTML = currentOutput;
            
            tokenIndex++;
            typingWrapper.classList.add('description-cursor');
            el.typeTimeout = setTimeout(run, speed);
        } else {
            // Typing finished
            typingWrapper.classList.remove('description-cursor');
        }
    }
    run();
}



document.addEventListener('DOMContentLoaded', () => {
    // ... other logic
    setupDetailsTyping();
});