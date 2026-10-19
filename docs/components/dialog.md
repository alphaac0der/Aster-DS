# Aster Design System — Dialog Component Specification

Canonical Component Contract for Aster Modal Dialogs.

---

## 1. Anatomy / Overview

The Dialog component presents critical information or asks for confirmation in a dedicated overlay layer that sits above the primary page content. It utilizes the native HTML `<dialog>` element combined with modal backdrop scrimming and focus trapping.

### Structure

```html
<dialog class="as-dialog" id="dlg-confirm-deploy" aria-labelledby="dlg-title" aria-describedby="dlg-desc">
  <div class="as-dialog__surface">
    <div class="as-dialog__header">
      <div>
        <h2 class="as-dialog__title" id="dlg-title">Trigger Fleet Rebalance</h2>
        <p class="as-dialog__description" id="dlg-desc">This action safely evicts pods and migrates workloads across availability zones.</p>
      </div>
      <button type="button" class="as-dialog__close" aria-label="Close dialog" data-dialog-close>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="4" x2="4" y2="12"></line><line x1="4" y1="4" x2="12" y2="12"></line></svg>
      </button>
    </div>
    <div class="as-dialog__body">
      <p>Node drain timeout is set to 300 seconds. Ensure high-priority services have at least 2 replica pods active.</p>
    </div>
    <div class="as-dialog__footer">
      <button type="button" class="as-button as-button--secondary as-button--compact" data-dialog-close>Cancel</button>
      <button type="button" class="as-button as-button--primary as-button--compact">Rebalance Fleet</button>
    </div>
  </div>
</dialog>
```

---

## 2. Properties / Variants Contract

| Element / Class | Type | Required | Description |
|---|---|---|---|
| `<dialog class="as-dialog">` | Element | Yes | Native HTML5 dialog container with modal attributes |
| `aria-labelledby` | String ID | Yes | Points to dialog title heading ID |
| `aria-describedby` | String ID | Recommended | Points to dialog body or subtitle description ID |
| `.as-dialog--compact` | Modifier Class | Optional | Activates compact density with tighter padding and smaller headings |
| `data-dialog-open="id"` | Attribute | Optional | Declarative trigger hook for opening the specified dialog modal |
| `data-dialog-close` | Attribute | Optional | Declarative trigger hook for closing the ancestor dialog |

### Density Modes
- **Comfortable (Default):** Spacious layout with `var(--as-space-5)` header/body padding and `var(--as-typography-font-size-lg)` title.
- **Compact (`.as-dialog--compact` / `[data-density="compact"]`):** Dense administrative layout with `var(--as-space-4)` padding and `var(--as-typography-font-size-md)` title.

---

## 3. Interaction & Accessibility

- **Native Modal Behavior:** Opens exclusively via `dialog.showModal()`, engaging browser native focus trapping and inert document layers behind the backdrop.
- **Escape Key Dismissal:** Pressing `Escape` dispatches the native `cancel` event and closes the dialog without page reload.
- **Backdrop Scrim:** Renders via `::backdrop` pseudo-element with subtle blur and ambient dimming. Clicking outside the dialog bounds dismisses the dialog.
- **Focus Management:** On modal open, focus is placed on the first interactive element or the dialog itself. Upon closure, focus returns to the invoking trigger button.
- **Accessible Labelling:** Every dialog must declare `aria-labelledby` pointing to its title element.

---

## 4. Canonical Token Bindings

```css
/* Background & Surface */
background-color: var(--as-semantic-color-surface-card);
color: var(--as-semantic-color-text-default);
border: var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-subtle);
border-radius: var(--as-radius-lg);
box-shadow: var(--as-elevation-shadow-overlay);

/* Typography */
font-family: var(--as-typography-font-family-sans);
font-size: var(--as-typography-font-size-base);
font-weight: var(--as-typography-font-weight-regular);
line-height: var(--as-typography-line-height-normal);

/* Header & Title */
font-size: var(--as-typography-font-size-lg);
font-weight: var(--as-typography-font-weight-semibold);
line-height: var(--as-typography-line-height-tight);

/* Description & Subtext */
color: var(--as-semantic-color-text-muted);

/* Spacing & Layout */
padding: var(--as-space-5);
gap: var(--as-space-3);

/* Focus Outline */
outline: var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus);
```

---

## 5. Requirements Classification

- **SHALL** use the native HTML `<dialog>` tag and invoke `dialog.showModal()` rather than generic non-modal `div` overlays.
- **SHALL** provide accessible `aria-labelledby` attributes pointing to valid heading IDs.
- **SHALL** trap keyboard focus within the modal while opened and restore focus to trigger upon closure.
- **SHALL** support dismissal via `Escape` key and backdrop click.
- **SHOULD** provide an explicit close button with accessible `aria-label="Close dialog"`.

---

## 6. Scope Disclosure & Boundaries

- Aster Dialog provides accessible modal structure and standard layout sections.
- Nested stacked dialogs (dialog-on-dialog) are not recommended per W3C APG guidelines; multi-step flows should be managed within a single dialog container.
