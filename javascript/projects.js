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
    
    // Lightbox Selectors (Hyphenated to match your HTML)
    const lightbox = document.getElementById('project-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');
    const lbLeft = document.querySelector('.nav-arrow-lightbox.left');
    const lbRight = document.querySelector('.nav-arrow-lightbox.right');

    // MOBILE CHECK (787px threshold)
    const isMobile = window.innerWidth < 787;

    // 3. Initialize Modules
    const { selectProject } = initCarousel(previews, detailsPanels, thumbnails, carousel);
    const { activateTech } = initTechFilter(languages, leftArrow, rightArrow, projectCards, selectProject);

    if (thumbnails.length > 0) {
        selectProject(0); 
    }

    // 4. Global Intersections & Typing (Bypass for Mobile)
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

    // Sticky Logic (Desktop Only)
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

    // --- 5. LIGHTBOX & GALLERY LOGIC ---
    let currentGallery = [];
    let currentIndex = 0;

    const openLightbox = (galleryStr) => {
        if (!galleryStr || !lightbox || !lightboxImg) return;
        
        // Parse data-gallery string into clean array
        currentGallery = galleryStr.split(',').map(s => s.trim()).filter(s => s !== "");
        if (currentGallery.length === 0) return;

        currentIndex = 0;
        lightboxImg.src = currentGallery[currentIndex];
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
        if (lightboxImg) lightboxImg.style.transform = 'scale(1)';
    };

    const navigate = (dir) => {
        if (currentGallery.length <= 1) return;
        currentIndex = (currentIndex + dir + currentGallery.length) % currentGallery.length;
        lightboxImg.src = currentGallery[currentIndex];
    };

    // Attach click to Project Cards
    projectCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const gallery = card.getAttribute('data-gallery');
            openLightbox(gallery);
        });
    });

    // Navigation Controls
    if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
    if (lbLeft) lbLeft.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
    if (lbRight) lbRight.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });

    // MOBILE: Split-Screen Tap Navigation
    lightbox?.addEventListener('click', (e) => {
        // Prevent trigger if clicking UI buttons
        if (e.target.closest('.close-lightbox') || e.target.closest('.nav-arrow-lightbox')) return;

        if (window.innerWidth < 787) {
            // Mobile Tap Logic
            const clickX = e.clientX;
            if (clickX < window.innerWidth / 2) {
                navigate(-1); // Left 50%
            } else {
                navigate(1);  // Right 50%
            }
        } else if (e.target === lightbox || e.target.closest('.lightbox-content')) {
            // Desktop: Close on background click
            closeLightbox();
        }
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => { 
        if (lightbox?.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') navigate(1);
            if (e.key === 'ArrowLeft') navigate(-1);
        }
    });

    // 6. Start Up Logic
    if (thumbnails.length > 0 && !isMobile) selectProject(0);
    if (languages.length > 0 && !isMobile) activateTech(0, false);
});