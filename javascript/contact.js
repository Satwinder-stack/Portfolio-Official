const contactForm = document.getElementById('contact-form');
const resultText = document.getElementById('form-result');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    resultText.style.display = "block";
    resultText.innerHTML = "Processing...";
    resultText.style.color = "var(--text-muted)";

    fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            if (response.status == 200) {
                resultText.innerHTML = "✔ Message sent successfully!";
                resultText.style.color = "var(--primary)";
                contactForm.reset(); // Clears the inputs
            } else {
                resultText.innerHTML = "❌ Something went wrong.";
                resultText.style.color = "#ff4d4d";
            }
        })
        .catch(error => {
            resultText.innerHTML = "❌ Network error. Please try again.";
            resultText.style.color = "#ff4d4d";
        })
        .finally(() => {
            // Hide the message after 5 seconds so the UI stays clean
            setTimeout(() => {
                resultText.style.display = "none";
            }, 5000);
        });
});




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
    document.getElementById("current-photo").src = testimonials[index].photo;
    document.getElementById("current-quote").textContent = `"${testimonials[index].quoteContact}"`;
    document.getElementById("current-author").textContent = "— " + testimonials[index].author;

    const btns = document.querySelectorAll(".thumb-btn");
    btns.forEach((btn, i) => {
      btn.classList.toggle("active", i === index);
    });
  }


