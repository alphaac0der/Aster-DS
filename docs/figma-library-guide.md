# Aster Design System — Native Figma Library Guide

This guide describes the architecture, installation, and usage of the **Aster DS Figma Library MVP**, synchronized with [`aster-ds@0.0.1`](https://www.npmjs.com/package/aster-ds) and the canonical token definitions in Git.

---

## 1. Library Overview & System Architecture

Aster DS provides a genuine, native Figma library featuring:
- **82 Design Variables** across 3 native collections (`Aster Colors`, `Aster Density`, `Aster Dimensions`) with dual `Light` / `Dark` mode support.
- **8 Native Typography Text Styles** implementing the four-role typography system (`Bebas Neue` Display, `Manrope` Body, `Space Mono` Code/Data, `Merriweather` Editorial).
- **3 Native Elevation Effect Styles** (`None`, `Raised`, `Overlay`).
- **3 Production Component Sets** (`Button`, `Input`, `Badge`) built with native Auto Layout, component properties, and direct token variable bindings.

### Budget & Zero-Cost Architecture
Figma's remote REST API for variables is restricted to paid Enterprise accounts ($75/editor/month). Aster DS maintains a strict **$0 budget constraint** by delivering native Figma automation via the **Figma Desktop Plugin API (`figma.*`)**, which is 100% free across all Figma plans (Free, Starter, Education, and Professional).

---

## 2. Automated 1-Click Setup via Local Plugin (Recommended)

Aster DS includes a dedicated local setup plugin located in [`tools/figma-plugin/`](../tools/figma-plugin/). It reads the canonical token payloads and programmatically builds the collections, styles, and component sets in seconds.

### Prerequisites
- Figma Desktop App (macOS or Windows) on any free or paid plan.
- Cloned Aster DS repository on your computer.

### Step-by-Step Installation & Execution

1. **Open Figma:**
   - Launch the Figma Desktop App and open any new or existing design file where you want to host the library.

2. **Import the Plugin from Manifest:**
   - Click the Figma main menu (top-left dropdown or `Ctrl+/` / `Cmd+/`).
   - Navigate to **Plugins** > **Development** > **Import plugin from manifest...**.
   - In the file picker, select:
     ```
     tools/figma-plugin/manifest.json
     ```
     *(Located inside your cloned Aster DS repository folder)*
   - Figma will register `Aster DS Library Setup` under your Development plugins.

3. **Run the Setup:**
   - Go to **Plugins** > **Development** > **Aster DS Library Setup** (or search for it in the Quick Actions bar).
   - Click to run.

4. **What the Plugin Executes Idempotently:**
   - **Collections:** Creates or updates `Aster Colors` (58 variables with `Light` and `Dark` modes), `Aster Density` (6 variables with `Standard` mode), and `Aster Dimensions` (18 variables with `Value` mode).
   - **Styles:** Creates or updates the 8 native Text Styles and 3 Elevation Effect Styles.
   - **Library Canvas:** Creates a dedicated page titled `❖ Aster DS Library` containing a container frame titled `❖ Aster Components`.
   - **Component Sets:** Constructs the native Auto Layout component sets for **Button**, **Input**, and **Badge** with all supported variants, states, and variable bindings.
   - **Idempotency & Safety:** Re-running the plugin safely updates existing Aster collections, styles, and the `❖ Aster Components` frame without duplicating assets or altering any unrelated user pages or layers.

---

## 3. Alternative Manual Workflow via Community Plugin

For teams that prefer manual control or cannot run developer plugins:

1. **Install Free Community Plugin:**
   - Install **"Export/Import Variables" by Honza Toman** from the Figma Community (free, $0).
2. **Import Generated Token Payloads:**
   - Open the plugin and click **Import**.
   - Import `dist/figma/aster-colors.json` (creates `Aster Colors` with Light/Dark modes).
   - Import `dist/figma/aster-density.json` (creates `Aster Density` with Standard mode).
   - Import `dist/figma/aster-dimensions.json` (creates `Aster Dimensions` with Value mode).
3. **Create Typography Text Styles Manually:**
   - Follow the typography table in Section 4 below to create the 8 text styles.
4. **Create Elevation Effect Styles Manually:**
   - Follow the elevation table in Section 4 below to create the effect styles.
5. **Assemble Components:**
   - Follow the Auto Layout and token binding specifications in Section 5 below.

---

## 4. Typography & Elevation Style Specifications

### A. Typography Text Styles

| Style Name | Font Family | Weight | Size | Line Height | Letter Spacing | Description |
|---|---|---|---|---|---|---|
| `Aster / Display (Hero)` | Bebas Neue | Regular (400) | 36px | 100% | 0 | Display and hero headline typography |
| `Aster / Body (Regular)` | Manrope | Regular (400) | 14px | 145% | 0 | Standard interface text and body copy |
| `Aster / Body (Medium)` | Manrope | Medium (500) | 14px | 145% | 0 | Interactive button and control label text |
| `Aster / Body Large (Title)` | Manrope | SemiBold (600) | 16px | 125% | 0 | Card titles and section headings |
| `Aster / Label (Small)` | Manrope | Medium (500) | 11px | 16px | 5% (0.05em) | Uppercase form field label text |
| `Aster / Code & Data (Mono)` | Space Mono | Regular (400) | 12px | 145% | 0 | Technical data, measurements, and code snippets |
| `Aster / Badge (Mono)` | Space Mono | Bold (700) | 11px | 120% | 0 | Compact status badge tags |
| `Aster / Editorial (Serif)` | Merriweather | Regular (400) | 16px | 160% | 0 | Expressive editorial callouts and quotes |

### B. Elevation Effect Styles

| Style Name | Type | Offset X/Y | Blur | Spread | Color (Hex/Alpha) | Description |
|---|---|---|---|---|---|---|
| `Aster / Elevation / None` | Drop Shadow | 0 / 0 | 0 | 0 | Transparent | Flat surface with zero drop shadow |
| `Aster / Elevation / Raised` | Drop Shadow | 0 / 2px | 4px | 0 | `rgba(0, 0, 0, 0.04)` | Subtle ambient lift for dropdown menus and tooltips |
| `Aster / Elevation / Overlay` | Drop Shadow | 0 / 8px | 24px | 0 | `rgba(0, 0, 0, 0.12)` | Floating modal dialogs and drawers |

---

## 5. Component Set Specifications & Variant Matrices

Aster DS components in Figma are structured as structured 2D matrices inside elevated showcase cards, matching the SaaS design standards of the web documentation.

### A. Button Component Set (`Button`)

- **Anatomy:** Horizontal Auto Layout, center aligned.
- **Dimensions & Geometry:**
  - Control Height: `40px` (bound to `density/control/height`).
  - Horizontal Padding: `24px` (bound to `dimensions/space/6`).
  - Vertical Padding: `8px` (bound to `dimensions/space/2`).
  - Corner Radius: `9999px` (bound to `dimensions/radius/full`).
  - Inner Gap: `8px` (bound to `dimensions/space/2`).
- **Typography:** `Aster / Body (Medium)` (`Manrope Medium 14px`).
- **Icons:** Embedded native Phosphor SVG vectors (16×16px) with component layer controls:
  - Leading Icon: `Sparkle` or `Plus`
  - Trailing Icon: `ArrowRight`
- **Matrix Layout:** 5 Columns (`default`, `hover`, `pressed`, `focus`, `disabled`) × 4 Rows (`primary`, `secondary`, `destructive`, `ghost`).
  - Column spacing: 190px.
  - Row spacing: 82px.
  - Explicit uppercase column headers (`DEFAULT`, `HOVER`, etc.) in `Space Mono 11px`.
- **Component Token Bindings:**
  - `primary`: Fill bound to `semantic/color/interactive/primary`, label bound to `semantic/color/interactive/primary/text`.
  - `secondary`: Fill bound to `semantic/color/surface/card`, label bound to `semantic/color/text/default`, 1px inside border bound to `semantic/color/border/subtle` for clear canvas contrast.
  - `destructive`: Fill bound to `semantic/color/surface/critical`, label bound to `semantic/color/status/critical/text`, 1px inside border bound to `semantic/color/status/critical/text`.
  - `ghost`: Transparent fill, label bound to `semantic/color/text/default`.
  - `hover` state: Elevated contrast and cursor reaction.
  - `pressed` state: Scaled inward depth.
  - `focus` state: 2px outside border bound to `semantic/color/border/focus` with glass glow effect.
  - `disabled` state: 45% layer opacity, muted text.

---

### B. Input / Form Field Component Set (`Input`)

- **Anatomy:** Vertical Auto Layout containing:
  1. **Label Row:** Label text (`CLUSTER ID *`) in `Aster / Label (Small)` (`Manrope Medium 11px uppercase`, 0.05em tracking).
  2. **Control Box (`.as-input-box`):**
     - Height: `44px` (bound to `density/control/height`).
     - Corner Radius: `4px` (`dimensions/radius/sm`).
     - Padding: `0 12px` (`dimensions/space/3`).
     - Inside Stroke: `1px` or `2px`.
     - Leading Icon: Phosphor `Search` SVG (16×16px).
     - Text Area: Placeholder / Value in `Aster / Body (Regular)` (`Manrope Regular 14px`).
     - Trailing Action Icon: Phosphor `Eye` SVG (16×16px).
  3. **Status / Helper Row:**
     - Status Icon: Phosphor `Info` or `XCircle` SVG (14×14px).
     - Message Text in `Aster / Label (Small)` (`11px`).
- **Matrix Layout:** 5 Columns arranged side-by-side (spaced 228px apart) for all 5 interactive states:
  - `default`: 1px stroke `semantic/color/border/subtle`, muted helper text.
  - `hover`: 1px stroke `semantic/color/text/muted`, crisp contrast.
  - `focus`: 2px stroke `semantic/color/border/focus`, glass glow effect.
  - `invalid`: 1.5px stroke `semantic/color/status/critical/text`, critical error message and `xCircle` icon.
  - `disabled`: 50% opacity, `semantic/color/border/subtle`, read-only appearance.

---

### C. Badge Component Set (`Badge`)

- **Anatomy:** Horizontal Auto Layout, center aligned.
- **Dimensions & Geometry:**
  - Height: `22px`.
  - Horizontal Padding: `10px` (bound to `dimensions/space/2.5`).
  - Vertical Padding: `4px` (bound to `dimensions/space/1`).
  - Corner Radius: `9999px` (bound to `dimensions/radius/full`).
  - Gap: `4px` (bound to `dimensions/space/1`).
- **Typography:** `Aster / Badge (Mono)` (`Space Mono Bold 11px uppercase`).
- **Matrix Layout:** 2 Columns (`HAS DOT: TRUE`, `HAS DOT: FALSE`) × 6 Rows (`DEFAULT`, `MUTED`, `SUCCESS`, `WARNING`, `CRITICAL`, `INFO`).
  - Column spacing: 220px.
  - Row spacing: 52px.
- **Component Token Bindings:**
  - `default`: Fill `semantic/color/surface/subtle`, text `semantic/color/text/default`.
  - `muted`: Fill `semantic/color/surface/subtle`, text `semantic/color/text/muted`.
  - `success`: Fill `semantic/color/surface/success`, text `semantic/color/status/success/text`.
  - `warning`: Fill `semantic/color/surface/warning`, text `semantic/color/status/warning/text`.
  - `critical`: Fill `semantic/color/surface/critical`, text `semantic/color/status/critical/text`.
  - `info`: Fill `semantic/color/surface/focus`, text `semantic/color/status/focus/text`.
  - Status Dot: 6×6px circular ellipse with fill dynamically bound to the current tone's text color.

---

## 6. Live Contextual Showcase & Presentation Artboard

In addition to raw component sets, the library automatically renders a live **Contextual Composition Showcase** card to demonstrate how Aster components behave when composed in real-world application views:

- **Artboard Styling:**
  - Background: Studio canvas (`#F5F5F7`).
  - Section Containers: Elevated white cards (`#FFFFFF`, 16px radius, 1px border `#E0E0E0`, `Aster / Elevation / Raised` drop shadow).
  - Header Hero: Displays version badges, statistics, and system overview.
- **"Deploy Service Cluster" Showcase Dialog:**
  - Header with icon, title (`Manrope SemiBold 16px`), subtitle, and `success` status badge (`ONLINE • HEALTHY`).
  - Form area incorporating the `Input` component set instance configured for production cluster naming.
  - Metric callout row displaying cluster specs with `Space Mono` typography.
  - Footer actions pairing `Secondary` ("Cancel") and `Primary` ("Deploy Cluster") `Button` components.

---

## 7. Verification Checklist for Designers

Once the plugin completes in Figma, verify the library with these steps:

1. **Variables Inspection:**
   - Open **Local variables** from the right-hand panel.
   - Verify `Aster Colors` displays 58 variables with **Light** and **Dark** column headers.
   - Verify `Aster Density` displays 6 variables with the **Standard** column header.
   - Verify `Aster Dimensions` displays 18 variables with the **Value** column header.
2. **Styles Inspection:**
   - Open the **Text styles** panel: confirm all 8 styles exist under `Aster / ...`.
   - Open the **Effect styles** panel: confirm all 3 styles exist under `Aster / Elevation / ...`.
3. **2D Matrix & Visual Quality Check:**
   - Navigate to the `❖ Aster DS Library` page.
   - Inspect the **Button** card: confirm 4 rows by 5 columns of cleanly spaced pill buttons with crisp typography and Phosphor icons.
   - Inspect the **Input** card: confirm 5 distinct state columns with label, search icon, trailing action, and helper row.
   - Inspect the **Badge** card: confirm 6 tone rows with bold Space Mono typography and status dots.
   - Inspect the **In-Context Showcase** card: confirm the realistic "Deploy Service Cluster" dialog composition.
4. **Interactive Mode Switching Test:**
   - Select the `❖ Aster Components` frame (or any component instance).
   - In the right-hand sidebar under **Layer**, click the mode selector icon next to `Aster Colors` and switch from **Light** to **Dark**.
   - Confirm all button backgrounds, text ink, input surfaces, and badge containers dynamically invert to dark mode tokens!

