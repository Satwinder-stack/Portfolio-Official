/**
 * SMART HEADER ENGINE
 * Handles header visibility with high-performance RAF throttling.
 * Optimized for mobile stability at <= 768px.
 */

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    if (!header) return;

    // 1. ENVIRONMENT CONSTANTS
    const BREAKPOINT = 768;
    const isMobile = window.innerWidth <= BREAKPOINT;
    const isIndex = window.location.pathname.endsWith('index.html') || 
                    window.location.pathname.endsWith('/') || 
                    window.location.pathname === '';

    let lastScrollY = window.scrollY;
    let ticking = false;

    // 2. INITIAL STATE & MOBILE BYPASS
    // On Desktop index, we hide the header and jump 60px for a clean entrance.
    // On Mobile, we keep it visible and static to prevent address bar flickering.
    if (isIndex) {
        if (!isMobile) {
            header.classList.add('header-hidden');
            
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: 60,
                    behavior: 'instant'
                });
            });
        } else {
            header.classList.add('header-visible');
            header.classList.remove('header-hidden');
        }
    }

    /**
     * CORE HEADER LOGIC
     * Manages state classes based on scroll direction.
     */
    function updateHeader() {
        const currentScrollY = window.scrollY;

        // A. At the top of the page
        if (currentScrollY <= 50) {
            header.classList.remove('header-hidden');
            header.classList.add('header-visible');
        } 
        // B. Scrolling DOWN: Hide Header
        else if (currentScrollY > lastScrollY) {
            if (!header.classList.contains('header-hidden')) {
                header.classList.add('header-hidden');
                header.classList.remove('header-visible');
            }
        } 
        // C. Scrolling UP: Reveal Header
        else {
            if (header.classList.contains('header-hidden')) {
                header.classList.remove('header-hidden');
                header.classList.add('header-visible');
            }
        }

        lastScrollY = currentScrollY;
        ticking = false; // Release lock for next frame
    }

    // 3. EVENT LISTENERS
    // Uses passive: true to improve scroll performance on mobile
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true; 
        }
    }, { passive: true });

    // 4. RESIZE WATCHER
    // If user rotates phone or resizes browser, ensure state stays sane
    window.addEventListener('resize', () => {
        if (window.innerWidth <= BREAKPOINT) {
            header.classList.remove('header-hidden');
            header.classList.add('header-visible');
        }
    }, { passive: true });
});