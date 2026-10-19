# Aster Toast Component Contract

**Status:** APPROVED PROPOSAL (Phase 10 — Batch B)  
**Governance:** Aligns with [`governance/SOUL.md`](../../governance/SOUL.md), [`governance/WORKFLOW.md`](../../governance/WORKFLOW.md), and DEC-013.

---

## 1. Component Overview & Anatomy

The Aster Toast component renders floating, ephemeral status notifications in response to user actions or asynchronous events.

```
+-------------------------------------------------------------+
| [✓]  Changes successfully saved                         [X] | <-- Toast Box
|      Cluster configuration rolled out to 3 availability     | <-- Message
+-------------------------------------------------------------+
```

### Anatomical Sub-Elements

1. **Toast Container (`.as-toast-container`):** Fixed layout container (`role="region"`).
2. **Toast Box (`.as-toast`):** Elevated card declaring `role="status"` or `role="alert"`.
3. **Content (`.as-toast__content`):** Title and message body.
4. **Dismiss Button (`.as-toast__close`):** Manual dismissal button.

---

## 2. Properties & Supported States

| State / Variant | Description | Token / Value Binding |
|---|---|---|
| Info | Interactive brand accent | `var(--as-semantic-color-interactive-primary)` |
| Success | Success status accent | `var(--as-semantic-color-status-success-text)` |
| Warning | Warning status accent | `var(--as-semantic-color-status-warning-text)` |
| Critical | Critical error accent | `var(--as-semantic-color-status-critical-text)` |

---

## 3. Interaction & Keyboard Accessibility

- Does not steal keyboard focus when appearing.
- Auto-dismiss timer pauses when hovered or focused.
- Screen readers announce toasts via `role="status"` (`aria-live="polite"`) or `role="alert"` (`aria-live="assertive"`).
- Dismiss button is reachable via Tab and activated via Enter/Space.
- Density modes: Toast paddings and button sizes adjust cleanly between comfortable and compact densities.

---

## 4. Canonical Token Bindings

| Property / Area | CSS Custom Property Binding |
|---|---|
| Background Surface | `var(--as-semantic-color-surface-card)` |
| Border | `var(--as-semantic-color-border-strong)` |
| Title Color | `var(--as-semantic-color-text-default)` |
| Message Color | `var(--as-semantic-color-text-muted)` |
| Focus Ring | `var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus)` |
| Density Modes | `comfortable` / `compact` |
| Transition Duration | `var(--as-motion-duration-slow)` |

---

## 5. Requirements & Classification Framework

### 5.1 Normative Requirements (WCAG 2.2 Level AA Mandates)
1. **Timing Adjustable (SC 2.2.1 - Level A):** Users can pause or extend dismissal timers on hover/focus.
2. **Status Messages (SC 4.1.3 - Level AA):** Status messages presented without receiving focus.

### 5.2 Aster Conventions
- Fixed position bottom-right with 24px inset (`var(--as-space-6)`).

---

## 6. Scope Disclosure & Implementation Boundaries

> [!WARNING]
> Critical errors that prevent task completion should use modal Dialogs or inline Alerts rather than ephemeral Toasts that disappear.
