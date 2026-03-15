const initLightbox = () => {
    const lightbox = document.getElementById('projectLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.close-lightbox');

    if (!lightbox || !lightboxImg) return;

    const openLightbox = (src) => {
        lightboxImg.src = src;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };

    const closeLightbox = () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
        lightboxImg.style.transform = 'scale(1)'; // Reset zoom
    };

    // Close on button, background click, or Escape key
    closeBtn?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

    // Desktop Zoom Logic
    lightboxImg.addEventListener('wheel', (e) => {
        e.preventDefault();
        let scale = parseFloat(lightboxImg.getAttribute('data-scale') || 1);
        scale += e.deltaY * -0.001;
        scale = Math.min(Math.max(.125, scale), 4);
        lightboxImg.style.transform = `scale(${scale})`;
        lightboxImg.setAttribute('data-scale', scale);
    }, { passive: false });

    return { openLightbox };
};