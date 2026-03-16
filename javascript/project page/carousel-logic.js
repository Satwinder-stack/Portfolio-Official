const initCarousel = (previews, detailsPanels, thumbnails, carousel) => {
    const isMobile = window.innerWidth < 768;

    const selectProject = (index) => {
        // Use the isMobile variable defined at the top of initCarousel
        // 1. Toggle Preview Media (Videos/Images)
        previews.forEach((vid, i) => {
            const isActive = i === index;
            vid.classList.toggle('active', isActive);
            
            if (isActive) {
                // ONLY play if NOT on mobile
                if (!isMobile) {
                    vid.play().catch(() => {});
                } else {
                    // Force pause on mobile just to be safe
                    vid.pause();
                }
            } else {
                vid.pause();
                vid.currentTime = 0;
            }
        });

        // 2. Toggle Project Details Panels
        detailsPanels.forEach((panel, i) => {
            const isActive = i === index;
            panel.classList.toggle('active', isActive);
            
            if (isActive) {
                panel.style.display = 'block'; 
            } else {
                panel.style.display = 'none';
            }
        });

        // 3. Toggle Thumbnails
        thumbnails.forEach((t, i) => t.classList.toggle('active', i === index));

        // 4. Center active thumbnail
        if (thumbnails[index] && carousel) {
            const thumb = thumbnails[index];
            const scrollPos = (thumb.offsetTop - carousel.offsetTop) - (carousel.clientHeight / 2) + (thumb.clientHeight / 2);
            carousel.scrollTo({ top: scrollPos, behavior: 'smooth' });
        }

        // 5. Tech Icon Restoration
        const activeProject = document.querySelector(`#project-${index + 1}`);
        if (activeProject) {
            const techIcons = activeProject.querySelectorAll('.tech-icon');
            
            techIcons.forEach(icon => {
                // Kill existing animation loops
                if (icon.typeFrame) cancelAnimationFrame(icon.typeFrame);
                if (icon.typeTimeout) clearTimeout(icon.typeTimeout);
                
                icon.style.whiteSpace = 'nowrap';
                icon.style.display = 'inline-block';

                // Restore static content immediately
                if (icon.dataset.fullText) {
                    const iconHTML = icon.dataset.iconHTML || '';
                    icon.innerHTML = `${iconHTML} ${icon.dataset.fullText}`;
                }
            });

            // DISABLE TYPING ON MOBILE
            if (!isMobile && window.TypeEngine) {
                window.TypeEngine.run(techIcons, 1500);
            } else {
                // On mobile, ensure they are fully visible immediately
                techIcons.forEach(icon => {
                    icon.style.opacity = '1';
                    icon.style.visibility = 'visible';
                });
            }
        }
    };

    // --- Drag Logic (Unchanged as it's purely functional) ---
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