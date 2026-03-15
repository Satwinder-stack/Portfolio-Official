document.addEventListener('DOMContentLoaded', () => {
  makeDirectDrag('draggable-sidebar', '.drag-handle');
  if (window.innerWidth > 767) {
      makeDirectDrag('mobile-bottom-nav', null);
  }
  function makeDirectDrag(containerId, handleSelector) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const handle = handleSelector 
      ? container.querySelector(handleSelector) 
      : container;

    if (!handle) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    function pointerDown(e) {
      if (e.target.closest('a')) return;

      e.preventDefault();
      isDragging = true;

      const rect = container.getBoundingClientRect();

      const clientX = e.clientX || e.touches[0].clientX;
      const clientY = e.clientY || e.touches[0].clientY;
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;

      container.style.willChange = 'left, top';
      container.classList.add('dragging');

      document.addEventListener('mousemove', pointerMove);
      document.addEventListener('mouseup',   pointerUp);
      document.addEventListener('touchmove', pointerMove, { passive: false });
      document.addEventListener('touchend',  pointerUp,   { passive: false });
    }

    function pointerMove(e) {
      if (!isDragging) return;
      e.preventDefault();

      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);

      if (clientX === undefined || clientY === undefined) return;

      let newLeft = clientX - offsetX;
      let newTop  = clientY - offsetY;

      const w = container.offsetWidth;
      const h = container.offsetHeight;

      newLeft = Math.max(8, Math.min(window.innerWidth - w - 8, newLeft));
      newTop  = Math.max(8, Math.min(window.innerHeight - h - 40, newTop));

      container.style.left = newLeft + 'px';
      container.style.top  = newTop + 'px';
      container.style.transform = 'none';
    }

    function pointerUp() {
      if (!isDragging) return;

      isDragging = false;
      container.classList.remove('dragging');
      container.style.willChange = '';

      document.removeEventListener('mousemove', pointerMove);
      document.removeEventListener('mouseup',   pointerUp);
      document.removeEventListener('touchmove', pointerMove);
      document.removeEventListener('touchend',  pointerUp);
    }

    handle.addEventListener('mousedown', pointerDown);
    handle.addEventListener('touchstart', pointerDown, { passive: false });
  }

  const navLinks = document.querySelectorAll('.sidebar-link, .mobile-pill');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {

      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 140; 
        const yPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;

        window.scrollTo({
          top: yPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  let scrollTimer;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);

    scrollTimer = setTimeout(() => {
      let currentSection = '';

      const scrollOffset = 160;

      document.querySelectorAll('section[id]').forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= scrollOffset && rect.bottom >= scrollOffset) {
          currentSection = section.getAttribute('id');
        }
      });

      if (currentSection) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
        });
      }
    }, 100); 
  });

  window.dispatchEvent(new Event('scroll'));
});





