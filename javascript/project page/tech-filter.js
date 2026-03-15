const initTechFilter = (languages, leftArrow, rightArrow, projectCards, secondWrapper, selectProject) => {
    let currentTechIndex = 0;

    const triggerWave = (idx) => {
        const allIcons = Array.from(languages).map(img => img.closest('.tech-icon'));
        const fullSequence = [leftArrow, ...allIcons, rightArrow].filter(Boolean);
        const epicenterIndex = fullSequence.indexOf(allIcons[idx]);

        fullSequence.forEach((el, i) => {
            el.classList.remove('pulse-active');
            void el.offsetWidth; // Reflow
            el.style.animationDelay = `${Math.abs(epicenterIndex - i) * 0.1}s`;
            el.classList.add('pulse-active');
        });
    };

    const activateTech = (idx, shouldWave = true) => {
        if (!languages[idx]) return;
        const selectedTech = languages[idx].dataset.tech.toLowerCase();
        if (shouldWave) triggerWave(idx);

        // Sync with Carousel & Scroll
        if (shouldWave) {
            const projects = document.querySelectorAll('.project-details');
            const destination = document.getElementById('here');
            let projectIndex = Array.from(projects).findIndex(p => 
                Array.from(p.querySelectorAll('.tech-icon')).some(icon => 
                    icon.textContent.toLowerCase().includes(selectedTech))
            );

            if (destination) {
                if (projectIndex !== -1) selectProject(projectIndex);
                window.scrollTo({ top: destination.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth' });
            }
        }

        // Styling & Filtering
        languages.forEach((img, i) => {
            const parent = img.closest('.tech-icon');
            const isActive = i === idx;
            parent.classList.toggle('active', isActive);
            img.style.cssText = isActive 
                ? 'transform: scale(1.2); filter: brightness(1.35) drop-shadow(0 0 16px rgba(64,196,255,0.85)); opacity: 1;'
                : 'transform: scale(0.88); filter: blur(2px) brightness(0.55); opacity: 0.6;';
        });

        projectCards.forEach(card => {
            const isMatch = (card.dataset.tags || '').toLowerCase().split(/\s+/).includes(selectedTech);
            card.style.display = isMatch ? 'block' : 'none';
            card.style.opacity = isMatch ? '1' : '0';
            card.style.transform = isMatch ? 'scale(1)' : 'scale(0.95)';
        });
        currentTechIndex = idx;
    };

    leftArrow?.addEventListener('click', () => {
        currentTechIndex = (currentTechIndex - 1 + languages.length) % languages.length;
        activateTech(currentTechIndex);
    });
    rightArrow?.addEventListener('click', () => {
        currentTechIndex = (currentTechIndex + 1) % languages.length;
        activateTech(currentTechIndex);
    });
    languages.forEach((img, idx) => img.parentElement.addEventListener('click', () => activateTech(idx)));

    return { activateTech };
};