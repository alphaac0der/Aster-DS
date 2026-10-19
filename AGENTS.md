# Aster Design System — Agent Instructions

This document is the authoritative instruction set for AI coding assistants working in or consuming the **Aster Design System (Aster DS)** repository.

---

## 1. Purpose & Architecture

Aster DS is a token-first, zero-dependency design system designed to provide one authoritative source of truth with dual interfaces:
1. **Human-Facing Interface:** Documentation, interactive playground, and vanilla CSS/JS component modules for developers and designers (`docs/`, `components/`, `playground/`).
2. **Agent-Facing Interface:** Machine-readable design tokens, component contracts, and structured coding skills (`AGENTS.md`, `skills/`).

### Canonical Source of Truth
Aster enforces strict separation between source files and compiled distribution outputs:
- **Design Tokens Source:** `tokens/**/*.json` (W3C DTCG format).
- **Component Source:** `components/<component>/<component>.{js,css}` and `components/base/base.css`.
- **Distribution Outputs:** `dist/css/tokens.css`, `dist/css/components.css`, `dist/css/aster.css`, `dist/js/aster.js`, and `dist/figma/*.json`.

> [!IMPORTANT]
> **Never edit compiled files in `dist/` directly.** Always edit the canonical source files in `tokens/` or `components/`, then run the appropriate build compiler (`npm run build`).

---

## 2. Skill Activation

You MUST activate and reference the corresponding Aster skill when working on relevant tasks:
- **`skills/using-aster-tokens/SKILL.md`**: Activate when referencing, generating, or refactoring CSS variables, colors, typography, dimensions, density, or theme modes.
- **`skills/using-aster-components/SKILL.md`**: Activate when authoring, styling, reviewing, or testing Aster UI components and layouts.

---

## 3. Mandatory Token Precedence & Theming Rules

When authoring or modifying component styles or application UI, agents MUST strictly follow these token rules:

1. **Strict Semantic Token Precedence (Normative Requirement):**
   - Component styles and layouts MUST bind exclusively to semantic tokens (`--as-semantic-color-*`), density tokens (`--as-density-*`), and structural foundation tokens (`--as-space-*`, `--as-radius-*`, `--as-elevation-*`).
   - **NEVER use primitive color tokens (`--as-color-primitive-*`) in component styles.** Primitive tokens exist solely as internal values for semantic token definitions.
2. **Surface & Layer Roles:**
   - `--as-semantic-color-surface-canvas`: Base screen surface (`#FFFFFF` in light mode, `#121212` in dark mode).
   - `--as-semantic-color-surface-card`: Elevated container surface (`#F5F5F5` in light mode, `#1E1E1E` in dark mode).
   - Soft borders, dividers, and card borders bind to `--as-semantic-color-border-subtle` or `--as-semantic-color-border-strong`.
3. **Single Standard Density (Normative Requirement):**
   - Aster utilizes a single standard density scale (`--as-density-*`).
   - **Do NOT introduce or use compact mode or `[data-density="compact"]`** selectors. Standard control heights are 40px for buttons and 44px for inputs/selects to ensure consistent touch ergonomics.
4. **Corner Radius Policy:**
   - Minimum component corner radius is **4px** (`--as-radius-sm`).
   - Default card and dialog corner radius is **8px** (`--as-radius-md`) to **16px** (`--as-radius-xl`).
   - Full pill radius **9999px** (`--as-radius-full`) is reserved for buttons and badges.
   - **Never use 2px radii.**
5. **Four-Role Typography System:**
   - Display / Hero Headlines: `Bebas Neue` (`--as-typography-font-family-display`)
   - Body & Interface Text: `Manrope` (`--as-typography-font-family-sans`)
   - Code, Monospace & Data: `Space Mono` (`--as-typography-font-family-mono`)
   - Editorial & Quotes: `Merriweather` (`--as-typography-font-family-serif`)

---

## 4. Component Architecture & Contribution Conventions

When creating, updating, or using Aster components:

1. **Zero Runtime Framework Dependencies:**
   - Aster delivers native HTML5 elements, CSS Custom Properties, and browser ES modules.
   - Do not introduce proprietary React, Vue, or Svelte wrappers into the core repository. Framework consumers integrate Aster using native HTML classes (`.as-button`, `.as-input`, `.as-table`) and delegated module imports.
2. **Event Delegation & Idempotency:**
   - Component behaviors (pointer-origin tracking, modal opening/closing, accordion expansion, table sorting) are orchestrated via delegated event listeners initialized through `initAsterComponents(root, options)` in `components/index.js` (`dist/js/aster.js`).
   - Initializers MUST be idempotent and safe to invoke multiple times on dynamically loaded subtrees.
3. **Component Contracts:**
   - Every component has a canonical specification in `docs/components/<component>.md` detailing Anatomy, Props/Contract, Variants & States, Canonical Token Bindings, Keyboard/A11y, and Code Examples.
   - When modifying a component, ensure its specification in `docs/components/` and its checklist in `skills/using-aster-components/SKILL.md` are updated simultaneously.

---

## 5. Accessibility & Responsive Expectations

1. **Evidence-Based Compliance Verification:**
   - Automated token contrast tests (`npm run test:contrast`) verify mathematical sRGB ratios (4.5:1 for body text, 3:1 for graphical UI elements).
   - **Never claim blanket WCAG conformance without evidence.** Automated checks verify color math in isolation; holistic application accessibility (screen reader announcements, live regions, reflow) requires context-dependent evaluation.
2. **Touch Targets (WCAG SC 2.5.8):**
   - All interactive controls provide a minimum 40px or 44px bounding hit area, comfortably exceeding the 24×24px WCAG SC 2.5.8 minimum across both mobile and desktop form factors.
3. **Keyboard & Focus Management:**
   - Every interactive control must be reachable via `Tab` and activate via `Enter` or `Space`.
   - Modals, drawers, and popovers must trap focus while open, dismiss on `Escape`, and return focus to the trigger element upon closing.
   - Focus rings must use double 1px glass glow or 2px solid rings (`--as-semantic-color-border-focus`) and must never be suppressed with `outline: none` without providing an accessible `:focus-visible` alternative.
4. **Motion & Vestibular Safety:**
   - Smooth micro-interactions (pointer-origin radial hover spotlights, elastic spring switches, bouncy slider thumbs) must be defined with CSS variables.
   - All animations, transitions, and transforms MUST collapse or reduce under `@media (prefers-reduced-motion: reduce)`.

---

## 6. Verification & Test Commands

Before proposing or finalizing changes to tokens, components, or documentation, agents MUST run the relevant verification suites that exist in this repository:

| Command | Purpose |
|---|---|
| `npm run build` | Full pipeline build (`build:tokens`, `build:components`, `build:playground`). |
| `npm run build:tokens` | Compiles tokens from `tokens/**/*.json` into `dist/css/tokens.css`. |
| `npm run build:components` | Compiles component stylesheets into `dist/css/components.css`, `dist/css/aster.css`, and `dist/js/aster.js`. |
| `npm run build:playground` | Compiles documentation portal at `index.html` and `playground/index.html`. |
| `npm run test:figma` | Validates DTCG variable payloads in `dist/figma/` against official schema. |
| `npm run test:contrast` | Verifies mathematical WCAG 2.2 AA contrast ratios for semantic color pairings. |
| `npm run test:components` | Verifies concrete token bindings, section schemas, and single-density rules across all 21 components. |
| `npm run test:docs` | Verifies documentation references in `docs/` and `skills/` match production CSS variables. |
| `npm run test:exports` | Validates `package.json` entry points, export map targets, and ESM self-imports. |
| `npm run test:pack` | Executes dry-run package bundling check (`npm pack --dry-run`). |
| `npm test` | Runs the aggregate quality suite (`figma`, `contrast`, `components`, `docs`, `exports`, `pack`). |
| `npm run test:browser` | Runs the automated headless Chrome CDP behavioral audit (139 real DOM interaction tests; alias for `node build-tools/audit-browser.js`). |

> [!NOTE]
> Never claim a test passed unless the command was executed and the output was observed.

---

## 7. Attribution & Licensing Requirements

1. **Shade-DS Visual Foundation:**
   - Aster's visual foundation, kinetics, and core component architecture faithfully reproduce and extend **Shade-DS** by [Shifat Masud](https://github.com/shifatmasud/Shade-DS) with explicit permission. Maintain respectful attribution in documentation and release notes.
2. **Third-Party Assets:**
   - Icons: [Phosphor Icons](https://phosphoricons.com/) (SIL OFL 1.1 / MIT).
   - Typography: Google Fonts (Bebas Neue, Manrope, Space Mono, Merriweather under SIL OFL 1.1).
3. **Repository Licensing Gate:**
   - Aster DS is currently private (`"private": true` in `package.json`). Formal repository licensing terms (e.g. Apache-2.0) and third-party notices are managed through an explicit open gate prior to any public release. Do not publish to npm or remove `"private": true`.

---

## 8. Agent Safety & Working Boundaries

1. **Minimal Scoped Changes:**
   - Keep changes tightly scoped to the specific instruction. Do not perform broad unrequested refactorings or introduce unapproved dependencies.
2. **Inspect Before Modifying:**
   - Read and understand existing contracts, token names, and tests before editing files.
3. **Preserve Documentation Integrity:**
   - Update related documentation, contracts, and checklists whenever modifying tokens or component implementations.
4. **Security & Privacy:**
   - Never commit API keys, personal credentials, private working notes, or local absolute machine paths (`file:///`, `C:\`, `F:\`). Use relative paths and environment variable fallbacks.
5. **Truthful Reporting:**
   - Report exact files modified, commands executed, and verification outcomes. Communicate any uncertainties or blockers directly.
