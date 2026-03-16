document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector(".slider-wrapper");
    const slides = document.querySelectorAll(".slide");
    if (!wrapper || slides.length === 0) return;

    let index = 0;
    const isMobile = window.innerWidth < 768;

    const updateSlider = () => {
        wrapper.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
    };

    window.nextCert = () => {
        index = (index + 1) % slides.length;
        updateSlider();
    };

    window.prevCert = () => {
        index = (index - 1 + slides.length) % slides.length;
        updateSlider();
    };

    wrapper.addEventListener('click', (e) => {
        const clickedImg = e.target.closest('.slide');
        if (!clickedImg) return;

        const url = clickedImg.getAttribute('data-url');
        const target = clickedImg.getAttribute('data-target');
        
        if (!url) return;
        if (target === '_blank') {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            if (isMobile) {
                window.location.href = url;
            } else {
                document.body.style.opacity = '0';
                setTimeout(() => { window.location.href = url; }, 500);
            }
        }
    });
});