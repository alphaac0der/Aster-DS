# Aster Design System — Token Architecture & Specification

_Canonical reference documentation for human designers, software engineers, and AI coding agents._

Aster treats design tokens as version-controlled code, establishing a single authoritative source of truth in Git (`tokens/`) compiled into CSS custom properties via Style Dictionary (`dist/css/tokens.css`).

---

## 1. Token Architecture

Aster organizes design tokens into a disciplined **3-tier hierarchy**:

```
tokens/
├── primitive/     # Raw design values (colors, dimensions, font families, curves)
├── semantic/      # Purpose-driven, context-agnostic roles (light & dark parity)
└── density/       # Standard sizing and spacing metrics (comfortable.json)
```

1. **Primitive Tokens (`tokens/primitive/`):** The atomic palette, typography scale, spacing steps, elevation rules, and border radii. Primitives define the visual foundation but should **never** be referenced directly in application component markup.
2. **Semantic Tokens (`tokens/semantic/`):** Role-based variables mapping primitives to intent (`surface`, `text`, `border`, `interactive`, `status`). Semantic tokens maintain **identical variable names** across light and dark modes, allowing UI components to remain theme-agnostic.
3. **Density Tokens (`tokens/density/`):** Standard control and table dimension variables (`40px` control height, `48px` table row height) ensuring consistent ergonomics across all Aster components.

### Ergonomic Naming Grammar

Aster tokens follow a predictable naming grammar:
```
--as-[category]-[context]-[role]-[variant]
```

- Primitives: `--as-color-primitive-*`, `--as-typography-*`, `--as-space-*`, `--as-radius-*`, `--as-elevation-*`
- Semantic Colors: `--as-semantic-color-*`
- Density Metrics: `--as-density-*`

---

## 2. Primitives Reference

### Neutral Palette: Shade-DS Base Foundation

Aster's neutral foundation adopts the exact crisp neutral surface and content hierarchy from Shade-DS (`Theme.tsx`), providing high-contrast legibility in both Light and Dark themes.

| CSS Variable | Hex | Description & Role |
|---|---|---|
| `--as-color-primitive-neutral-0` | `#ffffff` | Pure white (Light Surface 1 & Dark primary action fill) |
| `--as-color-primitive-neutral-50` | `#fafafa` | Crisp elevated alabaster surface |
| `--as-color-primitive-neutral-100` | `#f5f5f5` | Shade-DS Light Base Surface 2 (elevated card surface) |
| `--as-color-primitive-neutral-200` | `#eeeeee` | Shade-DS Light Base Surface 3 (subtle/muted surface & hairline border) |
| `--as-color-primitive-neutral-300` | `#e0e0e0` | Shade-DS Dark Base Content 1 (primary dark mode text) |
| `--as-color-primitive-neutral-400` | `#aaaaaa` | Shade-DS Dark Base Content 2 (secondary muted dark mode text) |
| `--as-color-primitive-neutral-500` | `#777777` | Shade-DS Dark Base Content 3 (≥ 3:1 non-text control border in light & dark) |
| `--as-color-primitive-neutral-600` | `#555555` | Shade-DS Light Base Content 2 (secondary muted light mode text, 7.46:1 AAA) |
| `--as-color-primitive-neutral-700` | `#333333` | Shade-DS Dark Base Surface 3 (dark subtle/muted surface & hairline border) |
| `--as-color-primitive-neutral-800` | `#1e1e1e` | Shade-DS Dark Base Surface 2 (dark elevated card surface) |
| `--as-color-primitive-neutral-900` | `#121212` | Shade-DS Dark Base Surface 1 (dark canvas & primary light mode ink) |

### Monochrome Primary & Accent Primitives (Shade-DS Accent)

Aster follows Shade-DS's monochrome primary-action direction: pure white (`#ffffff`) with dark ink (`#0f0f0f`) in dark mode, and near-black (`#0f0f0f`) with white ink (`#ffffff`) in light mode.

| CSS Variable | Hex | Role |
|---|---|---|
| `--as-color-primitive-brand-400` | `#ffffff` | Monochrome white primary action fill for dark theme |
| `--as-color-primitive-brand-500` | `#e0e0e0` | Monochrome hover/active fill for dark theme |
| `--as-color-primitive-brand-600` | `#0f0f0f` | Monochrome primary action fill for light theme & dark ink on white buttons |

### Shade-DS Status Primitives (Surfaces & Content)

Aster faithfully reproduces all status surface tints and accessible content ink from Shade-DS (`Theme.tsx`) across both Dark and Light themes:

| Status Role | Dark Surface | Dark Content | Light Surface | Light Content | Application |
|---|---|---|---|---|---|
| **Success** | `--as-color-primitive-status-success-surface-dark` (`#032a1d`) | `--as-color-primitive-status-success-subtle` (`#6dd78c`) | `--as-color-primitive-status-success-surface-light` (`#e6f4ea`) | `--as-color-primitive-status-success-default` (`#188038`) | Positive feedback, healthy states, resolved toasts |
| **Warning** | `--as-color-primitive-status-warning-surface-dark` (`#2c1f04`) | `--as-color-primitive-status-warning-subtle` (`#ff9800`) | `--as-color-primitive-status-warning-surface-light` (`#fff8e1`) | `--as-color-primitive-status-warning-default` (`#b05a00`) | Maintenance notices, caution alerts, drain status |
| **Critical / Error** | `--as-color-primitive-status-critical-surface-dark` (`#281718`) | `--as-color-primitive-status-critical-subtle` (`#ff453a`) | `--as-color-primitive-status-critical-surface-light` (`#fbeaeb`) | `--as-color-primitive-status-critical-default` (`#c5221f`) | Blocking errors, destructive actions & 12px Red Dot dismiss |
| **Focus / Info** | `--as-color-primitive-status-info-surface-dark` (`#0d1b2a`) | `--as-color-primitive-status-info-subtle` (`#64b5f6`) | `--as-color-primitive-status-info-surface-light` (`#e3f2fd`) | `--as-color-primitive-status-info-default` (`#1565c0`) | Keyboard focus rings, informational notices |
| **Active Layout** | `--as-color-primitive-status-active-surface-dark` (`#1c062e`) | `--as-color-primitive-status-active-subtle` (`#d9a7f7`) | `--as-color-primitive-status-active-surface-light` (`#f3e5f5`) | `--as-color-primitive-status-active-default` (`#6a1b9a`) | Active layout highlights, blueprint hatched callouts |

---

## 3. Typography Roles & Scale (Shade-DS System)

Aster uses four distinct font family roles aligned with Shade-DS:

1. **Display / Hero (`Bebas Neue`):** `--as-typography-font-family-display`
2. **Body / Interface (`Manrope`):** `--as-typography-font-family-sans`
3. **Data / Code (`Space Mono`):** `--as-typography-font-family-mono`
4. **Quote / Editorial (`Merriweather`):** `--as-typography-font-family-serif`

```css
/* Display & Hero Headlines */
font-family: var(--as-typography-font-family-display);
/* 'Bebas Neue', Impact, 'Arial Narrow', sans-serif */

/* Interface, Body, Title & Label Stack */
font-family: var(--as-typography-font-family-sans);
/* 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Bengali', sans-serif */

/* Data, Measurements, Tokens & Code Stack */
font-family: var(--as-typography-font-family-mono);
/* 'Space Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace */

/* Editorial Quote Stack */
font-family: var(--as-typography-font-family-serif);
/* 'Merriweather', Georgia, Cambria, 'Times New Roman', serif */
```

### Type Scale & Hierarchy

| Token | Size | Rem Equivalent | Shade-DS Role & Target Application |
|---|---|---|---|
| `--as-typography-font-size-2xs` | `11px` | `0.6875rem` | `Readable.Label.S` — Micro metadata label (exception-only) |
| `--as-typography-font-size-xs` | `12px` | `0.75rem` | `Readable.Body.S` / `Expressive.Data` — Captions, badges, code, data |
| `--as-typography-font-size-sm` | `14px` | `0.875rem` | `Readable.Body.M` / `Readable.Label.L` — Form labels, secondary body |
| `--as-typography-font-size-base` | `14px` | `0.875rem` | `Readable.Body.M` — Default control and interface body copy |
| `--as-typography-font-size-md` | `16px` | `1rem` | `Readable.Body.L` / `Readable.Title.M` — Prominent body, card titles |
| `--as-typography-font-size-lg` | `22px` | `1.375rem` | `Readable.Title.L` — Modal titles, major card headings |
| `--as-typography-font-size-xl` | `24px` | `1.5rem` | `Expressive.Headline.S` / `Expressive.Quote` — Section headlines & quotes |
| `--as-typography-font-size-2xl` | `28px` | `1.75rem` | `Expressive.Headline.M` — Medium expressive headlines |
| `--as-typography-font-size-3xl` | `32px` | `2rem` | `Expressive.Headline.L` — Large expressive headlines |
| `--as-typography-font-size-display-s` | `36px` | `2.25rem` | `Expressive.Display.S` — Small display headers |
| `--as-typography-font-size-display-m` | `40px` | `2.5rem` | `Expressive.Display.M` — Medium display headers |
| `--as-typography-font-size-display-l` | `52px` | `3.25rem` | `Expressive.Display.L` — Hero display headers |

### Weights & Line Heights

- Weights: `--as-typography-font-weight-regular` (400), `--as-typography-font-weight-medium` (500), `--as-typography-font-weight-semibold` (600), `--as-typography-font-weight-bold` (700).
- Line Heights: `--as-typography-line-height-display` (1), `--as-typography-line-height-tight` (1.25), `--as-typography-line-height-normal` (1.45), `--as-typography-line-height-relaxed` (1.6).

---

## 4. Spacing, Radius & Elevation

### Spacing Scale (4px Base Unit)

| Token | Value | Recommended Usage |
|---|---|---|
| `--as-space-0` | `0px` | Reset |
| `--as-space-1` | `4px` | Micro-spacing (icon-to-text gap, badge padding) |
| `--as-space-2` | `8px` | Form gaps, button internal icon gap |
| `--as-space-3` | `12px` | Compact group gaps, alert internal padding |
| `--as-space-4` | `16px` | Standard input horizontal padding, card inner padding |
| `--as-space-5` | `20px` | Dialog header/body padding, intermediate container gutters |
| `--as-space-6` | `24px` | Button horizontal padding (24px left/right), spacious card padding |
| `--as-space-8` | `32px` | Major section spacing |
| `--as-space-10` | `40px` | Layout banding |
| `--as-space-12` | `48px` | Macro layout divisions |
| `--as-space-16` | `64px` | Page margins and hero divisions |

### Corner Geometry & Radii (Minimum 4px, Default 8px)

Aster enforces a minimum component radius of **4px** and a default component radius starting at **8px**. No component or token uses `2px`.

- `--as-radius-none`: `0px` (sharp corners: flush table dividers)
- `--as-radius-sm`: `4px` (minimum component radius: checkboxes, menu items, tooltips)
- `--as-radius-md`: `8px` (default component radius: inputs, alerts, toasts, textareas, dropdowns)
- `--as-radius-lg`: `12px` (elevated containers: cards, tables, dialogs, popovers)
- `--as-radius-full`: `9999px` (pill controls: buttons, badges, selects, switches, sliders)

### Elevation & Structural Hairlines

- `--as-elevation-border-hairline`: `1px` structural boundary rule.
- `--as-elevation-border-focus`: `2px` high-contrast keyboard focus ring.
- Shadows:
  - `--as-elevation-shadow-none`: `none`
  - `--as-elevation-shadow-raised`: `0 2px 4px rgba(0, 0, 0, 0.04)`
  - `--as-elevation-shadow-overlay`: `0 8px 24px rgba(0, 0, 0, 0.12)`

---

## 5. Semantic Color Roles

Components must **always** bind to semantic tokens, never primitives.

| Semantic Role | Light Mode Hex | Dark Mode Hex | Purpose | WCAG 2.2 Compliance |
|---|---|---|---|---|
| `--as-semantic-color-surface-canvas` | `#ffffff` | `#121212` | Main application background canvas (Shade-DS Surface 1) | Background baseline |
| `--as-semantic-color-surface-card` | `#f5f5f5` | `#1e1e1e` | Elevated card and container surface (Shade-DS Surface 2) | Structural elevation |
| `--as-semantic-color-surface-subtle` | `#eeeeee` | `#333333` | Subtle grouping fill, table header surface (Shade-DS Surface 3) | Subtle containment |
| `--as-semantic-color-surface-muted` | `#eeeeee` | `#333333` | Disabled or recessed surface fill | Recessed baseline |
| `--as-semantic-color-text-default` | `#121212` | `#e0e0e0` | Primary body text | 18.73:1 (Light) / 14.19:1 (Dark) AAA |
| `--as-semantic-color-text-muted` | `#555555` | `#aaaaaa` | Secondary metadata and helper text | 7.46:1 (Light) / 8.06:1 (Dark) AAA |
| `--as-semantic-color-text-on-fill` | `#ffffff` | `#0f0f0f` | Contrasting text atop primary monochrome fills | 19.25:1 AAA |
| `--as-semantic-color-border-subtle` | `#eeeeee` | `#333333` | Hairline card borders, row dividers | Decorative divider |
| `--as-semantic-color-border-strong` | `#777777` | `#777777` | Non-text boundary for inputs and controls | ≥ 3.72:1 non-text AA |
| `--as-semantic-color-border-focus` | `#1565c0` | `#64b5f6` | High-visibility keyboard focus indicator ring | ≥ 5.75:1 non-text AA |
| `--as-semantic-color-interactive-primary` | `#0f0f0f` | `#ffffff` | Monochrome primary action fill | High-contrast kinetic |
| `--as-semantic-color-interactive-primary-text` | `#ffffff` | `#0f0f0f` | Contrasting text on primary action button | 19.17:1 AAA |
| `--as-semantic-color-interactive-primary-hover` | `#333333` | `#e0e0e0` | Hover/active state for primary action button | Stage-kinetic hover |
| `--as-semantic-color-surface-success` | `#e6f4ea` | `#032a1d` | Shade-DS Success Surface 1 | Status background |
| `--as-semantic-color-surface-warning` | `#fff8e1` | `#2c1f04` | Shade-DS Warning Surface 1 | Status background |
| `--as-semantic-color-surface-critical` | `#fbeaeb` | `#281718` | Shade-DS Error Surface 1 | Status background |
| `--as-semantic-color-surface-focus` | `#e3f2fd` | `#0d1b2a` | Shade-DS Focus Surface 1 | Status background |
| `--as-semantic-color-surface-active` | `#f3e5f5` | `#1c062e` | Shade-DS Active Surface 1 | Layout background |
| `--as-semantic-color-status-success-text` | `#188038` | `#6dd78c` | Positive feedback message text | 5.02:1 (Light) / 10.48:1 (Dark) AA/AAA |
| `--as-semantic-color-status-warning-text` | `#b05a00` | `#ff9800` | Warning feedback message text | 4.87:1 (Light) / 8.69:1 (Dark) AA/AAA |
| `--as-semantic-color-status-critical-text` | `#c5221f` | `#ff453a` | Error feedback text & 12px Red Dot dismiss control | 5.80:1 (Light) / 7.25:1 (Dark) AA/AAA |
| `--as-semantic-color-status-focus-text` | `#1565c0` | `#64b5f6` | Info / focus state message text | 5.75:1 (Light) / 8.46:1 (Dark) AA/AAA |
| `--as-semantic-color-status-active-text` | `#6a1b9a` | `#d9a7f7` | Active accent status message text | 6.78:1 (Light) / 9.82:1 (Dark) AA/AAA |

### Zero Wireframe Outlines & Double 1px Glass Glow

Following Shade-DS's signature surface treatment, components and surface cards do **not** use harsh `border: 1px solid` wireframe outlines. Instead, components employ a **double 1px glass glow**:

```css
/* Shade-DS Canonical Glass Glow Pattern */
border: none;
box-shadow: 0 0 1px 0px var(--line-color), inset 0 0 1px 0px var(--line-color);
```

This ensures boundaries remain optically sharp on Retina/HiDPI screens without creating thick, harsh wireframe borders.

### Shade-DS Red Dot Dismiss Controls

All dismissible surfaces (Dialog, Drawer, Alert, Toast, Popover) use Shade-DS's **12px solid circular red dot**:
- Dimensions: `12px × 12px` circle (`border-radius: 50%`)
- Fill: `--as-semantic-color-status-critical-text` (`#ff453a` in dark mode, `#c5221f` in light mode)
- Internal glyph: Pure solid dot (no interior SVG cross/glyphs)
- Interaction: Scale `1.2` on `:hover`, scale `0.9` on `:active` with smooth cubic-bezier easing
- Accessibility: Focus ring with `2px` offset and explicit `aria-label`

### Shade-DS Form Input Specifications

- Height: **44px** exact Shade-DS geometry
- Radius: **4px** (`Radius.S` / `--as-radius-sm`)
- Surface: Canvas `#121212` in dark mode (`--as-semantic-color-surface-canvas`)
- Boundary: Double 1px glass glow (zero wireframe outline)
- Focus: Double 1px luminous focus glow (`--as-semantic-color-border-focus`)

---

## 6. Standard Density Metrics

Aster uses a unified, consistent default density across the entire design system:

| Token | Value | Usage |
|---|---|---|
| `--as-density-control-height` | `40px` | Standard interactive control height (Button, Input, Select) |
| `--as-density-control-padding-x` | `16px` | Standard form input horizontal padding |
| `--as-density-control-padding-y` | `8px` | Standard control vertical padding |
| `--as-density-table-row-height` | `48px` | Standard data table row height |
| `--as-density-table-cell-padding-x` | `16px` | Standard data table horizontal cell padding |
| `--as-density-table-cell-padding-y` | `12px` | Standard data table vertical cell padding |

---

## 7. Theme Switching Guide

Aster compiles its master stylesheet into `dist/css/tokens.css`. Themes can be switched on the document root or any container subtree using `data-theme`:

```html
<!-- Light Theme -->
<html data-theme="light"> ... </html>

<!-- Dark Theme -->
<html data-theme="dark"> ... </html>
```
