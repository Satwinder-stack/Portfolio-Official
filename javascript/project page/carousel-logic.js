// Featured projects: the thumbnail strip is a tab list. Selecting a tab shows that project's
// demo video and details panel; arrow keys, Home and End move between tabs.
// Each panel's walkthrough chapters jump the demo to that feature and follow playback.
const initCarousel = (previews, detailsPanels, thumbnails, carousel) => {
    const isMobile = window.innerWidth <= 768;
    const stage = document.querySelector('.pj-fx-stage');
    let current = 0;
    let inView = false;

    // Autoplay (desktop only) waits until the showcase is on screen, so the large demo
    // videos are not downloaded for visitors who never scroll to them
    // On phones nothing autoplays, but a video the visitor started keeps playing while in view
    const syncPlayback = () => {
        previews.forEach((vid, i) => {
            if (i !== current || !inView) vid.pause();
            else if (!isMobile) vid.play().catch(() => {});
        });
    };
    if (stage && 'IntersectionObserver' in window) {
        new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
            syncPlayback();
        }, { threshold: 0.35 }).observe(stage);
    }

    const selectProject = (index, { focus = false } = {}) => {
        current = index;
        previews.forEach((vid, i) => {
            vid.classList.toggle('is-active', i === index);
            if (i !== index && vid.currentTime) vid.currentTime = 0;
        });
        syncPlayback();

        detailsPanels.forEach((panel, i) => { panel.hidden = i !== index; });

        thumbnails.forEach((t, i) => {
            const isActive = i === index;
            t.classList.toggle('is-active', isActive);
            t.setAttribute('aria-selected', String(isActive));
            t.tabIndex = isActive ? 0 : -1;
        });

        const thumb = thumbnails[index];
        if (thumb && carousel && carousel.scrollWidth > carousel.clientWidth) {
            // Keep the selected thumbnail in view inside the strip without scrolling the page
            const left = thumb.offsetLeft - (carousel.clientWidth - thumb.clientWidth) / 2;
            carousel.scrollTo({ left, behavior: 'smooth' });
        }
        if (focus && thumb) thumb.focus({ preventScroll: true });
    };

    thumbnails.forEach((thumb, i) => {
        thumb.addEventListener('click', () => selectProject(i));
        thumb.addEventListener('keydown', (e) => {
            const last = thumbnails.length - 1;
            const next = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: last }[e.key];
            if (next === undefined) return;
            e.preventDefault();
            selectProject((next + thumbnails.length) % thumbnails.length, { focus: true });
        });
    });

    const seek = (video, time) => {
        const go = () => {
            video.currentTime = time;
            video.play().catch(() => {});
        };
        if (video.readyState >= 1) go();
        else {
            video.addEventListener('loadedmetadata', go, { once: true });
            video.preload = 'metadata';
            video.load();
        }
        // On stacked layouts the video sits above the panel; bring it into view
        const r = stage ? stage.getBoundingClientRect() : null;
        if (r && (r.top < 0 || r.bottom > window.innerHeight)) {
            stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    detailsPanels.forEach((panel, i) => {
        const video = previews[i];
        const chapters = [...panel.querySelectorAll('.pj-fx-chapter')];
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
                    const end = times[k + 1] ?? video.duration ?? start + 1;
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
        chapters.forEach((c, k) => c.addEventListener('click', () => seek(video, times[k])));
    });

    return { selectProject };
};
