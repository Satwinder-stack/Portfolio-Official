document.addEventListener('DOMContentLoaded', () => {
    // Initialize dragging
    makeDirectDrag('draggable-sidebar', '.drag-handle');
    if (window.innerWidth > 767) {
        makeDirectDrag('mobile-bottom-nav', null);
    }

    function makeDirectDrag(containerId, handleSelector) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const handle = handleSelector ? container.querySelector(handleSelector) : container;
        if (!handle) return;

        let state = {
            isDragging: false,
            currentX: 0,
            currentY: 0,
            offsetX: 0,
            offsetY: 0,
            rafId: null
        };

        const updatePosition = () => {
            if (!state.isDragging) return;

            let newLeft = state.currentX - state.offsetX;
            let newTop = state.currentY - state.offsetY;

            // Constrain to viewport
            const w = container.offsetWidth;
            const h = container.offsetHeight;
            newLeft = Math.max(8, Math.min(window.innerWidth - w - 8, newLeft));
            newTop = Math.max(8, Math.min(window.innerHeight - h - 40, newTop));

            container.style.left = `${newLeft}px`;
            container.style.top = `${newTop}px`;
            container.style.transform = 'none';

            state.rafId = requestAnimationFrame(updatePosition);
        };

        function pointerDown(e) {
            if (e.target.closest('a')) return;

            state.isDragging = true;
            const rect = container.getBoundingClientRect();
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;

            state.offsetX = clientX - rect.left;
            state.offsetY = clientY - rect.top;

            container.style.willChange = 'left, top';
            container.classList.add('dragging');

            state.rafId = requestAnimationFrame(updatePosition);

            // Using capture: true for smoother event intake
            document.addEventListener('mousemove', pointerMove, { passive: false });
            document.addEventListener('mouseup', pointerUp);
            document.addEventListener('touchmove', pointerMove, { passive: false });
            document.addEventListener('touchend', pointerUp);
        }

        function pointerMove(e) {
            if (!state.isDragging) return;
            const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
            const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);

            if (clientX !== undefined) state.currentX = clientX;
            if (clientY !== undefined) state.currentY = clientY;
        }

        function pointerUp() {
            state.isDragging = false;
            cancelAnimationFrame(state.rafId);
            container.classList.remove('dragging');
            container.style.willChange = '';

            document.removeEventListener('mousemove', pointerMove);
            document.removeEventListener('mouseup', pointerUp);
            document.removeEventListener('touchmove', pointerMove);
            document.removeEventListener('touchend', pointerUp);
        }

        handle.addEventListener('mousedown', pointerDown);
        handle.addEventListener('touchstart', pointerDown, { passive: false });
    }

    /**
     * OPTIMIZED NAVIGATION & SCROLL SPY
     */
    const navLinks = document.querySelectorAll('.sidebar-link, .mobile-pill');
    
    // 1. Smooth Scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 140; 
                const yPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;

                window.scrollTo({ top: yPosition, behavior: 'smooth' });
            }
        });
    });

    // 2. Performance-First Scroll Spy using IntersectionObserver
    // This replaces the expensive window.addEventListener('scroll')
    const observerOptions = {
        rootMargin: '-140px 0px -70% 0px',
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('section[id]').forEach(section => navObserver.observe(section));
});