# Aster Design System — Tabs Component Specification

Canonical Component Contract for Aster Navigation Tabs.

---

## 1. Anatomy / Overview

The Tabs component organizes related content into multiple switchable views within a single container. It implements the W3C WAI-ARIA Authoring Practices Guide (APG) Tabs Pattern with roving `tabindex`, automatic selection on arrow navigation, and synchronized panel display.

### Structure

```html
<div class="as-tabs" id="tabs-cluster-view">
  <div class="as-tabs__list" role="tablist" aria-label="Cluster Management Tabs" aria-orientation="horizontal">
    <button type="button" class="as-tabs__tab is-active" role="tab" id="tab-nodes" aria-selected="true" aria-controls="panel-nodes" tabindex="0">
      Worker Nodes
    </button>
    <button type="button" class="as-tabs__tab" role="tab" id="tab-storage" aria-selected="false" aria-controls="panel-storage" tabindex="-1">
      Storage Volumes
    </button>
    <button type="button" class="as-tabs__tab" role="tab" id="tab-networking" aria-selected="false" aria-controls="panel-networking" tabindex="-1">
      Networking
    </button>
  </div>
  <div class="as-tabs__panel is-active" role="tabpanel" id="panel-nodes" aria-labelledby="tab-nodes" tabindex="0">
    <p>Worker node status and metrics...</p>
  </div>
  <div class="as-tabs__panel" role="tabpanel" id="panel-storage" aria-labelledby="tab-storage" tabindex="0" hidden>
    <p>Persistent storage volume attachments...</p>
  </div>
  <div class="as-tabs__panel" role="tabpanel" id="panel-networking" aria-labelledby="tab-networking" tabindex="0" hidden>
    <p>VPC and subnet routing tables...</p>
  </div>
</div>
```

---

## 2. Properties / Variants Contract

| Element / Class | Type | Required | Description |
|---|---|---|---|
| `.as-tabs` | Container | Yes | Wrapper element encompassing tablist and associated panels |
| `.as-tabs__list` | Header | Yes | Tab container declaring `role="tablist"` and `aria-orientation="horizontal"` |
| `.as-tabs__tab` | Tab Button | Yes | Interactive tab declaring `role="tab"`, `aria-selected`, `aria-controls`, and roving `tabindex` |
| `.as-tabs__panel` | Panel | Yes | Content panel declaring `role="tabpanel"`, `tabindex="0"`, and `aria-labelledby` |
| `.is-active` | State Class | Optional | Visual active state styling corresponding to `aria-selected="true"` |

### Standard Geometry & Spacing
Tabs adhere to Aster's unified Standard density scale, receiving `var(--as-space-2) var(--as-space-3)` padding and `var(--as-typography-font-size-base)` font size.

---

## 3. Interaction & Accessibility

- **Keyboard Navigation (W3C APG):**
  - **Left / Right Arrow:** Navigates between tabs horizontally, wrapping around edges, immediately updating selection and revealing the controlled panel.
  - **Home / End:** Moves selection to the first or last tab in the tablist.
  - **Tab Key:** Moves focus into the currently selected tabpanel (which declares `tabindex="0"` for accessible scrolling).
- **Roving Tabindex:** Only the active tab receives `tabindex="0"`; inactive tabs receive `tabindex="-1"`.
- **Panel Linkage:** Each tab declares `aria-controls="panel-id"`, and each panel declares `aria-labelledby="tab-id"`.

---

## 4. Canonical Token Bindings

```css
/* Tab Typography & Text */
font-family: var(--as-typography-font-family-sans);
font-size: var(--as-typography-font-size-base);
font-weight: var(--as-typography-font-weight-medium);
color: var(--as-semantic-color-text-muted);

/* Active Tab Highlight */
color: var(--as-semantic-color-interactive-primary);
border-bottom-color: var(--as-semantic-color-interactive-primary);

/* Hover State */
color: var(--as-semantic-color-text-default);

/* Tablist Divider */
border-bottom: var(--as-elevation-border-hairline) solid var(--as-semantic-color-border-subtle);

/* Focus Outline */
outline: var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus);

/* Spacing */
padding: var(--as-space-2) var(--as-space-3);
gap: var(--as-space-1);
```

---

## 5. Requirements Classification

- **SHALL** declare `role="tablist"` on the tab bar and `role="tab"` on interactive tab controls.
- **SHALL** maintain roving `tabindex="0"` on the selected tab and `tabindex="-1"` on all unselected tabs.
- **SHALL** synchronize `aria-selected="true/false"` and panel `hidden` state upon selection.
- **SHALL** support ArrowLeft/ArrowRight, Home, and End keyboard cycling.
- **SHALL** ensure tabpanels declare `tabindex="0"` to allow keyboard users to scroll panel contents.

---

## 6. Scope Disclosure & Boundaries

- Aster Tabs component supports horizontal tab orientation. Vertical tablists are not recommended in standard layouts to preserve predictable keyboard navigation.
