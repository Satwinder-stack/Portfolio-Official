const initCarousel = (previews, detailsPanels, thumbnails, carousel) => {
    const isMobile = window.innerWidth <= 768;

    const selectProject = (index) => {
        previews.forEach((vid, i) => {
            const isActive = i === index;
            vid.classList.toggle('active', isActive);
            
            if (isActive) {
                if (!isMobile) {
                    vid.play().catch(() => {});
                } else {
                    vid.pause();
                }
            } else {
                vid.pause();
                vid.currentTime = 0; 
            }
        });

        detailsPanels.forEach((panel, i) => {
            const isActive = i === index;
            panel.classList.toggle('active', isActive);
            panel.style.display = isActive ? 'block' : 'none';
        });

        thumbnails.forEach((t, i) => t.classList.toggle('active', i === index));

        if (thumbnails[index] && carousel) {
            const thumb = thumbnails[index];
            requestAnimationFrame(() => {
                const scrollPos = (thumb.offsetTop - carousel.offsetTop) - (carousel.clientHeight / 2) + (thumb.clientHeight / 2);
                carousel.scrollTo({ top: scrollPos, behavior: 'smooth' });
            });
        }

        const activeProject = document.querySelector(`#project-${index + 1}`);
        if (activeProject) {
            const techIcons = activeProject.querySelectorAll('.tech-icon');
            
            techIcons.forEach(icon => {
                if (icon.typeFrame) cancelAnimationFrame(icon.typeFrame);
                if (icon.typeTimeout) clearTimeout(icon.typeTimeout);
                
                icon.style.whiteSpace = 'nowrap';
                icon.style.display = 'inline-block';

                if (icon.dataset.fullText) {
                    const iconHTML = icon.dataset.iconHTML || '';
                    icon.innerHTML = `${iconHTML} ${icon.dataset.fullText}`;
                }
            });

            if (!isMobile && window.TypeEngine) {
                window.TypeEngine.run(techIcons, 1500);
            } else {
                techIcons.forEach(icon => {
                    icon.style.opacity = '1';
                    icon.style.visibility = 'visible';
                });
            }
        }
    };

    let isDown = false, startY, scrollTop, isDragging = false;
    
    const startDragging = (e) => {
        isDown = true; 
        isDragging = false;
        carousel.classList.add('active-dragging');
        startY = (e.pageY || (e.touches ? e.touches[0].pageY : 0)) - carousel.offsetTop;
        scrollTop = carousel.scrollTop;
    };

    const stopDragging = () => { 
        isDown = false; 
        carousel.classList.remove('active-dragging'); 
    };

    const move = (e) => {
        if (!isDown) return;
        const y = (e.pageY || (e.touches ? e.touches[0].pageY : 0)) - carousel.offsetTop;
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
        thumb.addEventListener('click', () => { 
            if (!isDragging) selectProject(i); 
        });
    });

    return { selectProject };
};