# Aster Card Component Contract

**Design System Alignment:** Aligns with [Design Principles](../principles.md) and [Token Architecture](../tokens.md).

---

## 1. Component Overview & Anatomy

The Aster Card groups related content in a raised container.

```
+----------------------------------+
| Title                            |
| Description                      |
|                                  |
| Body content                     |
|                                  |
| [Footer actions]                 |
+----------------------------------+
```

### Anatomical Sub-Elements

1. **Container (`.as-card`):** The raised surface.
2. **Header (`.as-card__header`):** Holds the title and description.
3. **Title (`.as-card__title`):** Use a heading element at the right page level.
4. **Description (`.as-card__description`):** Optional supporting text.
5. **Body (`.as-card__body`):** The main content.
6. **Footer (`.as-card__footer`):** Optional actions.

---

## 2. Properties & Supported States

| State / Variant | Description | Token / Value Binding |
|---|---|---|
| Default | Static container with no hover effect | `var(--as-semantic-color-surface-card)` |
| Interactive (`.as-card--interactive`) | The whole card is a link. Lifts on hover. | `var(--as-semantic-elevation-shadow-menu)` |
| Focus-Visible | Interactive cards only | `var(--as-semantic-color-border-focus)` |

---

## 3. Interaction & Keyboard Accessibility

- Default cards aren't focusable, and controls inside them follow normal tab order.
- For a fully clickable card, use `<a class="as-card as-card--interactive">`, and don't place other buttons or links inside it.
- Reduced motion removes the hover lift.

---

## 4. Canonical Token Bindings

| Property / Area | CSS Custom Property Binding |
|---|---|
| Surface | `var(--as-semantic-color-surface-card)` |
| Shadow | `var(--as-semantic-elevation-shadow-card)` |
| Title Color | `var(--as-semantic-color-text-default)` |
| Description Color | `var(--as-semantic-color-text-muted)` |
| Padding | `var(--as-space-6)` |
| Gap | `var(--as-space-4)` |
| Border Radius | `var(--as-radius-lg)` |

---

## 5. Requirements & Classification Framework

### 5.1 Normative Requirements (WCAG 2.2 Level AA Mandates)
1. **Text Contrast (SC 1.4.3 - Level AA):** Title and description need ≥4.5:1 against the card surface.
2. **Focus Visible (SC 2.4.7 - Level AA):** Interactive cards show a visible focus ring.
3. **Info and Relationships (SC 1.3.1 - Level A):** Card titles use real heading elements.

### 5.2 Aster Conventions
- Only interactive cards move on hover, because movement signals that something can be clicked.

---

## 6. Scope Disclosure & Implementation Boundaries

> [!WARNING]
> A card is a container with no behavior of its own. Sort, selection, and drag behavior aren't included.
