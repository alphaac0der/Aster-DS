# Aster Design System — Token Architecture & Specification

_Canonical reference documentation for human designers and software engineers._

Aster treats design tokens as version-controlled code, establishing a single authoritative source of truth in Git (`tokens/`) compiled into CSS custom properties via Style Dictionary v5 (`dist/css/tokens.css`).

---

## 1. Token Architecture

Aster organizes design tokens into a disciplined **3-tier hierarchy**:

```
tokens/
├── primitive/     # Raw design values (colors, dimensions, font families, curves)
├── semantic/      # Purpose-driven, context-agnostic roles (light & dark parity)
└── density/        # Contextual sizing and spacing modes (comfortable & compact)
```

1. **Primitive Tokens (`tokens/primitive/`):** The atomic palette, typography scale, spacing steps, elevation rules, and border radii. Primitives define the brand aesthetic but should **never** be referenced directly in application component markup.
2. **Semantic Tokens (`tokens/semantic/`):** Role-based variables mapping primitives to intent (`surface`, `text`, `border`, `interactive`, `status`). Semantic tokens maintain **identical variable names** across light and dark modes, allowing UI components to remain theme-agnostic.
3. **Density Tokens (`tokens/density/`):** Layout and dimension variables that adapt component density (e.g. table row heights, form padding, grid gaps) without altering visual hierarchy or color semantics.

### Ergonomic Naming Grammar

Aster tokens follow a predictable naming grammar:
```
--as-[category]-[context]-[role]-[variant]
```

To eliminate awkward prefix stutter (such as `--as-color-semantic-*`), Aster condenses role tokens to ergonomic names:
- Primitives: `--as-color-primitive-*`, `--as-typography-*`, `--as-space-*`, `--as-radius-*`, `--as-elevation-*`
- Semantic Colors: `--as-semantic-color-*`
- Density Overrides: `--as-density-*`

---

## 2. Primitives Reference

### Neutral Palette: Balanced Natural Stone

Aster's neutral foundation utilizes natural warm stone undertones. This reduces optical glare during prolonged data-heavy workstation sessions while preserving crisp contrast.

| CSS Variable | Hex | Description & Role |
|---|---|---|
| `--as-color-primitive-neutral-0` | `#ffffff` | Pure white |
| `--as-color-primitive-neutral-50` | `#faf9f6` | Natural warm stone canvas base |
| `--as-color-primitive-neutral-100` | `#f3f1ec` | Subtle surface and card background |
| `--as-color-primitive-neutral-200` | `#e5e2da` | Muted surface and hover fill |
| `--as-color-primitive-neutral-300` | `#d3cec4` | Hairline structural border and divider |
| `--as-color-primitive-neutral-400` | `#857e72` | High-contrast control border (≥ 3:1 on light canvas) |
| `--as-color-primitive-neutral-600` | `#706b60` | Secondary text and non-text border (≥ 3:1 on dark canvas) |
| `--as-color-primitive-neutral-700` | `#524d44` | Muted reading text (≥ 4.5:1 on light canvas) |
| `--as-color-primitive-neutral-900` | `#211f1b` | Primary high-contrast text in light mode |
| `--as-color-primitive-neutral-950` | `#171513` | Dark card and container surface |
| `--as-color-primitive-neutral-1000` | `#0e0d0c` | Dark canvas base |
| `--as-color-primitive-neutral-1100` | `#050505` | Maximum depth pitch black |

### Functional Brand & Status Primitives

Color is strictly functional; decorative tints are prohibited on transactional data surfaces.

| CSS Variable | Hex | Role |
|---|---|---|
| `--as-color-primitive-brand-400` | `#60a5fa` | Brand tint for dark mode interactive text & focus ring |
| `--as-color-primitive-brand-500` | `#3b82f6` | Brand tint for dark mode button fill |
| `--as-color-primitive-brand-600` | `#2054d4` | Brand tint for light mode primary button & focus ring |
| `--as-color-primitive-brand-700` | `#1a44ab` | Brand tint for light mode interactive text & hover |
| `--as-color-primitive-status-success-light` | `#147244` | Positive feedback text in light mode (≥ 4.5:1) |
| `--as-color-primitive-status-success-dark` | `#34d399` | Positive feedback text in dark mode (≥ 4.5:1) |
| `--as-color-primitive-status-warning-light` | `#92400e` | Warning alert text in light mode (≥ 4.5:1) |
| `--as-color-primitive-status-warning-dark` | `#fbbf24` | Warning alert text in dark mode (≥ 4.5:1) |
| `--as-color-primitive-status-critical-light` | `#b91c1c` | Error alert text in light mode (≥ 4.5:1) |
| `--as-color-primitive-status-critical-dark` | `#f87171` | Error alert text in dark mode (≥ 4.5:1) |

---

## 3. Typography Stack & Scale

Aster employs **Geist Sans** and **Geist Mono** (SIL OFL 1.1) as primary interface typefaces, with explicit fallback support for Bangla script via **Noto Sans Bengali** and robust platform system fonts.

### Font Families

```css
/* Interface Text Stack */
font-family: var(--as-typography-font-family-sans);
/* 'Geist Sans', 'Noto Sans Bengali', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif */

/* Monospace & Tabular Data Stack */
font-family: var(--as-typography-font-family-mono);
/* 'Geist Mono', 'Noto Sans Bengali', ui-monospace, SFMono-Regular, Consolas, monospace */
```

### Type Scale & Hierarchy

| Token | Size | Rem Equivalent | Target Application |
|---|---|---|---|
| `--as-typography-font-size-xs` | `12px` | `0.75rem` | Aster informative text floor (captions, micro-badges) |
| `--as-typography-font-size-sm` | `13px` | `0.8125rem` | Data table cells, compact form controls |
| `--as-typography-font-size-base` | `14px` | `0.875rem` | Standard application body text, form inputs |
| `--as-typography-font-size-md` | `16px` | `1rem` | Prominent body text, large inputs |
| `--as-typography-font-size-lg` | `18px` | `1.125rem` | Card titles, modal headers |
| `--as-typography-font-size-xl` | `20px` | `1.25rem` | Section headers |
| `--as-typography-font-size-2xl` | `24px` | `1.5rem` | Page titles |
| `--as-typography-font-size-3xl` | `32px` | `2rem` | Hero metrics and key performance indicators |

### Weights & Line Heights

- Weights: `--as-typography-font-weight-regular` (400), `--as-typography-font-weight-medium` (500), `--as-typography-font-weight-semibold` (600).
- Line Heights: `--as-typography-line-height-tight` (1.25), `--as-typography-line-height-normal` (1.5), `--as-typography-line-height-relaxed` (1.75).
- **Tabular Figures Requirement:** When presenting numerical data, metrics, or financial tables, software engineers must enable tabular figures: `font-variant-numeric: tabular-nums`.

---

## 4. Spacing, Radius & Elevation

### Spacing Scale (Hybrid 4pt / 8pt)

Aster uses an 8pt layout grid with a 4pt micro-increment for tight component padding:

| Token | Value | Recommended Usage |
|---|---|---|
| `--as-space-0` | `0px` | Reset |
| `--as-space-1` | `4px` | Micro-spacing (icon-to-text gap, badge padding) |
| `--as-space-2` | `8px` | Compact form gaps, button internal spacing |
| `--as-space-3` | `12px` | Standard horizontal input and table cell padding |
| `--as-space-4` | `16px` | Base layout increment, card inner padding |
| `--as-space-5` | `20px` | Intermediate container gutters |
| `--as-space-6` | `24px` | Spacious card padding, section gaps |
| `--as-space-8` | `32px` | Major section spacing |
| `--as-space-10` | `40px` | Layout banding |
| `--as-space-12` | `48px` | Macro layout divisions |
| `--as-space-16` | `64px` | Page margins and hero divisions |

### Corner Geometry & Radii

Restrained geometric radii communicate precision and structural stability:
- `--as-radius-none`: `0px` (sharp corners: table cells, panel dividers)
- `--as-radius-sm`: `2px` (subtle rounding: checkboxes, small tags)
- `--as-radius-md`: `4px` (standard controls: buttons, text inputs, selects)
- `--as-radius-lg`: `6px` (containers: cards, dialogs, popovers)
- `--as-radius-full`: `9999px` (fully rounded pills: status badges, avatars)

### Elevation & Structural Hairlines

Aster prioritizes a border-first structural hierarchy using hairline rules over heavy shadows:
- `--as-elevation-border-hairline`: `1px` structural boundary rule.
- `--as-elevation-border-focus`: `2px` high-contrast keyboard focus ring.
- Shadows:
  - `--as-elevation-shadow-none`: `none` (flat transactional surfaces)
  - `--as-elevation-shadow-raised`: `0 2px 4px rgba(0, 0, 0, 0.04)` (small dropdown menus)
  - `--as-elevation-shadow-overlay`: `0 8px 24px rgba(0, 0, 0, 0.12)` (floating modals and dialogs)

---

## 5. Semantic Color Roles

Components should **always** bind to semantic tokens, never primitives.

| Semantic Role | Light Mode Hex | Dark Mode Hex | Purpose |
|---|---|---|---|
| `--as-semantic-color-surface-canvas` | `#faf9f6` | `#0e0d0c` | Main application background canvas |
| `--as-semantic-color-surface-card` | `#ffffff` | `#171513` | Elevated card and container background |
| `--as-semantic-color-surface-subtle` | `#f3f1ec` | `#211f1b` | Subtle container fill, alternating rows |
| `--as-semantic-color-surface-muted` | `#e5e2da` | `#211f1b` | Disabled or inactive surface fill |
| `--as-semantic-color-text-default` | `#211f1b` | `#f3f1ec` | Primary body text (≥ 7:1 AAA contrast) |
| `--as-semantic-color-text-muted` | `#524d44` | `#d3cec4` | Secondary metadata text (≥ 4.5:1 AA contrast) |
| `--as-semantic-color-text-inverse` | `#ffffff` | `#0e0d0c` | Inverted text on opposing backgrounds |
| `--as-semantic-color-border-subtle` | `#d3cec4` | `#211f1b` | Hairline card borders, row dividers |
| `--as-semantic-color-border-strong` | `#857e72` | `#706b60` | Input borders, checkboxes (≥ 3:1 non-text) |
| `--as-semantic-color-border-focus` | `#2054d4` | `#60a5fa` | Keyboard focus ring (≥ 3:1 non-text) |
| `--as-semantic-color-interactive-primary` | `#2054d4` | `#3b82f6` | Primary action button fill |
| `--as-semantic-color-interactive-primary-text` | `#ffffff` | `#050505` | Text on primary action button (≥ 4.5:1) |
| `--as-semantic-color-interactive-primary-hover` | `#1a44ab` | `#60a5fa` | Hover state for primary action button |
| `--as-semantic-color-interactive-link` | `#1a44ab` | `#60a5fa` | Standalone interactive link text |
| `--as-semantic-color-status-success-text` | `#147244` | `#34d399` | Positive feedback message text |
| `--as-semantic-color-status-warning-text` | `#92400e` | `#fbbf24` | Warning feedback message text |
| `--as-semantic-color-status-critical-text` | `#b91c1c` | `#f87171` | Error / destructive feedback message text |

---

## 6. Adaptive Density Modes

Aster features dual density modes configured through contextual density variables:
- **Comfortable Mode (Default in `:root`):** Generous spacing and padding suited for standard administrative dashboards, settings, and form entry.
- **Compact Mode (`[data-density="compact"]`):** Tightened dimensions designed for high-density data tables, telemetry screens, and log viewers.

| Token | Comfortable (`:root`) | Compact (`[data-density="compact"]`) |
|---|---|---|
| `--as-density-table-row-height` | `44px` | `32px` |
| `--as-density-control-height` | `40px` | `32px` |
| `--as-density-control-padding-y` | `8px` | `4px` |
| `--as-density-control-padding-x` | `16px` | `12px` |
| `--as-density-card-padding` | `24px` | `16px` |
| `--as-density-layout-gap` | `24px` | `16px` |

> **Accessibility Target Preservation:** Even in compact mode, interactive control heights are strictly set to `32px`, exceeding the `24px` minimum pointer target dimension established by WCAG 2.2 SC 2.5.8 (Target Size Minimum).

---

## 7. Theme & Density Switching Guide

Aster compiles its master stylesheet into `dist/css/tokens.css` with clean, orthogonal selectors. Themes and density modes can be activated independently or composed together on the document root or any container subtree.

### Full Application Configuration

```html
<!-- Default: Light Theme, Comfortable Density -->
<html> ... </html>

<!-- Dark Theme, Comfortable Density -->
<html data-theme="dark"> ... </html>

<!-- Light Theme, Compact Density -->
<html data-density="compact"> ... </html>

<!-- Dark Theme, Compact Density -->
<html data-theme="dark" data-density="compact"> ... </html>
```

### Contextual Subtree Overrides

Components can override density or theme locally without affecting surrounding layouts:

```html
<main>
  <!-- Standard comfortable section -->
  <section class="settings-panel"> ... </section>

  <!-- Dense telemetry section in compact mode -->
  <section class="telemetry-grid" data-density="compact">
    <table class="data-table"> ... </table>
  </section>
</main>
```

---

## 8. Accessibility Conventions & Safeguards

### Informative Text Floor (12px Minimum)

- **The Aster Convention:** Informative typography must never drop below `12px` (`0.75rem`, `--as-typography-font-size-xs`) with a minimum line height of `16px`. This preserves visual legibility on high-DPI and standard monitors alike.
- **Exception Review Process:** Type sizes below 12px (e.g. 11px chart axis tick labels, micro-badge timestamps) are permitted only by documented exception. An exception requires that:
  1. The text is secondary or non-critical metadata.
  2. An accessible label (`aria-label`) or tooltip is provided.
  3. The color contrast achieves verified 4.5:1 minimum contrast.

### Focus Appearance & Keyboard Navigation

- **Indicator Thickness:** The focus ring token `--as-elevation-border-focus` specifies a `2px` border, meeting WCAG 2.2 SC 2.4.13.
- **Focus Contrast:** `--as-semantic-color-border-focus` achieves **6.08:1** contrast against light canvas and **7.64:1** against dark canvas.
- **Focus Ring CSS Pattern:**
  ```css
  .interactive-element:focus-visible {
    outline: var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus);
    outline-offset: 2px;
  }
  ```

### Non-Color State Communication

Interactive states (hover, focus, disabled) and status indicators (success, warning, error) must never rely on color alone. Status messages must always pair color tokens with an icon, semantic badge, or explicit text label.

---

## 9. Figma Variable Integration & Tooling

Aster exports design tokens to native Figma Variables via automated tooling, establishing a reliable one-way export pipeline from Git into Figma while maintaining Git as the single authoritative source of truth.

### Collection Architecture & Scope

Aster variables are exported to isolated collections:

1. **`Aster Colors` Collection (`dist/figma/aster-colors.json`):**
   - **Modes:** `Light` (`1001:0`) and `Dark` (`1001:1`).
   - **Primitives (22 variables):** Invariant color variables (`primitive/neutral/*`, `primitive/brand/*`, `primitive/status/*`) sharing identical RGBA definitions across modes.
   - **Semantics (17 variables):** Role-based color variables (`semantic/surface/*`, `semantic/text/*`, `semantic/border/*`, `semantic/interactive/*`, `semantic/status/*`) resolving as native Figma variable aliases to internal primitive IDs per mode.
2. **`Aster Density` Collection (`dist/figma/aster-density.json`):**
   - **Modes:** `Comfortable` (`2001:0`) and `Compact` (`2001:1`).
   - **Density Variables (6 variables):** Sizing dimensions (`density/table/*`, `density/control/*`, `density/card/*`, `density/layout/*`) exported as native `FLOAT` variables.
3. **`Aster Dimensions` Collection (`dist/figma/aster-dimensions.json`):**
   - **Modes:** `Value` (`3001:0`).
   - **Dimension Primitives (18 variables):** Spacing scale (`primitive/space/*`, 11 variables), corner radii (`primitive/radius/*`, 5 variables), and border stroke widths (`primitive/border-width/*`, 2 variables) exported as native `FLOAT` variables.
4. **Explicitly Deferred Tokens (19 tokens):**
   - 16 composite typography tokens deferred to Phase 6D (Figma Text Styles).
   - 3 elevation shadows deferred to Phase 6E (Figma Effect Styles).

### Tooling Commands

```bash
# Export canonical DTCG tokens to Figma JSON payloads
npm run export:figma

# Validate generated payloads against schema, ID constraints, and alias references
npm run test:figma
```

