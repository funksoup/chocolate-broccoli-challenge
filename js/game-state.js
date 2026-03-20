/* ============================================================
   GAME STATE — Manages localStorage, progress, and badges
   Key: "chocolate_broccoli_data"
   ============================================================ */

const LS_KEY = 'chocolate_broccoli_data';

const DEFAULT_STATE = {
  session_start: null,
  progress: {
    level1: false,
    level2: false,
    level3: false,
    level4: false,
    level5: false
  },
  selected_mechanics: [],
  fun_test_answers: [false, false, false, false, false],
  design_form: {
    topic: '',
    understanding: '',
    skills: '',
    mechanic_connection: '',
    observe: '',
    decide: '',
    act: '',
    result: '',
    victory: '',
    failure: ''
  },
  evaluation_results: {
    score: 0,
    red_flags: [],
    strengths: [],
    issues: [],
    recommendations: []
  }
};

const BADGES = [
  { id: 'badge1', icon: '💡', name: 'Mechanic Master' },
  { id: 'badge2', icon: '🎯', name: 'Fun Evaluator' },
  { id: 'badge3', icon: '📝', name: 'Designer' },
  { id: 'badge4', icon: '🔬', name: 'Analyzer' },
  { id: 'badge5', icon: '🏆', name: 'Game Creator' }
];

const GameState = (() => {

  // ── Load / Save ──────────────────────────────────────────────

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      console.log('Loaded from localStorage:', parsed);
      return parsed;
    } catch (e) {
      console.error('Failed to load game state:', e);
      return null;
    }
  }

  function save(state) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
      console.log('Saved to localStorage:', state);
    } catch (e) {
      console.error('Failed to save game state:', e);
    }
  }

  function init() {
    let state = load();
    if (!state) {
      state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      state.session_start = new Date().toISOString();
      save(state);
      console.log('Game state initialized:', state);
    }
    return state;
  }

  function get() {
    return load() || init();
  }

  function update(updater) {
    const state = get();
    updater(state);
    save(state);
    return state;
  }

  function reset() {
    localStorage.removeItem(LS_KEY);
    console.log('Game state cleared');
  }

  // ── Progress ─────────────────────────────────────────────────

  function getProgressPercent(state) {
    const levels = Object.values(state.progress);
    const completed = levels.filter(Boolean).length;
    return completed * 20;
  }

  function completeLevel(levelKey) {
    return update(state => {
      state.progress[levelKey] = true;
    });
  }

  // ── Time ─────────────────────────────────────────────────────

  function getElapsedTime(state) {
    if (!state.session_start) return '—';
    const start = new Date(state.session_start);
    const now = new Date();
    const ms = now - start;
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    if (mins === 0) return `${secs}s`;
    if (mins < 60) return `${mins}m ${secs}s`;
    const hrs = Math.floor(mins / 60);
    const remainMins = mins % 60;
    return `${hrs}h ${remainMins}m`;
  }

  // ── UI Sync ───────────────────────────────────────────────────

  function renderProgress(state) {
    const pct = getProgressPercent(state);
    const fill = document.getElementById('progress-fill');
    const pctDisplay = document.getElementById('progress-percent');
    if (fill) fill.style.width = pct + '%';
    if (pctDisplay) pctDisplay.textContent = pct + '%';
    console.log('Progress updated:', pct + '%');
  }

  function renderBadges(state) {
    const levelKeys = ['level1', 'level2', 'level3', 'level4', 'level5'];
    BADGES.forEach((badge, i) => {
      const el = document.getElementById(badge.id);
      if (!el) return;
      const isUnlocked = state.progress[levelKeys[i]];
      if (isUnlocked) {
        el.classList.add('unlocked');
      } else {
        el.classList.remove('unlocked');
      }
    });
  }

  function renderLevelCards(state) {
    const levelKeys = ['level1', 'level2', 'level3', 'level4', 'level5'];
    levelKeys.forEach((key, i) => {
      const card = document.getElementById(`level-card-${i + 1}`);
      if (!card) return;

      card.classList.remove('locked', 'active', 'complete');

      if (state.progress[key]) {
        // Completed
        card.classList.add('complete');
        const statusIcon = card.querySelector('.level-status-icon');
        if (statusIcon) statusIcon.textContent = '✅';
        // Collapse body
        card.classList.remove('active');
      } else {
        // Determine if unlocked
        const prevKey = i > 0 ? levelKeys[i - 1] : null;
        const unlocked = i === 0 || (prevKey && state.progress[prevKey]);
        if (unlocked) {
          // Is this the current active level?
          const anyActive = levelKeys.slice(0, i).every(k => state.progress[k]);
          if (anyActive) {
            card.classList.add('active');
          } else {
            card.classList.add('locked');
          }
        } else {
          card.classList.add('locked');
        }
      }
    });
  }

  function syncUI(state) {
    renderProgress(state);
    renderBadges(state);
    renderLevelCards(state);
  }

  return {
    init,
    get,
    update,
    reset,
    save,
    load,
    getProgressPercent,
    completeLevel,
    getElapsedTime,
    renderProgress,
    renderBadges,
    renderLevelCards,
    syncUI,
    BADGES,
    DEFAULT_STATE
  };

})();

// Export for use in other modules
window.GameState = GameState;
