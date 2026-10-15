---
name: using-aster-tokens
description: Discover and apply canonical Aster Design System tokens and CSS variables in web applications. Use when creating or styling UI components, layouts, or forms to ensure strict adherence to Aster tokens and prevent hardcoded styling values.
---

# Using Aster Design Tokens

This guide instructs AI coding agents on how to discover, select, and apply Aster design tokens when writing HTML, CSS, or component code.

> **Note on Agent Skill Support:** Agent Skills (`SKILL.md`) is an open standard designed for progressive-disclosure agent workflows. Native skill discovery varies across agent tools and platforms. In environments where agent skills are not natively invoked, these instructions should be referenced as system prompt rules or project coding guidelines.

---

## 1. Canonical Source of Truth

- **Compiled CSS Custom Properties:** Inspect `dist/css/tokens.css` to verify available variable names and selector structures.
- **Source Token Definitions:** Raw JSON files live in `tokens/primitive/`, `tokens/semantic/`, and `tokens/density/`.
- If `dist/css/tokens.css` is missing or stale, run `npm run build:tokens` before generating component code.

---

## 2. Token Selection Hierarchy

Always follow this order of precedence when styling UI components:

1. **Semantic Color Tokens First (`--as-semantic-color-*`):**
   - **Mandatory** for all component surfaces, borders, text, interactive states, and status indicators.
   - *Never* use raw primitives (`--as-color-primitive-*`) in component markup or CSS.
   - Semantic tokens use identical names in light and dark modes, allowing components to remain theme-agnostic.
2. **Density Tokens for Sizing & Spacing (`--as-density-*`):**
   - Use density variables for table row heights, form control heights, input padding, card padding, and grid gaps.
   - Density automatically scales between comfortable (`:root`) and compact (`[data-density="compact"]`).
3. **Primitive Tokens for Structural Foundations:**
   - Use primitive tokens *only* for invariant structural foundations:
     - Typography font stack (`--as-typography-font-family-sans`, `--as-typography-font-family-mono`)
     - Type sizes (`--as-typography-font-size-xs` through `--as-typography-font-size-3xl`)
     - Spacing increments (`--as-space-0` through `--as-space-16`)
     - Border radius (`--as-radius-none` through `--as-radius-full`)
     - Structural hairline rules (`--as-elevation-border-hairline`) and focus thickness (`--as-elevation-border-focus`)

---

## 3. Anti-Hallucination & Token Discipline

### Absolute Prohibitions
- **NO hardcoded hex, rgb, or hsl colors:** (e.g. `background: #ffffff;`, `color: #333;`). Always use a semantic token.
- **NO arbitrary pixel margins or paddings:** (e.g. `margin: 15px;`, `padding: 22px;`). Always use `--as-space-*` or `--as-density-*`.
- **NO custom font families:** Always reference `--as-typography-font-family-sans` or `--as-typography-font-family-mono`.
- **NO sub-12px typography without documented justification:** Aster enforces an informative text minimum of `12px` (`--as-typography-font-size-xs`).

### Documented Exception Protocol
If an edge case genuinely cannot be addressed by existing tokens (e.g. custom canvas data visualizations, third-party embedded widgets, or an 11px chart axis tick):
1. Verify the styling satisfies WCAG 2.2 AA contrast.
2. Document the exception explicitly inline with a comment explaining the rationale:
   ```css
   /* Aster Token Exception: Micro-badge tick requires 11px; non-critical metadata; verified 4.5:1 contrast */
   font-size: 11px;
   ```

---

## 4. Quick-Lookup Reference Table

| UI Context | CSS Custom Property | Intended Use |
|---|---|---|
| Canvas Background | `var(--as-semantic-color-surface-canvas)` | Page canvas base |
| Container / Card | `var(--as-semantic-color-surface-card)` | Elevated cards, modals, panels |
| Subtle Surface | `var(--as-semantic-color-surface-subtle)` | Alternating rows, input backgrounds |
| Primary Text | `var(--as-semantic-color-text-default)` | Main reading text (≥ 7:1 contrast) |
| Secondary Text | `var(--as-semantic-color-text-muted)` | Captions, metadata, helper text |
| Card Border / Divider | `var(--as-semantic-color-border-subtle)` | 1px structural hairline rules |
| Input / Control Border | `var(--as-semantic-color-border-strong)` | Form inputs, checkboxes, toggles |
| Focus Ring Outline | `var(--as-semantic-color-border-focus)` | 2px accessible focus indicator |
| Primary Action Button | `var(--as-semantic-color-interactive-primary)` | Button background fill |
| Primary Action Text | `var(--as-semantic-color-interactive-primary-text)` | High-contrast button text |
| Primary Action Hover | `var(--as-semantic-color-interactive-primary-hover)` | Hover state background |
| Interactive Link | `var(--as-semantic-color-interactive-link)` | Standalone link text |
| Success Message | `var(--as-semantic-color-status-success-text)` | Positive confirmation feedback |
| Warning Message | `var(--as-semantic-color-status-warning-text)` | Cautionary alert text |
| Critical Message | `var(--as-semantic-color-status-critical-text)` | Error and destructive action text |
| Control Height | `var(--as-density-control-height)` | Buttons, select boxes, inputs |
| Control Padding | `var(--as-density-control-padding-y) var(--as-density-control-padding-x)` | Internal form control padding |
| Table Row Height | `var(--as-density-table-row-height)` | Standardized table rows |
| Card Padding | `var(--as-density-card-padding)` | Internal card container padding |
| Container Radius | `var(--as-radius-lg)` | Cards, dialogs, popovers |
| Control Radius | `var(--as-radius-md)` | Buttons, inputs |

---

## 5. Practical Implementation Examples

### Example 1: Primary Action Button

```css
.as-button--primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--as-density-control-height);
  padding: var(--as-density-control-padding-y) var(--as-density-control-padding-x);
  background-color: var(--as-semantic-color-interactive-primary);
  color: var(--as-semantic-color-interactive-primary-text);
  font-family: var(--as-typography-font-family-sans);
  font-size: var(--as-typography-font-size-base);
  font-weight: var(--as-typography-font-weight-medium);
  border: var(--as-elevation-border-hairline) solid transparent;
  border-radius: var(--as-radius-md);
  cursor: pointer;
  text-decoration: none;
}

.as-button--primary:hover {
  background-color: var(--as-semantic-color-interactive-primary-hover);
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
  padding: var(--as-density-card-padding);
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
  font-family: var(--as-typography-font-family-sans);
  font-size: var(--as-typography-font-size-xs);
  line-height: var(--as-typography-line-height-normal);
}
```

### Example 3: High-Density Table Cell with Tabular Figures

```css
.as-table-row {
  height: var(--as-density-table-row-height);
  border-bottom: var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-subtle);
}

.as-table-cell--numeric {
  font-family: var(--as-typography-font-family-mono);
  font-size: var(--as-typography-font-size-sm);
  font-variant-numeric: tabular-nums;
  color: var(--as-semantic-color-text-default);
  text-align: right;
  padding: 0 var(--as-space-3);
}
```

---

## 6. Do's and Don'ts Checklist

- **DO** use `var(--as-semantic-color-text-default)` for primary copy and `var(--as-semantic-color-text-muted)` for captions.
- **DO** use `font-variant-numeric: tabular-nums` on financial, metric, or tabular data elements.
- **DO** support both light and dark modes effortlessly by relying solely on semantic tokens.
- **DO** use `var(--as-elevation-border-focus)` and `var(--as-semantic-color-border-focus)` for all keyboard focus states.
- **DON'T** use primitive color tokens like `var(--as-color-primitive-neutral-900)` in component CSS.
- **DON'T** invent custom margin/padding values; pick the closest step on the `--as-space-*` scale.
- **DON'T** rely on color alone to communicate state; always pair color with text, icons, or visible indicators.
