# Aster Design System — Popover Component Specification

Canonical Component Contract for Aster Popovers.

---

## 1. Anatomy / Overview

The Popover component displays transient rich content or secondary interactive forms directly anchored to a trigger control. Unlike modal dialogs, popovers are non-modal overlays that allow users to view context without interrupting the underlying document flow.

### Structure

```html
<div class="as-popover-anchor" id="pop-filter-wrapper">
  <button type="button" class="as-button as-button--secondary as-popover-trigger" id="pop-filter-btn" aria-haspopup="dialog" aria-expanded="false">
    <span class="as-button__label">Filter Pods</span>
  </button>
  <div class="as-popover" id="pop-filter-panel" role="dialog" aria-labelledby="pop-filter-btn" hidden>
    <div class="as-popover__header">
      <h3 class="as-popover__title">Filter Options</h3>
    </div>
    <div class="as-popover__body">
      <p style="margin: 0;">Show active worker pods only.</p>
    </div>
  </div>
</div>
```

---

## 2. Properties / Variants Contract

| Element / Class | Type | Required | Description |
|---|---|---|---|
| `.as-popover-anchor` | Container | Yes | Relative positioning wrapper for anchor and floating card |
| `.as-popover-trigger` | Interactive | Yes | Trigger button declaring `aria-haspopup="dialog"` and `aria-expanded` |
| `.as-popover` | Overlay | Yes | Floating overlay container with `role="dialog"` and `aria-labelledby` |
| `.as-popover--right` | Modifier | Optional | Positions popover aligned to trigger's right edge |

### Layout & Density
- **Standard Density:** Follows standard popover geometry with `var(--as-space-4)` body padding, 8px radius, and standard action buttons.

---

## 3. Interaction & Accessibility

- **Light Dismissal:** Clicking anywhere outside the active popover immediately closes it.
- **Escape Dismissal:** Pressing `Escape` while focus is inside the popover closes it and restores focus directly to the trigger button.
- **ARIA Semantics:** Declares `role="dialog"` and links to trigger via `aria-labelledby`. The trigger dynamically reflects state with `aria-expanded="true/false"`.
- **Reduced Motion:** Entrance translation and fade animations collapse when `prefers-reduced-motion: reduce` is enabled.

---

## 4. Canonical Token Bindings

```css
/* Surface & Border */
background-color: var(--as-semantic-color-surface-card);
color: var(--as-semantic-color-text-default);
border: var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-subtle);
border-radius: var(--as-radius-lg);
box-shadow: var(--as-elevation-shadow-overlay);

/* Typography */
font-family: var(--as-typography-font-family-sans);
font-size: var(--as-typography-font-size-base);
line-height: var(--as-typography-line-height-normal);

/* Header & Title */
font-size: var(--as-typography-font-size-sm);
font-weight: var(--as-typography-font-weight-semibold);
line-height: var(--as-typography-line-height-tight);

/* Spacing */
padding: var(--as-space-4);
margin: var(--as-space-2) 0 0;
```

---

## 5. Requirements Classification

- **SHALL** declare `aria-haspopup="dialog"` on the trigger element.
- **SHALL** maintain `aria-expanded="true/false"` synchronization.
- **SHALL** support light dismissal on outside click and `Escape` key.
- **SHALL** restore focus to trigger when closed via `Escape`.
- **SHOULD** provide an accessible label or title linking to the trigger.

---

## 6. Scope Disclosure & Boundaries

- Aster Popover is designed for compact inline forms and context panels. For full modal workflows requiring user confirmation or multi-step wizard processes, use the Dialog component instead.
