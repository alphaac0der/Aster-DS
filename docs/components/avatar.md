# Aster Avatar Component Contract

**Design System Alignment:** Aligns with [Design Principles](../principles.md) and [Token Architecture](../tokens.md).

---

## 1. Component Overview & Anatomy

The Aster Avatar represents a person or team with a picture or initials.

```
  ( MC )•   <-- Initials with status dot
```

### Anatomical Sub-Elements

1. **Container (`.as-avatar`):** The circle. Use `role="img"` with an `aria-label` for initials.
2. **Image (`.as-avatar__image`):** A native `<img>` with useful `alt` text.
3. **Status Dot (`.as-avatar__status`):** Optional, and must be described in the accessible name.

---

## 2. Properties & Supported States

| State / Variant | Description | Token / Value Binding |
|---|---|---|
| Small (`.as-avatar--sm`) | 32px | `var(--as-space-8)` |
| Medium (default) | 40px | `var(--as-space-10)` |
| Large (`.as-avatar--lg`) | 48px | `var(--as-space-12)` |
| Status: online | Green dot | `var(--as-semantic-color-status-success-text)` |
| Status: away | Amber dot (`.as-avatar__status--away`) | `var(--as-semantic-color-status-warning-text)` |
| Status: busy | Red dot (`.as-avatar__status--busy`) | `var(--as-semantic-color-status-critical-text)` |
| Status: offline | Gray dot (`.as-avatar__status--offline`) | `var(--as-semantic-color-text-muted)` |

---

## 3. Interaction & Keyboard Accessibility

- An avatar isn't interactive. To make one clickable, wrap it in a native button or link with its own name.
- Status color isn't announced, so include status in the accessible name, such as "Maya Chen, online".
- Decorative avatars beside a visible name can use `alt=""` or `aria-hidden="true"`.

---

## 4. Canonical Token Bindings

| Property / Area | CSS Custom Property Binding |
|---|---|
| Background | `var(--as-semantic-color-surface-subtle)` |
| Initials Color | `var(--as-semantic-color-text-default)` |
| Status Border | `var(--as-semantic-color-surface-canvas)` |
| Border Radius | `var(--as-radius-full)` |

---

## 5. Requirements & Classification Framework

### 5.1 Normative Requirements (WCAG 2.2 Level AA Mandates)
1. **Non-text Content (SC 1.1.1 - Level A):** Images and initials have a text alternative.
2. **Use of Color (SC 1.4.1 - Level A):** Status is also available as text.
3. **Text Contrast (SC 1.4.3 - Level AA):** Initials need ≥4.5:1 against the avatar background.

### 5.2 Aster Conventions
- Aster provides three sizes on the spacing scale.

---

## 6. Scope Disclosure & Implementation Boundaries

> [!WARNING]
> Image loading, broken image fallback, and stacked avatar groups are not included.
