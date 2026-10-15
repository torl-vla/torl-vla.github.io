const sectionLinks = Array.from(document.querySelectorAll('.page-toc a[href^="#"], .section-nav a[href^="#"]'));
const sections = [...new Set(sectionLinks.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean))]
  .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1);
let activeSectionId = '';
function setActiveSection(id) {
  if (id === activeSectionId) return;
  activeSectionId = id;
  const outlineLink = document.querySelector(`.page-toc a[href="#${id}"]`);
  const group = outlineLink?.closest('[data-toc-group]');
  document.querySelectorAll('[data-toc-group]').forEach(item => item.classList.toggle('is-active', item === group));
  const mainId = group?.dataset.tocGroup || id;
  sectionLinks.forEach(link => {
    const isActive = link.hash === `#${link.closest('.section-nav') ? mainId : id}`;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  const nav = document.querySelector('.section-nav');
  const current = nav?.querySelector('.active');
  if (current && nav.clientWidth && (current.offsetLeft < nav.scrollLeft || current.offsetLeft + current.offsetWidth > nav.scrollLeft + nav.clientWidth)) {
    nav.scrollTo({ left: Math.max(0, current.offsetLeft - 12), behavior: 'smooth' });
  }
}
function updateActiveSection() {
  const marker = Math.min(280, window.innerHeight * 0.3);
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= marker) current = section;
  }
  if (current) setActiveSection(current.id);
}
let scrollScheduled = false;
window.addEventListener('scroll', () => {
  if (scrollScheduled) return;
  scrollScheduled = true;
  requestAnimationFrame(() => { updateActiveSection(); scrollScheduled = false; });
}, { passive: true });
window.addEventListener('resize', updateActiveSection);
updateActiveSection();

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
  const muteToggle = player.querySelector('[data-mute-toggle]');
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

  function updateMuteButton() {
    if (!muteToggle) return;
    muteToggle.textContent = video.muted ? 'Unmute' : 'Mute';
    muteToggle.setAttribute('aria-label', video.muted ? 'Unmute project video' : 'Mute project video');
    muteToggle.setAttribute('aria-pressed', String(video.muted));
  }

  function updateFullscreenButton() {
    if (!fullscreenToggle) return;
    const expanded = document.fullscreenElement === player || player.classList.contains('is-expanded');
    fullscreenToggle.textContent = expanded ? 'Exit' : 'Full';
    fullscreenToggle.setAttribute('aria-label', expanded ? 'Exit fullscreen project video' : 'Fullscreen project video');
  }

  function setExpanded(expanded) {
    player.classList.toggle('is-expanded', expanded);
    document.body.classList.toggle('video-expanded', Boolean(document.querySelector('.video-frame.is-expanded')));
    updateFullscreenButton();
  }

  async function toggleFullscreen() {
    if (player.classList.contains('is-expanded')) {
      setExpanded(false);
      return;
    }
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    if (player.requestFullscreen) {
      try {
        await player.requestFullscreen();
        return;
      } catch {
        // Embedded browsers may deny native fullscreen; keep an expanded view available.
      }
    }
    setExpanded(true);
  }

  video.addEventListener('loadedmetadata', updateSeekFromVideo);
  video.addEventListener('durationchange', updateSeekFromVideo);
  video.addEventListener('timeupdate', updateSeekFromVideo);
  video.addEventListener('seeking', updateSeekFromVideo);
  video.addEventListener('seeked', updateSeekFromVideo);
  video.addEventListener('play', updatePlaybackButton);
  video.addEventListener('pause', updatePlaybackButton);
  video.addEventListener('ended', updatePlaybackButton);
  video.addEventListener('volumechange', updateMuteButton);
  video.addEventListener('click', togglePlayback);

  playToggle?.addEventListener('click', togglePlayback);
  fullscreenToggle?.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', updateFullscreenButton);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && player.classList.contains('is-expanded')) setExpanded(false);
  });
  muteToggle?.addEventListener('click', () => {
    video.muted = !video.muted;
  });

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
  updateMuteButton();
  updateFullscreenButton();
});


document.querySelectorAll('[data-supplement-tabs]').forEach(group => {
  const tabs = [...group.querySelectorAll('[data-tab-target]')];
  const panels = [...group.querySelectorAll('[data-tab-panel]')];
  if (!tabs.length || !panels.length) return;
  function activatePanel(target) {
    group.querySelectorAll('video').forEach(video => video.pause());
    tabs.forEach(tab => {
      const active = tab.dataset.tabTarget === target;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => {
      const active = panel.dataset.tabPanel === target;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
      panel.querySelectorAll('video').forEach(video => {
        video.preload = active ? 'metadata' : 'none';
        if (active && video.readyState === 0) video.load();
      });
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activatePanel(tab.dataset.tabTarget));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      tabs[next].focus();
      activatePanel(tabs[next].dataset.tabTarget);
    });
  });
  activatePanel(tabs.find(tab => tab.classList.contains('active'))?.dataset.tabTarget || tabs[0].dataset.tabTarget);
});

window.addEventListener('load', () => {
  const target = document.getElementById(window.location.hash.slice(1));
  if (target) {
    const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anchor-offset')) || 24;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'instant' });
  }
  updateActiveSection();
});

const figureViewer = document.getElementById('figure-viewer');
if (figureViewer) {
  const viewerImage = figureViewer.querySelector('[data-viewer-image]');
  const viewerTitle = document.getElementById('figure-viewer-title');
  const viewerCaption = figureViewer.querySelector('[data-viewer-caption]');
  const pdfLink = figureViewer.querySelector('[data-viewer-pdf]');
  const zoomButton = figureViewer.querySelector('[data-viewer-zoom]');
  function setFigureZoom(zoomed) {
    figureViewer.classList.toggle('is-zoomed', zoomed);
    zoomButton.textContent = zoomed ? 'Fit to view' : 'Zoom in';
    zoomButton.setAttribute('aria-pressed', String(zoomed));
  }
  document.querySelectorAll('[data-figure-viewer]').forEach(trigger => {
    trigger.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (typeof figureViewer.showModal !== 'function') return;
      event.preventDefault();
      const image = trigger.querySelector('img');
      const imageWidth = image.naturalWidth || Number(image.getAttribute('width')) || 1600;
      const imageHeight = image.naturalHeight || Number(image.getAttribute('height')) || 900;
      figureViewer.style.setProperty('--figure-ratio', String(imageWidth / imageHeight));
      viewerImage.src = image.currentSrc || image.src;
      viewerImage.alt = image.alt;
      viewerTitle.textContent = image.alt || 'Figure detail';
      viewerCaption.textContent = trigger.closest('figure')?.querySelector('figcaption')?.textContent || '';
      pdfLink.hidden = trigger.tagName !== 'A';
      if (!pdfLink.hidden) pdfLink.href = trigger.href;
      else pdfLink.removeAttribute('href');
      setFigureZoom(false);
      figureViewer.showModal();
      document.body.classList.add('viewer-open');
    });
  });
  zoomButton.addEventListener('click', () => setFigureZoom(!figureViewer.classList.contains('is-zoomed')));
  figureViewer.querySelector('[data-viewer-close]').addEventListener('click', () => figureViewer.close());
  figureViewer.addEventListener('click', event => { if (event.target === figureViewer) figureViewer.close(); });
  figureViewer.addEventListener('close', () => {
    document.body.classList.remove('viewer-open');
    setFigureZoom(false);
    viewerImage.removeAttribute('src');
  });
}
