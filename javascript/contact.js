document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const resultText = document.getElementById('form-result');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // UI Feedback
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
                // Auto-hide using a single timer
                setTimeout(() => {
                    resultText.style.display = "none";
                }, 5000);
            }
        });
    }
});

/**
 * TESTIMONIAL ENGINE
 * Optimized to prevent image flicker
 */
const testimonials = [
    {
      photo: "../images/mark.jpg",
      quoteContact: "Watching Satwinder code is kind of mesmerizing. They make the impossible seem simple, and they're always ready to help when I’m stuck.",
      author: "Mark De Jesus | Project Manager"
    },
    {
      photo: "../images/karl.jpg",
      quoteContact: "Satwinder has an incredible eye for UI/UX. The interfaces he builds are both beautiful and highly functional. Pleasure to work with!",
      author: "Karl Guiao | UI Designer"
    },
    {
      photo: "../images/redge.jpg",
      quoteContact: "Clean code, great communication, fast delivery. Exactly what every frontend developer wants in a collaborator. Highly recommend!",
      author: "Redge Galang | Web Developer"
    }
];

function showTestimonial(index) {
    const photoEl = document.getElementById("current-photo");
    const quoteEl = document.getElementById("current-quote");
    const authorEl = document.getElementById("current-author");
    const btns = document.querySelectorAll(".thumb-btn");

    if (!photoEl || !quoteEl) return;

    // Use opacity for smoother transition if your CSS supports it
    photoEl.src = testimonials[index].photo;
    quoteEl.textContent = `"${testimonials[index].quoteContact}"`;
    authorEl.textContent = "— " + testimonials[index].author;

    btns.forEach((btn, i) => {
        btn.classList.toggle("active", i === index);
    });
}