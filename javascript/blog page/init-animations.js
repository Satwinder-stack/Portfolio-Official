document.addEventListener('DOMContentLoaded', () => {
    // Ensure TypeEngine is loaded
    if (!window.TypeEngine) return;

    // 1. HERO ANIMATIONS (Top of Page)
    const nameH1 = document.querySelector('.hero-text h1');
    const roleH2 = document.querySelector('.hero-text h2');

    if (nameH1) {
        // Start Name immediately
        window.TypeEngine.run(nameH1, nameH1.textContent.trim(), 80, () => {
            // Start Role only after Name finishes
            if (roleH2) {
                window.TypeEngine.run(roleH2, roleH2.textContent.trim(), 120);
            }
        });
    }

    // 2. SCROLL-BASED TYPING (Headers & Cards)
    const scrollTargets = document.querySelectorAll('.accomplished h1, .skill-header h1, .card h1, .description');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            
            if (entry.isIntersecting) {
                if (el.dataset.isTyping !== "true") {
                    el.dataset.isTyping = "true";
                    
                    // Logic: Description loops, others type once
                    const isDesc = el.classList.contains('description');
                    const text = el.dataset.fullText || el.textContent.trim();
                    el.dataset.fullText = text; // Cache it

                    window.TypeEngine.run(el, text, isDesc ? 35 : 70, () => {
                        if (isDesc) {
                            // Loop logic for description
                            setTimeout(() => {
                                el.dataset.isTyping = "false";
                                if (el.querySelector('.letters')) el.querySelector('.letters').textContent = '';
                                // The observer will re-trigger if still in view
                            }, 5000);
                        }
                    });
                }
            } else if (!el.classList.contains('description')) {
                // Reset non-looping titles when scrolled away
                el.dataset.isTyping = "false";
                const letters = el.querySelector('.letters');
                if (letters) letters.textContent = '';
            }
        });
    }, { threshold: 0.2 });

    scrollTargets.forEach(target => observer.observe(target));

    // 3. FADE-IN EFFECTS (Reveal/Rise)
    const fxObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('fx-visible', entry.isIntersecting);
        });
    }, { rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.fx-reveal, .fx-rise').forEach(el => fxObserver.observe(el));
});