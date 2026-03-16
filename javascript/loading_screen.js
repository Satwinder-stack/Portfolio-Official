
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('page-transition-loader');
    const bar = document.getElementById('loader-bar');
    const wrapper = document.querySelector('.page-wrapper');
    const html = document.documentElement;
    const body = document.body;
    
    // 1. PATH & DEVICE CHECK
    const path = window.location.pathname;
    const isIndex = path.endsWith('index.html') || path === '/' || path.endsWith('/');
    const isMobile = window.innerWidth <= 768; 

    const unlockScroll = () => {
        html.classList.remove('loading-active');
        body.classList.remove('loading-active');
    };

    const revealContent = () => {
        if (wrapper) {
            wrapper.style.visibility = 'visible';
            wrapper.style.opacity = '1';
            wrapper.classList.add('content-ready');
        }
    };

    if (isIndex || isMobile) {
        if (loader) loader.style.display = 'none';
        revealContent();
        unlockScroll();
        
        if (isMobile) return; 
    }

    if (loader && bar) {
        html.classList.add('loading-active');
        body.classList.add('loading-active');

        requestAnimationFrame(() => {
            bar.style.width = '100%';
        });

        setTimeout(() => {
            loader.style.opacity = '0';
            
            setTimeout(() => {
                loader.style.display = 'none';
                unlockScroll();
                revealContent();
            }, 600); 
        }, 2500); 
    }

    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && !href.startsWith('http') && !href.startsWith('#') && !this.target) {
                
                const goingToIndex = href.endsWith('index.html') || href.includes('index.html') || href === '/';

                if (isMobile) return;

                e.preventDefault();
                if (wrapper) wrapper.style.opacity = '0';

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

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.reload();
    }
});