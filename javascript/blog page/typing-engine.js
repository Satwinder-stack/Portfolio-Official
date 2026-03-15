/**
 * CORE TYPING ENGINE
 * Handles smooth, frame-synced text rendering.
 */
window.TypeEngine = {
    run: function(el, text, speed, callback) {
        if (!el || !text) return;
        
        // Setup internal spans if they don't exist
        if (!el.querySelector('.letters')) {
            el.innerHTML = `<span class="letters"></span><span class="cursor">|</span>`;
        }

        const lettersSpan = el.querySelector('.letters');
        const cursor = el.querySelector('.cursor');
        let i = 0;
        let lastTime = 0;

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