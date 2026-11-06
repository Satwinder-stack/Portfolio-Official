document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("badgeModal");
    const cards = document.querySelectorAll(".badge-card");
    const closeBtn = document.querySelector(".close-btn");

    if (!modal) return;

    const openModal = (card) => {
        const img = card.querySelector("img").src;
        document.getElementById("modalImg").src = img;
        document.getElementById("modalTitle").innerText = card.dataset.title || '';
        document.getElementById("modalPurpose").innerText = card.dataset.purpose || '';
        document.getElementById("modalLearned").innerText = card.dataset.learned || '';
        document.getElementById("modalDate").innerText = card.dataset.date || '';
        document.getElementById("modalLang").innerText = card.dataset.lang || '';
        const link = document.getElementById("modalLink");
        link.href = card.dataset.link || '#';
        link.style.display = card.dataset.link ? '' : 'none';

        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; 
    };

    const closeModal = () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    };

    cards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', card.dataset.title || 'Badge details');
        card.addEventListener("click", () => openModal(card));
        card.addEventListener("keydown", (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(card);
            }
        });
    });
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    
    window.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
});