/**
 * PERFORMANCE LOADING ENGINE
 * Manages page transitions with scroll-lock and index-skipping logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('page-transition-loader');
    const bar = document.getElementById('loader-bar');
    const wrapper = document.querySelector('.page-wrapper');
    const html = document.documentElement;
    const body = document.body;
    
    // 1. PATH CHECK
    const path = window.location.pathname;
    const isIndex = path.endsWith('index.html') || path === '/' || path.endsWith('/');

    /**
     * Helper: Safely release scroll-lock
     */
    const unlockScroll = () => {
        html.classList.remove('loading-active');
        body.classList.remove('loading-active');
    };

    /**
     * Helper: Force Content Visibility
     */
    const revealContent = () => {
        if (wrapper) {
            wrapper.style.visibility = 'visible';
            wrapper.style.opacity = '1';
            wrapper.classList.add('content-ready');
        }
    };

    // 2. IMMEDIATE INDEX SKIP
    if (isIndex) {
        if (loader) loader.style.display = 'none';
        revealContent();
        unlockScroll();
        return; 
    }

    // 3. ENTERING PAGE LOGIC (Non-Index)
    if (loader && bar) {
        // Lock scroll immediately
        html.classList.add('loading-active');
        body.classList.add('loading-active');

        // Start progress bar
        requestAnimationFrame(() => {
            bar.style.width = '100%';
        });

        // Main Timer: Finish Loading
        setTimeout(() => {
            loader.style.opacity = '0';
            
            // Cleanup after fade-out transition (matches 0.6s CSS transition)
            setTimeout(() => {
                loader.style.display = 'none';
                unlockScroll();
                revealContent();
            }, 600); 
        }, 2500); 
    }

    // 4. EXIT LOGIC (Universal Link Handling)
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Standard Navigation Filter
            if (href && !href.startsWith('http') && !href.startsWith('#') && !this.target) {
                e.preventDefault();
                
                const goingToIndex = href.endsWith('index.html') || href.includes('index.html') || href === '/';

                // Fade out current content
                if (wrapper) wrapper.style.opacity = '0';

                // Show loader if NOT going home
                if (!goingToIndex && loader) {
                    loader.style.display = 'flex';
                    requestAnimationFrame(() => {
                        loader.style.opacity = '1';
                    });
                }

                setTimeout(() => { window.location.href = href; }, 500); 
            }
        });
    });
});

// Safari Back-Button Cache Fix
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.reload();
    }
});