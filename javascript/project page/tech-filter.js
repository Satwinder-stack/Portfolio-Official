const initTechFilter = (languages, leftArrow, rightArrow, projectCards, selectProject) => {
    let currentTechIndex = 0;
    const isMobile = window.innerWidth < 768;

    const triggerWave = (idx) => {
        // MOBILE BYPASS: Don't run the pulse/wave sequence on mobile
        if (isMobile) return;

        const allIcons = Array.from(languages).map(img => img.closest('.tech-icon'));
        const fullSequence = [leftArrow, ...allIcons, rightArrow].filter(Boolean);
        const epicenterIndex = fullSequence.indexOf(allIcons[idx]);

        fullSequence.forEach((el, i) => {
            el.classList.remove('pulse-active');
            void el.offsetWidth; // Force reflow
            el.style.animationDelay = `${Math.abs(epicenterIndex - i) * 0.1}s`;
            el.classList.add('pulse-active');
        });
    };

    const activateTech = (idx, shouldWave = true) => {
        if (!languages[idx]) return;
        
        const selectedTech = languages[idx].dataset.tech.toLowerCase();
        
        // Only trigger wave if not mobile
        if (shouldWave) triggerWave(idx);

        // 1. PROJECT SYNC & SCROLL LOGIC
        if (shouldWave) {
            const projects = document.querySelectorAll('.project-details');
            const destination = document.getElementById('here');
            
            let projectIndex = Array.from(projects).findIndex(p => 
                Array.from(p.querySelectorAll('.tech-icon')).some(icon => 
                    icon.textContent.toLowerCase().includes(selectedTech))
            );

            if (projectIndex !== -1) {
                selectProject(projectIndex);
            }

            if (destination) {
                // On mobile, we use a 0ms delay for instant feedback
                setTimeout(() => {
                    destination.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }, isMobile ? 0 : 50); 
            }
        }

        // 2. STYLING THE TECH BAR
        languages.forEach((img, i) => {
            const parent = img.closest('.tech-icon');
            if (!parent) return;

            const isActive = i === idx;
            parent.classList.toggle('active', isActive);
            
            if (isActive) {
                img.style.transform = 'scale(1.2)';
                img.style.filter = 'brightness(1.35) drop-shadow(0 0 16px rgba(64,196,255,0.85))';
                img.style.opacity = '1';
            } else {
                img.style.transform = 'scale(0.88)';
                img.style.filter = isMobile ? 'none' : 'blur(1px) brightness(0.55)'; // Remove blur on mobile for perf
                img.style.opacity = '0.6';
            }
        });

        // 3. FILTERING PROJECT CARDS
        projectCards.forEach(card => {
            const tags = (card.dataset.tags || '').toLowerCase().split(/\s+/);
            const isMatch = tags.includes(selectedTech);
            
            card.style.display = isMatch ? 'block' : 'none';
            if (isMatch) {
                requestAnimationFrame(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                });
            }
        });

        currentTechIndex = idx;
    };

    // --- 4. EVENT LISTENERS ---
    leftArrow?.addEventListener('click', (e) => {
        e.stopPropagation();
        currentTechIndex = (currentTechIndex - 1 + languages.length) % languages.length;
        activateTech(currentTechIndex);
    });

    rightArrow?.addEventListener('click', (e) => {
        e.stopPropagation();
        currentTechIndex = (currentTechIndex + 1) % languages.length;
        activateTech(currentTechIndex);
    });

    languages.forEach((img, idx) => {
        const parent = img.closest('.tech-icon');
        if (parent) {
            parent.style.cursor = 'pointer';
            parent.addEventListener('click', (e) => {
                e.preventDefault();
                activateTech(idx);
            });
        }
    });

    return { activateTech };
};