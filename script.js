/* ============================================================
   Deepa: The Forever Duo — main logic (v1.2 — hardened)
   State, loading, gating, BTS assets, music, animations,
   interactions, surprises. Flow is guarded against stale
   state and against a single failure breaking the chain.
   ============================================================ */

const STATE_KEY = 'deepa_site_state_v2';
let memState = null;

/* ---------- RESET HANDLING ---------- */
// Every visit starts at the beginning, while unrelated site storage is preserved.
try { localStorage.removeItem(STATE_KEY); } catch (e) {}
window.addEventListener('pageshow', (event) => {
  if (event.persisted) window.location.reload();
});

/* ---------- STATE ---------- */
function defaultState() {
  return {
    pinUnlocked: false,
    metDateCorrect: false,
    relationshipDateCorrect: false,
    finalSurpriseUnlocked: false,
    interactions: {
      reassurancePressed: 0,
      quizCompleted: false,
      buffStolen: false,
      galleryOpened: 0,
      letterRead: false,
      hugPressed: 0,
      spinnerLastSpin: 0,
      moodPicked: '',
      fearPicked: '',
      secretCornerTaps: 0,
      konamiDone: false,
      png13Taps: 0
    }
  };
}

function readStored() {
  try { return JSON.parse(localStorage.getItem(STATE_KEY)); } catch (e) { return null; }
}

function getState() {
  const raw = readStored() || memState;
  const base = defaultState();
  if (!raw) return base;
  return {
    ...base,
    ...raw,
    interactions: { ...base.interactions, ...(raw.interactions || {}) }
  };
}

function saveState(s) {
  memState = s;
  try { localStorage.setItem(STATE_KEY, JSON.stringify(s)); } catch (e) {}
  return s;
}

function setState(partial) {
  return saveState({ ...getState(), ...partial });
}

function setInteraction(key, value) {
  const s = getState();
  s.interactions[key] = value;
  saveState(s);
}

function hasInteractedEnough() {
  const i = getState().interactions;
  const count = [
    i.reassurancePressed > 0,
    i.quizCompleted,
    i.buffStolen,
    i.galleryOpened > 0,
    i.letterRead,
    i.hugPressed > 0,
    i.spinnerLastSpin > 0,
    i.moodPicked !== '',
    i.fearPicked !== ''
  ].filter(Boolean).length;
  return count >= 3;
}

/* ---------- UTILITIES ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function esc(v) {
  return String(v).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function typeWriter(el, text, speed = 45) {
  if (!el) return Promise.resolve();
  if (reducedMotion) { el.textContent = text; return Promise.resolve(); }
  return new Promise((resolve) => {
    const chars = Array.from(text);
    let i = 0;
    let timer;
    const node = document.createTextNode('');
    el.textContent = '';
    el.appendChild(node);
    function finish() {
      clearTimeout(timer);
      node.data = text;
      el._finish = null;
      resolve();
    }
    el._finish = finish;
    (function tick() {
      if (i >= chars.length) return finish();
      node.data += chars[i++];
      timer = setTimeout(tick, speed);
    })();
  });
}

function applyTexts() {
  $$('[data-text]').forEach((el) => {
    const path = el.dataset.text.split('.');
    const v = path.reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), CONFIG);
    if (typeof v === 'string') el.textContent = v;
  });
}

function smoothScrollTo(el) {
  if (!el) return;
  el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
}

function initCosmicAmbience() {
  const layer = $('#cosmicAmbience');
  if (!layer || layer.dataset.ready === 'true') return;
  layer.dataset.ready = 'true';
  if (reducedMotion) return;

  const hearts = document.createElement('div');
  hearts.className = 'cosmic-hearts';
  for (let i = 0; i < 18; i++) {
    const heart = document.createElement('span');
    heart.className = 'cosmic-heart';
    heart.textContent = i % 3 === 0 ? '♥' : '♡';
    heart.style.left = `${(i * 37 + 9) % 100}%`;
    heart.style.setProperty('--heart-size', `${13 + ((i * 7) % 15)}px`);
    heart.style.setProperty('--heart-duration', `${17 + ((i * 11) % 17)}s`);
    heart.style.setProperty('--heart-delay', `${-((i * 5) % 24)}s`);
    hearts.appendChild(heart);
  }
  layer.appendChild(hearts);
}

function toast(msg, extraClass) {
  const region = $('#toastRegion') || document.body;
  const t = document.createElement('div');
  t.className = 'toast';
  if (extraClass) t.classList.add(extraClass);
  t.setAttribute('role', 'status');
  t.textContent = msg;
  region.appendChild(t);
  void t.offsetWidth;
  t.classList.add('show');
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 500);
  }, 4800);
}

function heartBurst(parent) {
  if (reducedMotion || !parent) return;
  const rect = parent.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;';
  document.body.appendChild(box);
  for (let i = 0; i < 14; i++) {
    const h = document.createElement('span');
    h.textContent = Math.random() > 0.5 ? '💜' : '♡';
    h.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;font-size:${12 + Math.random() * 14}px;color:${Math.random() > 0.5 ? '#C2A3E1' : '#E8D5A3'};`;
    box.appendChild(h);
    const a = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
    const d = 55 + Math.random() * 85;
    h.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d - 35}px) scale(0.25)`, opacity: 0 }
    ], { duration: 1000, easing: 'cubic-bezier(0.2,0.6,0.3,1)', fill: 'forwards' });
  }
  setTimeout(() => box.remove(), 1100);
}

function initReveal() {
  const targets = $$('.reveal, .stagger, .timeline-item, .hero-card');
  if (!targets.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  targets.forEach((el) => io.observe(el));
}

/* ---------- BTS ASSET SYSTEM ---------- */
function getBtsBasePath() {
  return (CONFIG.btsAssets && CONFIG.btsAssets.basePath) || 'assets/bts/';
}

function preloadBtsAssets() {
  if (!CONFIG.btsAssets || CONFIG.btsAssets.preload === false) return;
  const base = getBtsBasePath();
  const paths = [];

  ['loading', 'pin', 'dates'].forEach((key) => {
    const group = CONFIG.btsAssets[key];
    if (group && Array.isArray(group.corners)) {
      group.corners.forEach((c) => paths.push(base + c.src));
    }
  });

  ['hero', 'btsLounge', 'quiz'].forEach((key) => {
    const group = CONFIG.btsAssets[key];
    if (group && Array.isArray(group.sides)) {
      group.sides.forEach((s) => paths.push(base + s.src));
    }
  });

  if (CONFIG.sections && CONFIG.sections.sideArt) {
    Object.values(CONFIG.sections.sideArt).forEach((spec) => {
      if (spec && spec.src) paths.push(base + spec.src);
    });
  }

  if (CONFIG.btsAssets.finalOverlay) {
    if (CONFIG.btsAssets.finalOverlay.negative) {
      paths.push(base + CONFIG.btsAssets.finalOverlay.negative.src);
    }
    if (CONFIG.btsAssets.finalOverlay.afterYes) {
      const reward = CONFIG.btsAssets.finalOverlay.afterYes;
      paths.push((reward.basePath || base) + reward.src);
    }
  }

  const unique = Array.from(new Set(paths));
  unique.forEach((src) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
  });
}

function applyBtsMobileFlags() {
  if (!CONFIG.btsAssets || !CONFIG.btsAssets.mobile) return;
  const m = CONFIG.btsAssets.mobile;
  if (m.hideCorners) document.body.classList.add('bts-hide-corners');
  if (m.hideSides) document.body.classList.add('bts-hide-sides');
  if (m.staticOnly) document.body.classList.add('bts-static');
}

function applyBtsImageSettings(img, spec) {
  if (!img || !spec) return img;
  const match = String(spec.src || '').match(/(?:^|\/)(\d+)\.png$/i);
  if (match) img.classList.add(`bts-png-${match[1].padStart(2, '0')}`);
  if (spec.className) {
    spec.className.split(/\s+/).filter(Boolean).forEach((name) => img.classList.add(name));
  }

  // Per-placement layout values can be CSS lengths (including calc/clamp).
  // A corresponding .bts-png-NN rule in style.css can override them by breakpoint.
  const layout = spec.layout || {};
  const vars = {
    width: '--bts-image-width',
    height: '--bts-image-height',
    top: '--bts-image-top',
    right: '--bts-image-right',
    bottom: '--bts-image-bottom',
    left: '--bts-image-left',
    rotation: '--bts-image-rotation',
  };
  Object.entries(vars).forEach(([key, variable]) => {
    if (layout[key] !== undefined && layout[key] !== null && layout[key] !== '') {
      img.style.setProperty(variable, String(layout[key]));
    }
  });
  if (layout.left && !layout.right) img.style.setProperty('--bts-image-right', 'auto');
  if (layout.right && !layout.left) img.style.setProperty('--bts-image-left', 'auto');
  if (layout.top && !layout.bottom) img.style.setProperty('--bts-image-bottom', 'auto');
  if (layout.bottom && !layout.top) img.style.setProperty('--bts-image-top', 'auto');
  if (layout.bottom) img.style.setProperty('--bts-image-translate-y', '0');
  return img;
}

function buildBtsCorner(spec, parent) {
  if (!spec || !parent) return null;
  const img = document.createElement('img');
  img.className = 'bts-corner ' + spec.corner;
  applyBtsImageSettings(img, spec);
  img.dataset.btsSrc = spec.src;
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  img.decoding = 'async';
  img.src = getBtsBasePath() + spec.src;
  if (spec.animation) img.setAttribute('data-anim', spec.animation);
  parent.appendChild(img);
  return img;
}

function buildBtsSide(spec, parent, side) {
  if (!spec || !parent) return null;
  const img = document.createElement('img');
  const resolvedSide = spec.side || side || 'left';
  img.className = 'bts-side ' + resolvedSide;
  applyBtsImageSettings(img, spec);
  img.dataset.btsSrc = spec.src;
  img.dataset.btsSide = resolvedSide;
  img.dataset.btsAnim = spec.animation || '';
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  img.decoding = 'async';
  img.src = getBtsBasePath() + spec.src;
  if (spec.animation) img.setAttribute('data-anim', spec.animation);
  parent.appendChild(img);
  return img;
}

function setBtsSectionSides(parent, specs, sectionClass) {
  if (!parent) return [];
  const expected = specs || [];
  const existing = Array.from(parent.querySelectorAll(':scope > .bts-side'));
  const isCurrent = existing.length === expected.length && expected.every((spec, index) =>
    existing[index].dataset.btsSrc === spec.src &&
    existing[index].dataset.btsSide === (spec.side || 'left') &&
    existing[index].dataset.btsAnim === (spec.animation || '') &&
    existing[index].classList.contains(sectionClass)
  );
  if (isCurrent) return existing;

  existing.forEach((img) => img.remove());
  return expected.map((spec) => buildBtsSide({
    ...spec,
    className: Array.from(new Set([spec.className, sectionClass].filter(Boolean))).join(' '),
  }, parent));
}

function initBtsCorners(group, parent) {
  if (!group || !parent) return;
  const specs = group.corners || [];
  const existing = parent.querySelectorAll('.bts-corner');
  const isCurrent = existing.length === specs.length && specs.every((spec, index) =>
    existing[index].dataset.btsSrc === spec.src &&
    existing[index].classList.contains(spec.corner)
  );
  if (isCurrent) return;
  existing.forEach((el) => el.remove());
  specs.forEach((spec) => buildBtsCorner(spec, parent));
}

function initBtsLoader() {
  const loader = document.getElementById('loader');
  if (!loader || !CONFIG.btsAssets || !CONFIG.btsAssets.loading) return;
  initBtsCorners(CONFIG.btsAssets.loading, loader);
}

function initBtsPin() {
  const gate = document.getElementById('pinGate');
  if (!gate || !CONFIG.btsAssets || !CONFIG.btsAssets.pin) return;
  initBtsCorners(CONFIG.btsAssets.pin, gate);
}

function initBtsDates() {
  const dates = document.getElementById('dateQuestions');
  if (!dates || !CONFIG.btsAssets || !CONFIG.btsAssets.dates) return;
  initBtsCorners(CONFIG.btsAssets.dates, dates);
}

function initBtsHero() {
  const hero = document.getElementById('heroSection');
  if (!hero || !CONFIG.btsAssets || !CONFIG.btsAssets.hero) return;
  const specs = CONFIG.btsAssets.hero.sides || [];
  const images = setBtsSectionSides(hero, specs, 'bts-art-hero');
  images.forEach((img, index) => {
    const spec = specs[index];
    if (img && CONFIG.easterEggs && CONFIG.easterEggs.png13Tap && spec.src === '13.png') {
      img.classList.add('bts-tappable');
      img.setAttribute('role', 'button');
      img.setAttribute('tabindex', '0');
      img.setAttribute('aria-label', 'A small secret');
      img.addEventListener('click', handlePng13Tap);
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePng13Tap();
        }
      });
    }
  });
}

function handlePng13Tap() {
  const egg = CONFIG.easterEggs && CONFIG.easterEggs.png13Tap;
  if (!egg) return;
  const required = egg.taps || 5;
  let taps = getState().interactions.png13Taps || 0;
  taps++;
  setInteraction('png13Taps', taps);
  const el = document.querySelector('.bts-side.bts-tappable');
  if (el) {
    el.classList.remove('bts-tapped');
    void el.offsetWidth;
    el.classList.add('bts-tapped');
  }
  if (taps >= required) {
    setInteraction('png13Taps', 0);
    toast(egg.message);
    heartBurst(el || document.body);
  }
}

function initBtsBtsLounge() {
  const section = document.getElementById('btsSection');
  if (!section || !CONFIG.btsAssets || !CONFIG.btsAssets.btsLounge) return;
  setBtsSectionSides(section, CONFIG.btsAssets.btsLounge.sides || [], 'bts-art-lounge');
}

function initBtsQuiz() {
  const section = document.getElementById('quizSection');
  if (!section || !CONFIG.btsAssets || !CONFIG.btsAssets.quiz) return;
  setBtsSectionSides(section, CONFIG.btsAssets.quiz.sides || [], 'bts-art-quiz');
}

function initBtsSectionArt() {
  if (!CONFIG.sections || !CONFIG.sections.sideArt) return;
  const artMap = CONFIG.sections.sideArt;
  Object.keys(artMap).forEach((sectionKey) => {
    const spec = artMap[sectionKey];
    if (!spec || !spec.src) return;
    const el = document.getElementById(sectionKey);
    if (!el) return;
    const artClass = spec.className || `bts-art-${sectionKey.replace(/Section$/, '').toLowerCase()}`;
    setBtsSectionSides(el, [{
      src: spec.src,
      side: spec.side || 'left',
      animation: spec.animation || 'bob',
      className: artClass,
    }], artClass);
  });
}

function initBtsFinalNegative() {
  const overlay = document.getElementById('finalSurprise');
  if (!overlay || !CONFIG.btsAssets || !CONFIG.btsAssets.finalOverlay) return;
  const cfg = CONFIG.btsAssets.finalOverlay.negative;
  if (!cfg) return;
  const existing = overlay.querySelectorAll('.bts-corner');
  if (existing.length === (cfg.corners || []).length) return;
  existing.forEach((el) => el.remove());
  (cfg.corners || []).forEach((corner) => {
    const img = document.createElement('img');
    img.className = 'bts-corner ' + corner;
    applyBtsImageSettings(img, { src: cfg.src, className: cfg.className, layout: cfg.layout });
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.decoding = 'async';
    img.src = getBtsBasePath() + cfg.src;
    if (cfg.animation) img.setAttribute('data-anim', cfg.animation);
    overlay.appendChild(img);
  });
}

function revealBtsFinalReward() {
  const container = document.getElementById('finalReward');
  if (!container) return;
  if (!CONFIG.btsAssets || !CONFIG.btsAssets.finalOverlay) return;
  const cfg = CONFIG.btsAssets.finalOverlay.afterYes;
  if (!cfg) return;

  container.innerHTML = '';
  const img = document.createElement('img');
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  img.decoding = 'async';
  img.src = (cfg.basePath || getBtsBasePath()) + cfg.src;
  applyBtsImageSettings(img, cfg);
  container.appendChild(img);

  container.classList.remove('hidden');
  void container.offsetWidth;
  container.classList.add('show');
}

function hideBtsFinalReward() {
  const container = document.getElementById('finalReward');
  if (!container) return;
  container.classList.add('hidden');
  container.classList.remove('show');
}

/* ---------- MUSIC ---------- */
let audioEl = null;
let currentTrackId = '';
let currentSrc = '';
let autoplayAttempted = false;
let autoplayRetryAttached = false;
let shuffleEnabled = false;
let repeatMode = 'all';
let stoppedByUser = false;

function musicArtClass(track) {
  return `music-art-${String(track && track.id || 'pied-piper').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function renderMusicCover(element, track, baseClasses) {
  if (!element) return;
  const trackId = track ? track.id : '';
  if (element.dataset.trackId === trackId) return;
  element.className = `${baseClasses} ${musicArtClass(track)}`;
  element.dataset.trackId = trackId;
  while (element.firstChild) element.removeChild(element.firstChild);

  const label = document.createElement('span');
  label.className = 'music-cover-label';
  label.textContent = track ? (track.coverLabel || (track.title || track.id).slice(0, 2).toUpperCase()) : '♪';
  if (track && track.cover) {
    const image = document.createElement('img');
    image.className = 'music-cover-image';
    image.src = track.cover;
    image.alt = '';
    image.decoding = 'async';
    image.loading = 'lazy';
    label.hidden = true;
    image.addEventListener('error', () => {
      image.remove();
      label.hidden = false;
    }, { once: true });
    element.appendChild(image);
  }
  element.appendChild(label);
}

function getAudio() {
  if (audioEl) return audioEl;
  audioEl = new Audio();
  audioEl.loop = false;
  audioEl.volume = typeof CONFIG.music.volume === 'number' ? CONFIG.music.volume : 0.55;
  audioEl.preload = 'auto';
  audioEl.addEventListener('play', updateTrackUI);
  audioEl.addEventListener('pause', updateTrackUI);
  audioEl.addEventListener('volumechange', updateTrackUI);
  audioEl.addEventListener('ended', handleTrackEnded);
  audioEl.addEventListener('error', () => {
    console.warn('[music] Audio element error. Check that the file exists at the configured path.');
    updateTrackUI();
  });
  return audioEl;
}

function updateTrackUI() {
  const btn = document.getElementById('musicBtn');
  const a = getAudio();
  const isPlaying = !a.paused && a.src;
  const tracks = (CONFIG.music && CONFIG.music.tracks) || [];
  const track = tracks.find((item) => item.id === currentTrackId);
  if (btn) {
    btn.classList.toggle('playing', isPlaying);
    const panel = document.getElementById('musicPanel');
    const panelOpen = panel && !panel.classList.contains('hidden');
    btn.setAttribute('aria-label', `${isPlaying ? 'Music playing' : 'Music paused'}${track ? `: ${track.title}` : ''}. ${panelOpen ? 'Close' : 'Open'} music controls`);
  }
  document.querySelectorAll('.music-track').forEach((t) => {
    const matches = t.dataset.trackId === currentTrackId;
    t.classList.toggle('selected', matches);
    t.classList.toggle('active', matches && isPlaying);
  });

  const cover = document.getElementById('musicButtonCover');
  renderMusicCover(cover, track, 'music-cover-disc');
  const musicLabel = btn && btn.querySelector('.music-label');
  if (musicLabel) musicLabel.textContent = track ? track.title : CONFIG.music.label;
  if (cover) {
    cover.className = `music-cover-disc ${musicArtClass(track)}`;
    const label = cover.querySelector('.music-cover-label');
    if (label) label.textContent = track ? (track.coverLabel || track.title.slice(0, 2).toUpperCase()) : '♪';
    cover.dataset.trackId = track ? track.id : '';
  }

  const nowTitle = document.getElementById('musicNowTitle');
  const nowState = document.getElementById('musicNowState');
  if (nowTitle) nowTitle.textContent = track ? `${track.title} · ${track.artist || ''}` : 'Choose a song';
  if (nowState) nowState.textContent = isPlaying ? 'Playing' : (stoppedByUser ? 'Stopped' : 'Paused');

  const playBtn = document.getElementById('musicPlayBtn');
  if (playBtn) {
    playBtn.textContent = isPlaying ? 'Ⅱ' : '▶';
    playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
    playBtn.title = isPlaying ? 'Pause' : 'Play';
  }
  const repeatBtn = document.getElementById('musicRepeatBtn');
  if (repeatBtn) {
    const repeatLabels = { all: 'Repeat all', one: 'Repeat one', off: 'Repeat off' };
    repeatBtn.textContent = repeatLabels[repeatMode] || repeatLabels.all;
    repeatBtn.setAttribute('aria-pressed', repeatMode === 'off' ? 'false' : 'true');
    repeatBtn.dataset.mode = repeatMode;
  }
  const shuffleBtn = document.getElementById('musicShuffleBtn');
  if (shuffleBtn) {
    shuffleBtn.textContent = shuffleEnabled ? 'Shuffle on' : 'Shuffle off';
    shuffleBtn.setAttribute('aria-pressed', shuffleEnabled ? 'true' : 'false');
  }
  const volume = document.getElementById('musicVolume');
  const volumeValue = document.getElementById('musicVolumeValue');
  if (volume && document.activeElement !== volume) volume.value = String(a.volume);
  if (volumeValue) volumeValue.textContent = `${Math.round(a.volume * 100)}%`;
}

function buildTrackList() {
  const container = document.getElementById('musicTracks');
  if (!container) return;
  container.innerHTML = '';
  const tracks = (CONFIG.music && CONFIG.music.tracks) || [];
  tracks.forEach((track) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'music-track';
    btn.dataset.trackId = track.id;
    const cover = document.createElement('span');
    renderMusicCover(cover, track, 'music-track-cover music-cover-art');
    cover.setAttribute('aria-hidden', 'true');
    const icon = document.createElement('span');
    icon.className = 'music-track-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '♪';
    const body = document.createElement('span');
    body.className = 'music-track-body';
    const title = document.createElement('span');
    title.className = 'music-track-title';
    title.textContent = track.title || track.id;
    const artist = document.createElement('span');
    artist.className = 'music-track-artist';
    artist.textContent = track.artist || '';
    const note = document.createElement('span');
    note.className = 'music-track-note';
    note.textContent = track.note || '';
    body.appendChild(title);
    body.appendChild(artist);
    if (track.note) body.appendChild(note);
    btn.appendChild(cover);
    btn.appendChild(icon);
    btn.appendChild(body);
    btn.addEventListener('click', () => handleTrackClick(track.id));
    container.appendChild(btn);
  });
  updateTrackUI();
}

function setTrack(id) {
  const tracks = (CONFIG.music && CONFIG.music.tracks) || [];
  const track = tracks.find((t) => t.id === id);
  if (!track) return;
  const a = getAudio();
  if (currentSrc !== track.src) {
    a.src = track.src;
    currentSrc = track.src;
  } else if (a.ended) {
    a.currentTime = 0;
  }
  currentTrackId = id;
  stoppedByUser = false;
  requestMusicPlay();
  updateTrackUI();
}

function requestMusicPlay() {
  const a = getAudio();
  try {
    const result = a.play();
    if (result && typeof result.then === 'function') {
      result.then(() => {
        stoppedByUser = false;
        const hint = document.getElementById('musicAutoplayHint');
        if (hint) hint.classList.add('hidden');
        updateTrackUI();
      }).catch(() => {
        onAutoplayBlocked();
        updateTrackUI();
      });
    }
  } catch (e) {
    onAutoplayBlocked();
  }
}

function handleTrackClick(id) {
  const a = getAudio();
  if (currentTrackId === id) {
    if (a.paused) {
      stoppedByUser = false;
      requestMusicPlay();
    } else {
      a.pause();
      updateTrackUI();
    }
  } else {
    setTrack(id);
  }
}

function playPauseMusic() {
  const tracks = (CONFIG.music && CONFIG.music.tracks) || [];
  const a = getAudio();
  if (!currentTrackId || !a.src) {
    const first = tracks.find((track) => track.id === currentTrackId)
      || tracks.find((track) => track.id === (CONFIG.music.defaultTrack || ''))
      || tracks[0];
    if (first) setTrack(first.id);
    return;
  }
  if (a.paused) {
    stoppedByUser = false;
    requestMusicPlay();
  } else {
    a.pause();
  }
}

function chooseNextTrack(direction = 1) {
  const tracks = (CONFIG.music && CONFIG.music.tracks) || [];
  if (!tracks.length) return;
  if (shuffleEnabled && tracks.length > 1) {
    const choices = tracks.filter((track) => track.id !== currentTrackId);
    const chosen = choices[Math.floor(Math.random() * choices.length)];
    if (chosen) setTrack(chosen.id);
    return;
  }
  const index = tracks.findIndex((track) => track.id === currentTrackId);
  const nextIndex = index < 0
    ? (direction > 0 ? 0 : tracks.length - 1)
    : (index + direction + tracks.length) % tracks.length;
  setTrack(tracks[nextIndex].id);
}

function handleTrackEnded() {
  if (repeatMode === 'one') {
    const a = getAudio();
    a.currentTime = 0;
    requestMusicPlay();
  } else if (repeatMode === 'all') {
    chooseNextTrack(1);
  } else {
    stoppedByUser = false;
    updateTrackUI();
  }
}

function changeMusicVolume(amount) {
  const a = getAudio();
  a.volume = Math.max(0, Math.min(1, Math.round((a.volume + amount) * 100) / 100));
  updateTrackUI();
}

function tryAutoplayAfterPin() {
  if (autoplayAttempted) return;
  if (!CONFIG.music || CONFIG.music.autoplayAfterPin === false) return;
  autoplayAttempted = true;
  const defaultTrack = CONFIG.music.defaultTrack
    || (CONFIG.music.tracks && CONFIG.music.tracks[0] && CONFIG.music.tracks[0].id);
  try { setTrack(defaultTrack); } catch (e) { console.warn('[music] autoplay failed:', e); }
}

function onAutoplayBlocked() {
  const hint = document.getElementById('musicAutoplayHint');
  if (hint) hint.classList.remove('hidden');
  if (autoplayRetryAttached) return;
  autoplayRetryAttached = true;
  const retry = () => {
    document.removeEventListener('pointerdown', retry, true);
    document.removeEventListener('keydown', retry, true);
    const a = getAudio();
    if (!a.src) {
      autoplayRetryAttached = false;
      return;
    }
    a.play().then(() => {
      const h = document.getElementById('musicAutoplayHint');
      if (h) h.classList.add('hidden');
      updateTrackUI();
    }).catch(() => {
      autoplayRetryAttached = false;
    });
  };
  document.addEventListener('pointerdown', retry, true);
  document.addEventListener('keydown', retry, true);
}

function initMusic() {
  currentTrackId = (CONFIG.music && CONFIG.music.defaultTrack) || '';
  repeatMode = (CONFIG.music && ['all', 'one', 'off'].includes(CONFIG.music.repeatMode))
    ? CONFIG.music.repeatMode
    : 'all';
  buildTrackList();

  const btn = document.getElementById('musicBtn');
  const panel = document.getElementById('musicPanel');
  if (!btn || !panel) return;

  const playBtn = document.getElementById('musicPlayBtn');
  const stopBtn = document.getElementById('musicStopBtn');
  const prevBtn = document.getElementById('musicPrevBtn');
  const nextBtn = document.getElementById('musicNextBtn');
  const shuffleBtn = document.getElementById('musicShuffleBtn');
  const repeatBtn = document.getElementById('musicRepeatBtn');
  const volumeSlider = document.getElementById('musicVolume');
  const volumeDown = document.getElementById('musicVolumeDown');
  const volumeUp = document.getElementById('musicVolumeUp');
  if (playBtn) playBtn.addEventListener('click', playPauseMusic);
  if (stopBtn) stopBtn.addEventListener('click', () => {
    const a = getAudio();
    a.pause();
    try { a.currentTime = 0; } catch (e) {}
    stoppedByUser = true;
    updateTrackUI();
  });
  if (prevBtn) prevBtn.addEventListener('click', () => {
    const a = getAudio();
    if (a.currentTime > 3) {
      a.currentTime = 0;
      if (a.paused) playPauseMusic();
      else updateTrackUI();
    } else chooseNextTrack(-1);
  });
  if (nextBtn) nextBtn.addEventListener('click', () => chooseNextTrack(1));
  if (shuffleBtn) shuffleBtn.addEventListener('click', () => {
    shuffleEnabled = !shuffleEnabled;
    updateTrackUI();
  });
  if (repeatBtn) repeatBtn.addEventListener('click', () => {
    repeatMode = repeatMode === 'all' ? 'one' : (repeatMode === 'one' ? 'off' : 'all');
    updateTrackUI();
  });
  if (volumeSlider) volumeSlider.addEventListener('input', () => {
    getAudio().volume = Number(volumeSlider.value);
    updateTrackUI();
  });
  if (volumeDown) volumeDown.addEventListener('click', () => changeMusicVolume(-0.1));
  if (volumeUp) volumeUp.addEventListener('click', () => changeMusicVolume(0.1));

  const placeholder = document.getElementById('musicPlaceholder');
  const tracksContainer = document.getElementById('musicTracks');
  if (placeholder) {
    if (tracksContainer && tracksContainer.children.length > 0) {
      placeholder.classList.add('hidden');
    } else if (CONFIG.music && CONFIG.music.placeholder) {
      placeholder.textContent = CONFIG.music.placeholder;
    }
  }

  btn.addEventListener('click', () => {
    const open = panel.classList.toggle('hidden') === false;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close music controls' : 'Open music controls');
    btn.classList.toggle('active', open);
  });
}

/* ---------- LOADER (hardened) ---------- */
function initLoader() {
  try { initBtsLoader(); } catch (e) { console.warn('[loader] initBtsLoader failed:', e); }

  const loader = document.getElementById('loader');
  const skipBtn = document.getElementById('skipBtn');
  const textEl = document.getElementById('loaderText');
  const ringFill = document.querySelector('.ring-fill');
  if (!loader) { console.error('[loader] #loader not found'); return; }

  const L = (CONFIG && CONFIG.loading) || {};
  const msgs = L.loadingMessages || ['Loading…'];
  const fallbackMs = 30000;
  // The welcome sequence runs on every visit. Saved unlock flags must never
  // bypass the PIN and date questions; only the visitor's other progress persists.
  const minDuration = L.minDurationMs || fallbackMs;
  const skipAfter = L.skipAfterMs || 4000;

  console.log('[loader] starting. minDuration:', minDuration, 'skipAfter:', skipAfter);

  if (L.skipLabel && skipBtn) skipBtn.textContent = L.skipLabel;
  if (textEl && msgs[0]) textEl.textContent = msgs[0];

  const circumference = 2 * Math.PI * 52;
  if (ringFill) {
    ringFill.style.strokeDasharray = circumference;
    ringFill.style.strokeDashoffset = circumference;
    void ringFill.getBoundingClientRect();
    ringFill.style.transition = `stroke-dashoffset ${minDuration}ms linear`;
    ringFill.style.strokeDashoffset = 0;
  }

  let msgIdx = 0;
  const msgInterval = setInterval(() => {
    if (msgIdx < msgs.length - 1 && textEl) {
      textEl.textContent = msgs[++msgIdx];
    }
  }, Math.max(1200, minDuration / Math.max(msgs.length, 1)));

  if (skipBtn && skipAfter > 0) {
    setTimeout(() => skipBtn.classList.add('visible'), skipAfter);
  } else if (skipBtn) {
    skipBtn.classList.add('visible');
  }

  let finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    console.log('[loader] finish() called');
    try { clearInterval(msgInterval); } catch (e) {}
    try { loader.classList.add('fade-out'); } catch (e) { console.warn('[loader] fade-out failed:', e); }
    setTimeout(() => {
      try { loader.classList.add('hidden'); } catch (e) { console.warn('[loader] hide failed:', e); }
      try { document.body.classList.remove('loading'); } catch (e) {}
      try {
        startFlow();
      } catch (e) {
        console.error('[loader] startFlow threw:', e);
        try { showPinGate(); } catch (e2) { console.error('[loader] fallback showPinGate threw:', e2); }
      }
    }, 800);
  }
  if (skipBtn) skipBtn.addEventListener('click', finish);
  setTimeout(finish, minDuration);
}

/* ---------- FLOW (hardened) ---------- */
let pinGateInitialized = false;
let dateQuestionsInitialized = false;
let mainSiteInitialized = false;

function hideAllScreens() {
  ['pinGate', 'dateQuestions', 'mainSite'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
}

function startFlow() {
  let state;
  try {
    state = getState();
  } catch (e) {
    console.error('[flow] getState failed:', e);
    state = defaultState();
  }
  console.log('[flow] startFlow', state);

  hideAllScreens();

  try {
    // Always begin at the PIN, even when this browser has completed the flow
    // before. The main site is revealed only by the two successful answers.
    setState({ pinUnlocked: false, metDateCorrect: false, relationshipDateCorrect: false });
    showPinGate();
  } catch (e) {
    console.error('[flow] body error, forcing pin gate:', e);
    try { showPinGate(); } catch (e2) { console.error('[flow] pin gate fallback failed:', e2); }
  }

  setTimeout(() => {
    const anyVisible = ['pinGate', 'dateQuestions', 'mainSite'].some((id) => {
      const el = document.getElementById(id);
      return el && !el.classList.contains('hidden');
    });
    if (!anyVisible) {
      console.warn('[flow] nothing visible after startFlow — forcing pin gate');
      try { showPinGate(); } catch (e) { console.error('[flow] safety net failed:', e); }
    }
  }, 150);
}

function showPinGate() {
  const gate = document.getElementById('pinGate');
  if (!gate) { console.error('[pin] #pinGate not found'); return; }
  gate.classList.remove('hidden');
  document.body.classList.add('prelude-active');
  try { initBtsPin(); } catch (e) { console.warn('[pin] initBtsPin failed:', e); }
  try { initPinGate(); } catch (e) { console.error('[pin] initPinGate failed:', e); }
  console.log('[pin] gate visible');
}

function showDateQuestions() {
  const el = document.getElementById('dateQuestions');
  if (!el) { console.error('[date] #dateQuestions not found'); return; }
  el.classList.remove('hidden');
  document.body.classList.add('prelude-active');
  try { initBtsDates(); } catch (e) { console.warn('[date] initBtsDates failed:', e); }
  try { initDateQuestions(); } catch (e) { console.error('[date] initDateQuestions failed:', e); }
  console.log('[date] questions visible');
}

function showMainSite() {
  const main = document.getElementById('mainSite');
  if (!main) { console.error('[main] #mainSite not found'); return; }
  main.classList.remove('hidden');
  document.body.classList.remove('prelude-active');
  try { initMainSite(); } catch (e) { console.error('[main] initMainSite failed:', e); }
  console.log('[main] site visible');
}

/* ---------- PIN GATE ---------- */
function initPinGate() {
  if (pinGateInitialized) return;
  pinGateInitialized = true;

  const inputs = $$('.pin-input');
  const message = $('#pinMessage');
  const container = $('.pin-inputs');
  if (!inputs.length || !container) {
    console.error('[pin] pin inputs not found');
    return;
  }

  inputs.forEach((input, i) => {
    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 1);
      if (e.target.value && i < inputs.length - 1) inputs[i + 1].focus();
      checkPin();
    });

    input.addEventListener('paste', (e) => {
      const raw = (e.clipboardData || window.clipboardData).getData('text') || '';
      const d = raw.replace(/\D/g, '').slice(0, 4);
      if (!d) return;
      e.preventDefault();
      d.split('').forEach((ch, k) => { if (inputs[k]) inputs[k].value = ch; });
      inputs[Math.min(d.length, inputs.length - 1)].focus();
      checkPin();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && i > 0) {
        inputs[i - 1].focus();
      } else if (e.key === 'ArrowLeft' && i > 0) {
        e.preventDefault(); inputs[i - 1].focus();
      } else if (e.key === 'ArrowRight' && i < inputs.length - 1) {
        e.preventDefault(); inputs[i + 1].focus();
      }
    });
  });

  if (!window.matchMedia('(pointer: coarse)').matches) {
    try { inputs[0].focus(); } catch (e) {}
  }

  function shakeAndClear() {
    container.classList.add('shake');
    setTimeout(() => {
      container.classList.remove('shake');
      inputs.forEach((i) => { i.value = ''; });
      if (!window.matchMedia('(pointer: coarse)').matches) {
        try { inputs[0].focus(); } catch (e) {}
      }
    }, 600);
  }

  function checkPin() {
    const pin = inputs.map((i) => i.value).join('');
    if (pin.length !== 4) return;

    if (pin === CONFIG.pin) {
      console.log('[pin] correct');
      if (message) {
        message.textContent = CONFIG.ui.welcome;
        message.className = 'pin-message success';
      }
      heartBurst(container);
      setState({ pinUnlocked: true });
      tryAutoplayAfterPin();
      inputs.forEach((i) => { i.disabled = true; });
      setTimeout(() => {
        const gate = document.getElementById('pinGate');
        if (gate) gate.classList.add('hidden');
        showDateQuestions();
      }, 1700);
      return;
    }

    const egg = CONFIG.pinEasterEgg && CONFIG.pinEasterEgg[pin];
    if (message) {
      message.textContent = egg || CONFIG.ui.wrongPin;
      message.className = 'pin-message error';
    }
    if (egg) heartBurst(container);
    shakeAndClear();
  }
}

/* ---------- DATE QUESTIONS ---------- */
const normAnswer = (v) =>
  v.toLowerCase()
    .replace(/(\d)(st|nd|rd|th)\b/g, '$1')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

function initDateQuestions() {
  if (dateQuestionsInitialized) return;
  dateQuestionsInitialized = true;

  const state = getState();
  const q1 = CONFIG.dates.met;
  const q2 = CONFIG.dates.relationship;

  const q1Text = $('#q1Text');
  const q1Hint = $('#q1Hint');
  const q2Text = $('#q2Text');
  const q2Hint = $('#q2Hint');
  if (q1Text) q1Text.textContent = q1.question;
  if (q1Hint) q1Hint.textContent = q1.hint;
  if (q2Text) q2Text.textContent = q2.question;
  if (q2Hint) q2Hint.textContent = q2.hint;

  if (state.metDateCorrect) {
    const q1El = $('#q1');
    const q2El = $('#q2');
    if (q1El) q1El.classList.add('hidden');
    if (q2El) q2El.classList.remove('hidden');
  }

  setupQuestion('q1', q1, () => {
    const q1El = $('#q1');
    const q2El = $('#q2');
    if (q1El) q1El.classList.add('hidden');
    if (q2El) q2El.classList.remove('hidden');
    const q2Input = $('#q2Input');
    if (q2Input && !window.matchMedia('(pointer: coarse)').matches) {
      try { q2Input.focus(); } catch (e) {}
    }
  });

  setupQuestion('q2', q2, () => {
    setTimeout(() => {
      const el = $('#dateQuestions');
      if (el) el.classList.add('hidden');
      showMainSite();
    }, 1600);
  });
}

function setupQuestion(id, config, onCorrect) {
  const input = $(`#${id}Input`);
  const submit = $(`#${id}Submit`);
  const feedback = $(`#${id}Feedback`);
  const card = $(`#${id}`);
  if (!input || !submit || !feedback || !card) return;

  const key = id === 'q1' ? 'metDateCorrect' : 'relationshipDateCorrect';
  const accepted = config.accepted.map(normAnswer);
  let done = false;
  let link = null;

  function finish(msg, delay) {
    if (done) return;
    done = true;
    feedback.textContent = msg;
    feedback.className = 'date-feedback success';
    submit.disabled = true;
    input.disabled = true;
    if (link) link.remove();
    setState({ [key]: true });
    if (config.easterEgg) {
      setTimeout(() => toast(config.easterEgg, 'date-fun-fact'), delay + 200);
    }
    setTimeout(onCorrect, delay);
  }

  function check() {
    const val = normAnswer(input.value);
    if (!val || done) return;
    if (accepted.includes(val)) {
      heartBurst(card);
      finish(config.correctMsg, 1600);
      return;
    }
    feedback.textContent = config.wrongMsg;
    feedback.className = 'date-feedback error';
    input.value = '';
    input.focus();
    if (!link) {
      link = document.createElement('button');
      link.type = 'button';
      link.className = 'tell-anyway';
      link.textContent = CONFIG.ui.tellAnyway;
      link.addEventListener('click', () => {
        finish(`${CONFIG.ui.answerWas} ${config.answer}. ${config.correctMsg}`, 2000);
      });
      feedback.after(link);
    }
  }

  submit.addEventListener('click', check);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
}

/* ---------- MAIN SITE ---------- */
function initMainSite() {
  if (mainSiteInitialized) return;
  mainSiteInitialized = true;

  try { initHero(); } catch (e) { console.warn('[main] initHero failed:', e); }
  try { initBtsLounge(); } catch (e) { console.warn('[main] initBtsLounge failed:', e); }
  try { initTimeline(); } catch (e) { console.warn('[main] initTimeline failed:', e); }
  try { initHeroes(); } catch (e) { console.warn('[main] initHeroes failed:', e); }
  try { initStats(); } catch (e) { console.warn('[main] initStats failed:', e); }
  try { initSpinner(); } catch (e) { console.warn('[main] initSpinner failed:', e); }
  try { initMood(); } catch (e) { console.warn('[main] initMood failed:', e); }
  try { initEnoughRoom(); } catch (e) { console.warn('[main] initEnoughRoom failed:', e); }
  try { initHug(); } catch (e) { console.warn('[main] initHug failed:', e); }
  try { initFear(); } catch (e) { console.warn('[main] initFear failed:', e); }
  try { initVoice(); } catch (e) { console.warn('[main] initVoice failed:', e); }
  try { initDreamJob(); } catch (e) { console.warn('[main] initDreamJob failed:', e); }
  try { initFavorites(); } catch (e) { console.warn('[main] initFavorites failed:', e); }
  try { initGallery(); } catch (e) { console.warn('[main] initGallery failed:', e); }
  try { initDreamMap(); } catch (e) { console.warn('[main] initDreamMap failed:', e); }
  try { initLetter(); } catch (e) { console.warn('[main] initLetter failed:', e); }
  try { initQuiz(); } catch (e) { console.warn('[main] initQuiz failed:', e); }
  try { initBtsHero(); } catch (e) { console.warn('[main] initBtsHero failed:', e); }
  try { initBtsBtsLounge(); } catch (e) { console.warn('[main] initBtsBtsLounge failed:', e); }
  try { initBtsQuiz(); } catch (e) { console.warn('[main] initBtsQuiz failed:', e); }
  try { initBtsSectionArt(); } catch (e) { console.warn('[main] initBtsSectionArt failed:', e); }

  updateFinalTrigger(true);
  try { initReveal(); } catch (e) { console.warn('[main] initReveal failed:', e); }
}

function initHeroClouds() {
  const stage = $('#heroClouds');
  if (!stage || stage.dataset.ready === 'true') return;
  stage.dataset.ready = 'true';
  if (reducedMotion) return;

  const pool = ((CONFIG.hero && CONFIG.hero.clouds) || []).slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const isPhone = window.matchMedia('(max-width: 600px)').matches;
  const selected = pool.slice(0, isPhone ? 3 : 5);
  selected.forEach((cloud, index) => {
    const img = document.createElement('img');
    img.className = `hero-cloud ${cloud.className || ''}`.trim();
    img.src = cloud.src;
    img.alt = '';
    img.decoding = 'async';
    img.draggable = false;
    img.style.top = `${8 + Math.random() * 78}%`;
    img.style.setProperty('--cloud-duration', `${isPhone ? 52 : 38 + Math.random() * 42}s`);
    img.style.setProperty('--cloud-delay', `${-Math.random() * (index + 5) * 5}s`);
    img.style.setProperty('--cloud-opacity', `${isPhone ? 0.1 + Math.random() * 0.1 : 0.15 + Math.random() * 0.18}`);
    if (Math.random() > 0.5) img.classList.add('hero-cloud--reverse');
    stage.appendChild(img);
  });
}

/* ---------- HERO ---------- */
function initHero() {
  const nameEl = $('#heroName');
  const subtitleEl = $('#heroSubtitle');
  const factEl = $('#heroFact');
  const beginBtn = $('#beginBtn');
  const particleBox = $('#particles');

  if (nameEl) nameEl.textContent = CONFIG.hero.name;
  const birthdayMark = $('#heroBirthdayMark');
  if (birthdayMark) birthdayMark.src = CONFIG.hero.birthdayMark || 'assets/bts/trimmed/19.png';
  const cake = $('#heroCake');
  if (cake) cake.src = CONFIG.hero.cakeImage || 'assets/photos/birthdayCake.png';
  try { initHeroClouds(); } catch (e) { console.warn('[hero] clouds failed:', e); }
  if (subtitleEl) subtitleEl.textContent = '';
  if (beginBtn) beginBtn.textContent = CONFIG.hero.beginButton;

  setTimeout(() => {
    if (subtitleEl) typeWriter(subtitleEl, CONFIG.hero.typewriter, 60);
  }, 900);

  if (factEl && CONFIG.hero.floatingFacts && CONFIG.hero.floatingFacts.length) {
    let idx = 0;
    factEl.textContent = CONFIG.hero.floatingFacts[0];
    if (!reducedMotion) {
      setInterval(() => {
        idx = (idx + 1) % CONFIG.hero.floatingFacts.length;
        factEl.style.opacity = '0';
        setTimeout(() => {
          factEl.textContent = CONFIG.hero.floatingFacts[idx];
          factEl.style.opacity = '1';
        }, 300);
      }, 4500);
    }
  }

  if (subtitleEl) {
    subtitleEl.addEventListener('click', () => {
      if (subtitleEl._finish) subtitleEl._finish();
    });
  }

  if (beginBtn) {
    beginBtn.addEventListener('click', () => {
      const targetId = CONFIG.hero.scrollTarget || 'btsSection';
      smoothScrollTo(document.getElementById(targetId));
    });
  }

  if (!reducedMotion && particleBox) {
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 12 + 's';
      p.style.animationDuration = 9 + Math.random() * 11 + 's';
      p.style.fontSize = 8 + Math.random() * 12 + 'px';
      p.textContent = Math.random() > 0.55 ? '💜' : (Math.random() > 0.5 ? '✦' : '♡');
      particleBox.appendChild(p);
    }
  }

  initSecretCorner();
}

function initSecretCorner() {
  const corner = $('#secretCorner');
  if (!corner) return;
  let taps = 0;
  let resetTimer = null;

  corner.addEventListener('click', () => {
    taps++;
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { taps = 0; }, 2200);
    if (taps >= 3) {
      taps = 0;
      if (CONFIG.easterEggs && CONFIG.easterEggs.secretCorner) {
        toast(CONFIG.easterEggs.secretCorner.message);
        setInteraction('secretCornerTaps', getState().interactions.secretCornerTaps + 1);
        heartBurst(corner);
      }
    }
  });
}

/* ---------- BTS LOUNGE ---------- */
function initBtsLounge() {
  const L = CONFIG.btsLounge;
  if (!L) return;

  const intro = $('#btsIntro');
  if (intro) intro.textContent = L.intro;

  const linesBox = $('#btsLines');
  if (linesBox && L.piedPiperLines) {
    linesBox.innerHTML = '';
    L.piedPiperLines.forEach((line) => {
      const p = document.createElement('p');
      p.textContent = line;
      linesBox.appendChild(p);
    });
  }

  const bLabel = $('#borahaeLabel');
  if (bLabel && L.borahae) bLabel.textContent = L.borahae.label;
  const bText = $('#borahaeText');
  if (bText && L.borahae) bText.textContent = L.borahae.text;

  const busan = $('#busanNote');
  if (busan) busan.textContent = L.busanNote;
  const army = $('#armyPurpleNote');
  if (army) army.textContent = L.armyPurpleNote;
}

/* ---------- TIMELINE ---------- */
function initTimeline() {
  const container = $('#timeline');
  if (!container) return;
  container.innerHTML = '';
  CONFIG.timeline.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'timeline-item';
    div.style.setProperty('--i', i);
    div.innerHTML = `
      <div class="timeline-dot" aria-hidden="true"></div>
      <div class="timeline-content">
        <div class="timeline-icon" aria-hidden="true">${esc(item.icon)}</div>
        <div class="timeline-date">${esc(item.date)}</div>
        <h3 class="timeline-title">${esc(item.title)}</h3>
        <p class="timeline-text">${esc(item.text)}</p>
      </div>
    `;
    container.appendChild(div);
  });
}

/* ---------- HEROES ---------- */
function initHeroes() {
  const grid = $('#heroesGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const data = CONFIG.heroes.cards || [];
  data.forEach((hero, i) => {
    const card = document.createElement('div');
    card.className = 'hero-card';
    card.style.setProperty('--i', i);
    card.style.setProperty('--hero-color', hero.color);
    card.innerHTML = `
      <div class="hero-card-image" style="background: linear-gradient(135deg, ${esc(hero.color)}, ${esc(hero.color)}55);">
        ${hero.mvp ? '<span class="hero-mvp-badge">MVP</span>' : ''}
        <span class="hero-name-big">${esc(hero.name)}</span>
        <span class="hero-role">${esc(hero.role)}</span>
      </div>
      <div class="hero-card-body">
        <p>${esc(hero.caption)}</p>
      </div>
    `;
    grid.appendChild(card);
  });

  const buffBtn = $('#buffBtn');
  const buffMsg = $('#buffMessage');
  const buffJoke = $('#buffJoke');
  if (!buffBtn || !buffMsg) return;

  const B = CONFIG.heroes.buff;
  buffBtn.textContent = B.buttonLabel;

  buffBtn.addEventListener('click', () => {
    if (buffBtn.disabled) return;
    buffBtn.disabled = true;
    buffBtn.textContent = B.waitingLabel;

    setTimeout(() => {
      const msgs = B.messages || [];
      const jokes = B.extraJokes || [];
      const pick = msgs[Math.floor(Math.random() * msgs.length)] || 'Buff sent.';
      buffMsg.textContent = pick;
      buffMsg.classList.add('show');
      buffBtn.textContent = B.doneLabel;

      if (jokes.length) {
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        if (buffJoke) {
          buffJoke.textContent = joke;
          buffJoke.classList.add('show');
        }
      }

      setInteraction('buffStolen', true);
      updateFinalTrigger();
      heartBurst(buffMsg.parentElement);
    }, 1200);
  });
}

/* ---------- STATS ---------- */
function initStats() {
  const grid = $('#statsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  (CONFIG.gamingStats.stats || []).forEach((stat) => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `
      <div class="stat-value">${esc(stat.value)}</div>
      <div class="stat-label">${esc(stat.label)}</div>
    `;
    grid.appendChild(card);
  });
}

/* ---------- SPINNER ---------- */
function initSpinner() {
  const btn = $('#spinnerBtn');
  const label = $('#spinnerLabel');
  const result = $('#spinnerResult');
  if (!btn || !result) return;

  const S = CONFIG.reasonsSpinner;
  const cooldownHours = Number.isFinite(S.cooldownHours) ? Math.max(0, S.cooldownHours) : 0;
  const cooldownMs = cooldownHours * 60 * 60 * 1000;
  let spinning = false;

  function refreshState() {
    const last = getState().interactions.spinnerLastSpin || 0;
    const elapsed = Date.now() - last;
    if (cooldownMs > 0 && elapsed < cooldownMs) {
      btn.disabled = true;
      if (label) label.textContent = S.cooldownLabel;
      return true;
    }
    btn.disabled = false;
    if (label) label.textContent = S.buttonLabel;
    return false;
  }

  const isCooldown = refreshState();
  if (isCooldown && result) {
    result.textContent = 'The wheel is resting. Come back later. I promise the next one is worth it.';
    result.classList.add('show');
  }

  btn.addEventListener('click', () => {
    if (btn.disabled || spinning) return;
    spinning = true;
    btn.disabled = true;
    btn.classList.add('spinning');
    result.textContent = '';
    result.classList.remove('show');

    setTimeout(() => {
      const reasons = S.reasons || [];
      const pick = reasons[Math.floor(Math.random() * reasons.length)] || 'Because you exist.';
      result.textContent = pick;
      result.classList.remove('show');
      void result.offsetWidth;
      result.classList.add('show');
      btn.classList.remove('spinning');
      spinning = false;

      setInteraction('spinnerLastSpin', Date.now());
      refreshState();
      updateFinalTrigger();
      heartBurst(btn);
    }, 900);
  });
}

/* ---------- MOOD ---------- */
function initMood() {
  const grid = $('#moodGrid');
  const msg = $('#moodMessage');
  if (!grid || !msg) return;

  const moods = CONFIG.moodCheck.moods || [];
  const saved = getState().interactions.moodPicked;

  moods.forEach((mood) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mood-tile';
    if (saved === mood.key) btn.classList.add('active');
    btn.innerHTML = `
      <span class="mood-icon" aria-hidden="true">${esc(mood.icon)}</span>
      <span class="mood-label">${esc(mood.label)}</span>
    `;

    btn.addEventListener('click', () => {
      $$('.mood-tile').forEach((t) => t.classList.remove('active'));
      btn.classList.add('active');
      msg.textContent = mood.message;
      msg.classList.remove('show');
      void msg.offsetWidth;
      msg.classList.add('show');
      setInteraction('moodPicked', mood.key);
      updateFinalTrigger();
      heartBurst(btn);
    });

    grid.appendChild(btn);
  });
}

/* ---------- ENOUGH ROOM ---------- */
function initEnoughRoom() {
  const btn = $('#enoughBtn');
  const msgEl = $('#enoughMessage');
  const finalEl = $('#enoughFinal');
  if (!btn || !msgEl || !finalEl) return;

  const R = CONFIG.reassurance;
  const messages = R.messages || [];
  let idx = getState().interactions.reassurancePressed || 0;

  if (idx > 0 && idx <= messages.length) {
    msgEl.textContent = messages[idx - 1];
    msgEl.classList.add('show');
  }

  if (idx >= messages.length) {
    showEnoughVictory(btn, msgEl, finalEl, R);
  } else {
    btn.textContent = R.buttonLabel;
  }

  btn.addEventListener('click', () => {
    if (idx < messages.length) {
      msgEl.textContent = messages[idx];
      msgEl.classList.remove('show');
      void msgEl.offsetWidth;
      msgEl.classList.add('show');
      idx++;
      setInteraction('reassurancePressed', idx);
      updateFinalTrigger();
      heartBurst(btn.parentElement);

      if (idx === messages.length) {
        showEnoughVictory(btn, msgEl, finalEl, R);
      }
    }
  });
}

function showEnoughVictory(btn, msgEl, finalEl, reassurance) {
  btn.style.display = 'none';
  msgEl.classList.add('hidden');
  finalEl.classList.remove('hidden');
  const vLabel = $('#victoryLabel');
  const vSub = $('#victorySubtext');
  if (vLabel) vLabel.textContent = reassurance.victoryLabel;
  if (vSub) vSub.textContent = reassurance.finalMessage || reassurance.victorySubtext;
  heartBurst(finalEl);
}

/* ---------- HUG ---------- */
function initHug() {
  const btn = $('#hugBtn');
  const msg = $('#hugMessage');
  const label = $('#hugLabel');
  if (!btn || !msg) return;

  const H = CONFIG.hugButton;
  if (label) label.textContent = H.buttonLabel;

  btn.addEventListener('click', () => {
    const hugs = H.hugs || [];
    const pick = hugs[Math.floor(Math.random() * hugs.length)] || 'Hug sent.';
    msg.textContent = pick;
    msg.classList.remove('show');
    void msg.offsetWidth;
    msg.classList.add('show');
    setInteraction('hugPressed', (getState().interactions.hugPressed || 0) + 1);
    updateFinalTrigger();
    heartBurst(btn);
  });
}

/* ---------- FEAR FAIRY ---------- */
function initFear() {
  const grid = $('#fearGrid');
  const msg = $('#fearMessage');
  if (!grid || !msg) return;

  const fears = (CONFIG.fearFairy && CONFIG.fearFairy.fears) || [];
  const saved = getState().interactions.fearPicked;

  fears.forEach((fear) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fear-tile';
    btn.textContent = fear.label;
    if (saved === fear.key) btn.classList.add('active');

    btn.addEventListener('click', () => {
      $$('.fear-tile').forEach((t) => t.classList.remove('active'));
      btn.classList.add('active');
      msg.textContent = fear.message;
      msg.classList.remove('show');
      void msg.offsetWidth;
      msg.classList.add('show');
      setInteraction('fearPicked', fear.key);
      updateFinalTrigger();
    });

    grid.appendChild(btn);
  });
}

/* ---------- VOICE ---------- */
function initVoice() {
  const el = $('#voiceText');
  if (el && CONFIG.voiceNote) el.textContent = CONFIG.voiceNote.text;
}

/* ---------- DREAM JOB ---------- */
function initDreamJob() {
  const el = $('#dreamJobText');
  if (el && CONFIG.dreamJob) el.textContent = CONFIG.dreamJob.message;
}

/* ---------- FAVORITES ---------- */
function initFavorites() {
  const grid = $('#favoritesGrid');
  if (!grid) return;
  grid.innerHTML = '';
  ((CONFIG.herFavorites && CONFIG.herFavorites.items) || []).forEach((item) => {
    const card = document.createElement('div');
    card.className = 'favorite-card';
    card.innerHTML = `
      <div class="favorite-label">${esc(item.label)}</div>
      <p class="favorite-note">${esc(item.note)}</p>
    `;
    grid.appendChild(card);
  });
}

/* ---------- GALLERY ---------- */
function galleryPhoto(item, cls) {
  const d = document.createElement('div');
  d.className = cls;
  if (item.image) {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.caption || '';
    img.loading = 'lazy';
    d.classList.add('has-img');
    d.appendChild(img);
  } else {
    d.style.background = item.gradient || 'linear-gradient(135deg, #7B4B9E, #2C1E4A)';
    const span = document.createElement('span');
    span.className = 'gallery-placeholder';
    span.textContent = '💜';
    d.appendChild(span);
  }
  return d;
}

function initGallery() {
  const grid = $('#galleryGrid');
  if (!grid) return;
  grid.innerHTML = '';

  CONFIG.gallery.forEach((item, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'gallery-item';
    b.style.setProperty('--i', i);
    b.style.setProperty('--rotation', (i % 2 === 0 ? -2 : 2) + 'deg');
    b.setAttribute('aria-label', 'Open photo: ' + (item.caption || ''));
    b.appendChild(galleryPhoto(item, 'gallery-photo'));
    const p = document.createElement('p');
    p.className = 'gallery-caption';
    p.textContent = item.caption || '';
    b.appendChild(p);

    b.addEventListener('click', () => {
      openLightbox(i);
      setInteraction('galleryOpened', (getState().interactions.galleryOpened || 0) + 1);
      updateFinalTrigger();
    });

    grid.appendChild(b);
  });
}

function openLightbox(index) {
  const items = CONFIG.gallery;
  const opener = document.activeElement;
  const old = $('.lightbox');
  if (old) old.remove();

  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Photo viewer');
  lb.innerHTML = `
    <button class="lb-close" type="button" aria-label="Close">✕</button>
    <button class="lb-nav lb-prev" type="button" aria-label="Previous photo">‹</button>
    <div class="lightbox-inner"></div>
    <button class="lb-nav lb-next" type="button" aria-label="Next photo">›</button>
  `;
  const inner = lb.querySelector('.lightbox-inner');

  function show(i) {
    index = (i + items.length) % items.length;
    inner.innerHTML = '';
    inner.appendChild(galleryPhoto(items[index], 'lightbox-photo'));
    const c = document.createElement('p');
    c.className = 'lightbox-caption';
    c.textContent = items[index].caption || '';
    inner.appendChild(c);
  }

  function close() {
    document.removeEventListener('keydown', onKey);
    lb.remove();
    if (opener && opener.focus) opener.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') show(index + 1);
    else if (e.key === 'ArrowLeft') show(index - 1);
  }

  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', () => show(index - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(index + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });

  let x0 = null;
  lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  });

  document.addEventListener('keydown', onKey);
  show(index);
  document.body.appendChild(lb);
  void lb.offsetWidth;
  lb.classList.add('show');
  lb.querySelector('.lb-close').focus();
}

/* ---------- DREAM MAP ---------- */
function initDreamMap() {
  const map = $('#dreamMap');
  const msg = $('#dreamMessage');
  if (!map || !msg) return;
  map.innerHTML = '';

  const pins = (CONFIG.dreamMap && CONFIG.dreamMap.pins) || [];

  pins.forEach((pin) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'dream-pin';
    el.style.setProperty('--x', pin.x + '%');
    el.style.setProperty('--y', pin.y + '%');
    el.setAttribute('aria-label', pin.place);
    el.innerHTML = `
      <div class="pin-dot" aria-hidden="true"></div>
      <span class="pin-label">${esc(pin.place)}</span>
    `;

    el.addEventListener('click', () => {
      el.classList.add('visited');
      msg.textContent = pin.text;
      msg.classList.remove('show');
      void msg.offsetWidth;
      msg.classList.add('show');
      heartBurst(el);
    });

    map.appendChild(el);
  });
}

/* ---------- LOVE LETTER ---------- */
function initLetter() {
  const el = $('#letterText');
  const contBtn = $('#continueBtn');
  const heading = $('#letterHeading');
  if (!el || !contBtn) return;

  if (heading) heading.textContent = CONFIG.loveLetter.heading || 'A letter for you';

  const full = CONFIG.loveLetter.text || '';

  const sr = document.createElement('span');
  sr.className = 'sr-only';
  sr.textContent = full;
  el.before(sr);
  el.setAttribute('aria-hidden', 'true');

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting) || el.dataset.started) return;
    el.dataset.started = 'true';
    observer.disconnect();
    el.textContent = full;
    el.style.minHeight = el.offsetHeight + 'px';
    el.textContent = '';
    const card = el.closest('.letter-card');
    if (card) card.addEventListener('click', () => { if (el._finish) el._finish(); });

    typeWriter(el, full, 22).then(() => {
      contBtn.classList.remove('hidden');
      setInteraction('letterRead', true);
      updateFinalTrigger();
    });
  }, { threshold: 0.2 });
  observer.observe(el);

  contBtn.addEventListener('click', () => smoothScrollTo($('#quizSection')));
}

/* ---------- QUIZ ---------- */
function initQuiz() {
  const container = $('#quizContainer');
  const result = $('#quizResult');
  if (!container || !result) return;

  const questions = CONFIG.quiz.questions || [];
  let currentQ = 0;

  function render() {
    if (currentQ >= questions.length) {
      container.classList.add('hidden');
      result.classList.remove('hidden');
      $('#quizResultTitle').textContent = CONFIG.quiz.resultMessage;
      $('#quizResultSubtext').textContent = CONFIG.quiz.resultSubtext;
      setInteraction('quizCompleted', true);
      updateFinalTrigger();
      heartBurst(result);
      return;
    }

    const q = questions[currentQ];
    container.innerHTML = `
      <div class="quiz-progress">Question ${currentQ + 1} of ${questions.length}</div>
      <h3 class="quiz-question">${esc(q.q)}</h3>
      <div class="quiz-options"></div>
      <p class="quiz-funny" id="quizFunny" aria-live="polite"></p>
    `;
    const options = container.querySelector('.quiz-options');
    const funny = container.querySelector('#quizFunny');

    q.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-option';
      btn.textContent = opt;

      btn.addEventListener('click', () => {
        if (options.dataset.locked) return;
        options.dataset.locked = '1';
        btn.classList.add('picked');
        heartBurst(btn);

        if (funny && q.funny) {
          funny.textContent = q.funny;
          funny.classList.add('show');
        }

        setTimeout(() => {
          currentQ++;
          render();
        }, q.funny ? 1700 : 800);
      });

      options.appendChild(btn);
    });
  }

  render();
}

/* ---------- FINAL TRIGGER ---------- */
function updateFinalTrigger(quiet) {
  const btn = $('#finalTriggerBtn');
  if (!btn) return;
  const s = getState();
  // Keep the final invitation available at the end of the page, even if the quiz is skipped.
  btn.textContent = s.finalSurpriseUnlocked ? CONFIG.ui.replayLabel : CONFIG.ui.finalTrigger;

  if (btn.classList.contains('hidden')) {
    btn.classList.remove('hidden');
  }
}

/* ---------- FINAL SURPRISE ---------- */
let finalReady = false;
let confettiOn = false;
let finalTimers = [];
let lastFocus = null;
let certificateDownloadUrl = '';
let certificateDownloadPromise = null;

function resetFinal() {
  ['#finalIntro', '#finalMessage', '#finalButtons', '#finalThanks', '#finalAfter'].forEach((q) => {
    const el = $(q);
    if (el) el.classList.remove('show');
  });
  ['#finalThanks', '#finalAfter', '#certificatePreview', '#finalActions', '#finalClose'].forEach((q) => {
    const el = $(q);
    if (el) {
      el.classList.add('hidden');
      el.classList.remove('show');
    }
  });
  const buttons = $('#finalButtons');
  if (buttons) buttons.classList.remove('hidden');
  hideBtsFinalReward();
}

function showAccepted(fresh) {
  const buttons = $('#finalButtons');
  if (buttons) buttons.classList.add('hidden');

  const th = $('#finalThanks');
  if (th) {
    th.textContent = CONFIG.ui.thanks;
    th.classList.remove('hidden');
    void th.offsetWidth;
    th.classList.add('show');
  }

  const after = $('#finalAfter');
  if (after && CONFIG.finalSurprise.afterAcceptMessage) {
    after.textContent = [
      CONFIG.finalSurprise.afterAcceptMessage,
      CONFIG.finalSurprise.afterAcceptExtra,
    ].filter(Boolean).join('\n\n');
    after.classList.remove('hidden');
    setTimeout(() => after.classList.add('show'), 500);
  }

  showCertificatePreview();

  revealBtsFinalReward();

  const actions = $('#finalActions');
  if (actions) actions.classList.remove('hidden');
  const close = $('#finalClose');
  if (close) close.classList.remove('hidden');

  if (fresh) {
    setState({ finalSurpriseUnlocked: true });
    startConfetti();
    updateFinalTrigger(true);
  }
  prepareCertificateDownload();
}

function showCertificatePreview() {
  const preview = $('#certificatePreview');
  if (!preview) return;

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value || '';
  };
  const F = CONFIG.finalSurprise;
  setText('certificateTitle', F.certificateTitle);
  setText('certificateIntro', CONFIG.ui.certIntro);
  setText('certificateNames', F.certificateNames);
  setText('certificateRole', `${CONFIG.ui.certBound} ${CONFIG.ui.certRole}`);
  setText('certificateDedication', F.certificateDedication);
  setText('certificateDate', F.certificateDate);
  setText('certificateSignature', F.certificateSignature);

  const cast = $('#certificateCast');
  if (cast && cast.dataset.ready !== 'true') {
    const images = Array.from({ length: 19 }, (_, index) => index + 1);
    images.forEach((number) => {
      const img = document.createElement('img');
      img.className = `certificate-stamp bts-png-${String(number).padStart(2, '0')}`;
      img.alt = '';
      img.decoding = 'async';
      img.src = `${getBtsBasePath()}${number}.png`;
      cast.appendChild(img);
    });
    cast.dataset.ready = 'true';
  }

  preview.classList.remove('hidden');
  requestAnimationFrame(() => preview.classList.add('show'));
}

function closeFinal() {
  finalTimers.forEach(clearTimeout);
  finalTimers = [];
  const overlay = $('#finalSurprise');
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
  }
  document.body.classList.remove('no-scroll');
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

function openFinalSurprise() {
  const overlay = $('#finalSurprise');
  if (!overlay || !overlay.classList.contains('hidden')) return;
  const F = CONFIG.finalSurprise;

  initBtsFinalNegative();

  if (!finalReady) {
    finalReady = true;
    F.buttons.forEach((label) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'final-yes-btn';
      b.textContent = label;
      b.addEventListener('click', () => showAccepted(true));
      $('#finalButtons').appendChild(b);
    });
    $('#certBtn').addEventListener('click', downloadCertificate);
    const shareBtn = $('#shareBtn');
    if (shareBtn) shareBtn.addEventListener('click', sharePromise);
    $('#finalClose').addEventListener('click', closeFinal);
    overlay.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFinal(); });
  }

  lastFocus = document.activeElement;
  resetFinal();
  $('#finalIntro').textContent = F.intro;
  $('#finalMessage').textContent = F.message;
  overlay.classList.remove('hidden');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  overlay.focus();
  void overlay.offsetWidth;

  finalTimers.push(
    setTimeout(() => $('#finalIntro').classList.add('show'), 50),
    setTimeout(() => $('#finalMessage').classList.add('show'), 1600),
    setTimeout(() => $('#finalButtons').classList.add('show'), 3200)
  );
}

async function sharePromise() {
  const F = CONFIG.finalSurprise;
  const text = [
    F.certificateTitle,
    F.certificateNames,
    F.certificateLine,
    F.certificateDate,
    F.certificateShareMessage,
  ].filter(Boolean).join('\n');
  if (navigator.share) {
    try {
      await navigator.share({ title: F.certificateTitle, text });
      return;
    } catch (e) {}
  }
  try {
    await navigator.clipboard.writeText(text);
    toast(CONFIG.finalSurprise.certificateShareMessage || 'Copied with love.');
  } catch (e) {
    toast('Could not copy. Screenshot it. That works too.');
  }
}

/* ---------- CONFETTI ---------- */
function startConfetti() {
  if (reducedMotion || confettiOn) return;
  confettiOn = true;
  const canvas = $('#confettiCanvas');
  if (!canvas) { confettiOn = false; return; }
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const colors = ['#7B4B9E', '#C2A3E1', '#E8D5A3', '#F4C2C2', '#FFF8F0'];
  const particles = [];

  for (let i = 0; i < 140; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 120,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 15,
      vy: -Math.random() * 15 - 4,
      size: 6 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.22,
      shape: Math.random() > 0.4 ? 'heart' : 'circle',
      life: 1,
      gravity: 0.28,
      lifeDecay: 0.005
    });
  }

  const addFirework = (xRatio, yRatio) => {
    const x = canvas.width * xRatio;
    const y = canvas.height * yRatio;
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 34; i++) {
      const angle = (Math.PI * 2 * i) / 34;
      const speed = 2.2 + Math.random() * 3.8;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3,
        color,
        rotation: 0,
        rotSpeed: 0,
        shape: 'circle',
        life: 1,
        gravity: 0.035,
        lifeDecay: 0.018,
        firework: true
      });
    }
  };
  window.setTimeout(() => addFirework(0.22, 0.3), 250);
  window.setTimeout(() => addFirework(0.78, 0.25), 900);
  window.setTimeout(() => addFirework(0.5, 0.18), 1550);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = 0;
    particles.forEach((p) => {
      if (p.life <= 0) return;
      alive++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotSpeed;
      p.life -= p.lifeDecay;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      if (p.firework) {
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
      }
      ctx.beginPath();
      if (p.shape === 'heart') {
        const s = p.size / 10;
        ctx.moveTo(0, -s * 4);
        ctx.bezierCurveTo(-s * 5, -s * 5, -s * 8, s * 2, 0, s * 7);
        ctx.bezierCurveTo(s * 8, s * 2, s * 5, -s * 5, 0, -s * 4);
        ctx.fill();
      } else {
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    if (alive > 0) requestAnimationFrame(draw);
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); confettiOn = false; }
  }
  draw();
}

/* ---------- CERTIFICATE ---------- */
function waitForImage(img) {
  if (img.complete) return Promise.resolve(img.naturalWidth > 0 ? img : null);
  return new Promise((resolve) => {
    img.addEventListener('load', () => resolve(img), { once: true });
    img.addEventListener('error', () => resolve(null), { once: true });
  });
}

function fitCanvasText(ctx, text, x, y, maxWidth, fontSize, family, weight) {
  let size = fontSize;
  const weightText = weight ? `${weight} ` : '';
  ctx.textAlign = 'center';
  ctx.font = `${weightText}${size}px ${family}`;
  while (ctx.measureText(text).width > maxWidth && size > 24) {
    size -= 2;
    ctx.font = `${weightText}${size}px ${family}`;
  }
  ctx.fillText(text, x, y, maxWidth);
}

function drawCertificateHeart(ctx, x, y, size, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.scale(size / 20, size / 20);
  ctx.beginPath();
  ctx.moveTo(0, 7);
  ctx.bezierCurveTo(-16, -3, -9, -14, 0, -6);
  ctx.bezierCurveTo(9, -14, 16, -3, 0, 7);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawImageContained(ctx, img, x, y, maxWidth, maxHeight) {
  if (!img || !img.naturalWidth || !img.naturalHeight) return;
  const scale = Math.min(maxWidth / img.naturalWidth, maxHeight / img.naturalHeight);
  const width = img.naturalWidth * scale;
  const height = img.naturalHeight * scale;
  ctx.save();
  if (img.classList && img.classList.contains('bts-png-17')) {
    ctx.filter = 'brightness(0) invert(0.82)';
  }
  ctx.drawImage(img, x + (maxWidth - width) / 2, y + (maxHeight - height) / 2, width, height);
  ctx.restore();
}

async function createCertificateBlob() {
  const preview = $('#certificatePreview');
  if (preview && preview.classList.contains('hidden')) showCertificatePreview();
  const stamps = await Promise.all($$('#certificateCast img').map(waitForImage));
  const W = 2200;
  const H = 1500;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is unavailable in this browser.');

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#090d18');
  bg.addColorStop(0.48, '#26173f');
  bg.addColorStop(1, '#11182a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const halo = ctx.createRadialGradient(W / 2, 430, 30, W / 2, 430, 980);
  halo.addColorStop(0, 'rgba(167, 124, 203, 0.26)');
  halo.addColorStop(1, 'rgba(167, 124, 203, 0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.shadowColor = 'rgba(232, 213, 163, 0.22)';
  ctx.shadowBlur = 26;
  ctx.strokeStyle = '#e8d5a3';
  ctx.lineWidth = 6;
  ctx.strokeRect(48, 48, W - 96, H - 96);
  ctx.restore();
  ctx.strokeStyle = 'rgba(194, 163, 225, 0.7)';
  ctx.lineWidth = 2;
  ctx.strokeRect(76, 76, W - 152, H - 152);

  for (let i = 0; i < 44; i++) {
    const x = 120 + ((i * 347) % (W - 240));
    const y = 115 + ((i * 191) % 890);
    drawCertificateHeart(ctx, x, y, 8 + (i % 4) * 2, i % 3 ? '#c2a3e1' : '#e8d5a3', 0.14 + (i % 3) * 0.04);
  }
  [[120, 120], [W - 120, 120], [120, H - 120], [W - 120, H - 120]].forEach(([x, y], i) => {
    drawCertificateHeart(ctx, x, y, 34, i % 2 ? '#e8d5a3' : '#c2a3e1', 0.92);
  });

  const F = CONFIG.finalSurprise;
  const cx = W / 2;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#e8d5a3';
  ctx.font = '600 26px Georgia, serif';
  ctx.letterSpacing = '7px';
  ctx.fillText('A PROMISE, IN EVERY TIMELINE', cx, 180);
  ctx.letterSpacing = '1px';
  ctx.fillStyle = '#fff8f0';
  fitCanvasText(ctx, F.certificateTitle.toUpperCase(), cx, 305, 1800, 64, 'Georgia, serif', 'bold');
  ctx.fillStyle = '#c2a3e1';
  ctx.font = 'italic 34px Georgia, serif';
  ctx.fillText(CONFIG.ui.certIntro, cx, 400);
  ctx.fillStyle = '#fff8f0';
  fitCanvasText(ctx, F.certificateNames, cx, 535, 1840, 66, 'Georgia, serif', 'bold');

  ctx.strokeStyle = 'rgba(232, 213, 163, 0.68)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(480, 590);
  ctx.lineTo(W - 480, 590);
  ctx.stroke();
  drawCertificateHeart(ctx, cx, 590, 24, '#e8d5a3');

  ctx.fillStyle = '#e8d5a3';
  fitCanvasText(ctx, `${CONFIG.ui.certBound} ${CONFIG.ui.certRole}`.toUpperCase(), cx, 685, 1700, 46, 'Georgia, serif', 'bold');
  ctx.font = 'italic 31px Georgia, serif';
  ctx.fillText(F.certificateLine, cx, 760, 1760);
  ctx.fillStyle = '#ddd0e8';
  ctx.font = 'italic 34px Georgia, serif';
  ctx.fillText(F.certificateDedication, cx, 825, 1740);

  ctx.beginPath();
  ctx.arc(cx, 935, 53, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(123, 75, 158, 0.72)';
  ctx.fill();
  ctx.strokeStyle = '#e8d5a3';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#fff8f0';
  ctx.font = '58px Georgia, serif';
  ctx.fillText('∞', cx, 955);
  ctx.fillStyle = '#e8d5a3';
  ctx.font = '600 19px Georgia, serif';
  ctx.fillText('ALWAYS', cx, 1018);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#fff8f0';
  ctx.font = '28px Georgia, serif';
  ctx.fillText(F.certificateDate, 330, 1095);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#f4c2c2';
  ctx.font = 'italic 31px Georgia, serif';
  ctx.fillText(F.certificateSignature, W - 330, 1095);
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(194, 163, 225, 0.86)';
  ctx.font = '600 18px Georgia, serif';
  ctx.letterSpacing = '5px';
  ctx.fillText('OUR LITTLE BTS MEMORY PARADE', cx, 1160);
  ctx.letterSpacing = '0px';
  ctx.strokeStyle = 'rgba(194, 163, 225, 0.36)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(135, 1185);
  ctx.lineTo(W - 135, 1185);
  ctx.stroke();

  const stripLeft = 135;
  const stripWidth = W - stripLeft * 2;
  const cell = stripWidth / Math.max(stamps.length, 1);
  stamps.forEach((img, index) => {
    if (!img) return;
    const x = stripLeft + cell * index;
    drawImageContained(ctx, img, x + 4, 1200, cell - 8, 182);
    ctx.beginPath();
    ctx.arc(x + cell / 2, 1400, 3, 0, Math.PI * 2);
    ctx.fillStyle = index % 2 ? '#c2a3e1' : '#e8d5a3';
    ctx.fill();
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not create certificate image.')), 'image/png');
  });
}

function prepareCertificateDownload() {
  const button = $('#certBtn');
  if (certificateDownloadUrl) {
    if (button) button.disabled = false;
    return Promise.resolve(certificateDownloadUrl);
  }
  if (certificateDownloadPromise) return certificateDownloadPromise;

  const readyLabel = button
    ? (button.dataset.readyLabel || (button.dataset.readyLabel = button.textContent))
    : '';
  if (button) {
    button.disabled = true;
    button.textContent = 'Preparing your keepsake…';
  }

  certificateDownloadPromise = createCertificateBlob()
    .then((blob) => {
      certificateDownloadUrl = URL.createObjectURL(blob);
      if (button) {
        button.disabled = false;
        button.textContent = readyLabel;
      }
      return certificateDownloadUrl;
    })
    .catch((error) => {
      console.error('[certificate] preparation failed:', error);
      if (button) {
        button.disabled = false;
        button.textContent = readyLabel;
      }
      toast('I could not prepare it just yet. Please try once more, my love.');
      return '';
    })
    .finally(() => { certificateDownloadPromise = null; });
  return certificateDownloadPromise;
}

function downloadCertificate() {
  if (!getState().finalSurpriseUnlocked) return;
  if (!certificateDownloadUrl) {
    prepareCertificateDownload();
    return;
  }

  // Use the prepared blob URL so this click starts the download synchronously
  // while the browser still recognizes the visitor's interaction.
  const link = document.createElement('a');
  link.download = 'forever-duo-certificate.png';
  link.href = certificateDownloadUrl;
  document.body.appendChild(link);
  link.click();
  link.remove();
  toast(CONFIG.finalSurprise.certificateDownloadMessage || 'Saved with love. Keep our promise close.');
}

/* ---------- KONAMI ---------- */
function initKonami() {
  const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let idx = 0;

  document.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === seq[idx]) {
      idx++;
      if (idx === seq.length) {
        idx = 0;
        if (CONFIG.easterEggs && CONFIG.easterEggs.konami) {
          toast(CONFIG.easterEggs.konami.message);
          setInteraction('konamiDone', true);
          const target = document.querySelector('.hero-name') || document.body;
          heartBurst(target);
        }
      }
    } else {
      idx = key === seq[0] ? 1 : 0;
    }
  });
}

/* ---------- HASH 404 ---------- */
function checkHash404() {
  if (location.hash === '#404' && CONFIG.easterEggs && CONFIG.easterEggs.notFound) {
    const nf = CONFIG.easterEggs.notFound;
    toast(`${nf.code}: ${nf.title} ${nf.text}`);
    history.replaceState(null, '', location.pathname);
  }
}

/* ---------- BOOT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  console.log('[boot] DOMContentLoaded');
  try { initCosmicAmbience(); } catch (e) { console.warn('[boot] cosmic ambience failed:', e); }

  if (typeof CONFIG === 'undefined') {
    console.error('[boot] CONFIG is not defined. config.js may have a syntax error or did not load. Showing fallback.');
    try { document.body.classList.remove('loading'); } catch (e) {}
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    const pinGate = document.getElementById('pinGate');
    if (pinGate) pinGate.classList.remove('hidden');
    return;
  }

  console.log('[boot] CONFIG loaded. Version:', (CONFIG.meta && CONFIG.meta.version) || 'unknown');
  console.log('[boot] initial state:', getState());

  const finalTrigger = $('#finalTriggerBtn');
  if (finalTrigger) finalTrigger.addEventListener('click', openFinalSurprise);

  try { applyBtsMobileFlags(); } catch (e) { console.warn('[boot] applyBtsMobileFlags failed:', e); }
  try { preloadBtsAssets(); } catch (e) { console.warn('[boot] preloadBtsAssets failed:', e); }
  try { applyTexts(); } catch (e) { console.warn('[boot] applyTexts failed:', e); }
  try { initMusic(); } catch (e) { console.warn('[boot] initMusic failed:', e); }
  try { initKonami(); } catch (e) { console.warn('[boot] initKonami failed:', e); }
  try { checkHash404(); } catch (e) { console.warn('[boot] checkHash404 failed:', e); }

  try {
    initLoader();
  } catch (e) {
    console.error('[boot] initLoader threw:', e);
    try { document.body.classList.remove('loading'); } catch (e2) {}
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    try { startFlow(); } catch (e3) {
      console.error('[boot] fallback startFlow threw:', e3);
      const gate = document.getElementById('pinGate');
      if (gate) gate.classList.remove('hidden');
    }
  }
});
