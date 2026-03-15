document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.skill-item');
    const display = document.querySelector('.skills-display');
    const wrapper = document.querySelector('.skills-wrapper');

    items.forEach(item => {
        item.addEventListener('click', () => {
            // MOBILE: Simple Accordion Toggle
            if (window.innerWidth <= 767) {
                const isActive = item.classList.contains('active');
                items.forEach(i => i.classList.remove('active'));
                item.classList.toggle('active', !isActive);
                return;
            }

            // DESKTOP: Side Panel Logic
            if (item.classList.contains('active')) {
                wrapper.classList.remove('active');
                item.classList.remove('active');
                if (display) display.innerHTML = '';
            } else {
                items.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const title = item.querySelector('h1')?.innerText || '';
                const content = item.querySelector('.skill-content')?.innerText || '';
                
                if (display) {
                    display.innerHTML = `<h2>${title}</h2><p>${content}</p>`;
                    wrapper.classList.add('active');
                }
            }
        });
    });
});