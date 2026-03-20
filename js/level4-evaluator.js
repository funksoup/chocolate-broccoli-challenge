/* ============================================================
   LEVEL 4 — Evaluator
   - Blueprint auto-fills from Level 3
   - 5-point analysis algorithm
   - Red flag detection
   - Scored results with color-coded sections
   ============================================================ */

const Level4 = (() => {

  // ── Analysis Algorithm ────────────────────────────────────────

  function analyze(blueprint) {
    const text = blueprint.toLowerCase();
    const state = GameState.get();
    const f = state.design_form || {};

    let score = 0;
    const strengths = [];
    const issues = [];
    const red_flags = [];

    // ── Check 1: Meaningful choices in DECIDE ──────────────────
    const decideText = (f.decide || '').toLowerCase();
    const choiceKeywords = ['choose', 'decide', 'allocate', 'vary', 'adjust', 'risk', 'manage', 'select', 'pick', 'option', 'trade'];
    const hasChoiceKeyword = choiceKeywords.some(kw => decideText.includes(kw));

    if (hasChoiceKeyword) {
      score++;
      strengths.push('Players have meaningful choices — the DECIDE phase includes real decision-making vocabulary.');
    } else {
      issues.push('The DECIDE phase doesn\'t clearly describe meaningful choices. Add words like "choose," "allocate," or "trade off" to show real player agency.');
    }

    // ── Check 2: Victory condition is strategic ────────────────
    const victoryText = (f.victory || '').toLowerCase();
    const quizRedFlagPatterns = [
      { pat: ['answer', 'correct'], label: '"answer correctly" victory condition detected — this is a quiz, not a game' },
      { pat: ['quiz'], label: '"quiz" detected in victory condition' },
      { pat: ['question'], label: '"question" detected in victory condition — rethink as a strategic goal' }
    ];

    let victoryRedFlag = false;
    quizRedFlagPatterns.forEach(({ pat, label }) => {
      if (pat.every(p => victoryText.includes(p))) {
        red_flags.push(label);
        victoryRedFlag = true;
      } else if (pat.length === 1 && victoryText.includes(pat[0])) {
        // single word check
      }
    });

    const strategicWords = ['strategy', 'strateg', 'efficient', 'optimize', 'survive', 'manage', 'outperform', 'complete', 'build', 'collect', 'reach', 'achieve'];
    const hasStrategicVictory = strategicWords.some(kw => victoryText.includes(kw));

    if (!victoryRedFlag && hasStrategicVictory) {
      score++;
      strengths.push('Victory condition is strategic and gameplay-based rather than quiz-based.');
    } else if (!victoryRedFlag) {
      score++;
      strengths.push('Victory condition avoids quiz patterns.');
    } else {
      issues.push('Victory condition sounds like a quiz (answering questions correctly). Redesign so winning requires strategic gameplay, not just correct answers.');
    }

    // ── Check 3: Mechanic-learning connection ──────────────────
    const connectionText = (f.mechanic_connection || '');
    if (connectionText.trim().length >= 30) {
      score++;
      strengths.push('Clear explanation of how learning connects to gameplay mechanics.');
    } else {
      issues.push('The mechanic-learning connection is too brief (under 30 characters). Explain in detail how subject knowledge gives players a gameplay advantage.');
    }

    // ── Check 4: Feedback in RESULT ───────────────────────────
    const resultText = (f.result || '').toLowerCase();
    const feedbackKeywords = ['visual', 'feedback', 'update', 'change', 'show', 'see', 'display', 'notify', 'indicator', 'score', 'loses', 'gains', 'decreases', 'increases'];
    const hasFeedback = feedbackKeywords.some(kw => resultText.includes(kw));

    if (hasFeedback) {
      score++;
      strengths.push('RESULT phase includes clear feedback mechanisms — players can see the consequences of their choices.');
    } else {
      issues.push('The RESULT phase doesn\'t clearly describe what players see or experience. Add visual/audio feedback signals so players understand what happened.');
    }

    // ── Check 5: Fair failure condition ───────────────────────
    const failureText = (f.failure || '').toLowerCase();

    const timedQuizFlags = [
      { pat: ['time', 'answer'], label: 'Failure from "running out of time to answer" — this is a timed quiz, not a game mechanic' },
      { pat: ['run out', 'time'], label: 'Failure from "running out of time" — consider whether this is meaningful or just punishing' }
    ];

    let failureRedFlag = false;
    timedQuizFlags.forEach(({ pat, label }) => {
      if (pat.every(p => failureText.includes(p))) {
        red_flags.push(label);
        failureRedFlag = true;
      }
    });

    const fairFailureWords = ['zero', 'collapse', 'lose', 'doesn\'t', 'no longer', 'bankrupt', 'eliminated', 'depleted', 'runs out', 'fails'];
    const hasFairFailure = fairFailureWords.some(kw => failureText.includes(kw));

    if (!failureRedFlag && hasFairFailure) {
      score++;
      strengths.push('Failure condition is tied to strategic/resource outcomes, not quiz performance.');
    } else if (!failureRedFlag) {
      score++;
      strengths.push('Failure condition avoids common quiz-game anti-patterns.');
    } else {
      issues.push('Failure condition relies on timed quiz patterns. Redesign failure around strategic depletion: "You run out of resources," "Your empire collapses," etc.');
    }

    // ── Global Red Flag Checks ─────────────────────────────────
    const globalRedFlags = [
      { check: () => text.includes('points for correct'), label: '"Points for correct answers" detected — this is the definition of chocolate-covered broccoli' },
      { check: () => text.includes('quiz') && text.includes('score'), label: 'Quiz + score pattern detected across the design — reframe as strategic gameplay outcomes' }
    ];

    globalRedFlags.forEach(({ check, label }) => {
      if (check() && !red_flags.includes(label)) {
        red_flags.push(label);
      }
    });

    // ── Recommendations ────────────────────────────────────────
    const recommendations = [];

    if (score <= 2) {
      recommendations.push('CRITICAL: You have chocolate-covered broccoli. Go back to Level 1 and choose a different mechanic — one that makes subject knowledge the actual strategy, not just a prerequisite for answering questions.');
      recommendations.push('Ask yourself: does a player who knows more of the subject genuinely play better? If not, the design is broken.');
    } else if (score === 3) {
      recommendations.push('Address the issues above before building anything. You\'re close, but the flaws will create a frustrating experience.');
      recommendations.push('Focus on the weakest link: usually the victory condition or the mechanic-learning connection.');
    } else {
      recommendations.push('Build a paper prototype! Playtest with 3–5 students using just index cards, dice, or tokens.');
      recommendations.push('During playtesting, watch for: do students use their subject knowledge spontaneously? Do they want to play again after losing?');
      recommendations.push('Iterate based on what you observe — the first playtest always reveals something the design misses.');
    }

    const results = { score, red_flags, strengths, issues, recommendations };

    // Persist
    GameState.update(state => {
      state.evaluation_results = results;
    });

    console.log('Progress updated: evaluation score', score + '/5');
    return results;
  }

  // ── Render Results ────────────────────────────────────────────
  function renderResults(results) {
    const { score, red_flags, strengths, issues, recommendations } = results;

    const container = document.getElementById('eval-results');
    if (!container) return;

    container.classList.add('visible');

    // Score display
    const scoreDisplay = document.getElementById('eval-score-display');
    const scoreNumber = document.getElementById('eval-score-number');
    const scoreLabel = document.getElementById('eval-score-label-text');

    if (scoreDisplay) {
      scoreDisplay.classList.remove('score-low', 'score-mid', 'score-high');
      if (score <= 2) scoreDisplay.classList.add('score-low');
      else if (score === 3) scoreDisplay.classList.add('score-mid');
      else scoreDisplay.classList.add('score-high');
    }
    if (scoreNumber) scoreNumber.textContent = score + '/5';
    if (scoreLabel) {
      const labels = ['', 'Needs Major Revision', 'Needs Major Revision', 'Address Issues First', 'Almost There!', 'Ready to Build!'];
      scoreLabel.textContent = labels[score] || '';
    }

    // Red Flags
    const flagsSection = document.getElementById('eval-section-flags');
    if (flagsSection) {
      if (red_flags.length > 0) {
        flagsSection.classList.remove('hidden');
        flagsSection.querySelector('ul').innerHTML = red_flags.map(f => `<li>${f}</li>`).join('');
      } else {
        flagsSection.classList.add('hidden');
      }
    }

    // Strengths
    const strengthsSection = document.getElementById('eval-section-strengths');
    if (strengthsSection) {
      if (strengths.length > 0) {
        strengthsSection.classList.remove('hidden');
        strengthsSection.querySelector('ul').innerHTML = strengths.map(s => `<li>${s}</li>`).join('');
      } else {
        strengthsSection.classList.add('hidden');
      }
    }

    // Issues
    const issuesSection = document.getElementById('eval-section-issues');
    if (issuesSection) {
      if (issues.length > 0) {
        issuesSection.classList.remove('hidden');
        issuesSection.querySelector('ul').innerHTML = issues.map(i => `<li>${i}</li>`).join('');
      } else {
        issuesSection.classList.add('hidden');
      }
    }

    // Recommendations
    const recsSection = document.getElementById('eval-section-recommendations');
    if (recsSection) {
      if (recommendations.length > 0) {
        recsSection.classList.remove('hidden');
        recsSection.querySelector('ul').innerHTML = recommendations.map(r => `<li>${r}</li>`).join('');
      } else {
        recsSection.classList.add('hidden');
      }
    }

    // Show continue button
    const continueBtn = document.getElementById('level4-continue-btn');
    if (continueBtn) {
      continueBtn.classList.remove('hidden');
    }

    // Scroll to results
    if (container) {
      setTimeout(() => {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }

  // ── Complete Level 4 ──────────────────────────────────────────
  function completeLevel4() {
    console.log('Button clicked: level4-continue');

    const state = GameState.completeLevel('level4');
    GameState.syncUI(state);

    const l5Card = document.getElementById('level-card-5');
    if (l5Card) {
      l5Card.classList.remove('locked');
      l5Card.classList.add('active');
      setTimeout(() => {
        l5Card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }

    if (window.Level5 && window.Level5.init) {
      window.Level5.init();
    }

    console.log('Progress updated: 80%');
  }

  // ── Populate Blueprint Preview ────────────────────────────────
  function populateBlueprint(blueprint) {
    const preview = document.getElementById('eval-blueprint-preview');
    if (preview) {
      preview.textContent = blueprint || '— No blueprint data yet. Complete the Designer form first. —';
    }
  }

  // ── Init ──────────────────────────────────────────────────────
  function init(blueprintArg) {
    // Get blueprint from argument or from saved state
    const state = GameState.get();
    const blueprint = blueprintArg || state.design_form_blueprint || '';

    populateBlueprint(blueprint);

    // Bind evaluate button
    const evalBtn = document.getElementById('evaluate-btn');
    if (evalBtn && !evalBtn._bound) {
      evalBtn.addEventListener('click', () => {
        console.log('Button clicked: evaluate-btn');
        const currentBlueprint = document.getElementById('eval-blueprint-preview')?.textContent || blueprint;
        const results = analyze(currentBlueprint);
        renderResults(results);
      });
      evalBtn._bound = true;
    }

    // Bind continue button
    const continueBtn = document.getElementById('level4-continue-btn');
    if (continueBtn && !continueBtn._bound) {
      continueBtn.addEventListener('click', () => completeLevel4());
      continueBtn._bound = true;
    }

    // If results already exist, show them
    if (state.evaluation_results && state.evaluation_results.score > 0) {
      renderResults(state.evaluation_results);
    }

    console.log('Level 4 initialized');
  }

  return { init, analyze };
})();

window.Level4 = Level4;
