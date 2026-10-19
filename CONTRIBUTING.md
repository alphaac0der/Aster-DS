# Contributing to Aster Design System

Thank you for your interest in contributing to **Aster Design System (Aster DS)**. Aster is an open, token-first, zero-dependency design system providing a unified source of truth for human developers, designers, and AI coding assistants.

To maintain architectural integrity, accessibility standards, and deterministic predictability, all contributors (human and agent) must adhere to these guidelines.

---

## 1. Canonical Source of Truth

Aster enforces a strict separation between canonical source files and compiled distribution outputs:

- **Design Tokens Source:** `tokens/**/*.json` (W3C Design Tokens Community Group format).
- **Component Source:** `components/<component>/<component>.{js,css}` and `components/base/base.css`.
- **Documentation & Contracts:** `docs/components/<component>.md`, `docs/*.md`, and `skills/`.
- **Distribution Outputs (`dist/`):** `dist/css/tokens.css`, `dist/css/components.css`, `dist/css/aster.css`, `dist/js/aster.js`, and `dist/figma/*.json`.

> [!IMPORTANT]
> **Never edit compiled files in `dist/` directly.** Always edit the canonical source files in `tokens/` or `components/`, then recompile using `npm run build`.

---

## 2. Core Architectural Conventions

### 2.1 Single Standard Density (Normative Requirement)
- Aster operates with a single unified **Standard** density scale (`--as-density-*`).
- **Do NOT introduce or use compact mode or `[data-density="compact"]` selectors.**
- Standard interactive control heights are **40px** for buttons and **44px** for form inputs and selects, ensuring consistent touch ergonomics across devices (exceeding WCAG SC 2.5.8 24×24px minimum).

### 2.2 Strict Semantic Token Precedence
- Component styles and layouts MUST bind exclusively to semantic tokens (`--as-semantic-color-*`), density tokens (`--as-density-*`), and structural foundation tokens (`--as-space-*`, `--as-radius-*`, `--as-elevation-*`).
- **NEVER use primitive color tokens (`--as-color-primitive-*`) in component styles.** Primitive tokens exist solely as internal definitions for semantic roles.
- Surface roles:
  - `--as-semantic-color-surface-canvas`: `#ffffff` (light), `#121212` (dark).
  - `--as-semantic-color-surface-card`: `#f5f5f5` (light), `#1e1e1e` (dark).

### 2.3 Zero Runtime Framework Dependencies
- Aster components are authored with pure semantic HTML5 elements, CSS Custom Properties, and vanilla browser ES modules.
- Do not introduce proprietary React, Vue, or Svelte wrappers into the core repository. Consumers integrate Aster using native HTML classes (`.as-button`, `.as-input`, `.as-table`) and delegated module imports.

### 2.4 Event Delegation & Idempotency
- Component behaviors are orchestrated via delegated event listeners initialized via `initAsterComponents(root, options)` in `components/index.js` (`dist/js/aster.js`).
- Initializers must be idempotent and safe to invoke multiple times on dynamic subtrees.

### 2.5 Accessibility & Motion
- All interactive controls must be keyboard-accessible (`Tab`, `Enter`, `Space`) with visible focus rings (`--as-semantic-color-border-focus`).
- Modal surfaces (Dialog, Drawer) must trap focus, dismiss on `Escape`, and restore focus to the trigger element on close.
- All animations, transitions, and hover kinetics MUST collapse or reduce under `@media (prefers-reduced-motion: reduce)`.

---

## 3. Development Workflow

### Prerequisites
- Node.js `v20+` or `v22+`
- npm `v10+` or `v11+`
- Google Chrome (for automated headless CDP browser tests)

### Setup
```bash
# Clone the repository
git clone https://github.com/alphaac0der/Aster-DS.git
cd Aster-DS

# Install devDependencies (Style Dictionary)
npm install
```

### Available Build Commands
```bash
# Full compilation pipeline (tokens, components, playground, figma)
npm run build

# Individual build steps
npm run build:tokens       # Compiles tokens/ to dist/css/tokens.css
npm run build:components   # Compiles components/ to dist/css/ and dist/js/
npm run build:playground   # Compiles index.html and playground/index.html
npm run export:figma       # Compiles dist/figma/*.json variable payloads
npm run playground         # Starts local documentation portal on http://127.0.0.1:3000/
```

---

## 4. Verification & Testing

Before submitting a pull request or proposing changes, all quality verification suites must pass:

| Command | Verification Scope |
|---|---|
| `npm test` | Runs aggregate quality suite: Figma schemas, WCAG contrast, component contracts, docs consistency, package exports, packaging whitelist, and isolated build reproducibility. |
| `npm run test:contrast` | Mathematically verifies 26/26 light & dark semantic color contrast pairings against WCAG 2.2 AA. |
| `npm run test:components` | Verifies concrete token bindings, section schemas, and single-density rules across all 21 components (646 assertions). |
| `npm run test:docs` | Verifies all 196 documented CSS variable references match production CSS variables. |
| `npm run test:figma` | Validates DTCG variable payloads across all 3 collections (82 variables). |
| `npm run test:exports` | Validates `package.json` entry points, export map targets, and live consumer imports. |
| `npm run test:pack` | Validates package whitelist via `npm pack --dry-run` (43 files). |
| `npm run test:isolated-build` | Verifies full build pipeline reproducibility in an isolated sandbox strictly without `scratch/`. |
| `npm run test:browser` | Headless Chrome CDP behavioral audit executing 139 real DOM interaction assertions. |

---

## 5. Third-Party Assets & Attribution

Aster DS incorporates and builds upon high-quality open-source and community foundations:
- **Shade-DS:** Aster's visual foundation and core component kinetics faithfully reproduce and extend Shade-DS with explicit author permission (Shifat Masud). Maintain prominent attribution in documentation and release notes.
- **Phosphor Icons:** 23 curated icons licensed under the MIT License.
- **Google Fonts:** Bebas Neue, Manrope, Space Mono, and Merriweather licensed under the SIL Open Font License 1.1.

Original contributions to Aster DS are licensed under the [MIT License](LICENSE). Contributions must not incorporate proprietary or uncredited code without proper attribution in [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md).
