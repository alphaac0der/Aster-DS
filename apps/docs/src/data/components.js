export const componentsData = {
  "button": {
    "slug": "button",
    "name": "Button",
    "category": "Form Controls",
    "description": "Tactile 40px pill button with 24px left/right padding, Shade-DS cursor-origin circular hover fill, accessible async loading state, and monochrome primary contrast.",
    "element": "<button>",
    "status": "Production",
    "previewHtml": "<div style=\"display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 660px;\">\n        <div style=\"display: flex; flex-wrap: wrap; gap: 12px; align-items: center;\">\n          <button type=\"button\" class=\"as-button as-button--primary\" id=\"btn-primary\">\n            <span class=\"as-button__label\">Primary</span>\n          </button>\n          <button type=\"button\" class=\"as-button as-button--secondary\">\n            <span class=\"as-button__label\">Secondary</span>\n          </button>\n          <button type=\"button\" class=\"as-button as-button--destructive\">\n            <span class=\"as-button__label\">Destructive</span>\n          </button>\n          <button type=\"button\" class=\"as-button as-button--ghost\">\n            <span class=\"as-button__label\">Ghost</span>\n          </button>\n        </div>\n        <div style=\"display: flex; flex-wrap: wrap; gap: 12px; align-items: center; padding-top: 12px; border-top: 1px dashed var(--doc-line);\">\n          <button type=\"button\" class=\"as-button as-button--primary\" data-sim-save=\"true\">\n            <span class=\"as-button__label\">Click to Save</span>\n          </button>\n          <button type=\"button\" class=\"as-button as-button--secondary\" id=\"aria-target\" aria-disabled=\"true\">\n            <span class=\"as-button__label\">Focus-retaining disabled</span>\n          </button>\n          <button type=\"button\" class=\"as-button as-button--secondary\" id=\"aria-toggle\">\n            <span class=\"as-button__label\">Enable it</span>\n          </button>\n        </div>\n      </div>",
    "codeSnippet": "<!-- Primary Monochrome Pill Action (40px height, 24px horizontal padding) -->\n<button type=\"button\" class=\"as-button as-button--primary\">\n  <span class=\"as-button__label\">Deploy Cluster</span>\n</button>\n\n<!-- Secondary Outlined Action -->\n<button type=\"button\" class=\"as-button as-button--secondary\">\n  <span class=\"as-button__label\">Cancel</span>\n</button>\n\n<!-- Destructive & Ghost Actions -->\n<button type=\"button\" class=\"as-button as-button--destructive\">\n  <span class=\"as-button__label\">Terminate Node</span>\n</button>\n<button type=\"button\" class=\"as-button as-button--ghost\">\n  <span class=\"as-button__label\">Inspect Logs</span>\n</button>",
    "promptSnippet": "# Aster Component Implementation Prompt — Button\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Button (`button`)\n- **Category:** Form Controls\n- **Native Element:** `<button>`\n- **Summary:** Tactile 40px pill button with 24px left/right padding, Shade-DS cursor-origin circular hover fill, accessible async loading state, and monochrome primary contrast.\n- **When to Use:** Form submissions, modal confirmations, workflow triggers, and primary commands.\n- **When Not to Use:** Navigating between pages or documentation sections (use semantic <a> anchor elements).\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/button/button.css`\n- **Component Spec:** `docs/components/button.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<!-- Primary Monochrome Pill Action (40px height, 24px horizontal padding) -->\n<button type=\"button\" class=\"as-button as-button--primary\">\n  <span class=\"as-button__label\">Deploy Cluster</span>\n</button>\n\n<!-- Secondary Outlined Action -->\n<button type=\"button\" class=\"as-button as-button--secondary\">\n  <span class=\"as-button__label\">Cancel</span>\n</button>\n\n<!-- Destructive & Ghost Actions -->\n<button type=\"button\" class=\"as-button as-button--destructive\">\n  <span class=\"as-button__label\">Terminate Node</span>\n</button>\n<button type=\"button\" class=\"as-button as-button--ghost\">\n  <span class=\"as-button__label\">Inspect Logs</span>\n</button>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** 40px (--as-density-control-height)\n- **Horizontal Padding:** 24px left / 24px right (--as-space-6)\n- **Vertical Padding:** 8px top / 8px bottom (--as-density-control-padding-y)\n- **Corner Radius:** 9999px (--as-radius-full)\n- **Typography:** Manrope · 14px (--as-typography-font-size-sm) · 500 Medium\n- **Icon / Secondary Control:** 16px icon · 8px gap (--as-space-2)\n- **Focus Ring:** 2px solid (--as-semantic-color-border-focus) + 2px offset\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Control Height",
        "value": "40px",
        "token": "--as-density-control-height",
        "type": "Fixed"
      },
      {
        "property": "Horizontal Padding (Left / Right)",
        "value": "24px / 24px",
        "token": "--as-space-6",
        "type": "Fixed"
      },
      {
        "property": "Vertical Padding (Top / Bottom)",
        "value": "8px / 8px",
        "token": "--as-density-control-padding-y",
        "type": "Fixed"
      },
      {
        "property": "Minimum Width",
        "value": "64px (40px icon-only)",
        "token": "--as-space-16",
        "type": "Content-Dependent (expands with label)"
      },
      {
        "property": "Corner Radius",
        "value": "9999px (Full Pill)",
        "token": "--as-radius-full",
        "type": "Fixed"
      },
      {
        "property": "Typography",
        "value": "Manrope, 14px, weight 500, line-height 1.2",
        "token": "--as-typography-font-family-sans / --as-typography-font-size-sm",
        "type": "Fixed"
      },
      {
        "property": "Icon & Spinner Size / Gap",
        "value": "16px × 16px icon, 8px internal gap",
        "token": "--as-space-2",
        "type": "Fixed"
      },
      {
        "property": "Border & Focus Ring",
        "value": "1px solid border; 2px solid focus ring + 2px offset",
        "token": "--as-semantic-color-border-focus",
        "type": "Fixed"
      }
    ],
    "spec": {
      "height": "40px (--as-density-control-height)",
      "paddingX": "24px left / 24px right (--as-space-6)",
      "paddingY": "8px top / 8px bottom (--as-density-control-padding-y)",
      "radius": "9999px (--as-radius-full)",
      "typography": "Manrope · 14px (--as-typography-font-size-sm) · 500 Medium",
      "iconGap": "16px icon · 8px gap (--as-space-2)",
      "focusRing": "2px solid (--as-semantic-color-border-focus) + 2px offset"
    }
  },
  "input": {
    "slug": "input",
    "name": "Input & Form Field",
    "category": "Form Controls",
    "description": "Single-line 44px text input with 4px corner radius (Shade-DS Radius.S), Canvas #121212 background, and double 1px glass glow (zero wireframe outline).",
    "element": "<input>",
    "status": "Production",
    "previewHtml": "<div style=\"max-width: 440px; width: 100%; display: flex; flex-direction: column; gap: 16px;\">\n        <div class=\"as-form-field\" id=\"field-demo-cluster\" style=\"margin-bottom: 0;\">\n          <label class=\"as-form-field__label\" for=\"in-ws\">Workspace Identifier</label>\n          <div class=\"as-input-box\">\n            <input class=\"as-input\" type=\"text\" id=\"in-ws\" name=\"workspace\" placeholder=\"e.g. acme-platform\" value=\"acme-platform\" data-validate=\"slug\" aria-describedby=\"in-ws-help in-ws-err\" />\n            <button type=\"button\" class=\"as-input__action\" data-clear-for=\"in-ws\" id=\"btn-in-ws-clear\" aria-label=\"Clear workspace name\">\n              <svg class=\"as-icon\" aria-hidden=\"true\"><use href=\"#i-x\"/></svg>\n            </button>\n          </div>\n          <p class=\"as-form-field__helper\" id=\"in-ws-help\">Lowercase letters, numbers, and hyphens only.</p>\n          <p class=\"as-form-field__message as-form-field__error\" id=\"in-ws-err\" hidden><svg class=\"as-icon\" aria-hidden=\"true\"><use href=\"#i-alert\"/></svg><span class=\"as-form-field__error-text\">Use lowercase letters, numbers, and hyphens only.</span></p>\n        </div>\n        <div style=\"display: flex; gap: 8px; flex-wrap: wrap;\">\n          <button type=\"button\" class=\"as-button as-button--secondary\" id=\"fill-invalid\"><span class=\"as-button__label\">Fill Invalid Value</span></button>\n          <button type=\"button\" class=\"as-button as-button--secondary\" id=\"fill-valid\"><span class=\"as-button__label\">Fill Valid Value</span></button>\n        </div>\n      </div>",
    "codeSnippet": "<div class=\"as-form-field\">\n  <label class=\"as-form-field__label\" for=\"ws-name\">Workspace Name</label>\n  <div class=\"as-input-box\">\n    <input class=\"as-input\" type=\"text\" id=\"ws-name\" name=\"ws-name\" data-validate=\"slug\" aria-describedby=\"ws-name-help ws-name-err\" />\n    <button type=\"button\" class=\"as-input__action\" data-clear-for=\"ws-name\" aria-label=\"Clear workspace name\">\n      <svg class=\"as-icon\" aria-hidden=\"true\"><use href=\"#i-x\"/></svg>\n    </button>\n  </div>\n  <p class=\"as-form-field__helper\" id=\"ws-name-help\">Must be unique across your organization.</p>\n  <p class=\"as-form-field__message as-form-field__error\" id=\"ws-name-err\" hidden><span class=\"as-form-field__error-text\"></span></p>\n</div>",
    "promptSnippet": "# Aster Component Implementation Prompt — Input & Form Field\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Input & Form Field (`input`)\n- **Category:** Form Controls\n- **Native Element:** `<input>`\n- **Summary:** Single-line 44px text input with 4px corner radius (Shade-DS Radius.S), Canvas #121212 background, and double 1px glass glow (zero wireframe outline).\n- **When to Use:** Names, email addresses, slugs, search queries, API keys, and numeric strings.\n- **When Not to Use:** Multi-line text (use Textarea) or selecting from predefined options (use Select).\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/input/input.css`\n- **Component Spec:** `docs/components/input.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<div class=\"as-form-field\">\n  <label class=\"as-form-field__label\" for=\"ws-name\">Workspace Name</label>\n  <div class=\"as-input-box\">\n    <input class=\"as-input\" type=\"text\" id=\"ws-name\" name=\"ws-name\" data-validate=\"slug\" aria-describedby=\"ws-name-help ws-name-err\" />\n    <button type=\"button\" class=\"as-input__action\" data-clear-for=\"ws-name\" aria-label=\"Clear workspace name\">\n      <svg class=\"as-icon\" aria-hidden=\"true\"><use href=\"#i-x\"/></svg>\n    </button>\n  </div>\n  <p class=\"as-form-field__helper\" id=\"ws-name-help\">Must be unique across your organization.</p>\n  <p class=\"as-form-field__message as-form-field__error\" id=\"ws-name-err\" hidden><span class=\"as-form-field__error-text\"></span></p>\n</div>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** 44px (Exact Shade-DS Control Height)\n- **Horizontal Padding:** 12px left / 36px right (--as-space-3)\n- **Vertical Padding:** 10px top / 10px bottom\n- **Corner Radius:** 4px (--as-radius-sm / Shade-DS Radius.S)\n- **Typography:** Manrope · 14px · 400 Regular\n- **Icon / Secondary Control:** 28px × 28px trailing action button\n- **Focus Ring:** Double 1px glass glow (--as-semantic-color-border-focus)\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Control Height",
        "value": "44px",
        "token": "Exact Shade-DS Component Geometry",
        "type": "Fixed"
      },
      {
        "property": "Horizontal Padding",
        "value": "12px left, 36px right (with action)",
        "token": "--as-space-3",
        "type": "Fixed"
      },
      {
        "property": "Width",
        "value": "100% of parent field container",
        "token": "—",
        "type": "Content-Dependent / Fluid"
      },
      {
        "property": "Corner Radius",
        "value": "4px (Shade-DS Radius.S)",
        "token": "--as-radius-sm",
        "type": "Fixed"
      },
      {
        "property": "Surface & Outline",
        "value": "Canvas #121212 / Double 1px Glass Glow",
        "token": "box-shadow: 0 0 1px 0px ..., inset 0 0 1px 0px ...",
        "type": "Fixed"
      },
      {
        "property": "Typography",
        "value": "Manrope, 14px, weight 400",
        "token": "--as-typography-font-size-sm",
        "type": "Fixed"
      },
      {
        "property": "Action Button Target",
        "value": "28px × 28px (exceeds 24px WCAG floor)",
        "token": "--as-radius-sm (4px)",
        "type": "Fixed"
      },
      {
        "property": "Focus Ring",
        "value": "Double 1px glass glow",
        "token": "--as-semantic-color-border-focus",
        "type": "Fixed"
      }
    ],
    "spec": {
      "height": "44px (Exact Shade-DS Control Height)",
      "paddingX": "12px left / 36px right (--as-space-3)",
      "paddingY": "10px top / 10px bottom",
      "radius": "4px (--as-radius-sm / Shade-DS Radius.S)",
      "typography": "Manrope · 14px · 400 Regular",
      "iconGap": "28px × 28px trailing action button",
      "focusRing": "Double 1px glass glow (--as-semantic-color-border-focus)"
    }
  },
  "textarea": {
    "slug": "textarea",
    "name": "Textarea",
    "category": "Form Controls",
    "description": "Multi-line text area supporting dynamic auto-resizing, live character counter synchronization, and 8px corner radius.",
    "element": "<textarea>",
    "status": "Production",
    "previewHtml": "<div class=\"as-form-field\" style=\"max-width: 440px; width: 100%;\">\n        <label class=\"as-form-field__label\" for=\"txt-demo-input\">Release Changelog Notes</label>\n        <div class=\"as-textarea-box\">\n          <textarea class=\"as-textarea\" id=\"txt-demo-input\" maxlength=\"300\" placeholder=\"Summarize changes included in this deployment...\">Rolled out kernel 6.8 with eBPF runtime profiling enabled across worker nodes.</textarea>\n          <div class=\"as-textarea__footer\">\n            <span class=\"as-textarea__counter\">83 / 300</span>\n          </div>\n        </div>\n      </div>",
    "codeSnippet": "<div class=\"as-form-field\">\n  <label class=\"as-form-field__label\" for=\"deploy-notes\">Release Notes</label>\n  <div class=\"as-textarea-box\">\n    <textarea class=\"as-textarea\" id=\"deploy-notes\" maxlength=\"300\" placeholder=\"Enter notes...\"></textarea>\n    <div class=\"as-textarea__footer\">\n      <span class=\"as-textarea__counter\">0 / 300</span>\n    </div>\n  </div>\n</div>",
    "promptSnippet": "# Aster Component Implementation Prompt — Textarea\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Textarea (`textarea`)\n- **Category:** Form Controls\n- **Native Element:** `<textarea>`\n- **Summary:** Multi-line text area supporting dynamic auto-resizing, live character counter synchronization, and 8px corner radius.\n- **When to Use:** When user input is expected to exceed a single line.\n- **When Not to Use:** Single-line strings such as emails, slugs, or passwords (use Input).\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/textarea/textarea.css`\n- **Component Spec:** `docs/components/textarea.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<div class=\"as-form-field\">\n  <label class=\"as-form-field__label\" for=\"deploy-notes\">Release Notes</label>\n  <div class=\"as-textarea-box\">\n    <textarea class=\"as-textarea\" id=\"deploy-notes\" maxlength=\"300\" placeholder=\"Enter notes...\"></textarea>\n    <div class=\"as-textarea__footer\">\n      <span class=\"as-textarea__counter\">0 / 300</span>\n    </div>\n  </div>\n</div>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** Min 96px (auto-expands)\n- **Horizontal Padding:** 12px left / 12px right (--as-space-3)\n- **Vertical Padding:** 8px top / 8px bottom (--as-space-2)\n- **Corner Radius:** 8px (--as-radius-md)\n- **Typography:** Manrope · 14px · 400 · 1.5 line-height\n- **Icon / Secondary Control:** Footer counter bar (12px Space Mono)\n- **Focus Ring:** 2px solid (--as-semantic-color-border-focus) + 1px offset\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Minimum Height",
        "value": "96px",
        "token": "min-height: 96px",
        "type": "Content-Dependent (vertical / auto-resize)"
      },
      {
        "property": "Horizontal Padding",
        "value": "12px left / 12px right",
        "token": "--as-space-3",
        "type": "Fixed"
      },
      {
        "property": "Vertical Padding",
        "value": "8px top / 8px bottom",
        "token": "--as-space-2",
        "type": "Fixed"
      },
      {
        "property": "Corner Radius",
        "value": "8px",
        "token": "--as-radius-md",
        "type": "Fixed"
      },
      {
        "property": "Typography",
        "value": "Manrope, 14px, line-height 1.5",
        "token": "--as-typography-font-size-sm",
        "type": "Fixed"
      },
      {
        "property": "Focus Ring",
        "value": "2px solid + 1px offset",
        "token": "--as-semantic-color-border-focus",
        "type": "Fixed"
      }
    ],
    "spec": {
      "height": "Min 96px (auto-expands)",
      "paddingX": "12px left / 12px right (--as-space-3)",
      "paddingY": "8px top / 8px bottom (--as-space-2)",
      "radius": "8px (--as-radius-md)",
      "typography": "Manrope · 14px · 400 · 1.5 line-height",
      "iconGap": "Footer counter bar (12px Space Mono)",
      "focusRing": "2px solid (--as-semantic-color-border-focus) + 1px offset"
    }
  },
  "select": {
    "slug": "select",
    "name": "Select",
    "category": "Form Controls",
    "description": "Native 40px dropdown selection control with 8px corner radius and custom high-contrast chevron indicator.",
    "element": "<select>",
    "status": "Production",
    "previewHtml": "<div class=\"as-form-field\" style=\"max-width: 360px; width: 100%;\">\n        <label class=\"as-form-field__label\" for=\"sel-demo-input\">Primary Compute Region</label>\n        <div class=\"as-select-box\">\n          <select class=\"as-select\" id=\"sel-demo-input\" name=\"region\">\n            <option value=\"eu-west-1\" selected>Europe (Ireland) — eu-west-1</option>\n            <option value=\"eu-central-1\">Europe (Frankfurt) — eu-central-1</option>\n            <option value=\"us-east-1\">US East (N. Virginia) — us-east-1</option>\n            <option value=\"ap-southeast-1\">Asia Pacific (Singapore) — ap-southeast-1</option>\n          </select>\n          <svg class=\"as-select-chevron\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><polyline points=\"4 6 8 10 12 6\"></polyline></svg>\n        </div>\n      </div>",
    "codeSnippet": "<div class=\"as-form-field\">\n  <label class=\"as-form-field__label\" for=\"select-region\">Region</label>\n  <div class=\"as-select-box\">\n    <select class=\"as-select\" id=\"select-region\">\n      <option value=\"eu-west-1\" selected>Europe (Ireland)</option>\n      <option value=\"us-east-1\">US East (N. Virginia)</option>\n    </select>\n    <svg class=\"as-select-chevron\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><polyline points=\"4 6 8 10 12 6\"></polyline></svg>\n  </div>\n</div>",
    "promptSnippet": "# Aster Component Implementation Prompt — Select\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Select (`select`)\n- **Category:** Form Controls\n- **Native Element:** `<select>`\n- **Summary:** Native 40px dropdown selection control with 8px corner radius and custom high-contrast chevron indicator.\n- **When to Use:** Selecting regions, roles, or categories from a predefined list.\n- **When Not to Use:** 2–3 options that benefit from immediate visibility (use Radio Group).\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/select/select.css`\n- **Component Spec:** `docs/components/select.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<div class=\"as-form-field\">\n  <label class=\"as-form-field__label\" for=\"select-region\">Region</label>\n  <div class=\"as-select-box\">\n    <select class=\"as-select\" id=\"select-region\">\n      <option value=\"eu-west-1\" selected>Europe (Ireland)</option>\n      <option value=\"us-east-1\">US East (N. Virginia)</option>\n    </select>\n    <svg class=\"as-select-chevron\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><polyline points=\"4 6 8 10 12 6\"></polyline></svg>\n  </div>\n</div>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** 40px (--as-density-control-height)\n- **Horizontal Padding:** 12px left / 36px right (--as-space-3)\n- **Vertical Padding:** 8px top / 8px bottom\n- **Corner Radius:** 8px (--as-radius-md)\n- **Typography:** Manrope · 14px · 400 Regular\n- **Icon / Secondary Control:** 16px × 16px custom chevron at right 12px\n- **Focus Ring:** 2px solid (--as-semantic-color-border-focus) + 1px offset\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Control Height",
        "value": "40px",
        "token": "--as-density-control-height",
        "type": "Fixed"
      },
      {
        "property": "Horizontal Padding",
        "value": "12px left, 36px right (chevron clearance)",
        "token": "--as-space-3",
        "type": "Fixed"
      },
      {
        "property": "Corner Radius",
        "value": "8px",
        "token": "--as-radius-md",
        "type": "Fixed"
      },
      {
        "property": "Chevron Icon",
        "value": "16px × 16px at right: 12px",
        "token": "--as-space-3",
        "type": "Fixed"
      },
      {
        "property": "Typography",
        "value": "Manrope, 14px, weight 400",
        "token": "--as-typography-font-size-sm",
        "type": "Fixed"
      }
    ],
    "spec": {
      "height": "40px (--as-density-control-height)",
      "paddingX": "12px left / 36px right (--as-space-3)",
      "paddingY": "8px top / 8px bottom",
      "radius": "8px (--as-radius-md)",
      "typography": "Manrope · 14px · 400 Regular",
      "iconGap": "16px × 16px custom chevron at right 12px",
      "focusRing": "2px solid (--as-semantic-color-border-focus) + 1px offset"
    }
  },
  "checkbox": {
    "slug": "checkbox",
    "name": "Checkbox",
    "category": "Form Controls",
    "description": "Accessible selection control with 28px touch target, 18px visual box, 4px corner radius, and checked/indeterminate states.",
    "element": "<input type=\"checkbox\">",
    "status": "Production",
    "previewHtml": "<div style=\"display: flex; flex-direction: column; gap: var(--as-space-3);\">\n        <label class=\"as-checkbox-field\">\n          <span class=\"as-checkbox\"><input type=\"checkbox\" class=\"as-checkbox-input\" checked></span>\n          <span class=\"as-checkbox-field__content\">\n            <span class=\"as-checkbox-field__label\">Enforce zero-trust network ingress</span>\n            <span class=\"as-checkbox-field__description\">Drop all unauthenticated inter-pod packets.</span>\n          </span>\n        </label>\n        <label class=\"as-checkbox-field\">\n          <span class=\"as-checkbox\"><input type=\"checkbox\" class=\"as-checkbox-input\" data-indeterminate=\"true\"></span>\n          <span class=\"as-checkbox-field__content\">\n            <span class=\"as-checkbox-field__label\">Multi-zone telemetry collection</span>\n            <span class=\"as-checkbox-field__description\">Active on 2 of 3 availability zones.</span>\n          </span>\n        </label>\n      </div>",
    "codeSnippet": "<label class=\"as-checkbox-field\">\n  <span class=\"as-checkbox\">\n    <input type=\"checkbox\" class=\"as-checkbox-input\" checked>\n  </span>\n  <span class=\"as-checkbox-field__content\">\n    <span class=\"as-checkbox-field__label\">Enforce Zero-Trust Ingress</span>\n    <span class=\"as-checkbox-field__description\">Drop unauthenticated packets.</span>\n  </span>\n</label>",
    "promptSnippet": "# Aster Component Implementation Prompt — Checkbox\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Checkbox (`checkbox`)\n- **Category:** Form Controls\n- **Native Element:** `<input type=\"checkbox\">`\n- **Summary:** Accessible selection control with 28px touch target, 18px visual box, 4px corner radius, and checked/indeterminate states.\n- **When to Use:** Multi-select lists, table row selection, or boolean acknowledgments.\n- **When Not to Use:** Mutually exclusive choices (use Radio Group) or instant system toggles (use Switch).\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/checkbox/checkbox.css`\n- **Component Spec:** `docs/components/checkbox.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<label class=\"as-checkbox-field\">\n  <span class=\"as-checkbox\">\n    <input type=\"checkbox\" class=\"as-checkbox-input\" checked>\n  </span>\n  <span class=\"as-checkbox-field__content\">\n    <span class=\"as-checkbox-field__label\">Enforce Zero-Trust Ingress</span>\n    <span class=\"as-checkbox-field__description\">Drop unauthenticated packets.</span>\n  </span>\n</label>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** 28px × 28px hit target (18px visual box)\n- **Horizontal Padding:** 12px gap to label (--as-space-3)\n- **Vertical Padding:** 4px vertical alignment offset\n- **Corner Radius:** 4px (--as-radius-sm)\n- **Typography:** Manrope · 14px · 500 Medium label\n- **Icon / Secondary Control:** 14px × 14px checkmark / dash SVG\n- **Focus Ring:** 2px solid (--as-semantic-color-border-focus) + 2px offset\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Touch Target Area",
        "value": "28px × 28px",
        "token": ".as-checkbox",
        "type": "Fixed"
      },
      {
        "property": "Visual Box Dimensions",
        "value": "18px × 18px",
        "token": ".as-checkbox-input",
        "type": "Fixed"
      },
      {
        "property": "Corner Radius",
        "value": "4px (Minimum Aster radius)",
        "token": "--as-radius-sm",
        "type": "Fixed"
      },
      {
        "property": "Control-to-Label Gap",
        "value": "12px",
        "token": "--as-space-3",
        "type": "Fixed"
      },
      {
        "property": "Typography",
        "value": "Manrope 14px / 500 label, 12px description",
        "token": "--as-typography-font-size-sm / xs",
        "type": "Content-Dependent"
      }
    ],
    "spec": {
      "height": "28px × 28px hit target (18px visual box)",
      "paddingX": "12px gap to label (--as-space-3)",
      "paddingY": "4px vertical alignment offset",
      "radius": "4px (--as-radius-sm)",
      "typography": "Manrope · 14px · 500 Medium label",
      "iconGap": "14px × 14px checkmark / dash SVG",
      "focusRing": "2px solid (--as-semantic-color-border-focus) + 2px offset"
    }
  },
  "radio": {
    "slug": "radio",
    "name": "Radio Group",
    "category": "Form Controls",
    "description": "Mutually exclusive option sets wrapped in semantic fieldsets with 28px touch targets and concentric selection dots.",
    "element": "<fieldset> + <input type=\"radio\">",
    "status": "Production",
    "previewHtml": "<fieldset class=\"as-radio-group\">\n        <legend class=\"as-radio-group__legend\">Deployment Canary Strategy</legend>\n        <label class=\"as-radio-field\">\n          <span class=\"as-radio\"><input type=\"radio\" name=\"pg-radio-showcase\" class=\"as-radio-input\" checked></span>\n          <span class=\"as-radio-field__content\">\n            <span class=\"as-radio-field__label\">Rolling Update (Recommended)</span>\n            <span class=\"as-radio-field__description\">Replace worker pods progressively with zero downtime.</span>\n          </span>\n        </label>\n        <label class=\"as-radio-field\">\n          <span class=\"as-radio\"><input type=\"radio\" name=\"pg-radio-showcase\" class=\"as-radio-input\"></span>\n          <span class=\"as-radio-field__content\">\n            <span class=\"as-radio-field__label\">Blue/Green Cutover</span>\n            <span class=\"as-radio-field__description\">Spin up secondary cluster and switch DNS routing.</span>\n          </span>\n        </label>\n      </fieldset>",
    "codeSnippet": "<fieldset class=\"as-radio-group\">\n  <legend class=\"as-radio-group__legend\">Rollout Strategy</legend>\n  <label class=\"as-radio-field\">\n    <span class=\"as-radio\"><input type=\"radio\" name=\"strategy\" class=\"as-radio-input\" checked></span>\n    <span class=\"as-radio-field__content\">\n      <span class=\"as-radio-field__label\">Rolling Update</span>\n    </span>\n  </label>\n</fieldset>",
    "promptSnippet": "# Aster Component Implementation Prompt — Radio Group\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Radio Group (`radio`)\n- **Category:** Form Controls\n- **Native Element:** `<fieldset> + <input type=\"radio\">`\n- **Summary:** Mutually exclusive option sets wrapped in semantic fieldsets with 28px touch targets and concentric selection dots.\n- **When to Use:** 2–5 mutually exclusive options that should all be visible at once.\n- **When Not to Use:** Multi-select options (use Checkbox) or 6+ compact options (use Select).\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/radio/radio.css`\n- **Component Spec:** `docs/components/radio.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<fieldset class=\"as-radio-group\">\n  <legend class=\"as-radio-group__legend\">Rollout Strategy</legend>\n  <label class=\"as-radio-field\">\n    <span class=\"as-radio\"><input type=\"radio\" name=\"strategy\" class=\"as-radio-input\" checked></span>\n    <span class=\"as-radio-field__content\">\n      <span class=\"as-radio-field__label\">Rolling Update</span>\n    </span>\n  </label>\n</fieldset>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** 28px × 28px hit target (18px visual circle)\n- **Horizontal Padding:** 12px gap to label (--as-space-3)\n- **Vertical Padding:** 12px vertical stack gap between options\n- **Corner Radius:** 9999px (--as-radius-full)\n- **Typography:** Manrope · 14px · 500 Medium\n- **Icon / Secondary Control:** 6px × 6px centered canvas dot inside solid interactive disc\n- **Focus Ring:** 2px solid (--as-semantic-color-border-focus) + 2px offset\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Touch Target Area",
        "value": "28px × 28px",
        "token": ".as-radio",
        "type": "Fixed"
      },
      {
        "property": "Outer Ring / Inverted Dot",
        "value": "18px × 18px disc / 6px × 6px inverted dot",
        "token": "--as-radius-full",
        "type": "Fixed"
      },
      {
        "property": "Option Stack Gap",
        "value": "12px",
        "token": "--as-space-3",
        "type": "Fixed"
      },
      {
        "property": "Control-to-Label Gap",
        "value": "12px",
        "token": "--as-space-3",
        "type": "Fixed"
      }
    ],
    "spec": {
      "height": "28px × 28px hit target (18px visual circle)",
      "paddingX": "12px gap to label (--as-space-3)",
      "paddingY": "12px vertical stack gap between options",
      "radius": "9999px (--as-radius-full)",
      "typography": "Manrope · 14px · 500 Medium",
      "iconGap": "6px × 6px centered canvas dot inside solid interactive disc",
      "focusRing": "2px solid (--as-semantic-color-border-focus) + 2px offset"
    }
  },
  "switch": {
    "slug": "switch",
    "name": "Switch",
    "category": "Form Controls",
    "description": "Tactile 44x24px binary toggle switch communicating immediate on/off system preferences.",
    "element": "<input type=\"checkbox\" role=\"switch\">",
    "status": "Production",
    "previewHtml": "<div style=\"display: flex; flex-direction: column; gap: var(--as-space-4); max-width: 420px; width: 100%;\">\n        <label class=\"as-switch-field\">\n          <span class=\"as-switch\">\n            <input type=\"checkbox\" role=\"switch\" class=\"as-switch-input\" checked>\n            <span class=\"as-switch-track\"><span class=\"as-switch-thumb\"></span></span>\n          </span>\n          <span class=\"as-switch-field__content\">\n            <span class=\"as-switch-field__label\">Automatic Node Eviction</span>\n            <span class=\"as-switch-field__description\">Evict pods if memory saturation exceeds 92%.</span>\n          </span>\n        </label>\n        <label class=\"as-switch-field\">\n          <span class=\"as-switch\">\n            <input type=\"checkbox\" role=\"switch\" class=\"as-switch-input\">\n            <span class=\"as-switch-track\"><span class=\"as-switch-thumb\"></span></span>\n          </span>\n          <span class=\"as-switch-field__content\">\n            <span class=\"as-switch-field__label\">Maintenance Window Locking</span>\n            <span class=\"as-switch-field__description\">Block non-critical automated updates.</span>\n          </span>\n        </label>\n      </div>",
    "codeSnippet": "<label class=\"as-switch-field\">\n  <span class=\"as-switch\">\n    <input type=\"checkbox\" role=\"switch\" class=\"as-switch-input\" checked>\n    <span class=\"as-switch-track\"><span class=\"as-switch-thumb\"></span></span>\n  </span>\n  <span class=\"as-switch-field__content\">\n    <span class=\"as-switch-field__label\">Automatic Node Eviction</span>\n  </span>\n</label>",
    "promptSnippet": "# Aster Component Implementation Prompt — Switch\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Switch (`switch`)\n- **Category:** Form Controls\n- **Native Element:** `<input type=\"checkbox\" role=\"switch\">`\n- **Summary:** Tactile 44x24px binary toggle switch communicating immediate on/off system preferences.\n- **When to Use:** Instantaneous preference toggles (e.g. dark mode, auto-eviction, notifications).\n- **When Not to Use:** Options inside a form requiring a Submit button (use Checkbox).\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/switch/switch.css`\n- **Component Spec:** `docs/components/switch.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<label class=\"as-switch-field\">\n  <span class=\"as-switch\">\n    <input type=\"checkbox\" role=\"switch\" class=\"as-switch-input\" checked>\n    <span class=\"as-switch-track\"><span class=\"as-switch-thumb\"></span></span>\n  </span>\n  <span class=\"as-switch-field__content\">\n    <span class=\"as-switch-field__label\">Automatic Node Eviction</span>\n  </span>\n</label>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** 24px track height × 44px track width\n- **Horizontal Padding:** 12px gap to label (--as-space-3)\n- **Vertical Padding:** 2px internal track-to-thumb inset\n- **Corner Radius:** 9999px (--as-radius-full)\n- **Typography:** Manrope · 14px · 500 Medium\n- **Icon / Secondary Control:** 18px × 18px sliding thumb (20px travel)\n- **Focus Ring:** 2px solid (--as-semantic-color-border-focus) + 2px offset\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Track Dimensions",
        "value": "44px width × 24px height",
        "token": ".as-switch",
        "type": "Fixed"
      },
      {
        "property": "Thumb Dimensions & Travel",
        "value": "18px × 18px circle; +20px translateX on checked",
        "token": ".as-switch-thumb",
        "type": "Fixed"
      },
      {
        "property": "Corner Radius",
        "value": "9999px (Full Pill)",
        "token": "--as-radius-full",
        "type": "Fixed"
      },
      {
        "property": "Control-to-Label Gap",
        "value": "12px",
        "token": "--as-space-3",
        "type": "Fixed"
      }
    ],
    "spec": {
      "height": "24px track height × 44px track width",
      "paddingX": "12px gap to label (--as-space-3)",
      "paddingY": "2px internal track-to-thumb inset",
      "radius": "9999px (--as-radius-full)",
      "typography": "Manrope · 14px · 500 Medium",
      "iconGap": "18px × 18px sliding thumb (20px travel)",
      "focusRing": "2px solid (--as-semantic-color-border-focus) + 2px offset"
    }
  },
  "slider": {
    "slug": "slider",
    "name": "Slider",
    "category": "Form Controls",
    "description": "Numeric range input with dynamically synchronized track progress and tabular value display.",
    "element": "<input type=\"range\">",
    "status": "Production",
    "previewHtml": "<div class=\"as-slider-field\" style=\"max-width: 420px; width: 100%;\">\n        <div class=\"as-slider-field__header\">\n          <label class=\"as-slider-field__label\" for=\"sld-showcase-input\">Cluster Memory Allocation</label>\n          <span class=\"as-slider-field__value\">75%</span>\n        </div>\n        <div class=\"as-slider-box\">\n          <input type=\"range\" class=\"as-slider\" id=\"sld-showcase-input\" min=\"10\" max=\"100\" value=\"75\">\n        </div>\n      </div>",
    "codeSnippet": "<div class=\"as-slider-field\">\n  <div class=\"as-slider-field__header\">\n    <label class=\"as-slider-field__label\" for=\"mem-slider\">Memory Limit</label>\n    <span class=\"as-slider-field__value\">75%</span>\n  </div>\n  <div class=\"as-slider-box\">\n    <input type=\"range\" class=\"as-slider\" id=\"mem-slider\" min=\"10\" max=\"100\" value=\"75\">\n  </div>\n</div>",
    "promptSnippet": "# Aster Component Implementation Prompt — Slider\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Slider (`slider`)\n- **Category:** Form Controls\n- **Native Element:** `<input type=\"range\">`\n- **Summary:** Numeric range input with dynamically synchronized track progress and tabular value display.\n- **When to Use:** Resource thresholds, capacity percentages, audio/display levels.\n- **When Not to Use:** Exact arbitrary numbers where typing is faster (use Input type=\"number\").\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/slider/slider.css`\n- **Component Spec:** `docs/components/slider.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<div class=\"as-slider-field\">\n  <div class=\"as-slider-field__header\">\n    <label class=\"as-slider-field__label\" for=\"mem-slider\">Memory Limit</label>\n    <span class=\"as-slider-field__value\">75%</span>\n  </div>\n  <div class=\"as-slider-box\">\n    <input type=\"range\" class=\"as-slider\" id=\"mem-slider\" min=\"10\" max=\"100\" value=\"75\">\n  </div>\n</div>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** 32px interactive hit height (6px track)\n- **Horizontal Padding:** 0px track inset\n- **Vertical Padding:** 8px header-to-track gap (--as-space-2)\n- **Corner Radius:** 9999px (--as-radius-full)\n- **Typography:** Manrope 14px label · Space Mono 14px value\n- **Icon / Secondary Control:** 20px × 20px circular thumb\n- **Focus Ring:** 2px solid (--as-semantic-color-border-focus) + 2px offset\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Interactive Touch Height",
        "value": "32px",
        "token": ".as-slider-box",
        "type": "Fixed"
      },
      {
        "property": "Visual Track Height",
        "value": "6px",
        "token": "height: 6px",
        "type": "Fixed"
      },
      {
        "property": "Thumb Dimensions",
        "value": "20px × 20px circle",
        "token": "--as-radius-full",
        "type": "Fixed"
      },
      {
        "property": "Track Width",
        "value": "100% of container",
        "token": "width: 100%",
        "type": "Content-Dependent / Fluid"
      }
    ],
    "spec": {
      "height": "32px interactive hit height (6px track)",
      "paddingX": "0px track inset",
      "paddingY": "8px header-to-track gap (--as-space-2)",
      "radius": "9999px (--as-radius-full)",
      "typography": "Manrope 14px label · Space Mono 14px value",
      "iconGap": "20px × 20px circular thumb",
      "focusRing": "2px solid (--as-semantic-color-border-focus) + 2px offset"
    }
  },
  "table": {
    "slug": "table",
    "name": "Data Table",
    "category": "Data Display",
    "description": "Structured tabular data display with 44px rows, column sorting, multi-row indeterminate selection, lifecycle states, and keyboard overflow scrolling.",
    "element": "<table>",
    "status": "Production",
    "previewHtml": "<div style=\"display: flex; flex-direction: column; gap: 12px; width: 100%;\">\n        <div style=\"display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;\">\n          <div class=\"seg\" data-index=\"0\" style=\"--n: 4; --i: 0;\" id=\"seg-tbl-state\">\n            <span class=\"seg__thumb\" aria-hidden=\"true\"></span>\n            <button type=\"button\" data-state=\"ready\" aria-pressed=\"true\">Ready</button>\n            <button type=\"button\" data-state=\"loading\" aria-pressed=\"false\">Loading</button>\n            <button type=\"button\" data-state=\"empty\" aria-pressed=\"false\">Empty</button>\n            <button type=\"button\" data-state=\"error\" aria-pressed=\"false\">Error</button>\n          </div>\n          <button type=\"button\" class=\"as-button as-button--secondary\" id=\"tbl-bulk\" hidden><span class=\"as-button__label\">Restart 0 selected</span></button>\n        </div>\n\n        <div class=\"as-table-container\" id=\"table-container-demo\">\n          <div class=\"as-table-scroll\" id=\"table-scroll-overflow\" style=\"max-height: 380px;\">\n            <table class=\"as-table as-table--interactive\" id=\"tbl-main\">\n              <caption class=\"as-sr-only\">Cluster Infrastructure Workloads</caption>\n              <thead>\n                <tr>\n                  <th scope=\"col\" class=\"as-table__th as-table__th--check\">\n                    <span class=\"as-checkbox\">\n                      <input type=\"checkbox\" class=\"as-checkbox-input\" id=\"tbl-all\" aria-label=\"Select all rows\" />\n                    </span>\n                  </th>\n                  <th scope=\"col\" class=\"as-table__th\" aria-sort=\"none\">\n                    <button type=\"button\" class=\"as-table__sort\" data-sort-key=\"node\">\n                      <span>Node</span>\n                      <svg class=\"as-table__sort-icon\" viewBox=\"0 0 10 14\" aria-hidden=\"true\"><path class=\"sort-up\" d=\"M5 1L9 6H1L5 1Z\"/><path class=\"sort-down\" d=\"M5 13L1 8H9L5 13Z\"/></svg>\n                    </button>\n                  </th>\n                  <th scope=\"col\" class=\"as-table__th\" aria-sort=\"none\">\n                    <button type=\"button\" class=\"as-table__sort\" data-sort-key=\"region\">\n                      <span>Region</span>\n                      <svg class=\"as-table__sort-icon\" viewBox=\"0 0 10 14\" aria-hidden=\"true\"><path class=\"sort-up\" d=\"M5 1L9 6H1L5 1Z\"/><path class=\"sort-down\" d=\"M5 13L1 8H9L5 13Z\"/></svg>\n                    </button>\n                  </th>\n                  <th scope=\"col\" class=\"as-table__th\" aria-sort=\"none\">\n                    <button type=\"button\" class=\"as-table__sort\" data-sort-key=\"status\">\n                      <span>Status</span>\n                      <svg class=\"as-table__sort-icon\" viewBox=\"0 0 10 14\" aria-hidden=\"true\"><path class=\"sort-up\" d=\"M5 1L9 6H1L5 1Z\"/><path class=\"sort-down\" d=\"M5 13L1 8H9L5 13Z\"/></svg>\n                    </button>\n                  </th>\n                  <th scope=\"col\" class=\"as-table__th as-table__th--num\" aria-sort=\"none\">\n                    <button type=\"button\" class=\"as-table__sort\" data-sort-key=\"latency\">\n                      <span>Latency</span>\n                      <svg class=\"as-table__sort-icon\" viewBox=\"0 0 10 14\" aria-hidden=\"true\"><path class=\"sort-up\" d=\"M5 1L9 6H1L5 1Z\"/><path class=\"sort-down\" d=\"M5 13L1 8H9L5 13Z\"/></svg>\n                    </button>\n                  </th>\n                  <th scope=\"col\" class=\"as-table__th as-table__th--num\" aria-sort=\"none\">\n                    <button type=\"button\" class=\"as-table__sort\" data-sort-key=\"cost\">\n                      <span>Cost / mo</span>\n                      <svg class=\"as-table__sort-icon\" viewBox=\"0 0 10 14\" aria-hidden=\"true\"><path class=\"sort-up\" d=\"M5 1L9 6H1L5 1Z\"/><path class=\"sort-down\" d=\"M5 13L1 8H9L5 13Z\"/></svg>\n                    </button>\n                  </th>\n                </tr>\n              </thead>\n              <tbody id=\"tbl-body\"></tbody>\n            </table>\n          </div>\n          <div class=\"as-table-footer\" id=\"tbl-foot\">0 of 7 selected</div>\n        </div>\n      </div>",
    "codeSnippet": "<div class=\"as-table-container\">\n  <div class=\"as-table-scroll\">\n    <table class=\"as-table as-table--interactive\">\n      <caption class=\"as-sr-only\">Active Deployments</caption>\n      <thead>\n        <tr>\n          <th scope=\"col\" class=\"as-table__th\">Service</th>\n          <th scope=\"col\" class=\"as-table__th\">Region</th>\n          <th scope=\"col\" class=\"as-table__th as-table__th--num\">Latency</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr class=\"as-table__row\">\n          <th scope=\"row\" class=\"as-table__cell as-table__cell--primary\">api-gateway</th>\n          <td class=\"as-table__cell\">us-east-1</td>\n          <td class=\"as-table__cell as-table__cell--num\">1.24 ms</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</div>",
    "promptSnippet": "# Aster Component Implementation Prompt — Data Table\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Data Table (`table`)\n- **Category:** Data Display\n- **Native Element:** `<table>`\n- **Summary:** Structured tabular data display with 44px rows, column sorting, multi-row indeterminate selection, lifecycle states, and keyboard overflow scrolling.\n- **When to Use:** Datasets with comparable attributes such as server nodes, logs, and transactions.\n- **When Not to Use:** Simple single-column lists or page layout grids.\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/table/table.css`\n- **Component Spec:** `docs/components/table.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<div class=\"as-table-container\">\n  <div class=\"as-table-scroll\">\n    <table class=\"as-table as-table--interactive\">\n      <caption class=\"as-sr-only\">Active Deployments</caption>\n      <thead>\n        <tr>\n          <th scope=\"col\" class=\"as-table__th\">Service</th>\n          <th scope=\"col\" class=\"as-table__th\">Region</th>\n          <th scope=\"col\" class=\"as-table__th as-table__th--num\">Latency</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr class=\"as-table__row\">\n          <th scope=\"row\" class=\"as-table__cell as-table__cell--primary\">api-gateway</th>\n          <td class=\"as-table__cell\">us-east-1</td>\n          <td class=\"as-table__cell as-table__cell--num\">1.24 ms</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</div>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** 44px row height (--as-density-table-row-height)\n- **Horizontal Padding:** 16px cell horizontal (--as-density-table-cell-padding-x)\n- **Vertical Padding:** 8px cell vertical (--as-density-table-cell-padding-y)\n- **Corner Radius:** 12px container (--as-radius-lg)\n- **Typography:** Manrope 14px cells · 12px uppercase headers\n- **Icon / Secondary Control:** 10px × 14px dual-arrow sort icon\n- **Focus Ring:** 2px solid (--as-semantic-color-border-focus) inset\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Row Height",
        "value": "44px",
        "token": "--as-density-table-row-height",
        "type": "Fixed minimum"
      },
      {
        "property": "Cell Padding",
        "value": "16px horizontal / 8px vertical",
        "token": "--as-density-table-cell-padding-x / y",
        "type": "Fixed"
      },
      {
        "property": "Checkbox Column Width",
        "value": "44px",
        "token": ".as-table__th--check",
        "type": "Fixed"
      },
      {
        "property": "Container Radius",
        "value": "12px",
        "token": "--as-radius-lg",
        "type": "Fixed"
      },
      {
        "property": "Column Widths",
        "value": "Auto / proportional to cell data",
        "token": "—",
        "type": "Content-Dependent"
      }
    ],
    "spec": {
      "height": "44px row height (--as-density-table-row-height)",
      "paddingX": "16px cell horizontal (--as-density-table-cell-padding-x)",
      "paddingY": "8px cell vertical (--as-density-table-cell-padding-y)",
      "radius": "12px container (--as-radius-lg)",
      "typography": "Manrope 14px cells · 12px uppercase headers",
      "iconGap": "10px × 14px dual-arrow sort icon",
      "focusRing": "2px solid (--as-semantic-color-border-focus) inset"
    }
  },
  "badge": {
    "slug": "badge",
    "name": "Badge",
    "category": "Data Display",
    "description": "24px status pills pairing full capsule geometry with semantic status colors and optional 6px dot indicators.",
    "element": "<span>",
    "status": "Production",
    "previewHtml": "<div style=\"display: flex; flex-wrap: wrap; gap: var(--as-space-3); align-items: center;\">\n        <span class=\"as-badge as-badge--success\"><span class=\"as-badge__dot\"></span>Healthy</span>\n        <span class=\"as-badge as-badge--warning\"><span class=\"as-badge__dot\"></span>Rebalancing</span>\n        <span class=\"as-badge as-badge--critical\"><span class=\"as-badge__dot\"></span>Degraded</span>\n        <span class=\"as-badge as-badge--info\">v2.4.1</span>\n        <span class=\"as-badge as-badge--muted\">Internal</span>\n      </div>",
    "codeSnippet": "<span class=\"as-badge as-badge--success\">\n  <span class=\"as-badge__dot\"></span>Healthy\n</span>\n<span class=\"as-badge as-badge--warning\">\n  <span class=\"as-badge__dot\"></span>Rebalancing\n</span>\n<span class=\"as-badge as-badge--critical\">Degraded</span>",
    "promptSnippet": "# Aster Component Implementation Prompt — Badge\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Badge (`badge`)\n- **Category:** Data Display\n- **Native Element:** `<span>`\n- **Summary:** 24px status pills pairing full capsule geometry with semantic status colors and optional 6px dot indicators.\n- **When to Use:** Status cells in tables, card headers, and metadata tags.\n- **When Not to Use:** Interactive clickable actions (use Button).\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/badge/badge.css`\n- **Component Spec:** `docs/components/badge.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<span class=\"as-badge as-badge--success\">\n  <span class=\"as-badge__dot\"></span>Healthy\n</span>\n<span class=\"as-badge as-badge--warning\">\n  <span class=\"as-badge__dot\"></span>Rebalancing\n</span>\n<span class=\"as-badge as-badge--critical\">Degraded</span>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** 24px (--as-space-6)\n- **Horizontal Padding:** 8px left / 8px right (--as-space-2)\n- **Vertical Padding:** 2px top / 2px bottom\n- **Corner Radius:** 9999px (--as-radius-full)\n- **Typography:** Manrope · 12px (--as-typography-font-size-xs) · 500\n- **Icon / Secondary Control:** 6px × 6px status dot · 6px gap\n- **Focus Ring:** Non-interactive status indicator\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Height",
        "value": "24px",
        "token": "height: 24px",
        "type": "Fixed"
      },
      {
        "property": "Horizontal Padding",
        "value": "8px left / 8px right",
        "token": "--as-space-2",
        "type": "Fixed"
      },
      {
        "property": "Corner Radius",
        "value": "9999px (Full Pill)",
        "token": "--as-radius-full",
        "type": "Fixed"
      },
      {
        "property": "Status Dot Size & Gap",
        "value": "6px × 6px dot, 6px gap",
        "token": "width: 6px; gap: 6px",
        "type": "Fixed"
      },
      {
        "property": "Badge Width",
        "value": "Auto (nowrap)",
        "token": "—",
        "type": "Content-Dependent"
      }
    ],
    "spec": {
      "height": "24px (--as-space-6)",
      "paddingX": "8px left / 8px right (--as-space-2)",
      "paddingY": "2px top / 2px bottom",
      "radius": "9999px (--as-radius-full)",
      "typography": "Manrope · 12px (--as-typography-font-size-xs) · 500",
      "iconGap": "6px × 6px status dot · 6px gap",
      "focusRing": "Non-interactive status indicator"
    }
  },
  "progress": {
    "slug": "progress",
    "name": "Progress",
    "category": "Data Display",
    "description": "Accessible 8px progress tracks communicating determinate completion percentages or indeterminate activity.",
    "element": "<div role=\"progressbar\">",
    "status": "Production",
    "previewHtml": "<div style=\"display: flex; flex-direction: column; gap: var(--as-space-4); width: 100%; max-width: 440px;\">\n        <div class=\"as-progress-field\">\n          <div class=\"as-progress-field__header\">\n            <span class=\"as-progress-field__label\">Volume Snapshot Compression</span>\n            <span class=\"as-progress-field__value\">68%</span>\n          </div>\n          <div class=\"as-progress\" role=\"progressbar\" aria-valuenow=\"68\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-label=\"Volume Snapshot Compression\">\n            <span class=\"as-progress__bar\" style=\"width: 68%;\"></span>\n          </div>\n        </div>\n        <div class=\"as-progress-field\">\n          <div class=\"as-progress-field__header\">\n            <span class=\"as-progress-field__label\">Syncing Cryptographic Hash Table</span>\n            <span class=\"as-progress-field__value\">Indeterminate</span>\n          </div>\n          <div class=\"as-progress as-progress--indeterminate\" role=\"progressbar\" aria-label=\"Syncing hash table\">\n            <span class=\"as-progress__bar\"></span>\n          </div>\n        </div>\n      </div>",
    "codeSnippet": "<!-- Determinate Progress -->\n<div class=\"as-progress\" role=\"progressbar\" aria-valuenow=\"68\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-label=\"Compression\">\n  <span class=\"as-progress__bar\" style=\"width: 68%;\"></span>\n</div>\n\n<!-- Indeterminate Progress -->\n<div class=\"as-progress as-progress--indeterminate\" role=\"progressbar\" aria-label=\"Syncing\">\n  <span class=\"as-progress__bar\"></span>\n</div>",
    "promptSnippet": "# Aster Component Implementation Prompt — Progress\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Progress (`progress`)\n- **Category:** Data Display\n- **Native Element:** `<div role=\"progressbar\">`\n- **Summary:** Accessible 8px progress tracks communicating determinate completion percentages or indeterminate activity.\n- **When to Use:** Migrations, uploads, snapshots, and multi-step jobs.\n- **When Not to Use:** Inline button loading states (use Button spinner).\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/progress/progress.css`\n- **Component Spec:** `docs/components/progress.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<!-- Determinate Progress -->\n<div class=\"as-progress\" role=\"progressbar\" aria-valuenow=\"68\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-label=\"Compression\">\n  <span class=\"as-progress__bar\" style=\"width: 68%;\"></span>\n</div>\n\n<!-- Indeterminate Progress -->\n<div class=\"as-progress as-progress--indeterminate\" role=\"progressbar\" aria-label=\"Syncing\">\n  <span class=\"as-progress__bar\"></span>\n</div>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** 8px track height (--as-space-2)\n- **Horizontal Padding:** 0px track inset\n- **Vertical Padding:** 8px header-to-track gap (--as-space-2)\n- **Corner Radius:** 9999px (--as-radius-full)\n- **Typography:** Manrope 14px label · Space Mono 12px percentage\n- **Icon / Secondary Control:** Determinate fill bar or indeterminate wave\n- **Focus Ring:** Semantic role=\"progressbar\"\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Track Height",
        "value": "8px",
        "token": "--as-space-2",
        "type": "Fixed"
      },
      {
        "property": "Corner Radius",
        "value": "9999px (Full Pill)",
        "token": "--as-radius-full",
        "type": "Fixed"
      },
      {
        "property": "Fill Width",
        "value": "0% to 100% (or 40% wave)",
        "token": "style=\"width: X%\"",
        "type": "Content-Dependent"
      }
    ],
    "spec": {
      "height": "8px track height (--as-space-2)",
      "paddingX": "0px track inset",
      "paddingY": "8px header-to-track gap (--as-space-2)",
      "radius": "9999px (--as-radius-full)",
      "typography": "Manrope 14px label · Space Mono 12px percentage",
      "iconGap": "Determinate fill bar or indeterminate wave",
      "focusRing": "Semantic role=\"progressbar\""
    }
  },
  "skeleton": {
    "slug": "skeleton",
    "name": "Skeleton",
    "category": "Data Display",
    "description": "Screen-reader-suppressed loading placeholders with smooth shimmer wave animation.",
    "element": "<div aria-hidden=\"true\">",
    "status": "Production",
    "previewHtml": "<div style=\"display: flex; flex-direction: column; gap: var(--as-space-3); width: 100%; max-width: 380px;\" aria-busy=\"true\">\n        <div style=\"display: flex; align-items: center; gap: var(--as-space-3);\">\n          <div class=\"as-skeleton as-skeleton--avatar\" aria-hidden=\"true\" style=\"width: 40px; height: 40px;\"></div>\n          <div style=\"flex: 1; display: flex; flex-direction: column; gap: 8px;\">\n            <div class=\"as-skeleton as-skeleton--text\" aria-hidden=\"true\" style=\"width: 60%;\"></div>\n            <div class=\"as-skeleton as-skeleton--text\" aria-hidden=\"true\" style=\"width: 40%;\"></div>\n          </div>\n        </div>\n        <div class=\"as-skeleton as-skeleton--text\" aria-hidden=\"true\" style=\"width: 100%; height: 64px;\"></div>\n      </div>",
    "codeSnippet": "<div aria-busy=\"true\">\n  <div class=\"as-skeleton as-skeleton--avatar\" aria-hidden=\"true\" style=\"width: 40px; height: 40px;\"></div>\n  <div class=\"as-skeleton as-skeleton--text\" aria-hidden=\"true\" style=\"width: 80%;\"></div>\n  <div class=\"as-skeleton as-skeleton--text\" aria-hidden=\"true\" style=\"width: 50%;\"></div>\n</div>",
    "promptSnippet": "# Aster Component Implementation Prompt — Skeleton\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Skeleton (`skeleton`)\n- **Category:** Data Display\n- **Native Element:** `<div aria-hidden=\"true\">`\n- **Summary:** Screen-reader-suppressed loading placeholders with smooth shimmer wave animation.\n- **When to Use:** Initial card, list, or table loading states.\n- **When Not to Use:** Fast interactions under 200ms.\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/skeleton/skeleton.css`\n- **Component Spec:** `docs/components/skeleton.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<div aria-busy=\"true\">\n  <div class=\"as-skeleton as-skeleton--avatar\" aria-hidden=\"true\" style=\"width: 40px; height: 40px;\"></div>\n  <div class=\"as-skeleton as-skeleton--text\" aria-hidden=\"true\" style=\"width: 80%;\"></div>\n  <div class=\"as-skeleton as-skeleton--text\" aria-hidden=\"true\" style=\"width: 50%;\"></div>\n</div>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** 16px text line / 40px avatar circle\n- **Horizontal Padding:** 0px\n- **Vertical Padding:** 8px vertical stack gap (--as-space-2)\n- **Corner Radius:** 8px block (--as-radius-md) / 9999px circle\n- **Typography:** aria-hidden=\"true\" visual placeholder\n- **Icon / Secondary Control:** 1.6s shimmer wave animation\n- **Focus Ring:** Non-interactive placeholder\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Text Line Height",
        "value": "16px (12px title / 64px block)",
        "token": ".as-skeleton--text",
        "type": "Fixed"
      },
      {
        "property": "Avatar Dimensions",
        "value": "40px × 40px",
        "token": ".as-skeleton--avatar",
        "type": "Fixed"
      },
      {
        "property": "Corner Radius",
        "value": "8px block / 9999px avatar",
        "token": "--as-radius-md / --as-radius-full",
        "type": "Fixed"
      }
    ],
    "spec": {
      "height": "16px text line / 40px avatar circle",
      "paddingX": "0px",
      "paddingY": "8px vertical stack gap (--as-space-2)",
      "radius": "8px block (--as-radius-md) / 9999px circle",
      "typography": "aria-hidden=\"true\" visual placeholder",
      "iconGap": "1.6s shimmer wave animation",
      "focusRing": "Non-interactive placeholder"
    }
  },
  "alert": {
    "slug": "alert",
    "name": "Alert",
    "category": "Feedback & Status",
    "description": "Dismissible status banners with 8px radius, Shade-DS status surface, double 1px glass glow, and 12px solid red dot dismiss control.",
    "element": "<div role=\"region|alert\">",
    "status": "Production",
    "previewHtml": "<div style=\"display: flex; flex-direction: column; gap: var(--as-space-3); width: 100%; max-width: 540px;\">\n        <div class=\"as-alert as-alert--warning\" role=\"region\" aria-labelledby=\"al-w-title\">\n          <svg class=\"as-alert__icon\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M8 2 L14 13 L2 13 Z\"></path><line x1=\"8\" y1=\"6\" x2=\"8\" y2=\"9\"></line><circle cx=\"8\" cy=\"11\" r=\"0.75\" fill=\"currentColor\"></circle></svg>\n          <div class=\"as-alert__content\">\n            <div class=\"as-alert__title\" id=\"al-w-title\">Scheduled Rolling Kernel Upgrade</div>\n            <div class=\"as-alert__description\">Node pool eu-west-1a will drain active pods in 45 minutes. Click the red dot button to dismiss.</div>\n          </div>\n          <button type=\"button\" class=\"as-alert__close\" aria-label=\"Dismiss alert\"></button>\n        </div>\n      </div>",
    "codeSnippet": "<div class=\"as-alert as-alert--warning\" role=\"region\" aria-labelledby=\"alert-title\">\n  <svg class=\"as-alert__icon\" viewBox=\"0 0 16 16\" aria-hidden=\"true\">...</svg>\n  <div class=\"as-alert__content\">\n    <div class=\"as-alert__title\" id=\"alert-title\">Maintenance Notice</div>\n    <div class=\"as-alert__description\">Worker node drain initiated.</div>\n  </div>\n  <button type=\"button\" class=\"as-alert__close\" aria-label=\"Dismiss alert\"></button>\n</div>",
    "promptSnippet": "# Aster Component Implementation Prompt — Alert\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Alert (`alert`)\n- **Category:** Feedback & Status\n- **Native Element:** `<div role=\"region|alert\">`\n- **Summary:** Dismissible status banners with 8px radius, Shade-DS status surface, double 1px glass glow, and 12px solid red dot dismiss control.\n- **When to Use:** Contextual system warnings, maintenance notices, or error summaries.\n- **When Not to Use:** Transient floating confirmations (use Toast).\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/alert/alert.css`\n- **Component Spec:** `docs/components/alert.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<div class=\"as-alert as-alert--warning\" role=\"region\" aria-labelledby=\"alert-title\">\n  <svg class=\"as-alert__icon\" viewBox=\"0 0 16 16\" aria-hidden=\"true\">...</svg>\n  <div class=\"as-alert__content\">\n    <div class=\"as-alert__title\" id=\"alert-title\">Maintenance Notice</div>\n    <div class=\"as-alert__description\">Worker node drain initiated.</div>\n  </div>\n  <button type=\"button\" class=\"as-alert__close\" aria-label=\"Dismiss alert\"></button>\n</div>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** Content-dependent (min 56px)\n- **Horizontal Padding:** 16px left / 16px right (--as-space-4)\n- **Vertical Padding:** 12px top / 12px bottom (--as-space-3)\n- **Corner Radius:** 8px (--as-radius-md)\n- **Typography:** Manrope 14px / 600 title · 14px description\n- **Icon / Secondary Control:** 12px solid red dot dismiss control (--as-semantic-color-status-critical-text)\n- **Focus Ring:** Double 1px glass glow focus indicator\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Padding",
        "value": "12px vertical / 16px horizontal",
        "token": "--as-space-3 / --as-space-4",
        "type": "Fixed"
      },
      {
        "property": "Corner Radius & Surface",
        "value": "8px radius; double 1px glass glow, Shade-DS status surface",
        "token": "--as-radius-md",
        "type": "Fixed"
      },
      {
        "property": "Close Control (Red Dot)",
        "value": "12px circle (#ff453a dark / #c5221f light, scale 1.2 on hover, 0.9 active)",
        "token": ".as-alert__close",
        "type": "Fixed"
      },
      {
        "property": "Banner Height",
        "value": "Auto (expands with message copy)",
        "token": "—",
        "type": "Content-Dependent"
      }
    ],
    "spec": {
      "height": "Content-dependent (min 56px)",
      "paddingX": "16px left / 16px right (--as-space-4)",
      "paddingY": "12px top / 12px bottom (--as-space-3)",
      "radius": "8px (--as-radius-md)",
      "typography": "Manrope 14px / 600 title · 14px description",
      "iconGap": "12px solid red dot dismiss control (--as-semantic-color-status-critical-text)",
      "focusRing": "Double 1px glass glow focus indicator"
    }
  },
  "tooltip": {
    "slug": "tooltip",
    "name": "Tooltip",
    "category": "Feedback & Status",
    "description": "Contextual micro-copy bubble with 4px corner radius adhering to WCAG 2.2 SC 1.4.13 with Escape dismissal.",
    "element": "<div role=\"tooltip\">",
    "status": "Production",
    "previewHtml": "<div style=\"display: flex; gap: var(--as-space-5); align-items: center; justify-content: center;\">\n        <div class=\"as-tooltip-trigger\">\n          <button type=\"button\" class=\"as-button as-button--secondary\">\n            <span class=\"as-button__label\">Snapshot Volume</span>\n          </button>\n          <div class=\"as-tooltip\" role=\"tooltip\">Instant cryptographic volume snapshot</div>\n        </div>\n        <div class=\"as-tooltip-trigger\">\n          <button type=\"button\" class=\"as-button as-button--ghost\">\n            <span class=\"as-button__label\">Help Guide</span>\n          </button>\n          <div class=\"as-tooltip\" role=\"tooltip\">View automated failover documentation</div>\n        </div>\n      </div>",
    "codeSnippet": "<div class=\"as-tooltip-trigger\">\n  <button type=\"button\" class=\"as-button as-button--secondary\" aria-describedby=\"tip-snap\">\n    <span class=\"as-button__label\">Snapshot Volume</span>\n  </button>\n  <div class=\"as-tooltip\" id=\"tip-snap\" role=\"tooltip\">\n    Instant cryptographic volume snapshot\n  </div>\n</div>",
    "promptSnippet": "# Aster Component Implementation Prompt — Tooltip\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Tooltip (`tooltip`)\n- **Category:** Feedback & Status\n- **Native Element:** `<div role=\"tooltip\">`\n- **Summary:** Contextual micro-copy bubble with 4px corner radius adhering to WCAG 2.2 SC 1.4.13 with Escape dismissal.\n- **When to Use:** Clarifying icon buttons or terse technical abbreviations.\n- **When Not to Use:** Interactive content or buttons inside the floating panel (use Popover).\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/tooltip/tooltip.css`\n- **Component Spec:** `docs/components/tooltip.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<div class=\"as-tooltip-trigger\">\n  <button type=\"button\" class=\"as-button as-button--secondary\" aria-describedby=\"tip-snap\">\n    <span class=\"as-button__label\">Snapshot Volume</span>\n  </button>\n  <div class=\"as-tooltip\" id=\"tip-snap\" role=\"tooltip\">\n    Instant cryptographic volume snapshot\n  </div>\n</div>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** Content-dependent (min 28px)\n- **Horizontal Padding:** 12px left / 12px right (--as-space-3)\n- **Vertical Padding:** 4px top / 4px bottom (--as-space-1)\n- **Corner Radius:** 4px (--as-radius-sm)\n- **Typography:** Manrope · 12px (--as-typography-font-size-xs) · 500\n- **Icon / Secondary Control:** 8px offset above trigger (bottom: calc(100% + 8px))\n- **Focus Ring:** Triggered via hover or :focus-within; dismissed via Escape\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Padding",
        "value": "4px vertical / 12px horizontal",
        "token": "--as-space-1 / --as-space-3",
        "type": "Fixed"
      },
      {
        "property": "Maximum Width",
        "value": "260px",
        "token": "max-width: 260px",
        "type": "Content-Dependent up to 260px"
      },
      {
        "property": "Corner Radius",
        "value": "4px",
        "token": "--as-radius-sm",
        "type": "Fixed"
      },
      {
        "property": "Anchor Gap",
        "value": "8px above trigger",
        "token": "--as-space-2",
        "type": "Fixed"
      }
    ],
    "spec": {
      "height": "Content-dependent (min 28px)",
      "paddingX": "12px left / 12px right (--as-space-3)",
      "paddingY": "4px top / 4px bottom (--as-space-1)",
      "radius": "4px (--as-radius-sm)",
      "typography": "Manrope · 12px (--as-typography-font-size-xs) · 500",
      "iconGap": "8px offset above trigger (bottom: calc(100% + 8px))",
      "focusRing": "Triggered via hover or :focus-within; dismissed via Escape"
    }
  },
  "toast": {
    "slug": "toast",
    "name": "Toast",
    "category": "Feedback & Status",
    "description": "Ephemeral floating notifications injected into a polite live region with Shade-DS 12px red dot close controls.",
    "element": "showToast() + <div role=\"status\">",
    "status": "Production",
    "previewHtml": "<div style=\"display: flex; flex-wrap: wrap; gap: var(--as-space-3); justify-content: center;\">\n        <button type=\"button\" class=\"as-button as-button--primary\" data-toast-trigger data-toast-variant=\"success\" data-toast-title=\"Cluster Rebalanced\" data-toast-message=\"Workloads successfully distributed across 3 AZs.\">\n          <span class=\"as-button__label\">Spawn Success Toast</span>\n        </button>\n        <button type=\"button\" class=\"as-button as-button--destructive\" data-toast-trigger data-toast-variant=\"critical\" data-toast-title=\"Pod Cordoned\" data-toast-message=\"Node worker-02 memory exceeded threshold.\">\n          <span class=\"as-button__label\">Spawn Critical Toast</span>\n        </button>\n      </div>",
    "codeSnippet": "import { showToast } from '/dist/js/aster.js';\n\n// Spawn accessible notification with Shade-DS 12px red dot close button\nshowToast({\n  title: 'Cluster Rebalanced',\n  message: 'Workloads distributed across 3 availability zones.',\n  variant: 'success', // 'success' | 'warning' | 'critical' | 'info'\n  duration: 4000\n});",
    "promptSnippet": "# Aster Component Implementation Prompt — Toast\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Toast (`toast`)\n- **Category:** Feedback & Status\n- **Native Element:** `showToast() + <div role=\"status\">`\n- **Summary:** Ephemeral floating notifications injected into a polite live region with Shade-DS 12px red dot close controls.\n- **When to Use:** Confirming saved settings, queued deployments, or background syncs.\n- **When Not to Use:** Blocking errors requiring immediate user input (use Dialog).\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/toast/toast.css`\n- **Component Spec:** `docs/components/toast.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\nimport { showToast } from '/dist/js/aster.js';\n\n// Spawn accessible notification with Shade-DS 12px red dot close button\nshowToast({\n  title: 'Cluster Rebalanced',\n  message: 'Workloads distributed across 3 availability zones.',\n  variant: 'success', // 'success' | 'warning' | 'critical' | 'info'\n  duration: 4000\n});\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** Content-dependent (min 56px)\n- **Horizontal Padding:** 16px left / 16px right (--as-space-4)\n- **Vertical Padding:** 12px top / 12px bottom (--as-space-3)\n- **Corner Radius:** 8px (--as-radius-md)\n- **Typography:** Manrope 14px / 600 title · 12px message\n- **Icon / Secondary Control:** 12px solid red dot dismiss control (--as-semantic-color-status-critical-text)\n- **Focus Ring:** Double 1px glass glow focus indicator\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Width Range",
        "value": "Min 320px / Max 420px",
        "token": "min-width: 320px; max-width: 420px",
        "type": "Content-Dependent within range"
      },
      {
        "property": "Padding",
        "value": "12px vertical / 16px horizontal",
        "token": "--as-space-3 / --as-space-4",
        "type": "Fixed"
      },
      {
        "property": "Corner Radius",
        "value": "8px",
        "token": "--as-radius-md",
        "type": "Fixed"
      },
      {
        "property": "Close Control (Red Dot)",
        "value": "12px circle (#ff453a dark / #c5221f light, scale 1.2 on hover, 0.9 active)",
        "token": ".as-toast__close",
        "type": "Fixed"
      }
    ],
    "spec": {
      "height": "Content-dependent (min 56px)",
      "paddingX": "16px left / 16px right (--as-space-4)",
      "paddingY": "12px top / 12px bottom (--as-space-3)",
      "radius": "8px (--as-radius-md)",
      "typography": "Manrope 14px / 600 title · 12px message",
      "iconGap": "12px solid red dot dismiss control (--as-semantic-color-status-critical-text)",
      "focusRing": "Double 1px glass glow focus indicator"
    }
  },
  "dialog": {
    "slug": "dialog",
    "name": "Dialog",
    "category": "Overlays & Dialogs",
    "description": "Native <dialog> modal window with 16px radius, backdrop blur (20px), double 1px glass glow shadows, macOS red circular close control, and pill CTA footer.",
    "element": "<dialog>",
    "status": "Production",
    "previewHtml": "<div>\n        <button type=\"button\" class=\"as-button as-button--primary\" data-dialog-open=\"pg-showcase-dlg\">\n          <span class=\"as-button__label\">Open System Spec Dialog</span>\n        </button>\n        <dialog class=\"as-dialog\" id=\"pg-showcase-dlg\" aria-labelledby=\"pg-sc-dlg-t\" aria-describedby=\"pg-sc-dlg-d\">\n          <div class=\"as-dialog__surface\">\n            <div class=\"as-dialog__header\">\n              <span class=\"as-dialog__title\" id=\"pg-sc-dlg-t\">SYSTEM SPEC</span>\n              <button type=\"button\" class=\"as-dialog__close\" aria-label=\"Close dialog\" data-dialog-close></button>\n            </div>\n            <div class=\"as-dialog__hero\">\n              <div class=\"as-dialog__hero-bg\">\n                <svg width=\"100%\" height=\"100%\" viewBox=\"0 0 400 200\">\n                  <circle cx=\"200\" cy=\"100\" r=\"80\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1\"></circle>\n                  <path d=\"M 100 100 Q 200 0 300 100\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"0.75\"></path>\n                </svg>\n              </div>\n              <h2 class=\"as-dialog__hero-title\">SYSTEM SPEC</h2>\n              <p class=\"as-dialog__hero-subtitle\" id=\"pg-sc-dlg-d\">The fundamental laws governing the creation of this digital artifact.</p>\n            </div>\n            <div class=\"as-dialog__body\">\n              <div class=\"as-dialog__section\">\n                <div class=\"as-dialog__section-title\">\n                  <svg width=\"20\" height=\"20\" viewBox=\"0 0 256 256\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z\"></path></svg>\n                  <span>CORE RULES</span>\n                </div>\n                <ol class=\"as-dialog__rule-list\">\n                  <li class=\"as-dialog__rule-item\"><span class=\"as-dialog__rule-num\">1.</span><span>Hide complexity until desired.</span></li>\n                  <li class=\"as-dialog__rule-item\"><span class=\"as-dialog__rule-num\">2.</span><span>Write Compact Helpful copy (max 3 lines, 40–80 chars per line, EL5 mode).</span></li>\n                  <li class=\"as-dialog__rule-item\"><span class=\"as-dialog__rule-num\">3.</span><span>One primary focus at a time.</span></li>\n                  <li class=\"as-dialog__rule-item\"><span class=\"as-dialog__rule-num\">4.</span><span>Design Adaptive always (adapt to any device).</span></li>\n                  <li class=\"as-dialog__rule-item\"><span class=\"as-dialog__rule-num\">5.</span><span>Prioritize Stability &gt; Performance &gt; Usability &gt; Aesthetic.</span></li>\n                </ol>\n              </div>\n            </div>\n            <div class=\"as-dialog__footer\">\n              <button type=\"button\" class=\"as-button as-button--primary as-button--lg as-button--pill-cta\" data-dialog-close>\n                <svg width=\"18\" height=\"18\" viewBox=\"0 0 256 256\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z\"></path></svg>\n                <span class=\"as-button__label\">COPY AS MARKDOWN</span>\n              </button>\n            </div>\n          </div>\n        </dialog>\n      </div>",
    "codeSnippet": "<dialog class=\"as-dialog\" id=\"system-spec-modal\" aria-labelledby=\"modal-title\" aria-describedby=\"modal-desc\">\n  <div class=\"as-dialog__surface\">\n    <div class=\"as-dialog__header\">\n      <span class=\"as-dialog__title\" id=\"modal-title\">SYSTEM SPEC</span>\n      <button type=\"button\" class=\"as-dialog__close\" data-dialog-close aria-label=\"Close dialog\"></button>\n    </div>\n    <div class=\"as-dialog__hero\">\n      <h2 class=\"as-dialog__hero-title\">SYSTEM SPEC</h2>\n      <p class=\"as-dialog__hero-subtitle\" id=\"modal-desc\">The fundamental laws governing the creation of this digital artifact.</p>\n    </div>\n    <div class=\"as-dialog__body\">\n      <div class=\"as-dialog__section\">\n        <div class=\"as-dialog__section-title\">\n          <svg width=\"20\" height=\"20\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z\"/></svg>\n          <span>CORE RULES</span>\n        </div>\n        <ol class=\"as-dialog__rule-list\">\n          <li class=\"as-dialog__rule-item\"><span class=\"as-dialog__rule-num\">1.</span><span>Hide complexity until desired.</span></li>\n        </ol>\n      </div>\n    </div>\n    <div class=\"as-dialog__footer\">\n      <button type=\"button\" class=\"as-button as-button--primary as-button--lg as-button--pill-cta\" data-dialog-close>\n        <svg width=\"18\" height=\"18\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z\"/></svg>\n        <span class=\"as-button__label\">COPY AS MARKDOWN</span>\n      </button>\n    </div>\n  </div>\n</dialog>",
    "promptSnippet": "# Aster Component Implementation Prompt — Dialog\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Dialog (`dialog`)\n- **Category:** Overlays & Dialogs\n- **Native Element:** `<dialog>`\n- **Summary:** Native <dialog> modal window with 16px radius, backdrop blur (20px), double 1px glass glow shadows, macOS red circular close control, and pill CTA footer.\n- **When to Use:** Focused system specs, irreversible confirmations, critical warnings, and modal workflows.\n- **When Not to Use:** Deep multi-section inspection (use Drawer) or passive status updates (use Toast).\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/dialog/dialog.css`\n- **Component Spec:** `docs/components/dialog.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<dialog class=\"as-dialog\" id=\"system-spec-modal\" aria-labelledby=\"modal-title\" aria-describedby=\"modal-desc\">\n  <div class=\"as-dialog__surface\">\n    <div class=\"as-dialog__header\">\n      <span class=\"as-dialog__title\" id=\"modal-title\">SYSTEM SPEC</span>\n      <button type=\"button\" class=\"as-dialog__close\" data-dialog-close aria-label=\"Close dialog\"></button>\n    </div>\n    <div class=\"as-dialog__hero\">\n      <h2 class=\"as-dialog__hero-title\">SYSTEM SPEC</h2>\n      <p class=\"as-dialog__hero-subtitle\" id=\"modal-desc\">The fundamental laws governing the creation of this digital artifact.</p>\n    </div>\n    <div class=\"as-dialog__body\">\n      <div class=\"as-dialog__section\">\n        <div class=\"as-dialog__section-title\">\n          <svg width=\"20\" height=\"20\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z\"/></svg>\n          <span>CORE RULES</span>\n        </div>\n        <ol class=\"as-dialog__rule-list\">\n          <li class=\"as-dialog__rule-item\"><span class=\"as-dialog__rule-num\">1.</span><span>Hide complexity until desired.</span></li>\n        </ol>\n      </div>\n    </div>\n    <div class=\"as-dialog__footer\">\n      <button type=\"button\" class=\"as-button as-button--primary as-button--lg as-button--pill-cta\" data-dialog-close>\n        <svg width=\"18\" height=\"18\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z\"/></svg>\n        <span class=\"as-button__label\">COPY AS MARKDOWN</span>\n      </button>\n    </div>\n  </div>\n</dialog>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** Max 600px (min(85vh, 600px))\n- **Horizontal Padding:** 16px header/footer (--as-space-4) · 20px body (--as-space-5)\n- **Vertical Padding:** 16px vertical body padding · 48px header height\n- **Corner Radius:** 16px (--as-radius-lg)\n- **Typography:** Bebas Neue 38px hero · Manrope 12px uppercase label · 13.5px body\n- **Icon / Secondary Control:** 12px solid red dot dismiss control (--as-semantic-color-status-critical-text)\n- **Focus Ring:** Native <dialog> focus trap + 2px focus ring\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Panel Width",
        "value": "400px (min(92vw, 400px))",
        "token": "max-width: 400px",
        "type": "Fixed cap / Responsive"
      },
      {
        "property": "Max Height",
        "value": "600px (min(85vh, 600px))",
        "token": "max-height: 600px",
        "type": "Fixed cap"
      },
      {
        "property": "Header Height",
        "value": "48px (Space.5XL)",
        "token": "min-height: 48px; padding: 0 16px",
        "type": "Fixed"
      },
      {
        "property": "Corner Radius",
        "value": "16px",
        "token": "--as-radius-lg",
        "type": "Fixed"
      },
      {
        "property": "Outline / Glow",
        "value": "Double 1px glass glow box-shadow (border: none)",
        "token": "box-shadow: 0 0 1px ...",
        "type": "Fixed"
      },
      {
        "property": "Close Control (Red Dot)",
        "value": "12px circle (#ff453a dark / #c5221f light, scale 1.2 on hover, 0.9 active)",
        "token": ".as-dialog__close",
        "type": "Fixed"
      }
    ],
    "spec": {
      "height": "Max 600px (min(85vh, 600px))",
      "paddingX": "16px header/footer (--as-space-4) · 20px body (--as-space-5)",
      "paddingY": "16px vertical body padding · 48px header height",
      "radius": "16px (--as-radius-lg)",
      "typography": "Bebas Neue 38px hero · Manrope 12px uppercase label · 13.5px body",
      "iconGap": "12px solid red dot dismiss control (--as-semantic-color-status-critical-text)",
      "focusRing": "Native <dialog> focus trap + 2px focus ring"
    }
  },
  "drawer": {
    "slug": "drawer",
    "name": "Drawer",
    "category": "Overlays & Dialogs",
    "description": "Full-height slide-over sheet panel (440px max-width) with backdrop scrim, focus trapping, and Shade-DS 12px solid red dot close control.",
    "element": "<div role=\"dialog\" aria-modal=\"true\">",
    "status": "Production",
    "previewHtml": "<div>\n        <button type=\"button\" class=\"as-button as-button--secondary\" data-drawer-open=\"pg-showcase-drawer\">\n          <span class=\"as-button__label\">Open Side Drawer</span>\n        </button>\n        <div class=\"as-drawer\" id=\"pg-showcase-drawer\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"pg-sc-drw-t\" hidden>\n          <div class=\"as-drawer__backdrop\" data-drawer-close></div>\n          <div class=\"as-drawer__panel as-drawer__panel--right\">\n            <div class=\"as-drawer__header\">\n              <div>\n                <h3 class=\"as-drawer__title\" id=\"pg-sc-drw-t\">Node Telemetry Stream</h3>\n                <p class=\"as-drawer__description\">Real-time metrics and kernel allocation.</p>\n              </div>\n              <button type=\"button\" class=\"as-drawer__close\" aria-label=\"Close drawer\" data-drawer-close></button>\n            </div>\n            <div class=\"as-drawer__body\">\n              <p style=\"margin: 0; color: var(--as-semantic-color-text-muted);\">Real-time stream connected. Node worker-01 running kernel 6.8 with zero dropped packets.</p>\n            </div>\n            <div class=\"as-drawer__footer\">\n              <button type=\"button\" class=\"as-button as-button--secondary\" data-drawer-close><span class=\"as-button__label\">Close</span></button>\n            </div>\n          </div>\n        </div>\n      </div>",
    "codeSnippet": "<div class=\"as-drawer\" id=\"side-drawer\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"drawer-title\" hidden>\n  <div class=\"as-drawer__backdrop\" data-drawer-close></div>\n  <div class=\"as-drawer__panel as-drawer__panel--right\">\n    <div class=\"as-drawer__header\">\n      <h3 class=\"as-drawer__title\" id=\"drawer-title\">Node Telemetry</h3>\n      <button type=\"button\" class=\"as-drawer__close\" data-drawer-close aria-label=\"Close drawer\"></button>\n    </div>\n    <div class=\"as-drawer__body\">Telemetry details...</div>\n  </div>\n</div>",
    "promptSnippet": "# Aster Component Implementation Prompt — Drawer\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Drawer (`drawer`)\n- **Category:** Overlays & Dialogs\n- **Native Element:** `<div role=\"dialog\" aria-modal=\"true\">`\n- **Summary:** Full-height slide-over sheet panel (440px max-width) with backdrop scrim, focus trapping, and Shade-DS 12px solid red dot close control.\n- **When to Use:** Telemetry inspectors, log streams, and multi-field configuration panels.\n- **When Not to Use:** Simple yes/no confirmations (use Dialog).\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/drawer/drawer.css`\n- **Component Spec:** `docs/components/drawer.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<div class=\"as-drawer\" id=\"side-drawer\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"drawer-title\" hidden>\n  <div class=\"as-drawer__backdrop\" data-drawer-close></div>\n  <div class=\"as-drawer__panel as-drawer__panel--right\">\n    <div class=\"as-drawer__header\">\n      <h3 class=\"as-drawer__title\" id=\"drawer-title\">Node Telemetry</h3>\n      <button type=\"button\" class=\"as-drawer__close\" data-drawer-close aria-label=\"Close drawer\"></button>\n    </div>\n    <div class=\"as-drawer__body\">Telemetry details...</div>\n  </div>\n</div>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** 100vh full viewport height\n- **Horizontal Padding:** 20px header/body/footer (--as-space-5)\n- **Vertical Padding:** 16px header/footer · 20px scrollable body\n- **Corner Radius:** 0px edge panel (--as-radius-none)\n- **Typography:** Manrope 18px / 600 title · 14px body\n- **Icon / Secondary Control:** 12px solid red dot dismiss control (--as-semantic-color-status-critical-text)\n- **Focus Ring:** Circular Tab focus trap + Escape dismiss\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Panel Width & Height",
        "value": "Max 440px width × 100vh height",
        "token": "max-width: 440px; height: 100%",
        "type": "Fixed"
      },
      {
        "property": "Header / Body / Footer Padding",
        "value": "16px×20px header & footer; 20px body",
        "token": "--as-space-4 / --as-space-5",
        "type": "Fixed"
      },
      {
        "property": "Close Control (Red Dot)",
        "value": "12px circle (#ff453a dark / #c5221f light, scale 1.2 on hover, 0.9 active)",
        "token": ".as-drawer__close",
        "type": "Fixed"
      }
    ],
    "spec": {
      "height": "100vh full viewport height",
      "paddingX": "20px header/body/footer (--as-space-5)",
      "paddingY": "16px header/footer · 20px scrollable body",
      "radius": "0px edge panel (--as-radius-none)",
      "typography": "Manrope 18px / 600 title · 14px body",
      "iconGap": "12px solid red dot dismiss control (--as-semantic-color-status-critical-text)",
      "focusRing": "Circular Tab focus trap + Escape dismiss"
    }
  },
  "popover": {
    "slug": "popover",
    "name": "Popover",
    "category": "Overlays & Dialogs",
    "description": "Anchored floating contextual card (12px radius) with light dismissal, Escape support, and Shade-DS 12px solid red dot close control.",
    "element": "<div role=\"dialog\">",
    "status": "Production",
    "previewHtml": "<div class=\"as-popover-anchor\">\n        <button type=\"button\" class=\"as-button as-button--secondary as-popover-trigger\" id=\"pg-sc-pop-btn\" aria-haspopup=\"dialog\" aria-expanded=\"false\">\n          <span class=\"as-button__label\">Filter Pods</span>\n        </button>\n        <div class=\"as-popover\" role=\"dialog\" aria-labelledby=\"pg-sc-pop-btn\" hidden>\n          <div class=\"as-popover__header\">\n            <h4 class=\"as-popover__title\">Filter Preferences</h4>\n            <button type=\"button\" class=\"as-popover__close\" aria-label=\"Close popover\" data-popover-close></button>\n          </div>\n          <div class=\"as-popover__body\">\n            <p style=\"margin: 0; font-size: var(--as-typography-font-size-sm); color: var(--as-semantic-color-text-muted);\">\n              Display healthy worker instances only. Click the red dot button or outside to dismiss.\n            </p>\n          </div>\n        </div>\n      </div>",
    "codeSnippet": "<div class=\"as-popover-anchor\">\n  <button type=\"button\" class=\"as-button as-button--secondary as-popover-trigger\" id=\"pop-btn\" aria-haspopup=\"dialog\" aria-expanded=\"false\">\n    <span class=\"as-button__label\">Filter Pods</span>\n  </button>\n  <div class=\"as-popover\" role=\"dialog\" aria-labelledby=\"pop-btn\" hidden>\n    <div class=\"as-popover__header\">\n      <h4 class=\"as-popover__title\">Filter Preferences</h4>\n      <button type=\"button\" class=\"as-popover__close\" data-popover-close aria-label=\"Close popover\"></button>\n    </div>\n    <div class=\"as-popover__body\">Display healthy worker instances only.</div>\n  </div>\n</div>",
    "promptSnippet": "# Aster Component Implementation Prompt — Popover\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Popover (`popover`)\n- **Category:** Overlays & Dialogs\n- **Native Element:** `<div role=\"dialog\">`\n- **Summary:** Anchored floating contextual card (12px radius) with light dismissal, Escape support, and Shade-DS 12px solid red dot close control.\n- **When to Use:** Quick inline filter cards, contextual metadata inspectors, or setting callouts.\n- **When Not to Use:** Plain text labels without interactive controls (use Tooltip).\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/popover/popover.css`\n- **Component Spec:** `docs/components/popover.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<div class=\"as-popover-anchor\">\n  <button type=\"button\" class=\"as-button as-button--secondary as-popover-trigger\" id=\"pop-btn\" aria-haspopup=\"dialog\" aria-expanded=\"false\">\n    <span class=\"as-button__label\">Filter Pods</span>\n  </button>\n  <div class=\"as-popover\" role=\"dialog\" aria-labelledby=\"pop-btn\" hidden>\n    <div class=\"as-popover__header\">\n      <h4 class=\"as-popover__title\">Filter Preferences</h4>\n      <button type=\"button\" class=\"as-popover__close\" data-popover-close aria-label=\"Close popover\"></button>\n    </div>\n    <div class=\"as-popover__body\">Display healthy worker instances only.</div>\n  </div>\n</div>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** Content-dependent\n- **Horizontal Padding:** 16px body (--as-space-4)\n- **Vertical Padding:** 12px header · 16px body\n- **Corner Radius:** 12px (--as-radius-lg)\n- **Typography:** Manrope 14px / 600 title · 14px body\n- **Icon / Secondary Control:** 12px solid red dot dismiss control (--as-semantic-color-status-critical-text)\n- **Focus Ring:** Light dismiss on outside click + Escape key\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Width Range",
        "value": "Min 280px / Max 360px",
        "token": "min-width: 280px; max-width: 360px",
        "type": "Content-Dependent within range"
      },
      {
        "property": "Header & Body Padding",
        "value": "12px×16px header; 16px body",
        "token": "--as-space-3 / --as-space-4",
        "type": "Fixed"
      },
      {
        "property": "Corner Radius",
        "value": "12px",
        "token": "--as-radius-lg",
        "type": "Fixed"
      },
      {
        "property": "Close Control (Red Dot)",
        "value": "12px circle (#ff453a dark / #c5221f light, scale 1.2 on hover, 0.9 active)",
        "token": ".as-popover__close",
        "type": "Fixed"
      }
    ],
    "spec": {
      "height": "Content-dependent",
      "paddingX": "16px body (--as-space-4)",
      "paddingY": "12px header · 16px body",
      "radius": "12px (--as-radius-lg)",
      "typography": "Manrope 14px / 600 title · 14px body",
      "iconGap": "12px solid red dot dismiss control (--as-semantic-color-status-critical-text)",
      "focusRing": "Light dismiss on outside click + Escape key"
    }
  },
  "dropdown": {
    "slug": "dropdown",
    "name": "Dropdown Menu",
    "category": "Overlays & Dialogs",
    "description": "Contextual action menu adhering to the W3C APG Menu Button pattern with roving ArrowUp/ArrowDown focus.",
    "element": "<div role=\"menu\">",
    "status": "Production",
    "previewHtml": "<div class=\"as-dropdown\">\n        <button type=\"button\" class=\"as-button as-button--secondary as-dropdown__trigger\" id=\"pg-sc-dd-btn\" aria-haspopup=\"menu\" aria-expanded=\"false\">\n          <span class=\"as-button__label\">Cluster Operations</span>\n          <svg class=\"as-dropdown__chevron\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><polyline points=\"4 6 8 10 12 6\"></polyline></svg>\n        </button>\n        <div class=\"as-dropdown__menu\" role=\"menu\" aria-labelledby=\"pg-sc-dd-btn\" hidden>\n          <button type=\"button\" class=\"as-dropdown__item\" role=\"menuitem\">Restart Active Pods</button>\n          <button type=\"button\" class=\"as-dropdown__item\" role=\"menuitem\">Export Telemetry</button>\n          <div class=\"as-dropdown__divider\" role=\"separator\"></div>\n          <button type=\"button\" class=\"as-dropdown__item as-dropdown__item--destructive\" role=\"menuitem\">Drain Node Pool</button>\n        </div>\n      </div>",
    "codeSnippet": "<div class=\"as-dropdown\">\n  <button type=\"button\" class=\"as-button as-button--secondary as-dropdown__trigger\" id=\"menu-btn\" aria-haspopup=\"menu\" aria-expanded=\"false\">\n    <span class=\"as-button__label\">Cluster Operations</span>\n  </button>\n  <div class=\"as-dropdown__menu\" role=\"menu\" aria-labelledby=\"menu-btn\" hidden>\n    <button type=\"button\" class=\"as-dropdown__item\" role=\"menuitem\">Restart Active Pods</button>\n    <div class=\"as-dropdown__divider\" role=\"separator\"></div>\n    <button type=\"button\" class=\"as-dropdown__item as-dropdown__item--destructive\" role=\"menuitem\">Drain Node Pool</button>\n  </div>\n</div>",
    "promptSnippet": "# Aster Component Implementation Prompt — Dropdown Menu\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Dropdown Menu (`dropdown`)\n- **Category:** Overlays & Dialogs\n- **Native Element:** `<div role=\"menu\">`\n- **Summary:** Contextual action menu adhering to the W3C APG Menu Button pattern with roving ArrowUp/ArrowDown focus.\n- **When to Use:** Row-level actions, overflow command menus, and contextual operations.\n- **When Not to Use:** Form field option selection (use Select).\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/dropdown/dropdown.css`\n- **Component Spec:** `docs/components/dropdown.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<div class=\"as-dropdown\">\n  <button type=\"button\" class=\"as-button as-button--secondary as-dropdown__trigger\" id=\"menu-btn\" aria-haspopup=\"menu\" aria-expanded=\"false\">\n    <span class=\"as-button__label\">Cluster Operations</span>\n  </button>\n  <div class=\"as-dropdown__menu\" role=\"menu\" aria-labelledby=\"menu-btn\" hidden>\n    <button type=\"button\" class=\"as-dropdown__item\" role=\"menuitem\">Restart Active Pods</button>\n    <div class=\"as-dropdown__divider\" role=\"separator\"></div>\n    <button type=\"button\" class=\"as-dropdown__item as-dropdown__item--destructive\" role=\"menuitem\">Drain Node Pool</button>\n  </div>\n</div>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** 36px per menuitem\n- **Horizontal Padding:** 12px item horizontal (--as-space-3)\n- **Vertical Padding:** 8px item vertical (--as-space-2)\n- **Corner Radius:** 8px menu (--as-radius-md) · 4px item (--as-radius-sm)\n- **Typography:** Manrope · 14px · 400 Regular\n- **Icon / Secondary Control:** 16px chevron on trigger · 8px item gap\n- **Focus Ring:** Roving ArrowUp/ArrowDown focus with 2px focus ring\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Menu Minimum Width",
        "value": "200px",
        "token": "min-width: 200px",
        "type": "Content-Dependent (min 200px)"
      },
      {
        "property": "Menu Item Height & Padding",
        "value": "36px min-height; 8px × 12px padding",
        "token": "--as-space-2 / --as-space-3",
        "type": "Fixed"
      },
      {
        "property": "Corner Radius",
        "value": "8px menu container / 4px item",
        "token": "--as-radius-md / --as-radius-sm",
        "type": "Fixed"
      }
    ],
    "spec": {
      "height": "36px per menuitem",
      "paddingX": "12px item horizontal (--as-space-3)",
      "paddingY": "8px item vertical (--as-space-2)",
      "radius": "8px menu (--as-radius-md) · 4px item (--as-radius-sm)",
      "typography": "Manrope · 14px · 400 Regular",
      "iconGap": "16px chevron on trigger · 8px item gap",
      "focusRing": "Roving ArrowUp/ArrowDown focus with 2px focus ring"
    }
  },
  "tabs": {
    "slug": "tabs",
    "name": "Tabs",
    "category": "Navigation & Layout",
    "description": "W3C APG compliant tabbed navigation with roving tabindex and ArrowLeft/ArrowRight cycling.",
    "element": "<div role=\"tablist\"> + <div role=\"tabpanel\">",
    "status": "Production",
    "previewHtml": "<div class=\"as-tabs\" style=\"width: 100%; max-width: 560px;\">\n        <div class=\"as-tabs__list\" role=\"tablist\" aria-label=\"Infrastructure Management Tabs\" aria-orientation=\"horizontal\">\n          <button type=\"button\" class=\"as-tabs__tab is-active\" role=\"tab\" id=\"pg-sc-tab-1\" aria-selected=\"true\" aria-controls=\"pg-sc-pan-1\" tabindex=\"0\">Worker Nodes</button>\n          <button type=\"button\" class=\"as-tabs__tab\" role=\"tab\" id=\"pg-sc-tab-2\" aria-selected=\"false\" aria-controls=\"pg-sc-pan-2\" tabindex=\"-1\">Storage Volumes</button>\n          <button type=\"button\" class=\"as-tabs__tab\" role=\"tab\" id=\"pg-sc-tab-3\" aria-selected=\"false\" aria-controls=\"pg-sc-pan-3\" tabindex=\"-1\">Ingress Routing</button>\n        </div>\n        <div class=\"as-tabs__panel is-active\" role=\"tabpanel\" id=\"pg-sc-pan-1\" aria-labelledby=\"pg-sc-tab-1\" tabindex=\"0\">\n          <p style=\"margin: 0; color: var(--as-semantic-color-text-muted);\">Active nodes: 3 worker instances running kernel 6.8 with zero evictions.</p>\n        </div>\n        <div class=\"as-tabs__panel\" role=\"tabpanel\" id=\"pg-sc-pan-2\" aria-labelledby=\"pg-sc-tab-2\" tabindex=\"0\" hidden>\n          <p style=\"margin: 0; color: var(--as-semantic-color-text-muted);\">Storage: 4 NVMe-backed SSD volumes attached across availability zones.</p>\n        </div>\n        <div class=\"as-tabs__panel\" role=\"tabpanel\" id=\"pg-sc-pan-3\" aria-labelledby=\"pg-sc-tab-3\" tabindex=\"0\" hidden>\n          <p style=\"margin: 0; color: var(--as-semantic-color-text-muted);\">Network: Ingress mesh router handling 14,290 requests/sec with TLS termination.</p>\n        </div>\n      </div>",
    "codeSnippet": "<div class=\"as-tabs\">\n  <div class=\"as-tabs__list\" role=\"tablist\" aria-orientation=\"horizontal\">\n    <button type=\"button\" class=\"as-tabs__tab is-active\" role=\"tab\" id=\"tab-1\" aria-selected=\"true\" aria-controls=\"panel-1\" tabindex=\"0\">Worker Nodes</button>\n    <button type=\"button\" class=\"as-tabs__tab\" role=\"tab\" id=\"tab-2\" aria-selected=\"false\" aria-controls=\"panel-2\" tabindex=\"-1\">Storage Volumes</button>\n  </div>\n  <div class=\"as-tabs__panel is-active\" role=\"tabpanel\" id=\"panel-1\" aria-labelledby=\"tab-1\" tabindex=\"0\">Active nodes...</div>\n  <div class=\"as-tabs__panel\" role=\"tabpanel\" id=\"panel-2\" aria-labelledby=\"tab-2\" tabindex=\"0\" hidden>Storage volumes...</div>\n</div>",
    "promptSnippet": "# Aster Component Implementation Prompt — Tabs\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Tabs (`tabs`)\n- **Category:** Navigation & Layout\n- **Native Element:** `<div role=\"tablist\"> + <div role=\"tabpanel\">`\n- **Summary:** W3C APG compliant tabbed navigation with roving tabindex and ArrowLeft/ArrowRight cycling.\n- **When to Use:** Switching between sibling sub-views (e.g. Preview, Code, Prompt, Anatomy).\n- **When Not to Use:** Sequential multi-step wizards.\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/tabs/tabs.css`\n- **Component Spec:** `docs/components/tabs.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<div class=\"as-tabs\">\n  <div class=\"as-tabs__list\" role=\"tablist\" aria-orientation=\"horizontal\">\n    <button type=\"button\" class=\"as-tabs__tab is-active\" role=\"tab\" id=\"tab-1\" aria-selected=\"true\" aria-controls=\"panel-1\" tabindex=\"0\">Worker Nodes</button>\n    <button type=\"button\" class=\"as-tabs__tab\" role=\"tab\" id=\"tab-2\" aria-selected=\"false\" aria-controls=\"panel-2\" tabindex=\"-1\">Storage Volumes</button>\n  </div>\n  <div class=\"as-tabs__panel is-active\" role=\"tabpanel\" id=\"panel-1\" aria-labelledby=\"tab-1\" tabindex=\"0\">Active nodes...</div>\n  <div class=\"as-tabs__panel\" role=\"tabpanel\" id=\"panel-2\" aria-labelledby=\"tab-2\" tabindex=\"0\" hidden>Storage volumes...</div>\n</div>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** 42px tab trigger height\n- **Horizontal Padding:** 16px tab horizontal (--as-space-4)\n- **Vertical Padding:** 12px tab vertical (--as-space-3)\n- **Corner Radius:** 4px focus radius (--as-radius-sm)\n- **Typography:** Manrope · 14px · 500 Medium (600 active)\n- **Icon / Secondary Control:** 2px active bottom indicator bar\n- **Focus Ring:** Roving tabindex with ArrowLeft / ArrowRight navigation\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Tab Trigger Padding",
        "value": "12px vertical / 16px horizontal",
        "token": "--as-space-3 / --as-space-4",
        "type": "Fixed"
      },
      {
        "property": "Active Indicator Bar",
        "value": "2px solid primary bottom border",
        "token": "--as-semantic-color-interactive-primary",
        "type": "Fixed"
      },
      {
        "property": "Panel Top Padding",
        "value": "16px",
        "token": "--as-space-4",
        "type": "Fixed"
      }
    ],
    "spec": {
      "height": "42px tab trigger height",
      "paddingX": "16px tab horizontal (--as-space-4)",
      "paddingY": "12px tab vertical (--as-space-3)",
      "radius": "4px focus radius (--as-radius-sm)",
      "typography": "Manrope · 14px · 500 Medium (600 active)",
      "iconGap": "2px active bottom indicator bar",
      "focusRing": "Roving tabindex with ArrowLeft / ArrowRight navigation"
    }
  },
  "accordion": {
    "slug": "accordion",
    "name": "Accordion",
    "category": "Navigation & Layout",
    "description": "Vertically stacked disclosure panels (12px container radius) with semantic headings and single/multi expand modes.",
    "element": "<h3> + <button aria-expanded>",
    "status": "Production",
    "previewHtml": "<div class=\"as-accordion\" style=\"width: 100%; max-width: 560px;\" data-single=\"true\">\n        <div class=\"as-accordion__item\">\n          <h3 class=\"as-accordion__heading\">\n            <button type=\"button\" class=\"as-accordion__trigger\" aria-expanded=\"true\" aria-controls=\"pg-sc-acc-p1\" id=\"pg-sc-acc-t1\">\n              <span class=\"as-accordion__title\">Zero-Downtime Rollout Strategy</span>\n              <svg class=\"as-accordion__chevron\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><polyline points=\"4 6 8 10 12 6\"></polyline></svg>\n            </button>\n          </h3>\n          <div class=\"as-accordion__panel\" id=\"pg-sc-acc-p1\" role=\"region\" aria-labelledby=\"pg-sc-acc-t1\">\n            <div class=\"as-accordion__content\">\n              Pods are drained gracefully with health probe verification before terminating existing replicas.\n            </div>\n          </div>\n        </div>\n        <div class=\"as-accordion__item\">\n          <h3 class=\"as-accordion__heading\">\n            <button type=\"button\" class=\"as-accordion__trigger\" aria-expanded=\"false\" aria-controls=\"pg-sc-acc-p2\" id=\"pg-sc-acc-t2\">\n              <span class=\"as-accordion__title\">Multi-Zone Network Peering</span>\n              <svg class=\"as-accordion__chevron\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><polyline points=\"4 6 8 10 12 6\"></polyline></svg>\n            </button>\n          </h3>\n          <div class=\"as-accordion__panel\" id=\"pg-sc-acc-p2\" role=\"region\" aria-labelledby=\"pg-sc-acc-t2\" hidden>\n            <div class=\"as-accordion__content\">\n              Workloads are spread evenly across three availability zones with automatic cross-zone failover.\n            </div>\n          </div>\n        </div>\n      </div>",
    "codeSnippet": "<div class=\"as-accordion\" data-single=\"true\">\n  <div class=\"as-accordion__item\">\n    <h3 class=\"as-accordion__heading\">\n      <button type=\"button\" class=\"as-accordion__trigger\" aria-expanded=\"true\" aria-controls=\"sec-1\" id=\"trig-1\">\n        <span class=\"as-accordion__title\">Zero-Downtime Rollout Strategy</span>\n        <svg class=\"as-accordion__chevron\" viewBox=\"0 0 16 16\" aria-hidden=\"true\"><polyline points=\"4 6 8 10 12 6\"/></svg>\n      </button>\n    </h3>\n    <div class=\"as-accordion__panel\" id=\"sec-1\" role=\"region\" aria-labelledby=\"trig-1\">\n      <div class=\"as-accordion__content\">Pods are drained gracefully...</div>\n    </div>\n  </div>\n</div>",
    "promptSnippet": "# Aster Component Implementation Prompt — Accordion\n\n## 1. Component Purpose & Canonical Role\n- **Component:** Accordion (`accordion`)\n- **Category:** Navigation & Layout\n- **Native Element:** `<h3> + <button aria-expanded>`\n- **Summary:** Vertically stacked disclosure panels (12px container radius) with semantic headings and single/multi expand modes.\n- **When to Use:** FAQs, configuration groups, and collapsible architecture details.\n- **When Not to Use:** Content that users must read all at once.\n\n## 2. Authoritative Repository Files\n- **Component CSS:** `components/accordion/accordion.css`\n- **Component Spec:** `docs/components/accordion.md`\n- **Agent Contract:** `skills/using-aster-components/SKILL.md`\n- **Compiled Bundle:** `dist/css/aster.css` and `dist/js/aster.js`\n\n## 3. Canonical HTML Structure & Classes\n```html\n<div class=\"as-accordion\" data-single=\"true\">\n  <div class=\"as-accordion__item\">\n    <h3 class=\"as-accordion__heading\">\n      <button type=\"button\" class=\"as-accordion__trigger\" aria-expanded=\"true\" aria-controls=\"sec-1\" id=\"trig-1\">\n        <span class=\"as-accordion__title\">Zero-Downtime Rollout Strategy</span>\n        <svg class=\"as-accordion__chevron\" viewBox=\"0 0 16 16\" aria-hidden=\"true\"><polyline points=\"4 6 8 10 12 6\"/></svg>\n      </button>\n    </h3>\n    <div class=\"as-accordion__panel\" id=\"sec-1\" role=\"region\" aria-labelledby=\"trig-1\">\n      <div class=\"as-accordion__content\">Pods are drained gracefully...</div>\n    </div>\n  </div>\n</div>\n```\n\n## 4. Exact Geometry & Token Bindings (Standard Density)\n- **Height:** 52px trigger header height\n- **Horizontal Padding:** 16px horizontal (--as-space-4)\n- **Vertical Padding:** 16px trigger vertical · 16px panel bottom\n- **Corner Radius:** 12px container (--as-radius-lg)\n- **Typography:** Manrope 16px / 500 trigger · 14px panel copy\n- **Icon / Secondary Control:** 16px × 16px rotating chevron (180deg when expanded)\n- **Focus Ring:** 2px solid (--as-semantic-color-border-focus) inset\n\n## 5. Non-Negotiable Aster Constraints\n1. **Zero Primitive Color Leaks:** Bind colors strictly to `--as-semantic-color-*` custom properties. Never use `--as-color-primitive-*` or hardcoded hex values in component usage.\n2. **Minimum 4px Radius Policy:** Never use `2px` border-radius. Use `--as-radius-sm` (`4px`), `--as-radius-md` (`8px`), `--as-radius-lg` (`12px`), or `--as-radius-full` (`9999px`).\n3. **Single Standard Density Mode:** Compact mode (`data-density=\"compact\"` / `.as-*--compact`) is permanently retired. Do not emit compact classes or attributes.\n4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, Arrow keys).\n\n## 6. Verification Commands\n```bash\nnpm run test:components\nnpm run test:contrast\nnpm run test:browser\n```",
    "anatomyRows": [
      {
        "property": "Trigger Padding",
        "value": "16px vertical / 16px horizontal",
        "token": "--as-space-4",
        "type": "Fixed"
      },
      {
        "property": "Panel Content Padding",
        "value": "0px top / 16px horizontal / 16px bottom",
        "token": "--as-space-4",
        "type": "Fixed"
      },
      {
        "property": "Container Radius",
        "value": "12px",
        "token": "--as-radius-lg",
        "type": "Fixed"
      },
      {
        "property": "Chevron Size",
        "value": "16px × 16px",
        "token": "width: 16px; height: 16px",
        "type": "Fixed"
      }
    ],
    "spec": {
      "height": "52px trigger header height",
      "paddingX": "16px horizontal (--as-space-4)",
      "paddingY": "16px trigger vertical · 16px panel bottom",
      "radius": "12px container (--as-radius-lg)",
      "typography": "Manrope 16px / 500 trigger · 14px panel copy",
      "iconGap": "16px × 16px rotating chevron (180deg when expanded)",
      "focusRing": "2px solid (--as-semantic-color-border-focus) inset"
    }
  }
};
