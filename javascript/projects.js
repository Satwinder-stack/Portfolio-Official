document.addEventListener('DOMContentLoaded', () => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const BREAKPOINT = 768;
    const isMobile = window.innerWidth <= BREAKPOINT;

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
    
    const lightbox = document.getElementById('project-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');
    const lbLeft = document.querySelector('.nav-arrow-lightbox.left');
    const lbRight = document.querySelector('.nav-arrow-lightbox.right');

    const { selectProject } = initCarousel(previews, detailsPanels, thumbnails, carousel);
    const { activateTech } = initTechFilter(languages, leftArrow, rightArrow, projectCards, selectProject);

    function initMobileVideoControls() {
        const isMobile = window.innerWidth <= 768;
        const videos = document.querySelectorAll('.preview-media');

        videos.forEach(video => {
            if (isMobile) {
                video.removeAttribute('autoplay');
                video.pause();
                video.currentTime = 0; 

                const link = video.closest('.video-link');
                if (link) {
                    link.addEventListener('click', function handleFirstTap(e) {
                        if (video.paused) {
                            e.preventDefault();
                            videos.forEach(v => v.pause());
                            
                            video.play();
                            
                        }
                    });
                }
            } else {
                if (video.classList.contains('active')) {
                    video.play().catch(() => {});
                }
            }
        });
    }

    initMobileVideoControls();
       
    if (thumbnails.length > 0) {
        selectProject(0); 
    }

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

    const stickyObserver = new IntersectionObserver(([entry]) => {
        secondWrapper?.classList.toggle('is-stuck', !entry.isIntersecting && entry.boundingClientRect.top < 0);
    }, { threshold: 0 });
    if (trigger) stickyObserver.observe(trigger);

    const hideObserver = new IntersectionObserver(([entry]) => {
        secondWrapper?.classList.toggle('force-hide', entry.isIntersecting);
    }, { threshold: 0, rootMargin: "0px 0px -10% 0px" });
    if (collabSection) hideObserver.observe(collabSection);

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

    if (thumbnails.length > 0) {
        selectProject(0); 
        
        if (isMobile) {
            previews.forEach(v => {
                v.pause();
                v.currentTime = 0;
            });
        }
    }

    if (languages.length > 0 && !isMobile) activateTech(0, false);
});