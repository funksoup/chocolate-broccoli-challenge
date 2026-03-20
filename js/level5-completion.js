/* ============================================================
   LEVEL 5 — Completion Screen
   - Victory celebration with confetti
   - All 5 badges display
   - Summary card
   - Download buttons (blueprint, evaluation, complete report)
   - Start Over with confirmation
   ============================================================ */

const Level5 = (() => {

  const MECHANIC_NAMES = {
    resources: '💰 Manage Resources',
    risk: '⚖️ Make Risky Bets',
    puzzles: '🧩 Solve Puzzles',
    timer: '⏱️ Beat the Clock',
    compete: '🏆 Compete to Win',
    cooperate: '🤝 Work Together',
    roleplay: '🎭 Play a Role',
    build: '🎨 Build Something'
  };

  const ALL_BADGES = [
    { icon: '💡', name: 'Mechanic Master' },
    { icon: '🎯', name: 'Fun Evaluator' },
    { icon: '📝', name: 'Designer' },
    { icon: '🔬', name: 'Analyzer' },
    { icon: '🏆', name: 'Game Creator' }
  ];

  // ── Confetti ──────────────────────────────────────────────────
  function launchConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['#1D8A99', '#5F506B', '#849324', '#A1CCA5', '#F7B05B', '#ffffff', '#ff6b6b', '#ffd93d'];
    const count = 80;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.width = (Math.random() * 8 + 6) + 'px';
      piece.style.height = (Math.random() * 6 + 4) + 'px';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.animationDuration = (Math.random() * 2.5 + 2) + 's';
      piece.style.animationDelay = (Math.random() * 1.5) + 's';
      container.appendChild(piece);
    }

    // Remove confetti container after animation
    setTimeout(() => {
      if (container.parentNode) container.remove();
    }, 6000);

    console.log('Button clicked: confetti-launch');
  }

  // ── Build Summary ─────────────────────────────────────────────
  function buildSummary() {
    const state = GameState.get();
    const f = state.design_form || {};
    const evalResults = state.evaluation_results || {};
    const funScore = (state.fun_test_answers || []).filter(Boolean).length;
    const evalScore = evalResults.score || 0;
    const elapsed = GameState.getElapsedTime(state);
    const mechanics = (state.selected_mechanics || [])
      .map(id => MECHANIC_NAMES[id] || id);

    // Mechanics
    const mechanicsEl = document.getElementById('summary-mechanics');
    if (mechanicsEl) {
      mechanicsEl.textContent = mechanics.length > 0 ? mechanics.join(', ') : '—';
    }

    // Topic
    const subjectEl = document.getElementById('summary-subject');
    if (subjectEl) {
      subjectEl.textContent = f.topic || '—';
    }

    // Fun Score
    const funScoreEl = document.getElementById('summary-fun-score');
    if (funScoreEl) {
      let cls = funScore <= 1 ? 'score-low' : funScore <= 3 ? 'score-mid' : 'score-high';
      const labels = { 0: 'Start Over', 1: 'Start Over', 2: 'Needs Work', 3: 'Getting There', 4: 'Great!', 5: 'Perfect!' };
      funScoreEl.innerHTML = `${funScore}/5 <span class="score-result-box ${cls}" style="display:inline;padding:0.15rem 0.5rem;font-size:0.75rem;border:none">${labels[funScore] || ''}</span>`;
    }

    // Eval Score
    const evalScoreEl = document.getElementById('summary-eval-score');
    if (evalScoreEl) {
      let cls = evalScore <= 2 ? 'score-low' : evalScore === 3 ? 'score-mid' : 'score-high';
      const labels = { 0: 'Needs Revision', 1: 'Needs Revision', 2: 'Needs Revision', 3: 'Needs Work', 4: 'Almost Ready', 5: 'Ready to Build!' };
      evalScoreEl.innerHTML = `${evalScore}/5 <span class="score-result-box ${cls}" style="display:inline;padding:0.15rem 0.5rem;font-size:0.75rem;border:none">${labels[evalScore] || ''}</span>`;
    }

    // Time
    const timeEl = document.getElementById('summary-time');
    if (timeEl) timeEl.textContent = elapsed;

    // Status
    const statusEl = document.getElementById('summary-status');
    if (statusEl) {
      if (evalScore >= 4) {
        statusEl.innerHTML = '<span class="status-badge ready">✅ Ready to Build!</span>';
      } else {
        statusEl.innerHTML = '<span class="status-badge revise">🔧 Needs Revision</span>';
      }
    }
  }

  // ── Build Evaluation Markdown ─────────────────────────────────
  function buildEvaluationMd() {
    const state = GameState.get();
    const r = state.evaluation_results || {};

    return `# Game Design Evaluation Report
## Chocolate-Covered Broccoli Challenge

---

## Overall Score: ${r.score || 0}/5

---

${r.red_flags && r.red_flags.length > 0 ? `## ⚠️ Red Flags

${r.red_flags.map(f => `- ${f}`).join('\n')}

---` : ''}

## ✓ Strengths

${(r.strengths || []).map(s => `- ${s}`).join('\n') || '- None identified'}

---

## → Issues to Fix

${(r.issues || []).map(i => `- ${i}`).join('\n') || '- None identified'}

---

## 💡 Recommendations

${(r.recommendations || []).map(r => `- ${r}`).join('\n') || '- None yet'}

---
*Generated by the Chocolate-Covered Broccoli Challenge*
*Date: ${new Date().toLocaleDateString()}*
`;
  }

  // ── Download Helpers ──────────────────────────────────────────
  function downloadMd(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    console.log('Button clicked: download-' + filename);
  }

  function downloadBlueprint() {
    if (window.Level3) {
      downloadMd(window.Level3.buildBlueprint(), 'game-design-blueprint.md');
    }
  }

  function downloadEvaluation() {
    downloadMd(buildEvaluationMd(), 'game-design-evaluation.md');
  }

  function downloadCompleteReport() {
    const blueprint = window.Level3 ? window.Level3.buildBlueprint() : '';
    const evaluation = buildEvaluationMd();
    const combined = `${blueprint}\n\n---\n\n${evaluation}`;
    downloadMd(combined, 'game-design-complete-report.md');
  }

  // ── Start Over ────────────────────────────────────────────────
  function showStartOverConfirm() {
    console.log('Button clicked: start-over');
    const dialog = document.getElementById('confirm-dialog');
    if (dialog) {
      dialog.classList.add('open');
    }
  }

  function hideConfirm() {
    const dialog = document.getElementById('confirm-dialog');
    if (dialog) dialog.classList.remove('open');
  }

  function confirmStartOver() {
    console.log('Button clicked: confirm-start-over');
    GameState.reset();
    location.reload();
  }

  // ── Render Completion Badges ──────────────────────────────────
  function renderCompletionBadges() {
    const container = document.getElementById('completion-badges-display');
    if (!container) return;

    container.innerHTML = ALL_BADGES.map(b => `
      <div class="completion-badge">
        <span class="badge-emoji">${b.icon}</span>
        <span class="badge-name">${b.name}</span>
      </div>
    `).join('');
  }

  // ── Complete Level 5 ──────────────────────────────────────────
  function completeLevel5() {
    const state = GameState.completeLevel('level5');
    GameState.syncUI(state);
    // syncUI collapses the card (marks it 'complete'), but Level 5 is the
    // final reward screen and must stay fully visible — force it back open.
    const card = document.getElementById('level-card-5');
    if (card) {
      card.classList.remove('complete');
      card.classList.add('active');
      const statusIcon = card.querySelector('.level-status-icon');
      if (statusIcon) statusIcon.textContent = '🏆';
    }
    console.log('Progress updated: 100%');
  }

  // ── Init ──────────────────────────────────────────────────────
  function init() {
    // Complete level 5 immediately on init
    completeLevel5();

    // Render
    buildSummary();
    renderCompletionBadges();

    // Launch confetti after short delay
    setTimeout(() => launchConfetti(), 500);

    // Bind download buttons
    const dlBlueprint = document.getElementById('download-blueprint-final');
    if (dlBlueprint && !dlBlueprint._bound) {
      dlBlueprint.addEventListener('click', () => downloadBlueprint());
      dlBlueprint._bound = true;
    }

    const dlEval = document.getElementById('download-evaluation-final');
    if (dlEval && !dlEval._bound) {
      dlEval.addEventListener('click', () => downloadEvaluation());
      dlEval._bound = true;
    }

    const dlComplete = document.getElementById('download-complete-final');
    if (dlComplete && !dlComplete._bound) {
      dlComplete.addEventListener('click', () => downloadCompleteReport());
      dlComplete._bound = true;
    }

    // Note: Start Over / confirm dialog is wired globally in the bootstrap script.
    console.log('Level 5 initialized — 100% complete!');
  }

  return { init };
})();

window.Level5 = Level5;
