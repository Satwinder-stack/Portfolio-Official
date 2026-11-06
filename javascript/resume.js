document.addEventListener('DOMContentLoaded', () => {
    // The name, role and contact details render immediately (no typing effect).
    // Both download buttons (top of the page and the download section) show the
    // short thank-you modal while the PDF downloads.
    const isMobile = window.innerWidth <= 768;
    const modal = document.getElementById('download-modal');
    const fill = document.querySelector('.loading-bar-fill');
    if (!modal || !fill) return;

    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            fill.style.cssText = 'transition: none; width: 0%;';
            modal.classList.add('active');

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const duration = isMobile ? '3s' : '5s';
                    fill.style.transition = `width ${duration} linear`;
                    fill.style.width = '100%';
                });
            });

            setTimeout(() => {
                modal.classList.remove('active');
            }, isMobile ? 3000 : 5000);
        }, { passive: true });
    });
});
