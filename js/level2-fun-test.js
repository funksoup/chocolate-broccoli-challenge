/* ============================================================
   LEVEL 2 — Fun Test Quiz
   - 5 interactive question cards with large checkboxes
   - Live score meter
   - Score interpretation box
   - Continue unlocks when all 5 checked
   ============================================================ */

const Level2 = (() => {

  const QUESTIONS = [
    {
      id: 0,
      text: 'When they lose, do they immediately want to try again?',
      badge: 'The Golden Indicator'
    },
    {
      id: 1,
      text: 'Would players choose this during free time?',
      badge: null
    },
    {
      id: 2,
      text: 'Do players make meaningful choices with real trade-offs?',
      badge: null
    },
    {
      id: 3,
      text: 'Is learning integrated into play (not paused for quizzes)?',
      badge: null
    },
    {
      id: 4,
      text: 'Could this game mechanic work with different subject content?',
      badge: null
    }
  ];

  const INTERPRETATIONS = [
    {
      min: 1, max: 1,
      cls: 'score-low',
      text: '🍫 The broccoli is still showing. Keep going — choose more guidelines to see how your mechanic holds up.'
    },
    {
      min: 2, max: 3,
      cls: 'score-mid',
      text: '🔧 You\'re onto something, but it needs more work. Focus on player agency and making sure learning drives the fun.'
    },
    {
      min: 4, max: 5,
      cls: 'score-high',
      text: '🎉 You\'ve nailed it! This is genuinely fun AND educational. Build it!'
    }
  ];

  let answers = [false, false, false, false, false];

  // ── Render ────────────────────────────────────────────────────
  function render() {
    const container = document.getElementById('fun-questions-container');
    if (!container) return;

    container.innerHTML = '';

    QUESTIONS.forEach(q => {
      const checked = answers[q.id];
      const card = document.createElement('div');
      card.className = 'fun-question-card' + (checked ? ' checked' : '');
      card.id = `fun-q-${q.id}`;
      card.setAttribute('role', 'checkbox');
      card.setAttribute('aria-checked', String(checked));
      card.setAttribute('tabindex', '0');

      card.innerHTML = `
        <div class="fun-checkbox" aria-hidden="true">${checked ? '✓' : ''}</div>
        <div>
          <div class="fun-question-text">${q.text}</div>
          ${q.badge ? `<span class="fun-question-badge">⭐ ${q.badge}</span>` : ''}
        </div>
      `;

      card.addEventListener('click', () => toggleQuestion(q.id));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleQuestion(q.id);
        }
      });

      container.appendChild(card);
    });

    updateMeter();
    updateContinueBtn();
  }

  // ── Toggle ────────────────────────────────────────────────────
  function toggleQuestion(id) {
    answers[id] = !answers[id];
    console.log('Button clicked: fun-question-' + id, 'checked:', answers[id]);

    // Persist
    GameState.update(state => {
      state.fun_test_answers = [...answers];
    });

    // Update UI
    const card = document.getElementById(`fun-q-${id}`);
    if (card) {
      card.classList.toggle('checked', answers[id]);
      card.setAttribute('aria-checked', String(answers[id]));
      const checkbox = card.querySelector('.fun-checkbox');
      if (checkbox) checkbox.textContent = answers[id] ? '✓' : '';
    }

    updateMeter();
    updateContinueBtn();
  }

  // ── Score Meter ───────────────────────────────────────────────
  function updateMeter() {
    const score = answers.filter(Boolean).length;
    const pct = (score / 5) * 100;

    const fill = document.getElementById('fun-score-fill');
    const valueEl = document.getElementById('fun-score-value');
    const resultBox = document.getElementById('fun-result-box');

    if (fill) {
      fill.style.width = pct + '%';
      // Color based on score
      if (score <= 1) {
        fill.style.background = '#e53e3e';
      } else if (score <= 3) {
        fill.style.background = '#F7B05B';
      } else {
        fill.style.background = '#A1CCA5';
      }
    }

    if (valueEl) valueEl.textContent = `Fun Guidelines: ${score}/5`;

    if (resultBox) {
      const interp = INTERPRETATIONS.find(i => score >= i.min && score <= i.max);
      if (score === 0 || !interp) {
        resultBox.style.display = 'none';
      } else {
        resultBox.style.display = '';
        resultBox.className = `score-result-box ${interp.cls}`;
        resultBox.textContent = interp.text;
      }
    }

    console.log('Progress updated: fun score', score + '/5');
  }

  // ── Continue Button ───────────────────────────────────────────
  function updateContinueBtn() {
    const btn = document.getElementById('level2-continue-btn');
    if (!btn) return;
    const allChecked = answers.every(Boolean);
    btn.disabled = !allChecked;
  }

  // ── Complete Level 2 ──────────────────────────────────────────
  function completeLevel2() {
    console.log('Button clicked: level2-continue');

    if (!answers.every(Boolean)) return;

    const state = GameState.completeLevel('level2');
    GameState.syncUI(state);

    const l3Card = document.getElementById('level-card-3');
    if (l3Card) {
      l3Card.classList.remove('locked');
      l3Card.classList.add('active');
      setTimeout(() => {
        l3Card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }

    if (window.Level3 && window.Level3.init) {
      window.Level3.init();
    }

    console.log('Progress updated: 40%');
  }

  // ── Restore State ─────────────────────────────────────────────
  function restoreState() {
    const state = GameState.get();
    if (state.fun_test_answers && state.fun_test_answers.length === 5) {
      answers = [...state.fun_test_answers];
    }
  }

  // ── Init ──────────────────────────────────────────────────────
  function init() {
    restoreState();
    render();

    const continueBtn = document.getElementById('level2-continue-btn');
    if (continueBtn && !continueBtn._bound) {
      continueBtn.addEventListener('click', () => completeLevel2());
      continueBtn._bound = true;
    }

    console.log('Level 2 initialized');
  }

  return { init };
})();

window.Level2 = Level2;
