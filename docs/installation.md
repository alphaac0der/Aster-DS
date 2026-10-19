# Aster Design System — Installation & Integration Guide

Aster is a zero-dependency, token-first design system with dual interfaces derived from an authoritative source of truth:
1. **Human-facing documentation and components** for developers and designers.
2. **Agent-facing specifications** for AI coding assistants (`AGENTS.md` and `skills/`).

Aster delivers vanilla CSS custom properties and browser-native ES modules. It introduces zero runtime framework dependencies.

---

## 1. Prerequisites

- **Node.js:** v18.0.0 or later (Node 20+ recommended).
- **Package Manager:** npm v9+ (bundled with Node).
- **Target Environments:** Modern evergreen web browsers supporting CSS Custom Properties, CSS `:focus-visible`, CSS `:has()`, HTML5 `<dialog>`, and JavaScript ES Modules (Chromium 105+, Firefox 110+, Safari 16.4+, Edge 105+).

---

## 2. Building from Source

Aster's canonical sources live under `tokens/` (design tokens in DTCG format) and `components/` (modular CSS and ES module behaviors). All files under `dist/` and `playground/index.html` are generated build outputs.

To build the entire system from scratch:

```bash
# 1. Install development dependencies (style-dictionary for token compilation)
npm install

# 2. Compile design tokens, component bundles, and documentation portal
npm run build
```

The composite `npm run build` script executes three sub-compilers in sequence:
1. `npm run build:tokens`: Compiles `tokens/**/*.json` into `dist/css/tokens.css` (and split light/dark/compact variants) using Style Dictionary.
2. `npm run build:components`: Concatenates modular `components/**/*.css` into `dist/css/components.css`, creates the all-in-one `dist/css/aster.css`, and compiles modular behavior scripts into `dist/js/aster.js`.
3. `npm run build:playground`: Compiles the self-contained documentation portal at `playground/index.html` across all 29 routes and 21 component showcases.

---

## 3. Distribution Artifacts & Directory Structure

Aster distinguishes between **source-tree paths** (for contributors working on Aster itself) and **packaged distribution paths** (for consuming Aster in downstream applications):

| Artifact / Path | Distribution Scope | Purpose |
|---|---|---|
| `dist/css/tokens.css` | **Packaged** | Canonical CSS custom properties (colors, typography, space, radius, elevation, density). |
| `dist/css/components.css` | **Packaged** | Canonical component styles (Button, Input, Table, and all 18 core components). |
| `dist/css/aster.css` | **Packaged** | Self-contained, all-in-one stylesheet bundling both tokens and components. |
| `dist/js/aster.js` | **Packaged** | Canonical browser ES module containing delegated component behaviors. |
| `dist/figma/*.json` | **Packaged** | DTCG variable token payloads for Figma Education / Dev Mode synchronization. |
| `docs/components/*.md` | **Packaged** | Human-readable component specifications, anatomy, states, and accessibility contracts. |
| `skills/using-aster-*/` | **Packaged** | AI agent instruction skills for rapid, hallucination-free coding. |
| `tokens/` | Source-Tree Only | Authoritative design token JSON definitions (compiled to `dist/`). |
| `components/` | Source-Tree Only | Authoritative modular component sources (compiled to `dist/`). |
| `build-tools/` | Source-Tree Only | Verification suites, Figma exporter, and compiler utilities. |
| `playground/` | Source-Tree Only | Interactive documentation portal site source. |
| `records/` | Source-Tree Only | Architectural decision records (`records/DECISION-LOG.md`) and roadmap status. |

---

## 4. Package Entry Points & Exports (`package.json`)

Aster is configured as a private local package (`"private": true`) ready for local integration via file paths or npm link. It defines an explicit `exports` map:

```json
{
  "name": "aster-design-system",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/js/aster.js",
  "module": "./dist/js/aster.js",
  "types": "./dist/js/aster.d.ts",
  "style": "./dist/css/aster.css",
  "exports": {
    ".": {
      "types": "./dist/js/aster.d.ts",
      "import": "./dist/js/aster.js",
      "default": "./dist/js/aster.js"
    },
    "./tokens.css": "./dist/css/tokens.css",
    "./components.css": "./dist/css/components.css",
    "./aster.css": "./dist/css/aster.css",
    "./css/tokens": "./dist/css/tokens.css",
    "./css/components": "./dist/css/components.css",
    "./css/aster": "./dist/css/aster.css",
    "./css/tokens.css": "./dist/css/tokens.css",
    "./css/components.css": "./dist/css/components.css",
    "./css/aster.css": "./dist/css/aster.css",
    "./package.json": "./package.json"
  }
}
```

---

## 5. How to Consume Aster in Projects

### Option A: Direct Browser Script & Link Tags (Zero Build Step)

You can copy `dist/` directly into your static assets directory or serve it via your backend server:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My Application</title>
  <!-- Load all-in-one stylesheet (Tokens + Components) -->
  <link rel="stylesheet" href="/assets/aster/dist/css/aster.css">
</head>
<body>
  <button type="button" class="as-button as-button--primary">
    <span class="as-button__label">Deploy Service</span>
  </button>

  <!-- Initialize Aster delegated behavior -->
  <script type="module">
    import { initAsterComponents } from '/assets/aster/dist/js/aster.js';
    initAsterComponents(document);
  </script>
</body>
</html>
```

### Option B: Modern Bundler / Monorepo Integration (Vite, Next.js, Webpack)

In a local workspace or monorepo, reference the local Aster directory in `package.json`:

```json
{
  "dependencies": {
    "aster-design-system": "file:../path/to/Aster-DS"
  }
}
```

In your application entry point (`index.js`, `main.ts`, `App.jsx`, etc.):

```javascript
// Import styles
import 'aster-design-system/aster.css';

// Or import modular stylesheets:
// import 'aster-design-system/tokens.css';
// import 'aster-design-system/components.css';

// Import and initialize behavior
import { initAsterComponents } from 'aster-design-system';

// Initialize delegated listeners on the document root
initAsterComponents(document);
```

---

## 6. Verification & Test Commands

Before consuming or deploying changes, run the validation suite:

```bash
# Run all builds
npm run build

# Verify WCAG 2.2 AA color contrast ratios (automated mathematical verification)
npm run test:contrast

# Verify documentation consistency with compiled CSS custom properties
npm run test:docs

# Export and validate DTCG variable payloads for Figma
npm run export:figma
npm run test:figma

# Verify all 21 component contracts and AI agent skill parity
npm run test:components

# Verify package exports resolution
npm run test:exports

# Verify packaging whitelist dry-run
npm run test:pack

# Run real-browser CDP behavioral verification (requires Chrome installed)
npm run test:browser
```

---

## 7. Quality Boundaries & Accessibility Scope

To maintain engineering integrity, Aster maintains strict boundaries regarding what is tested and verified versus what requires application-level evaluation:

1. **Contrast Claims:**
   - Automated checks (`test:contrast`) mathematically verify that designated foreground/background token pairs exceed WCAG 2.2 AA ratios (4.5:1 standard text, 3:1 UI boundaries).
   - Automated contrast tests **do not prove full WCAG 2.2 AA conformance**. Contextual typography sizes, user-generated content, and layout positioning must be verified in the final application.
2. **Target Size (WCAG 2.5.8):**
   - Comfortable controls (40px button/input, 44px table rows) provide generous touch targets.
   - Compact controls (32px button/input, 28px touch boundaries) exceed the normative 24×24px minimum of SC 2.5.8, but applications targeting mobile-heavy user bases should prefer Comfortable density for primary actions.
3. **Screen Readers & Reflow:**
   - All components declare semantic HTML5 elements (`<button>`, `<input>`, `<table>`, `<dialog>`) and ARIA states (`aria-busy`, `aria-invalid`, `aria-sort`, `aria-expanded`).
   - Real-world screen reader announcements (JAWS, NVDA, VoiceOver) and 400% zoom reflow depend on host DOM composition and must be evaluated in contextual integration testing.
4. **Reduced Motion:**
   - All interactive components support `prefers-reduced-motion: reduce`. Transforms (lift, press scales) collapse to `none` and durations collapse to instant changes.
