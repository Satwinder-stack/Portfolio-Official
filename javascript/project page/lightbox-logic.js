// --- 5. LIGHTBOX LOGIC ---
const lightbox = document.getElementById('project-lightbox'); // Matches your HTML
const lightboxImg = document.getElementById('lightbox-img');   // Matches your HTML
const closeBtn = document.querySelector('.close-lightbox');
const leftArrowLB = document.querySelector('.nav-arrow-lightbox.left');
const rightArrowLB = document.querySelector('.nav-arrow-lightbox.right');

let currentGallery = [];
let currentIndex = 0;

const openLightbox = (index) => {
    if (!lightbox || !lightboxImg || currentGallery.length === 0) return;
    
    currentIndex = index;
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

const nextImg = (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % currentGallery.length;
    lightboxImg.src = currentGallery[currentIndex];
};

const prevImg = (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    lightboxImg.src = currentGallery[currentIndex];
};

// 1. Gather all images into a gallery array and attach listeners
previews.forEach((media, index) => {
    if (media.tagName === 'IMG') {
        currentGallery.push(media.src);
        
        // Use the index from the gallery array
        const galleryIdx = currentGallery.length - 1;
        media.style.cursor = 'zoom-in';
        media.addEventListener('click', () => openLightbox(galleryIdx));
    }
});

// 2. Event Listeners for Navigation
if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
if (leftArrowLB) leftArrowLB.addEventListener('click', prevImg);
if (rightArrowLB) rightArrowLB.addEventListener('click', nextImg);

lightbox?.addEventListener('click', (e) => { 
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        closeLightbox(); 
    }
});

window.addEventListener('keydown', (e) => { 
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImg(e);
    if (e.key === 'ArrowLeft') prevImg(e);
});