document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.skill-item');
    const display = document.querySelector('.skills-display');
    const wrapper = document.querySelector('.skills-wrapper');
    
    const BREAKPOINT = 768;

    items.forEach(item => {
        item.addEventListener('click', () => {
            const isMobile = window.innerWidth < BREAKPOINT;

            // --- MOBILE: Simple Accordion Logic ---
            // (Disabled typing/intro logic isn't present here, so we keep it as is)
            if (isMobile) {
                const isActive = item.classList.contains('active');
                // Close others
                items.forEach(i => i.classList.remove('active'));
                // Toggle current
                if (!isActive) item.classList.add('active');
                return;
            }

            // --- DESKTOP: Side Panel Logic ---
            if (item.classList.contains('active')) {
                // Toggle off
                wrapper?.classList.remove('active');
                item.classList.remove('active');
                if (display) display.innerHTML = '';
            } else {
                // Toggle on
                items.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const title = item.querySelector('h1')?.textContent.trim() || '';
                const content = item.querySelector('.skill-content')?.innerHTML || '';
                
                if (display) {
                    display.innerHTML = `
                        <div class="skills-fade-in">
                            <h2>${title}</h2>
                            <div class="display-body">${content}</div>
                        </div>`;
                    wrapper?.classList.add('active');

                    // If you had TypeEngine running here, we'd wrap it in !isMobile, 
                    // but since this block is already Desktop-only due to 'return' above, it's safe.
                }
            }
        });
    });
});