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

        // Lay out every character up front (hidden) and reveal them in place, so the
        // text never reflows while typing and nothing on the page shifts.
        // The caret is a box-shadow on the newest character, which doesn't affect layout.
        el.textContent = '';
        const chars = Array.from(text, ch => {
            const span = document.createElement('span');
            span.textContent = ch;
            span.style.visibility = 'hidden';
            el.appendChild(span);
            return span;
        });
        let i = 0;
        let lastTime = performance.now();

        if (el.typeFrame) cancelAnimationFrame(el.typeFrame);

        function frame(currentTime) {
            if (currentTime - lastTime >= speed) {
                if (i < chars.length) {
                    if (i > 0) chars[i - 1].style.boxShadow = '';
                    chars[i].style.visibility = '';
                    chars[i].style.boxShadow = '3px 0 0 currentColor';
                    i++;
                    lastTime = currentTime;
                } else {
                    // Done: put back plain text and drop the per-character spans
                    el.textContent = text;
                    if (callback) callback();
                    return;
                }
            }
            el.typeFrame = requestAnimationFrame(frame);
        }
        el.typeFrame = requestAnimationFrame(frame);
    }
};
