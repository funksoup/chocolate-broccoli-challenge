/* ============================================================
   LEVEL 3 — Game Designer (4-Step Form Wizard)
   - Tab navigation: Step 1-4
   - Auto-save every 5 seconds
   - Validates required fields before advancing
   - ODAR framework in Step 3
   - Auto-Fill Evaluator + Download Blueprint on Step 4
   ============================================================ */

const Level3 = (() => {

  const FIELDS = ['topic', 'understanding', 'skills',
                  'mechanic_connection', 'observe', 'decide', 'act',
                  'result', 'victory', 'failure'];

  const STEPS = [
    {
      num: 1,
      title: 'Learning Goals',
      fields: ['topic', 'understanding', 'skills']
    },
    {
      num: 2,
      title: 'Mechanic Connection',
      fields: ['mechanic_connection']
    },
    {
      num: 3,
      title: 'Gameplay Loop',
      fields: ['observe', 'decide', 'act', 'result']
    },
    {
      num: 4,
      title: 'Win/Lose',
      fields: ['victory', 'failure']
    }
  ];

  let currentStep = 1;
  let autoSaveInterval = null;
  let formData = {};

  // ── Mechanic Names Map ────────────────────────────────────────
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

  // ── Mechanic-Specific Questions & Examples ────────────────────
  const MECHANIC_QUESTIONS = {
    resources: {
      question: 'What limited resources will players manage, and how does knowing your subject help them spend those resources wisely?',
      hint: 'Name the resource (tokens, cards, energy, budget…) and explain exactly why a student who knows the subject will waste less of it than one who doesn\'t.',
      examples: [
        { scenario: 'Biology / Cellular Respiration', description: 'Players manage ATP and glucose tokens each round. Knowing the Krebs cycle reveals which metabolic paths cost less energy — ignorance means waste, and wasted tokens mean a dead cell.' },
        { scenario: 'Math / Fractions', description: 'Players have a "cup budget" to fill recipe orders. Understanding equivalent fractions lets you combine ingredients more efficiently — guessers run out first.' },
        { scenario: 'English / Grammar', description: 'Each player has a limited word-card hand to build the clearest sentence. Grammar knowledge helps you cut redundant words — every card you save is a card you can spend later.' }
      ]
    },
    risk: {
      question: 'What are the risky bets players will face, and how does knowing the subject turn a gamble into a calculated decision?',
      hint: 'The best risk mechanics reward knowledge by making the "right" risk obvious to informed players — and mysterious to uninformed ones.',
      examples: [
        { scenario: 'Economics / Supply & Demand', description: 'Players bet tokens on which product will outsell given a set of market conditions. Understanding demand curves turns a coin-flip into a prediction — informed players win more bets.' },
        { scenario: 'Chemistry / Reaction Types', description: 'Choose between a safe, low-yield reaction and a risky, high-yield one. Knowing which reactions are exothermic vs. endothermic — and which conditions stabilize them — makes the "gamble" calculable.' },
        { scenario: 'History / Political Alliances', description: 'Players bet on which alliance will hold under pressure. Knowing the historical tensions and interests of each nation makes some bets obviously safer than others.' }
      ]
    },
    puzzles: {
      question: 'What puzzles will your players be solving, and why is subject knowledge the only reliable way to crack them?',
      hint: 'The puzzle should be genuinely unsolvable by guessing alone. Subject understanding must be the key — not trial and error.',
      examples: [
        { scenario: 'Math / Pythagorean Theorem', description: 'A map puzzle: players must find the shortest walking path across a park grid. The diagonal shortcut is only discoverable using a² + b² = c². Guessers always walk the long way around.' },
        { scenario: 'Geometry / Measurement', description: 'Teams choose furniture from a catalog to fit through a doorway and around a corner. You must calculate dimensions and turning radius — the right answer is the only one that fits, and it requires real math.' },
        { scenario: 'Environmental Science / Food Webs', description: 'Players get organism cards and must arrange a stable food web. Remove the wrong species and the chain collapses. Only someone who understands producer/consumer/decomposer roles can solve it correctly.' },
        { scenario: 'Algebra / Equations', description: 'A secret message is encoded — each variable unlocks a letter. Students must isolate variables and substitute values. The puzzle can\'t be brute-forced; algebra is the only key.' }
      ]
    },
    timer: {
      question: 'What decisions must players make under time pressure, and what knowledge makes those decisions fast enough to succeed?',
      hint: 'Timed mechanics reward fluency, not just familiarity. Students should know the subject well enough that the right answer surfaces instantly — not after counting on fingers.',
      examples: [
        { scenario: 'World Languages / Vocabulary', description: '30-second sprint: match foreign words to images before time runs out. Only genuine vocabulary recall is fast enough — translation + guessing takes too long.' },
        { scenario: 'History / Chronology', description: 'Shuffle a deck of events and race to arrange them in order. Knowing the timeline cold means you place cards instantly. Hesitation loses rounds.' },
        { scenario: 'Math / Multiplication', description: 'Players "bid" on math problems: faster correct answers earn more points, but wrong answers cost tokens. Fluent students bid high on hard problems; others pass.' }
      ]
    },
    compete: {
      question: 'How will players compete, and what specific knowledge gives one player a clear edge over an opponent who hasn\'t studied?',
      hint: 'The competition should feel fair but knowledge-skewed. A student who studied should win more often — not because they\'re lucky, but because they\'re informed.',
      examples: [
        { scenario: 'Civics / Policy Debate', description: 'Players argue opposing positions using evidence cards. The audience votes on the most convincing argument. A stronger grasp of the facts makes your argument harder to refute.' },
        { scenario: 'Physics / Bridge Building', description: 'Players design bridges with identical card budgets. The one that holds the most weight wins — understanding load distribution and triangular bracing directly predicts whose structure survives.' },
        { scenario: 'Math / Estimation', description: 'Players race to place numbers on a number line. Closest wins. Number sense developed through practice means faster, more accurate estimates than opponents who count from scratch.' }
      ]
    },
    cooperate: {
      question: 'How will your players work together — and what unique information or role does each player hold that nobody else has?',
      hint: 'True cooperation requires information asymmetry: each player must know something the others don\'t. If one person could solve it alone, collaboration becomes optional — and optional collaboration doesn\'t happen.',
      examples: [
        { scenario: 'Biology / Body Systems', description: 'Each player controls one body system (circulatory, nervous, digestive). Diagnosing the "patient" requires combining all three players\' clues — no single player has enough information to win alone.' },
        { scenario: 'Geometry / Real-World Measurement', description: 'One player knows the couch dimensions, another knows the doorway width, a third knows the hallway turning radius. The team must share all three to figure out whether the couch fits — and which angle to tilt it.' },
        { scenario: 'History / WWI Causes', description: 'Each player holds cards representing one country\'s secret alliances and grievances. Only by carefully sharing (not all at once — that\'s too easy) can the group map the full chain of causes that started the war.' },
        { scenario: 'Science / Ecosystem Collapse', description: 'Each player secretly manages one trophic level (producers, herbivores, predators). Players can see their own species\' health but not others\'. Communication and coordination are the only way to prevent collapse.' }
      ]
    },
    roleplay: {
      question: 'What roles will players take on, and how does the subject knowledge specific to that role shape every decision they make in the game?',
      hint: 'The role must require genuine subject expertise to play well — not just a costume and a personality, but specific knowledge that drives better decisions.',
      examples: [
        { scenario: 'History / Constitutional Convention', description: 'Each player is a historical delegate arguing their state\'s actual position. Only players who know that delegate\'s real priorities, fears, and alliances can argue convincingly — bluffing gets called out.' },
        { scenario: 'English Literature / Novel Characters', description: 'Players roleplay as characters from a shared novel in a council scene. Decisions must match the character\'s established motivations — misplaying your character reveals you haven\'t read closely enough.' },
        { scenario: 'Science / Ecosystem Roles', description: 'Each player is assigned a species in an ecosystem. Decisions about where to move, what to eat, and who to avoid are governed by actual ecological relationships — knowing your predators and prey is survival.' }
      ]
    },
    build: {
      question: 'What will players build or create, and how does subject knowledge determine what makes a design succeed versus fail?',
      hint: 'The build constraints should come directly from the subject — the rules of science, math, grammar, or history are the design rules. Ignorance should produce a design that doesn\'t work.',
      examples: [
        { scenario: 'Physics / Simple Machines', description: 'Players design a Rube Goldberg machine from cards (lever, pulley, inclined plane). Each machine-to-machine transfer must be physically plausible — understanding mechanical advantage determines if your design actually runs.' },
        { scenario: 'Math / Area & Perimeter', description: 'Players design a floor plan for a house with a fixed construction budget. Rooms cost money per square foot. Maximizing livable space within budget requires calculating area efficiently — creative guessing just wastes money.' },
        { scenario: 'Urban Studies / City Planning', description: 'Players place buildings on a city grid. Infrastructure costs, zoning rules, and community impact scores are all determined by how well players understand how urban systems interact — a hospital next to a factory loses points.' }
      ]
    }
  };

  // ── Load Form Data ────────────────────────────────────────────
  function loadFormData() {
    const state = GameState.get();
    formData = { ...(state.design_form || {}) };

    FIELDS.forEach(field => {
      const el = document.getElementById(`field-${field}`);
      if (el) el.value = formData[field] || '';
    });
  }

  // Restore saved values into dynamically-rendered mq fields
  function restoreMechanicFields() {
    Object.keys(formData).forEach(key => {
      if (!key.startsWith('mq_')) return;
      const el = document.getElementById(`field-${key}`);
      if (el) el.value = formData[key] || '';
    });
  }

  // ── Save Form Data ────────────────────────────────────────────
  function saveFormData(silent = false) {
    FIELDS.forEach(field => {
      const el = document.getElementById(`field-${field}`);
      if (el) formData[field] = el.value;
    });

    // Also save any mechanic-specific fields that are currently in the DOM
    document.querySelectorAll('[id^="field-mq-"]').forEach(el => {
      const key = el.id.replace('field-', ''); // e.g. mq_cooperate
      formData[key] = el.value;
    });

    GameState.update(state => {
      state.design_form = { ...formData };
    });

    if (!silent) {
      showAutosave();
    }

    console.log('Saved to localStorage:', formData);
  }

  function showAutosave() {
    const ind = document.getElementById('autosave-indicator');
    if (!ind) return;
    ind.classList.add('visible');
    clearTimeout(ind._timeout);
    ind._timeout = setTimeout(() => ind.classList.remove('visible'), 2000);
  }

  // ── Render Mechanics Badges ───────────────────────────────────
  function renderMechanicBadges() {
    const container = document.getElementById('selected-mechanics-display');
    if (!container) return;

    const state = GameState.get();
    const mechanics = state.selected_mechanics || [];

    if (mechanics.length === 0) {
      container.innerHTML = '<span style="color:var(--muted);font-size:0.85rem;font-style:italic">No mechanics selected yet — go back to Level 1</span>';
      return;
    }

    container.innerHTML = mechanics.map(id => {
      const name = MECHANIC_NAMES[id] || id;
      return `<span class="mechanic-badge-chip">${name}</span>`;
    }).join('');
  }

  // ── Mechanic-Specific Questions ───────────────────────────────
  function renderMechanicSpecificQuestions() {
    const container = document.getElementById('mechanic-specific-questions');
    if (!container) return;

    const state = GameState.get();
    const selected = state.selected_mechanics || [];

    if (selected.length === 0) {
      container.innerHTML = '';
      return;
    }

    const nameList = selected.map(id => `<strong>${(MECHANIC_NAMES[id] || id).substring(2).trim()}</strong>`).join(' + ');

    container.innerHTML = `
      <hr class="mq-section-divider" />
      <div class="mq-section-intro">
        Since you chose ${nameList}, here are questions tailored to how those mechanics work in practice.
        Your answers will appear in the final blueprint.
      </div>
      ${selected.map(id => renderMechanicQuestion(id)).join('')}
    `;

    // Restore any saved answers, then bind listeners
    restoreMechanicFields();

    selected.forEach(id => {
      const field = document.getElementById(`field-mq-${id}`);
      if (field && !field._bound) {
        field.addEventListener('input', () => {
          clearTimeout(field._debounce);
          field._debounce = setTimeout(() => saveFormData(true), 1500);
        });
        field._bound = true;
      }

      const toggleBtn = document.getElementById(`mq-toggle-${id}`);
      const examplesList = document.getElementById(`mq-examples-${id}`);
      if (toggleBtn && examplesList && !toggleBtn._bound) {
        toggleBtn.addEventListener('click', () => {
          const isOpen = examplesList.classList.toggle('open');
          toggleBtn.textContent = isOpen ? '▲ Hide examples' : '▼ See real-world examples';
        });
        toggleBtn._bound = true;
      }
    });
  }

  function renderMechanicQuestion(id) {
    const mq = MECHANIC_QUESTIONS[id];
    if (!mq) return '';
    const fullName = MECHANIC_NAMES[id] || id;
    const emoji = fullName.split(' ')[0];
    const name = fullName.substring(2).trim();

    const examplesHtml = mq.examples.map(ex => `
      <div class="mq-example">
        <div class="mq-example-scenario">${ex.scenario}</div>
        <div>${ex.description}</div>
      </div>
    `).join('');

    return `
      <div class="mq-card" id="mq-card-${id}">
        <div class="mq-card-header">
          <span class="mq-card-emoji" aria-hidden="true">${emoji}</span>
          <span class="mq-card-name">${name}</span>
        </div>
        <div class="form-group" style="margin-bottom:0.4rem">
          <label class="form-label" for="field-mq-${id}">${mq.question}</label>
          <textarea
            id="field-mq-${id}"
            class="form-control"
            rows="3"
            placeholder="${mq.hint}"
          ></textarea>
        </div>
        <button class="mq-examples-toggle" id="mq-toggle-${id}" type="button">▼ See real-world examples</button>
        <div class="mq-examples-list" id="mq-examples-${id}">
          ${examplesHtml}
        </div>
      </div>
    `;
  }

  // ── Navigate Steps ────────────────────────────────────────────
  function goToStep(num) {
    // Save current data before moving
    saveFormData(true);

    currentStep = num;

    // Update tabs
    document.querySelectorAll('.wizard-tab').forEach((tab, i) => {
      tab.classList.remove('active', 'done');
      if (i + 1 === num) tab.classList.add('active');
      else if (i + 1 < num) tab.classList.add('done');
    });

    // Show/hide steps
    document.querySelectorAll('.wizard-step').forEach((step, i) => {
      step.classList.toggle('active', i + 1 === num);
    });

    // Scroll step into view smoothly
    const body = document.getElementById('level3-wizard-body');
    if (body) body.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Re-render mechanic badges and personalized questions on step 2
    if (num === 2) {
      renderMechanicBadges();
      renderMechanicSpecificQuestions();
    }

    console.log('Button clicked: wizard-step-' + num);
  }

  // ── Validate Step ─────────────────────────────────────────────
  function validateStep(stepNum) {
    const step = STEPS[stepNum - 1];
    let valid = true;

    step.fields.forEach(field => {
      const el = document.getElementById(`field-${field}`);
      const errEl = document.getElementById(`error-${field}`);
      if (!el) return;

      const val = el.value.trim();
      if (!val) {
        valid = false;
        el.classList.add('error');
        if (errEl) {
          errEl.textContent = 'This field is required.';
          errEl.classList.add('visible');
        }
      } else {
        el.classList.remove('error');
        if (errEl) errEl.classList.remove('visible');
      }
    });

    return valid;
  }

  // ── Clear Errors ──────────────────────────────────────────────
  function clearErrors(stepNum) {
    const step = STEPS[stepNum - 1];
    step.fields.forEach(field => {
      const el = document.getElementById(`field-${field}`);
      const errEl = document.getElementById(`error-${field}`);
      if (el) el.classList.remove('error');
      if (errEl) errEl.classList.remove('visible');
    });
  }

  // ── Build Blueprint ───────────────────────────────────────────
  function buildBlueprint() {
    saveFormData(true);
    const state = GameState.get();
    const f = state.design_form;
    const mechanics = (state.selected_mechanics || [])
      .map(id => MECHANIC_NAMES[id] || id).join(', ');
    const funScore = (state.fun_test_answers || []).filter(Boolean).length;

    return `# Game Design Blueprint
## Chocolate-Covered Broccoli Challenge

---

## Selected Mechanics
${mechanics || 'None selected'}

## Fun Guidelines Score
${funScore}/5

---

## Learning Goals

**Topic:** ${f.topic || '—'}

**Students will UNDERSTAND:**
${f.understanding || '—'}

**Students will be able to DO:**
${f.skills || '—'}

---

## Mechanic Connection

**How Learning Connects to Play:**
${f.mechanic_connection || '—'}

${(state.selected_mechanics || []).map(id => {
  const mq = MECHANIC_QUESTIONS[id];
  const name = (MECHANIC_NAMES[id] || id).substring(2).trim();
  const answer = f[`mq_${id}`];
  if (!mq || !answer) return '';
  return `**${name} — ${mq.question}**\n${answer}`;
}).filter(Boolean).join('\n\n')}

---

## Core Gameplay Loop (ODAR Framework)

**OBSERVE — What do players see?**
${f.observe || '—'}

**DECIDE — What choices do they make?**
${f.decide || '—'}

**ACT — What do they do?**
${f.act || '—'}

**RESULT — What happens?**
${f.result || '—'}

---

## Win/Lose Conditions

**Victory — How do players win?**
${f.victory || '—'}

**Failure — How do players lose?**
${f.failure || '—'}

---
*Generated by the Chocolate-Covered Broccoli Challenge*
*Date: ${new Date().toLocaleDateString()}*
`;
  }

  // ── Download Blueprint ────────────────────────────────────────
  function downloadBlueprint() {
    const md = buildBlueprint();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game-design-blueprint.md';
    a.click();
    URL.revokeObjectURL(url);
    console.log('Button clicked: download-blueprint');
  }

  // ── Auto-Fill Evaluator ───────────────────────────────────────
  function autoFillEvaluator() {
    saveFormData(true);
    const blueprint = buildBlueprint();

    // Store blueprint for Level 4
    GameState.update(state => {
      state.design_form_blueprint = blueprint;
    });

    // Complete level 3
    const state = GameState.completeLevel('level3');
    GameState.syncUI(state);

    // Show and scroll to Level 4
    const l4Card = document.getElementById('level-card-4');
    if (l4Card) {
      l4Card.classList.remove('locked');
      l4Card.classList.add('active');
      setTimeout(() => {
        l4Card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }

    if (window.Level4 && window.Level4.init) {
      window.Level4.init(blueprint);
    }

    console.log('Button clicked: autofill-evaluator');
    console.log('Progress updated: 60%');
  }

  // ── Setup Listeners ───────────────────────────────────────────
  function setupListeners() {
    // Tab buttons
    document.querySelectorAll('.wizard-tab').forEach((tab, i) => {
      if (!tab._bound) {
        tab.addEventListener('click', () => {
          // Allow going back freely, going forward requires validation
          const targetStep = i + 1;
          if (targetStep < currentStep) {
            clearErrors(currentStep);
            goToStep(targetStep);
          } else if (targetStep === currentStep + 1) {
            if (validateStep(currentStep)) goToStep(targetStep);
          } else if (targetStep <= currentStep) {
            goToStep(targetStep);
          }
        });
        tab._bound = true;
      }
    });

    // Next buttons
    document.querySelectorAll('[data-next-step]').forEach(btn => {
      if (!btn._bound) {
        btn.addEventListener('click', () => {
          const next = parseInt(btn.dataset.nextStep);
          console.log('Button clicked: next-step-' + next);
          if (validateStep(currentStep)) goToStep(next);
        });
        btn._bound = true;
      }
    });

    // Prev buttons
    document.querySelectorAll('[data-prev-step]').forEach(btn => {
      if (!btn._bound) {
        btn.addEventListener('click', () => {
          const prev = parseInt(btn.dataset.prevStep);
          console.log('Button clicked: prev-step-' + prev);
          clearErrors(currentStep);
          goToStep(prev);
        });
        btn._bound = true;
      }
    });

    // Auto-fill button
    const autoFillBtn = document.getElementById('autofill-evaluator-btn');
    if (autoFillBtn && !autoFillBtn._bound) {
      autoFillBtn.addEventListener('click', () => {
        if (validateStep(4)) autoFillEvaluator();
      });
      autoFillBtn._bound = true;
    }

    // Download blueprint button
    const downloadBtn = document.getElementById('download-blueprint-btn');
    if (downloadBtn && !downloadBtn._bound) {
      downloadBtn.addEventListener('click', () => downloadBlueprint());
      downloadBtn._bound = true;
    }

    // Auto-save every 5 seconds
    if (!autoSaveInterval) {
      autoSaveInterval = setInterval(() => saveFormData(false), 5000);
    }

    // Save on input change (debounced)
    FIELDS.forEach(field => {
      const el = document.getElementById(`field-${field}`);
      if (el && !el._bound) {
        el.addEventListener('input', () => {
          clearTimeout(el._debounce);
          el._debounce = setTimeout(() => saveFormData(true), 1500);
          // Clear error on typing
          el.classList.remove('error');
          const errEl = document.getElementById(`error-${field}`);
          if (errEl) errEl.classList.remove('visible');
        });
        el._bound = true;
      }
    });
  }

  // ── Init ──────────────────────────────────────────────────────
  function init() {
    loadFormData();
    renderMechanicBadges();
    setupListeners();
    goToStep(1);
    console.log('Level 3 initialized');
  }

  return { init, buildBlueprint, downloadBlueprint };
})();

window.Level3 = Level3;
