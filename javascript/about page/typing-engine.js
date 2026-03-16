
window.TypeEngine = {
    run: function(el, text, speed, callback) {
        if (!el || !text) return;

        if (window.innerWidth < 768) {
            if (el.typeFrame) cancelAnimationFrame(el.typeFrame);
            
            el.textContent = text; 
            const cursor = el.querySelector('.cursor');
            if (cursor) cursor.remove();
            
            if (callback) callback();
            return;
        }

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