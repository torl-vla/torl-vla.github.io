const sectionLinks = Array.from(document.querySelectorAll('.page-toc a[href^="#"]'));
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function setActiveSection(id) {
  sectionLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
}

if ('IntersectionObserver' in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    },
    {
      rootMargin: '-22% 0px -58% 0px',
      threshold: [0.08, 0.2, 0.45, 0.7],
    },
  );

  sections.forEach((section) => observer.observe(section));
}

const videoPlayers = Array.from(document.querySelectorAll('[data-video-player]'));

function formatMediaTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

videoPlayers.forEach((player) => {
  const video = player.querySelector('video');
  const seek = player.querySelector('.video-seek');
  const playToggle = player.querySelector('[data-play-toggle]');
  const fullscreenToggle = player.querySelector('[data-fullscreen-toggle]');
  const currentTime = player.querySelector('[data-current-time]');
  const durationTime = player.querySelector('[data-duration]');
  if (!video || !seek) return;

  let isScrubbing = false;

  function hasDuration() {
    return Number.isFinite(video.duration) && video.duration > 0;
  }

  function setSeekProgress(value) {
    const max = Number(seek.max) || 1000;
    const progress = Math.max(0, Math.min(100, (Number(value) / max) * 100));
    seek.style.setProperty('--seek-progress', `${progress}%`);
  }

  function updateTimeLabels() {
    if (currentTime) currentTime.textContent = formatMediaTime(video.currentTime);
    if (durationTime) durationTime.textContent = formatMediaTime(video.duration);
  }

  function updatePlaybackButton() {
    if (!playToggle) return;
    playToggle.textContent = video.paused ? 'Play' : 'Pause';
    playToggle.setAttribute('aria-label', video.paused ? 'Play project video' : 'Pause project video');
  }

  function updateSeekFromVideo() {
    if (!hasDuration()) {
      updateTimeLabels();
      setSeekProgress(0);
      return;
    }

    const nextValue = (video.currentTime / video.duration) * Number(seek.max);
    if (!isScrubbing) seek.value = String(nextValue);
    setSeekProgress(seek.value);
    updateTimeLabels();
  }

  function seekFromSlider() {
    if (!hasDuration()) return;
    const ratio = Number(seek.value) / Number(seek.max);
    video.currentTime = Math.max(0, Math.min(video.duration, ratio * video.duration));
    setSeekProgress(seek.value);
    updateTimeLabels();
  }

  function togglePlayback() {
    if (video.paused) {
      const playPromise = video.play();
      if (playPromise) playPromise.catch(() => updatePlaybackButton());
      return;
    }
    video.pause();
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      player.requestFullscreen?.();
      return;
    }
    document.exitFullscreen?.();
  }

  video.addEventListener('loadedmetadata', updateSeekFromVideo);
  video.addEventListener('durationchange', updateSeekFromVideo);
  video.addEventListener('timeupdate', updateSeekFromVideo);
  video.addEventListener('seeking', updateSeekFromVideo);
  video.addEventListener('seeked', updateSeekFromVideo);
  video.addEventListener('play', updatePlaybackButton);
  video.addEventListener('pause', updatePlaybackButton);
  video.addEventListener('ended', updatePlaybackButton);
  video.addEventListener('click', togglePlayback);

  playToggle?.addEventListener('click', togglePlayback);
  fullscreenToggle?.addEventListener('click', toggleFullscreen);

  seek.addEventListener('pointerdown', () => {
    isScrubbing = true;
  });
  seek.addEventListener('pointerup', () => {
    seekFromSlider();
    isScrubbing = false;
    updateSeekFromVideo();
  });
  seek.addEventListener('input', () => {
    isScrubbing = true;
    seekFromSlider();
  });
  seek.addEventListener('change', () => {
    seekFromSlider();
    isScrubbing = false;
  });

  updateSeekFromVideo();
  updatePlaybackButton();
});

function jumpToHashTarget() {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - 18;
  window.scrollTo(0, top);
  document.documentElement.scrollTop = top;
  document.body.scrollTop = top;
  setActiveSection(target.id);
}

window.addEventListener('load', () => {
  window.setTimeout(jumpToHashTarget, 80);
  window.setTimeout(jumpToHashTarget, 700);
});
