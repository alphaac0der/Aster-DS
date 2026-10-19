# Aster Design System

Aster is a zero-dependency, token-first design system engineered with dual interfaces derived from an authoritative source of truth:

- **Human-Facing Documentation & Components:** Production-grade CSS custom properties and browser-native ES modules for developers and designers.
- **Agent-Facing Instructions:** Comprehensive coding standards and boundaries in [`AGENTS.md`](AGENTS.md) and specialized workflow skills (`skills/`).

Aster features 82 canonical design tokens (W3C DTCG format) and 21 production components spanning Form Essentials, Data Display, Feedback & Utilities, Overlays, and Navigation.

---

## Quickstart

### 1. Build from Source
Aster's build system uses pure native Node.js scripts with zero runtime dependencies.

```bash
# Install development compiler (Style Dictionary)
npm install

# Build tokens, components, and documentation portal
npm run build
```

### 2. Available NPM Scripts

| Command | Action |
|---|---|
| `npm run build` | Full compilation (`build:tokens`, `build:components`, `build:playground`) |
| `npm run build:tokens` | Compiles `tokens/**/*.json` into `dist/css/tokens.css` |
| `npm run build:components` | Compiles modular `components/` into `dist/css/components.css`, `dist/css/aster.css`, and `dist/js/aster.js` |
| `npm run build:playground` | Compiles the self-contained portal at `playground/index.html` across all 29 routes |
| `npm run playground` | Launches the local documentation portal on `http://127.0.0.1:3000/playground/` |
| `npm run test:contrast` | Mathematical verification of all required WCAG 2.2 AA contrast pairs (26/26) |
| `npm run test:docs` | Verifies consistency between documentation and compiled CSS custom properties (162/162) |
| `npm run export:figma` | Generates W3C DTCG variable token payloads for Figma in `dist/figma/` |
| `npm run test:figma` | Validates Figma token payload schemas and alias bindings (63/63) |
| `npm run test:components` | Validates concrete token references and structural contracts across all 21 components (646/646) |
| `npm run test:exports` | Validates package entry points and exports resolution (18/18) |
| `npm run test:pack` | Executes an `npm pack --dry-run` packaging whitelist verification |
| `npm run test:browser` | Headless Chrome CDP behavioral audit testing real DOM interactions (113/113) |

---

## Consuming Aster

Aster provides standard browser-ready CSS and ES modules with zero third-party framework wrappers.

### Vanilla HTML / Modern Bundler

```html
<!-- Load all-in-one stylesheet (Tokens + Components) -->
<link rel="stylesheet" href="dist/css/aster.css">

<!-- Use semantic components -->
<button type="button" class="as-button as-button--primary">
  <span class="as-button__label">Primary Action</span>
</button>

<!-- Initialize Aster delegated interactions -->
<script type="module">
  import { initAsterComponents } from './dist/js/aster.js';
  initAsterComponents(document);
</script>
```

For integration guides with **React**, **Vue**, and **Svelte**, see [`docs/frameworks.md`](docs/frameworks.md).  
For detailed distribution and local setup instructions, see [`docs/installation.md`](docs/installation.md).

---

## Directory Structure

```
Aster-DS/
├── components/          # Authoritative modular component sources (CSS + JS)
├── tokens/              # Authoritative DTCG design tokens (JSON)
├── dist/                # Generated distribution outputs (CSS, JS, Figma JSON)
│   ├── css/             # tokens.css, components.css, aster.css
│   ├── js/              # aster.js (ES module)
│   └── figma/           # aster-colors.json, aster-dimensions.json, aster-density.json
├── docs/                # Human-facing documentation
│   ├── components/      # 21 individual component specifications
│   ├── principles.md    # Core design principles and philosophy
│   ├── tokens.md        # Foundation tokens guide
│   ├── installation.md  # Setup, packaging, and prerequisites
│   └── frameworks.md    # React, Vue, Svelte, and Vanilla integration
├── AGENTS.md            # Authoritative instructions and rules for AI coding agents
├── skills/              # Agent-facing instruction skills (AI coding standards)
│   ├── using-aster-tokens/
│   └── using-aster-components/
├── playground/          # Production documentation portal and component showcase
├── examples/            # Minimal consumer integration examples
├── build-tools/         # Compilers, validators, and browser CDP audit tools
└── records/             # Architectural decision log (DECISION-LOG.md) and status (STATUS.md)
```

---

## Quality Boundaries & Accessibility Scope

- **WCAG 2.2 AA Compliance:** Token pairings are mathematically verified (4.5:1 text, 3:1 UI boundaries). Holistic application accessibility (screen reader announcements, live regions, reflow) requires context-dependent evaluation.
- **Target Size (SC 2.5.8):** Standard controls provide 40px/44px minimum touch targets, comfortably exceeding the 24×24px WCAG SC 2.5.8 minimum across all devices. Compact mode is eliminated in favor of a single standard touch-accessible density.
- **Reduced Motion:** All interactive components collapse transforms and durations under `prefers-reduced-motion: reduce`.

---

## Canonical Visual Reference & Attribution

Aster's visual foundation, kinetics, and core component architecture faithfully reproduce and extend **Shade-DS** by [Shifat Masud](https://github.com/shifatmasud/Shade-DS). 

- **Permission:** Explicit permission has been granted by the author (Shifat Masud) to utilize Shade-DS components, geometry, states, and animations directly in Aster.
- **Architecture:** Original Shade-DS components (Button, Input, TextArea, Select, Toggle, RangeSlider, Accordion, SegmentedControl, FloatingWindow, TokenBadge) are faithfully reproduced to specification. Aster's remaining components (Checkbox, Radio Group, Alert, Drawer, Popover, Dropdown Menu, Tooltip, Toast, Progress, Skeleton, Data Table) are harmonized as first-class extensions of this design language.
- **Typography:** Aster preserves its distinctive 4-role typography system (`Bebas Neue` Display, `Manrope` Body, `Space Mono` Code/Data, `Merriweather` Editorial) scaled against Shade-DS dimensional hierarchy.

---

## Version Control & Licensing

- **Version Control:** Private repository configured (`origin`).
- **Package Status:** Private (`"private": true`). Not published to any registry.
- **Licensing Gate:** Open. Formal licensing terms (e.g. Apache-2.0) and third-party notices (for Phosphor icons SIL OFL 1.1/MIT, Google fonts SIL OFL 1.1, and Shade-DS) are explicitly reserved for approval in a dedicated phase prior to any public release.
