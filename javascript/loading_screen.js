document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('page-transition-loader');
    const bar = document.getElementById('loader-bar');
    const wrapper = document.querySelector('.page-wrapper');
    const html = document.documentElement;
    const body = document.body;
    
    // 1. CHECK LOCATION: Are we on the index page?
    const isIndex = window.location.pathname.endsWith('index.html') || 
                    window.location.pathname === '/' || 
                    window.location.pathname.endsWith('/');

    if (isIndex) {
        // ABSOLUTE SKIP: Kill the loader immediately for index.html
        if (loader) loader.style.display = 'none';
        if (wrapper) {
            wrapper.style.visibility = 'visible';
            wrapper.style.opacity = '1';
            wrapper.classList.add('content-ready');
        }
        return; // Stop the rest of the script from running
    }

    // 2. LOADING LOGIC: (Only runs for About, Projects, Contact, etc.)
    if (loader && bar) {
        // 1. LOCK SCROLLING IMMEDIATELY
        html.classList.add('loading-active');
        body.classList.add('loading-active');

        // Start bar animation
        setTimeout(() => { bar.style.width = '100%'; }, 50);

        // 2. THE UNLOCK (Matches your 2.5s timer)
        setTimeout(() => {
            // Fade out loader
            loader.style.opacity = '0';
            
            // 3. RELEASE SCROLLING
            // We wait for the fade animation to finish before showing the scrollbar
            setTimeout(() => {
                loader.style.display = 'none';
                html.classList.remove('loading-active');
                body.classList.remove('loading-active');
            }, 600); 
        }, 2500); 
    }

    // 3. EXIT LOGIC: Keeps transitions smooth when leaving any page
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#') && !this.target) {
                e.preventDefault();
                
                // If the destination is index.html, we don't show the loader bar
                const goingToIndex = href.endsWith('index.html') || href === '../index.html' || href === '/';

                if (wrapper) wrapper.style.opacity = '0';

                if (!goingToIndex && loader) {
                    loader.style.display = 'flex';
                    setTimeout(() => { loader.style.opacity = '1'; }, 10);
                }

                setTimeout(() => { window.location.href = href; }, 500); 
            }
        });
    });
});

// Fix for Safari back-button cache
window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};