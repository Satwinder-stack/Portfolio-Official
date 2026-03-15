document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.skill-item');
    const display = document.querySelector('.skills-display');
    const wrapper = document.querySelector('.skills-wrapper');
    
    // Use your consistent 787px breakpoint
    const BREAKPOINT = 787;

    items.forEach(item => {
        item.addEventListener('click', () => {
            const isMobile = window.innerWidth < BREAKPOINT;

            // --- MOBILE: Simple Accordion Logic ---
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
                
                // Use optional chaining and trim to avoid empty nodes
                const title = item.querySelector('h1')?.textContent.trim() || '';
                const content = item.querySelector('.skill-content')?.innerHTML || '';
                
                if (display) {
                    // Optimized update: Inject and trigger reveal animation via CSS
                    display.innerHTML = `
                        <div class="skills-fade-in">
                            <h2>${title}</h2>
                            <div class="display-body">${content}</div>
                        </div>`;
                    wrapper?.classList.add('active');
                }
            }
        });
    });

});