# Aster Link Component Contract

**Design System Alignment:** Aligns with [Design Principles](../principles.md) and [Token Architecture](../tokens.md).

---

## 1. Component Overview & Anatomy

The Aster Link is a native anchor for moving to another page or place. Use Button for actions.

```
Read the installation guide
```

### Anatomical Sub-Elements

1. **Link (`.as-link`):** A native `<a>` with an underline.
2. **Icon (`.as-link__icon`):** Optional, marks links that open another site.

---

## 2. Properties & Supported States

| State / Variant | Description | Token / Value Binding |
|---|---|---|
| Default | Underlined link | `var(--as-semantic-color-interactive-link)` |
| Muted (`.as-link--muted`) | For footers and metadata | `var(--as-semantic-color-text-muted)` |
| Hover | Thicker underline | text-decoration-thickness: 2px |
| Focus-Visible | 2px focus ring | `var(--as-semantic-color-border-focus)` |

---

## 3. Interaction & Keyboard Accessibility

- Native `<a href>`, so `Tab` reaches it and `Enter` activates it.
- The link text must make sense on its own, so avoid "click here".
- If a link opens a new tab, say so in its text or accessible name.

---

## 4. Canonical Token Bindings

| Property / Area | CSS Custom Property Binding |
|---|---|
| Text Color | `var(--as-semantic-color-interactive-link)` |
| Muted Text Color | `var(--as-semantic-color-text-muted)` |
| Focus Ring | `var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus)` |
| Corner Radius (Focus) | `var(--as-radius-sm)` |

---

## 5. Requirements & Classification Framework

### 5.1 Normative Requirements (WCAG 2.2 Level AA Mandates)
1. **Use of Color (SC 1.4.1 - Level A):** The underline identifies links without relying on color.
2. **Text Contrast (SC 1.4.3 - Level AA):** Link text needs ≥4.5:1 against its background.
3. **Link Purpose (SC 2.4.4 - Level A):** Link text describes where it goes.

### 5.2 Aster Conventions
- Links are underlined at rest in all contexts.

---

## 6. Scope Disclosure & Implementation Boundaries

> [!WARNING]
> Target size exceptions apply to links inside sentences. Standalone links in dense lists need their own review.
