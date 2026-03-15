/**
 * SMART HEADER ENGINE
 * Only active on index.html. Hidden on scroll down, revealed on scroll up/top.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if we are on the index page
    const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    const header = document.querySelector('header');
    
    if (isIndex && header) {
        // 1. Force the header to start hidden for a cleaner entrance
        header.classList.add('header-hidden');

        // 2. Scroll down slightly (e.g., 60px) to ensure the 'hidden' state is active
        // We use a small timeout to ensure the browser has finished its initial paint
        setTimeout(() => {
            window.scrollTo({
                top: 60,
                behavior: 'instant' // Use 'instant' so the user doesn't see a "jump"
            });
        }, 130);
    }

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // A. If at the absolute top, always show the header
        if (currentScrollY <= 50) {
            header.classList.remove('header-hidden');
            header.classList.add('header-visible');
        } 
        // B. If scrolling DOWN, hide the header
        else if (currentScrollY > lastScrollY) {
            header.classList.add('header-hidden');
            header.classList.remove('header-visible');
        } 
        // C. If scrolling UP, reveal the header
        else {
            header.classList.remove('header-hidden');
            header.classList.add('header-visible');
        }

        lastScrollY = currentScrollY;
    }, { passive: true });
});