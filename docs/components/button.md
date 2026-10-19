# Aster Design System — Button Component Contract

_Canonical component specification and contract for human designers and software engineers._

The Button component triggers an immediate action or workflow. In Aster, buttons are designed for high-density transactional web applications, balancing clear visual hierarchy with strict keyboard accessibility and density adaptation.

---

## 1. Anatomy & DOM Structure

A Button consists of a container with mandatory accessible text and optional accessory elements:

```
[ Container (Border + Fill + Focus Ring) ]
  ├── [ Leading Icon (Optional, aria-hidden="true") ]
  ├── [ Text Label (Mandatory, visible or aria-label) ]
  └── [ Trailing Accessory / Loading Spinner (Optional) ]
```

### Preferred HTML-First Markup
Aster enforces native HTML semantics. Authors and AI coding assistants must use native `<button>` elements rather than un-semantified `<div>` or `<a>` elements:

```html
<!-- Standard Action Button -->
<button type="button" class="as-button as-button--secondary">
  <span class="as-button__label">Cancel</span>
</button>

<!-- Primary Submit Button -->
<button type="submit" class="as-button as-button--primary">
  <span class="as-button__label">Save Changes</span>
</button>

<!-- Icon-Only Button with Explicit Accessible Name -->
<button type="button" class="as-button as-button--ghost" aria-label="Settings">
  <svg class="as-button__icon" aria-hidden="true" ...>...</svg>
</button>
```

---

## 2. Variants, Properties & Supported States

### Variants (Proposal)
Aster defines four functional button variants to communicate action priority:

1. **`primary`:** High-salience trigger for the single primary action in a view or form (e.g. Save, Confirm, Deploy).
2. **`secondary` (Default):** Standard neutral bordered action for supporting or dismissive actions (e.g. Cancel, Back, Filter).
3. **`destructive`:** High-risk, irreversible, or data-loss actions (e.g. Delete, Terminate, Revoke).
4. **`ghost`:** Borderless, low-emphasis trigger for toolbars, table row menus, and inline icon actions.

### Properties Contract

| Property | Type | Default | Required? | Description |
|---|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'destructive' \| 'ghost'` | `'secondary'` | Optional | Visual emphasis and functional role. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Optional | Native HTML button type. Always explicit to prevent accidental form submission. |
| `disabled` | `boolean` | `false` | Optional | Native disabled state. Completely suppresses focus and browser interaction. |
| `aria-disabled`| `'true' \| 'false'` | `false` | Optional | Accessible disabled state retaining keyboard focus. Requires explicit JavaScript event suppression. |
| `loading` | `boolean` | `false` | Optional | Communicates ongoing asynchronous action. Suppresses repeated activation and announces status to assistive technology. |
| `aria-label` | `string` | — | Conditional | **Mandatory** if the button lacks a visible text label (icon-only button). |

### Disabled-State Contract

Aster distinguishes two disabled-state patterns based on whether user discovery is necessary:

1. **Standard Disabled (`<button disabled>` — Preferred Default):**
   - Use native HTML `disabled` for standard forms and actions where disabled reasons are obvious from context (e.g. submit button before input).
   - The user agent natively removes the button from keyboard tab order and suppresses all native pointer, keyboard, and form submission events.
2. **Focus-Retaining Disabled (`aria-disabled="true"`):**
   - Permitted **only** when retaining keyboard focus is intentional for user discovery (e.g. inspecting an associated error tooltip or explanation via keyboard navigation).
   - **Architectural Activation Model:** Setting `aria-disabled="true"` does **not** cause the browser to suppress events natively. Relying solely on DOM event listeners (such as `click` or `keydown` with `stopImmediatePropagation()`) is not a universal guarantee that all application activation paths are blocked. Therefore, implementations must adhere to this multi-layered contract:
     - **Authoritative Action Handler Check (Mandatory):** The underlying business action handler must synchronously check the component's disabled and loading state (`if (isDisabled || isLoading) return;`) before executing any business logic.
     - **Independent Form Submission Validation (Mandatory):** When placed in a `<form>`, form submission must independently validate eligibility and reject invalid or premature submissions at the `<form>` submit handler level before performing the submission action, rather than relying on button event suppression alone.
     - **Defensive Event Cancellation (Safeguard):** In addition to the authoritative checks above, a `click` event listener should defensively call `event.preventDefault()` and `event.stopImmediatePropagation()` when `aria-disabled="true"` to cancel default button activation behavior (such as direct click-initiated form submit or navigation) and prevent downstream event propagation.
     ```javascript
     // 1. Authoritative business action handler
     function handleAction() {
       if (isButtonDisabled() || isButtonLoading()) {
         return; // Authoritative state guard synchronously rejects execution
       }
       executeBusinessLogic();
     }

     // 2. Defensive DOM event safeguard
     button.addEventListener('click', (event) => {
       if (event.currentTarget.getAttribute('aria-disabled') === 'true') {
         event.preventDefault();           // Defensive safeguard against default actions
         event.stopImmediatePropagation(); // Defensive safeguard against downstream DOM listeners
         return;
       }
       handleAction();
     });

     // 3. Independent form submission validation
     form.addEventListener('submit', (event) => {
       if (!isFormSubmissionEligible(form)) {
         event.preventDefault();           // Form independently validates eligibility
         return;
       }
       processFormSubmission();
     });
     ```
   - **Pointer Interaction Rule:** When using `aria-disabled="true"`, do **not** apply `pointer-events: none` in CSS if an explanatory tooltip or popover is present. Disabling pointer events prevents mouse and touch users from hovering to inspect the tooltip. Use `cursor: not-allowed;` and rely on authoritative state checks and event safeguards to block actions.
3. **Tooltip Accessibility Warning:**
   - **Never** attach an explanatory tooltip directly to a native `<button disabled>`. Because disabled elements are removed from tab focus and pointer events are suppressed, keyboard-only and screen reader users can never access the tooltip.
   - For accessible tooltips on disabled controls, use `aria-disabled="true"` with `aria-describedby` pointing to the tooltip, or wrap the control in a focusable container.

### Loading-State Contract

When a button triggers an asynchronous workflow (e.g. API request, payment processing, form submit):

1. **Accessible Status Announcements:**
   - **No Guaranteed In-Place Announcement:** Setting `aria-busy="true"` or dynamically updating a focused button's visible text or accessible name (e.g. from "Save" to "Saving...") does **not** guarantee an announcement across all screen readers and browsing modes.
   - **Preferred Pattern (Dedicated Status Region):** When an explicit status announcement is required, prefer a dedicated, appropriately managed status live region (`role="status"` and `aria-live="polite"`). When using this pattern:
     - **Keep the Button's Accessible Name Stable:** Retain the button's accessible name (e.g., "Save Changes") while active or disabled to prevent confusing name changes or competing announcements.
     - **Avoid Duplicate Announcements:** Do not combine dynamic in-place label announcements with an external live-region announcement, as this causes screen readers to announce progress multiple times or produce audio clutter.
     - **Assistive Technology Verification:** Screen reader live-region timing, interruption rules, and announcement behavior vary across browser and screen reader combinations (e.g., NVDA, JAWS, VoiceOver). Asynchronous progress announcements must be verified through manual testing with assistive technology.
2. **Double-Activation & Duplicate Submission Prevention:**
   - While in a loading state, the button **must** reject repeated clicks, keyboard activations, and form submissions to prevent duplicate API requests or redundant database writes.
   - The authoritative action handler and form submission logic must synchronously verify the loading state before executing business logic. Applying native `disabled` on the button once triggered is also recommended when retaining keyboard focus during the request is not required.

### Supported Visual States
Buttons must define explicit, distinct visual expressions across all supported states:
- `default`: Resting state.
- `hover`: Pointer hovering over button.
- `active`: Pointer press or keyboard `Enter`/`Space` held down.
- `focus-visible`: Keyboard focus ring (active on keyboard navigation, suppressed on mouse click).
- `disabled`: Interaction suppressed; diminished optical weight.
- `loading`: Visual spinner replacing or flanking text; duplicate activations suppressed.

---

## 3. Dimensions & Spatial Geometry

Buttons use Aster's standard 40px control height with generous **24px horizontal padding** (`--as-space-6`) for balanced pill proportions:

| Dimensional Attribute | Standard Value (`:root`) | Canonical Token Binding |
|---|---|---|
| **Control Height** | `40px` | `var(--as-density-control-height)` |
| **Vertical Padding** | `8px` | `var(--as-density-control-padding-y)` |
| **Horizontal Padding** | `24px` (left & right) | `var(--as-space-6)` |
| **Typography Size** | `14px` (`0.875rem`) | `var(--as-typography-font-size-base)` |
| **Font Family** | `Manrope` | `var(--as-typography-font-family-sans)` |
| **Font Weight** | `500` (Medium) | `var(--as-typography-font-weight-medium)` |
| **Border Radius** | `9999px` (Pill) | `var(--as-radius-full)` |
| **Gap (Icon-Text)** | `8px` | `var(--as-space-2)` |

> [!NOTE]
> The 40px standard control height exceeds the normative WCAG 2.5.8 target size minimum (24×24px).

---

## 4. Canonical Token Bindings

All color, structural, and elevation properties must bind strictly to compiled CSS custom properties. Hardcoded hex codes, arbitrary pixels, or primitive colors are strictly prohibited.

### Variant Token Map

| Variant | State | Property | Token Binding | Compiled Light / Dark Value |
|---|---|---|---|---|
| **Primary** | Default | Background | `var(--as-semantic-color-interactive-primary)` | `#0f0f0f` / `#ffffff` |
| | | Text / Icon | `var(--as-semantic-color-interactive-primary-text)` | `#ffffff` / `#0f0f0f` |
| | | Border | `0` | `0` |
| | Hover / Active | Background | `var(--as-semantic-color-interactive-primary-hover)` | `#333333` / `#e0e0e0` |
| **Secondary**| Default | Background | `var(--as-semantic-color-surface-card)` | `#f5f5f5` / `#1e1e1e` |
| | | Text / Icon | `var(--as-semantic-color-text-default)` | `#121212` / `#e0e0e0` |
| | | Border | `var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-strong)` | `1px solid #777777` |
| | Hover | Background | `var(--as-semantic-color-surface-subtle)` | `#eeeeee` / `#333333` |
| | Active | Background | `var(--as-semantic-color-surface-muted)` | `#eeeeee` / `#333333` |
| **Destructive**| Default | Background | `var(--as-semantic-color-surface-card)` | `#f5f5f5` / `#1e1e1e` |
| | | Text / Icon | `var(--as-semantic-color-status-critical-text)` | `#c5221f` / `#ff5f56` |
| | | Border | `var(--as-elevation-border-hairline) solid var(--as-semantic-color-status-critical-text)` | `1px solid #c5221f` / `1px solid #ff5f56` |
| | Hover | Background | `var(--as-semantic-color-surface-subtle)` | `#eeeeee` / `#333333` |
| **Ghost** | Default | Background | `transparent` | `transparent` |
| | | Text / Icon | `var(--as-semantic-color-text-default)` | `#121212` / `#e0e0e0` |
| | | Border | `0` | `0` |
| | Hover | Background | `var(--as-semantic-color-surface-subtle)` | `#eeeeee` / `#333333` |
| **All Variants**| Focus-Visible | Outline | `var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus)` | `2px solid #1565c0` / `2px solid #64b5f6` |
| | | Outline Offset | `2px` | `2px` |
| | Disabled | Background | `var(--as-semantic-color-surface-muted)` | `#eeeeee` / `#333333` |
| | | Text / Icon | `var(--as-semantic-color-text-muted)` | `#555555` / `#aaaaaa` |
| | | Border | `var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-subtle)` | `1px solid #eeeeee` / `1px solid #333333` |

---

## 5. Requirements & Classification Framework

### 5.1 Normative Requirements (WCAG 2.2 Level AA Mandates)
These requirements are legally binding and non-negotiable:

1. **Text Contrast Minimum (SC 1.4.3 - Level AA):**
   - Button text must achieve at least **4.5:1** contrast against button background.
   - *Mathematical verification:* Primary button text achieves **6.40:1** (light) and **5.54:1** (dark). Secondary text achieves **16.45:1** (light) and **16.13:1** (dark).
2. **Non-text Contrast (SC 1.4.11 - Level AA):**
   - Control borders on secondary and destructive buttons must achieve at least **3.0:1** against adjacent canvas/card surfaces.
   - *Mathematical verification:* Control border (`--as-semantic-color-border-strong`) achieves **3.82:1** on light canvas and **3.44:1** on dark card.
3. **Keyboard Operability (SC 2.1.1 - Level A):**
   - All buttons must be reachable via `Tab` key and operable using both `Enter` and `Space`.
   - Native `<button>` elements handle this automatically. Custom button implementations (`<div role="button">`) require explicit keyboard listener parity.
4. **Focus Visible (SC 2.4.7 - Level A) & Focus Not Obscured (SC 2.4.11 - Level AA):**
   - The focus indicator must be visibly identifiable.
   - Sticky headers, floating panels, or dialog footers must never entirely obscure a focused button.
5. **Target Size (Minimum) (SC 2.5.8 - Level AA):**
   - Interactive click targets must be at least **24×24 CSS px**, except where inline, user-agent determined, or separated by sufficient spacing.
   - *Verification:* Aster buttons measure 40×40px minimum in Standard density, comfortably exceeding the 24×24px WCAG SC 2.5.8 minimum.
6. **Name, Role, Value (SC 4.1.2 - Level A):**
   - Buttons must have a programmatically determinable accessible name. Icon-only buttons must provide an `aria-label`.

### 5.2 Evidence-Based Recommendations
- **Focus Appearance (WCAG 2.4.13 - Level AAA):** Providing a 2px high-contrast perimeter outline with 2px offset ensures salience for low-vision users.
- **Double-Activation Prevention:** When a button triggers an asynchronous workflow, it must prevent repeated activations while in the `loading` state.

### 5.3 Aster Conventions (Internal System Rules)
- **Standard Height:** 40px standard control height (`--as-density-control-height`) is an internal design system baseline, not a WCAG mandate.
- **2px Focus Ring:** `outline: var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus); outline-offset: 2px;` is an Aster-wide focus ring convention.
- **Non-Color-Alone State Communication:** Destructive buttons should pair red critical color with unambiguous text copy (e.g. "Delete Project", not just "Confirm").

---

## 6. Accessibility & Implementation Boundaries

> [!WARNING]
> **Accessibility Scope Disclosure:** Automated token contrast tests prove only mathematical sRGB color ratios between foreground and background tokens. They **do not prove** holistic WCAG compliance of an assembled button in a live web application.
> Complete compliance requires verifying:
> 1. Real DOM focus order and focus visibility in context.
> 2. Screen reader announcements of loading states via dedicated live regions (`role="status"`, `aria-live="polite"`), verified through assistive technology testing.
> 3. Layout reflow and non-obscured visibility during responsive zooming (SC 1.4.4, SC 1.4.10, SC 2.4.11).
