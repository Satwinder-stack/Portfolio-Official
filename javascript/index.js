/**
 * SMART HEADER ENGINE (Optimized)
 * Optimized for mobile with RAF throttling and state-locking.
 */

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    if (!header) return;

    const isIndex = window.location.pathname.endsWith('index.html') || 
                    window.location.pathname.endsWith('/') || 
                    window.location.pathname === '';

    let lastScrollY = window.scrollY;
    let ticking = false;

    // 1. Initial State Setup
    if (isIndex) {
        header.classList.add('header-hidden');
        
        // Use requestAnimationFrame instead of setTimeout for the initial jump
        requestAnimationFrame(() => {
            window.scrollTo({
                top: 60,
                behavior: 'instant'
            });
        });
    }

    /**
     * Update Header State
     * Logic is separated from the event listener for performance
     */
    function updateHeader() {
        const currentScrollY = window.scrollY;

        // A. At the top: Show
        if (currentScrollY <= 50) {
            header.classList.remove('header-hidden');
            header.classList.add('header-visible');
        } 
        // B. Scrolling DOWN: Hide
        else if (currentScrollY > lastScrollY) {
            if (!header.classList.contains('header-hidden')) {
                header.classList.add('header-hidden');
                header.classList.remove('header-visible');
            }
        } 
        // C. Scrolling UP: Show
        else {
            if (header.classList.contains('header-hidden')) {
                header.classList.remove('header-hidden');
                header.classList.add('header-visible');
            }
        }

        lastScrollY = currentScrollY;
        ticking = false; // Release the lock
    }

    // 2. Throttled Scroll Listener
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true; // Lock the execution until the next frame
        }
    }, { passive: true });
});