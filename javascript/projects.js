document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Scroll Reset
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // 2. Selectors
    const thumbnails = document.querySelectorAll('.thumbnail');
    const previews = document.querySelectorAll('.preview-media');
    const detailsPanels = document.querySelectorAll('.project-details');
    const carousel = document.querySelector('.carousel-container');
    const languages = document.querySelectorAll('.language');
    const leftArrow = document.querySelector('.nav-arrow.left');
    const rightArrow = document.querySelector('.nav-arrow.right');
    const projectCards = document.querySelectorAll('.project-card');
    const trigger = document.querySelector('#sticky-trigger');
    const secondWrapper = document.querySelector('.second-tech-stack-wrapper');
    const collabSection = document.querySelector('.collaboration');
    
    // Lightbox Selectors
    const lightbox = document.getElementById('projectLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.close-lightbox');

    // MOBILE CHECK
    const isMobile = window.innerWidth < 787;

    // 3. Initialize Modules
    const { selectProject } = initCarousel(previews, detailsPanels, thumbnails, carousel);
    const { activateTech } = initTechFilter(languages, leftArrow, rightArrow, projectCards, secondWrapper, selectProject);

    // 4. Global Intersections & Initial Typing (Bypass for Mobile)
    if (!isMobile) {
        TypeEngine.run(document.querySelectorAll('.project-content h3'), 1500);
        if (detailsPanels[0]) {
            TypeEngine.run(detailsPanels[0].querySelectorAll('.tech-icon'), 1500);
        }
    }

    const collabObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!isMobile) {
                    TypeEngine.run(document.querySelectorAll('.collaboration h2'), 2000);
                }
                collabObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    if (collabSection) collabObserver.observe(collabSection);

    // Sticky & Force-Hide logic
    if (!isMobile) {
        const stickyObserver = new IntersectionObserver(([entry]) => {
            secondWrapper?.classList.toggle('is-stuck', !entry.isIntersecting && entry.boundingClientRect.top < 0);
        }, { threshold: 0 });
        if (trigger) stickyObserver.observe(trigger);

        const hideObserver = new IntersectionObserver(([entry]) => {
            secondWrapper?.classList.toggle('force-hide', entry.isIntersecting);
        }, { threshold: 0, rootMargin: "0px 0px -10% 0px" });
        if (collabSection) hideObserver.observe(collabSection);
    }

    // --- 5. LIGHTBOX LOGIC ---
    const openLightbox = (src) => {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
        if (lightboxImg) lightboxImg.style.transform = 'scale(1)';
    };

    // Attach click events to images for popup
    previews.forEach(media => {
        // If it's an image, allow popup on click
        if (media.tagName === 'IMG') {
            media.style.cursor = 'zoom-in';
            media.addEventListener('click', () => openLightbox(media.src));
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

    // 6. Start Up Logic
    if (thumbnails.length > 0 && !isMobile) {
        selectProject(0);
    }
    
    if (languages.length > 0 && !isMobile) {
        activateTech(0, false);
    }
});