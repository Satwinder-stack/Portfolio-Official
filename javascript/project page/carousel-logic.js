const initCarousel = (previews, detailsPanels, thumbnails, carousel) => {
    const selectProject = (index) => {
        previews.forEach((vid, i) => {
            const isActive = i === index;
            vid.classList.toggle('active', isActive);
            if (isActive) {
                vid.play().catch(() => {});
            } else {
                vid.pause();
                vid.currentTime = 0;
            }
        });

        detailsPanels.forEach((panel, i) => panel.classList.toggle('active', i === index));
        thumbnails.forEach((t, i) => t.classList.toggle('active', i === index));

        if (thumbnails[index] && carousel) {
            const thumb = thumbnails[index];
            const scrollPos = (thumb.offsetTop - carousel.offsetTop) - (carousel.clientHeight / 2) + (thumb.clientHeight / 2);
            carousel.scrollTo({ top: scrollPos, behavior: 'smooth' });
        }

        // Trigger typing for the newly active panel
        const activeProject = document.querySelector(`#project-${index + 1}`);
        if (activeProject) {
            TypeEngine.run(activeProject.querySelectorAll('.tech-icon'), 1500);
        }
    };

    // Drag Logic
    let isDown = false, startY, scrollTop, isDragging = false;
    const startDragging = (e) => {
        isDown = true; isDragging = false;
        carousel.classList.add('active-dragging');
        startY = (e.pageY || e.touches[0].pageY) - carousel.offsetTop;
        scrollTop = carousel.scrollTop;
    };
    const stopDragging = () => { isDown = false; carousel.classList.remove('active-dragging'); };
    const move = (e) => {
        if (!isDown) return;
        const y = (e.pageY || e.touches[0].pageY) - carousel.offsetTop;
        const walk = (y - startY) * 1.5;
        if (Math.abs(walk) > 5) isDragging = true;
        carousel.scrollTop = scrollTop - walk;
    };

    carousel.addEventListener('mousedown', startDragging);
    carousel.addEventListener('mousemove', (e) => { e.preventDefault(); move(e); });
    ['mouseleave', 'mouseup'].forEach(ev => carousel.addEventListener(ev, stopDragging));
    carousel.addEventListener('touchstart', startDragging, { passive: true });
    carousel.addEventListener('touchmove', move, { passive: true });
    carousel.addEventListener('touchend', stopDragging);

    thumbnails.forEach((thumb, i) => {
        thumb.addEventListener('click', () => { if (!isDragging) selectProject(i); });
    });

    return { selectProject };
};