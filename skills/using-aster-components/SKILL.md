---
name: using-aster-components
description: Canonical specifications and assembly contracts for Aster Design System UI components. Use when creating, styling, or reviewing HTML, CSS, or component code for Aster components (Button, Input, Table) to enforce strict prop contracts, semantic token bindings, and accessibility standards.
---

# Using Aster Components

This guide instructs AI coding agents on how to construct, style, and validate Aster Design System components in web applications.

> **Note on Agent Skill Support:** Agent Skills (`SKILL.md`) is an open standard designed for progressive-disclosure agent workflows. In environments where agent skills are not natively invoked, these instructions serve as canonical component implementation guidelines.

---

## 1. System Architecture, Distribution & Assembly Philosophy

### 1.1 Source of Truth & Generated Distribution Model
- **Authoritative Sources:** `components/` and `tokens/` are the **sole canonical sources** of component implementations and design tokens.
- **Generated Distribution (`dist/`):** Everything under `dist/` is 100% build-generated and must **never** be manually edited.
  - `dist/css/tokens.css` (compiled design tokens)
  - `dist/css/components.css` (compiled component styles and motion defaults)
  - `dist/js/aster.js` (compiled component behavior and lifecycle functions)
- **Playground Role:** `playground/` is a consumer of `dist/` assets; it is not a component source. Never import from `playground/` or rely on playground-specific selectors.

### 1.2 Clean Consumer Integration Model
To consume Aster in any web application, load the browser-ready CSS and ES module:
```html
<!-- 1. Tokens and Component Styles -->
<link rel="stylesheet" href="/dist/css/tokens.css">
<link rel="stylesheet" href="/dist/css/components.css">

<!-- 2. Interactive Behavior Module -->
<script type="module">
  import { initAsterComponents, setButtonLoading, validateInput } from '/dist/js/aster.js';
  initAsterComponents();
</script>
```

### 1.3 What Must NOT Be Invented or Assumed
AI agents must strictly respect these system boundaries:
1. **No NPM Package / No React Wrappers (Yet):** Do not generate imports from `"@aster/react"` or `"@aster/components"`. Aster is currently distributed as native HTML/CSS and browser ES modules.
2. **No Primitive Color Tokens in Components:** Components must strictly bind to semantic tokens (`--as-semantic-color-*`). Never use `--as-color-primitive-*`.
3. **No Floating Labels:** Labels must remain persistently visible above inputs (`.as-form-field__label`). Never hide labels or convert them into animated floating placeholders.
4. **No Synthetic ARIA Grids:** Never apply `role="grid"` to standard data tables (`.as-table`). Always use native HTML `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`.
5. **No Undocumented Button Variants:** The only supported button variants are `primary`, `secondary`, `destructive`, and `ghost`.
6. **No Undocumented Density Modes:** The only supported density modes are `comfortable` (`40px` height) and `compact` (`32px` height).

### 1.4 Foundational Assembly Principles
1. **Native HTML Semantics Over Synthetic ARIA:**
   - Always use native HTML elements: `<button>` for actions, `<input>` for form data, `<table>` for tabular data.
   - Do **not** use `<div>` or `<span>` with `role="button"` or `role="grid"` when a native element can serve the purpose. ARIA attributes must supplement, never replace, native browser functionality.
2. **Strict Semantic Token Precedence:**
   - Component styles must bind **only** to semantic tokens (`--as-semantic-color-*`), density tokens (`--as-density-*`), and structural foundation tokens (`--as-space-*`, `--as-radius-*`, `--as-elevation-*`).
3. **Dual-Density Agnosticism:**
   - Components must not hardcode static pixel heights. Rely on `--as-density-control-height` so layouts adapt between Comfortable (`40px`) and Compact (`32px`) automatically.

---

## 2. Button Component Contract

### 2.1 Properties & Roles

| Property | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'destructive' \| 'ghost'` | `'secondary'` | Visual role and action salience. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native HTML button type. Always explicit. |
| `disabled` | `boolean` | `false` | Native HTML disabled state. Completely suppresses focus and browser interaction. |
| `aria-disabled` | `'true' \| 'false'` | `false` | Accessible disabled state retaining keyboard focus (e.g. for explanation tooltips). Authoritative action handler checks state; click listener adds defensive cancellation. |
| `loading` | `boolean` | `false` | Communicates ongoing asynchronous action. Prevents double-activation; status announced via dedicated live region. |
| `aria-label` | `string` | — | **Mandatory** if button lacks a visible text label (icon-only button). |

### 2.2 Disabled-State & Loading-State Contracts

#### Disabled-State Contract
- **Standard Disabled (`<button disabled>` — Preferred Default):**
  - Use native HTML `disabled` for standard forms and actions where disabled reasons are obvious from context.
  - The user agent natively removes the button from keyboard tab order and suppresses all native pointer, keyboard, and form submission events.
- **Focus-Retaining Disabled (`aria-disabled="true"`):**
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
- **Tooltip Accessibility Warning:**
  - **Never** attach an explanatory tooltip directly to a native `<button disabled>`. Because disabled elements are removed from tab focus and pointer events are suppressed, keyboard-only and screen reader users can never access the tooltip.
  - For accessible tooltips on disabled controls, use `aria-disabled="true"` with `aria-describedby` pointing to the tooltip, or wrap the control in a focusable container.

#### Loading-State Contract
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

### 2.3 Canonical HTML Templates

```html
<!-- 1. Secondary Action Button (Default Proposal) -->
<button type="button" class="as-button as-button--secondary">
  <span class="as-button__label">Cancel</span>
</button>

<!-- 2. Primary Action Button -->
<button type="submit" class="as-button as-button--primary">
  <span class="as-button__label">Save Changes</span>
</button>

<!-- 3. Destructive Action Button -->
<button type="button" class="as-button as-button--destructive">
  <span class="as-button__label">Delete Workspace</span>
</button>

<!-- 4. Icon-Only Ghost Button with Explicit Accessible Name -->
<button type="button" class="as-button as-button--ghost" aria-label="Open Project Settings">
  <svg class="as-button__icon" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
    <!-- Icon geometry -->
  </svg>
</button>

<!-- 5. Asynchronous Loading State with Dedicated Status Live Region (Preferred Pattern) -->
<!-- Button accessible name remains stable; explicit progress is routed to the managed status region -->
<button type="button" class="as-button as-button--primary" aria-busy="true" disabled>
  <span class="as-button__spinner" aria-hidden="true"></span>
  <span class="as-button__label">Save Changes</span>
</button>
<div role="status" aria-live="polite" class="as-sr-only">Saving changes...</div>

<!-- 6. Focus-Retaining Disabled Button with Associated Tooltip -->
<button type="button" class="as-button as-button--secondary" aria-disabled="true" aria-describedby="export-help">
  <span class="as-button__label">Export Data</span>
</button>
<div id="export-help" role="tooltip">You must select at least one row before exporting.</div>
```

### 2.4 Verified CSS Token Bindings

```css
/* Base Button Container */
.as-button {
  --_ink: var(--as-semantic-color-text-default);
  --_line: color-mix(in srgb, var(--as-semantic-color-text-default) 14%, transparent);
  --_line-hover: color-mix(in srgb, var(--as-semantic-color-text-default) 24%, transparent);
  --_hover-bg: color-mix(in srgb, currentColor 11%, transparent);
  --_max-d: 260px;
  --_x: 50%;
  --_y: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--as-space-2);
  box-sizing: border-box;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  height: var(--as-density-control-height);
  padding: 0 calc(var(--as-density-control-padding-x) + 4px);
  border: 0;
  border-radius: var(--as-radius-full);
  font-family: var(--as-typography-font-family-sans);
  font-size: var(--as-typography-font-size-base);
  font-weight: var(--as-typography-font-weight-medium);
  letter-spacing: -0.005em;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  vertical-align: middle;
  background-color: var(--_bg);
  color: var(--_fg, var(--_ink));
  box-shadow: var(--_shadow);
  outline: var(--as-elevation-border-focus) solid transparent;
  outline-offset: 0;
  transition:
    transform var(--as-motion-duration-base) var(--as-motion-ease-out),
    background-color var(--as-motion-duration-base) var(--as-motion-ease-out),
    box-shadow var(--as-motion-duration-base) var(--as-motion-ease-out),
    color var(--as-motion-duration-base) var(--as-motion-ease-out),
    outline-color var(--as-motion-duration-base) var(--as-motion-ease-out),
    outline-offset var(--as-motion-duration-base) var(--as-motion-ease-out);
}

[data-density="compact"] .as-button,
.as-button--compact {
  --as-density-control-height: 32px;
  --as-density-control-padding-x: 12px;
  font-size: var(--as-typography-font-size-sm);
  gap: 6px;
}

/* Circular hover fill: solid circle of --_hover-bg that starts at the mouse point (--_x, --_y) and expands to fill the pill */
.as-button::before {
  content: "";
  position: absolute;
  left: var(--_x, 50%);
  top: var(--_y, 50%);
  width: 0px;
  height: 0px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: -1;
  background-color: var(--_hover-bg);
  transition:
    width 420ms cubic-bezier(0.4, 0, 0.2, 1),
    height 420ms cubic-bezier(0.4, 0, 0.2, 1),
    background-color var(--as-motion-duration-base) var(--as-motion-ease-out);
}

/* Lift + circular hover fill expansion from pointer to full pill */
.as-button:is(:hover, .is-hover):not(:disabled, [aria-disabled="true"], [aria-busy="true"]) {
  transform: translateY(var(--as-motion-lift, -1.5px)) scale(var(--as-motion-lift-scale, 1.02));
}

.as-button:is(:hover, .is-hover):not(:disabled, [aria-disabled="true"], [aria-busy="true"])::before {
  width: var(--_max-d, 260px);
  height: var(--_max-d, 260px);
  transition:
    width 520ms cubic-bezier(0.25, 0.8, 0.25, 1),
    height 520ms cubic-bezier(0.25, 0.8, 0.25, 1),
    background-color var(--as-motion-duration-base) var(--as-motion-ease-out);
}

/* Press: quick 80ms compression, deepens fill */
.as-button:is(:active, .is-pressed):not(:disabled, [aria-disabled="true"], [aria-busy="true"]) {
  transform: translateY(var(--as-motion-press-y, 1px)) scale(var(--as-motion-press-scale, 0.975));
  transition-duration: var(--as-motion-duration-press);
}

.as-button:is(:active, .is-pressed):not(:disabled, [aria-disabled="true"], [aria-busy="true"])::before {
  width: var(--_max-d, 260px);
  height: var(--_max-d, 260px);
  background-color: var(--_active-bg, var(--_hover-bg));
  transition-duration: var(--as-motion-duration-press);
}

/* Keyboard focus: ring grows outward from the control */
.as-button:is(:focus-visible, .is-focus) {
  outline-color: var(--as-semantic-color-border-focus);
  outline-offset: 3px;
}

/* Primary Variant */
.as-button--primary {
  --_bg: var(--as-semantic-color-interactive-primary);
  --_fg: var(--as-semantic-color-interactive-primary-text);
  --_hover-bg: color-mix(in srgb, #ffffff 20%, var(--as-semantic-color-interactive-primary));
  --_active-bg: var(--as-semantic-color-interactive-primary-hover);
  --_shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

[data-theme="dark"] .as-button--primary {
  --_hover-bg: color-mix(in srgb, #0e0d14 20%, var(--as-semantic-color-interactive-primary));
  --_active-bg: color-mix(in srgb, #0e0d14 28%, var(--as-semantic-color-interactive-primary));
}

/* Secondary Variant (Default) */
.as-button--secondary {
  --_bg: var(--as-semantic-color-surface-card);
  --_hover-bg: color-mix(in srgb, var(--as-semantic-color-text-default) 9%, var(--as-semantic-color-surface-card));
  --_active-bg: color-mix(in srgb, var(--as-semantic-color-text-default) 14%, var(--as-semantic-color-surface-card));
  --_shadow: inset 0 0 0 var(--as-elevation-border-hairline) var(--_line);
}

[data-theme="dark"] .as-button--secondary {
  --_hover-bg: color-mix(in srgb, var(--as-semantic-color-text-default) 12%, var(--as-semantic-color-surface-card));
  --_active-bg: color-mix(in srgb, var(--as-semantic-color-text-default) 17%, var(--as-semantic-color-surface-card));
}

/* Destructive Variant */
.as-button--destructive {
  --_fg: var(--as-semantic-color-status-critical-text);
  --_bg: var(--as-semantic-color-surface-card);
  --_hover-bg: color-mix(in srgb, var(--as-semantic-color-status-critical-text) 11%, var(--as-semantic-color-surface-card));
  --_active-bg: color-mix(in srgb, var(--as-semantic-color-status-critical-text) 16%, var(--as-semantic-color-surface-card));
  --_shadow: inset 0 0 0 var(--as-elevation-border-hairline) color-mix(in srgb, var(--as-semantic-color-status-critical-text) 36%, transparent);
}

[data-theme="dark"] .as-button--destructive {
  --_hover-bg: color-mix(in srgb, var(--as-semantic-color-status-critical-text) 15%, var(--as-semantic-color-surface-card));
  --_active-bg: color-mix(in srgb, var(--as-semantic-color-status-critical-text) 21%, var(--as-semantic-color-surface-card));
}

/* Ghost Variant */
.as-button--ghost {
  --_bg: transparent;
  --_hover-bg: color-mix(in srgb, var(--as-semantic-color-text-default) 10%, transparent);
  --_active-bg: color-mix(in srgb, var(--as-semantic-color-text-default) 15%, transparent);
  --_shadow: none;
}

[data-theme="dark"] .as-button--ghost {
  --_hover-bg: color-mix(in srgb, var(--as-semantic-color-text-default) 13%, transparent);
  --_active-bg: color-mix(in srgb, var(--as-semantic-color-text-default) 18%, transparent);
}

/* Disabled (native + focus-retaining): strictly lock transform and suppress hover/active effects */
.as-button:disabled,
.as-button[aria-disabled="true"] {
  cursor: not-allowed;
  transform: none !important;
  --_shadow: none;
  --_bg: var(--as-semantic-color-surface-muted);
  --_fg: var(--as-semantic-color-text-muted);
  opacity: 0.6;
}

.as-button:is(:disabled, [aria-disabled="true"], [aria-busy="true"])::before {
  opacity: 0 !important;
}

.as-button--ghost:disabled,
.as-button--ghost[aria-disabled="true"] {
  --_bg: transparent;
}

/* Loading State */
.as-button[aria-busy="true"] {
  cursor: progress;
  transform: none !important;
}

.as-button[aria-busy="true"]:not(.as-button--ghost):not(.as-button--destructive):not(.as-button--secondary) {
  --_bg: var(--as-semantic-color-interactive-primary-hover);
}

@media (prefers-reduced-motion: reduce) {
  .as-button {
    transform: none !important;
  }
  .as-button::before,
  .as-button:is(:hover, .is-hover):not(:disabled, [aria-disabled="true"], [aria-busy="true"])::before {
    transition-duration: 0.01ms !important;
  }
}
```

---

## 3. Input / Form Field Component Contract

### 3.1 Properties & Roles

| Property | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | **Mandatory.** Unique ID pairing `<label for="...">` and `aria-describedby`. |
| `name` | `string` | — | Form field name for native form submission. |
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'search' \| 'tel' \| 'url'` | `'text'` | Native HTML input type optimizing input modalities and validation. |
| `value` | `string` | — | Current value of the input. |
| `placeholder` | `string` | — | Transient input format hint. Never a replacement for a visible `<label>`. |
| `required` | `boolean` | `false` | Native HTML required attribute. Signals mandatory input. |
| `disabled` | `boolean` | `false` | Native HTML disabled state. Completely suppresses focus and form submission. |
| `readOnly` | `boolean` | `false` | Native HTML readonly state. Suppresses editing while retaining focus and selection. |
| `invalid` | `boolean` | `false` | Validation failure indicator. Binds to `aria-invalid="true"`. |
| `aria-describedby` | `string` | — | Space-separated list referencing helper and/or error message element IDs. |

### 3.2 Field Assembly & Accessibility Contracts

#### Label & Semantic Association
- **Explicit `<label>` Binding:** Every input **must** have an associated native `<label for="[id]">`. Implicit nesting alone is discouraged; explicit `for`/`id` binding ensures reliable assistive technology name computation.
- **Never Use Placeholder as Label:** Placeholders disappear upon typing, lack persistence, and cause severe usability failures for users with memory or cognitive impairments.
- **Required Indicator:** Mark required fields visually (e.g. `<span class="as-form-field__required" aria-hidden="true">*</span>`) and programmatically with native `required` and `aria-required="true"`.
- **Prohibition of Floating Labels (Aster Convention):** Floating labels are explicitly prohibited in Aster in favor of persistent, static top labels to ensure constant visible context and avoid low-contrast transitions. This is an **Aster Convention**, not a universal WCAG mandate.

#### Focus Indication & Child Controls
- **Wrapper Focus Highlight:** The input wrapper container (`.as-input-box`) may use `:focus-within` to present a unified focus outline.
- **Individual Child Control Focus (Mandatory):** Every keyboard-focusable element inside the wrapper (the native `<input>` and any trailing/leading `<button type="button">` elements such as clear or password toggles) **must retain an independent, clearly visible focus indicator**.
- **Non-Obscuration Rule:** The wrapper's `:focus-within` styling must **never** obscure, suppress, or substitute for the distinct focus indication of internal controls when navigating via keyboard.

#### Accessible Descriptions & Error Lifecycle
- **Rendered DOM ID Association:** `aria-describedby` must strictly reference IDs that exist in the currently rendered DOM. Never reference unmounted or hypothetical IDs.
- **Multi-ID Association Without Duplication:** When both helper guidance and an active error message exist simultaneously, reference both distinct IDs in `aria-describedby`, prioritizing the error ID first (`aria-describedby="email-error email-helper"`). Do not duplicate IDs or content.
- **Distinction Between Association and Announcement:** Setting `aria-describedby` establishes a structural programmatic association that screen readers announce upon receiving focus; it does **not** guarantee an announcement for newly appearing errors while focus is already inside the input.
- **Scenario-Dependent Error Announcement Strategies:** Live-region announcements and focus management are scenario-dependent strategies, not interchangeable universal requirements:
  - *Form-Submission Scenario (Deliberate Focus Management):* When form submission fails validation, a deliberate focus-management strategy is justified and recommended—such as systematically moving focus to an accessible error summary banner or to the first invalid control, enabling screen readers to orient the user to the failure.
  - *Field-Level Validation Scenario (No Focus Stealing):* Errors appearing during field-level interaction (such as upon `blur`) must **not** automatically steal or yank focus away from the user's newly focused target. The programmatic association via `aria-describedby` ensures the error is read when the user returns to the field, or an auxiliary polite live region (`aria-live="polite"`) may be utilized if immediate non-disruptive feedback is required.
- **Error Lifecycle Definition:**
  1. *Validation Timing:* Validate on `blur` (change of focus) or on form submission. Avoid aggressive keystroke validation on initial input.
  2. *Invalid State:* When validation fails, inject/mount the error element with a unique ID, set `aria-invalid="true"`, and prepend the error ID to `aria-describedby`.
  3. *Error Clearing:* While in an invalid state, re-validate on `input` so errors clear immediately upon correction. When valid, remove `aria-invalid="true"`, remove or clear the error element, and update `aria-describedby` to remove the error ID.
- **Non-Color-Alone Error State:** A red border alone fails WCAG 1.4.1. Errors **must** be paired with an error icon, text prefix, and persistent descriptive message (`.as-form-field__error`).

#### Target Size Compliance (WCAG 2.5.8 Level AA)
- A 32px or 40px control height alone does **not** establish complete WCAG 2.5.8 target-size compliance.
- Implementations must evaluate the actual interactive target bounding box (including width, clickable padding, and any nested interactive affix buttons) and verify applicable spacing exceptions (e.g. sufficient spacing where the target plus space to adjacent targets satisfies a 24px diameter).

### 3.3 Canonical HTML Templates

```html
<!-- 1. Standard Text Input Field with Label & Helper Description -->
<div class="as-form-field">
  <label for="project-name" class="as-form-field__label">
    Project Name
  </label>
  <div class="as-input-box">
    <input
      id="project-name"
      name="projectName"
      type="text"
      class="as-input"
      placeholder="e.g. Analytics Dashboard"
      aria-describedby="project-name-helper"
    />
  </div>
  <p id="project-name-helper" class="as-form-field__helper">
    Must be unique within your organization.
  </p>
</div>

<!-- 2. Required Input Field with Active Validation Error -->
<div class="as-form-field as-form-field--invalid">
  <label for="work-email" class="as-form-field__label">
    Work Email
    <span class="as-form-field__required" aria-hidden="true">*</span>
  </label>
  <div class="as-input-box as-input-box--invalid">
    <input
      id="work-email"
      name="workEmail"
      type="email"
      class="as-input"
      value="invalid-email"
      required
      aria-required="true"
      aria-invalid="true"
      aria-describedby="email-error email-helper"
    />
  </div>
  <p id="email-error" class="as-form-field__error" role="alert">
    <span class="as-form-field__error-icon" aria-hidden="true">!</span>
    Please enter a valid work email address (e.g. name@company.com).
  </p>
  <p id="email-helper" class="as-form-field__helper">
    We will send verification instructions to this address.
  </p>
</div>

<!-- 3. Disabled Input Field -->
<div class="as-form-field">
  <label for="org-id" class="as-form-field__label">Organization ID</label>
  <div class="as-input-box">
    <input
      id="org-id"
      name="orgId"
      type="text"
      class="as-input"
      value="org_9942a"
      disabled
    />
  </div>
</div>
```

### 3.4 Verified CSS Token Bindings

```css
/* Form Field Container */
.as-form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  margin-bottom: var(--as-space-5);
  font-family: var(--as-typography-font-family-sans);
}

/* Field Label */
.as-form-field__label {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: var(--as-typography-font-size-base);
  font-weight: var(--as-typography-font-weight-medium);
  color: var(--as-semantic-color-text-default);
  line-height: 1.3;
}

.as-form-field__required {
  color: var(--as-semantic-color-status-critical-text);
}

.as-form-field__optional {
  font-weight: var(--as-typography-font-weight-regular);
  font-size: var(--as-typography-font-size-sm);
  color: var(--as-semantic-color-text-muted);
}

/* Input Control Box */
.as-input-box {
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: var(--as-density-control-height);
  padding: 0 var(--as-density-control-padding-x);
  background: var(--as-semantic-color-surface-card);
  border: var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-strong);
  border-radius: var(--as-radius-lg);
  box-shadow: 0 0 0 0 transparent;
  transition:
    border-color var(--as-motion-duration-base) var(--as-motion-ease-out),
    box-shadow var(--as-motion-duration-base) var(--as-motion-ease-out),
    background-color var(--as-motion-duration-base) var(--as-motion-ease-out);
}

.as-input-box:is(:hover, .is-hover):not(.as-input-box--disabled, :focus-within) {
  border-color: var(--as-semantic-color-text-muted);
  background: color-mix(in srgb, var(--as-semantic-color-text-default) 2%, var(--as-semantic-color-surface-card));
}

.as-input-box:is(:focus-within, .is-focus):not(.as-input-box--disabled) {
  border-color: var(--as-semantic-color-border-focus);
  box-shadow:
    0 0 0 2px var(--as-semantic-color-surface-canvas),
    0 0 0 4px var(--as-semantic-color-border-focus);
}

/* Native Input Element */
.as-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: var(--as-typography-font-size-base);
  color: var(--as-semantic-color-text-default);
}

.as-input::placeholder {
  color: var(--as-semantic-color-text-muted);
  opacity: 0.85;
}

.as-input[type="password"] {
  letter-spacing: 0.08em;
}

.as-input--mono {
  font-family: var(--as-typography-font-family-mono);
  font-size: var(--as-typography-font-size-sm);
  letter-spacing: 0;
}

/* Compact Density Override */
[data-density="compact"] .as-input-box,
.as-input-box--compact {
  --as-density-control-height: 32px;
  --as-density-control-padding-x: 10px;
}

[data-density="compact"] .as-input-box .as-input,
.as-input-box--compact .as-input {
  font-size: var(--as-typography-font-size-sm);
}

/* Affix Action Buttons */
.as-input__action {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  margin-right: -8px;
  margin-left: var(--as-space-1);
  padding: 0;
  border: 0;
  border-radius: var(--as-radius-full);
  background: transparent;
  color: var(--as-semantic-color-text-muted);
  cursor: pointer;
  transition:
    background-color var(--as-motion-duration-base) var(--as-motion-ease-out),
    color var(--as-motion-duration-base),
    transform var(--as-motion-duration-base) var(--as-motion-ease-out);
}

.as-input__action:hover {
  background: color-mix(in srgb, var(--as-semantic-color-text-default) 8%, transparent);
  color: var(--as-semantic-color-text-default);
}

.as-input__action:active {
  transform: scale(var(--as-motion-press-scale));
  transition-duration: var(--as-motion-duration-press);
}

.as-input__action:focus-visible {
  outline: var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus);
  outline-offset: 1px;
}

.as-input__action[hidden] {
  display: none;
}

/* Helper & Error Messages */
.as-form-field__message,
.as-form-field__helper {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin: 0;
  font-size: var(--as-typography-font-size-sm);
  line-height: 1.4;
  color: var(--as-semantic-color-text-muted);
}

.as-form-field__message .as-icon,
.as-form-field__helper .as-icon {
  width: 14px;
  height: 14px;
  margin-top: 2px;
}

.as-form-field__error {
  color: var(--as-semantic-color-status-critical-text);
  font-weight: var(--as-typography-font-weight-medium);
}

.as-form-field__error[hidden] {
  display: none;
}

.as-form-field--error .as-input-box,
.as-form-field--invalid .as-input-box,
.as-input-box--invalid {
  border-color: var(--as-semantic-color-status-critical-text);
  box-shadow: inset 0 0 0 var(--as-elevation-border-hairline) var(--as-semantic-color-status-critical-text);
}

.as-form-field--error .as-input-box:is(:focus-within, .is-focus),
.as-form-field--invalid .as-input-box:is(:focus-within, .is-focus),
.as-input-box--invalid:is(:focus-within, .is-focus) {
  box-shadow:
    inset 0 0 0 var(--as-elevation-border-hairline) var(--as-semantic-color-status-critical-text),
    0 0 0 2px var(--as-semantic-color-surface-canvas),
    0 0 0 4px var(--as-semantic-color-status-critical-text);
}

.as-input-box--disabled,
.as-input-box:has(.as-input:disabled) {
  background: var(--as-semantic-color-surface-muted);
  border-color: var(--as-semantic-color-border-subtle);
  cursor: not-allowed;
}

.as-input-box--disabled .as-input,
.as-input:disabled {
  color: var(--as-semantic-color-text-muted);
  cursor: not-allowed;
}

.as-form-field--disabled .as-form-field__label {
  color: var(--as-semantic-color-text-muted);
}

@media (prefers-reduced-motion: reduce) {
  .as-input__action {
    transform: none !important;
  }
}
```

---

## 4. Data Table Component Contract

### 4.1 Properties & Roles

| Property | Type | Default | Description |
|---|---|---|---|
| `caption` | `string` | — | **Mandatory.** Accessible table title or summary. Visible or `.as-sr-only`. |
| `density` | `'comfortable' \| 'compact'` | `'comfortable'` | Row height and cell padding profile. |
| `striped` | `boolean` | `false` | Enables alternating row backgrounds (`--as-semantic-color-surface-subtle`). |
| `bordered` | `boolean` | `true` | Renders container and cell hairline borders. |
| `hoverable` | `boolean` | `true` | Highlights table rows on hover. |
| `scrollable` | `boolean` | `true` | Wraps table in an accessible horizontal scroll container. |

### 4.2 Semantic HTML Structure & Accessibility Contracts

#### Native Semantics Over ARIA Grid
- **Strict Prohibition of Synthetic Grids:** Do **not** use `role="grid"` or `role="treegrid"` on presentation data tables. Native HTML `<table>` elements allow screen reader users to leverage standardized virtual cursor and table exploration keystrokes without custom JavaScript keyboard traps.
- **Explicit Header Scopes:** Every header cell must declare its programmatic scope: `<th scope="col">` for column headers, and `<th scope="row">` for primary row identifier cells.
- **Accessible Table Title (Aster Convention):** Every table must include a native `<caption>` element (visible or `.as-sr-only`). While WCAG 1.3.1 / 4.1.2 allows accessible names via several mechanisms, Aster establishes native `<caption>` as its preferred design system convention.

#### Keyboard Navigation & Responsive Overflow
- **Conditional Focusable Scroll Container (WCAG SC 2.1.1):** When wide data causes horizontal scrolling (`scrollWidth > clientWidth`), the outer wrapper (`.as-table-container`) conditionally receives `tabindex="0"`, declares `role="region"`, and provides an `aria-label` matching the table caption:
  ```html
  <div class="as-table-container" tabindex="0" role="region" aria-label="Customer Accounts">
    <table class="as-table">...</table>
  </div>
  ```
  *Non-overflowing condition:* If the table does not overflow horizontally, `tabindex="0"` and `role="region"` should be omitted or removed dynamically. Making a non-scrollable container focusable creates an unnecessary, redundant keyboard tab stop that provides no scrolling utility.
- **Nested Controls Tab Order:** Interactive controls inside cells (buttons, links, checkboxes) reside in standard document tab order (`Tab` / `Shift+Tab`). The container treatment must not interfere with cell focus.

#### Sorting Semantics (Recommended W3C WAI-ARIA Pattern for SC 4.1.2)
- **Authoritative `aria-sort` on `<th>`:** In accordance with W3C WAI-ARIA authoring practices, `aria-sort` belongs strictly on the `<th>` element (`"ascending"`, `"descending"`, or `"none"`), **never** on the inner sort button.
- **Nested Sort Trigger:** The header text and sort icon are wrapped in a native `<button type="button" class="as-table__sort-btn">` containing hidden action text (e.g. `<span class="as-sr-only">, sort ascending</span>`).
- **Dynamic Sort Announcements:** Asynchronous sort updates should be announced through an auxiliary polite live region (`role="status"` / `aria-live="polite"`).

#### Target Size Compliance (WCAG 2.5.8 Level AA)
- A 32px Compact row height or 44px Comfortable row height is an **Aster Convention** and does **not** by itself establish target-size compliance for interactive controls housed within cells (such as selection checkboxes, action buttons, icon triggers, or links).
- Implementations must evaluate the actual bounding box of each interactive target (minimum 24×24px, or meeting spacing exceptions where a 24px diameter circle centered on the target does not overlap adjacent targets, or qualifying for inline text exceptions).

#### Non-text Contrast & Decorative Dividers (SC 1.4.11 Level AA)
- Visual information required to identify user interface components and states (such as active focus indicators, checkboxes, sort indicator icons, and critical status badges) must achieve ≥3.0:1 against adjacent surfaces.
- Interior hairline table dividing borders (`--as-semantic-color-border-subtle`) are visual aids rather than essential functional controls; where table layout, whitespace, and column alignment clearly delineate cells, interior dividing lines are decorative and do not strictly require 3:1 under SC 1.4.11.

#### Data Alignment Discipline
- Align textual data to the left (`text-align: left`).
- Align numeric, monetary, and statistical data to the right (`text-align: right`) to facilitate decimal alignment and scanning.

### 4.3 Canonical HTML Templates

```html
<!-- 1. Standard Interactive Data Table with Sorting and Scroll Container -->
<div class="as-table-container" tabindex="0" role="region" aria-label="Active Projects">
  <table class="as-table">
    <caption class="as-table__caption">Active Client Projects</caption>
    <thead>
      <tr>
        <th scope="col" aria-sort="ascending">
          <button type="button" class="as-table__sort-btn">
            <span>Project Name</span>
            <span class="as-table__sort-icon" aria-hidden="true">▲</span>
            <span class="as-sr-only">, sort descending</span>
          </button>
        </th>
        <th scope="col">Owner</th>
        <th scope="col">Status</th>
        <th scope="col" class="as-table__cell--numeric" aria-sort="none">
          <button type="button" class="as-table__sort-btn">
            <span>Budget</span>
            <span class="as-table__sort-icon" aria-hidden="true">↕</span>
            <span class="as-sr-only">, sort ascending</span>
          </button>
        </th>
        <th scope="col" class="as-table__cell--actions"><span class="as-sr-only">Actions</span></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row" class="as-table__cell--header">Project Alpha</th>
        <td>Sarah Chen</td>
        <td><span class="as-badge">Active</span></td>
        <td class="as-table__cell--numeric">$14,500.00</td>
        <td class="as-table__cell--actions">
          <button type="button" class="as-button as-button--ghost" aria-label="Edit Project Alpha">Edit</button>
        </td>
      </tr>
      <tr>
        <th scope="row" class="as-table__cell--header">Project Beta</th>
        <td>Marcus Vance</td>
        <td><span class="as-badge">Pending</span></td>
        <td class="as-table__cell--numeric">$8,250.00</td>
        <td class="as-table__cell--actions">
          <button type="button" class="as-button as-button--ghost" aria-label="Edit Project Beta">Edit</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<!-- 2. Empty State Table Row -->
<tr class="as-table-row--empty">
  <td colspan="5">
    <div class="as-table-state-box">
      <p class="as-table-state-box__title">No projects found</p>
      <p class="as-table-state-box__desc">Try adjusting your filters or search terms.</p>
    </div>
  </td>
</tr>
```

### 4.4 Verified CSS Token Bindings

```css
/* Scrollable Table Container */
.as-table-container {
  width: 100%;
  background: var(--as-semantic-color-surface-card);
  border-radius: var(--as-space-4);
  box-shadow: inset 0 0 0 var(--as-elevation-border-hairline) color-mix(in srgb, var(--as-semantic-color-text-default) 11%, transparent);
  overflow: hidden;
}

.as-table-scroll {
  width: 100%;
  overflow-x: auto;
}

.as-table-scroll:focus-visible {
  outline: var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus);
  outline-offset: -3px;
}

/* Base Table */
.as-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-family: var(--as-typography-font-family-sans);
  font-size: var(--as-typography-font-size-base);
  color: var(--as-semantic-color-text-default);
  min-width: 640px;
}

.as-table__caption {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

/* Table Header */
.as-table__th {
  padding: 0 var(--as-space-4);
  height: var(--as-density-control-height);
  font-size: 12.5px;
  font-weight: var(--as-typography-font-weight-medium);
  color: var(--as-semantic-color-text-muted);
  white-space: nowrap;
  background: var(--as-semantic-color-surface-subtle);
  border-bottom: var(--as-elevation-border-hairline) solid color-mix(in srgb, var(--as-semantic-color-text-default) 9%, transparent);
}

.as-table th {
  background-color: var(--as-semantic-color-surface-subtle);
  color: var(--as-semantic-color-text-default);
  font-weight: var(--as-typography-font-weight-medium);
  padding: var(--as-space-2) var(--as-density-control-padding-x);
  border-bottom: var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-strong);
  white-space: nowrap;
}

/* Table Rows & Cells */
.as-table__row {
  transition:
    background-color var(--as-motion-duration-base) var(--as-motion-ease-out),
    box-shadow var(--as-motion-duration-base) var(--as-motion-ease-out);
}

.as-table__row:hover {
  background: color-mix(in srgb, var(--as-semantic-color-text-default) 3.5%, transparent);
}

.as-table tbody tr:hover {
  background-color: var(--as-semantic-color-surface-subtle);
}

.as-table--striped tbody tr:nth-child(even) {
  background-color: var(--as-semantic-color-surface-subtle);
}

.as-table__cell,
.as-table td {
  padding: 0 var(--as-space-4);
  height: var(--as-density-table-row-height);
  vertical-align: middle;
  font-weight: var(--as-typography-font-weight-regular);
  text-align: left;
  border-bottom: var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-subtle);
  box-sizing: border-box;
}

.as-table__cell--num,
.as-table__cell--numeric {
  font-family: var(--as-typography-font-family-mono);
  font-variant-numeric: tabular-nums;
  font-size: var(--as-typography-font-size-sm);
  text-align: right;
}

.as-table__cell--primary,
.as-table__cell--header {
  font-weight: var(--as-typography-font-weight-medium);
  font-family: var(--as-typography-font-family-mono);
  font-size: var(--as-typography-font-size-sm);
}

/* Sort Controls */
.as-table__sort,
.as-table__sort-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--as-space-1);
  background: transparent;
  border: none;
  padding: 5px 8px;
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
  cursor: pointer;
  border-radius: var(--as-radius-full);
  transition: background-color var(--as-motion-duration-base) var(--as-motion-ease-out);
}

.as-table__sort:focus-visible,
.as-table__sort-btn:focus-visible {
  outline: var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus);
  outline-offset: 1px;
}

.as-table__sort-icon {
  font-size: var(--as-typography-font-size-xs);
  color: var(--as-semantic-color-text-muted);
}

[aria-sort="ascending"] .as-table__sort-icon,
[aria-sort="descending"] .as-table__sort-icon {
  color: var(--as-semantic-color-interactive-primary);
}

/* Compact Density Override */
[data-density="compact"] .as-table td,
.as-table--compact td,
[data-density="compact"] .as-table__cell {
  height: var(--as-density-table-row-height); /* 32px Compact */
  padding: 0 var(--as-density-control-padding-x); /* 12px */
  font-size: var(--as-typography-font-size-sm);
}

[data-density="compact"] .as-table th,
.as-table--compact th,
[data-density="compact"] .as-table__th {
  padding: var(--as-space-1) var(--as-density-control-padding-x);
  font-size: var(--as-typography-font-size-xs); /* 12px */
  height: 32px;
}

/* State Box for Empty, Loading, and Error */
.as-table-state-box {
  padding: var(--as-space-6) var(--as-space-4);
  text-align: center;
  color: var(--as-semantic-color-text-muted);
}

.as-table-state-box__title {
  margin: 0 0 var(--as-space-1) 0;
  font-weight: var(--as-typography-font-weight-medium);
  color: var(--as-semantic-color-text-default);
}

.as-table-state-box__desc {
  margin: 0;
  font-size: var(--as-typography-font-size-xs);
}

@media (prefers-reduced-motion: reduce) {
  .as-table__sort,
  .as-table__sort-btn {
    transform: none !important;
  }
}
```

### 4.5 Unresolved Proposals & Future Patterns

The following enterprise table patterns are identified for future extension but remain **unresolved proposals**—they are not established Aster requirements for Phase 7C:

1. **Row Selection (Single & Multi-Select):**
   - *Status:* Unresolved Proposal.
   - *Current Safer Baseline:* Use native `<input type="checkbox">` elements in selection cells, managing the header checkbox's partial selection state via the DOM `indeterminate = true` property (do not treat `aria-checked="mixed"` as a universal mandate for native inputs; `aria-checked="mixed"` applies to custom `role="checkbox"` controls). Do not recommend or apply `aria-selected` to native `<tr>` elements without establishing that the chosen semantics support it across assistive technologies. Communicating selection through native checkbox states and polite live-region count announcements ("3 of 42 rows selected") remains the safer baseline until a comprehensive interaction model is decided.
   - *Decisions Needed Before Standardization:* Distinguishing native DOM `indeterminate` controls from custom ARIA checkboxes requiring `aria-checked="mixed"`, establishing supported row-selection semantics before adopting row-level attributes, live-region selection counter patterns, and keyboard range selection (`Shift + Click` / `Shift + Space`).
2. **Frozen / Pinned Columns:**
   - *Status:* Unresolved Proposal.
   - *Decisions Needed Before Standardization:* Stacking context and z-index coordination between sticky headers and frozen columns, ensuring frozen columns do not obscure keyboard focus during horizontal scrolling (WCAG 2.2 SC 2.4.11), and visual elevation indicators.
3. **Table Pagination Controls:**
   - *Status:* Unresolved Proposal.
   - *Decisions Needed Before Standardization:* Distinct landmark encapsulation (`<nav aria-label="Table pagination">`), focus management on page transitions, and polite live-region announcements of range updates.

---

## 5. Agent Quality Checklists

### 5.1 Button Component Checklist

When generating or reviewing button code, verify each item:

- [ ] **Native HTML:** Uses `<button>`, not `<div role="button">` or `<a href="#">`.
- [ ] **Explicit Type:** Declares `type="button"`, `type="submit"`, or `type="reset"`.
- [ ] **Accessible Name:** Has non-empty visible text or an explicit `aria-label`.
- [ ] **Semantic Tokens Only:** Binds strictly to `--as-semantic-color-*` and `--as-density-*`. No primitive colors.
- [ ] **Focus Visible:** Does not remove focus outlines (`outline: none`) without providing Aster's focus ring (`--as-elevation-border-focus` and `--as-semantic-color-border-focus`).
- [ ] **Target Size:** Target size satisfies WCAG 2.5.8 Level AA (minimum 24×24px; Aster buttons measure 40px comfortable / 32px compact).
- [ ] **Disabled-State Discipline:**
  - Uses native `<button disabled>` by default for ordinary disabled controls.
  - If `aria-disabled="true"` is used to retain keyboard focus, authoritative action handlers synchronously check disabled state before executing business logic, and form submission independently validates eligibility.
  - Applies defensive event cancellation (`e.preventDefault()`, `e.stopImmediatePropagation()`) on the `click` listener as an event-boundary safeguard.
  - Does NOT apply `pointer-events: none` in CSS to `[aria-disabled="true"]` buttons, so hover tooltips remain accessible to mouse and touch users.
  - Never attaches an explanatory tooltip directly to a native `<button disabled>`.
- [ ] **Loading-State Discipline:**
  - While loading, authoritative action handler and form submission synchronously reject duplicate activations.
  - When explicit announcement is required, uses a dedicated `role="status"` / `aria-live="polite"` region with a stable button accessible name, avoiding duplicate announcements.
  - Announcement timing and behavior are verified through manual assistive technology testing.

### 5.2 Input / Form Field Component Checklist

When generating or reviewing form field code, verify each item:

- [ ] **Explicit `<label>` Association:** Every `<input>` has a matching `<label for="[id]">`. Does not rely on `placeholder` alone.
- [ ] **No Floating Labels (Aster Convention):** Form fields use persistent, static top labels.
- [ ] **Explicit `type`:** Declares appropriate input `type` (e.g. `'text'`, `'email'`, `'password'`).
- [ ] **Rendered DOM Descriptions:** `aria-describedby` references valid DOM IDs rendered in the DOM. When helper and error both exist, lists both IDs without duplicating text or IDs.
- [ ] **Error Lifecycle & Scenario-Dependent Announcements:** Errors validate on `blur`/submit and clear on `input`. Form submission errors use deliberate focus management; field-level validation errors never steal focus. Dynamic announcements use scenario-dependent strategies (`aria-live="polite"` or managed focus), distinguishing structural `aria-describedby` association from runtime announcements.
- [ ] **Non-Color-Alone Error:** Error states combine red border with an error icon, error text prefix, and descriptive text message.
- [ ] **Semantic Tokens Only:** Styles bind strictly to `--as-semantic-color-*`, `--as-density-*`, `--as-space-*`, and `--as-radius-*`.
- [ ] **Dual-Density Support:** Uses `--as-density-control-height` (40px Comfortable, 32px Compact) without hardcoding fixed pixel heights.
- [ ] **Focus Visible & Child Control Focus:** Provides high-contrast 2px focus ring (`--as-elevation-border-focus` solid `--as-semantic-color-border-focus`). Every internal interactive child control retains its own distinct visible focus indicator, unobscured by wrapper treatment.
- [ ] **Target Size Verification (WCAG 2.5.8):** Verifies the full interactive target bounding box (including width, clickable padding, and any nested interactive buttons) and spacing exceptions, rather than assuming height alone satisfies compliance.
- [ ] **Informative Floor:** Helper and error font sizes adhere to `--as-typography-font-size-xs` (`12px`).

### 5.3 Data Table Component Checklist

When generating or reviewing table code, verify each item:

- [ ] **Native HTML Structure:** Uses native `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>`. Does not impose `role="grid"` on standard data display.
- [ ] **Accessible Title (Aster Convention):** Includes a descriptive native `<caption>` (visible or `.as-sr-only`).
- [ ] **Explicit Scope Attributes:** Column headers declare `<th scope="col">`; primary row identifier headers declare `<th scope="row">`.
- [ ] **Conditional Scrollable Region:** If wide data causes horizontal overflow (`scrollWidth > clientWidth`), `.as-table-container` conditionally declares `tabindex="0"`, `role="region"`, and an `aria-label` matching the caption. Does NOT set `tabindex="0"` when content fits without overflow.
- [ ] **Authoritative `aria-sort` (Recommended W3C Pattern):** `aria-sort` (`"ascending"`, `"descending"`, or `"none"`) is placed strictly on the `<th>`, with an interactive `<button>` inside.
- [ ] **Target Size Verification (WCAG 2.5.8):** Verifies the full interactive target bounding box (minimum 24×24px or applicable spacing/inline exceptions) for all interactive controls housed within cells, rather than assuming row height alone establishes compliance.
- [ ] **Non-text Contrast (SC 1.4.11):** Interactive controls, checkboxes, sort icons, and focus rings meet ≥3.0:1 contrast against adjacent surfaces; interior hairline dividing borders are decorative.
- [ ] **Numeric Alignment:** Numeric and monetary data columns use right alignment (`text-align: right`) and tabular figures.
- [ ] **Dual-Density Table Tokens:** Rows bind strictly to `--as-density-table-row-height` (44px Comfortable, 32px Compact).
- [ ] **Semantic Tokens Only:** Styles bind strictly to `--as-semantic-color-*`, `--as-density-*`, `--as-elevation-*`, and `--as-space-*`.
- [ ] **Focus Visible on Nested Controls:** Sort buttons, scroll containers (when focusable), and row actions display visible focus rings.

### 5.4 Checkbox Component Checklist

When generating or reviewing checkbox code, verify each item:

- [ ] **Native HTML:** Uses native `<input type="checkbox">` wrapped in `.as-checkbox-field`.
- [ ] **Indeterminate Support:** Sets `indeterminate = true` property and `aria-checked="mixed"` via `setCheckboxIndeterminate()`.
- [ ] **Focus Visible:** Provides high-contrast 2px focus ring (`--as-elevation-border-focus` solid `--as-semantic-color-border-focus`).
- [ ] **Target Size:** Outer hit boundary `.as-checkbox` satisfies minimum 24×24px (32px comfortable, 28px compact).
- [ ] **Semantic Tokens Only:** Binds strictly to `--as-semantic-color-interactive-primary`, `--as-semantic-color-border-strong`, `--as-semantic-color-surface-card`.

### 5.5 Radio Group Component Checklist

When generating or reviewing radio group code, verify each item:

- [ ] **Semantic Fieldset:** Groups radios inside `<fieldset class="as-radio-group">` with a `<legend>`.
- [ ] **Native HTML:** Uses native `<input type="radio">` with shared `name` attribute.
- [ ] **Arrow Navigation:** Relies on native browser keyboard focus and selection management.
- [ ] **Focus Visible:** Visible 2px focus ring renders on `:focus-visible`.
- [ ] **Target Size:** Touch boundary `.as-radio` satisfies minimum 24×24px (32px comfortable, 28px compact).

### 5.6 Switch Component Checklist

When generating or reviewing switch toggle code, verify each item:

- [ ] **Role Switch:** Input explicitly declares `role="switch"`.
- [ ] **Keyboard Operability:** Navigable via `Tab` and toggles on `Space`.
- [ ] **Reduced Motion:** Thumb slide transition collapses under `@media (prefers-reduced-motion: reduce)`.
- [ ] **Semantic Tokens Only:** Track binds to `--as-semantic-color-interactive-primary` (on) and `--as-semantic-color-surface-muted` (off).
- [ ] **Visible Focus:** 2px focus ring with 2px offset around track on `:focus-visible`.

### 5.7 Textarea Component Checklist

When generating or reviewing textarea code, verify each item:

- [ ] **Explicit Label:** Textarea has a matching `<label for="[id]">`.
- [ ] **No Floating Labels:** Uses persistent, static top labels.
- [ ] **Auto-Resize Option:** If dynamic height is desired, declares `data-auto-resize`.
- [ ] **Counter Synchronization:** Character count updates in real time against `maxlength`.
- [ ] **Focus Visible:** High-contrast 2px focus ring renders on `:focus-visible`.

### 5.8 Select Component Checklist

When generating or reviewing select dropdown code, verify each item:

- [ ] **Native Select Element:** Uses native `<select class="as-select">` with `<option>` children.
- [ ] **Pill Geometry:** Container `.as-select-box` matches control heights (40px comfortable, 32px compact).
- [ ] **Focus Visible:** High-contrast 2px focus ring renders on `:focus-visible`.
- [ ] **Chevron Decoration:** Chevron icon is marked `aria-hidden="true"`.
- [ ] **Semantic Tokens Only:** Binds strictly to `--as-semantic-color-surface-card` and `--as-semantic-color-border-strong`.

### 5.9 Slider Component Checklist

When generating or reviewing slider range code, verify each item:

- [ ] **Native Range Input:** Uses native `<input type="range" class="as-slider">`.
- [ ] **Progress Sync:** Custom property `--_progress` synchronizes dynamically with range value.
- [ ] **Visible Value:** Value indicator uses tabular numbers for stable visual display.
- [ ] **Focus Visible:** 2px focus ring with 4px offset renders on `:focus-visible`.
- [ ] **Keyboard Navigation:** Operable via arrow and paging keys natively.

### 5.10 Badge Component Checklist

When generating or reviewing badge code, verify each item:

- [ ] **Pill Geometry:** Uses `.as-badge` with full-pill radius.
- [ ] **Non-Color-Alone:** Never relies on background color alone; pairs with text or accessible description.
- [ ] **Contrast Compliance:** Badge text meets ≥4.5:1 contrast against badge background fill.
- [ ] **Dual Density:** Satisfies comfortable (24px) or compact (20px) height.

### 5.11 Alert Component Checklist

When generating or reviewing alert code, verify each item:

- [ ] **Accessible Role:** Dynamic critical alerts declare `role="alert"`; static alerts declare `role="region"`.
- [ ] **Decorative Icons:** Leading status icons declare `aria-hidden="true"`.
- [ ] **Dismissible Button:** Close button has explicit `aria-label="Dismiss alert"` and visible focus ring.
- [ ] **Semantic Tokens Only:** Binds strictly to `--as-semantic-color-surface-card` and semantic status colors.

### 5.12 Progress Component Checklist

When generating or reviewing progress bar code, verify each item:

- [ ] **Progress Role:** Element declares `role="progressbar"`.
- [ ] **Determinate Values:** Sets `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`.
- [ ] **Indeterminate Fallback:** Indeterminate omits `aria-valuenow`; animation collapses under reduced motion.
- [ ] **Accessible Label:** Progress bar has a visible label or `aria-label`.

### 5.13 Skeleton Component Checklist

When generating or reviewing skeleton placeholder code, verify each item:

- [ ] **Screen Reader Suppression:** Declares `aria-hidden="true"` to prevent uninformative announcements.
- [ ] **Parent Busy State:** Parent loading container declares `aria-busy="true"`.
- [ ] **Reduced Motion:** Shimmer wave animation is disabled under `prefers-reduced-motion: reduce`.

### 5.14 Tooltip Component Checklist

When generating or reviewing tooltip code, verify each item:

- [ ] **Programmatic Association:** Trigger button/input links to tooltip via `aria-describedby`.
- [ ] **WCAG 2.2 SC 1.4.13:** Tooltip is dismissible on `Escape`, hoverable without closing, and persistent.
- [ ] **No Essential Info Buried:** Crucial instructions remain visible in labels/helpers, not hidden in tooltips.

### 5.15 Toast Component Checklist

When generating or reviewing toast notification code, verify each item:

- [ ] **Live Region Container:** Toast container declares `role="region"` and `aria-label="Notifications"`.
- [ ] **Non-Disruptive Focus:** Toasts appear without stealing active keyboard focus.
- [ ] **Hover/Focus Pause:** Auto-dismiss timer pauses while user hovers or focuses the toast.
- [ ] **Accessible Close Button:** Includes a keyboard-operable close button with `aria-label="Dismiss notification"`.

### 5.16 Dialog Component Checklist

When generating or reviewing modal dialog code, verify each item:

- [ ] **Native Dialog Element:** Uses `<dialog class="as-dialog">` invoked via `showModal()`.
- [ ] **Accessible Title:** Declares `aria-labelledby` referencing the dialog title heading.
- [ ] **Focus Management:** Focus is trapped inside the dialog and restored to the trigger upon closure.
- [ ] **Escape Dismissal:** Pressing `Escape` or clicking the backdrop dismisses the dialog cleanly.
- [ ] **Close Button:** Provides an accessible close button with `aria-label="Close dialog"`.

### 5.17 Dropdown Menu Component Checklist

When generating or reviewing dropdown menu code, verify each item:

- [ ] **ARIA Roles:** Trigger declares `aria-haspopup="menu"` and `aria-expanded`; menu declares `role="menu"`; items declare `role="menuitem"`.
- [ ] **Roving Keyboard Focus:** Operable via ArrowDown/ArrowUp, Home, End with wrap-around focus.
- [ ] **Escape & Outside Dismiss:** Closes on `Escape` key and outside clicks, returning focus to trigger.
- [ ] **Destructive Variant:** High-risk actions use `.as-dropdown__item--destructive`.

### 5.18 Popover Component Checklist

When generating or reviewing popover code, verify each item:

- [ ] **Anchored Context:** Trigger declares `aria-haspopup="dialog"` and `aria-expanded`.
- [ ] **Light Dismissal:** Dismisses on outside clicks and `Escape` key.
- [ ] **Focus Restoration:** Restores focus to the trigger button upon dismissal.
- [ ] **Compact Density:** Respects `[data-density="compact"]` with reduced padding.

### 5.19 Tabs Component Checklist

When generating or reviewing tabbed navigation code, verify each item:

- [ ] **W3C APG Tablist Roles:** Uses `role="tablist"`, `role="tab"`, and `role="tabpanel"`.
- [ ] **Roving Tabindex:** Selected tab has `tabindex="0"`; unselected tabs have `tabindex="-1"`.
- [ ] **Arrow Navigation:** ArrowLeft/ArrowRight cycles tabs and synchronizes panel display.
- [ ] **Accessible Linkage:** Tab has `aria-controls="panel-id"`; panel has `aria-labelledby="tab-id"` and `tabindex="0"`.

### 5.20 Accordion Component Checklist

When generating or reviewing accordion code, verify each item:

- [ ] **Semantic Headings:** Each trigger button is enclosed within a semantic heading tag (`<h3>`, etc.).
- [ ] **ARIA Expansion:** Trigger declares `aria-expanded` and `aria-controls="panel-id"`.
- [ ] **Region Role:** Panel declares `role="region"` and `aria-labelledby="trigger-id"`.
- [ ] **Arrow Navigation:** Operable via ArrowDown/ArrowUp, Home, and End across headers.

### 5.21 Drawer Component Checklist

When generating or reviewing drawer side-sheet code, verify each item:

- [ ] **Modal Semantics:** Declares `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
- [ ] **Focus Trapping:** Tab and Shift+Tab cycle within the drawer while open.
- [ ] **Focus Restoration:** Restores focus cleanly to the activating trigger when closed.
- [ ] **Escape Dismissal:** Pressing `Escape` or clicking the backdrop dismisses the drawer.

