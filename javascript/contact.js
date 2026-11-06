document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const resultText = document.getElementById('form-result');
    const isMobile = window.innerWidth < 768;

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            resultText.style.display = "block";
            resultText.innerHTML = "Processing...";
            resultText.style.color = "var(--text-muted)";

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(object)
                });

                if (response.status === 200) {
                    resultText.innerHTML = "✔ Message sent successfully!";
                    resultText.style.color = "var(--primary)";
                    contactForm.reset();
                } else {
                    throw new Error();
                }
            } catch (error) {
                resultText.innerHTML = "❌ Error. Please try again.";
                resultText.style.color = "#ff4d4d";
            } finally {
                setTimeout(() => {
                    resultText.style.display = "none";
                }, 5000);
            }
        });
    }

    // Live local time beside "Based in"
    const timeEl = document.querySelector('.ct-time');
    if (timeEl) {
        const fmt = new Intl.DateTimeFormat(document.documentElement.lang || 'en', { hour: 'numeric', minute: '2-digit', timeZone: timeEl.dataset.tz });
        const tick = () => { timeEl.textContent = fmt.format(new Date()); };
        tick();
        setInterval(tick, 30000);
    }
});
