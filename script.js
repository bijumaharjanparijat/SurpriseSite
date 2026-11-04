/* ============================================================
   Deepa: The Forever Duo — main logic
   State, loading, gating, animations, interactions, surprises
   ============================================================ */

const STATE_KEY = 'deepa_site_state_v2';
let memState = null;

if (/[?&]reset\b/.test(location.search)) {
  try { localStorage.removeItem(STATE_KEY); } catch (e) {}
  history.replaceState(null, '', location.pathname);
}

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
      konamiDone: false
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

function toast(msg) {
  const region = $('#toastRegion') || document.body;
  const t = document.createElement('div');
  t.className = 'toast';
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

/* ---------- LOADER ---------- */
function initLoader() {
  const loader = $('#loader');
  const skipBtn = $('#skipBtn');
  const textEl = $('#loaderText');
  const ringFill = $('.ring-fill');
  const L = CONFIG.loading;
  const msgs = L.loadingMessages || [];
  const state = getState();
  const minDuration = state.pinUnlocked ? 2500 : (reducedMotion ? 4000 : L.minDurationMs);
  const skipAfter = state.pinUnlocked ? 0 : (reducedMotion ? 0 : L.skipAfterMs);

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
    clearInterval(msgInterval);
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      startFlow();
    }, 800);
  }
  if (skipBtn) skipBtn.addEventListener('click', finish);
  setTimeout(finish, minDuration);
}

/* ---------- FLOW ---------- */
function startFlow() {
  const state = getState();
  if (state.pinUnlocked) {
    if (state.metDateCorrect && state.relationshipDateCorrect) {
      showMainSite();
    } else {
      showDateQuestions();
    }
  } else {
    showPinGate();
  }
}

function showPinGate() {
  const gate = $('#pinGate');
  if (!gate) return;
  gate.classList.remove('hidden');
  initPinGate();
}

/* ---------- PIN GATE ---------- */
function initPinGate() {
  const inputs = $$('.pin-input');
  const message = $('#pinMessage');
  const container = $('.pin-inputs');
  if (!inputs.length || !container) return;

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

  // Only auto-focus on non-touch devices to avoid mobile keyboard popping up
  if (!window.matchMedia('(pointer: coarse)').matches) inputs[0].focus();

  function shakeAndClear() {
    container.classList.add('shake');
    setTimeout(() => {
      container.classList.remove('shake');
      inputs.forEach((i) => { i.value = ''; });
      if (!window.matchMedia('(pointer: coarse)').matches) inputs[0].focus();
    }, 600);
  }

  function checkPin() {
    const pin = inputs.map((i) => i.value).join('');
    if (pin.length !== 4) return;

    if (pin === CONFIG.pin) {
      message.textContent = CONFIG.ui.welcome;
      message.className = 'pin-message success';
      heartBurst(container);
      setState({ pinUnlocked: true });
      inputs.forEach((i) => { i.disabled = true; });
      setTimeout(() => {
        $('#pinGate').classList.add('hidden');
        showDateQuestions();
      }, 1700);
      return;
    }

    const egg = CONFIG.pinEasterEgg && CONFIG.pinEasterEgg[pin];
    if (egg) {
      message.textContent = egg;
      message.className = 'pin-message error';
      heartBurst(container);
      shakeAndClear();
      return;
    }

    message.textContent = CONFIG.ui.wrongPin;
    message.className = 'pin-message error';
    shakeAndClear();
  }
}

/* ---------- DATE QUESTIONS ---------- */
function showDateQuestions() {
  const el = $('#dateQuestions');
  if (!el) return;
  el.classList.remove('hidden');
  initDateQuestions();
}

const normAnswer = (v) =>
  v.toLowerCase()
    .replace(/(\d)(st|nd|rd|th)\b/g, '$1')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

function initDateQuestions() {
  const state = getState();
  const q1 = CONFIG.dates.met;
  const q2 = CONFIG.dates.relationship;

  $('#q1Text').textContent = q1.question;
  $('#q1Hint').textContent = q1.hint;
  $('#q2Text').textContent = q2.question;
  $('#q2Hint').textContent = q2.hint;

  if (state.metDateCorrect) {
    $('#q1').classList.add('hidden');
    $('#q2').classList.remove('hidden');
  }

  setupQuestion('q1', q1, () => {
    $('#q1').classList.add('hidden');
    $('#q2').classList.remove('hidden');
    const q2Input = $('#q2Input');
    if (q2Input && !window.matchMedia('(pointer: coarse)').matches) q2Input.focus();
  });

  setupQuestion('q2', q2, () => {
    setTimeout(() => {
      $('#dateQuestions').classList.add('hidden');
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
      setTimeout(() => toast(config.easterEgg), delay + 800);
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
let siteReady = false;

function showMainSite() {
  const main = $('#mainSite');
  if (!main) return;
  main.classList.remove('hidden');
  initMainSite();
}

function initMainSite() {
  if (siteReady) return;
  siteReady = true;
  initHero();
  initBtsLounge();
  initTimeline();
  initHeroes();
  initStats();
  initSpinner();
  initMood();
  initEnoughRoom();
  initHug();
  initFear();
  initVoice();
  initDreamJob();
  initFavorites();
  initGallery();
  initDreamMap();
  initLetter();
  initQuiz();
  updateFinalTrigger(true);
  const finalBtn = $('#finalTriggerBtn');
  if (finalBtn) finalBtn.addEventListener('click', openFinalSurprise);
  initReveal();
}

/* ---------- HERO ---------- */
function initHero() {
  const nameEl = $('#heroName');
  const subtitleEl = $('#heroSubtitle');
  const factEl = $('#heroFact');
  const beginBtn = $('#beginBtn');
  const particleBox = $('#particles');

  if (nameEl) nameEl.textContent = CONFIG.hero.name;
  if (subtitleEl) subtitleEl.textContent = '';
  if (beginBtn) beginBtn.textContent = CONFIG.hero.beginButton;

  setTimeout(() => {
    if (subtitleEl) typeWriter(subtitleEl, CONFIG.hero.typewriter, 60);
  }, 900);

  // Floating fact rotation
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

  // Tap to reveal full typewriter
  if (subtitleEl) {
    subtitleEl.addEventListener('click', () => {
      if (subtitleEl._finish) subtitleEl._finish();
    });
  }

  if (beginBtn) {
    beginBtn.addEventListener('click', () => smoothScrollTo($('#timelineSection')));
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
  const cooldownMs = (S.cooldownHours || 4) * 60 * 60 * 1000;

  function refreshState() {
    const last = getState().interactions.spinnerLastSpin || 0;
    const elapsed = Date.now() - last;
    if (elapsed < cooldownMs) {
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
    if (btn.disabled) return;
    btn.classList.add('spinning');

    setTimeout(() => {
      const reasons = S.reasons || [];
      const pick = reasons[Math.floor(Math.random() * reasons.length)] || 'Because you exist.';
      result.textContent = pick;
      result.classList.remove('show');
      void result.offsetWidth;
      result.classList.add('show');
      btn.classList.remove('spinning');

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
    btn.style.display = 'none';
    msgEl.classList.add('hidden');
    finalEl.classList.remove('hidden');
    const vLabel = $('#victoryLabel');
    const vSub = $('#victorySubtext');
    if (vLabel) vLabel.textContent = R.victoryLabel;
    if (vSub) vSub.textContent = R.victorySubtext;
  } else {
    btn.textContent = idx === messages.length - 1 ? CONFIG.ui.enoughLast : R.buttonLabel;
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
        btn.textContent = CONFIG.ui.enoughLast;
      }
      return;
    }

    btn.style.display = 'none';
    msgEl.classList.add('hidden');
    finalEl.classList.remove('hidden');
    const vLabel = $('#victoryLabel');
    const vSub = $('#victorySubtext');
    if (vLabel) vLabel.textContent = R.victoryLabel;
    if (vSub) vSub.textContent = R.victorySubtext;
    heartBurst(finalEl);
  });
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

  // Screen reader version (full text)
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
  if (!(hasInteractedEnough() || s.finalSurpriseUnlocked)) return;

  if (s.finalSurpriseUnlocked) {
    btn.textContent = CONFIG.ui.replayLabel;
  }

  if (btn.classList.contains('hidden')) {
    btn.classList.remove('hidden');
    if (!quiet && !s.finalSurpriseUnlocked) {
      toast(CONFIG.ui.nudge);
    }
  }
}

/* ---------- FINAL SURPRISE ---------- */
let finalReady = false;
let confettiOn = false;
let finalTimers = [];
let lastFocus = null;

function resetFinal() {
  ['#finalIntro', '#finalMessage', '#finalButtons', '#finalThanks', '#finalAfter'].forEach((q) => {
    const el = $(q);
    if (el) el.classList.remove('show');
  });
  ['#finalThanks', '#finalAfter', '#finalActions', '#finalClose'].forEach((q) => {
    const el = $(q);
    if (el) el.classList.add('hidden');
  });
  const buttons = $('#finalButtons');
  if (buttons) buttons.classList.remove('hidden');
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
    after.textContent = CONFIG.finalSurprise.afterAcceptMessage;
    after.classList.remove('hidden');
    setTimeout(() => after.classList.add('show'), 500);
  }

  const actions = $('#finalActions');
  if (actions) actions.classList.remove('hidden');
  const close = $('#finalClose');
  if (close) close.classList.remove('hidden');

  if (fresh) {
    setState({ finalSurpriseUnlocked: true });
    startConfetti();
    updateFinalTrigger(true);
  }
}

function closeFinal() {
  finalTimers.forEach(clearTimeout);
  finalTimers = [];
  const overlay = $('#finalSurprise');
  if (overlay) overlay.classList.add('hidden');
  document.body.classList.remove('no-scroll');
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

function openFinalSurprise() {
  const overlay = $('#finalSurprise');
  if (!overlay || !overlay.classList.contains('hidden')) return;
  const F = CONFIG.finalSurprise;

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
  document.body.classList.add('no-scroll');
  overlay.focus();
  void overlay.offsetWidth;

  if (getState().finalSurpriseUnlocked) {
    $('#finalIntro').classList.add('show');
    $('#finalMessage').classList.add('show');
    showAccepted(false);
  } else {
    finalTimers.push(
      setTimeout(() => $('#finalIntro').classList.add('show'), 50),
      setTimeout(() => $('#finalMessage').classList.add('show'), 1600),
      setTimeout(() => $('#finalButtons').classList.add('show'), 3200)
    );
  }
}

async function sharePromise() {
  const F = CONFIG.finalSurprise;
  const text = `${F.certificateTitle}\n${F.certificateNames}\n${F.certificateLine}\n${F.certificateDate}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: F.certificateTitle, text });
      return;
    } catch (e) { /* fall through to clipboard */ }
  }
  try {
    await navigator.clipboard.writeText(text);
    toast('Copied. Now send it to whoever needs to know.');
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
      life: 1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = 0;
    particles.forEach((p) => {
      if (p.life <= 0) return;
      alive++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28;
      p.rotation += p.rotSpeed;
      p.life -= 0.005;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
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
function downloadCertificate() {
  const W = 1400;
  const H = 900;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0E1220');
  grad.addColorStop(0.5, '#2A1B45');
  grad.addColorStop(1, '#4A2C6B');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Gold outer border
  ctx.strokeStyle = '#E8D5A3';
  ctx.lineWidth = 6;
  ctx.strokeRect(50, 50, W - 100, H - 100);

  // Purple inner border
  ctx.strokeStyle = '#7B4B9E';
  ctx.lineWidth = 2;
  ctx.strokeRect(78, 78, W - 156, H - 156);

  // Corner hearts
  ctx.font = '44px serif';
  ctx.fillStyle = '#E8D5A3';
  ctx.textAlign = 'center';
  ctx.fillText('♡', 120, 155);
  ctx.fillText('♡', W - 120, 155);
  ctx.fillText('♡', 120, H - 115);
  ctx.fillText('♡', W - 120, H - 115);

  const cx = W / 2;

  ctx.fillStyle = '#E8D5A3';
  ctx.font = 'bold 58px Georgia, serif';
  ctx.fillText(CONFIG.finalSurprise.certificateTitle, cx, 250);

  ctx.fillStyle = '#C2A3E1';
  ctx.font = 'italic 26px Georgia, serif';
  ctx.fillText(CONFIG.ui.certIntro, cx, 340);

  ctx.fillStyle = '#FFF8F0';
  ctx.font = 'bold 50px Georgia, serif';
  ctx.fillText(CONFIG.finalSurprise.certificateNames, cx, 440);

  ctx.fillStyle = '#C2A3E1';
  ctx.font = 'italic 30px Georgia, serif';
  ctx.fillText(CONFIG.ui.certBound, cx, 515);

  ctx.fillStyle = '#E8D5A3';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.fillText(CONFIG.ui.certRole, cx, 595);

  ctx.fillStyle = '#C2A3E1';
  ctx.font = '24px Georgia, serif';
  ctx.fillText(CONFIG.finalSurprise.certificateLine, cx, 680);

  ctx.fillStyle = '#9C8AA8';
  ctx.font = '22px Georgia, serif';
  ctx.fillText(CONFIG.finalSurprise.certificateDate, cx, 765);

  // Seal
  ctx.beginPath();
  ctx.arc(cx, 820, 40, 0, Math.PI * 2);
  ctx.fillStyle = '#7B4B9E';
  ctx.fill();
  ctx.strokeStyle = '#E8D5A3';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#FFF8F0';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.fillText('♡', cx, 828);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const file = new File([blob], 'duo-partner-certificate.png', { type: 'image/png' });

    if (matchMedia('(pointer: coarse)').matches && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: CONFIG.finalSurprise.certificateTitle
      }).catch(() => {});
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = file.name;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }, 'image/png');
}

/* ---------- MUSIC ---------- */
function initMusic() {
  const btn = $('#musicBtn');
  const panel = $('#musicPanel');
  const placeholder = $('#musicPlaceholder');
  const embed = $('#musicEmbed');
  if (!btn || !panel) return;

  if (placeholder && CONFIG.music && CONFIG.music.placeholder) {
    placeholder.textContent = CONFIG.music.placeholder;
  }

  if (embed && CONFIG.music && CONFIG.music.embed) {
    embed.innerHTML = CONFIG.music.embed;
    if (placeholder) placeholder.style.display = 'none';
  }

  btn.addEventListener('click', () => {
    const open = panel.classList.toggle('hidden') === false;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.classList.toggle('active', open);
  });
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
  if (typeof CONFIG === 'undefined') {
    console.error('CONFIG not found. Make sure config.js loads before script.js.');
    return;
  }
  applyTexts();
  initMusic();
  initKonami();
  checkHash404();
  initLoader();
});