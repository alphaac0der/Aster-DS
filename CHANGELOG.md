# Changelog

All notable changes to the `aster-ds` npm package. Versions follow [semantic versioning](https://semver.org/). While Aster is below 1.0, a minor version can include breaking changes.

## Unreleased

### Added
- **Motion tokens** now live in `tokens.css`, so importing tokens alone gives you `--as-motion-*`.
- **Shadow tokens:** `--as-elevation-shadow-drop-*`, `-thumb*`, `-inset`, and theme-aware `--as-semantic-elevation-*` for shadows, the scrim, and scrollbars.

### Changed
- **Small visual changes from using tokens:**
  - Toasts use the modal shadow. In light mode it is slightly larger.
  - Off-scale font sizes moved to the scale: 10px to 11px, 11.5px to 12px, 13px and 13.5px to 14px, and in the dialog 20px to 22px and 44px to 40px.
  - The switch thumb, Tabs active pill, and card hover shadows moved to the nearest shadow token.

### Fixed
- **Textarea:** the scrollbar was white in light mode.
- **Button:** the success glow referenced a token that doesn't exist.

### Documentation
- Added Foundations pages: Color, Typography, Spacing & Radius, Elevation, and Motion.
- Added prerequisites, CDN, and troubleshooting sections to Installation.
- Added this changelog.

## 0.1.1

### Fixed
- **Button:** the Destructive label now keeps at least 4.5:1 contrast at full hover and press. The hover and press tints are subtler as a result.
- **Badge:** status badges keep their own status surfaces in dark mode. A base rule was turning them all gray.
- **Form Field:** labels no longer use opacity, which had lowered their contrast.
- **Alert:** descriptions no longer use opacity.
- **Textarea:** the character counter no longer uses opacity.

### Changed
- **Color tokens:** darkened light-mode status text to pass on its own surfaces.
  - Success: `#188038` to `#167a35`
  - Critical: `#c5221f` to `#b91f1c`, which also darkens the red close dots

## 0.1.0

### Changed
- **Breaking visual change. Button:** the default height grew from 40px to 48px, with 16px top and bottom padding. Check inline layouts: inputs and selects are 44px and icon buttons are 40px. The small (32px) and large (56px) sizes are unchanged.
- **Button height token:** Button now uses `--as-space-12`. `--as-density-control-height` stays 40px for table headers and icon buttons.
- **Skeleton:** the button placeholder follows the new 48px height.

### Added
- **Select:** the open menu matches Dropdown in browsers that support `appearance: base-select`. Other browsers keep their native menu.

### Fixed
- **Input, Textarea, Select:** page-level `:focus-visible` rules no longer draw a second ring on the inner control.

## 0.0.1

- First public release: design tokens and 21 components.
