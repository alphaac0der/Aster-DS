---
name: using-aster-tokens
description: Discover and apply canonical Aster Design System tokens and CSS variables in web applications. Use when creating or styling UI components, layouts, or forms to ensure strict adherence to Aster tokens and prevent hardcoded styling values.
---

# Using Aster Design Tokens

This guide instructs AI coding agents on how to discover, select, and apply Aster design tokens when writing HTML, CSS, or component code.

---

## 1. Canonical Source of Truth

- **Compiled CSS Custom Properties:** Inspect `dist/css/tokens.css` to verify available variable names and selector structures.
- **Source Token Definitions:** Raw JSON files live in `tokens/primitive/`, `tokens/semantic/`, and `tokens/density/comfortable.json`.
- If `dist/css/tokens.css` is missing or stale, run `npm run build:tokens` before generating component code.

---

## 2. Token Selection Hierarchy

Always follow this order of precedence when styling UI components:

1. **Semantic Color Tokens First (`--as-semantic-color-*`):**
   - **Mandatory** for all component surfaces, borders, text, interactive states, and status indicators.
   - *Never* use raw primitives (`--as-color-primitive-*`) in component markup or CSS.
   - Semantic tokens use identical names in light and dark modes (`[data-theme="dark"]`), allowing components to remain theme-agnostic.
2. **Density Tokens for Control & Table Sizing (`--as-density-*`):**
   - Use `--as-density-control-height` (`40px`), `--as-density-control-padding-x` (`16px`), `--as-density-control-padding-y` (`8px`), and `--as-density-table-row-height` (`48px`).
   - Note: Aster uses a single unified density. Do not generate `[data-density="compact"]` or `--compact` classes.
3. **Primitive Tokens for Structural Foundations:**
   - Use primitive tokens *only* for invariant structural foundations:
     - Typography font stacks (`--as-typography-font-family-display`, `--as-typography-font-family-sans`, `--as-typography-font-family-mono`, `--as-typography-font-family-serif`)
     - Type sizes (`--as-typography-font-size-xs` through `--as-typography-font-size-display-l`)
     - Spacing increments (`--as-space-0` through `--as-space-16`)
     - Border radius (`--as-radius-none`, `--as-radius-sm` 4px min, `--as-radius-md` 8px default, `--as-radius-lg` 12px, `--as-radius-full` 9999px)
     - Structural hairline rules (`--as-elevation-border-hairline`) and focus thickness (`--as-elevation-border-focus`)

---

## 3. Anti-Hallucination & Token Discipline

### Absolute Prohibitions
- **NO hardcoded hex, rgb, or hsl colors** in application components: Always use `--as-semantic-color-*`.
- **NO 2px border radius:** Minimum component radius is `4px` (`--as-radius-sm`), default component radius is `8px` (`--as-radius-md`).
- **NO compact density mode:** Do not use `[data-density="compact"]` or `.as-*--compact`.
- **NO custom font families:** Always reference `--as-typography-font-family-display` (`Bebas Neue`), `--as-typography-font-family-sans` (`Manrope`), `--as-typography-font-family-mono` (`Space Mono`), or `--as-typography-font-family-serif` (`Merriweather`).

---

## 4. Quick-Lookup Reference Table

| UI Context | CSS Custom Property | Intended Use |
|---|---|---|
| Canvas Background | `var(--as-semantic-color-surface-canvas)` | Page canvas (`#FFFFFF` light / `#121212` dark) |
| Container / Card | `var(--as-semantic-color-surface-card)` | Elevated cards, modals (`#F5F5F5` light / `#1E1E1E` dark) |
| Subtle Surface | `var(--as-semantic-color-surface-subtle)` | Grouping fill, table headers (`#EEEEEE` light / `#333333` dark) |
| Primary Text | `var(--as-semantic-color-text-default)` | Main reading text (`#121212` light / `#E0E0E0` dark) |
| Secondary Text | `var(--as-semantic-color-text-muted)` | Captions, metadata (`#555555` light / `#AAAAAA` dark) |
| Card Border / Divider | `var(--as-semantic-color-border-subtle)` | 1px structural hairline rules |
| Input / Control Border | `var(--as-semantic-color-border-strong)` | Form inputs, checkboxes (`#777777`, ≥ 3:1 contrast) |
| Focus Ring Outline | `var(--as-semantic-color-border-focus)` | 2px accessible focus indicator (`#1565C0` / `#64B5F6`) |
| Primary Action Fill | `var(--as-semantic-color-interactive-primary)` | Monochrome primary fill (`#0F0F0F` light / `#FFFFFF` dark) |
| Primary Action Text | `var(--as-semantic-color-interactive-primary-text)` | Contrasting button text (`#FFFFFF` light / `#0F0F0F` dark) |
| Primary Action Hover | `var(--as-semantic-color-interactive-primary-hover)` | Hover/active state fill |
| Success Surface | `var(--as-semantic-color-surface-success)` | Shade-DS Success Surface 1 (`#E6F4EA` light / `#032A1D` dark) |
| Warning Surface | `var(--as-semantic-color-surface-warning)` | Shade-DS Warning Surface 1 (`#FFF8E1` light / `#2C1F04` dark) |
| Critical / Error Surface | `var(--as-semantic-color-surface-critical)` | Shade-DS Error Surface 1 (`#FBEAEB` light / `#281718` dark) |
| Focus Surface | `var(--as-semantic-color-surface-focus)` | Shade-DS Focus Surface 1 (`#E3F2FD` light / `#0D1B2A` dark) |
| Active Surface | `var(--as-semantic-color-surface-active)` | Shade-DS Active Surface 1 (`#F3E5F5` light / `#1C062E` dark) |
| Success Message | `var(--as-semantic-color-status-success-text)` | Positive confirmation feedback |
| Warning Message | `var(--as-semantic-color-status-warning-text)` | Cautionary alert text |
| Critical Message | `var(--as-semantic-color-status-critical-text)` | Error and destructive action text & Red Dot button |
| Focus Message | `var(--as-semantic-color-status-focus-text)` | Focus / info status message text |
| Active Message | `var(--as-semantic-color-status-active-text)` | Active purple status text |
| Control Height | `var(--as-density-control-height)` | `40px` standard height for Buttons, Inputs, Selects |
| Button Horizontal Pad | `var(--as-space-6)` | `24px` left and right padding on `.as-button` |
| Input Horizontal Pad | `var(--as-density-control-padding-x)` | `16px` left and right padding on `.as-input-box` |
| Table Row Height | `var(--as-density-table-row-height)` | `48px` standardized table rows |
| Container Radius | `var(--as-radius-lg)` | `12px` cards, dialogs, popovers |
| Default Component Radius | `var(--as-radius-md)` | `8px` inputs, alerts, toasts, textareas |
| Minimum Component Radius | `var(--as-radius-sm)` | `4px` checkboxes, menu items, tooltips |
| Pill Radius | `var(--as-radius-full)` | `9999px` buttons, badges, selects, switches |

---

## 5. Practical Implementation Examples

### Example 1: Primary Action Button (24px Horizontal Padding)

```css
.as-button--primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--as-density-control-height);
  padding: var(--as-density-control-padding-y) var(--as-space-6);
  background-color: var(--as-semantic-color-interactive-primary);
  color: var(--as-semantic-color-interactive-primary-text);
  font-family: var(--as-typography-font-family-sans);
  font-size: var(--as-typography-font-size-base);
  font-weight: var(--as-typography-font-weight-medium);
  border: 0;
  border-radius: var(--as-radius-full);
  cursor: pointer;
}

.as-button--primary:focus-visible {
  outline: var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus);
  outline-offset: 2px;
}
```

### Example 2: Data Card with Hairline Border

```css
.as-card {
  background-color: var(--as-semantic-color-surface-card);
  border: var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-subtle);
  border-radius: var(--as-radius-lg);
  padding: var(--as-space-6);
  box-shadow: var(--as-elevation-shadow-none);
}

.as-card__title {
  color: var(--as-semantic-color-text-default);
  font-family: var(--as-typography-font-family-sans);
  font-size: var(--as-typography-font-size-lg);
  font-weight: var(--as-typography-font-weight-semibold);
  margin-bottom: var(--as-space-2);
}

.as-card__meta {
  color: var(--as-semantic-color-text-muted);
  font-family: var(--as-typography-font-family-mono);
  font-size: var(--as-typography-font-size-xs);
  line-height: var(--as-typography-line-height-normal);
}
```

---

## 6. Figma Variable Export Rules for Agents

- **Canonical Source:** Git repository (`tokens/`) is authoritative. Never edit Figma payloads directly.
- **Build & Export:**
  - Run `npm run export:figma` to regenerate `dist/figma/aster-colors.json`, `dist/figma/aster-density.json`, and `dist/figma/aster-dimensions.json`.
  - Run `npm run test:figma` to validate payload structure, IDs, mode mappings, and alias references.
- **Collections:**
  - `Aster Colors`: 22 primitives and 17 semantic aliases with Light (`1001:0`) and Dark (`1001:1`) modes.
  - `Aster Density`: 6 standard dimension variables with Standard (`2001:0`) mode.
  - `Aster Dimensions`: 18 primitive dimension variables (11 space, 5 radius, 2 stroke widths) with Value (`3001:0`) mode.
