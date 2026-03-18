# 🛸 Antigravity Cognitive Architecture - Nebula ✨

> An AI Agent's capability ceiling = the quality of context it can read.
> These rules ARE the architecture. No plugins, no lock-in.

---

## 1. Think Before You Act

- **NEVER** start coding without a plan.
- Create `artifacts/plan_[task].md` FIRST.
- Use `<thought>...</thought>` blocks for non-trivial reasoning.
- Consider: Canvas memory usage, segmentation model load times, and PWA offline state.

## 2. Verify Everything

- Run the web app locally to verify UI/UX changes.
- Save validation results to `artifacts/logs/`.
- If modifying UI, capture screenshots in `artifacts/screenshots/`.
- **Test with multiple image sizes** to ensure Canvas scaling remains performant.

## 3. Learn From Mistakes (Self-Evolution) 🧬

When a bug is found or a wrong approach is taken:

1. **Document** in `artifacts/error_journal.md`:
2. **Extract** generalizable lessons into this file or `.context/`.
3. **Never repeat** a documented mistake.

## 4. Nebula-Specific Constraints

| Constraint | Applies To |
|:-----------|:-----------|
| **100% Client-Side** | No server-side processing for user images. Privacy is priority #1. |
| **Modular Logic** | Refactor `index.html` logic into focused JS modules (e.g., `filters.js`, `segmentation.js`). |
| **Glassmorphism** | Maintain the semi-transparent, blur-heavy "Nebula" aesthetic. |
| **Atomic Canvas** | Every filter application should be an atomic state change (for Undo/Redo). |
| **No Silent MediaPipe Failures** | Always provide user feedback if the segmentation model fails to load. |

## 5. Artifact Protocol

| Type | Path | When |
|:-----|:-----|:-----|
| Plans | `artifacts/plan_[task].md` | Before any implementation |
| Error journal | `artifacts/error_journal.md` | After every bug or mistake |
| Screenshots | `artifacts/screenshots/` | After any UI change |

## 6. Permissions

- ✅ Read any project file
- ✅ Write to `src/`, `artifacts/`, `docs/`
- ✅ Run `git` commands
- ❌ Never `rm -rf` or destructive system commands
- ❌ No form submissions or logins without explicit approval
