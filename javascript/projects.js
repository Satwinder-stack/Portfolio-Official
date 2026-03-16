document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Scroll Reset
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Standardized Breakpoint
    const BREAKPOINT = 768;
    const isMobile = window.innerWidth <= BREAKPOINT;

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
    const lightbox = document.getElementById('project-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');
    const lbLeft = document.querySelector('.nav-arrow-lightbox.left');
    const lbRight = document.querySelector('.nav-arrow-lightbox.right');

    // 3. Initialize Modules (Carousel & Filter)
    const { selectProject } = initCarousel(previews, detailsPanels, thumbnails, carousel);
    const { activateTech } = initTechFilter(languages, leftArrow, rightArrow, projectCards, selectProject);

        /**
     * MOBILE VIDEO CONTROLLER
     * Ensures videos are paused by default and togglable on mobile.
     */
    function initMobileVideoControls() {
        const isMobile = window.innerWidth <= 768;
        const videos = document.querySelectorAll('.preview-media');

        videos.forEach(video => {
            if (isMobile) {
                // FORCE: Remove autoplay and pause immediately
                video.removeAttribute('autoplay');
                video.pause();
                video.currentTime = 0; // Reset to start frame

                const link = video.closest('.video-link');
                if (link) {
                    // One-time listener to handle the "First Tap"
                    link.addEventListener('click', function handleFirstTap(e) {
                        if (video.paused) {
                            e.preventDefault();
                            // Pause all others
                            videos.forEach(v => v.pause());
                            
                            // Play this one
                            video.play();
                            
                            // Optional: Remove the preventDefault after first play 
                            // so the next click goes to the project page
                            // link.removeEventListener('click', handleFirstTap);
                        }
                    });
                }
            } else {
                // Desktop: Autoplay only the active one
                if (video.classList.contains('active')) {
                    video.play().catch(() => {});
                }
            }
        });
    }

    initMobileVideoControls();
       
    // Initial project selection
    if (thumbnails.length > 0) {
        selectProject(0); 
    }

    // 4. GLOBAL INTERSECTIONS & TYPING (768px Bypass)
    if (!isMobile) {
        TypeEngine.run(document.querySelectorAll('.project-content h3'), 1500);
        if (detailsPanels[0]) {
            TypeEngine.run(detailsPanels[0].querySelectorAll('.tech-icon'), 1500);
        }
    }

    // Observer for Collaboration Header
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

    // Sticky Tech Stack Logic (Only relevant for Desktop/Tablet)
    const stickyObserver = new IntersectionObserver(([entry]) => {
        secondWrapper?.classList.toggle('is-stuck', !entry.isIntersecting && entry.boundingClientRect.top < 0);
    }, { threshold: 0 });
    if (trigger) stickyObserver.observe(trigger);

    const hideObserver = new IntersectionObserver(([entry]) => {
        secondWrapper?.classList.toggle('force-hide', entry.isIntersecting);
    }, { threshold: 0, rootMargin: "0px 0px -10% 0px" });
    if (collabSection) hideObserver.observe(collabSection);

    // --- 5. LIGHTBOX & GALLERY LOGIC ---
    let currentGallery = [];
    let currentIndex = 0;

    const openLightbox = (galleryStr) => {
        if (!galleryStr || !lightbox || !lightboxImg) return;
        
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

    // Attach click events
    projectCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const gallery = card.getAttribute('data-gallery');
            openLightbox(gallery);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
    if (lbLeft) lbLeft.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
    if (lbRight) lbRight.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });

    // Touch/Click Navigation
    lightbox?.addEventListener('click', (e) => {
        if (e.target.closest('.close-lightbox') || e.target.closest('.nav-arrow-lightbox')) return;

        if (window.innerWidth <= BREAKPOINT) {
            const clickX = e.clientX;
            clickX < window.innerWidth / 2 ? navigate(-1) : navigate(1);
        } else if (e.target === lightbox || e.target.closest('.lightbox-content')) {
            closeLightbox();
        }
    });

    window.addEventListener('keydown', (e) => { 
        if (lightbox?.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') navigate(1);
            if (e.key === 'ArrowLeft') navigate(-1);
        }
    });

    // 6. Final Kickoff
    if (thumbnails.length > 0) {
        // If mobile, we select the project BUT pass a flag or handle the pause
        selectProject(0); 
        
        if (isMobile) {
            // Re-enforce the pause immediately after selection
            previews.forEach(v => {
                v.pause();
                v.currentTime = 0;
            });
        }
    }

    if (languages.length > 0 && !isMobile) activateTech(0, false);
});