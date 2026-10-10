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
        document.getElementById("modalLink").href = card.dataset.link || '#';

        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; 
    };

    const closeModal = () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    };

    cards.forEach(card => card.addEventListener("click", () => openModal(card)));
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    
    window.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
});