// Project case study: the walkthrough chapters jump the demo video to each feature,
// and the chapter being shown is highlighted (with a progress line) while it plays.
document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('.cs-demo video');
    const chapters = [...document.querySelectorAll('.cs-chapter')];
    if (!video || !chapters.length) return;
    const times = chapters.map(c => Number(c.dataset.time));

    const mark = () => {
        const t = video.currentTime;
        let active = -1;
        times.forEach((start, k) => { if (t >= start) active = k; });
        chapters.forEach((c, k) => {
            const on = k === active && (t > 0 || !video.paused);
            c.classList.toggle('is-current', on);
            if (on) {
                const end = times[k + 1] ?? video.duration;
                const progress = Math.min(1, Math.max(0, (t - times[k]) / ((end || t + 1) - times[k])));
                c.style.setProperty('--progress', progress.toFixed(3));
                c.setAttribute('aria-current', 'step');
            } else {
                c.style.removeProperty('--progress');
                c.removeAttribute('aria-current');
            }
        });
    };
    video.addEventListener('timeupdate', mark);
    video.addEventListener('seeked', mark);

    chapters.forEach((c, k) => c.addEventListener('click', () => {
        const go = () => {
            video.currentTime = times[k];
            video.play().catch(() => {});
        };
        if (video.readyState >= 1) go();
        else {
            video.addEventListener('loadedmetadata', go, { once: true });
            video.preload = 'metadata';
            video.load();
        }
        const r = video.getBoundingClientRect();
        if (r.top < 80 || r.bottom > innerHeight) video.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }));
});
