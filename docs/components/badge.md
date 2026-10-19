# Aster Badge Component Contract

**Status:** APPROVED PROPOSAL (Phase 10 — Batch B)  
**Design System Alignment:** Aligns with [Design Principles](../principles.md) and [DEC-013](../../records/DECISION-LOG.md).

---

## 1. Component Overview & Anatomy

The Aster Badge component provides a compact visual pill for status cues, count tags, and categorization labels.

```
+-------------------------------------------------------------+
| (•) Active Status                                           | <-- Badge with Dot
+-------------------------------------------------------------+
```

### Anatomical Sub-Elements

1. **Badge Container (`.as-badge`):** Full-pill inline flex container.
2. **Indicator Dot (`.as-badge__dot`):** Optional circular status cue.
3. **Badge Text:** Clear text label communicating state (never color alone).

---

## 2. Properties & Supported States

| State / Variant | Description | Token / Value Binding |
|---|---|---|
| Default | Text default tint | `var(--as-semantic-color-text-default)` |
| Muted | Text muted tint | `var(--as-semantic-color-text-muted)` |
| Success / Active | Success status tint | `var(--as-semantic-color-status-success-text)` |
| Warning / Pending | Warning status tint | `var(--as-semantic-color-status-warning-text)` |
| Critical / Error | Critical status tint | `var(--as-semantic-color-status-critical-text)` |
| Info | Primary interactive tint | `var(--as-semantic-color-interactive-primary)` |

---

## 3. Interaction & Keyboard Accessibility

- Non-interactive presentation: Badges do not receive keyboard tab focus.
- Non-color-alone rule: Badges always pair color tints with text copy or accessible labels.
- Standard density: 24px height with full-pill radius.

---

## 4. Canonical Token Bindings

| Property / Area | CSS Custom Property Binding |
|---|---|
| Background Surface | `var(--as-semantic-color-surface-card)` |
| Text / Dot Color | `var(--as-semantic-color-text-default)` / `var(--as-semantic-color-status-success-text)` |
| Border Radius | `var(--as-radius-full)` (9999px) |
| Font Size | `var(--as-typography-font-size-xs)` (12px) |

---

## 5. Requirements & Classification Framework

### 5.1 Normative Requirements (WCAG 2.2 Level AA Mandates)
1. **Non-color-alone (SC 1.4.1 - Level A):** Information conveyed by color is also available in text.
2. **Text Contrast (SC 1.4.3 - Level AA):** Text meets ≥4.5:1 contrast against badge fill.

### 5.2 Aster Conventions
- Subtle translucent border via `color-mix(in srgb, currentColor 24%, transparent)` maintains edge definition across light and dark modes.

---

## 6. Scope Disclosure & Implementation Boundaries

> [!WARNING]
> Badges used as interactive filters should be implemented as filter buttons or checkboxes with badge styling, not plain static badge spans.
