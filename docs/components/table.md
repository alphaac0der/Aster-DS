# Aster Data Table Component Contract

**Status:** APPROVED PROPOSAL (Phase 7C)  
**Design System Alignment:** Aligns with [Design Principles](../principles.md) and [DEC-007 / DEC-010](../../records/DECISION-LOG.md).

---

## 1. Component Overview & Table Anatomy

The Aster Data Table component contract defines the structural, dimensional, visual, and accessibility requirements for presenting tabular data in Aster applications.

Aster tables follow an **HTML-first semantic table structure**. They rely on native `<table>` elements and standard browser reading order rather than synthetic ARIA grids, ensuring optimal compatibility with screen readers, braille displays, and keyboard navigation.

```
+-----------------------------------------------------------------------------------+
| Caption / Table Title (Visible or Screen-Reader Only)                             |
+-----------------------------------------------------------------------------------+
| [Col Header 1 (Sortable)] | [Col Header 2]          | [Col Header 3 (Numeric)]    | <-- thead
+===================================================================================+
| Row 1 Header (ID / Name)  | Text Data               |                  $1,240.00  | <-- tbody tr
+-----------------------------------------------------------------------------------+
| Row 2 Header (ID / Name)  | Text Data               |                    $850.50  | <-- tbody tr
+-----------------------------------------------------------------------------------+
| Empty / Loading / Error Feedback Row (colspan="3")                                | <-- State Row
+-----------------------------------------------------------------------------------+
| Total / Summary Label     |                         |                  $2,090.50  | <-- tfoot tr
+-----------------------------------------------------------------------------------+
```

### Anatomical Sub-Elements

1. **Table Scroll Container (`.as-table-container`):**
   - Wrapper element providing horizontal overflow handling (`overflow-x: auto`) for wide datasets.
   - When actual horizontal overflow occurs, it conditionally acts as a keyboard-accessible scroll region (`tabindex="0"` with `role="region"` and `aria-label="[Table Name]"`). When content fits without overflow, `tabindex="0"` should not be set to avoid redundant tab stops.
2. **Table Element (`.as-table`):**
   - Native HTML `<table>` establishing table semantics. Not a composite ARIA grid (`role="grid"` is deliberately avoided for standard data display).
3. **Table Caption (`.as-table__caption`):**
   - Native `<caption>` element providing an unambiguous programmatic and visible (or `.as-sr-only`) title for the dataset. While WCAG allows accessible naming via various mechanisms, Aster adopts native `<caption>` as its preferred design system convention.
4. **Table Header (`<thead>` & `<th>`):**
   - Contains column header cells (`<th scope="col">`).
   - Sticky positioning (`position: sticky; top: 0`) is supported for tall scrolling tables.
5. **Sort Trigger (`.as-table__sort-btn`):**
   - When a column is sortable, the `<th>` contains a native `<button type="button">` with the column title and a directional sort icon.
   - The `<th>` element itself holds the authoritative `aria-sort` attribute (`"ascending"`, `"descending"`, or `"none"`), following W3C WAI-ARIA authoring practices.
6. **Table Body (`<tbody>` & `<tr>`):**
   - Contains data rows. Each row optionally features a primary identifier cell marked as `<th scope="row">` to establish row header context.
7. **Table Cells (`<td>`):**
   - Individual data cells. Content is aligned according to data type (text left-aligned, numeric data right-aligned, status badges left/center).
8. **Table Footer (`<tfoot>`):**
   - Optional summary or totals row at the bottom of the table.

---

## 2. Properties & Column Contract

### Table Container Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `caption` | `string` | — | **Mandatory.** Accessible table title or summary. Visible or `.as-sr-only`. |
| `striped` | `boolean` | `false` | Enables alternating row backgrounds (`--as-semantic-color-surface-subtle`). |
| `bordered` | `boolean` | `true` | Renders container and cell hairline borders. |
| `hoverable` | `boolean` | `true` | Highlights table rows on hover. |
| `scrollable` | `boolean` | `true` | Wraps table in an accessible horizontal scroll container. |

### Column Contract

| Property | Type | Default | Description |
|---|---|---|---|
| `key` | `string` | — | **Mandatory.** Unique column identifier. |
| `label` | `string` | — | **Mandatory.** Visible header label. |
| `isRowHeader` | `boolean` | `false` | Renders body cells in this column as `<th scope="row">`. |
| `align` | `'left' \| 'right' \| 'center'` | `'left'` | Text alignment. Numeric data must use `'right'`. |
| `sortable` | `boolean` | `false` | Enables interactive sorting on this column. |
| `sortOrder` | `'ascending' \| 'descending' \| 'none'` | `'none'` | Reflects current sort order in `aria-sort` on the `<th>`. |

---

## 3. Keyboard Navigation & Responsive Overflow

### 3.1 Keyboard Interaction Model (No Synthetic Grid)
- **Native Table Navigation:**
  Aster data tables represent structured tabular information, not interactive spreadsheet widgets. Therefore, Aster **strictly prohibits** imposing a custom ARIA grid interaction model (`role="grid"` with arrow-key roving tabindex) on standard data tables.
- **Screen Reader Navigation:**
  Native table markup allows assistive technologies to leverage built-in table navigation shortcuts (e.g. `Ctrl + Alt + Arrow Keys` in NVDA/JAWS, `VO + Arrow Keys` in VoiceOver) without custom JavaScript keyboard traps.
- **Interactive Control Focus:**
  Interactive elements nested within cells (e.g., sort buttons, action menus, checkboxes, links) reside in standard document tab order and are reached via `Tab` / `Shift+Tab`.

### 3.2 Responsive Overflow & Scroll Container Accessibility
When tables contain many columns or wide data, viewport constraints can induce horizontal overflow:
1. **Conditional Focusable Scroll Region (WCAG SC 2.1.1):**
   - When table content exceeds container width (`scrollWidth > clientWidth`), keyboard-only users must be able to scroll horizontally to access obscured columns.
   - In this overflowing scenario, the wrapper conditionally receives `tabindex="0"`, declares `role="region"`, and provides an accessible name matching the table's caption or purpose:
     ```html
     <div class="as-table-container" tabindex="0" role="region" aria-label="Active Projects Table">
       <table class="as-table">...</table>
     </div>
     ```
   - **Non-overflowing condition:** When all columns fit within the viewport without horizontal overflow, `tabindex="0"` and `role="region"` should be omitted or removed dynamically. Making a non-scrollable container focusable creates an unnecessary, redundant keyboard tab stop that provides no scrolling utility.
   - Keyboard users focus the scroll region via `Tab` / `Shift+Tab` and pan across columns using standard arrow keys (`Left Arrow` / `Right Arrow`).
2. **Focus Visibility:**
   - When the scroll container receives keyboard focus, it displays Aster's standard 2px focus ring (`outline: var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus); outline-offset: -2px;`).
3. **Sticky Headers (Usability Heuristic):**
   - Headers in vertically scrollable containers remain visible via `position: sticky; top: 0; z-index: 1;`.
   - Sticky headers retain an opaque background (`var(--as-semantic-color-surface-card)` or `var(--as-semantic-color-surface-subtle)`) and a bottom border to prevent underlying text from showing through.

---

## 4. Sorting Semantics & Accessible State Communication

### 4.1 Exposing Sort State via `aria-sort` on `<th>`
- In accordance with the W3C WAI-ARIA authoring practices (recommended pattern for WCAG SC 4.1.2), `aria-sort` belongs strictly on the column header `<th>` element, never on the nested `<button>`. Placing it on `<th>` ensures assistive technologies properly calculate and announce the column's sorted status when traversing the table grid or column headers.
- Supported values:
  - `aria-sort="ascending"`: Data sorted in ascending order.
  - `aria-sort="descending"`: Data sorted in descending order.
  - `aria-sort="none"`: Sortable column currently unsorted. (Alternatively, omit `aria-sort` on unsorted columns).

### 4.2 Interactive Sort Trigger
- The header cell contains a native `<button type="button" class="as-table__sort-btn">`.
- The button contains:
  1. Visible column title.
  2. Directional sort indicator icon (`aria-hidden="true"`).
  3. Screen-reader accessible cue describing the action that will occur on click (e.g. `<span class="as-sr-only">, sort ascending</span>`).

### 4.3 Dynamic Sort Order Announcements
- Changing `aria-sort` on a `<th>` updates the state for virtual cursor exploration, but does not interrupt the user with an immediate verbal announcement.
- When an asynchronous sort completes, the update should be announced via a dedicated polite live region (`<div role="status" aria-live="polite" class="as-sr-only">...</div>`), e.g.:
  `"Projects table sorted by Budget, descending."`

---

## 5. State Variations: Empty, Loading, and Error

When a table has no data, is fetching remote records, or encounters a query error, it displays a full-width state row using `<td colspan="[number of columns]">`:

### 5.1 Empty State (`.as-table-row--empty`)
- Displayed when a query returns zero results.
- Features a subtle illustration or icon, a clear title (e.g. "No projects found"), supporting guidance ("Try adjusting your search filters"), and an optional reset action button.

### 5.2 Loading State (`.as-table-row--loading`)
- Displayed during asynchronous data fetching.
- Sets `aria-busy="true"` on the `<table>` element.
- Displays a high-contrast progress spinner and text: `"Loading table data..."`.
- Routes status announcement through an auxiliary `role="status"` live region.

### 5.3 Error State (`.as-table-row--error`)
- Displayed when an API or query failure occurs.
- Displays an error icon, critical status message (`var(--as-semantic-color-status-critical-text)`), and a retry action button.

---

## 6. Standard Density & Responsive Dimensions

Aster Data Tables adhere to Aster's unified Standard density architecture:

| Dimensional Attribute | Standard Value | Canonical Token Binding |
|---|---|---|
| **Row Height (Baseline)** | `44px` | `var(--as-density-table-row-height)` |
| **Cell Vertical Padding** | `10px` | Derived to center text within row height |
| **Cell Horizontal Padding**| `16px` | `var(--as-density-control-padding-x)` |
| **Cell Typography Size** | `13px` (`0.8125rem`) | `var(--as-typography-font-size-sm)` |
| **Header Typography Size**| `13px` (`0.8125rem`) | `var(--as-typography-font-size-sm)` |
| **Header Font Weight** | `500` (Medium) | `var(--as-typography-font-weight-medium)` |
| **Border Divider Width** | `1px` | `var(--as-elevation-border-hairline)` |
| **Sort Icon Gap** | `4px` | `var(--as-space-1)` |

> [!NOTE]
> **Aster Convention & Target Size Separation:**
> Standard row height (44px) is an **Aster Convention** tuned for desktop telemetry and enterprise workstations.
> Setting a 44px row height does **not** by itself establish compliance with WCAG 2.5.8 Target Size (Minimum, Level AA) for interactive controls placed inside cells (e.g., checkboxes, action buttons, links). Each interactive target within a row must be evaluated independently for its actual bounding box (minimum 24×24px, or meeting spacing exceptions where a 24px diameter circle centered on the target does not overlap adjacent targets, or qualifying for inline text exceptions).

---

## 7. Canonical Token Bindings

All structural, surface, border, and typographical properties bind strictly to compiled CSS custom properties.

### Table Token Map

| Element / State | Property | Token Binding | Compiled Light / Dark Value |
|---|---|---|---|
| **Table Container** | Border | `var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-subtle)` | `1px solid #d3cec4` / `1px solid #211f1b` |
| | Border Radius | `var(--as-radius-md)` | `4px` |
| | Focus Ring | `var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus)` | `2px solid #2054d4` / `2px solid #60a5fa` |
| **Table Header (`th`)** | Background | `var(--as-semantic-color-surface-subtle)` | `#f3f1ec` / `#211f1b` |
| | Text | `var(--as-semantic-color-text-default)` | `#211f1b` / `#f3f1ec` |
| | Font Weight | `var(--as-typography-font-weight-medium)` | `500` |
| | Border Bottom | `var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-strong)` | `1px solid #857e72` / `1px solid #706b60` |
| **Table Row (`tr`)** | Default Fill | `var(--as-semantic-color-surface-card)` | `#ffffff` / `#171513` |
| | Border Bottom | `var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-subtle)` | `1px solid #d3cec4` / `1px solid #211f1b` |
| | Hover Fill | `var(--as-semantic-color-surface-subtle)` | `#f3f1ec` / `#211f1b` |
| | Striped Fill | `var(--as-semantic-color-surface-subtle)` | `#f3f1ec` / `#211f1b` |
| **Table Cell (`td`)** | Text | `var(--as-semantic-color-text-default)` | `#211f1b` / `#f3f1ec` |
| | Muted Text | `var(--as-semantic-color-text-muted)` | `#524d44` / `#d3cec4` |
| **Sort Button** | Text | `var(--as-semantic-color-text-default)` | `#211f1b` / `#f3f1ec` |
| | Focus Ring | `var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus)` | `2px solid #2054d4` / `2px solid #60a5fa` |
| **Sort Icon (Active)** | Color | `var(--as-semantic-color-interactive-primary)` | `#2054d4` / `#3b82f6` |
| **Sort Icon (Inactive)**| Color | `var(--as-semantic-color-text-muted)` | `#524d44` / `#d3cec4` |

---

## 8. Requirements & Classification Framework

### 8.1 Normative Requirements (WCAG 2.2 Level AA Mandates)
1. **Info and Relationships (SC 1.3.1 - Level A):**
   - Tables must expose programmatic relationships between data cells and header cells using native `<table>` elements and programmatic headers (`<th scope="col">` and `<th scope="row">`, or explicit `headers`/`id` associations for complex multi-tier tables).
   - The table must have a programmatically determinable accessible name (Aster normatively specifies native `<caption>`, visible or `.as-sr-only`).
2. **Text Contrast Minimum (SC 1.4.3 - Level AA):**
   - Header text and cell text must achieve ≥4.5:1 against their rendered background surfaces.
   - *Token-level verification:* In Aster's token hierarchy, default text achieves 16.45:1 (light card) and 16.13:1 (dark card). Muted text achieves 8.39:1 (light card) and 11.62:1 (dark card).
3. **Non-text Contrast (SC 1.4.11 - Level AA):**
   - Visual information required to identify user interface components and states (such as active focus indicators, interactive checkboxes, sort indicator icons, and critical status badges) must achieve ≥3.0:1 against adjacent surfaces.
   - *Decorative Divider Distinction:* Interior hairline table dividing borders (`--as-semantic-color-border-subtle`) are visual aids rather than essential functional controls; where table layout, whitespace, and column alignment clearly delineate cells, interior dividing lines are decorative and do not strictly require 3:1 under SC 1.4.11. Where borders are the sole visual indicator required to differentiate boundaries or interactive controls, 3:1 contrast is mandatory.
4. **Keyboard Operability (SC 2.1.1 - Level A):**
   - All interactive controls inside table cells (sort buttons, row actions, checkboxes, menu triggers) must be reachable and operable via keyboard.
   - Horizontally overflowing table containers must provide a keyboard mechanism for scrolling (conditionally focusable via `tabindex="0"` with arrow-key panning).
5. **Focus Visible (SC 2.4.7 - Level A) & Focus Not Obscured (SC 2.4.11 - Level AA):**
   - Sort buttons, interactive cell actions, and conditionally focusable scroll containers must display distinct, un-obscured focus indicators.
6. **Target Size (Minimum) (SC 2.5.8 - Level AA):**
   - Interactive targets inside table cells must have a minimum size of 24×24 CSS pixels, or satisfy one of the normative exceptions (e.g. spacing exception where the target plus space to adjacent targets satisfies a 24px diameter circle, inline text links, or browser-default controls).
7. **Name, Role, Value (SC 4.1.2 - Level A):**
   - Interactive controls (such as sort triggers and row action buttons) must expose their accessible name, role, and current state to assistive technologies.
   - Recommending `aria-sort` on `<th>` provides the standardized W3C WAI-ARIA mechanism to satisfy SC 4.1.2 for sortable column headers.

### 8.2 Evidence-Based Recommendations & Design Heuristics
1. **Data Alignment by Type:**
   - Align text columns to the left; align numeric and financial columns to the right. Right alignment facilitates rapid scanning of decimal places and magnitude.
2. **Sticky Headers Heuristic:**
   - For tables with more than ~15 rows in vertically scrolling viewports, sticky headers preserve column context during scrolling. This threshold is an Aster design heuristic, not an empirical WCAG mandate, and remains optional and context-dependent.
3. **Zebra Striping Heuristic:**
   - For tables with 6 or more columns, alternating row backgrounds (`--as-semantic-color-surface-subtle`) may reduce visual tracking errors across wide rows. This is an Aster recommendation and should be evaluated based on dataset density and display context.
4. **No ARIA Grid for Presentation Data:**
   - Standard data tables should not use `role="grid"` unless cells are actively editable like a spreadsheet. Native `<table>` navigation is superior for standard tabular consumption.

### 8.3 Aster Conventions (Internal System Rules)
1. **Preferred Table Caption (`<caption>`):**
   - While WCAG allows accessible naming via various attributes (`aria-label`, `aria-labelledby`, preceding headings), Aster establishes native `<caption>` (visible or `.as-sr-only`) as its standard component convention.
2. **Standard Row Height:**
   - 44px baseline row height (`--as-density-table-row-height`).
3. **2px Focus Ring:**
   - Aster's standard 2px focus ring (`--as-elevation-border-focus` solid `--as-semantic-color-border-focus`).
4. **12px Text Floor:**
   - Status badges and metadata within cells adhere to the 12px floor (`--as-typography-font-size-xs`).

---

## 9. Accessibility Scope Disclosure & Implementation Boundaries

> [!WARNING]
> **Accessibility Scope Disclosure:** Token contrast tests verify mathematical color ratios between paired foreground and background tokens in isolation. They **do not prove** complete WCAG compliance of an assembled table in a live application.
> Complete compliance requires verifying:
> 1. Real screen reader virtual cursor navigation across rows and columns (NVDA, JAWS, VoiceOver).
> 2. Correct header announcement when navigating between cells across complex multi-column structures.
> 3. Horizontal scrolling operability via keyboard arrow keys on `.as-table-container` across browsers when overflowing.
> 4. Audible verification of asynchronous sorting announcements via polite live regions.
> 5. Evaluation of actual target sizes and spacing for all interactive controls housed inside cells under WCAG 2.5.8.

---

## 10. Unresolved Proposals & Future Patterns

The following enterprise table patterns are identified for future extension but remain **unresolved proposals**—they are not established Aster requirements for Phase 7C:

1. **Row Selection (Single & Multi-Select):**
   - *Status:* Unresolved Proposal.
   - *Current Safer Baseline:* Use native `<input type="checkbox">` controls within selection cells. For multi-row selection, the header checkbox reflects partial selection via the DOM `indeterminate = true` property (rather than treating `aria-checked="mixed"` as a universal mandate for native inputs; `aria-checked="mixed"` applies to custom `role="checkbox"` widgets). Do not recommend or apply `aria-selected` to native `<tr>` elements without establishing that the chosen table semantics reliably support it across assistive technologies. Communicating selection through native checkbox states and polite live-region count announcements ("3 of 42 rows selected") remains the safer baseline until a comprehensive interaction model is decided.
   - *Decisions Needed Before Standardization:*
     - Distinguishing native DOM `indeterminate` controls from custom ARIA checkboxes requiring `aria-checked="mixed"`.
     - Establishing supported row-selection semantics before adopting row-level attributes.
     - Live-region selection count announcement patterns.
     - Keyboard interaction model for range selection (e.g. `Shift + Click` or `Shift + Space`).
2. **Frozen / Pinned Columns:**
   - *Status:* Unresolved Proposal.
   - *Decisions Needed Before Standardization:*
     - Stacking context and z-index coordination between sticky headers and sticky left/right columns.
     - Ensuring pinned columns do not obscure keyboard focus during horizontal scrolling (WCAG 2.2 SC 2.4.11 Focus Not Obscured).
     - Visual elevation and shadow treatment to indicate frozen boundaries when scrolling.
3. **Table Pagination Controls:**
   - *Status:* Unresolved Proposal.
   - *Decisions Needed Before Standardization:*
     - Packaging pagination as a distinct landmark (`<nav aria-label="Table pagination">`) outside the `<table>` element.
     - Focus management strategy upon page transition (retaining focus on navigation control vs moving to table caption or first cell).
     - Live-region announcement strategy for page changes and range updates ("Showing rows 26 to 50 of 250").
