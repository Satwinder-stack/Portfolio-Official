const initCarousel = (previews, detailsPanels, thumbnails, carousel) => {
    // Consistency: Using 768 to match your projects.js BREAKPOINT
    const isMobile = window.innerWidth <= 768;

    const selectProject = (index) => {
        // 1. Toggle Preview Media (Videos/Images)
        previews.forEach((vid, i) => {
            const isActive = i === index;
            vid.classList.toggle('active', isActive);
            
            if (isActive) {
                // Performance: Only autoplay on desktop to save mobile data/CPU
                if (!isMobile) {
                    vid.play().catch(() => {});
                } else {
                    vid.pause();
                }
            } else {
                vid.pause();
                vid.currentTime = 0; // Reset inactive videos to first frame
            }
        });

        // 2. Toggle Project Details Panels
        detailsPanels.forEach((panel, i) => {
            const isActive = i === index;
            panel.classList.toggle('active', isActive);
            panel.style.display = isActive ? 'block' : 'none';
        });

        // 3. Toggle Thumbnails
        thumbnails.forEach((t, i) => t.classList.toggle('active', i === index));

        // 4. Center active thumbnail (Optimized for Lighthouse)
        if (thumbnails[index] && carousel) {
            const thumb = thumbnails[index];
            // requestAnimationFrame prevents "Layout Thrashing/Forced Reflow"
            requestAnimationFrame(() => {
                const scrollPos = (thumb.offsetTop - carousel.offsetTop) - (carousel.clientHeight / 2) + (thumb.clientHeight / 2);
                carousel.scrollTo({ top: scrollPos, behavior: 'smooth' });
            });
        }

        // 5. Tech Icon Restoration & Animation Management
        const activeProject = document.querySelector(`#project-${index + 1}`);
        if (activeProject) {
            const techIcons = activeProject.querySelectorAll('.tech-icon');
            
            techIcons.forEach(icon => {
                // Cleanup: Kill existing animations to prevent memory leaks
                if (icon.typeFrame) cancelAnimationFrame(icon.typeFrame);
                if (icon.typeTimeout) clearTimeout(icon.typeTimeout);
                
                icon.style.whiteSpace = 'nowrap';
                icon.style.display = 'inline-block';

                // Instant Restore: Ensure content is present before animation starts
                if (icon.dataset.fullText) {
                    const iconHTML = icon.dataset.iconHTML || '';
                    icon.innerHTML = `${iconHTML} ${icon.dataset.fullText}`;
                }
            });

            // Conditional Execution: Typing effects are skipped on mobile for performance
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

    // --- Interaction Logic (Drag & Click) ---
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

    // Event Listeners
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