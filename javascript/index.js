

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    if (!header) return;

    const BREAKPOINT = 768;
    const isMobile = window.innerWidth <= BREAKPOINT;
    const isIndex = window.location.pathname.endsWith('index.html') || 
                    window.location.pathname.endsWith('/') || 
                    window.location.pathname === '';

    let lastScrollY = window.scrollY;
    let ticking = false;

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

    function updateHeader() {
        const currentScrollY = window.scrollY;

        if (currentScrollY <= 50) {
            header.classList.remove('header-hidden');
            header.classList.add('header-visible');
        } 
        else if (currentScrollY > lastScrollY) {
            if (!header.classList.contains('header-hidden')) {
                header.classList.add('header-hidden');
                header.classList.remove('header-visible');
            }
        } 
        else {
            if (header.classList.contains('header-hidden')) {
                header.classList.remove('header-hidden');
                header.classList.add('header-visible');
            }
        }

        lastScrollY = currentScrollY;
        ticking = false; 
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true; 
        }
    }, { passive: true });

    window.addEventListener('resize', () => {
        if (window.innerWidth <= BREAKPOINT) {
            header.classList.remove('header-hidden');
            header.classList.add('header-visible');
        }
    }, { passive: true });
});