# Aster Design System — Accordion Component Specification

Canonical Component Contract for Aster Disclosure Accordions.

---

## 1. Anatomy / Overview

The Accordion component displays stacked collapsible disclosure panels that expand and collapse upon interaction. It implements the W3C WAI-ARIA Authoring Practices Guide (APG) Accordion Pattern, supporting multi-expand or single-expand mode with keyboard navigation.

### Structure

```html
<div class="as-accordion" id="acc-deployment-details" data-single="false">
  <div class="as-accordion__item">
    <h3 class="as-accordion__heading">
      <button type="button" class="as-accordion__trigger" id="acc-trig-rollout" aria-expanded="false" aria-controls="acc-panel-rollout">
        <span class="as-accordion__title">Zero-Downtime Rollout Strategy</span>
        <svg class="as-accordion__chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 6 8 10 12 6"></polyline></svg>
      </button>
    </h3>
    <div class="as-accordion__panel" id="acc-panel-rollout" role="region" aria-labelledby="acc-trig-rollout" hidden>
      <div class="as-accordion__content">
        Pods are drained gracefully with health probe verification before terminating existing replicas.
      </div>
    </div>
  </div>
</div>
```

---

## 2. Properties / Variants Contract

| Element / Class | Type | Required | Description |
|---|---|---|---|
| `.as-accordion` | Container | Yes | Wrapper encompassing accordion items |
| `data-single="true/false"` | Attribute | Optional | When `"true"`, expanding an item collapses other items |
| `.as-accordion__item` | Section | Yes | Individual expandable panel item container |
| `.as-accordion__heading` | Heading | Yes | Native heading element (`<h3>`, `<h4>`) wrapping the trigger |
| `.as-accordion__trigger` | Button | Yes | Interactive button declaring `aria-expanded` and `aria-controls` |
| `.as-accordion__panel` | Region | Yes | Collapsible panel container declaring `role="region"`, `aria-labelledby`, and `hidden` |

### Standard Geometry & Spacing
Accordion items adhere to Aster's unified Standard density scale. Triggers receive `var(--as-space-4) 0` vertical padding and `var(--as-typography-font-size-base)`.

---

## 3. Interaction & Accessibility

- **Keyboard Navigation (W3C APG):**
  - **Enter / Space:** Toggles the expansion state of the focused accordion panel.
  - **Down Arrow:** Moves focus to the next accordion header button.
  - **Up Arrow:** Moves focus to the previous accordion header button.
  - **Home / End:** Moves focus to the first or last accordion header button.
- **ARIA Semantics:** Trigger declares `aria-expanded="true/false"` and `aria-controls="panel-id"`. The panel declares `role="region"` and `aria-labelledby="trigger-id"`.
- **Heading Semantics:** Each trigger is wrapped in an appropriate semantic heading element (e.g. `<h3>`) for assistive technology screen reader navigation.

---

## 4. Canonical Token Bindings

```css
/* Typography & Text */
font-family: var(--as-typography-font-family-sans);
font-size: var(--as-typography-font-size-base);
font-weight: var(--as-typography-font-weight-medium);
line-height: var(--as-typography-line-height-tight);
color: var(--as-semantic-color-text-default);

/* Panel Subtext */
color: var(--as-semantic-color-text-muted);
line-height: var(--as-typography-line-height-normal);

/* Hover & Active */
color: var(--as-semantic-color-interactive-primary);

/* Border Dividers */
border-top: var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-subtle);
border-bottom: var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-subtle);

/* Focus Outline */
outline: var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus);

/* Spacing */
padding: var(--as-space-4) 0;
```

---

## 5. Requirements Classification

- **SHALL** wrap triggers inside semantic HTML heading elements (`<h3>`, `<h4>`, etc.).
- **SHALL** declare `aria-expanded` and `aria-controls` on each trigger button.
- **SHALL** assign `role="region"` and `aria-labelledby` to each disclosure panel.
- **SHALL** support Up/Down Arrow keyboard navigation across accordion headers.
- **SHOULD** provide smooth chevron rotation feedback upon toggle.

---

## 6. Scope Disclosure & Boundaries

- Aster Accordion supports both independent multi-expand behavior and mutually exclusive single-expand behavior via `data-single="true"`.
