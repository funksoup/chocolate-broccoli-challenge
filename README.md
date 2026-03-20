# 🍫🥦 Chocolate-Covered Broccoli Challenge

> *"Chocolate-covered broccoli" = educational content disguised as a game, but not actually fun.*
> *This tool helps you avoid that trap.*

A free, browser-based tool that walks educators and learning designers through a structured 5-level process for creating **genuinely fun** educational games — not just quizzes wearing a game costume.

**[▶ Try the live demo →](https://funksoup.github.io/chocolate-broccoli-challenge/)**

---

## What Is Chocolate-Covered Broccoli?

It's what happens when someone takes a learning objective, wraps a thin "game" shell around it (answer this question → earn a point), and calls it educational game design. The broccoli is still there. Kids can taste it immediately.

This tool guides you through the real questions: Is the mechanic actually fun on its own? Does knowing the subject *genuinely* make you better at the game? Would players want to replay it after losing?

---

## The 5 Levels

| Level | Name | What You Do |
|---|---|---|
| 1 | **Choose Your Mechanic** | Pick 1–2 core game mechanics from 8 options, each with real educational examples |
| 2 | **Fun Guidelines** | Answer 5 diagnostic questions. Live score meter tells you if it's a game or broccoli |
| 3 | **Design Your Game** | 4-step guided wizard: Learning Goals → Mechanic Connection → ODAR Loop → Win/Lose |
| 4 | **Evaluate Your Design** | Automated 5-point analysis flags quiz patterns and weak design choices |
| 5 | **Completion** | Confetti 🎉, all 5 badges, session summary, and downloads of your full blueprint |

The 8 mechanics covered: **Resource Management · Risk/Reward · Puzzles · Time Pressure · Competition · Cooperation · Roleplay · Building**

---

## Features

- ✅ **Zero dependencies** — no frameworks, no build step, no server required
- 💾 **Auto-saves** every 5 seconds via localStorage — refresh and pick up where you left off
- 🔄 **Start Over** button resets everything from any level
- 📋 **Personalized questions** — Level 3 adapts to the specific mechanics you chose
- 📄 **Blueprint export** — download your game design as Markdown
- 📊 **Design evaluation** — keyword analysis catches red flags before you build
- 📱 **Responsive** — works on desktop and tablet

---

## Running Locally

No installation needed.

```bash
git clone https://github.com/funksoup/chocolate-broccoli-challenge.git
cd chocolate-broccoli-challenge
open index.html        # macOS
# or: start index.html  (Windows)
# or: xdg-open index.html  (Linux)
```

That's it. No `npm install`, no build step, no server.

---

## Deploying to GitHub Pages (free hosting)

1. Push the repo to GitHub (see instructions below)
2. Go to your repo → **Settings** → **Pages**
3. Under *Source*, select **Deploy from a branch**
4. Choose branch: **`main`**, folder: **`/ (root)`**
5. Click **Save**
6. Your live URL will be: `https://funksoup.github.io/chocolate-broccoli-challenge/`

It takes about 60 seconds to go live after the first push.

---

## Publishing to GitHub (step by step)

If you're new to GitHub, here's the full process:

### 1. Create a GitHub account
Go to [github.com](https://github.com) and sign up (free).

### 2. Create a new repository
- Click the **+** icon → **New repository**
- Name it: `chocolate-broccoli-challenge`
- Set it to **Public** (required for free GitHub Pages)
- **Do not** initialize with a README (you already have one)
- Click **Create repository**

### 3. Push the files from your computer

Open Terminal (Mac) or Command Prompt (Windows) and run:

```bash
cd path/to/chocolate-broccoli-challenge

git init
git add .
git commit -m "Initial commit: Chocolate-Covered Broccoli Challenge"
git branch -M main
git remote add origin https://github.com/funksoup/chocolate-broccoli-challenge.git
git push -u origin main
```

Replace `funksoup` with your actual GitHub username.

### 4. Enable GitHub Pages
Follow the steps in the *Deploying to GitHub Pages* section above.

### 5. Update the demo link in this README
Replace `funksoup` in the live demo link at the top with your actual username, then commit:

```bash
git add README.md
git commit -m "Add live demo link"
git push
```

---

## File Structure

```
chocolate-broccoli-challenge/
├── index.html               — App shell + all HTML for all 5 levels
├── css/
│   └── styles.css           — Design system, layout, animations
├── js/
│   ├── game-state.js        — localStorage management, progress tracking, badges
│   ├── level1-mechanics.js  — Mechanic cards, modal, selection (data inlined)
│   ├── level2-fun-test.js   — Guideline cards, live score meter
│   ├── level3-designer.js   — 4-step wizard, autosave, dynamic questions, blueprint
│   ├── level4-evaluator.js  — Keyword analysis, red flag detection, results
│   └── level5-completion.js — Confetti, summary, downloads, reset
└── data/
    └── mechanic-content.json — Source data for all 8 mechanics (reference only)
```

**Note:** `mechanic-content.json` is kept as a readable reference, but the app reads mechanic data from inline JS in `level1-mechanics.js` so it works when opened directly as a file (no server needed).

---

## Design System

| Token | Value |
|---|---|
| Primary font | Noto Serif (Google Fonts) |
| `--cyan` | `#1D8A99` |
| `--purple` | `#5F506B` |
| `--olive` | `#849324` |
| `--mint` | `#A1CCA5` |
| `--golden` | `#F7B05B` |
| Background | `linear-gradient(135deg, #1D8A99, #5F506B)` |

---

## The Concept

The "chocolate-covered broccoli" problem in educational game design was popularized by researchers studying intrinsic vs. extrinsic motivation in learning. A well-designed educational game creates a situation where **the learning IS the strategy** — players who know the subject play better, not because they're rewarded for correct answers, but because that knowledge improves their in-game decisions.

The ODAR framework used in Level 3 (Observe → Decide → Act → Result) comes from game design practice and maps cleanly to the feedback loops that make games compelling.

---

## License

MIT — free to use, modify, and share.

---

*Built with vanilla HTML, CSS, and JavaScript. No frameworks were harmed.*
