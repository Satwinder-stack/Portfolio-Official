if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

const scrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
scrollToTop();
window.addEventListener('load', scrollToTop);








































document.addEventListener('DOMContentLoaded', () => {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const previews = document.querySelectorAll('.preview-media');
    const detailsPanels = document.querySelectorAll('.project-details');
    const carousel = document.querySelector('.carousel-container');
    const languages = document.querySelectorAll('.language');
    const leftArrow = document.querySelector('.nav-arrow.left');
    const rightArrow = document.querySelector('.nav-arrow.right');
    const projectCards = document.querySelectorAll('.project-card');
    // Target the specific wrapper and its unique trigger
    const trigger = document.querySelector('#sticky-trigger');
    const secondWrapper = document.querySelector('.second-tech-stack-wrapper');
    const img = document.getElementById('lightbox-img');
    let scale = 1;
    const minScale = 1;
    const maxScale = 4;
    const projectLightbox = document.getElementById('project-lightbox');
    const collabSection = document.querySelector('.collaboration');


    function typeTechStack(projectContainer) {
        const icons = projectContainer.querySelectorAll('.tech-icon');
        const TOTAL_DURATION = 1500; // All icons will finish typing in 1.5 seconds

        icons.forEach((icon) => {
            if (!icon.dataset.fullText) {
                const iconElement = icon.querySelector('i');
                const textStr = icon.textContent.trim();
                icon.dataset.fullText = textStr;
                icon.dataset.iconHTML = iconElement ? iconElement.outerHTML : '';
            }

            const fullText = icon.dataset.fullText;
            const iconHTML = icon.dataset.iconHTML;
            if (icon.typeTimeout) clearTimeout(icon.typeTimeout);

            icon.innerHTML = `
                <span class="tech-ghost">${iconHTML} ${fullText}</span>
                <span class="tech-typing typing-cursor">${iconHTML} <span class="letters"></span></span>
            `;

            const letterSpan = icon.querySelector('.letters');
            const typingWrapper = icon.querySelector('.tech-typing');
            let charIndex = 0;
            
            // Calculate speed based on length so they finish together
            const speed = TOTAL_DURATION / fullText.length;

            function startTyping() {
                if (charIndex <= fullText.length) {
                    letterSpan.textContent = fullText.substring(0, charIndex);
                    charIndex++;
                    typingWrapper.classList.add('typing-cursor');
                    icon.typeTimeout = setTimeout(startTyping, speed); 
                } else {
                    typingWrapper.classList.remove('typing-cursor');
                    icon.typeTimeout = setTimeout(() => {
                        charIndex = 0;
                        letterSpan.textContent = '';
                        startTyping();
                    }, 3000); 
                }
            }
            // Removed index staggered start - start immediately
            startTyping();
        });
    }



















    function typeCollabHeadings() {
        const headings = document.querySelectorAll('.collaboration h2');
        const TOTAL_DURATION = 2000; // Titles are longer, giving them 2 seconds

        headings.forEach((h2) => {
            if (!h2.dataset.fullText) {
                h2.dataset.fullText = h2.textContent.trim();
            }
            const fullText = h2.dataset.fullText;
            if (h2.typeTimeout) clearTimeout(h2.typeTimeout);

            h2.innerHTML = `
                <div class="collab-type-container">
                    <span class="collab-ghost">${fullText}</span>
                    <span class="collab-typing collab-cursor"><span class="letters"></span></span>
                </div>
            `;

            const letterSpan = h2.querySelector('.letters');
            const typingWrapper = h2.querySelector('.collab-typing');
            let charIndex = 0;
            const speed = TOTAL_DURATION / fullText.length;

            function runCollabLoop() {
                if (charIndex <= fullText.length) {
                    letterSpan.textContent = fullText.substring(0, charIndex);
                    charIndex++;
                    typingWrapper.classList.add('collab-cursor');
                    h2.typeTimeout = setTimeout(runCollabLoop, speed);
                } else {
                    typingWrapper.classList.remove('collab-cursor');
                    h2.typeTimeout = setTimeout(() => {
                        charIndex = 0;
                        letterSpan.textContent = '';
                        runCollabLoop();
                    }, 3000);
                }
            }
            runCollabLoop(); // No index-based delay
        });
    }






















    // --- Trigger logic for your Carousel ---
    // Call this function whenever your carousel changes projects
    function onProjectChange(index) {
        const activeProject = document.querySelector(`#project-${index + 1}`);
        if (activeProject) {
            typeTechStack(activeProject);
        }
    }
    
    const collabObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeCollabHeadings();
                // We stop observing after it starts so it doesn't 
                // re-initialize every time you scroll up/down
                collabObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });


    function typeProjectTitles() {
        const projectTitles = document.querySelectorAll('.project-content h3');
        const TOTAL_DURATION = 1500;

        projectTitles.forEach((h3) => {
            if (!h3.dataset.fullText) {
                h3.dataset.fullText = h3.textContent.trim();
            }
            const fullText = h3.dataset.fullText;
            if (h3.typeTimeout) clearTimeout(h3.typeTimeout);

            h3.innerHTML = `
                <div class="project-type-container">
                    <span class="project-ghost">${fullText}</span>
                    <span class="project-typing project-cursor"><span class="letters"></span></span>
                </div>
            `;

            const letterSpan = h3.querySelector('.letters');
            const typingWrapper = h3.querySelector('.project-typing');
            let charIndex = 0;
            const speed = TOTAL_DURATION / fullText.length;

            function runProjectLoop() {
                if (charIndex <= fullText.length) {
                    letterSpan.textContent = fullText.substring(0, charIndex);
                    charIndex++;
                    typingWrapper.classList.add('project-cursor');
                    h3.typeTimeout = setTimeout(runProjectLoop, speed); 
                } else {
                    typingWrapper.classList.remove('project-cursor');
                    h3.typeTimeout = setTimeout(() => {
                        charIndex = 0;
                        letterSpan.textContent = '';
                        runProjectLoop();
                    }, 3000);
                }
            }
            runProjectLoop();
        });
    }

    typeProjectTitles();
    const firstProject = document.querySelector('#project-1');
    if (firstProject) {
        typeTechStack(firstProject);
    }

    if (collabSection) collabObserver.observe(collabSection);
































    projectLightbox.addEventListener('click', function(e) {
        // Only for mobile/tablet
        if (window.innerWidth > 1024) return;
        
        // Don't navigate if clicking the close button or the image (since it zooms)
        if (e.target.classList.contains('close-lightbox') || e.target === img) return;

        const screenWidth = window.innerWidth;
        const clickX = e.clientX;

        // Use your actual functions defined at the bottom of your script
        if (clickX < screenWidth / 2) {
            prevImg(e); 
        } else {
            nextImg(e);
        }
    });

    // --- Helper: Update Transform Origin ---
    function updateOrigin(x, y) {
        // Convert pixel coordinates to percentages for the origin
        const rect = img.getBoundingClientRect();
        const offsetX = ((x - rect.left) / rect.width) * 100;
        const offsetY = ((y - rect.top) / rect.height) * 100;
        
        img.style.transformOrigin = `${offsetX}% ${offsetY}%`;
    }

    // --- DESKTOP: Zoom at Mouse Location ---
    img.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        // Set the origin to the current mouse position
        updateOrigin(e.clientX, e.clientY);

        const delta = e.deltaY > 0 ? -0.3 : 0.3;
        scale = Math.min(Math.max(minScale, scale + delta), maxScale);
        img.style.transform = `scale(${scale})`;
    }, { passive: false });

    // --- MOBILE/TABLET: Zoom at Pinch Center ---
    let initialDist = -1;

    img.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            
            // Find the midpoint between two fingers
            const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            
            updateOrigin(midX, midY);

            const dist = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );

            if (initialDist > 0) {
                const delta = (dist - initialDist) / 80; // Slightly higher sensitivity for touch
                scale = Math.min(Math.max(minScale, scale + delta), maxScale);
                img.style.transform = `scale(${scale})`;
            }
            initialDist = dist;
        }
    });

    img.addEventListener('touchend', () => { initialDist = -1; });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // entry.isIntersecting means the trigger IS on screen.
            // !entry.isIntersecting means the trigger has scrolled ABOVE the top.
            if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                secondWrapper.classList.add('is-stuck');
            } else {
                secondWrapper.classList.remove('is-stuck');
            }
        });
    }, {
        threshold: 0,
        rootMargin: "0px 0px 0px 0px" 
    });

    if (trigger) observer.observe(trigger); 
    const collaborationSection = document.querySelector('.collaboration');

    const hideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the collaboration section is visible on screen
            if (entry.isIntersecting) {
                secondWrapper.classList.add('force-hide');
            } else {
                // If we scroll back up, show the tech stack again
                secondWrapper.classList.remove('force-hide');
            }
        });
    }, {
        threshold: 0, // Trigger as soon as the very top of .collaboration appears
        rootMargin: "0px 0px -10% 0px" // Optional: Adjust this to trigger earlier/later
    });

    if (collaborationSection && secondWrapper) {
        hideObserver.observe(collaborationSection);
    }






    

    let isDown = false;
    let startY;
    let scrollTop;
    let isDragging = false;

    const selectProject = (index) => {
        previews.forEach((vid, i) => {
            if (i === index) {
                vid.classList.add('active');
                const playPromise = vid.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => { /* Silent catch */ });
                }
            } else {
                vid.classList.remove('active');
                vid.pause();
                vid.currentTime = 0;
            }
        });

        // Handle Details & Thumbnails
        detailsPanels.forEach((panel, i) => panel.classList.toggle('active', i === index));
        thumbnails.forEach((t, i) => t.classList.toggle('active', i === index));

        // Center thumbnail in carousel
        const thumb = thumbnails[index];
        if (thumb && carousel) {
            const scrollPos = (thumb.offsetTop - carousel.offsetTop) - (carousel.clientHeight / 2) + (thumb.clientHeight / 2);
            carousel.scrollTo({ top: scrollPos, behavior: 'smooth' });
        }

        // --- ADD THIS LINE HERE ---
        onProjectChange(index); 
    };
    

    // --- 2. CAROUSEL DRAG LOGIC ---
    if (carousel) {
        const startDragging = (e) => {
            isDown = true;
            isDragging = false;
            carousel.classList.add('active-dragging');
            startY = (e.pageY || e.touches[0].pageY) - carousel.offsetTop;
            scrollTop = carousel.scrollTop;
        };

        const stopDragging = () => {
            isDown = false;
            carousel.classList.remove('active-dragging');
        };

        const move = (e) => {
            if (!isDown) return;
            const y = (e.pageY || e.touches[0].pageY) - carousel.offsetTop;
            const walk = (y - startY) * 1.5;
            if (Math.abs(walk) > 5) isDragging = true;
            carousel.scrollTop = scrollTop - walk;
        };

        carousel.addEventListener('mousedown', startDragging);
        carousel.addEventListener('mouseleave', stopDragging);
        carousel.addEventListener('mouseup', stopDragging);
        carousel.addEventListener('mousemove', (e) => { e.preventDefault(); move(e); });
        carousel.addEventListener('touchstart', startDragging, { passive: true });
        carousel.addEventListener('touchend', stopDragging);
        carousel.addEventListener('touchmove', move, { passive: true });
    }

    thumbnails.forEach((thumb, i) => {
        thumb.addEventListener('click', () => {
            if (!isDragging) selectProject(i);
        });
    });

    // --- 3. TECH STACK FILTERING LOGIC ---
    // --- 3. TECH STACK FILTERING LOGIC ---
    let currentTechIndex = 0;

    const triggerAbsoluteWave = (idx) => {
        // Use the 'languages' array you already defined at the top of your script
        // and map them to their parent '.tech-icon' containers
        const allIcons = Array.from(languages).map(img => img.closest('.tech-icon'));
        
        // Combine into the physical sequence: [LeftArrow, Icons..., RightArrow]
        const fullSequence = [leftArrow, ...allIcons, rightArrow].filter(el => el !== null);
        
        // Find the index of the specific icon we just activated within that sequence
        const epicenterIndex = fullSequence.indexOf(allIcons[idx]);

        fullSequence.forEach((el, i) => {
            // 1. Remove the class first
            el.classList.remove('pulse-active');
            
            // 2. Reset the animation delay
            el.style.animationDelay = '0s'; 
            
            // 3. TRIGGER REFLOW: This is the "magic" that allows the animation to restart
            void el.offsetWidth; 

            // 4. Calculate distance and re-apply
            const distance = Math.abs(epicenterIndex - i);
            el.style.animationDelay = `${distance * 0.1}s`; // Faster ripple
            el.classList.add('pulse-active');
        });
    };





















    const activateTech = (idx, shouldWave = true) => {
        if (!languages[idx]) return;

        const selectedTech = languages[idx].dataset.tech.toLowerCase();
        
        if (shouldWave) triggerAbsoluteWave(idx);

        // --- Destination Logic ---
        if (shouldWave) { 
            const projects = document.querySelectorAll('.project-details');
            const destination = document.getElementById('here');
            let projectIndex = -1;

            // 1. Still find the index of the matching project to update the UI
            for (let i = 0; i < projects.length; i++) {
                const projectIcons = projects[i].querySelectorAll('.tech-icon');
                const hasMatch = Array.from(projectIcons).some(icon => 
                    icon.textContent.trim().toLowerCase().includes(selectedTech)
                );

                if (hasMatch) {
                    projectIndex = i;
                    break; 
                }
            }

            // 2. Scroll to the "here" DIV
            if (destination) {
                // If we found a matching project, sync the carousel/view first
                if (projectIndex !== -1 && typeof selectProject === "function") {
                    selectProject(projectIndex);
                }

                const stickyOffset = 100; // Adjust based on your sticky header height
                const elementPosition = destination.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: elementPosition - stickyOffset,
                    behavior: 'smooth'
                });
            }
        }

        // --- Icon & Grid Styling (Rest of your existing code) ---
        languages.forEach((img, i) => {
            const iconParent = img.closest('.tech-icon');
            if (i === idx) {
                iconParent.classList.add('active');
                img.style.transform = 'scale(1.2)';
                img.style.filter = 'brightness(1.35) drop-shadow(0 0 16px rgba(64,196,255,0.85))';
                img.style.opacity = '1';
            } else {
                iconParent.classList.remove('active');
                img.style.transform = 'scale(0.88)';
                img.style.filter = 'blur(2px) brightness(0.55)';
                img.style.opacity = '0.6';
            }
        });

        projectCards.forEach(card => {
            const tags = (card.dataset.tags || '').toLowerCase().split(/\s+/);
            if (tags.includes(selectedTech)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
        currentTechIndex = idx;
    };








    // Arrow Listeners (Updated to trigger the wave from the NEW icon)
    if (leftArrow) leftArrow.addEventListener('click', () => {
        currentTechIndex = (currentTechIndex - 1 + languages.length) % languages.length;
        activateTech(currentTechIndex);
    });

    if (rightArrow) rightArrow.addEventListener('click', () => {
        currentTechIndex = (currentTechIndex + 1) % languages.length;
        activateTech(currentTechIndex);
    });

    languages.forEach((img, idx) => {
        img.parentElement.addEventListener('click', () => activateTech(idx));
    });

    // --- INITIALIZATION ---
    if (thumbnails.length > 0) selectProject(0);
    // Init without wave on load to prevent jarring start
    if (languages.length > 0) activateTech(0, false);








    // --- LIGHTBOX LOGIC ---
    const lightbox = document.getElementById('project-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');
    const lArrow = document.querySelector('.nav-arrow-lightbox.left');
    const rArrow = document.querySelector('.nav-arrow-lightbox.right');

    let currentGallery = [];
    let imgIndex = 0;

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            // Get images from the data-gallery attribute, or use the main img if empty
            const galleryData = card.getAttribute('data-gallery');
            const mainImg = card.querySelector('img').src;
            
            currentGallery = galleryData ? galleryData.split(',') : [mainImg];
            imgIndex = 0;

            updateLightbox();
            lightbox.style.display = 'flex';
        });
    });

    const updateLightbox = () => {
        lightboxImg.src = currentGallery[imgIndex];
    };

    const nextImg = (e) => {
        e.stopPropagation();
        imgIndex = (imgIndex + 1) % currentGallery.length;
        updateLightbox();
    };

    const prevImg = (e) => {
        e.stopPropagation();
        imgIndex = (imgIndex - 1 + currentGallery.length) % currentGallery.length;
        updateLightbox();
    };

    rArrow.addEventListener('click', nextImg);
    lArrow.addEventListener('click', prevImg);

    // Close on X or background click
    closeBtn.addEventListener('click', () => lightbox.style.display = 'none');
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.style.display = 'none';
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowRight') nextImg(e);
            if (e.key === 'ArrowLeft') prevImg(e);
            if (e.key === 'Escape') lightbox.style.display = 'none';
        }
    });
});