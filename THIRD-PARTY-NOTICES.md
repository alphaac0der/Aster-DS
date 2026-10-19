# Third-Party Software Notices and Information

This document contains licensing notices and attribution for third-party software, visual designs, icons, fonts, and dependencies incorporated into, derived by, or utilized in the **Aster Design System (Aster DS)**.

---

## Table of Contents

1. [Shade-DS Visual Foundation & Component Architecture](#1-shade-ds-visual-foundation--component-architecture)
2. [Phosphor Icons](#2-phosphor-icons)
3. [Google Fonts Typography System](#3-google-fonts-typography-system)
4. [Build Tooling & Development Dependencies](#4-build-tooling--development-dependencies)
5. [Aster DS Licensing Status & Open Gates](#5-aster-ds-licensing-status--open-gates)

---

## 1. Shade-DS Visual Foundation & Component Architecture

- **Project:** [Shade-DS](https://github.com/shifatmasud/Shade-DS)
- **Author:** Shifat Masud ([@shifatmasud](https://github.com/shifatmasud))
- **Status in Aster DS:** Foundational visual grammar and component reference.
- **Permission Record:** Explicit personal permission was granted by Shifat Masud to use, adapt, and build upon Shade-DS components directly in Aster DS (formally recorded in `records/DECISION-LOG.md`, DEC-023).
- **Scope of Derivation:**
  - **10 Direct Component Reproductions:** Button (`button.js`, `button.css`), Input (`input.js`, `input.css`), Textarea (`textarea.js`, `textarea.css`), Select (`select.js`, `select.css`), Switch (`switch.js`, `switch.css`), Slider (`slider.js`, `slider.css`), Accordion (`accordion.js`, `accordion.css`), Tabs (`tabs.js`, `tabs.css`), Dialog (`dialog.js`, `dialog.css`), Badge (`badge.js`, `badge.css`).
  - **11 Consistent Component Extensions:** Checkbox, Radio Group, Alert, Drawer, Popover, Dropdown Menu, Tooltip, Toast, Progress, Skeleton, Data Table.
  - **Design Tokens:** Neutral color surfaces (`#121212`, `#1E1E1E`, `#F5F5F5`, `#FFFFFF`), corner radius scale (`4px`, `8px`, `12px`, `9999px`), double 1px glass glow border box-shadows, and spring physics.
- **Licensing Audit & Upstream Status (Release Blocker):**
  - The upstream `shifatmasud/Shade-DS` repository currently does not contain a formal open-source license file (`"license": ""` in `package.json`), which under copyright law defaults to exclusive copyright.
  - While personal permission was given for development and private use, personal permission does not constitute a legally binding public open-source license grant.
  - **Public Release Blocker:** Before Aster DS can be distributed publicly under an open-source license (such as Apache-2.0 or MIT), Shifat Masud must either release Shade-DS under a permissive open-source license or execute an explicit open-source license grant covering Aster DS.

---

## 2. Phosphor Icons

- **Project:** [Phosphor Icons](https://phosphoricons.com/) ([@phosphor-icons/core](https://github.com/phosphor-icons/core))
- **Creators:** Tobias Fried & Helena Zhang
- **License:** MIT License
- **Scope in Aster DS:** 23 curated regular-weight SVG icon glyphs stored in `assets/icons/phosphor-icons.json` and rendered in the documentation portal and component blueprint renderer:
  `sparkle`, `magnifying-glass`, `sliders`, `list`, `x`, `eye`, `eye-slash`, `warning-circle`, `arrow-right`, `tray`, `plugs`, `sun`, `moon`, `copy`, `check`, `play`, `code`, `caret-down`, `caret-up-down`, `caret-up`, `cube`, `palette`, `lightning`.
- **License Text:**

```text
MIT License

Copyright (c) 2023 Phosphor Icons

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 3. Google Fonts Typography System

Aster DS defines a four-role typographic system. **Zero font binaries** (`.ttf`, `.otf`, `.woff`, `.woff2`) are bundled or distributed within the Aster DS repository or npm package. Fonts are loaded dynamically via the Google Fonts CDN in documentation portal pages, and consumers supply their own font rendering.

Each typeface is licensed under the SIL Open Font License, Version 1.1:

1. **Bebas Neue** (Display / Hero Headlines)
   - Designer: Ryoichi Tsunekawa ([Dharma Type](https://dharmatype.com/))
   - License: SIL Open Font License 1.1 (http://scripts.sil.org/OFL)
   - Copyright (c) 2010 by Ryoichi Tsunekawa

2. **Manrope** (Body & Interface Text)
   - Designer: Mikhail Sharanda ([Gentleman](https://gentleman.su/))
   - License: SIL Open Font License 1.1 (http://scripts.sil.org/OFL)
   - Copyright (c) 2018-2021 by Mikhail Sharanda

3. **Space Mono** (Code, Monospace & Data)
   - Designer: [Colophon Foundry](https://www.colophon-foundry.org/)
   - License: SIL Open Font License 1.1 (http://scripts.sil.org/OFL)
   - Copyright (c) 2016 by Colophon Foundry

4. **Merriweather** (Editorial & Quotes)
   - Designer: Eben Sorkin ([Sorkin Type](https://www.sorkintype.com/))
   - License: SIL Open Font License 1.1 (http://scripts.sil.org/OFL)
   - Copyright (c) 2010-2016 by Sorkin Type Co

---

## 4. Build Tooling & Development Dependencies

The runtime distribution of Aster DS has **zero external runtime dependencies**. The following tooling is used strictly at build time:

- **Style Dictionary** (`style-dictionary` v5.6.1)
  - Copyright (c) 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
  - License: Apache License, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
  - Used build-time only (`build-tools/build-tokens.js`) to transform Design Tokens (W3C DTCG) into CSS custom properties (`dist/css/tokens.css`). Not packaged or bundled into client runtime code.

---

## 5. Aster DS Licensing Status & Open Gates

- **Repository Status:** Private (`"private": true` in `package.json`).
- **Distribution Terms:** Not yet published to npm or any package registry.
- **Licensing Gate (Release Blocker):**
  - Aster DS currently operates under an explicit open licensing gate.
  - Before making the repository public or publishing to npm, the repository owner must:
    1. Resolve Upstream Blocker #1 (obtain formal open-source licensing confirmation for Shade-DS).
    2. Finalize Aster DS's outbound license selection (e.g. Apache-2.0).
    3. Generate the authoritative root `LICENSE` file and update `package.json` with the corresponding `"license"` identifier and removal of `"private": true`.
