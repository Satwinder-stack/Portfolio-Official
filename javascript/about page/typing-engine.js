/**
 * CORE TYPING ENGINE
 * Handles smooth, frame-synced text rendering.
 * Strictly optimized for performance and mobile bypass.
 */
window.TypeEngine = {
    run: function(el, text, speed, callback) {
        if (!el || !text) return;

        // 1. MOBILE BYPASS: Stop immediately if screen is small
        if (window.innerWidth < 768) {
            // Cancel any pending animation frames just in case
            if (el.typeFrame) cancelAnimationFrame(el.typeFrame);
            
            // Set content instantly and remove cursor if it exists
            el.textContent = text; 
            const cursor = el.querySelector('.cursor');
            if (cursor) cursor.remove();
            
            // Fire callback immediately so subsequent animations (like Hero H2) aren't stuck
            if (callback) callback();
            return;
        }

        // 2. DESKTOP LOGIC
        // Setup internal spans if they don't exist
        if (!el.querySelector('.letters')) {
            el.innerHTML = `<span class="letters"></span><span class="cursor">|</span>`;
        }

        const lettersSpan = el.querySelector('.letters');
        const cursor = el.querySelector('.cursor');
        let i = 0;
        let lastTime = 0;

        // Clean up previous animation on this element
        if (el.typeFrame) cancelAnimationFrame(el.typeFrame);

        function frame(currentTime) {
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
            el.typeFrame = requestAnimationFrame(frame);
        }
        el.typeFrame = requestAnimationFrame(frame);
    }
};