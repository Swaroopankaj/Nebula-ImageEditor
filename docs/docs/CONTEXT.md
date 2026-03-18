# 🧠 Project Context - Nebula ✨

Nebula is a professional-grade, privacy-first web image editor that performs all processing 100% client-side using the Canvas API and MediaPipe AI.

## Architecture

- **Core**: Monolithic `index.html` (currently) containing UI, Styles, and Logic.
- **AI Engine**: MediaPipe Selfie Segmentation for subject isolation.
- **Graphics**: 2D Canvas API for image manipulations and filters.
- **PWA**: `sw.js` and `manifest.json` for offline capabilities.

## Cognitive Loop

```
Think → Act → Reflect → Evolve
 ↑                        |
 └────────────────────────┘
```

| Phase | Rule | Output |
|:------|:-----|:-------|
| **Think** | Plan before coding. Reason through tradeoffs. | `artifacts/plan_*.md` |
| **Act** | Clean, modular, documented code. | Source files |
| **Reflect** | Test. Verify. Save evidence. | `artifacts/logs/` |
| **Evolve** | Document mistakes in journal. | `artifacts/error_journal.md` |

## Project Structure

```
Nebula-ImageEditor/
├── index.html           # Main UI and Logic (to be modularized)
├── sw.js                # Service Worker
├── manifest.json        # PWA Manifest
├── .antigravity/rules.md # AI behavioral constraints
├── .cursorrules          # IDE cognitive bootstrap
├── CONTEXT.md            # This file
├── artifacts/            # All AI outputs (plans, logs, etc.)
└── docs/                 # Documentation
```

## Coding Standards

- **Privacy First**: Never add external network calls for user data.
- **Canvas Precision**: Ensure all transformations maintain image quality (use high-quality scaling).
- **Responsive Design**: Maintain the glassmorphism aesthetic across all viewports.
- **Vanilla JS**: Minimize external dependencies; stick to native APIs where possible.

## Self-Evolution

1. Bug found → document in `artifacts/error_journal.md`
2. Lesson generalizable → extract into `.antigravity/rules.md`
3. Before acting → scan error journal for relevant past failures.
