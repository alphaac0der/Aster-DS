# Aster Design System — Dropdown Menu Component Specification

Canonical Component Contract for Aster Dropdown Menus.

---

## 1. Anatomy / Overview

The Dropdown Menu component displays a list of contextual actions or options triggered by a button. It strictly implements the W3C WAI-ARIA Authoring Practices Guide (APG) Menu Button pattern with keyboard roving navigation and outside-click dismissal.

### Structure

```html
<div class="as-dropdown" id="dd-actions">
  <button type="button" class="as-button as-button--secondary as-dropdown__trigger" id="dd-trigger-1" aria-haspopup="menu" aria-expanded="false">
    <span class="as-button__label">Cluster Actions</span>
    <svg class="as-dropdown__chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 6 8 10 12 6"></polyline></svg>
  </button>
  <div class="as-dropdown__menu" role="menu" aria-labelledby="dd-trigger-1" hidden>
    <button type="button" class="as-dropdown__item" role="menuitem">Restart Node Pods</button>
    <button type="button" class="as-dropdown__item" role="menuitem">Export Telemetry</button>
    <div class="as-dropdown__divider" role="separator"></div>
    <button type="button" class="as-dropdown__item as-dropdown__item--destructive" role="menuitem">Drain Node Pool</button>
  </div>
</div>
```

---

## 2. Properties / Variants Contract

| Element / Class | Type | Required | Description |
|---|---|---|---|
| `.as-dropdown` | Container | Yes | Positioning anchor wrapper for trigger and floating menu |
| `.as-dropdown__trigger` | Button | Yes | Interactive trigger declaring `aria-haspopup="menu"` and `aria-expanded` |
| `.as-dropdown__menu` | Overlay | Yes | Floating menu container with `role="menu"` and `aria-labelledby` |
| `.as-dropdown__item` | Interactive | Yes | Action item declaring `role="menuitem"` |
| `.as-dropdown__item--destructive` | Modifier | Optional | High-contrast critical red treatment for dangerous actions |
| `.as-dropdown__divider` | Divider | Optional | Visual separator rule with `role="separator"` |
| `.as-dropdown__menu--right` | Modifier | Optional | Right-aligns floating menu to the trigger's right edge |
| `.as-dropdown--compact` | Modifier | Optional | Compact density mode with tighter padding and smaller font |

### Density Modes
- **Comfortable (Default):** Menu items receive `var(--as-space-2) var(--as-space-3)` padding and `var(--as-typography-font-size-base)`.
- **Compact (`.as-dropdown--compact` / `[data-density="compact"]`):** Menu items receive `var(--as-space-1) var(--as-space-2)` padding and `var(--as-typography-font-size-sm)`.

---

## 3. Interaction & Accessibility

- **Keyboard Navigation (W3C APG):**
  - **Down Arrow / Enter / Space:** Opens the menu and moves focus to the first item.
  - **Up Arrow:** Opens the menu and moves focus to the last item.
  - **Down Arrow (within menu):** Moves focus to the next enabled menu item (wrapping from last to first).
  - **Up Arrow (within menu):** Moves focus to the previous enabled menu item (wrapping from first to last).
  - **Home / End:** Moves focus directly to first / last menu item.
  - **Escape:** Closes menu and returns focus cleanly to the trigger button.
  - **Tab:** Closes menu immediately.
- **Pointer Interaction:** Clicking trigger toggles menu; clicking any menu item activates it and closes the menu; clicking anywhere outside light-dismisses the menu.
- **ARIA Semantics:** Trigger has `aria-haspopup="menu"` and dynamically updates `aria-expanded="true/false"`.

---

## 4. Canonical Token Bindings

```css
/* Surface & Border */
background-color: var(--as-semantic-color-surface-card);
border: var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-subtle);
border-radius: var(--as-radius-md);
box-shadow: var(--as-elevation-shadow-raised);

/* Item Typography & Spacing */
font-family: var(--as-typography-font-family-sans);
font-size: var(--as-typography-font-size-base);
font-weight: var(--as-typography-font-weight-regular);
line-height: var(--as-typography-line-height-normal);
color: var(--as-semantic-color-text-default);
padding: var(--as-space-2) var(--as-space-3);
gap: var(--as-space-2);
border-radius: var(--as-radius-sm);

/* Hover & Focus States */
background-color: var(--as-semantic-color-surface-muted);

/* Destructive Action */
color: var(--as-semantic-color-status-critical-text);

/* Divider */
height: var(--as-elevation-border-hairline);
background-color: var(--as-semantic-color-border-subtle);
margin: var(--as-space-1) 0;
```

---

## 5. Requirements Classification

- **SHALL** set `aria-haspopup="menu"` and toggle `aria-expanded="true/false"` on the trigger.
- **SHALL** implement ArrowUp/ArrowDown roving focus cycling inside the menu.
- **SHALL** dismiss on `Escape` and return focus to the trigger button.
- **SHALL** dismiss on outside clicks.
- **SHOULD** use `.as-dropdown__item--destructive` for destructive or irreversible actions.

---

## 6. Scope Disclosure & Boundaries

- Aster Dropdown Menu is designed for single-level action menus. Cascading flyout submenus are deliberately not supported to preserve mobile touch and screen-reader ergonomics.
