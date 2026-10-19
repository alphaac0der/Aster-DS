# Aster Design System — Drawer Component Specification

Canonical Component Contract for Aster Slide-Over Drawers.

---

## 1. Anatomy / Overview

The Drawer component is a full-height side panel overlay that slides in from the edge of the screen. It is utilized for deep configuration forms, rich entity detail inspection, and contextual supplementary panels while preserving background application context through an accessible scrim.

### Structure

```html
<div class="as-drawer" id="drawer-telemetry" role="dialog" aria-modal="true" aria-labelledby="drawer-tel-title" hidden>
  <div class="as-drawer__backdrop" data-drawer-close></div>
  <div class="as-drawer__panel as-drawer__panel--right">
    <div class="as-drawer__header">
      <div>
        <h2 class="as-drawer__title" id="drawer-tel-title">Telemetry Stream Settings</h2>
        <p class="as-drawer__description">Configure sampling frequency and egress filters.</p>
      </div>
      <button type="button" class="as-drawer__close" aria-label="Close drawer" data-drawer-close>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="4" x2="4" y2="12"></line><line x1="4" y1="4" x2="12" y2="12"></line></svg>
      </button>
    </div>
    <div class="as-drawer__body">
      <p>Configure metrics ingestion pipelines and alerting thresholds.</p>
    </div>
    <div class="as-drawer__footer">
      <button type="button" class="as-button as-button--secondary" data-drawer-close>Dismiss</button>
      <button type="button" class="as-button as-button--primary">Save Configuration</button>
    </div>
  </div>
</div>
```

---

## 2. Properties / Variants Contract

| Element / Class | Type | Required | Description |
|---|---|---|---|
| `.as-drawer` | Root Overlay | Yes | Fixed viewport container declaring `role="dialog"`, `aria-modal="true"`, and `hidden` |
| `.as-drawer__backdrop` | Backdrop | Yes | Fullscreen scrim background; clicking dismisses the drawer |
| `.as-drawer__panel` | Surface | Yes | Slide-over content sheet surface |
| `.as-drawer__panel--right` | Position Modifier | Optional | Slides panel in from the right edge (default) |
| `.as-drawer__panel--left` | Position Modifier | Optional | Slides panel in from the left edge |
| `data-drawer-open="id"` | Attribute | Optional | Declarative trigger hook for opening the specified drawer |
| `data-drawer-close` | Attribute | Optional | Declarative trigger hook for closing the drawer |

### Layout & Density
- **Standard Density:** Follows canonical slide-over sheet geometry with `var(--as-space-5)` padding, standard action controls, and responsive edge anchoring.

---

## 3. Interaction & Accessibility

- **Modal Scrim & Focus Trapping:** When open, keyboard focus is trapped strictly within the drawer panel. Pressing `Tab` or `Shift+Tab` cycles circularly between first and last focusable elements.
- **Escape Key Dismissal:** Pressing `Escape` closes the drawer and automatically restores focus to the element that triggered it.
- **Backdrop Click Dismissal:** Clicking the backdrop scrim closes the drawer.
- **ARIA Semantics:** Declares `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing to the drawer title element.

---

## 4. Canonical Token Bindings

```css
/* Surface & Border */
background-color: var(--as-semantic-color-surface-card);
color: var(--as-semantic-color-text-default);
border-left: var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-subtle);
box-shadow: var(--as-elevation-shadow-overlay);

/* Typography */
font-family: var(--as-typography-font-family-sans);
font-size: var(--as-typography-font-size-base);
line-height: var(--as-typography-line-height-normal);

/* Header & Title */
font-size: var(--as-typography-font-size-lg);
font-weight: var(--as-typography-font-weight-semibold);
line-height: var(--as-typography-line-height-tight);

/* Description & Subtext */
color: var(--as-semantic-color-text-muted);

/* Footer Surface */
background-color: var(--as-semantic-color-surface-subtle);
border-top: var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-subtle);

/* Focus Outline */
outline: var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus);

/* Spacing */
padding: var(--as-space-5);
gap: var(--as-space-2);
```

---

## 5. Requirements Classification

- **SHALL** declare `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` on the root container.
- **SHALL** trap keyboard focus within the drawer while open.
- **SHALL** restore focus to the triggering element upon closure.
- **SHALL** support dismissal via `Escape` and backdrop click.
- **SHOULD** provide an explicit close button with accessible `aria-label="Close drawer"`.

---

## 6. Scope Disclosure & Boundaries

- Aster Drawer handles lateral sheet presentation. Complex multi-level nested drawers are not supported to avoid overwhelming mobile screens and screen-reader context.
