const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('header nav');

toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});


/**
 * THEME ENGINE: Absolute Session Lock
 * Automation by default, manual override persists until tab closes.
 */

const body = document.body;
const html = document.documentElement;

function syncThemeClasses(isLight) {
    // Apply to both HTML and BODY to prevent any CSS specificity issues
    if (isLight) {
        html.classList.add('light-theme');
        body.classList.add('light-theme');
    } else {
        html.classList.remove('light-theme');
        body.classList.remove('light-theme');
    }
}

function updateUI(isInitialLoad = false) {
    const isLight = body.classList.contains('light-theme');
    
    // 1. Update Button Text
    document.querySelectorAll('.mode-text').forEach(label => {
        label.textContent = isLight ? 'LIGHT' : 'NIGHT';
    });

    // 2. Define our strings
    const descText = isLight 
        ? "Most of my mornings start the same way: a decent cup of coffee and a bit of quiet before the day gets busy. I spend my time building things that actually work by turning messy ideas into something clean and usable."
        : "There's something about the environment being quiet that makes it easier to focus. I usually do my best work at night — just me, a keyboard, and enough coffee to finally figure out a solution.";
    
    const quoteText = isLight
        ? "“One coffee at a time, one problem solved at a time.”"
        : "“The best ideas usually show up when everyone else is asleep.”";

    // 3. Target Elements
    const description = document.querySelector('.descriptionHome');
    const quote = document.querySelector('.quote');

    if (isInitialLoad) {
        // Direct swap on load (no animation needed for splash/loading phase)
        if (description) description.textContent = descText;
        if (quote) quote.textContent = quoteText;
    } else {
        // Cinematic swap on toggle
        fadeAndSwap(description, descText);
        fadeAndSwap(quote, quoteText);
    }
}

// Add this to your JS file
function fadeAndSwap(element, newText) {
    if (!element) return;

    // 1. Fade out
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.4s ease';

    // 2. Wait for fade out to finish
    setTimeout(() => {
        element.textContent = newText;
        // 3. Fade back in
        element.style.opacity = '1';
    }, 400); 
}

function initTheme() {
    const savedTheme = sessionStorage.getItem('selectedTheme');
    const isManual = sessionStorage.getItem('themeManualOverride') === 'true';

    if (isManual && savedTheme) {
        // Force saved preference
        syncThemeClasses(savedTheme === 'light-theme');
    } else {
        // Follow the clock
        const hour = new Date().getHours();
        const isDaytime = hour >= 6 && hour < 18;
        syncThemeClasses(isDaytime);
    }
    
    updateUI(true);
}

function handleThemeToggle() {
    const isCurrentlyLight = body.classList.contains('light-theme');
    const nextThemeIsLight = !isCurrentlyLight;

    // 1. Immediate Visual Sync
    syncThemeClasses(nextThemeIsLight);
    
    // 2. Lock the Session
    sessionStorage.setItem('themeManualOverride', 'true');
    sessionStorage.setItem('selectedTheme', nextThemeIsLight ? 'light-theme' : 'dark-theme');
    
    // 3. Update Text/Animations
    updateUI(false);
}

// Check automation every 30s (only runs if no manual override)
setInterval(() => {
    if (sessionStorage.getItem('themeManualOverride') !== 'true') {
        const hour = new Date().getHours();
        const isDaytime = hour >= 6 && hour < 18;
        if (body.classList.contains('light-theme') !== isDaytime) {
            syncThemeClasses(isDaytime);
            updateUI(false);
        }
    }
}, 30000);

document.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('#theme-toggle, #sidebar-theme-toggle, .mode-text');
    if (themeBtn) handleThemeToggle();
});

document.addEventListener('DOMContentLoaded', initTheme);





























/**
 * HISTORICAL CHRONICLE - MAIN HANDLER
 */
function initAMVSplash() {
    const splash = document.getElementById('splash-screen');
    if (!splash || document.documentElement.classList.contains('splash-hidden')) {
        if (splash) splash.remove();
        return;
    }
    
    // 1. Session Check (Run this before anything else)
    if (sessionStorage.getItem('hasSeenSplash')) {
        splash.remove();
        return;
    }

    sessionStorage.setItem('hasSeenSplash', 'true');
    document.body.style.overflow = 'hidden';

    // 2. Start Animation IMMEDIATELY (Don't use window.addEventListener('load'))
    const hHand = document.getElementById('hour-hand');
    const mHand = document.getElementById('minute-hand');
    const sHand = document.getElementById('second-hand');

    // If for some reason the clock hands aren't in the HTML yet, stop.
    if (!hHand || !mHand || !sHand) return;

    const now = new Date();
    const targetSec = now.getSeconds();
    const targetMin = now.getMinutes();
    const targetHr = now.getHours() % 12;

    const targetTotalSeconds = (targetHr * 3600) + (targetMin * 60) + targetSec;
    const totalFinalSeconds = targetTotalSeconds + 43200; // +12 hours for spin

    let startTime = null;
    const duration = 5000; 

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const ease = 1 - Math.pow(1 - progress, 5);
        const currentSeconds = totalFinalSeconds * ease;

        sHand.style.transform = `rotate(${currentSeconds * 6}deg)`;
        mHand.style.transform = `rotate(${(currentSeconds / 60) * 6}deg)`;
        hHand.style.transform = `rotate(${(currentSeconds / 3600) * 30}deg)`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            splash.classList.add('freeze');
            setTimeout(() => {
                splash.classList.add('fade-out');
                setTimeout(() => {
                    document.body.style.overflow = '';
                }, 600);
                setTimeout(() => {
                    splash.remove();
                }, 1800); 
            }, 1200); 
        }
    }
    
    // Kick off the animation immediately
    requestAnimationFrame(animate);
}

// Keep this listener at the bottom
document.addEventListener('DOMContentLoaded', initAMVSplash);
























// 6. INITIALIZATION
function init() {

    if (isManualControl) {
        // If manual control is on, apply the saved preference instead of the time
        const savedTheme = sessionStorage.getItem('selectedTheme');
        if (savedTheme === 'light-theme') {
            body.classList.add('light-theme');
        } else {
            body.classList.remove('light-theme');
        }
        updateContent();
        updateButtonText();
    } else {
        // Otherwise, proceed with automation
        applyThemeBasedOnTime();
    }

    const pageWrapper = document.querySelector('.page-wrapper');
    const header = document.querySelector('header');
    if (pageWrapper && header) {
        pageWrapper.classList.add('animate-trigger');
        header.classList.add('animate-trigger');
    }
}

document.addEventListener('DOMContentLoaded', init);

// 7. 3D PARALLAX & MOUSE EFFECTS
let tX = 0, tY = 0, cX = 0, cY = 0;
document.addEventListener('mousemove', (e) => {
    body.style.setProperty('--mouse-x', e.clientX + 'px');
    body.style.setProperty('--mouse-y', e.clientY + 'px');
    tX = (e.clientX / window.innerWidth - 0.5) * 40; 
    tY = (e.clientY / window.innerHeight - 0.5) * 20;
});

function updateParallax() {
    cX += (tX - cX) * 0.08;
    cY += (tY - cY) * 0.08;
    body.style.setProperty('--parallax-x', cX + 'px');
    body.style.setProperty('--parallax-y', cY + 'px');
    requestAnimationFrame(updateParallax);
}
updateParallax();