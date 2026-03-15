document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector(".slider-wrapper");
    const slides = document.querySelectorAll(".slide");
    if (!wrapper || slides.length === 0) return;

    let index = 0;

    // Helper to move slider using GPU acceleration
    const updateSlider = () => {
        wrapper.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
    };

    // Attach to your navigation buttons if they exist
    window.nextCert = () => {
        index = (index + 1) % slides.length;
        updateSlider();
    };

    window.prevCert = () => {
        index = (index - 1 + slides.length) % slides.length;
        updateSlider();
    };

    // Handle the "Transport" click logic from earlier
    wrapper.addEventListener('click', (e) => {
        const clickedImg = e.target.closest('.slide');
        if (!clickedImg) return;

        const url = clickedImg.getAttribute('data-url');
        const target = clickedImg.getAttribute('data-target');
        
        if (!url) return;
        if (target === '_blank') {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            // Trigger your global loading screen logic here
            document.body.style.opacity = '0';
            setTimeout(() => { window.location.href = url; }, 500);
        }
    });
});