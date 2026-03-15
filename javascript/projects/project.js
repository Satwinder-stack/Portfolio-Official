/**
 * PROJECT TYPING ENGINE
 * Optimized for mobile performance using requestAnimationFrame 
 * and minimized layout thrashing.
 */

function setupDetailsTyping() {
    const descriptions = document.querySelectorAll('.description');
    const TOTAL_DURATION = 2000;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            
            if (entry.isIntersecting) {
                if (el.dataset.isTyping !== "true") {
                    startDetailsLoop(el, TOTAL_DURATION);
                }
            } else {
                // Cancel active animation frame
                if (el.typeFrame) cancelAnimationFrame(el.typeFrame);
                const letterSpan = el.querySelector('.letters');
                if (letterSpan) letterSpan.textContent = '';
                el.dataset.isTyping = "false";
            }
        });
    }, { threshold: 0.1 });

    descriptions.forEach(p => {
        if (p.querySelector('.description-ghost')) return; 

        const currentHTML = p.innerHTML.trim();
        p.dataset.fullHTML = currentHTML;
        
        // Using a more performance-friendly grid setup
        p.innerHTML = `
            <div class="description-type-container" style="display: grid; grid-template-columns: 1fr;">
                <span class="description-ghost" style="grid-area: 1/1; visibility: hidden;">${currentHTML}</span>
                <span class="description-typing" style="grid-area: 1/1;"><span class="letters"></span></span>
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
    
    // Tokenize HTML tags vs characters
    const tokens = fullHTML.match(/(<[^>]+>|[^<])/g) || [];
    const speed = duration / tokens.length;
    
    let tokenIndex = 0;
    let lastTime = 0;

    typingWrapper.classList.add('description-cursor');

    function run(currentTime) {
        if (el.dataset.isTyping !== "true") return;

        if (currentTime - lastTime >= speed) {
            if (tokenIndex < tokens.length) {
                // Optimized: build the string incrementally
                let currentOutput = "";
                for(let j = 0; j <= tokenIndex; j++) {
                    currentOutput += tokens[j];
                }
                
                letterSpan.innerHTML = currentOutput;
                tokenIndex++;
                lastTime = currentTime;
            } else {
                typingWrapper.classList.remove('description-cursor');
                return;
            }
        }
        el.typeFrame = requestAnimationFrame(run);
    }
    
    el.typeFrame = requestAnimationFrame(run);
}

document.addEventListener('DOMContentLoaded', () => {
    setupDetailsTyping();
});