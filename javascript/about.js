

const items = document.querySelectorAll('.skill-item');
const display = document.querySelector('.skills-display');
const wrapper = document.querySelector('.skills-wrapper');

let activeItem = null;


function typeHeroText() {
    const heroElements = document.querySelectorAll('.hero-text h1, .hero-text h2');

    heroElements.forEach((el, index) => {
        if (!el.dataset.fullText) {
            el.dataset.fullText = el.textContent.trim();
        }

        const fullText = el.dataset.fullText;
        if (el.typeTimeout) clearTimeout(el.typeTimeout);

        el.innerHTML = `
            <div class="hero-type-container">
                <span class="hero-ghost">${fullText}</span>
                <span class="hero-typing hero-cursor"><span class="letters"></span></span>
            </div>
        `;

        const letterSpan = el.querySelector('.letters');
        const typingWrapper = el.querySelector('.hero-typing');
        let charIndex = 0;

        function runHeroOnce() {
            if (charIndex <= fullText.length) {
                letterSpan.textContent = fullText.substring(0, charIndex);
                charIndex++;
                typingWrapper.classList.add('hero-cursor');
                const speed = el.tagName === 'H1' ? 80 : 120;
                el.typeTimeout = setTimeout(runHeroOnce, speed);
            } else {
                // STOP HERE: Just remove the cursor, do not reset
                typingWrapper.classList.remove('hero-cursor');
            }
        }

        // Staggered start: Name starts first, Title starts after 800ms
        el.typeTimeout = setTimeout(runHeroOnce, index * 800);
    });
}

function typeHeroDescription() {
    const desc = document.querySelector('.description');
    if (!desc) return;

    if (!desc.dataset.fullText) {
        desc.dataset.fullText = desc.textContent.trim();
    }

    const fullText = desc.dataset.fullText;
    if (desc.typeTimeout) clearTimeout(desc.typeTimeout);

    desc.innerHTML = `
        <div class="desc-type-container">
            <span class="desc-ghost">${fullText}</span>
            <span class="desc-typing desc-cursor"><span class="letters"></span></span>
        </div>
    `;

    const letterSpan = desc.querySelector('.letters');
    const typingWrapper = desc.querySelector('.desc-typing');
    let charIndex = 0;

    function runDescLoop() {
        if (charIndex <= fullText.length) {
            letterSpan.textContent = fullText.substring(0, charIndex);
            charIndex++;
            typingWrapper.classList.add('desc-cursor');
            desc.typeTimeout = setTimeout(runDescLoop, 35); 
        } else {
            typingWrapper.classList.remove('desc-cursor');
            // LOOP HERE: Reset after 5 seconds
            desc.typeTimeout = setTimeout(() => {
                charIndex = 0;
                letterSpan.textContent = '';
                runDescLoop();
            }, 5000); 
        }
    }

    // Starts after the name and title are finished (approx 2.5s)
    desc.typeTimeout = setTimeout(runDescLoop, 2500);
}

function setupHeroObserver() {
    const desc = document.querySelector('.description');
    if (!desc) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start the typing loop
                typeHeroDescription(); 
                // STOP watching this element so it never resets/clears
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    observer.observe(desc);
}

function typeSkillsAndAccomplishments() {
    // Select all accomplishment H1s and skill-header H1s
    const targetElements = document.querySelectorAll('.accomplished h1, .skill-header h1');

    targetElements.forEach((el, index) => {
        if (!el.dataset.fullText) {
            el.dataset.fullText = el.textContent.trim();
        }

        const fullText = el.dataset.fullText;
        if (el.typeTimeout) clearTimeout(el.typeTimeout);

        el.innerHTML = `
            <div class="skill-type-container">
                <span class="skill-ghost">${fullText}</span>
                <span class="skill-typing skill-cursor"><span class="letters"></span></span>
            </div>
        `;

        const letterSpan = el.querySelector('.letters');
        const typingWrapper = el.querySelector('.skill-typing');
        let charIndex = 0;

        function runOnce() {
            if (charIndex <= fullText.length) {
                letterSpan.textContent = fullText.substring(0, charIndex);
                charIndex++;
                typingWrapper.classList.add('skill-cursor');
                el.typeTimeout = setTimeout(runOnce, 70); // Crisp, fast typing
            } else {
                typingWrapper.classList.remove('skill-cursor');
            }
        }

        // Stagger the start so they type one after another down the list
        el.typeTimeout = setTimeout(runOnce, index * 300);
    });
}

function setupScrollTyping() {
    const targets = document.querySelectorAll('.accomplished h1, .skill-header h1');

    const observerOptions = {
        threshold: 0.5 // Trigger when at least 50% of the H1 is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            
            if (entry.isIntersecting) {
                // START TYPING
                startTypingElement(el);
            } else {
                // RESET: Clear timers and text when it leaves the screen
                if (el.typeTimeout) clearTimeout(el.typeTimeout);
                const letterSpan = el.querySelector('.letters');
                if (letterSpan) letterSpan.textContent = '';
                el.dataset.isTyping = "false"; 
            }
        });
    }, observerOptions);

    targets.forEach(t => {
        // Prepare the structure once
        if (!t.dataset.fullText) {
            t.dataset.fullText = t.textContent.trim();
            t.innerHTML = `
                <div class="skill-type-container">
                    <span class="skill-ghost">${t.dataset.fullText}</span>
                    <span class="skill-typing skill-cursor"><span class="letters"></span></span>
                </div>
            `;
        }
        observer.observe(t);
    });
}

function startTypingElement(el) {
    // Prevent restarting if it's already mid-animation
    if (el.dataset.isTyping === "true") return;
    el.dataset.isTyping = "true";

    const fullText = el.dataset.fullText;
    const letterSpan = el.querySelector('.letters');
    const typingWrapper = el.querySelector('.skill-typing');
    let charIndex = 0;

    function run() {
        if (charIndex <= fullText.length) {
            letterSpan.textContent = fullText.substring(0, charIndex);
            charIndex++;
            typingWrapper.classList.add('skill-cursor');
            el.typeTimeout = setTimeout(run, 70);
        } else {
            typingWrapper.classList.remove('skill-cursor');
        }
    }
    run();
}



function setupCardTyping() {
    const cardHeaders = document.querySelectorAll('.card h1');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            
            if (entry.isIntersecting) {
                // Only start if not already typing
                if (el.dataset.isTyping !== "true") {
                    startCardTyping(el);
                }
            } else {
                // Reset when scrolled away
                if (el.typeTimeout) clearTimeout(el.typeTimeout);
                const letterSpan = el.querySelector('.letters');
                if (letterSpan) letterSpan.textContent = '';
                el.dataset.isTyping = "false";
            }
        });
    }, { threshold: 0.5 });

    cardHeaders.forEach(h1 => {
        if (!h1.dataset.fullText) {
            h1.dataset.fullText = h1.textContent.trim();
            h1.innerHTML = `
                <div class="card-type-container">
                    <span class="card-ghost">${h1.dataset.fullText}</span>
                    <span class="card-typing card-cursor"><span class="letters"></span></span>
                </div>
            `;
        }
        observer.observe(h1);
    });
}

function startCardTyping(el) {
    el.dataset.isTyping = "true";
    const fullText = el.dataset.fullText;
    const letterSpan = el.querySelector('.letters');
    const typingWrapper = el.querySelector('.card-typing');
    let charIndex = 0;

    function run() {
        if (charIndex <= fullText.length) {
            letterSpan.textContent = fullText.substring(0, charIndex);
            charIndex++;
            typingWrapper.classList.add('card-cursor');
            el.typeTimeout = setTimeout(run, 80);
        } else {
            typingWrapper.classList.remove('card-cursor');
        }
    }
    run();
}



















document.addEventListener('DOMContentLoaded', () => {
    // 1. One-time typing for Name and Title (Top of page)
    // These type once and stay there.
    typeHeroText(); 

    // 2. Scroll-based typing for the Hero Description
    // This will reset/clear if you scroll away and restart when you return.
    setupHeroObserver();

    // 3. Scroll-based typing for Accomplishments and Skill Headers
    // This replaces your old skillsObserver logic and handles the "reset on scroll"
    setupScrollTyping();
    setupCardTyping();   // Languages, Tools, OS, Frameworks

    // 4. (Optional) Run project titles if they exist on this page
    // typeProjectTitles();
});








items.forEach(item => {
  item.addEventListener('click', () => {

    if (window.innerWidth <= 767) {
      const isActive = item.classList.contains('active');

      items.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      item.classList.toggle('active', !isActive);
      return;
    }

    // ── Tablet & Desktop → side panel behavior ──
    const titleEl   = item.querySelector('.skill-header h1');
    const contentEl = item.querySelector('.skill-content');

    const title   = titleEl   ? titleEl.innerText   : '';
    const content = contentEl ? contentEl.innerText : '';

    if (activeItem === item) {
      wrapper.classList.remove('active');
      items.forEach(i => i.classList.remove('active'));
      display.innerHTML = '';
      activeItem = null;
      return;
    }

    items.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    activeItem = item;

    display.innerHTML = `
      <h2>${title}</h2>
      <p>${content}</p>
    `;

    wrapper.classList.add('active');
  });
});

const revealEls = document.querySelectorAll('.fx-reveal, .fx-rise');

// Toggle reveal on enter/exit without creating inner scroll contexts
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fx-visible');
      } else {
        entry.target.classList.remove('fx-visible');
      }
    });
  },
  {
    root: null,
    rootMargin: '5% 0px -10% 0px',
    threshold: 0,
  }
);

revealEls.forEach((el) => io.observe(el));




















// Select the slider wrapper and all slides
const wrapper1 = document.querySelector(".slider-wrapper");
const slides = wrapper1.querySelectorAll(".slide");

let index = 0; // current slide index

function nextCert() {
    index = (index + 1) % slides.length; // loop to start
    updateSlider();
}

function prevCert() {
    index = (index - 1 + slides.length) % slides.length; // loop to end
    updateSlider();
}

function updateSlider() {
    wrapper1.style.transform = `translateX(-${index * 100}%)`;
}
















document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("badgeModal");
    const cards = document.querySelectorAll(".badge-card");
    const closeBtn = document.querySelector(".close-btn");

    // FUNCTION: Open Modal smoothly
    const openModal = (card) => {
        // 1. Get data from clicked card
        const img = card.querySelector("img").src;
        const title = card.getAttribute("data-title");
        const purpose = card.getAttribute("data-purpose");
        const learned = card.getAttribute("data-learned");
        const date = card.getAttribute("data-date");
        const lang = card.getAttribute("data-lang");
        const link = card.getAttribute("data-link");

        // 2. Fill Modal content
        document.getElementById("modalImg").src = img;
        document.getElementById("modalTitle").innerText = title;
        document.getElementById("modalPurpose").innerText = purpose;
        document.getElementById("modalLearned").innerText = learned;
        document.getElementById("modalDate").innerText = date;
        document.getElementById("modalLang").innerText = lang;
        document.getElementById("modalLink").href = link;

        // 3. Trigger CSS Animation by adding class
        modal.classList.add('open');
    };

    // FUNCTION: Close Modal smoothly
    const closeModal = () => {
        modal.classList.remove('open');
    };

    // EVENT LISTENERS
    cards.forEach(card => {
        card.addEventListener("click", () => openModal(card));
    });

    closeBtn.addEventListener("click", closeModal);

    // Close when clicking outside the content area (on the background)
    window.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
    });

    // Handle 'Escape' key for accessibility/smoothness
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
});


document.querySelector('.slider-wrapper').addEventListener('click', (e) => {
    const clickedImg = e.target.closest('.slide');
    if (!clickedImg) return;

    const url = clickedImg.getAttribute('data-url');
    const target = clickedImg.getAttribute('data-target');
    
    if (!url) return;

    if (target === '_blank') {
        // ABSOLUTE NEW TAB: No loading screen needed
        window.open(url, '_blank', 'noopener,noreferrer');
    } else {
        // INTERNAL TRANSPORT: Trigger loading screen
        const loader = document.getElementById('page-transition-loader');
        const wrapper = document.querySelector('.page-wrapper');

        if (wrapper) wrapper.style.opacity = '0';
        
        if (loader) {
            loader.style.display = 'flex';
            setTimeout(() => { loader.style.opacity = '1'; }, 10);
        }

        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }
});