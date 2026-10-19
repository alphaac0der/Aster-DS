# Aster Skeleton Component Contract

**Status:** APPROVED PROPOSAL (Phase 10 — Batch B)  
**Governance:** Aligns with [`governance/SOUL.md`](../../governance/SOUL.md), [`governance/WORKFLOW.md`](../../governance/WORKFLOW.md), and DEC-013.

---

## 1. Component Overview & Anatomy

The Aster Skeleton component renders placeholder shapes to reduce perceived latency while asynchronous data loads.

```
+-------------------------------------------------------------+
| ( O )  [===========================]                        | <-- Avatar + Text Skeleton
|        [================]                                   | <-- Subtitle Skeleton
+-------------------------------------------------------------+
```

### Anatomical Sub-Elements

1. **Skeleton Container (`.as-skeleton`):** Placeholder block with subtle shimmer wave.
2. **Variants:** `.as-skeleton--text`, `.as-skeleton--avatar`, `.as-skeleton--button`, `.as-skeleton--card`.

---

## 2. Properties & Supported States

| State / Variant | Description | Token / Value Binding |
|---|---|---|
| Text | Line placeholder (14px height) | `var(--as-radius-sm)` |
| Avatar | Circular placeholder (40px) | `var(--as-radius-full)` |
| Button | Pill placeholder (40px) | `var(--as-radius-full)` |
| Card | Box placeholder (120px) | `var(--as-radius-lg)` |

---

## 3. Interaction & Keyboard Accessibility

- Hidden from assistive technology: Declares `aria-hidden="true"`.
- Parent region declares `aria-busy="true"` until loaded.
- Reduced motion: Shimmer wave is disabled under `prefers-reduced-motion: reduce`.
- Density modes: Adheres to comfortable (40px button/control placeholders) and compact (32px button/control placeholders) density scaling.

---

## 4. Canonical Token Bindings

| Property / Area | CSS Custom Property Binding |
|---|---|
| Base Tint | `color-mix(in srgb, var(--as-semantic-color-text-default) 8%, transparent)` |
| Shimmer Color | `color-mix(in srgb, var(--as-semantic-color-surface-card) 25%, transparent)` |
| Border Radius (Default) | `var(--as-radius-sm)` |
| Density Modes | `comfortable` (40px) / `compact` (32px) |

---

## 5. Requirements & Classification Framework

### 5.1 Normative Requirements (WCAG 2.2 Level AA Mandates)
1. **Screen Reader Suppression:** Skeletons must not announce uninformative placeholder shapes to assistive technologies.
2. **Animation Discipline:** Shimmer animation does not exceed 3 flashes per second (WCAG SC 2.3.1).

### 5.2 Aster Conventions
- Restrained opacity avoiding loud or distracting pulses.

---

## 6. Scope Disclosure & Implementation Boundaries

> [!WARNING]
> Skeletons are strictly visual loading cues. Application logic must remove `aria-busy` and render accessible live content once API responses resolve.
