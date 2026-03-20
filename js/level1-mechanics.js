/* ============================================================
   LEVEL 1 — Mechanic Selection
   - 8 mechanic cards in responsive grid
   - Modal with detailed info per mechanic
   - Select up to 2 mechanics
   - Continue button → Level 2 unlock
   ============================================================ */

const Level1 = (() => {

  // ── Mechanic Order ────────────────────────────────────────────
  const MECHANIC_ORDER = [
    'resources', 'risk', 'puzzles', 'timer',
    'compete', 'cooperate', 'roleplay', 'build'
  ];

  let selectedMechanics = [];
  let currentModal = null;

  // ── Mechanic Data (inlined to support file:// protocol) ───────
  const mechanicData = {
    resources: {
      id: 'resources', emoji: '💰', title: 'Manage Resources', tagline: 'Limited stuff = hard choices',
      description: 'Players have limited resources — time, money, materials, energy — and must make strategic choices about how to allocate them. Every decision has a cost, and running out means failure.',
      why_it_works: [
        'Forces prioritization and strategic thinking naturally embedded in the subject matter',
        'Understanding the subject helps players optimize resource use — knowledge is the winning edge',
        'Natural, immediate feedback: poor choices deplete resources and telegraph failure before it happens',
        'Creates genuine tension and investment without a single quiz question'
      ],
      examples: [
        { title: 'Cell Survival', subject: 'Biology (cellular respiration)', description: 'Students manage limited oxygen and glucose tokens to keep a cell alive through multiple rounds. Understanding how cellular respiration converts glucose into ATP helps them spend resources efficiently.' },
        { title: 'Sentence Architect', subject: 'English (grammar)', description: 'Build the strongest sentence possible using a hand of limited word cards (nouns, verbs, adjectives, conjunctions). Grammar knowledge is the key advantage: knowing which parts of speech are essential vs. decorative makes every card count.' }
      ]
    },
    risk: {
      id: 'risk', emoji: '⚖️', title: 'Make Risky Bets', tagline: 'Gamble for bigger rewards',
      description: 'Players choose between safe, guaranteed outcomes and riskier actions that could yield big rewards or costly setbacks. Subject knowledge informs which bets are worth taking.',
      why_it_works: [
        'Creates emotional investment — players feel the stakes of every decision',
        'Subject mastery reduces perceived risk, rewarding knowledge with confidence',
        'Models real-world decision-making under uncertainty (science, economics, history)',
        'Risk-and-reward loops generate the "one more try" drive naturally'
      ],
      examples: [
        { title: 'Market Gamble', subject: 'Economics (supply and demand)', description: 'Players bet tokens on which fictional product will sell more given a set of market conditions. Students who understand supply and demand curves identify the safer bets, gaining an edge without memorizing definitions.' },
        { title: 'Chemical Reaction Roulette', subject: 'Chemistry (reaction types)', description: 'Players choose between low-yield safe reactions and high-yield risky ones. Knowing whether a reaction is exothermic or endothermic lets students predict outcomes and bet confidently.' }
      ]
    },
    puzzles: {
      id: 'puzzles', emoji: '🧩', title: 'Solve Puzzles', tagline: 'Figure out how pieces fit',
      description: 'Players are presented with a challenge that has a satisfying solution. Finding it requires applying conceptual knowledge — the puzzle IS the learning, not a wrapper around it.',
      why_it_works: [
        'The "aha!" moment of solving creates a strong memory anchor for the concept',
        'Puzzle-solving intrinsically motivates persistence — players don\'t give up because it\'s fun',
        'Multiple solution paths allow for creative application of knowledge',
        'Scales beautifully: easier puzzles build foundations, harder ones challenge mastery'
      ],
      examples: [
        { title: 'Ecosystem Jigsaw', subject: 'Environmental Science (food webs)', description: 'Players receive organism cards and must arrange them into a stable food web. Remove the wrong species and the whole chain collapses. Understanding producer-consumer-decomposer relationships is the only way to solve it.' },
        { title: 'Equation Cipher', subject: 'Algebra (solving equations)', description: 'A secret message is encoded in a system of equations. Each solved variable reveals a letter. Students must isolate variables and substitute values to decode the full message — the math IS the puzzle.' }
      ]
    },
    timer: {
      id: 'timer', emoji: '⏱️', title: 'Beat the Clock', tagline: 'Quick decisions under pressure',
      description: 'A time limit forces players to make rapid decisions, building fluency with material rather than slow recall. The pressure creates excitement and mimics real-world application of knowledge.',
      why_it_works: [
        'Builds automaticity — knowledge must be fast and confident, not just present',
        'Creates shared excitement and energy in classroom settings',
        'Time pressure reveals what students truly understand vs. what they can look up',
        'Short rounds mean fast feedback loops: lose fast, learn fast, try again'
      ],
      examples: [
        { title: 'Vocabulary Sprint', subject: 'World Languages (vocabulary)', description: 'Players have 30 seconds to match as many foreign words to images as possible. No time to guess — fluency wins. The clock creates urgency that makes even practice feel like a real challenge.' },
        { title: 'Historical Timeline Dash', subject: 'History (chronology)', description: 'A stack of event cards must be arranged in chronological order before the timer runs out. Students who know their history place cards instantly; students who don\'t feel the gap — and want to fix it.' }
      ]
    },
    compete: {
      id: 'compete', emoji: '🏆', title: 'Compete to Win', tagline: 'Race against others',
      description: 'Players go head-to-head against each other, with subject knowledge as the primary competitive advantage. The desire to win drives deeper engagement with the material.',
      why_it_works: [
        'Competition is a universal motivator — nobody wants to lose because they didn\'t study',
        'Social stakes elevate engagement far beyond solo practice',
        'Watching peers succeed with their knowledge makes the value of learning visible',
        'Can be structured as team competition to include collaboration benefits too'
      ],
      examples: [
        { title: 'Debate Duel', subject: 'Social Studies (government/civics)', description: 'Two players argue opposite sides of a policy issue using evidence cards. The audience votes on the most convincing argument. Students must actually understand the evidence to deploy it effectively.' },
        { title: 'Physics Race', subject: 'Physics (motion and forces)', description: 'Players design a paper roller coaster and compete for whose marble travels furthest. Understanding energy transfer, friction, and momentum gives designers an edge that textbooks alone can\'t provide.' }
      ]
    },
    cooperate: {
      id: 'cooperate', emoji: '🤝', title: 'Work Together', tagline: 'Team up to succeed',
      description: 'Players must collaborate, share information, and combine their knowledge to overcome challenges no single player could beat alone. Different pieces of knowledge are distributed across the team.',
      why_it_works: [
        'Distributes knowledge roles: each student becomes an expert in one area',
        'Teaching teammates reinforces learning more powerfully than re-reading notes',
        'Creates positive interdependence — everyone\'s contribution genuinely matters',
        'Models real-world collaborative problem-solving in science, business, and more'
      ],
      examples: [
        { title: 'Body Systems Rescue', subject: 'Biology (human body systems)', description: 'Each player controls one body system (circulatory, nervous, digestive) and must share information with teammates to diagnose and treat a "patient." No one player has enough info to win alone.' },
        { title: 'Expedition Map', subject: 'Geography (world regions)', description: 'Teams plan a global expedition where each member is an expert on different regions. Choosing the right routes, supplies, and timing requires combining everyone\'s regional knowledge into a cohesive plan.' }
      ]
    },
    roleplay: {
      id: 'roleplay', emoji: '🎭', title: 'Play a Role', tagline: 'Become someone else',
      description: 'Players take on a specific character, persona, or perspective and must make decisions that character would make given the subject context. Empathy and knowledge combine to drive play.',
      why_it_works: [
        'Perspective-taking deepens understanding far beyond surface-level recall',
        'Emotional connection to a character creates memorable, personal learning moments',
        'Historical, scientific, and literary figures come to life through player decisions',
        'Expressive freedom attracts students who disengage from traditional formats'
      ],
      examples: [
        { title: 'Founding Fathers Forum', subject: 'History (U.S. Constitutional Convention)', description: 'Each player takes a historical delegate\'s role and must argue their state\'s position on key issues using actual historical arguments. Understanding each delegate\'s context is essential to playing the role convincingly.' },
        { title: 'Literary Character Council', subject: 'English Literature', description: 'Students roleplay as characters from a shared novel, convening to debate how a plot decision should unfold. Knowing the character\'s motivations, fears, and relationships is the entire advantage.' }
      ]
    },
    build: {
      id: 'build', emoji: '🎨', title: 'Build Something', tagline: 'Create and design freely',
      description: 'Players construct, design, or create something — a structure, a system, a product — using subject knowledge as their blueprint. The freedom to create drives ownership and pride in learning.',
      why_it_works: [
        'Creative ownership creates the deepest form of engagement and retention',
        'Building exposes misconceptions that multiple-choice answers never would',
        'Tangible outputs let students see and share what they\'ve learned',
        'Open-ended design allows for differentiation — every student can succeed at their level'
      ],
      examples: [
        { title: 'City Planner', subject: 'Social Studies (urban systems / civics)', description: 'Students design a functional city on a grid, choosing locations for schools, hospitals, power plants, and parks. Understanding how city systems interact determines whether the city passes its livability score.' },
        { title: 'Invention Lab', subject: 'Physics / Engineering (simple machines)', description: 'Players design a Rube Goldberg machine using simple machine cards (lever, pulley, inclined plane). Each machine in the chain must physically make sense — understanding mechanical advantage is the design constraint.' }
      ]
    }
  };

  // ── Load Mechanic Data (no-op — data is now inlined above) ────
  async function loadMechanicData() {
    console.log('Mechanic data loaded:', Object.keys(mechanicData));
  }

  // ── Render Cards ──────────────────────────────────────────────
  function renderCards() {
    const grid = document.getElementById('mechanic-grid');
    if (!grid) return;

    grid.innerHTML = '';

    MECHANIC_ORDER.forEach(id => {
      const m = mechanicData[id];
      if (!m) return;

      const isSelected = selectedMechanics.includes(id);

      const card = document.createElement('div');
      card.className = 'mechanic-card' + (isSelected ? ' selected' : '');
      card.id = `mechanic-card-${id}`;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${m.title}: ${m.tagline}`);
      card.setAttribute('aria-pressed', String(isSelected));

      card.innerHTML = `
        <div class="mechanic-check" aria-hidden="true">✓</div>
        <span class="mechanic-emoji" aria-hidden="true">${m.emoji}</span>
        <span class="mechanic-title">${m.title}</span>
        <span class="mechanic-tagline">${m.tagline}</span>
      `;

      // Click to open modal
      card.addEventListener('click', () => {
        console.log('Button clicked: mechanic-card-' + id);
        openModal(id);
      });

      // Keyboard support
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(id);
        }
      });

      grid.appendChild(card);
    });
  }

  // ── Modal ─────────────────────────────────────────────────────
  function openModal(mechanicId) {
    const m = mechanicData[mechanicId];
    if (!m) return;
    currentModal = mechanicId;

    const backdrop = document.getElementById('mechanic-modal-backdrop');
    const emojiEl = document.getElementById('modal-mechanic-emoji');
    const titleEl = document.getElementById('modal-mechanic-title');
    const descEl  = document.getElementById('modal-mechanic-desc');
    const whyList = document.getElementById('modal-mechanic-why');
    const examplesEl = document.getElementById('modal-mechanic-examples');
    const chooseBtn = document.getElementById('modal-choose-btn');

    if (emojiEl) emojiEl.textContent = m.emoji;
    if (titleEl) titleEl.textContent = m.title;
    if (descEl)  descEl.textContent = m.description;

    // Why it works
    if (whyList) {
      whyList.innerHTML = m.why_it_works
        .map(w => `<li>${w}</li>`)
        .join('');
    }

    // Examples
    if (examplesEl) {
      examplesEl.innerHTML = m.examples.map(ex => `
        <div class="modal-example">
          <div class="modal-example-title">${ex.title}</div>
          <div class="modal-example-subject">Subject: ${ex.subject}</div>
          <p>${ex.description}</p>
        </div>
      `).join('');
    }

    // Update choose button state
    if (chooseBtn) {
      const isSelected = selectedMechanics.includes(mechanicId);
      if (isSelected) {
        chooseBtn.textContent = '✓ Deselect This Mechanic';
        chooseBtn.classList.remove('btn-golden');
        chooseBtn.classList.add('btn-outline');
      } else if (selectedMechanics.length >= 2) {
        chooseBtn.textContent = 'Max 2 Mechanics Selected';
        chooseBtn.disabled = true;
        chooseBtn.classList.add('btn-golden');
        chooseBtn.classList.remove('btn-outline');
      } else {
        chooseBtn.textContent = 'Choose This Mechanic';
        chooseBtn.disabled = false;
        chooseBtn.classList.add('btn-golden');
        chooseBtn.classList.remove('btn-outline');
      }
    }

    if (backdrop) {
      backdrop.classList.add('open');
      backdrop.setAttribute('aria-hidden', 'false');
      // Focus the close button for accessibility
      setTimeout(() => {
        const closeBtn = document.getElementById('modal-close-btn');
        if (closeBtn) closeBtn.focus();
      }, 100);
    }
  }

  function closeModal() {
    const backdrop = document.getElementById('mechanic-modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('open');
      backdrop.setAttribute('aria-hidden', 'true');
    }
    currentModal = null;
    console.log('Button clicked: modal-close');
  }

  // ── Select / Deselect ─────────────────────────────────────────
  function toggleMechanic(mechanicId) {
    const idx = selectedMechanics.indexOf(mechanicId);

    if (idx > -1) {
      // Deselect
      selectedMechanics.splice(idx, 1);
      console.log('Button clicked: deselect-mechanic-' + mechanicId);
    } else {
      // Select
      if (selectedMechanics.length >= 2) {
        showWarning('You can only select up to 2 mechanics. Deselect one first!');
        return;
      }
      selectedMechanics.push(mechanicId);
      console.log('Button clicked: select-mechanic-' + mechanicId);
    }

    // Persist to state
    GameState.update(state => {
      state.selected_mechanics = [...selectedMechanics];
    });

    renderCards();
    updateContinueBtn();
    closeModal();
  }

  // ── Warning Toast ──────────────────────────────────────────────
  function showWarning(msg) {
    const existing = document.getElementById('level1-warning');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'level1-warning';
    toast.style.cssText = `
      position:fixed; bottom:2rem; left:50%; transform:translateX(-50%);
      background:#e53e3e; color:white; padding:0.75rem 1.25rem;
      border-radius:8px; font-size:0.9rem; font-weight:600; z-index:9999;
      box-shadow:0 4px 20px rgba(0,0,0,0.3); max-width:90vw; text-align:center;
      animation: fadeInUp 0.3s ease;
    `;
    toast.textContent = '⚠️ ' + msg;
    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 3000);
  }

  // ── Continue Button ───────────────────────────────────────────
  function updateContinueBtn() {
    const btn = document.getElementById('level1-continue-btn');
    if (!btn) return;
    btn.disabled = selectedMechanics.length === 0;
  }

  // ── Complete Level 1 ──────────────────────────────────────────
  function completeLevel1() {
    console.log('Button clicked: level1-continue');

    if (selectedMechanics.length === 0) return;

    const state = GameState.completeLevel('level1');
    GameState.syncUI(state);

    // Show Level 2
    const l2Card = document.getElementById('level-card-2');
    if (l2Card) {
      l2Card.classList.remove('locked');
      l2Card.classList.add('active');
      setTimeout(() => {
        l2Card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }

    // Trigger Level 2 initialization
    if (window.Level2 && window.Level2.init) {
      window.Level2.init();
    }

    console.log('Progress updated: 20%');
  }

  // ── Restore State ─────────────────────────────────────────────
  function restoreState() {
    const state = GameState.get();
    selectedMechanics = [...(state.selected_mechanics || [])];
    updateContinueBtn();
  }

  // ── Init ──────────────────────────────────────────────────────
  async function init() {
    await loadMechanicData();
    restoreState();
    renderCards();
    setupListeners();
    console.log('Level 1 initialized');
  }

  function setupListeners() {
    // Modal close button
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        console.log('Button clicked: modal-close-btn');
        closeModal();
      });
    }

    // Click backdrop to close
    const backdrop = document.getElementById('mechanic-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', e => {
        if (e.target === backdrop) closeModal();
      });
    }

    // ESC to close
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && currentModal) closeModal();
    });

    // Choose button
    const chooseBtn = document.getElementById('modal-choose-btn');
    if (chooseBtn) {
      chooseBtn.addEventListener('click', () => {
        console.log('Button clicked: modal-choose-btn');
        if (currentModal) toggleMechanic(currentModal);
      });
    }

    // Continue button
    const continueBtn = document.getElementById('level1-continue-btn');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => completeLevel1());
    }
  }

  return { init, renderCards, selectedMechanics: () => selectedMechanics };
})();

window.Level1 = Level1;
