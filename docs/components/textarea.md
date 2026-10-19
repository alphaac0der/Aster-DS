# Aster Textarea Component Contract

**Status:** APPROVED PROPOSAL (Phase 10 — Batch A)  
**Governance:** Aligns with [`governance/SOUL.md`](../../governance/SOUL.md), [`governance/WORKFLOW.md`](../../governance/WORKFLOW.md), and DEC-013.

---

## 1. Component Overview & Anatomy

The Aster Textarea component provides a multi-line plain text editing control for descriptions, feedback, and notes.

```
+-------------------------------------------------------------+
| Label Text *                                                | <-- Label Area
+-------------------------------------------------------------+
| Multi-line text input content...                            | <-- Control Area
|                                                             |
|                                         128 / 500 chars     | <-- Counter Footer
+-------------------------------------------------------------+
| Helper or error validation message                          | <-- Feedback
+-------------------------------------------------------------+
```

### Anatomical Sub-Elements

1. **Field Container (`.as-form-field`):** Standard form field wrapper.
2. **Field Label (`.as-form-field__label`):** Explicit `<label for="id">`.
3. **Control Box (`.as-textarea-box`):** Card-elevated boundary container.
4. **Native Textarea (`.as-textarea`):** HTML `<textarea>` receiving focus and input.
5. **Character Counter (`.as-textarea__counter`):** Optional count display.
6. **Helper / Error Elements:** Associated via `aria-describedby`.

---

## 2. Properties & Supported States

| State / Variant | Description | Token / Value Binding |
|---|---|---|
| Default | Card background with strong border | `var(--as-semantic-color-surface-card)` / `var(--as-semantic-color-border-strong)` |
| Hover | High contrast border highlight | `var(--as-semantic-color-text-default)` |
| Focus-Visible | High contrast 2px focus outline | `var(--as-semantic-color-border-focus)` |
| Disabled | Muted surface with not-allowed cursor | `var(--as-semantic-color-surface-muted)` |
| Invalid / Error | Critical status border and outline | `var(--as-semantic-color-status-critical-text)` |

---

## 3. Interaction & Keyboard Accessibility

- Explicit `<label for="id">` association.
- Dynamic error priority ordering in `aria-describedby` (`error-id helper-id`).
- Supports automatic height adjustment with `data-auto-resize`.
- Keyboard navigation: standard multi-line editing (`Enter` inserts newline, `Tab` exits field).

---

## 4. Canonical Token Bindings

| Property / Area | CSS Custom Property Binding |
|---|---|
| Background (Rest) | `var(--as-semantic-color-surface-card)` |
| Background (Disabled) | `var(--as-semantic-color-surface-muted)` |
| Border (Rest) | `var(--as-semantic-color-border-strong)` |
| Border (Hover) | `var(--as-semantic-color-text-default)` |
| Focus Outline | `var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus)` |
| Error Border | `var(--as-semantic-color-status-critical-text)` |
| Text Color | `var(--as-semantic-color-text-default)` |
| Placeholder / Counter | `var(--as-semantic-color-text-muted)` |
| Border Radius | `var(--as-radius-md)` (8px) |
| Transition Duration | `var(--as-motion-duration-base)` |
| Transition Easing | `var(--as-motion-ease-out)` |

---

## 5. Requirements & Classification Framework

### 5.1 Normative Requirements (WCAG 2.2 Level AA Mandates)
1. **Text Contrast (SC 1.4.3 - Level AA):** Text and placeholder achieve required contrast against card surface.
2. **Non-text Contrast (SC 1.4.11 - Level AA):** Box border meets ≥3.0:1 contrast against canvas.
3. **Focus Visible (SC 2.4.7 - Level A):** High-contrast 2px focus ring renders unobscured.
4. **Name, Role, Value (SC 4.1.2 - Level A):** Accessible name bound via explicit `<label for>`.

### 5.2 Aster Conventions
- Persistent static label above the textarea (no floating labels).
- Minimum height 84px comfortable, 64px compact.

---

## 6. Scope Disclosure & Implementation Boundaries

> [!WARNING]
> Multi-line layout reflow and spellcheck/autocorrect behavior vary across user agents and require manual verification on target browsers.
