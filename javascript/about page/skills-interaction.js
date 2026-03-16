document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.skill-item');
    const display = document.querySelector('.skills-display');
    const wrapper = document.querySelector('.skills-wrapper');
    
    const BREAKPOINT = 768;

    items.forEach(item => {
        item.addEventListener('click', () => {
            const isMobile = window.innerWidth < BREAKPOINT;

            if (isMobile) {
                const isActive = item.classList.contains('active');
                items.forEach(i => i.classList.remove('active'));
                if (!isActive) item.classList.add('active');
                return;
            }

            if (item.classList.contains('active')) {
                wrapper?.classList.remove('active');
                item.classList.remove('active');
                if (display) display.innerHTML = '';
            } else {
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

                }
            }
        });
    });
});