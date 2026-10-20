# Aster Progress Component Contract

**Design System Alignment:** Aligns with [Design Principles](../principles.md) and [Token Architecture](../tokens.md).

---

## 1. Component Overview & Anatomy

The Aster Progress component communicates the status of an ongoing, time-consuming operation in determinate or indeterminate form.

```
+-------------------------------------------------------------+
| Operation Label                                       [ 60% ] <-- Header Area
+-------------------------------------------------------------+
| [======                   ]                                 | <-- Progress Track & Bar
+-------------------------------------------------------------+
```

### Anatomical Sub-Elements

1. **Progress Field (`.as-progress-field`):** Layout wrapper containing header and bar.
2. **Track (`.as-progress`):** Outer track declaring `role="progressbar"`.
3. **Fill Bar (`.as-progress__bar`):** Inner bar indicating completion percentage.
4. **Value Label (`.as-progress-field__value`):** Tabular numeric percentage display.

---

## 2. Properties & Supported States

| State / Variant | Description | Token / Value Binding |
|---|---|---|
| Determinate | Explicit percentage fill (`--_progress`) | `var(--as-semantic-color-interactive-primary)` |
| Indeterminate | Continuously traveling pulse bar | `var(--as-semantic-color-interactive-primary)` |
| Success | Completed or successful operation | `var(--as-semantic-color-status-success-text)` |
| Warning | Degraded or throttled operation | `var(--as-semantic-color-status-warning-text)` |
| Critical | Failed or halted operation | `var(--as-semantic-color-status-critical-text)` |

---

## 3. Interaction & Keyboard Accessibility

- `role="progressbar"` with `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`.
- Indeterminate state omits `aria-valuenow` (as per W3C APG).
- Height: 8px standard height with full-pill radius.
- Reduced motion: Indeterminate animation freezes to a high-contrast 100% static bar under `prefers-reduced-motion: reduce`.

---

## 4. Canonical Token Bindings

| Property / Area | CSS Custom Property Binding |
|---|---|
| Track Background | `color-mix(in srgb, var(--as-semantic-color-text-default) 12%, transparent)` |
| Fill Bar Background | `var(--as-semantic-color-interactive-primary)` |
| Label Color | `var(--as-semantic-color-text-default)` |
| Value Color | `var(--as-semantic-color-text-muted)` |
| Border Radius | `var(--as-radius-full)` (9999px) |
| Transition Duration | `var(--as-motion-duration-slow)` |

---

## 5. Requirements & Classification Framework

### 5.1 Normative Requirements (WCAG 2.2 Level AA Mandates)
1. **Non-text Contrast (SC 1.4.11 - Level AA):** Progress bar achieves ≥3.0:1 contrast against track.
2. **Name, Role, Value (SC 4.1.2 - Level A):** `role="progressbar"` accurately communicates completion.

### 5.2 Aster Conventions
- Real-time CSS property `--_progress` synchronized smoothly via controller.

---

## 6. Scope Disclosure & Implementation Boundaries

> [!WARNING]
> Frequent real-time progress updates should not flood screen reader announcements. Announce milestones (e.g. 25%, 50%, 75%, 100%) via polite live regions rather than every single percentage change.
