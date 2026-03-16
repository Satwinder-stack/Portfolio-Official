document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth < 768;

    if (!window.TypeEngine) return;

    const nameH1 = document.querySelector('.hero-text h1');
    const roleH2 = document.querySelector('.hero-text h2');

    if (nameH1) {
        if (isMobile) {
            nameH1.textContent = nameH1.dataset.fullText || nameH1.textContent.trim();
            if (roleH2) {
                roleH2.textContent = roleH2.dataset.fullText || roleH2.textContent.trim();
            }
        } else {
            window.TypeEngine.run(nameH1, nameH1.textContent.trim(), 80, () => {
                if (roleH2) {
                    window.TypeEngine.run(roleH2, roleH2.textContent.trim(), 120);
                }
            });
        }
    }

    const scrollTargets = document.querySelectorAll('.accomplished h1, .skill-header h1, .card h1, .description');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            
            if (entry.isIntersecting) {
                if (isMobile) {
                    el.style.opacity = "1"; 
                    return; 
                }

                if (el.dataset.isTyping !== "true") {
                    el.dataset.isTyping = "true";
                    const isDesc = el.classList.contains('description');
                    const text = el.dataset.fullText || el.textContent.trim();
                    el.dataset.fullText = text;

                    window.TypeEngine.run(el, text, isDesc ? 35 : 70, () => {
                        if (isDesc) {
                            setTimeout(() => {
                                el.dataset.isTyping = "false";
                                if (el.querySelector('.letters')) el.querySelector('.letters').textContent = '';
                            }, 5000);
                        }
                    });
                }
            } else if (!isMobile && !el.classList.contains('description')) {
                el.dataset.isTyping = "false";
                const letters = el.querySelector('.letters');
                if (letters) letters.textContent = '';
            }
        });
    }, { threshold: 0.2 });

    scrollTargets.forEach(target => observer.observe(target));

    const fxObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('fx-visible', entry.isIntersecting);
        });
    }, { rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.fx-reveal, .fx-rise').forEach(el => fxObserver.observe(el));
});