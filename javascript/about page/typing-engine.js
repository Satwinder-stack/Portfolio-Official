window.TypeEngine = {
    run: function(el, text, speed, callback) {
        if (!el || !text) return;

        // Mobile fallback: No animation, just show text
        if (window.innerWidth < 768) {
            if (el.typeFrame) cancelAnimationFrame(el.typeFrame);
            el.textContent = text; 
            if (callback) callback();
            return;
        }

        // Initialize structure
        el.innerHTML = `<span class="letters"></span><span class="cursor">|</span>`;
        const lettersSpan = el.querySelector('.letters');
        const cursor = el.querySelector('.cursor');
        let i = 0;
        let lastTime = performance.now();

        if (el.typeFrame) cancelAnimationFrame(el.typeFrame);

        function frame(currentTime) {
            const elapsed = currentTime - lastTime;

            if (elapsed >= speed) {
                if (i <= text.length) {
                    // Set text and ensure it's treated as the final state
                    lettersSpan.textContent = text.substring(0, i);
                    i++;
                    lastTime = currentTime;
                } else {
                    // FINALIZATION LOGIC
                    cancelAnimationFrame(el.typeFrame);
                    
                    // 1. Permanently set the text to the parent to avoid span-related bugs
                    el.textContent = text; 
                    
                    // 2. Remove the cursor from the DOM entirely
                    if (cursor) cursor.remove();
                    
                    // 3. Execute callback
                    if (callback) callback();
                    return;
                }
            }
            el.typeFrame = requestAnimationFrame(frame);
        }
        el.typeFrame = requestAnimationFrame(frame);
    }
};