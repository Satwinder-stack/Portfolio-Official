/**
 * NAVIGATION & THEME ENGINE
 * Global handler for menus, themes, splash screens, and parallax.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. MENU TOGGLE
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('header nav');
    if (toggle && nav) {
        toggle.addEventListener('click', () => nav.classList.toggle('active'));
    }

    // 2. THEME ENGINE 
    const body = document.body;
    const html = document.documentElement;

    const syncThemeClasses = (isLight) => {
        html.classList.toggle('light-theme', isLight);
        body.classList.toggle('light-theme', isLight);
    };

    const updateUI = (isInitialLoad = false) => {
        const isLight = body.classList.contains('light-theme');
        
        // Update labels
        document.querySelectorAll('.mode-text').forEach(label => {
            label.textContent = isLight ? 'LIGHT' : 'NIGHT';
        });

        const descText = isLight 
            ? "Most of my mornings start the same way: a decent cup of coffee and a bit of quiet before the day gets busy. I spend my time building things that actually work by turning messy ideas into something clean and usable."
            : "There's something about the environment being quiet that makes it easier to focus. I usually do my best work at night — just me, a keyboard, and enough coffee to finally figure out a solution.";
        
        const quoteText = isLight
            ? "“One coffee at a time, one problem solved at a time.”"
            : "“The best ideas usually show up when everyone else is asleep.”";

        const description = document.querySelector('.descriptionHome');
        const quote = document.querySelector('.quote');

        if (isInitialLoad) {
            if (description) description.textContent = descText;
            if (quote) quote.textContent = quoteText;
        } else {
            fadeAndSwap(description, descText);
            fadeAndSwap(quote, quoteText);
        }
    };

    const fadeAndSwap = (element, newText) => {
        if (!element) return;
        element.style.opacity = '0';
        setTimeout(() => {
            element.textContent = newText;
            element.style.opacity = '1';
        }, 400);
    };

    const initTheme = () => {
        const savedTheme = sessionStorage.getItem('selectedTheme');
        const isManual = sessionStorage.getItem('themeManualOverride') === 'true';

        if (isManual && savedTheme) {
            syncThemeClasses(savedTheme === 'light-theme');
        } else {
            const hour = new Date().getHours();
            syncThemeClasses(hour >= 6 && hour < 18);
        }
        updateUI(true);
    };

    // Theme Toggle Handler
    document.addEventListener('click', (e) => {
        const themeBtn = e.target.closest('#theme-toggle, #sidebar-theme-toggle, .mode-text');
        if (themeBtn) {
            const isNextLight = !body.classList.contains('light-theme');
            syncThemeClasses(isNextLight);
            sessionStorage.setItem('themeManualOverride', 'true');
            sessionStorage.setItem('selectedTheme', isNextLight ? 'light-theme' : 'dark-theme');
            updateUI(false);
        }
    });

    // 3. SPLASH SCREEN (Clock Animation)
    const initAMVSplash = () => {
        const splash = document.getElementById('splash-screen');
        if (!splash || sessionStorage.getItem('hasSeenSplash')) {
            if (splash) splash.remove();
            return;
        }

        sessionStorage.setItem('hasSeenSplash', 'true');
        body.style.overflow = 'hidden';

        const hHand = document.getElementById('hour-hand');
        const mHand = document.getElementById('minute-hand');
        const sHand = document.getElementById('second-hand');
        if (!hHand || !mHand || !sHand) return;

        const now = new Date();
        const startTotalSecs = (now.getHours() % 12 * 3600) + (now.getMinutes() * 60) + now.getSeconds();
        const targetTotalSecs = startTotalSecs + 43200; // 12-hour spin

        let startTime = null;
        const duration = 5000;

        const animateClock = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 5);
            const currentSeconds = targetTotalSecs * ease;

            sHand.style.transform = `rotate(${currentSeconds * 6}deg)`;
            mHand.style.transform = `rotate(${(currentSeconds / 60) * 6}deg)`;
            hHand.style.transform = `rotate(${(currentSeconds / 3600) * 30}deg)`;

            if (progress < 1) {
                requestAnimationFrame(animateClock);
            } else {
                splash.classList.add('freeze');
                setTimeout(() => {
                    splash.classList.add('fade-out');
                    setTimeout(() => {
                        body.style.overflow = '';
                        splash.remove();
                    }, 1800);
                }, 1200);
            }
        };
        requestAnimationFrame(animateClock);
    };

    // Kickoff everything
    initTheme();
    initAMVSplash();

    // Trigger Entrance Animations
    const pageWrapper = document.querySelector('.page-wrapper');
    const header = document.querySelector('header');
    if (pageWrapper) pageWrapper.classList.add('animate-trigger');
    if (header) header.classList.add('animate-trigger');
});

/**
 * 4. PERFORMANCE PARALLAX (Mouse Effects)
 * Isolated from DOMContentLoaded for high-speed execution
 */
let tX = 0, tY = 0, cX = 0, cY = 0;
const bodyRef = document.body;

document.addEventListener('mousemove', (e) => {
    // Standard CSS variable update for hover effects
    bodyRef.style.setProperty('--mouse-x', `${e.clientX}px`);
    bodyRef.style.setProperty('--mouse-y', `${e.clientY}px`);
    
    // Target coordinates for parallax
    tX = (e.clientX / window.innerWidth - 0.5) * 40; 
    tY = (e.clientY / window.innerHeight - 0.5) * 20;
}, { passive: true });

function updateParallax() {
    // Smooth lerp animation
    cX += (tX - cX) * 0.08;
    cY += (tY - cY) * 0.08;
    bodyRef.style.setProperty('--parallax-x', `${cX}px`);
    bodyRef.style.setProperty('--parallax-y', `${cY}px`);
    requestAnimationFrame(updateParallax);
}
requestAnimationFrame(updateParallax);