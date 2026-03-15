
const themeToggle = document.getElementById('theme-toggle');
const modeText = document.querySelector('.mode-text');

// 1. Function to sync Giscus comments with the current theme
const updateGiscusTheme = () => {
    const theme = document.body.classList.contains('light-theme') ? 'light' : 'transparent_dark';
    const iframe = document.querySelector('iframe.giscus-frame');
    
    if (!iframe) return;

    iframe.contentWindow.postMessage(
        { giscus: { setConfig: { theme: theme } } },
        'https://giscus.app'
    );
};

// 2. Function to apply the theme and update UI text
const applyTheme = (theme) => {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        if (modeText) modeText.textContent = 'DAY';
    } else {
        document.body.classList.remove('light-theme');
        if (modeText) modeText.textContent = 'NIGHT';
    }
    
    // Sync Giscus after a short delay to allow DOM transition
    setTimeout(updateGiscusTheme, 100);
};

// 3. Initialization: Check for saved preference on reload
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme);
} else {
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    if (prefersLight) applyTheme('light');
};

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isCurrentlyLight = document.body.classList.contains('light-theme');
        const newTheme = isCurrentlyLight ? 'dark' : 'light';
        
        // Save to localStorage so it remembers after reload
        localStorage.setItem('theme', newTheme);
        
        // Apply the changes
        applyTheme(newTheme);
    });
};

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            updateGiscusTheme();
        }
    });
});

const commentSection = document.querySelector('.comment-section');
if (commentSection) {
    observer.observe(commentSection, { childList: true, subtree: true });
};