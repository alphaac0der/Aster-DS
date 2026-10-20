# Aster Input / Form Field Component Contract

**Design System Alignment:** Aligns with [Design Principles](../principles.md) and [Token Architecture](../tokens.md).

---

## 1. Component Overview & Field Anatomy

The Aster Input / Form Field component contract specifies the structural, dimensional, visual, and accessibility requirements for single-line text inputs and associated form controls.

Aster form fields follow an **HTML-first, composite field anatomy** that guarantees explicit association between the interactive input, its visible label, auxiliary helper text, and validation feedback.

```
+-------------------------------------------------------------+
| Label Text *                     [Optional Badge / Cue]     | <-- Field Label Area
+-------------------------------------------------------------+
| [Leading Affix]  |  Input Value / Placeholder  |  [Trailing] | <-- Control Container
+-------------------------------------------------------------+
| [!] Error message text (Critical)                           | <-- Validation Feedback
| Supporting helper description or formatting instruction      | <-- Helper Text Area
+-------------------------------------------------------------+
```

### Anatomical Sub-Elements

1. **Field Container (`.as-form-field`):**
   - Vertical flex or block container establishing the layout context and spacing for all child elements.
2. **Field Label (`.as-form-field__label`):**
   - Native `<label>` element with an explicit `for` attribute referencing the input's `id`.
   - Never replaced by or omitted in favor of placeholder text.
3. **Required / Optional Indicator:**
   - **Required:** Marked visually with an asterisk (`*`) or text badge, accompanied by native `required` and `aria-required="true"` on the input.
   - **Optional:** Marked visually with subtle text (e.g., `(optional)`) where required fields are the prevailing default.
4. **Control Container (`.as-input-box`):**
   - Visual container holding the native `<input>` element and optional leading/trailing affixes.
   - Provides the interactive boundary, border, and background fill.
   - May display a container-level highlight via `:focus-within`, but must **never** obscure, suppress, or substitute for the distinct focus indication of individual interactive child controls.
5. **Interactive Input Element (`.as-input`):**
   - Native HTML `<input>` element (`type="text"`, `type="email"`, etc.) receiving user input and focus.
   - Maintains an independent, clearly visible focus indicator when focused via keyboard navigation.
6. **Affixes (Leading / Trailing):**
   - Visual cues such as currency symbols, search icons, unit labels, password visibility toggles, or error warning icons.
   - Non-interactive icons are hidden from assistive technology (`aria-hidden="true"`).
   - Interactive controls (e.g. clear button, visibility toggle) must be native `<button type="button">` elements with explicit accessible names and their own distinct visible focus rings when focused.
7. **Helper Description Text (`.as-form-field__helper`):**
   - Supporting guidance, formatting hints, or character constraints.
   - Programmatically linked to the input via `aria-describedby` referencing an existing, rendered DOM ID.
8. **Validation Error Message (`.as-form-field__error`):**
   - Text message communicating why the entered data is invalid and how to correct it.
   - Programmatically linked to the input via `aria-describedby` referencing an existing, rendered DOM ID.
   - Note that `aria-describedby` provides programmatic association upon focus, but does not announce newly appearing errors during active input; announcing newly appearing errors requires scenario-dependent strategies (e.g. deliberate focus management on form submission vs. live regions where appropriate, without stealing focus during field-level validation).

---

## 2. Properties & Supported States

### Properties Contract

| Property | Type | Default | Required? | Description |
|---|---|---|---|---|
| `id` | `string` | — | **Mandatory** | Unique DOM ID linking the input to `<label for="...">` and `aria-describedby`. |
| `name` | `string` | — | Required (Forms) | Form control name submitted with form data. |
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'search' \| 'tel' \| 'url'` | `'text'` | Optional | Native input type optimizing virtual keyboards and browser validation. |
| `value` | `string` | — | Optional | Current text value of the input. |
| `placeholder` | `string` | — | Optional | Transient hint showing expected format. Never a substitute for `<label>`. |
| `required` | `boolean` | `false` | Optional | Native HTML required attribute. Signals mandatory input. |
| `disabled` | `boolean` | `false` | Optional | Native HTML disabled state. Completely suppresses focus and form submission. |
| `readOnly` | `boolean` | `false` | Optional | Native HTML readonly state. Suppresses editing while retaining focus and selection. |
| `invalid` | `boolean` | `false` | Optional | Communicates validation failure. Sets `aria-invalid="true"` on the input. |
| `aria-describedby` | `string` | — | Conditional | Space-separated list referencing helper and/or error element IDs rendered in the DOM. |

### Supported Visual States

Form inputs must define explicit, distinct visual expressions across all supported states:

1. **`default` (Resting):**
   - High-contrast card surface background, neutral strong border meeting 3:1 non-text contrast against canvas/card, and dark body text.
2. **`hover`:**
   - Visual border prominence increases, providing clear affordance on mouse hover without altering dimensions.
3. **`focus-visible` (Focus Behavior):**
   - **Wrapper Highlight (`:focus-within`):** The input box container may display a boundary focus ring (`var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus)`).
   - **Individual Child Control Focus (Mandatory):** Every keyboard-focusable element inside the wrapper (the native `<input>` and any trailing/leading `<button>` elements) must retain an individual, distinct visible focus indicator. The wrapper's focus styling must not obscure or replace the active control's focus indicator.
4. **`invalid` (Validation Error):**
   - Control border shifts to critical status color (`var(--as-semantic-color-status-critical-text)`).
   - Paired with an error icon and descriptive text message (`.as-form-field__error`).
   - Must never communicate error state through color alone.
5. **`disabled`:**
   - Diminished optical weight, muted background, muted text, subtle border, and `cursor: not-allowed;`.
   - Removed from keyboard tab navigation; values are excluded from standard form submission.
6. **`readonly`:**
   - Subtle tinted background, subtle border, default text color, and standard cursor.
   - Retains keyboard focusability and text selection; values are included in standard form submission.

---

## 3. Standard Density & Dimensions

Form fields adhere to Aster's unified Standard density architecture:

| Dimensional Attribute | Standard Value | Canonical Token Binding |
|---|---|---|
| **Control Height** | `44px` | Canonical Form Input Geometry |
| **Vertical Padding** | `10px` | Internal Control Centering |
| **Horizontal Padding** | `12px` (left) / `36px` (right with action) | `var(--as-space-3)` |
| **Input Typography Size** | `14px` (`0.875rem`) | `var(--as-typography-font-size-sm)` |
| **Label Typography Size** | `13px` (`0.8125rem`) | `var(--as-typography-font-size-sm)` |
| **Helper / Error Size** | `12px` (`0.75rem`) | `var(--as-typography-font-size-xs)` (Informative text floor) |
| **Border Radius** | `4px` | `var(--as-radius-sm)` |
| **Field Element Gap** | `6px` | `var(--as-space-1)` / `var(--as-space-2)` |
| **Action Button Target** | `28px × 28px` | `var(--as-radius-sm)` (Exceeds 24px WCAG minimum) |

> [!NOTE]
> The standard 44px control height is an **Aster Convention** designed for touch ergonomics and dense workstation applications, comfortably exceeding the 24×24px WCAG SC 2.5.8 minimum.

---

## 4. Canonical Token Bindings

All structural, color, and typographical properties must bind strictly to compiled CSS custom properties. Hardcoded hex codes, raw RGB/HSL values, or arbitrary pixel measurements are prohibited.

### Form Field Token Map

| Element / State | Property | Token Binding | Compiled Light / Dark Value |
|---|---|---|---|
| **Input (Default)** | Background | `var(--as-semantic-color-surface-card)` | `#ffffff` / `#171513` |
| | Text | `var(--as-semantic-color-text-default)` | `#211f1b` / `#f3f1ec` |
| | Border | `var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-strong)` | `1px solid #857e72` / `1px solid #706b60` |
| | Border Radius | `var(--as-radius-md)` | `4px` |
| **Input (Hover)** | Border | `var(--as-elevation-border-hairline) solid var(--as-semantic-color-text-default)` | `1px solid #211f1b` / `1px solid #f3f1ec` |
| **Input Box (Focus)**| Wrapper Outline| `var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus)` | `2px solid #2054d4` / `2px solid #60a5fa` |
| | Outline Offset | `2px` (or `-1px` inset) | `2px` |
| **Input (Invalid)** | Border | `var(--as-elevation-border-hairline) solid var(--as-semantic-color-status-critical-text)` | `1px solid #b91c1c` / `1px solid #f87171` |
| **Input (Disabled)** | Background | `var(--as-semantic-color-surface-muted)` | `#e5e2da` / `#211f1b` |
| | Text | `var(--as-semantic-color-text-muted)` | `#524d44` / `#d3cec4` |
| | Border | `var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-subtle)` | `1px solid #d3cec4` / `1px solid #211f1b` |
| **Input (Readonly)** | Background | `var(--as-semantic-color-surface-subtle)` | `#f3f1ec` / `#211f1b` |
| | Text | `var(--as-semantic-color-text-default)` | `#211f1b` / `#f3f1ec` |
| | Border | `var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-subtle)` | `1px solid #d3cec4` / `1px solid #211f1b` |
| **Placeholder** | Text | `var(--as-semantic-color-text-muted)` | `#524d44` / `#d3cec4` |
| **Field Label** | Text | `var(--as-semantic-color-text-default)` | `#211f1b` / `#f3f1ec` |
| | Font Weight | `var(--as-typography-font-weight-medium)` | `500` |
| **Required Star** | Text | `var(--as-semantic-color-status-critical-text)` | `#b91c1c` / `#f87171` |
| **Helper Text** | Text | `var(--as-semantic-color-text-muted)` | `#524d44` / `#d3cec4` |
| | Font Size | `var(--as-typography-font-size-xs)` | `0.75rem` (12px) |
| **Error Message** | Text | `var(--as-semantic-color-status-critical-text)` | `#b91c1c` / `#f87171` |
| | Font Size | `var(--as-typography-font-size-xs)` | `0.75rem` (12px) |

---

## 5. Requirements & Classification Framework

### 5.1 Normative Requirements (WCAG 2.2 Level AA Mandates)
These requirements are non-negotiable accessibility standards:

1. **Info and Relationships (SC 1.3.1 - Level A):**
   - Every input element must have an explicitly associated `<label>` using matching `id` and `for` attributes.
   - Auxiliary instructions and error messages must be programmatically associated via `aria-describedby` referencing valid DOM IDs.
2. **Text Contrast Minimum (SC 1.4.3 - Level AA):**
   - Input value text, label text, helper text, and error text must achieve at least **4.5:1** contrast against their respective backgrounds.
   - *Mathematical verification:*
     - Label & input text (`--as-semantic-color-text-default`) on card: **16.45:1** (light) / **16.13:1** (dark) — Passes AAA.
     - Helper text (`--as-semantic-color-text-muted`) on canvas: **7.97:1** (light) / **12.39:1** (dark) — Passes AAA.
     - Error message text (`--as-semantic-color-status-critical-text`) on canvas: **6.15:1** (light) / **7.02:1** (dark) — Passes AA.
     - Placeholder text (`--as-semantic-color-text-muted`) on card: **8.39:1** (light) / **11.62:1** (dark) — Passes AAA.
3. **Non-text Contrast (SC 1.4.11 - Level AA):**
   - Control boundaries (the input box border) must achieve at least **3.0:1** contrast against adjacent canvas and card surfaces in default, hover, and error states.
   - *Mathematical verification:*
     - Default control border (`--as-semantic-color-border-strong`): **3.82:1** on light canvas, **4.02:1** on light card; **3.66:1** on dark canvas, **3.44:1** on dark card — Passes AA.
     - Invalid error border (`--as-semantic-color-status-critical-text`): **6.15:1** on light canvas; **7.02:1** on dark canvas — Passes AA.
4. **Keyboard Operability (SC 2.1.1 - Level A):**
   - Inputs must be reachable via `Tab` and editable via keyboard standard keystrokes.
   - Disabled inputs must be removed from the tab sequence; `readonly` inputs must remain focusable and selectable.
5. **Focus Visible (SC 2.4.7 - Level A) & Focus Not Obscured (SC 2.4.11 - Level AA):**
   - Focused inputs and internal interactive controls must display a distinct visible focus indicator meeting contrast requirements.
   - Container-level highlight on `.as-input-box:focus-within` must **not** obscure or replace the individual focus indication of child controls (e.g., clear buttons or password visibility toggles).
   - Floating panels, headers, or dialog boundaries must not entirely obscure a focused input field.
6. **Target Size (Minimum) (SC 2.5.8 - Level AA):**
   - Interactive targets must achieve an interactive target area of at least **24×24 CSS px**, except where an explicit WCAG exception applies (e.g. inline targets within a sentence, user-agent determined default sizing, essential presentations, or targets with sufficient spacing where the combined target plus spacing to adjacent targets satisfies 24px diameter).
   - *Verification Guidance:* A 32px or 40px control height alone does not establish complete compliance. The actual interactive target bounding box (including width, clickable padding, and any nested interactive affix buttons) and spacing to adjacent targets must be evaluated in the assembled layout.
7. **Error Identification (SC 3.3.1 - Level A) & Labels/Instructions (SC 3.3.2 - Level A):**
   - If an input error is detected, the field in error must be identified in text and described clearly.
   - Fields requiring specific formatting must provide clear instructions via label or helper text.
8. **Name, Role, Value (SC 4.1.2 - Level A):**
   - The input's accessible name, role, value, and state (`aria-invalid="true"`, `required`, `disabled`, `readonly`) must be programmatically determinable by assistive technologies.

### 5.2 Evidence-Based Recommendations
1. **Persistent Visible Labels:**
   - Never replace `<label>` with `placeholder`. Placeholder text disappears when the user types, strains short-term working memory, and is often ignored or mistrusted by screen readers.
2. **Non-Color-Alone Error Indication:**
   - Color-blind users (deuteranopia, protanopia) cannot reliably distinguish red error borders from neutral borders. Error states must pair color with an error icon, text prefix, or prominent text description.
3. **Multi-ID `aria-describedby` Association Without Duplication:**
   - When a field has both helper text and an active validation error, reference both unique IDs in `aria-describedby` separated by a space, placing the error ID first (`aria-describedby="field-error field-helper"`).
   - Both elements must exist in the rendered DOM when referenced; do not reference unmounted element IDs or duplicate description texts.
4. **Error Lifecycle & Dynamic Communication:**
   - *Validation Timing:* Avoid aggressive validation on initial keystrokes; validate on `blur` (change of focus) or form submission. Once marked invalid, re-validate on `input` so errors clear immediately upon correction.
   - *Error Clearing:* When valid, synchronously remove `aria-invalid="true"`, remove or clear the error message element, and update `aria-describedby` to reference only the remaining helper ID.
   - *Distinction Between Association and Announcement:* Setting `aria-describedby` establishes a structural programmatic association that assistive technology reads when an input receives focus. It does **not** guarantee an announcement for newly appearing errors while focus is already inside the field.
   - *Scenario-Dependent Error Announcement Strategies:* Live-region announcements and focus management are scenario-dependent strategies, not interchangeable universal requirements:
     - **Form-Submission Scenario (Deliberate Focus Management):** When form submission fails validation, a deliberate focus-management strategy is justified and recommended—such as moving keyboard focus directly to an accessible error summary banner or to the first invalid field, allowing screen readers to orient the user to what failed.
     - **Field-Level Validation Scenario (No Focus Stealing):** Errors appearing during field-level interaction (such as upon `blur`) must **not** automatically steal or redirect keyboard focus away from the user's intended target, as unexpected focus shifts disorient users and disrupt keyboard navigation. Instead, relying on `aria-describedby` ensures the error is read when the user returns to the field, or an auxiliary polite live region (`aria-live="polite"`) may be used if non-disruptive immediate feedback is required.

### 5.3 Aster Conventions (Internal System Rules)
1. **Standard Control Height:**
   - 44px standard input control height is an internal design system dimensional baseline ensuring touch ergonomics, not a WCAG mandate.
2. **2px Focus Ring:**
   - `outline: var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus); outline-offset: 2px;` is the system-wide keyboard focus ring convention, not a universal WCAG mandate.
3. **12px Informative Text Floor:**
   - Helper and error text use `--as-typography-font-size-xs` (`0.75rem` / `12px`), Aster's established minimum readable floor for secondary metadata.
4. **Prohibition of Floating Labels:**
   - Floating labels (labels placed inside the input box that animate upward upon focus/entry) are explicitly prohibited in Aster in favor of persistent, static top labels.
   - *Classification:* This is an **Aster Convention** prioritizing predictable readability, constant visible context, and contrast stability in data-dense workflows, not a universal WCAG mandate.

---

## 6. Accessibility & Implementation Boundaries

> [!WARNING]
> **Accessibility Scope Disclosure:** Automated token contrast tests verify only mathematical sRGB color ratios between foreground and background tokens. They **do not prove** complete WCAG compliance of an assembled form field in a live web application.
> Complete compliance requires verifying:
> 1. Programmatic association between `<label for="id">` and `<input id="id">` in the live DOM.
> 2. Screen reader announcement of `aria-describedby` helper and dynamic error texts across target screen readers (NVDA, JAWS, VoiceOver), verifying appropriate scenario-dependent strategies (deliberate focus management on form submission vs non-focus-stealing announcements on field-level validation).
> 3. Individual focus indicators for all interactive child controls within `.as-input-box` (SC 2.4.7).
> 4. Visual non-obscured focus indicators when the input field is contained within scrollable containers or modals (SC 2.4.11).
> 5. Actual interactive target area and spacing compliance under WCAG 2.5.8.
> 6. Error state clearing and focus restoration when corrections are submitted.
