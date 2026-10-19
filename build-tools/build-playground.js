import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const unesc = (s) => String(s)
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&amp;/g, '&');

/**
 * Component-specific anatomy & geometry specifications for all 21 components.
 * Distinguishes Fixed vs. Content-Dependent dimensions and grounds every
 * measurement in canonical tokens and component CSS.
 */
const COMPONENT_ANATOMY_SPECS = {
  button: {
    height: '40px (--as-density-control-height)',
    paddingX: '24px left / 24px right (--as-space-6)',
    paddingY: '8px top / 8px bottom (--as-density-control-padding-y)',
    radius: '9999px (--as-radius-full)',
    typography: 'Manrope · 14px (--as-typography-font-size-sm) · 500 Medium',
    iconGap: '16px icon · 8px gap (--as-space-2)',
    focusRing: '2px solid (--as-semantic-color-border-focus) + 2px offset',
    parts: [
      ['1', 'Pill Container', '.as-button', 'Fixed 40px height, 9999px pill radius, overflow hidden for radial hover fill'],
      ['2', 'Cursor Fill Layer', '.as-button::before', 'Content-dependent radial circle anchored at (--x, --y) pointer coordinates'],
      ['3', 'Label Text', '.as-button__label', 'Content-dependent width, Manrope 14px / 500 weight, 24px horizontal padding'],
      ['4', 'Icon / Spinner', '.as-icon / .as-spinner', 'Fixed 16px × 16px bounding box with 8px gap from label']
    ],
    rows: [
      ['Control Height', '40px', '--as-density-control-height', 'Fixed'],
      ['Horizontal Padding (Left / Right)', '24px / 24px', '--as-space-6', 'Fixed'],
      ['Vertical Padding (Top / Bottom)', '8px / 8px', '--as-density-control-padding-y', 'Fixed'],
      ['Minimum Width', '64px (40px icon-only)', '--as-space-16', 'Content-Dependent (expands with label)'],
      ['Corner Radius', '9999px (Full Pill)', '--as-radius-full', 'Fixed'],
      ['Typography', 'Manrope, 14px, weight 500, line-height 1.2', '--as-typography-font-family-sans / --as-typography-font-size-sm', 'Fixed'],
      ['Icon & Spinner Size / Gap', '16px × 16px icon, 8px internal gap', '--as-space-2', 'Fixed'],
      ['Border & Focus Ring', '1px solid border; 2px solid focus ring + 2px offset', '--as-semantic-color-border-focus', 'Fixed']
    ]
  },
  input: {
    height: '44px (Exact Shade-DS Control Height)',
    paddingX: '12px left / 36px right (--as-space-3)',
    paddingY: '10px top / 10px bottom',
    radius: '4px (--as-radius-sm / Shade-DS Radius.S)',
    typography: 'Manrope · 14px · 400 Regular',
    iconGap: '28px × 28px trailing action button',
    focusRing: 'Double 1px glass glow (--as-semantic-color-border-focus)',
    parts: [
      ['1', 'Field Wrapper', '.as-form-field', 'Vertical flex stack with 6px gap between label, input box, and helper'],
      ['2', 'Persistent Label', '.as-form-field__label', '14px / 500 weight label explicitly bound via for="id"'],
      ['3', 'Input Control', '.as-input', 'Fixed 44px height, 4px radius, Canvas #121212 background, double 1px glass glow (zero wireframe outline)'],
      ['4', 'Trailing Action / Error', '.as-input__action / .as-form-field__error', 'Fixed 28px × 28px clear/toggle control; dynamic error message']
    ],
    rows: [
      ['Control Height', '44px', 'Exact Shade-DS Component Geometry', 'Fixed'],
      ['Horizontal Padding', '12px left, 36px right (with action)', '--as-space-3', 'Fixed'],
      ['Width', '100% of parent field container', '—', 'Content-Dependent / Fluid'],
      ['Corner Radius', '4px (Shade-DS Radius.S)', '--as-radius-sm', 'Fixed'],
      ['Surface & Outline', 'Canvas #121212 / Double 1px Glass Glow', 'box-shadow: 0 0 1px 0px ..., inset 0 0 1px 0px ...', 'Fixed'],
      ['Typography', 'Manrope, 14px, weight 400', '--as-typography-font-size-sm', 'Fixed'],
      ['Action Button Target', '28px × 28px (exceeds 24px WCAG floor)', '--as-radius-sm (4px)', 'Fixed'],
      ['Focus Ring', 'Double 1px glass glow', '--as-semantic-color-border-focus', 'Fixed']
    ]
  },
  textarea: {
    height: 'Min 96px (auto-expands)',
    paddingX: '12px left / 12px right (--as-space-3)',
    paddingY: '8px top / 8px bottom (--as-space-2)',
    radius: '8px (--as-radius-md)',
    typography: 'Manrope · 14px · 400 · 1.5 line-height',
    iconGap: 'Footer counter bar (12px Space Mono)',
    focusRing: '2px solid (--as-semantic-color-border-focus) + 1px offset',
    parts: [
      ['1', 'Field Container', '.as-form-field', 'Vertical stack holding label, textarea box, and helper message'],
      ['2', 'Textarea Box', '.as-textarea-box', 'Surface container with 8px radius and 1px strong border'],
      ['3', 'Multi-line Control', '.as-textarea', 'Min-height 96px, 12px × 8px padding, vertical/auto resize'],
      ['4', 'Character Counter', '.as-textarea__counter', '12px tabular-nums counter synchronized with maxlength']
    ],
    rows: [
      ['Minimum Height', '96px', 'min-height: 96px', 'Content-Dependent (vertical / auto-resize)'],
      ['Horizontal Padding', '12px left / 12px right', '--as-space-3', 'Fixed'],
      ['Vertical Padding', '8px top / 8px bottom', '--as-space-2', 'Fixed'],
      ['Corner Radius', '8px', '--as-radius-md', 'Fixed'],
      ['Typography', 'Manrope, 14px, line-height 1.5', '--as-typography-font-size-sm', 'Fixed'],
      ['Focus Ring', '2px solid + 1px offset', '--as-semantic-color-border-focus', 'Fixed']
    ]
  },
  select: {
    height: '40px (--as-density-control-height)',
    paddingX: '12px left / 36px right (--as-space-3)',
    paddingY: '8px top / 8px bottom',
    radius: '8px (--as-radius-md)',
    typography: 'Manrope · 14px · 400 Regular',
    iconGap: '16px × 16px custom chevron at right 12px',
    focusRing: '2px solid (--as-semantic-color-border-focus) + 1px offset',
    parts: [
      ['1', 'Select Box Wrapper', '.as-select-box', 'Relative positioning anchor for native select and SVG chevron'],
      ['2', 'Native Select', '.as-select', 'Fixed 40px height, 8px radius, appearance: none, 36px right clearance'],
      ['3', 'Chevron Indicator', '.as-select-chevron', 'Fixed 16px × 16px pointer-events: none icon positioned 12px from right']
    ],
    rows: [
      ['Control Height', '40px', '--as-density-control-height', 'Fixed'],
      ['Horizontal Padding', '12px left, 36px right (chevron clearance)', '--as-space-3', 'Fixed'],
      ['Corner Radius', '8px', '--as-radius-md', 'Fixed'],
      ['Chevron Icon', '16px × 16px at right: 12px', '--as-space-3', 'Fixed'],
      ['Typography', 'Manrope, 14px, weight 400', '--as-typography-font-size-sm', 'Fixed']
    ]
  },
  checkbox: {
    height: '28px × 28px hit target (18px visual box)',
    paddingX: '12px gap to label (--as-space-3)',
    paddingY: '4px vertical alignment offset',
    radius: '4px (--as-radius-sm)',
    typography: 'Manrope · 14px · 500 Medium label',
    iconGap: '14px × 14px checkmark / dash SVG',
    focusRing: '2px solid (--as-semantic-color-border-focus) + 2px offset',
    parts: [
      ['1', 'Field Row', '.as-checkbox-field', 'Flex row with 12px (--as-space-3) gap between control and label stack'],
      ['2', 'Hit Target Wrapper', '.as-checkbox', 'Fixed 28px × 28px interactive touch target exceeding 24px WCAG floor'],
      ['3', 'Visual Box', '.as-checkbox-input', 'Fixed 18px × 18px box with 4px (--as-radius-sm) corner radius'],
      ['4', 'Label & Description', '.as-checkbox-field__content', 'Content-dependent text stack (14px label + 12px muted description)']
    ],
    rows: [
      ['Touch Target Area', '28px × 28px', '.as-checkbox', 'Fixed'],
      ['Visual Box Dimensions', '18px × 18px', '.as-checkbox-input', 'Fixed'],
      ['Corner Radius', '4px (Minimum Aster radius)', '--as-radius-sm', 'Fixed'],
      ['Control-to-Label Gap', '12px', '--as-space-3', 'Fixed'],
      ['Typography', 'Manrope 14px / 500 label, 12px description', '--as-typography-font-size-sm / xs', 'Content-Dependent']
    ]
  },
  radio: {
    height: '28px × 28px hit target (18px visual circle)',
    paddingX: '12px gap to label (--as-space-3)',
    paddingY: '12px vertical stack gap between options',
    radius: '9999px (--as-radius-full)',
    typography: 'Manrope · 14px · 500 Medium',
    iconGap: '6px × 6px centered canvas dot inside solid interactive disc',
    focusRing: '2px solid (--as-semantic-color-border-focus) + 2px offset',
    parts: [
      ['1', 'Fieldset Group', '.as-radio-group', 'Semantic <fieldset> with 12px vertical spacing between options'],
      ['2', 'Group Legend', '.as-radio-group__legend', '14px / 600 weight heading describing the mutually exclusive choice'],
      ['3', 'Radio Circle', '.as-radio-input', 'Fixed 18px × 18px circle. Unselected: 1.5px ring. Selected: solid white disc.'],
      ['4', 'Center Inverted Dot', '.as-radio-input::after', 'Fixed 6px × 6px centered canvas dot (black in dark mode) scaled on :checked']
    ],
    rows: [
      ['Touch Target Area', '28px × 28px', '.as-radio', 'Fixed'],
      ['Outer Ring / Inverted Dot', '18px × 18px disc / 6px × 6px inverted dot', '--as-radius-full', 'Fixed'],
      ['Option Stack Gap', '12px', '--as-space-3', 'Fixed'],
      ['Control-to-Label Gap', '12px', '--as-space-3', 'Fixed']
    ]
  },
  switch: {
    height: '24px track height × 44px track width',
    paddingX: '12px gap to label (--as-space-3)',
    paddingY: '2px internal track-to-thumb inset',
    radius: '9999px (--as-radius-full)',
    typography: 'Manrope · 14px · 500 Medium',
    iconGap: '18px × 18px sliding thumb (20px travel)',
    focusRing: '2px solid (--as-semantic-color-border-focus) + 2px offset',
    parts: [
      ['1', 'Switch Field', '.as-switch-field', 'Interactive label row with 12px gap between track and text'],
      ['2', 'Pill Track', '.as-switch-track', 'Fixed 44px × 24px capsule (9999px radius) with 1px border'],
      ['3', 'Sliding Thumb', '.as-switch-thumb', 'Fixed 18px × 18px circular thumb translating +20px when checked'],
      ['4', 'Label Stack', '.as-switch-field__content', 'Content-dependent label and helper description']
    ],
    rows: [
      ['Track Dimensions', '44px width × 24px height', '.as-switch', 'Fixed'],
      ['Thumb Dimensions & Travel', '18px × 18px circle; +20px translateX on checked', '.as-switch-thumb', 'Fixed'],
      ['Corner Radius', '9999px (Full Pill)', '--as-radius-full', 'Fixed'],
      ['Control-to-Label Gap', '12px', '--as-space-3', 'Fixed']
    ]
  },
  slider: {
    height: '32px interactive hit height (6px track)',
    paddingX: '0px track inset',
    paddingY: '8px header-to-track gap (--as-space-2)',
    radius: '9999px (--as-radius-full)',
    typography: 'Manrope 14px label · Space Mono 14px value',
    iconGap: '20px × 20px circular thumb',
    focusRing: '2px solid (--as-semantic-color-border-focus) + 2px offset',
    parts: [
      ['1', 'Header Bar', '.as-slider-field__header', 'Flex row aligning label on left and tabular-nums value on right'],
      ['2', 'Range Track', '.as-slider', '6px high pill track filled dynamically via --_progress gradient'],
      ['3', 'Draggable Thumb', '::-webkit-slider-thumb', 'Fixed 20px × 20px circular thumb with 2px primary border']
    ],
    rows: [
      ['Interactive Touch Height', '32px', '.as-slider-box', 'Fixed'],
      ['Visual Track Height', '6px', 'height: 6px', 'Fixed'],
      ['Thumb Dimensions', '20px × 20px circle', '--as-radius-full', 'Fixed'],
      ['Track Width', '100% of container', 'width: 100%', 'Content-Dependent / Fluid']
    ]
  },
  table: {
    height: '44px row height (--as-density-table-row-height)',
    paddingX: '16px cell horizontal (--as-density-table-cell-padding-x)',
    paddingY: '8px cell vertical (--as-density-table-cell-padding-y)',
    radius: '12px container (--as-radius-lg)',
    typography: 'Manrope 14px cells · 12px uppercase headers',
    iconGap: '10px × 14px dual-arrow sort icon',
    focusRing: '2px solid (--as-semantic-color-border-focus) inset',
    parts: [
      ['1', 'Outer Container', '.as-table-container', '12px (--as-radius-lg) bordered card wrapping toolbar, scroll area, and footer'],
      ['2', 'Column Header', '.as-table__th', '12px uppercase header with optional .as-table__sort button'],
      ['3', 'Data Row', '.as-table__row', '44px minimum height row with hover and [data-selected] highlight'],
      ['4', 'Numeric / Primary Cell', '.as-table__cell', '16px × 8px padded cell with tabular-nums alignment for metrics']
    ],
    rows: [
      ['Row Height', '44px', '--as-density-table-row-height', 'Fixed minimum'],
      ['Cell Padding', '16px horizontal / 8px vertical', '--as-density-table-cell-padding-x / y', 'Fixed'],
      ['Checkbox Column Width', '44px', '.as-table__th--check', 'Fixed'],
      ['Container Radius', '12px', '--as-radius-lg', 'Fixed'],
      ['Column Widths', 'Auto / proportional to cell data', '—', 'Content-Dependent']
    ]
  },
  badge: {
    height: '24px (--as-space-6)',
    paddingX: '8px left / 8px right (--as-space-2)',
    paddingY: '2px top / 2px bottom',
    radius: '9999px (--as-radius-full)',
    typography: 'Manrope · 12px (--as-typography-font-size-xs) · 500',
    iconGap: '6px × 6px status dot · 6px gap',
    focusRing: 'Non-interactive status indicator',
    parts: [
      ['1', 'Pill Capsule', '.as-badge', 'Fixed 24px height, 9999px radius, 1px semantic status border'],
      ['2', 'Status Dot', '.as-badge__dot', 'Fixed 6px × 6px circular indicator matching semantic text color'],
      ['3', 'Status Label', 'Text Node', 'Content-dependent 12px / 500 weight single-line text']
    ],
    rows: [
      ['Height', '24px', 'height: 24px', 'Fixed'],
      ['Horizontal Padding', '8px left / 8px right', '--as-space-2', 'Fixed'],
      ['Corner Radius', '9999px (Full Pill)', '--as-radius-full', 'Fixed'],
      ['Status Dot Size & Gap', '6px × 6px dot, 6px gap', 'width: 6px; gap: 6px', 'Fixed'],
      ['Badge Width', 'Auto (nowrap)', '—', 'Content-Dependent']
    ]
  },
  progress: {
    height: '8px track height (--as-space-2)',
    paddingX: '0px track inset',
    paddingY: '8px header-to-track gap (--as-space-2)',
    radius: '9999px (--as-radius-full)',
    typography: 'Manrope 14px label · Space Mono 12px percentage',
    iconGap: 'Determinate fill bar or indeterminate wave',
    focusRing: 'Semantic role="progressbar"',
    parts: [
      ['1', 'Field Header', '.as-progress-field__header', 'Flex row displaying task label and tabular percentage'],
      ['2', 'Track Container', '.as-progress', 'Fixed 8px height, 9999px pill radius, muted surface background'],
      ['3', 'Fill Bar', '.as-progress__bar', 'Content-dependent width (0%–100%) with 9999px pill radius']
    ],
    rows: [
      ['Track Height', '8px', '--as-space-2', 'Fixed'],
      ['Corner Radius', '9999px (Full Pill)', '--as-radius-full', 'Fixed'],
      ['Fill Width', '0% to 100% (or 40% wave)', 'style="width: X%"', 'Content-Dependent']
    ]
  },
  skeleton: {
    height: '16px text line / 40px avatar circle',
    paddingX: '0px',
    paddingY: '8px vertical stack gap (--as-space-2)',
    radius: '8px block (--as-radius-md) / 9999px circle',
    typography: 'aria-hidden="true" visual placeholder',
    iconGap: '1.6s shimmer wave animation',
    focusRing: 'Non-interactive placeholder',
    parts: [
      ['1', 'Avatar Silhouette', '.as-skeleton--avatar', 'Fixed 40px × 40px circle with 9999px radius'],
      ['2', 'Text Line Placeholder', '.as-skeleton--text', 'Fixed 16px height with 4px/8px radius and fluid percentage width'],
      ['3', 'Block Placeholder', '.as-skeleton', 'Content-dependent dimensions with 8px (--as-radius-md) radius']
    ],
    rows: [
      ['Text Line Height', '16px (12px title / 64px block)', '.as-skeleton--text', 'Fixed'],
      ['Avatar Dimensions', '40px × 40px', '.as-skeleton--avatar', 'Fixed'],
      ['Corner Radius', '8px block / 9999px avatar', '--as-radius-md / --as-radius-full', 'Fixed']
    ]
  },
  alert: {
    height: 'Content-dependent (min 56px)',
    paddingX: '16px left / 16px right (--as-space-4)',
    paddingY: '12px top / 12px bottom (--as-space-3)',
    radius: '8px (--as-radius-md)',
    typography: 'Manrope 14px / 600 title · 14px description',
    iconGap: '12px solid red dot dismiss control (--as-semantic-color-status-critical-text)',
    focusRing: 'Double 1px glass glow focus indicator',
    parts: [
      ['1', 'Alert Banner', '.as-alert', '8px radius container with Shade-DS status surface, double 1px glass glow (zero wireframe outline)'],
      ['2', 'Status Icon', '.as-alert__icon', 'Fixed 18px × 18px semantic SVG icon aligned with title'],
      ['3', 'Content Stack', '.as-alert__content', 'Content-dependent title (14px/600) and description (14px/400)'],
      ['4', 'Red Dot Dismiss Control', '.as-alert__close', 'Fixed 12px solid red dot (#ff453a dark / #c5221f light), scale 1.2 on hover, 0.9 on active']
    ],
    rows: [
      ['Padding', '12px vertical / 16px horizontal', '--as-space-3 / --as-space-4', 'Fixed'],
      ['Corner Radius & Surface', '8px radius; double 1px glass glow, Shade-DS status surface', '--as-radius-md', 'Fixed'],
      ['Close Control (Red Dot)', '12px circle (#ff453a dark / #c5221f light, scale 1.2 on hover, 0.9 active)', '.as-alert__close', 'Fixed'],
      ['Banner Height', 'Auto (expands with message copy)', '—', 'Content-Dependent']
    ]
  },
  tooltip: {
    height: 'Content-dependent (min 28px)',
    paddingX: '12px left / 12px right (--as-space-3)',
    paddingY: '4px top / 4px bottom (--as-space-1)',
    radius: '4px (--as-radius-sm)',
    typography: 'Manrope · 12px (--as-typography-font-size-xs) · 500',
    iconGap: '8px offset above trigger (bottom: calc(100% + 8px))',
    focusRing: 'Triggered via hover or :focus-within; dismissed via Escape',
    parts: [
      ['1', 'Trigger Anchor', '.as-tooltip-trigger', 'Inline-flex anchor hosting the focusable button and tooltip bubble'],
      ['2', 'Tooltip Bubble', '.as-tooltip', '4px radius inverted surface bubble (max-width 260px, 12px × 4px padding)']
    ],
    rows: [
      ['Padding', '4px vertical / 12px horizontal', '--as-space-1 / --as-space-3', 'Fixed'],
      ['Maximum Width', '260px', 'max-width: 260px', 'Content-Dependent up to 260px'],
      ['Corner Radius', '4px', '--as-radius-sm', 'Fixed'],
      ['Anchor Gap', '8px above trigger', '--as-space-2', 'Fixed']
    ]
  },
  toast: {
    height: 'Content-dependent (min 56px)',
    paddingX: '16px left / 16px right (--as-space-4)',
    paddingY: '12px top / 12px bottom (--as-space-3)',
    radius: '8px (--as-radius-md)',
    typography: 'Manrope 14px / 600 title · 12px message',
    iconGap: '12px solid red dot dismiss control (--as-semantic-color-status-critical-text)',
    focusRing: 'Double 1px glass glow focus indicator',
    parts: [
      ['1', 'Live Region Viewport', '.as-toast-container', 'Fixed bottom-right (24px inset) stack with 12px gap and z-index 9999'],
      ['2', 'Toast Card', '.as-toast', '320px–420px elevated card with 8px radius and double 1px glass glow'],
      ['3', 'Message Content', '.as-toast__content', 'Title (14px/600) and description (12px muted)'],
      ['4', 'Red Dot Dismiss Control', '.as-toast__close', 'Fixed 12px solid red dot (#ff453a dark / #c5221f light), scale 1.2 on hover, 0.9 on active']
    ],
    rows: [
      ['Width Range', 'Min 320px / Max 420px', 'min-width: 320px; max-width: 420px', 'Content-Dependent within range'],
      ['Padding', '12px vertical / 16px horizontal', '--as-space-3 / --as-space-4', 'Fixed'],
      ['Corner Radius', '8px', '--as-radius-md', 'Fixed'],
      ['Close Control (Red Dot)', '12px circle (#ff453a dark / #c5221f light, scale 1.2 on hover, 0.9 active)', '.as-toast__close', 'Fixed']
    ]
  },
  dialog: {
    height: 'Max 600px (min(85vh, 600px))',
    paddingX: '16px header/footer (--as-space-4) · 20px body (--as-space-5)',
    paddingY: '16px vertical body padding · 48px header height',
    radius: '16px (--as-radius-lg)',
    typography: 'Bebas Neue 38px hero · Manrope 12px uppercase label · 13.5px body',
    iconGap: '12px solid red dot dismiss control (--as-semantic-color-status-critical-text)',
    focusRing: 'Native <dialog> focus trap + 2px focus ring',
    parts: [
      ['1', 'Modal Scrim', '.as-dialog::backdrop', 'Full-viewport dimmed backdrop with 8px blur and click-outside dismiss'],
      ['2', 'Glass Surface', '.as-dialog__surface', 'Max-width 400px card with 16px (--as-radius-lg) radius, backdrop blur (20px), and double 1px glass glow shadows'],
      ['3', 'Header & Red Dot Close', '.as-dialog__header / .as-dialog__close', '48px header with uppercase title and 12px solid red dot close button (#ff453a dark / #c5221f light), scale 1.2 on hover, 0.9 on active'],
      ['4', 'Hero & Body & Footer', '.as-dialog__hero / .as-dialog__body / .as-dialog__footer', 'Bebas Neue display title, scrollable rules list with custom thin scrollbar, and full-width pill CTA button']
    ],
    rows: [
      ['Panel Width', '400px (min(92vw, 400px))', 'max-width: 400px', 'Fixed cap / Responsive'],
      ['Max Height', '600px (min(85vh, 600px))', 'max-height: 600px', 'Fixed cap'],
      ['Header Height', '48px (Space.5XL)', 'min-height: 48px; padding: 0 16px', 'Fixed'],
      ['Corner Radius', '16px', '--as-radius-lg', 'Fixed'],
      ['Outline / Glow', 'Double 1px glass glow box-shadow (border: none)', 'box-shadow: 0 0 1px ...', 'Fixed'],
      ['Close Control (Red Dot)', '12px circle (#ff453a dark / #c5221f light, scale 1.2 on hover, 0.9 active)', '.as-dialog__close', 'Fixed']
    ]
  },
  drawer: {
    height: '100vh full viewport height',
    paddingX: '20px header/body/footer (--as-space-5)',
    paddingY: '16px header/footer · 20px scrollable body',
    radius: '0px edge panel (--as-radius-none)',
    typography: 'Manrope 18px / 600 title · 14px body',
    iconGap: '12px solid red dot dismiss control (--as-semantic-color-status-critical-text)',
    focusRing: 'Circular Tab focus trap + Escape dismiss',
    parts: [
      ['1', 'Backdrop Scrim', '.as-drawer__backdrop', 'Fixed inset 0 dimmed scrim dismissing drawer on click'],
      ['2', 'Slide-Over Panel', '.as-drawer__panel', 'Fixed 100vh height, max-width 440px, sliding from right or left edge'],
      ['3', 'Header & Red Dot Close', '.as-drawer__header / .as-drawer__close', '18px title + 12px solid red dot close button (#ff453a dark / #c5221f light)'],
      ['4', 'Scrollable Body & Footer', '.as-drawer__body / .as-drawer__footer', 'Flex-1 scrollable body (20px padding) + pinned bottom action bar']
    ],
    rows: [
      ['Panel Width & Height', 'Max 440px width × 100vh height', 'max-width: 440px; height: 100%', 'Fixed'],
      ['Header / Body / Footer Padding', '16px×20px header & footer; 20px body', '--as-space-4 / --as-space-5', 'Fixed'],
      ['Close Control (Red Dot)', '12px circle (#ff453a dark / #c5221f light, scale 1.2 on hover, 0.9 active)', '.as-drawer__close', 'Fixed']
    ]
  },
  popover: {
    height: 'Content-dependent',
    paddingX: '16px body (--as-space-4)',
    paddingY: '12px header · 16px body',
    radius: '12px (--as-radius-lg)',
    typography: 'Manrope 14px / 600 title · 14px body',
    iconGap: '12px solid red dot dismiss control (--as-semantic-color-status-critical-text)',
    focusRing: 'Light dismiss on outside click + Escape key',
    parts: [
      ['1', 'Anchor Wrapper', '.as-popover-anchor', 'Relative inline-flex wrapper anchoring trigger and floating card'],
      ['2', 'Popover Surface', '.as-popover', '280px–360px card positioned 8px below trigger with 12px (--as-radius-lg) radius and double 1px glass glow'],
      ['3', 'Header & Red Dot Close', '.as-popover__header / .as-popover__close', 'Flex header with 14px/600 title and 12px solid red dot close button (#ff453a dark / #c5221f light)'],
      ['4', 'Popover Body', '.as-popover__body', '16px (--as-space-4) padded contextual content region']
    ],
    rows: [
      ['Width Range', 'Min 280px / Max 360px', 'min-width: 280px; max-width: 360px', 'Content-Dependent within range'],
      ['Header & Body Padding', '12px×16px header; 16px body', '--as-space-3 / --as-space-4', 'Fixed'],
      ['Corner Radius', '12px', '--as-radius-lg', 'Fixed'],
      ['Close Control (Red Dot)', '12px circle (#ff453a dark / #c5221f light, scale 1.2 on hover, 0.9 active)', '.as-popover__close', 'Fixed']
    ]
  },
  dropdown: {
    height: '36px per menuitem',
    paddingX: '12px item horizontal (--as-space-3)',
    paddingY: '8px item vertical (--as-space-2)',
    radius: '8px menu (--as-radius-md) · 4px item (--as-radius-sm)',
    typography: 'Manrope · 14px · 400 Regular',
    iconGap: '16px chevron on trigger · 8px item gap',
    focusRing: 'Roving ArrowUp/ArrowDown focus with 2px focus ring',
    parts: [
      ['1', 'Dropdown Anchor', '.as-dropdown', 'Relative inline-flex container holding trigger button and menu'],
      ['2', 'Menu Surface', '.as-dropdown__menu', 'Min-width 200px card with 4px internal padding and 8px (--as-radius-md) radius'],
      ['3', 'Menu Item', '.as-dropdown__item', '36px min-height button with 4px (--as-radius-sm) radius and 12px × 8px padding'],
      ['4', 'Separator Rule', '.as-dropdown__divider', '1px hairline horizontal divider with 4px vertical margin']
    ],
    rows: [
      ['Menu Minimum Width', '200px', 'min-width: 200px', 'Content-Dependent (min 200px)'],
      ['Menu Item Height & Padding', '36px min-height; 8px × 12px padding', '--as-space-2 / --as-space-3', 'Fixed'],
      ['Corner Radius', '8px menu container / 4px item', '--as-radius-md / --as-radius-sm', 'Fixed']
    ]
  },
  tabs: {
    height: '42px tab trigger height',
    paddingX: '16px tab horizontal (--as-space-4)',
    paddingY: '12px tab vertical (--as-space-3)',
    radius: '4px focus radius (--as-radius-sm)',
    typography: 'Manrope · 14px · 500 Medium (600 active)',
    iconGap: '2px active bottom indicator bar',
    focusRing: 'Roving tabindex with ArrowLeft / ArrowRight navigation',
    parts: [
      ['1', 'Tablist Bar', '.as-tabs__list', 'Horizontal flex bar with 1px bottom border and 4px gap between tabs'],
      ['2', 'Tab Trigger', '.as-tabs__tab', '12px × 16px padded button with 2px bottom active indicator bar'],
      ['3', 'Tabpanel Region', '.as-tabs__panel', '16px top-padded content panel associated via aria-labelledby']
    ],
    rows: [
      ['Tab Trigger Padding', '12px vertical / 16px horizontal', '--as-space-3 / --as-space-4', 'Fixed'],
      ['Active Indicator Bar', '2px solid primary bottom border', '--as-semantic-color-interactive-primary', 'Fixed'],
      ['Panel Top Padding', '16px', '--as-space-4', 'Fixed']
    ]
  },
  accordion: {
    height: '52px trigger header height',
    paddingX: '16px horizontal (--as-space-4)',
    paddingY: '16px trigger vertical · 16px panel bottom',
    radius: '12px container (--as-radius-lg)',
    typography: 'Manrope 16px / 500 trigger · 14px panel copy',
    iconGap: '16px × 16px rotating chevron (180deg when expanded)',
    focusRing: '2px solid (--as-semantic-color-border-focus) inset',
    parts: [
      ['1', 'Accordion Stack', '.as-accordion', '12px (--as-radius-lg) bordered card dividing stacked disclosure items'],
      ['2', 'Heading & Trigger', '.as-accordion__trigger', 'Full-width 16px padded button inside semantic <h3>/<h4> heading'],
      ['3', 'Chevron Icon', '.as-accordion__chevron', 'Fixed 16px × 16px SVG rotating 180deg on aria-expanded="true"'],
      ['4', 'Disclosure Panel', '.as-accordion__content', '16px horizontal / 16px bottom padded region with 1.5 line-height']
    ],
    rows: [
      ['Trigger Padding', '16px vertical / 16px horizontal', '--as-space-4', 'Fixed'],
      ['Panel Content Padding', '0px top / 16px horizontal / 16px bottom', '--as-space-4', 'Fixed'],
      ['Container Radius', '12px', '--as-radius-lg', 'Fixed'],
      ['Chevron Size', '16px × 16px', 'width: 16px; height: 16px', 'Fixed']
    ]
  }
};

function buildAgentPrompt(config, spec) {
  const rawCode = unesc(config.codeSnippet);
  return `# Aster Component Implementation Prompt — ${config.name}

## 1. Component Purpose & Canonical Role
- **Component:** ${config.name} (\`${config.slug}\`)
- **Category:** ${config.category}
- **Native Element:** \`${config.element}\`
- **Summary:** ${config.description}
- **When to Use:** ${config.whenToUse}
- **When Not to Use:** ${config.whenNotToUse}

## 2. Authoritative Repository Files
- **Component CSS:** \`components/${config.slug}/${config.slug}.css\`
- **Component Spec:** \`docs/components/${config.slug}.md\`
- **Agent Contract:** \`skills/using-aster-components/SKILL.md\`
- **Compiled Bundle:** \`dist/css/aster.css\` and \`dist/js/aster.js\`

## 3. Canonical HTML Structure & Classes
\`\`\`html
${rawCode}
\`\`\`

## 4. Exact Geometry & Token Bindings (Standard Density)
- **Height:** ${spec.height}
- **Horizontal Padding:** ${spec.paddingX}
- **Vertical Padding:** ${spec.paddingY}
- **Corner Radius:** ${spec.radius}
- **Typography:** ${spec.typography}
- **Icon / Secondary Control:** ${spec.iconGap}
- **Focus Ring:** ${spec.focusRing}

## 5. Non-Negotiable Aster Constraints
1. **Zero Primitive Color Leaks:** Bind colors strictly to \`--as-semantic-color-*\` custom properties. Never use \`--as-color-primitive-*\` or hardcoded hex values in component usage.
2. **Minimum 4px Radius Policy:** Never use \`2px\` border-radius. Use \`--as-radius-sm\` (\`4px\`), \`--as-radius-md\` (\`8px\`), \`--as-radius-lg\` (\`12px\`), or \`--as-radius-full\` (\`9999px\`).
3. **Single Standard Density Mode:** Compact mode (\`data-density="compact"\` / \`.as-*--compact\`) is permanently retired. Do not emit compact classes or attributes.
4. **WCAG 2.2 AA Accessibility:** Maintain >= 4.5:1 text contrast, >= 3:1 UI/border contrast, >= 24x24px interactive hit targets, and full keyboard operability (\`Tab\`, \`Enter\`, \`Space\`, \`Escape\`, Arrow keys).

## 6. Verification Commands
\`\`\`bash
npm run test:components
npm run test:contrast
npm run test:browser
\`\`\``;
}


const phosphorIconsData = JSON.parse(readFileSync(join(rootDir, 'scratch/phosphor-icons.json'), 'utf8'));
const PHOSPHOR_SYMBOL_MAP = {
  'i-star': phosphorIconsData['sparkle'],
  'i-search': phosphorIconsData['magnifying-glass'],
  'i-sliders': phosphorIconsData['sliders'],
  'i-menu': phosphorIconsData['list'],
  'i-x': phosphorIconsData['x'],
  'i-eye': phosphorIconsData['eye'],
  'i-eye-off': phosphorIconsData['eye-slash'],
  'i-alert': phosphorIconsData['warning-circle'],
  'i-arrow': phosphorIconsData['arrow-right'],
  'i-inbox': phosphorIconsData['tray'],
  'i-plug': phosphorIconsData['plugs'],
  'i-sun': phosphorIconsData['sun'],
  'i-moon': phosphorIconsData['moon'],
  'i-sort': phosphorIconsData['caret-up-down'],
  'i-copy': phosphorIconsData['copy'],
  'i-check': phosphorIconsData['check'],
  'i-play': phosphorIconsData['play'],
  'i-code': phosphorIconsData['code'],
  'i-caret-down': phosphorIconsData['caret-down'],
  'i-caret-up': phosphorIconsData['caret-up'],
  'i-cube': phosphorIconsData['cube'],
  'i-palette': phosphorIconsData['palette'],
  'i-lightning': phosphorIconsData['lightning']
};

export const PHOSPHOR_SPRITE_HTML = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">\n  <defs>\n` +
  Object.entries(PHOSPHOR_SYMBOL_MAP).map(([id, svg]) => {
    const inner = (svg || '').replace(/<svg[^>]*>|<\/svg>/g, '').trim();
    return `    <symbol id="${id}" viewBox="0 0 256 256" fill="currentColor">${inner}</symbol>`;
  }).join('\n') +
  `\n  </defs>\n</svg>`;

const BLUEPRINT_CONFIGS = {
  button: {
    compWidth: 160, compHeight: 56, radius: 28, isPill: true,
    paddingLeft: 24, paddingRight: 24, gap: 8,
    iconWidth: 20, iconHeight: 20, iconType: 'sparkle', label: 'Do Magic',
    topLabel: '160', leftLabel: '56',
    bottomPadLeft: '24', bottomGap: '8', bottomPadRight: '24'
  },
  input: {
    compWidth: 320, compHeight: 40, radius: 8, isPill: false,
    paddingLeft: 12, paddingRight: 36, gap: 8,
    iconWidth: 18, iconHeight: 18, iconType: 'x', label: 'acme-cluster-01',
    topLabel: '320', leftLabel: '40',
    bottomPadLeft: '12', bottomGap: '8', bottomPadRight: '36'
  },
  textarea: {
    compWidth: 340, compHeight: 96, radius: 8, isPill: false,
    paddingLeft: 12, paddingRight: 12, gap: 8,
    label: 'System prompt instructions...',
    topLabel: '340', leftLabel: '96 (min)',
    bottomPadLeft: '12', bottomGap: '', bottomPadRight: '12'
  },
  select: {
    compWidth: 280, compHeight: 40, radius: 8, isPill: false,
    paddingLeft: 12, paddingRight: 36, gap: 8,
    iconWidth: 16, iconHeight: 16, iconType: 'caret-down', label: 'Production Cluster',
    topLabel: '280', leftLabel: '40',
    bottomPadLeft: '12', bottomGap: '8', bottomPadRight: '36'
  },
  checkbox: {
    compWidth: 180, compHeight: 28, radius: 4, isPill: false,
    paddingLeft: 4, paddingRight: 4, gap: 8,
    iconWidth: 18, iconHeight: 18, iconType: 'check', label: 'Enable telemetry',
    topLabel: '180', leftLabel: '28',
    bottomPadLeft: '18', bottomGap: '8', bottomPadRight: '4'
  },
  radio: {
    compWidth: 180, compHeight: 28, radius: 14, isPill: true,
    paddingLeft: 4, paddingRight: 4, gap: 8,
    iconWidth: 18, iconHeight: 18, label: 'Direct Debit',
    topLabel: '180', leftLabel: '28',
    bottomPadLeft: '18', bottomGap: '8', bottomPadRight: '4'
  },
  switch: {
    compWidth: 120, compHeight: 28, radius: 12, isPill: true,
    paddingLeft: 3, paddingRight: 3, gap: 12, label: 'Dark Mode',
    topLabel: '120', leftLabel: '28',
    bottomPadLeft: '44', bottomGap: '12', bottomPadRight: '4'
  },
  slider: {
    compWidth: 260, compHeight: 28, radius: 4, isPill: false,
    paddingLeft: 0, paddingRight: 0, gap: 10, label: '75%',
    topLabel: '260', leftLabel: '28',
    bottomPadLeft: '10', bottomGap: '10', bottomPadRight: '10'
  },
  table: {
    compWidth: 400, compHeight: 120, radius: 8, isPill: false,
    paddingLeft: 16, paddingRight: 16, gap: 16, label: '44px Rows · Header',
    topLabel: '400 (min 100%)', leftLabel: '120',
    bottomPadLeft: '16', bottomGap: '16', bottomPadRight: '16'
  },
  badge: {
    compWidth: 110, compHeight: 24, radius: 12, isPill: true,
    paddingLeft: 8, paddingRight: 8, gap: 6, label: 'Healthy',
    topLabel: '110', leftLabel: '24',
    bottomPadLeft: '8', bottomGap: '6', bottomPadRight: '8'
  },
  progress: {
    compWidth: 280, compHeight: 24, radius: 4, isPill: false,
    paddingLeft: 0, paddingRight: 0, gap: 8, label: '64%',
    topLabel: '280', leftLabel: '24',
    bottomPadLeft: '0', bottomGap: '8', bottomPadRight: '0'
  },
  skeleton: {
    compWidth: 240, compHeight: 32, radius: 8, isPill: false,
    paddingLeft: 0, paddingRight: 0, gap: 8, label: 'Loading...',
    topLabel: '240', leftLabel: '32',
    bottomPadLeft: '0', bottomGap: '8', bottomPadRight: '0'
  },
  alert: {
    compWidth: 380, compHeight: 64, radius: 8, isPill: false,
    paddingLeft: 16, paddingRight: 36, gap: 12,
    iconWidth: 18, iconHeight: 18, iconType: 'warning-circle', label: 'System Notice',
    topLabel: '380', leftLabel: '64',
    bottomPadLeft: '16', bottomGap: '12', bottomPadRight: '36'
  },
  tooltip: {
    compWidth: 140, compHeight: 32, radius: 6, isPill: false,
    paddingLeft: 8, paddingRight: 8, gap: 6, label: 'Copy to clipboard',
    topLabel: '140', leftLabel: '32',
    bottomPadLeft: '8', bottomGap: '6', bottomPadRight: '8'
  },
  toast: {
    compWidth: 320, compHeight: 56, radius: 8, isPill: false,
    paddingLeft: 16, paddingRight: 36, gap: 12,
    iconWidth: 18, iconHeight: 18, iconType: 'check', label: 'Telemetry Synced',
    topLabel: '320', leftLabel: '56',
    bottomPadLeft: '16', bottomGap: '12', bottomPadRight: '36'
  },
  dialog: {
    compWidth: 400, compHeight: 180, radius: 12, isPill: false,
    paddingLeft: 24, paddingRight: 24, gap: 16, label: 'Modal Dialog Window',
    topLabel: '400', leftLabel: '180',
    bottomPadLeft: '24', bottomGap: '16', bottomPadRight: '24'
  },
  drawer: {
    compWidth: 360, compHeight: 200, radius: 12, isPill: false,
    paddingLeft: 24, paddingRight: 24, gap: 16, label: 'Configuration Drawer',
    topLabel: '360', leftLabel: '200',
    bottomPadLeft: '24', bottomGap: '16', bottomPadRight: '24'
  },
  popover: {
    compWidth: 260, compHeight: 120, radius: 8, isPill: false,
    paddingLeft: 16, paddingRight: 16, gap: 12, label: 'Context Details',
    topLabel: '260', leftLabel: '120',
    bottomPadLeft: '16', bottomGap: '12', bottomPadRight: '16'
  },
  dropdown: {
    compWidth: 220, compHeight: 130, radius: 8, isPill: false,
    paddingLeft: 8, paddingRight: 8, gap: 8, label: 'Action Menu Items',
    topLabel: '220', leftLabel: '130',
    bottomPadLeft: '8', bottomGap: '8', bottomPadRight: '8'
  },
  tabs: {
    compWidth: 320, compHeight: 40, radius: 8, isPill: false,
    paddingLeft: 12, paddingRight: 12, gap: 8, label: 'Tab 1 · Tab 2 · Tab 3',
    topLabel: '320', leftLabel: '40',
    bottomPadLeft: '12', bottomGap: '8', bottomPadRight: '12'
  },
  accordion: {
    compWidth: 360, compHeight: 110, radius: 8, isPill: false,
    paddingLeft: 16, paddingRight: 16, gap: 12, label: 'Expandable Header',
    topLabel: '360', leftLabel: '110',
    bottomPadLeft: '16', bottomGap: '12', bottomPadRight: '16'
  }
};

function buildComponentBlueprintSvg(slug, spec) {
  const cfg = BLUEPRINT_CONFIGS[slug] || BLUEPRINT_CONFIGS.button;
  const compW = cfg.compWidth;
  const compH = cfg.compHeight;
  const isPill = cfg.isPill;
  const rx = isPill ? compH / 2 : cfg.radius;
  const padL = cfg.paddingLeft;
  const padR = cfg.paddingRight;
  const gap = cfg.gap;
  const colorDim = '#FF9800';
  const colorLayout = '#D9A7F7';
  
  const viewW = Math.max(560, compW + 120);
  const viewH = compH + 180;
  const startX = (viewW - compW) / 2;
  const startY = 60;

  const topDimY = 24;
  const leftDimX = startX - 36;
  const bottomDimY1 = startY + compH + 28;
  const bottomDimY2 = startY + compH + 48;

  const hDim = (x1, x2, y, label, col) => {
    if (!label) return '';
    const mx = (x1 + x2) / 2;
    const txtW = String(label).length * 7 + 10;
    return `
      <line x1="${x1}" y1="${startY + compH}" x2="${x1}" y2="${y}" stroke="${col}" stroke-width="0.5" stroke-dasharray="2 2" stroke-opacity="0.4" />
      <line x1="${x2}" y1="${startY + compH}" x2="${x2}" y2="${y}" stroke="${col}" stroke-width="0.5" stroke-dasharray="2 2" stroke-opacity="0.4" />
      <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${col}" stroke-width="1" />
      <line x1="${x1}" y1="${y - 4}" x2="${x1}" y2="${y + 4}" stroke="${col}" stroke-width="1" />
      <line x1="${x2}" y1="${y - 4}" x2="${x2}" y2="${y + 4}" stroke="${col}" stroke-width="1" />
      <rect x="${mx - txtW / 2}" y="${y - 8}" width="${txtW}" height="16" rx="3" fill="#161618" stroke="${col}" stroke-width="0.6" />
      <text x="${mx}" y="${y}" fill="${col}" font-family="'Space Mono', monospace" font-size="10" font-weight="600" text-anchor="middle" dominant-baseline="middle">${label}</text>
    `;
  };

  const iconSvg = cfg.iconType ? phosphorIconsData[cfg.iconType] : null;
  const iconPath = iconSvg ? iconSvg.replace(/<svg[^>]*>|<\/svg>/g, '').trim() : '';
  const iconSize = cfg.iconWidth || 20;

  return `<svg class="anatomy-blueprint-svg" viewBox="0 0 ${viewW} ${viewH}" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="hatch-${slug}" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="6" stroke="${colorLayout}" stroke-width="1.2" stroke-opacity="0.25" />
      </pattern>
      <pattern id="grid-${slug}" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-opacity="0.05" stroke-width="0.8" />
      </pattern>
    </defs>

    <!-- Canvas Background -->
    <rect width="${viewW}" height="${viewH}" rx="8" fill="var(--doc-sub, #18181b)" />
    <rect width="${viewW}" height="${viewH}" rx="8" fill="url(#grid-${slug})" />

    <!-- Outer Bounding Box (Lavender Dotted Envelope) -->
    <rect x="${startX}" y="${startY}" width="${compW}" height="${compH}" rx="${rx}" fill="var(--doc-card, #222226)" stroke="var(--doc-line-strong, #3f3f46)" stroke-width="1" />

    ${isPill ? `
      <!-- Corner Negative Space Hatching for Capsule Pill -->
      <g opacity="0.35">
        <rect x="${startX}" y="${startY}" width="${rx}" height="${rx}" fill="url(#hatch-${slug})" />
        <rect x="${startX + compW - rx}" y="${startY}" width="${rx}" height="${rx}" fill="url(#hatch-${slug})" />
        <rect x="${startX}" y="${startY + compH - rx}" width="${rx}" height="${rx}" fill="url(#hatch-${slug})" />
        <rect x="${startX + compW - rx}" y="${startY + compH - rx}" width="${rx}" height="${rx}" fill="url(#hatch-${slug})" />
      </g>
      <rect x="${startX}" y="${startY}" width="${compW}" height="${compH}" rx="${rx}" fill="var(--doc-card, #222226)" stroke="${colorLayout}" stroke-width="1" stroke-opacity="0.6" />
    ` : ''}

    <!-- Hatched Padding Zones -->
    ${padL > 0 ? `<rect x="${startX}" y="${startY}" width="${padL}" height="${compH}" rx="${isPill ? 0 : rx}" fill="url(#hatch-${slug})" />` : ''}
    ${padR > 0 ? `<rect x="${startX + compW - padR}" y="${startY}" width="${padR}" height="${compH}" rx="${isPill ? 0 : rx}" fill="url(#hatch-${slug})" />` : ''}

    <!-- Child Slots: Icon & Label -->
    ${iconPath ? `
      <g transform="translate(${startX + padL}, ${startY + (compH - iconSize) / 2})">
        <rect width="${iconSize}" height="${iconSize}" rx="3" fill="rgba(217, 167, 247, 0.08)" stroke="${colorLayout}" stroke-width="1" stroke-dasharray="2 2" />
        <g transform="translate(1, 1) scale(${(iconSize - 2) / 256})" fill="${colorLayout}">
          ${iconPath}
        </g>
      </g>
      <g transform="translate(${startX + padL + iconSize + gap}, ${startY + (compH - 22) / 2})">
        <rect width="${Math.max(40, compW - padL - padR - iconSize - gap)}" height="22" rx="3" fill="rgba(217, 167, 247, 0.08)" stroke="${colorLayout}" stroke-width="1" stroke-dasharray="2 2" />
        <text x="${Math.max(40, compW - padL - padR - iconSize - gap) / 2}" y="11" fill="${colorLayout}" font-family="'Space Mono', monospace" font-size="10.5" font-weight="600" text-anchor="middle" dominant-baseline="middle">${cfg.label}</text>
      </g>
    ` : `
      <g transform="translate(${startX + padL}, ${startY + (compH - 22) / 2})">
        <rect width="${Math.max(40, compW - padL - padR)}" height="22" rx="3" fill="rgba(217, 167, 247, 0.08)" stroke="${colorLayout}" stroke-width="1" stroke-dasharray="2 2" />
        <text x="${Math.max(40, compW - padL - padR) / 2}" y="11" fill="${colorLayout}" font-family="'Space Mono', monospace" font-size="10.5" font-weight="500" text-anchor="middle" dominant-baseline="middle">${cfg.label}</text>
      </g>
    `}

    <!-- TOP DIMENSION LINE (Orange Width) -->
    <g>
      <line x1="${startX}" y1="${startY}" x2="${startX}" y2="${topDimY}" stroke="${colorDim}" stroke-width="0.5" stroke-dasharray="2 2" stroke-opacity="0.4" />
      <line x1="${startX + compW}" y1="${startY}" x2="${startX + compW}" y2="${topDimY}" stroke="${colorDim}" stroke-width="0.5" stroke-dasharray="2 2" stroke-opacity="0.4" />
      <line x1="${startX}" y1="${topDimY}" x2="${startX + compW}" y2="${topDimY}" stroke="${colorDim}" stroke-width="1" />
      <line x1="${startX}" y1="${topDimY - 4}" x2="${startX}" y2="${topDimY + 4}" stroke="${colorDim}" stroke-width="1" />
      <line x1="${startX + compW}" y1="${topDimY - 4}" x2="${startX + compW}" y2="${topDimY + 4}" stroke="${colorDim}" stroke-width="1" />
      <rect x="${startX + compW / 2 - 24}" y="${topDimY - 8}" width="48" height="16" rx="3" fill="#161618" stroke="${colorDim}" stroke-width="0.6" />
      <text x="${startX + compW / 2}" y="${topDimY}" fill="${colorDim}" font-family="'Space Mono', monospace" font-size="10" font-weight="600" text-anchor="middle" dominant-baseline="middle">${cfg.topLabel}</text>
    </g>

    <!-- LEFT DIMENSION LINE (Orange Height) -->
    <g>
      <line x1="${startX}" y1="${startY}" x2="${leftDimX}" y2="${startY}" stroke="${colorDim}" stroke-width="0.5" stroke-dasharray="2 2" stroke-opacity="0.4" />
      <line x1="${startX}" y1="${startY + compH}" x2="${leftDimX}" y2="${startY + compH}" stroke="${colorDim}" stroke-width="0.5" stroke-dasharray="2 2" stroke-opacity="0.4" />
      <line x1="${leftDimX}" y1="${startY}" x2="${leftDimX}" y2="${startY + compH}" stroke="${colorDim}" stroke-width="1" />
      <line x1="${leftDimX - 4}" y1="${startY}" x2="${leftDimX + 4}" y2="${startY}" stroke="${colorDim}" stroke-width="1" />
      <line x1="${leftDimX - 4}" y1="${startY + compH}" x2="${leftDimX + 4}" y2="${startY + compH}" stroke="${colorDim}" stroke-width="1" />
      <rect x="${leftDimX - 18}" y="${startY + compH / 2 - 8}" width="36" height="16" rx="3" fill="#161618" stroke="${colorDim}" stroke-width="0.6" />
      <text x="${leftDimX}" y="${startY + compH / 2}" fill="${colorDim}" font-family="'Space Mono', monospace" font-size="10" font-weight="600" text-anchor="middle" dominant-baseline="middle">${cfg.leftLabel}</text>
    </g>

    <!-- BOTTOM DIMENSION LINES (Lavender Left Pad, Gap, Right Pad) -->
    ${padL > 0 ? hDim(startX, startX + padL, bottomDimY1, cfg.bottomPadLeft, colorLayout) : ''}
    ${cfg.bottomGap ? hDim(startX + padL + iconSize, startX + padL + iconSize + gap, bottomDimY2, cfg.bottomGap, colorLayout) : ''}
    ${padR > 0 ? hDim(startX + compW - padR, startX + compW, bottomDimY1, cfg.bottomPadRight, colorLayout) : ''}
  </svg>`;
}

function buildDesignerExplanation(config, spec) {
  return `
  <div class="anatomy-designer-explanation">
    <div class="designer-expl-head">
      <div class="designer-expl-head__title">
        <svg class="as-icon" width="20" height="20" aria-hidden="true"><use href="#i-sliders"/></svg>
        <h3>Designer Blueprint &amp; Architecture Specification</h3>
      </div>
      <span class="as-badge as-badge--active"><span class="as-badge__dot"></span>4pt Spatial Precision</span>
    </div>

    <div class="designer-expl-grid">
      <div class="designer-expl-card">
        <div class="designer-expl-card__number">01</div>
        <h4>Spatial Grid &amp; 4pt Alignment System</h4>
        <p>The <strong>${spec.height}</strong> bounding envelope adheres strictly to Aster’s 4pt baseline grid (Base Unit = 4px). Standard touch targets (40px) and large interactive touch targets (56px) are exact multiples of 4 and 8. This guarantees pixel-perfect subpixel rasterization on standard 1&times; displays and crisp anti-aliasing across high-DPI (2&times;/3&times;) Retina viewports without fractional blur.</p>
      </div>

      <div class="designer-expl-card">
        <div class="designer-expl-card__number">02</div>
        <h4>Box Model &amp; Hatched Negative Space Zones</h4>
        <p>The 45&deg; diagonal hatched areas (<code>#D9A7F7</code>) in the blueprint illustrate protected interior padding (<strong>${spec.paddingX}</strong>). On components with full pill curvature (<code>Radius.Full = 9999px</code>), the circular capsule ends intrude deeply into the rectangular bounding envelope. 24px horizontal padding prevents typography and icons from visually colliding with the boundary curve.</p>
      </div>

      <div class="designer-expl-card">
        <div class="designer-expl-card__number">03</div>
        <h4>Internal Layout Slots &amp; Micro-Spacing</h4>
        <p>Interior child slots are isolated in lavender dashed bounding containers (<code>#D9A7F7</code>). The <strong>${spec.iconGap}</strong> enforces the Gestalt law of proximity, cognitively binding the Phosphor glyph and text into an indivisible action unit. Constraining the icon container to a fixed square prevents layout shift when glyphs change.</p>
      </div>

      <div class="designer-expl-card">
        <div class="designer-expl-card__number">04</div>
        <h4>Curvature &amp; Concentric Radius Mathematics</h4>
        <p>Curvature follows the mathematical concentric radius rule: <code>R_outer = R_inner + Padding</code>. Interactive action controls employ continuous capsule curvature (<code>${spec.radius}</code>) to maximize affordance, while containing surfaces (cards, modals) scale to 8px (<code>--as-radius-md</code>) or 12px (<code>--as-radius-lg</code>), eliminating awkward corner pinch.</p>
      </div>

      <div class="designer-expl-card">
        <div class="designer-expl-card__number">05</div>
        <h4>Kinetic State Machine (5 Active Layers)</h4>
        <p>Aster components implement Shade-DS layered kinetics:
          <br/>&bull; <strong>Layer 1 (Idle):</strong> Surface fill with 1px border glow.
          <br/>&bull; <strong>Layer 2 (Hover):</strong> Radial cursor spotlight at <code>(--_x, --_y)</code> expanding to full diameter.
          <br/>&bull; <strong>Layer 3 (Press):</strong> Tactile <code>scale(0.97) translateY(1px)</code> physical compression (80ms).
          <br/>&bull; <strong>Layer 4 (Focus):</strong> 2px solid focus ring + 2px offset (WCAG 2.4.7/2.4.11).
          <br/>&bull; <strong>Layer 5 (Success):</strong> Emerald glow (<code>#10b981</code>) + Phosphor checkmark, auto-decaying in 2000ms.
        </p>
      </div>

      <div class="designer-expl-card">
        <div class="designer-expl-card__number">06</div>
        <h4>Figma Variables &amp; Token Handoff</h4>
        <p>All measurements and color values map 1:1 to Aster's Figma Variables collections (<code>dist/figma/aster-*.json</code>). Designers binding these variables in Figma inspect identical mathematical values to the CSS custom properties developers and AI agents implement in production.</p>
      </div>
    </div>
  </div>`;
}

export function buildPlayground() {
  console.log('--- Generating Aster Website, Documentation Portal & Interactive Playground (Phase 15) ---');

  const spriteHtml = PHOSPHOR_SPRITE_HTML;

  // --------------------------------------------------------------------------------
  // 1. Home Landing Page (`/` and `#/overview`) — Minimal, High Impact
  // --------------------------------------------------------------------------------
  const overviewHtml = `
    <!-- =====================================================================
         HOME LANDING PAGE (/) — MINIMAL
         ===================================================================== -->
    <article class="doc-view" id="view-overview" data-active="" data-title="Home" data-section="overview" data-kind="landing" aria-labelledby="t-overview">
      <div class="landing--minimal">
        <section class="hero--minimal">
          <h1 id="t-overview" class="hero__title--minimal" tabindex="-1">ASTER DS</h1>
          <p class="hero__lead--minimal">Browser-native interface system engineered for Designers, Developers, and AI Coding Agents.</p>
          <div class="hero__cta--minimal">
            <a class="as-button as-button--primary as-button--lg" href="#/installation"><span class="as-button__label">Documentation</span></a>
            <a class="as-button as-button--secondary as-button--lg" href="#/playground"><span class="as-button__label">Playground</span></a>
            <a class="as-button as-button--outline as-button--lg" href="#/accordion"><span class="as-button__label">Components</span></a>
          </div>
        </section>

        <!-- Real Interactive Component Showcase Cards Grid -->
        <section class="home-components-grid" aria-label="Interactive Component Showcase">
          <!-- 1. Button -->
          <div class="home-comp-card">
            <div class="home-comp-card__preview">
              <button type="button" class="as-button as-button--primary as-button--md" id="home-card-btn" data-enable-success="true">
                <svg class="as-icon" width="16" height="16" aria-hidden="true"><use href="#i-star"/></svg>
                <span class="as-button__label">Button</span>
              </button>
            </div>
            <div class="home-comp-card__footer">
              <a href="#/button" class="home-comp-card__name">Button</a>
              <a href="#/button" class="home-comp-card__arrow-btn" aria-label="Go to Button component documentation">
                <svg class="as-icon" width="16" height="16" aria-hidden="true"><use href="#i-arrow"/></svg>
              </a>
            </div>
          </div>

          <!-- 2. Switch -->
          <div class="home-comp-card">
            <div class="home-comp-card__preview">
              <label class="as-switch" for="home-card-switch">
                <input type="checkbox" id="home-card-switch" class="as-switch-input" checked role="switch">
                <span class="as-switch-track"><span class="as-switch-thumb"></span></span>
              </label>
            </div>
            <div class="home-comp-card__footer">
              <a href="#/switch" class="home-comp-card__name">Switch</a>
              <a href="#/switch" class="home-comp-card__arrow-btn" aria-label="Go to Switch component documentation">
                <svg class="as-icon" width="16" height="16" aria-hidden="true"><use href="#i-arrow"/></svg>
              </a>
            </div>
          </div>

          <!-- 3. Radio Button -->
          <div class="home-comp-card">
            <div class="home-comp-card__preview">
              <div class="as-radio-group as-radio-group--horizontal" style="gap:24px;align-items:center;justify-content:center;">
                <label class="as-radio-field" style="cursor:pointer;margin:0;">
                  <span class="as-radio"><input type="radio" name="home-radio-showcase" class="as-radio-input" checked value="opt1" aria-label="Option 1"></span>
                </label>
                <label class="as-radio-field" style="cursor:pointer;margin:0;">
                  <span class="as-radio"><input type="radio" name="home-radio-showcase" class="as-radio-input" value="opt2" aria-label="Option 2"></span>
                </label>
              </div>
            </div>
            <div class="home-comp-card__footer">
              <a href="#/radio" class="home-comp-card__name">Radio Button</a>
              <a href="#/radio" class="home-comp-card__arrow-btn" aria-label="Go to Radio Button component documentation">
                <svg class="as-icon" width="16" height="16" aria-hidden="true"><use href="#i-arrow"/></svg>
              </a>
            </div>
          </div>

          <!-- 4. Slider -->
          <div class="home-comp-card">
            <div class="home-comp-card__preview" style="width:100%;">
              <div style="width:100%;max-width:200px;display:flex;flex-direction:column;gap:6px;">
                <input type="range" class="as-slider" id="home-card-slider" min="0" max="100" value="65" aria-label="Slider showcase">
                <div style="display:flex;justify-content:flex-end;">
                  <span id="home-card-slider-val" style="font-family:var(--doc-mono);font-size:11px;color:var(--doc-muted);">65%</span>
                </div>
              </div>
            </div>
            <div class="home-comp-card__footer">
              <a href="#/slider" class="home-comp-card__name">Slider</a>
              <a href="#/slider" class="home-comp-card__arrow-btn" aria-label="Go to Slider component documentation">
                <svg class="as-icon" width="16" height="16" aria-hidden="true"><use href="#i-arrow"/></svg>
              </a>
            </div>
          </div>

          <!-- 5. Badge -->
          <div class="home-comp-card">
            <div class="home-comp-card__preview">
              <div style="display:flex;gap:10px;align-items:center;justify-content:center;">
                <span class="as-badge as-badge--success" id="home-badge-healthy" style="cursor:pointer;" title="Status: Healthy"><span class="as-badge__dot"></span>Healthy</span>
                <span class="as-badge as-badge--warning" id="home-badge-sync" style="cursor:pointer;" title="Status: Syncing"><span class="as-badge__dot"></span>Sync</span>
              </div>
            </div>
            <div class="home-comp-card__footer">
              <a href="#/badge" class="home-comp-card__name">Badge</a>
              <a href="#/badge" class="home-comp-card__arrow-btn" aria-label="Go to Badge component documentation">
                <svg class="as-icon" width="16" height="16" aria-hidden="true"><use href="#i-arrow"/></svg>
              </a>
            </div>
          </div>

          <!-- 6. Checkbox -->
          <div class="home-comp-card">
            <div class="home-comp-card__preview">
              <div style="display:flex;gap:18px;align-items:center;justify-content:center;">
                <label class="as-checkbox-field" style="display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none;margin:0;">
                  <span class="as-checkbox"><input type="checkbox" class="as-checkbox-input" id="home-cb-showcase-1" checked></span>
                  <span style="font-size:13px;font-family:var(--doc-sans);color:var(--doc-ink);">Enabled</span>
                </label>
                <label class="as-checkbox-field" style="display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none;margin:0;">
                  <span class="as-checkbox"><input type="checkbox" class="as-checkbox-input" id="home-cb-showcase-2"></span>
                  <span style="font-size:13px;font-family:var(--doc-sans);color:var(--doc-muted);">Optional</span>
                </label>
              </div>
            </div>
            <div class="home-comp-card__footer">
              <a href="#/checkbox" class="home-comp-card__name">Checkbox</a>
              <a href="#/checkbox" class="home-comp-card__arrow-btn" aria-label="Go to Checkbox component documentation">
                <svg class="as-icon" width="16" height="16" aria-hidden="true"><use href="#i-arrow"/></svg>
              </a>
            </div>
          </div>

          <!-- 7. Progress -->
          <div class="home-comp-card">
            <div class="home-comp-card__preview" style="width:100%;">
              <div class="as-progress-field" style="width:100%;max-width:210px;cursor:pointer;" id="home-card-progress-field" title="Click to cycle progress">
                <div class="as-progress-field__header">
                  <span class="as-progress-field__label" style="font-size:13px;">Processing</span>
                  <span class="as-progress-field__value" id="home-card-progress-val">68%</span>
                </div>
                <div class="as-progress" role="progressbar" id="home-card-progress" aria-valuenow="68" aria-valuemin="0" aria-valuemax="100">
                  <div class="as-progress__bar" id="home-card-progress-bar" style="width:68%;"></div>
                </div>
              </div>
            </div>
            <div class="home-comp-card__footer">
              <a href="#/progress" class="home-comp-card__name">Progress</a>
              <a href="#/progress" class="home-comp-card__arrow-btn" aria-label="Go to Progress component documentation">
                <svg class="as-icon" width="16" height="16" aria-hidden="true"><use href="#i-arrow"/></svg>
              </a>
            </div>
          </div>
        </section>

        <!-- 3 Concise Discipline Paths -->
        <section class="audience-cards--minimal" aria-label="Audience disciplines">
          <div class="audience-card--minimal">
            <div class="audience-card__icon"><svg class="as-icon" width="22" height="22" aria-hidden="true"><use href="#i-sliders"/></svg></div>
            <h3>For Designers</h3>
            <p>Figma tokens, 4pt spatial grid, blueprint geometry specs, and token-driven handoff.</p>
            <a class="as-button as-button--tertiary as-button--sm" href="#/designers"><span class="as-button__label">Explore Hub &rarr;</span></a>
          </div>
          <div class="audience-card--minimal">
            <div class="audience-card__icon"><svg class="as-icon" width="22" height="22" aria-hidden="true"><use href="#i-plug"/></svg></div>
            <h3>For Developers</h3>
            <p>Browser-native web components, vanilla CSS tokens, zero external runtime dependencies.</p>
            <a class="as-button as-button--tertiary as-button--sm" href="#/developers"><span class="as-button__label">Explore Hub &rarr;</span></a>
          </div>
          <div class="audience-card--minimal">
            <div class="audience-card__icon"><svg class="as-icon" width="22" height="22" aria-hidden="true"><use href="#i-star"/></svg></div>
            <h3>For AI Agents</h3>
            <p>Structured prompt contracts, deterministic JSON specs, token-bound code generation.</p>
            <a class="as-button as-button--tertiary as-button--sm" href="#/agents"><span class="as-button__label">Explore Hub &rarr;</span></a>
          </div>
        </section>

        <footer class="site-footer" style="margin-top: 48px;">
          <span>Aster Design System &middot; v0.2 &middot; Zero-dependency browser-native architecture</span>
        </footer>
      </div>
    </article>
  `;

  // --------------------------------------------------------------------------------
  // 2. Separate Interactive Playground Page (`#/playground`) — Shade-DS Reference
  // --------------------------------------------------------------------------------
  const playgroundViewHtml = `
    <!-- =====================================================================
         SEPARATE INTERACTIVE PLAYGROUND PAGE (#/playground)
         ===================================================================== -->
    <article class="doc-view" id="view-playground" data-title="Interactive Playground" data-section="playground" data-kind="playground" aria-labelledby="t-playground">
      <header class="page-head" style="margin-bottom: 20px; padding-bottom: 16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div>
            <span class="eyebrow">Interactive Component Workbench &middot; Shade-DS Stage Architecture</span>
            <h1 id="t-playground" tabindex="-1" style="font-size: clamp(28px, 3.5vw, 38px); margin-top: 4px;">Live Component Playground</h1>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <a class="as-button as-button--secondary" href="#/button"><span class="as-button__label">Component Docs &rarr;</span></a>
          </div>
        </div>
        <p class="lead" style="margin-top: 8px; font-size: 15px;">Select a component, manipulate live properties and states, toggle blueprint measurement callouts, and copy synchronized HTML/JS code.</p>
      </header>

      <div class="pg-workspace">
        <!-- Left Component Selector Dock -->
        <aside class="pg-dock" aria-label="Playground component selector">
          <div class="pg-dock__title">Interactive Stage</div>
          <button type="button" class="pg-dock__btn" data-pg-comp="button" aria-pressed="true"><span>Button</span><small>40px pill</small></button>
          <button type="button" class="pg-dock__btn" data-pg-comp="input" aria-pressed="false"><span>Input &amp; Field</span><small>44px · 4px r</small></button>
          <button type="button" class="pg-dock__btn" data-pg-comp="badge" aria-pressed="false"><span>Badge</span><small>status pill</small></button>
          <button type="button" class="pg-dock__btn" data-pg-comp="alert" aria-pressed="false"><span>Alert Banner</span><small>red dot close</small></button>
          <button type="button" class="pg-dock__btn" data-pg-comp="switch" aria-pressed="false"><span>Switch</span><small>44x24px</small></button>
          <button type="button" class="pg-dock__btn" data-pg-comp="dialog" aria-pressed="false"><span>Dialog Modal</span><small>&lt;dialog&gt;</small></button>

          <div class="pg-dock__title" style="margin-top: 12px;">All 21 Component Specs</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;padding:4px;">
            <a class="pill" href="#/button">Button</a>
            <a class="pill" href="#/input">Input</a>
            <a class="pill" href="#/textarea">Textarea</a>
            <a class="pill" href="#/select">Select</a>
            <a class="pill" href="#/checkbox">Checkbox</a>
            <a class="pill" href="#/radio">Radio</a>
            <a class="pill" href="#/switch">Switch</a>
            <a class="pill" href="#/slider">Slider</a>
            <a class="pill" href="#/table">Table</a>
            <a class="pill" href="#/badge">Badge</a>
            <a class="pill" href="#/progress">Progress</a>
            <a class="pill" href="#/skeleton">Skeleton</a>
            <a class="pill" href="#/alert">Alert</a>
            <a class="pill" href="#/tooltip">Tooltip</a>
            <a class="pill" href="#/toast">Toast</a>
            <a class="pill" href="#/dialog">Dialog</a>
            <a class="pill" href="#/drawer">Drawer</a>
            <a class="pill" href="#/popover">Popover</a>
            <a class="pill" href="#/dropdown">Dropdown</a>
            <a class="pill" href="#/tabs">Tabs</a>
            <a class="pill" href="#/accordion">Accordion</a>
          </div>
        </aside>

        <!-- Center Interactive Stage + Live Code Output -->
        <div class="pg-center">
          <div class="pg-stage-box">
            <div class="pg-stage-toolbar">
              <div class="pg-stage-toolbar__left">
                <span style="width:8px;height:8px;border-radius:50%;background:var(--as-semantic-color-status-success-text);display:inline-block;"></span>
                <span>Live Canvas</span>
              </div>
              <div class="pg-stage-toolbar__actions">
                <button type="button" class="pg-chip-toggle" id="pg-toggle-blueprint" aria-pressed="true">Blueprint Rulers</button>
                <button type="button" class="pg-chip-toggle" id="pg-toggle-surface" aria-pressed="false">Elevated Surface</button>
                <button type="button" class="pg-chip-toggle" id="pg-toggle-theme" aria-pressed="false">Theme: Light</button>
              </div>
            </div>
            <div class="pg-stage-canvas" id="pg-stage-canvas" data-surface="canvas">
              <div id="pg-stage-mount" style="display:flex;align-items:center;justify-content:center;"></div>
              <div class="pg-blueprint-overlay" id="pg-blueprint-overlay" aria-label="Component blueprint measurements"></div>
            </div>
          </div>

          <!-- Synchronized Live Code Block -->
          <div class="code-block" id="pg-live-code">
            <div class="code-block__bar">
              <div class="code-block__meta">
                <span class="code-block__dots" aria-hidden="true"><i></i><i></i><i></i></span>
                <span>Live Generated Markup &middot; HTML</span>
              </div>
              <button type="button" class="copy-btn">Copy Code</button>
            </div>
            <div class="code-editor-body">
              <div class="code-gutter" aria-hidden="true"><span>1</span><span>2</span><span>3</span><span>4</span></div>
              <pre><code id="pg-live-code-el" data-highlighted="true"></code></pre>
            </div>
          </div>
        </div>

        <!-- Right Property Control Panel -->
        <aside class="pg-controls" id="pg-control-panel" aria-label="Component property controls">
          <div class="pg-controls__title">Live Property Controls</div>

          <div class="pg-control-group">
            <label for="pg-ctrl-variant">Variant / Mode</label>
            <div class="as-select-box">
              <select class="as-select" id="pg-ctrl-variant">
                <option value="primary" selected>primary</option>
                <option value="secondary">secondary</option>
                <option value="destructive">destructive</option>
                <option value="ghost">ghost</option>
              </select>
              <svg class="as-select-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 6 8 10 12 6"></polyline></svg>
            </div>
          </div>

          <div class="pg-control-group">
            <label for="pg-ctrl-label">Label / Title Copy</label>
            <input class="as-input" type="text" id="pg-ctrl-label" value="Deploy Cluster" />
          </div>

          <div class="pg-control-group" style="gap: 10px; padding-top: 6px;">
            <label class="as-checkbox-field">
              <span class="as-checkbox"><input type="checkbox" class="as-checkbox-input" id="pg-ctrl-icon" checked></span>
              <span class="as-checkbox-field__content"><span class="as-checkbox-field__label">Show Leading Icon / Dot</span></span>
            </label>
            <label class="as-checkbox-field">
              <span class="as-checkbox"><input type="checkbox" class="as-checkbox-input" id="pg-ctrl-loading"></span>
              <span class="as-checkbox-field__content"><span class="as-checkbox-field__label">Async Loading (aria-busy)</span></span>
            </label>
            <label class="as-checkbox-field">
              <span class="as-checkbox"><input type="checkbox" class="as-checkbox-input" id="pg-ctrl-aria-disabled"></span>
              <span class="as-checkbox-field__content"><span class="as-checkbox-field__label">Focus-Retaining Disabled</span></span>
            </label>
            <label class="as-checkbox-field">
              <span class="as-checkbox"><input type="checkbox" class="as-checkbox-input" id="pg-ctrl-disabled"></span>
              <span class="as-checkbox-field__content"><span class="as-checkbox-field__label">Native Disabled (:disabled)</span></span>
            </label>
          </div>
        </aside>
      </div>
    </article>
  `;

  // --------------------------------------------------------------------------------
  // 3. Audience Hubs (Designers, Developers, AI Agents)
  // --------------------------------------------------------------------------------
  const designersHtml = `
    <article class="doc-view" id="view-designers" data-title="For Designers" data-section="designers" aria-labelledby="t-designers">
      <header class="page-head">
        <div class="eyebrow">Audience Hub &middot; Designers</div>
        <h1 id="t-designers">Aster for Designers</h1>
        <p class="lead">Visual foundation grounded in Shade-DS neutral surfaces, monochrome primary actions, 4-role expressive typography, annotated component anatomy blueprints, and Figma variable collections.</p>
        <div class="component-meta">
          <span class="meta-tag meta-tag--success">Figma Variables Synced</span>
          <span class="meta-tag meta-tag--accent">26/26 WCAG 2.2 AA Contrast</span>
          <span class="meta-tag">4px Minimum Radius</span>
          <span class="meta-tag">Standard 40px Control Rhythm</span>
        </div>
      </header>

      <div class="doc-body">
        <section class="doc-section">
          <h2>Visual Foundation Summary</h2>
          <p>Aster pairs neutral crisp light surfaces (<code>#FFFFFF</code>, <code>#F5F5F5</code>, <code>#EEEEEE</code>) and deep carbon dark surfaces (<code>#121212</code>, <code>#1E1E1E</code>, <code>#333333</code>) with a decisive monochrome primary action (<code>#0F0F0F</code> in light mode, <code>#FFFFFF</code> in dark mode).</p>
          <div class="spec-grid">
            <div class="spec-card">
              <h4>1. Four-Role Typography</h4>
              <p><strong>Bebas Neue</strong> for display heroes, <strong>Manrope</strong> for interface controls and body copy, <strong>Space Mono</strong> for code and tabular metrics, and <strong>Merriweather</strong> for editorial quotes.</p>
              <a href="#/typography">Inspect Typography Scale &rarr;</a>
            </div>
            <div class="spec-card">
              <h4>2. Annotated Component Anatomy</h4>
              <p>Every component page includes a dedicated <strong>Anatomy</strong> tab with numbered blueprint pins and a specification table separating fixed vs. content-dependent measurements.</p>
              <a href="#/button">Inspect Button Anatomy &rarr;</a>
            </div>
            <div class="spec-card">
              <h4>3. Minimum 4px Corner Radius</h4>
              <p>No component uses a 2px radius. Checkboxes, tooltips, and tags use <code>4px</code> (<code>--as-radius-sm</code>); inputs and alerts use <code>8px</code>; modals use <code>12px</code>; buttons and badges use <code>9999px</code> pills.</p>
              <a href="#/elevation">Inspect Radius Scale &rarr;</a>
            </div>
            <div class="spec-card">
              <h4>4. Shade-DS Red Dot Dismiss Controls</h4>
              <p>Dismissible components (Dialog, Drawer, Alert, Toast, Popover) share a <code>12px &times; 12px</code> solid red dot dismiss control (<code>#ff453a</code> dark / <code>#c5221f</code> light) with kinetic scale (1.2 hover, 0.9 active) and zero wireframe border strokes.</p>
              <a href="#/dialog">Inspect Dialog Close Control &rarr;</a>
            </div>
          </div>
        </section>

        <section class="doc-section">
          <h2>Figma Variable Collections</h2>
          <p>Synchronize canonical Git tokens directly into Figma Variables using <code>npm run export:figma</code>:</p>
          <div class="spec-wrap">
            <table class="spec-table">
              <thead><tr><th>Figma Collection</th><th>Modes</th><th>Payload Source</th></tr></thead>
              <tbody>
                <tr><td><strong>Aster Colors</strong></td><td>Light (<code>1001:0</code>) &middot; Dark (<code>1001:1</code>)</td><td><code>dist/figma/aster-colors.json</code></td></tr>
                <tr><td><strong>Aster Density</strong></td><td>Standard (<code>2001:0</code> — 40px controls, 44px table rows)</td><td><code>dist/figma/aster-density.json</code></td></tr>
                <tr><td><strong>Aster Dimensions</strong></td><td>Value (<code>3001:0</code> — 4px spatial grid &amp; radius scale)</td><td><code>dist/figma/aster-dimensions.json</code></td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </article>
  `;

  const developersHtml = `
    <article class="doc-view" id="view-developers" data-title="For Developers" data-section="developers" aria-labelledby="t-developers">
      <header class="page-head">
        <div class="eyebrow">Audience Hub &middot; Developers</div>
        <h1 id="t-developers">Aster for Developers</h1>
        <p class="lead">Zero-dependency CSS custom properties and pure ES module controllers with colorful syntax-highlighted code snippets and full W3C APG keyboard support.</p>
        <div class="component-meta">
          <span class="meta-tag meta-tag--success">Zero Runtime Dependencies</span>
          <span class="meta-tag meta-tag--accent">Pure ESM &amp; CSS</span>
          <span class="meta-tag">Browser Native</span>
        </div>
      </header>

      <div class="doc-body">
        <section class="doc-section">
          <h2>Quickstart Consumption</h2>
          <p>Include the compiled stylesheet and initialize interactive behaviors once on DOM ready:</p>
          <div class="code-block">
            <div class="code-block__bar">
              <div class="code-block__meta"><span class="code-block__dots" aria-hidden="true"><i></i><i></i><i></i></span><span>HTML / ES Module Quickstart</span></div>
              <button type="button" class="copy-btn">Copy Code</button>
            </div>
            <pre><code>&lt;!-- Load canonical Aster master stylesheet --&gt;
&lt;link rel="stylesheet" href="/dist/css/aster.css" /&gt;

&lt;!-- Initialize delegated component controllers --&gt;
&lt;script type="module"&gt;
  import { initAsterComponents } from '/dist/js/aster.js';
  initAsterComponents(document);
&lt;/script&gt;</code></pre>
          </div>
        </section>

        <section class="doc-section">
          <h2>Package Exports Map</h2>
          <div class="spec-wrap">
            <table class="spec-table">
              <thead><tr><th>Import Subpath</th><th>Target Bundle</th><th>Contents</th></tr></thead>
              <tbody>
                <tr><td><code>aster-design-system</code></td><td><code>dist/js/aster.js</code></td><td>ES module exporting <code>initAsterComponents</code>, <code>setButtonLoading</code>, <code>validateInput</code>, <code>showToast</code>, etc.</td></tr>
                <tr><td><code>aster-design-system/aster.css</code></td><td><code>dist/css/aster.css</code></td><td>All-in-one stylesheet (90 CSS tokens + 22 component modules)</td></tr>
                <tr><td><code>aster-design-system/tokens.css</code></td><td><code>dist/css/tokens.css</code></td><td>Design token custom properties only</td></tr>
                <tr><td><code>aster-design-system/components.css</code></td><td><code>dist/css/components.css</code></td><td>Component CSS rules only</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </article>
  `;

  const agentsHtml = `
    <article class="doc-view" id="view-agents" data-title="For AI Agents" data-section="agents" aria-labelledby="t-agents">
      <header class="page-head">
        <div class="eyebrow">Audience Hub &middot; AI Coding Agents</div>
        <h1 id="t-agents">Aster for AI Coding Agents</h1>
        <p class="lead">Machine-readable contracts, copyable per-component implementation prompts, canonical file maps, and deterministic verification scripts.</p>
        <div class="component-meta">
          <span class="meta-tag meta-tag--success">AGENTS.md &middot; SKILL.md</span>
          <span class="meta-tag meta-tag--accent">Copyable Component Prompts</span>
          <span class="meta-tag">646/646 Contract Checks</span>
        </div>
      </header>

      <div class="doc-body">
        <section class="doc-section">
          <h2>Canonical Source of Truth Map</h2>
          <div class="spec-wrap">
            <table class="spec-table">
              <thead><tr><th>Repository Path</th><th>Role &amp; Content</th><th>Read When</th></tr></thead>
              <tbody>
                <tr><td><code>AGENTS.md</code></td><td>Entry point, boundaries, zero-cost rules</td><td>Start of every session</td></tr>
                <tr><td><code>tokens/</code></td><td>Canonical DTCG JSON token sources</td><td>Authoring or referencing tokens</td></tr>
                <tr><td><code>skills/using-aster-tokens/SKILL.md</code></td><td>Token role grammar, forbidden primitive leaks</td><td>Styling or binding tokens</td></tr>
                <tr><td><code>components/</code></td><td>Canonical CSS &amp; JS component sources</td><td>Building or maintaining components</td></tr>
                <tr><td><code>docs/components/*.md</code></td><td>21 human component specifications</td><td>Inspecting anatomy, tokens, APG rules</td></tr>
                <tr><td><code>skills/using-aster-components/SKILL.md</code></td><td>21 machine-checkable component contracts</td><td>Implementing or verifying components</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="doc-section">
          <h2>Required Agent Verification Battery</h2>
          <div class="code-block">
            <div class="code-block__bar">
              <div class="code-block__meta"><span class="code-block__dots" aria-hidden="true"><i></i><i></i><i></i></span><span>Verification Commands</span></div>
              <button type="button" class="copy-btn">Copy Code</button>
            </div>
            <pre><code>npm run build
npm run test:contrast
npm run test:docs
npm run export:figma && npm run test:figma
npm run test:components
npm run test:exports
npm run test:browser</code></pre>
          </div>
        </section>
      </div>
    </article>
  `;

  // --------------------------------------------------------------------------------
  // 4. Foundations Views (Installation, Colors, Typography, Spacing, Elevation, Themes, Motion)
  // --------------------------------------------------------------------------------
  const installationHtml = `
    <article class="doc-view" id="view-installation" data-title="Installation" data-section="getting-started" aria-labelledby="t-installation">
      <header class="page-head">
        <div class="eyebrow">Getting Started &middot; Setup</div>
        <h1 id="t-installation">Installation &amp; Quickstart</h1>
        <p class="lead">Integrate Aster into any web application using zero-dependency browser CSS and ES modules.</p>
      </header>
      <div class="doc-body">
        <section class="doc-section">
          <h2>1. Include Fonts &amp; Master Stylesheet</h2>
          <p>Load the four Google Fonts families (or rely on clean local system fallbacks) and link <code>/dist/css/aster.css</code>:</p>
          <div class="code-block">
            <div class="code-block__bar">
              <div class="code-block__meta"><span class="code-block__dots" aria-hidden="true"><i></i><i></i><i></i></span><span>HTML Head Setup</span></div>
              <button type="button" class="copy-btn">Copy Code</button>
            </div>
            <pre><code>&lt;link rel="stylesheet" href="/dist/css/aster.css" /&gt;
&lt;script type="module"&gt;
  import { initAsterComponents } from '/dist/js/aster.js';
  initAsterComponents(document);
&lt;/script&gt;</code></pre>
          </div>
        </section>
        <section class="doc-section">
          <h2>2. Theme Switching</h2>
          <p>Toggle between Light and Dark modes by setting <code>data-theme="dark"</code> on <code>&lt;html&gt;</code>. All 90 CSS custom properties recalculate automatically.</p>
          <div class="code-block">
            <div class="code-block__bar">
              <div class="code-block__meta"><span class="code-block__dots" aria-hidden="true"><i></i><i></i><i></i></span><span>Theme Attribute</span></div>
              <button type="button" class="copy-btn">Copy Code</button>
            </div>
            <pre><code>&lt;html lang="en" data-theme="dark"&gt;</code></pre>
          </div>
        </section>
      </div>
    </article>
  `;

  const colorsHtml = `
    <article class="doc-view" id="view-colors" data-title="Color" data-section="foundations" aria-labelledby="t-colors">
      <header class="page-head">
        <div class="eyebrow">Foundations &middot; Palette</div>
        <h1 id="t-colors">Color System</h1>
        <p class="lead">Shade-DS neutral surface hierarchy paired with a high-contrast monochrome primary action and WCAG 2.2 AA semantic status tokens.</p>
      </header>
      <div class="doc-body">
        <section class="doc-section">
          <h2>Neutral Surfaces &amp; Content Hierarchy (Shade-DS Base)</h2>
          <p>Crisp neutral light surfaces (<code>#FFFFFF</code>, <code>#F5F5F5</code>, <code>#EEEEEE</code>) and carbon dark surfaces (<code>#121212</code>, <code>#1E1E1E</code>, <code>#333333</code>) with 3 tiers of content ink (<code>#E0E0E0</code>, <code>#AAAAAA</code>, <code>#777777</code> in dark / <code>#121212</code>, <code>#555555</code>, <code>#777777</code> in light).</p>
          <div class="swatches" id="swatches-neutral"></div>
        </section>
        <section class="doc-section">
          <h2>Monochrome Action Hierarchy (Shade-DS Accent)</h2>
          <p>Primary interactive elements use crisp white (<code>#FFFFFF</code>) with dark ink (<code>#0F0F0F</code>) in dark mode, and near-black (<code>#0F0F0F</code>) with white ink (<code>#FFFFFF</code>) in light mode.</p>
          <div class="swatches" id="swatches-accent"></div>
        </section>
        <section class="doc-section">
          <h2>Status Surfaces &amp; Content Palette (Shade-DS Status Colors)</h2>
          <p>Faithfully reproduced status surface tints and content ink from Shade-DS for Success, Warning, Error/Critical, Focus, and Active Layout states across both dark and light modes with zero wireframe outlines.</p>
          <div class="swatches" id="swatches-status"></div>
        </section>
        <section class="doc-section">
          <h2>Real-Time Contrast Audit</h2>
          <div class="spec-wrap">
            <table class="spec-table" id="contrast-table">
              <thead><tr><th>Pair</th><th>Foreground</th><th>Background</th><th>Actual</th><th>Required</th><th>Status</th></tr></thead>
              <tbody></tbody>
            </table>
          </div>
        </section>
      </div>
    </article>
  `;

  const typographyHtml = `
    <article class="doc-view" id="view-typography" data-title="Typography" data-section="foundations" aria-labelledby="t-typography">
      <header class="page-head">
        <div class="eyebrow">Foundations &middot; Typography</div>
        <h1 id="t-typography">Typography</h1>
        <p class="lead">Four distinct typographic roles inspired by Shade-DS: Bebas Neue for display headers, Manrope for UI and body copy, Space Mono for code and metrics, and Merriweather for editorial quotes.</p>
      </header>
      <div class="doc-body">
        <section class="doc-section">
          <h2>Four Font Family Roles</h2>
          <div class="spec-grid">
            <div class="spec-card">
              <h4>Display / Hero (Bebas Neue)</h4>
              <p style="font-family: var(--as-typography-font-family-display); font-size: 36px; line-height: 1; color: var(--doc-ink);">PRECISION INTERFACE ARCHITECTURE</p>
              <code>--as-typography-font-family-display</code>
            </div>
            <div class="spec-card">
              <h4>Body / UI (Manrope)</h4>
              <p style="font-family: var(--as-typography-font-family-sans); font-size: 16px; color: var(--doc-ink);">Clean geometric legibility across form controls, tables, and documentation.</p>
              <code>--as-typography-font-family-sans</code>
            </div>
            <div class="spec-card">
              <h4>Technical / Code (Space Mono)</h4>
              <p style="font-family: var(--as-typography-font-family-mono); font-size: 14px; color: var(--doc-ink);">0123456789 [eu-west-1a] 1.24ms</p>
              <code>--as-typography-font-family-mono</code>
            </div>
            <div class="spec-card">
              <h4>Editorial / Quote (Merriweather)</h4>
              <p style="font-family: var(--as-typography-font-family-quote); font-style: italic; font-size: 15px; color: var(--doc-ink);">&ldquo;Clarity over ornamentation in every token binding.&rdquo;</p>
              <code>--as-typography-font-family-quote</code>
            </div>
          </div>
        </section>
        <section class="doc-section">
          <h2>Type Scale</h2>
          <div class="spec-wrap">
            <table class="spec-table">
              <thead><tr><th>Token</th><th>Size</th><th>Sample</th><th>Role</th></tr></thead>
              <tbody>
                <tr><td><code>--as-typography-font-size-xs</code></td><td>12px (0.75rem)</td><td style="font-size:12px;">Badges, captions, counters</td><td>Informational floor</td></tr>
                <tr><td><code>--as-typography-font-size-sm</code></td><td>14px (0.875rem)</td><td style="font-size:14px;">Buttons, inputs, table cells</td><td>Standard UI control size</td></tr>
                <tr><td><code>--as-typography-font-size-base</code></td><td>16px (1.0rem)</td><td style="font-size:16px;">Body copy and prose</td><td>Reading text</td></tr>
                <tr><td><code>--as-typography-font-size-lg</code></td><td>20px (1.25rem)</td><td style="font-size:20px;font-weight:600;">Modal &amp; card titles</td><td>Subheadings</td></tr>
                <tr><td><code>--as-typography-font-size-xl</code></td><td>24px (1.5rem)</td><td style="font-size:24px;font-weight:600;">Section headings</td><td>Major sections</td></tr>
                <tr><td><code>--as-typography-font-size-2xl</code></td><td>36px (2.25rem)</td><td style="font-size:30px;font-weight:700;">Page titles</td><td>Page headers</td></tr>
                <tr><td><code>--as-typography-font-size-3xl</code></td><td>48px (3.0rem)</td><td style="font-family:var(--as-typography-font-family-display);font-size:38px;">DISPLAY HERO</td><td>Hero headlines</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </article>
  `;

  const spacingHtml = `
    <article class="doc-view" id="view-spacing" data-title="Spacing &amp; Layout" data-section="foundations" aria-labelledby="t-spacing">
      <header class="page-head">
        <div class="eyebrow">Foundations &middot; Spacing</div>
        <h1 id="t-spacing">Spacing &amp; Layout</h1>
        <p class="lead">Strict 4px geometric progression from <code>--as-space-0</code> (0px) to <code>--as-space-16</code> (64px).</p>
      </header>
      <div class="doc-body">
        <section class="doc-section">
          <h2>Spacing Scale</h2>
          <div class="spec-wrap">
            <table class="spec-table">
              <thead><tr><th>Token</th><th>Pixels</th><th>Ruler</th><th>Intended Role</th></tr></thead>
              <tbody>
                <tr><td><code>--as-space-1</code></td><td>4px</td><td><div style="width:4px;height:12px;background:var(--doc-ink);border-radius:4px;"></div></td><td>Micro gaps, tooltip vertical padding</td></tr>
                <tr><td><code>--as-space-2</code></td><td>8px</td><td><div style="width:8px;height:12px;background:var(--doc-ink);border-radius:4px;"></div></td><td>Button vertical padding, icon gap, badge padding</td></tr>
                <tr><td><code>--as-space-3</code></td><td>12px</td><td><div style="width:12px;height:12px;background:var(--doc-ink);border-radius:4px;"></div></td><td>Input horizontal padding, checkbox/switch gap</td></tr>
                <tr><td><code>--as-space-4</code></td><td>16px</td><td><div style="width:16px;height:12px;background:var(--doc-ink);border-radius:4px;"></div></td><td>Table cell horizontal padding, alert padding, accordion padding</td></tr>
                <tr><td><code>--as-space-5</code></td><td>20px</td><td><div style="width:20px;height:12px;background:var(--doc-ink);border-radius:4px;"></div></td><td>Dialog &amp; drawer padding</td></tr>
                <tr><td><code>--as-space-6</code></td><td>24px</td><td><div style="width:24px;height:12px;background:var(--doc-ink);border-radius:4px;"></div></td><td><strong>Button left/right horizontal padding (24px)</strong>, card padding</td></tr>
                <tr><td><code>--as-space-8</code></td><td>32px</td><td><div style="width:32px;height:12px;background:var(--doc-ink);border-radius:4px;"></div></td><td>Section spacing</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </article>
  `;

  const elevationHtml = `
    <article class="doc-view" id="view-elevation" data-title="Radius &amp; Elevation" data-section="foundations" aria-labelledby="t-elevation">
      <header class="page-head">
        <div class="eyebrow">Foundations &middot; Elevation</div>
        <h1 id="t-elevation">Radius &amp; Elevation</h1>
        <p class="lead">Minimum 4px component corner radius policy paired with 1px hairline borders and ambient elevation shadows.</p>
      </header>
      <div class="doc-body">
        <section class="doc-section">
          <h2>Corner Radius Scale (Zero 2px Radii)</h2>
          <div class="spec-grid">
            <div class="spec-card">
              <h4>None (0px)</h4>
              <div style="height:48px;background:var(--doc-sub);border:1px solid var(--doc-line-strong);border-radius:var(--as-radius-none);display:grid;place-items:center;font-family:var(--doc-mono);font-size:12px;">--as-radius-none (0px)</div>
              <p>Full-bleed drawer edges and table grid lines.</p>
            </div>
            <div class="spec-card">
              <h4>Small (4px Minimum)</h4>
              <div style="height:48px;background:var(--doc-sub);border:1px solid var(--doc-line-strong);border-radius:var(--as-radius-sm);display:grid;place-items:center;font-family:var(--doc-mono);font-size:12px;">--as-radius-sm (4px)</div>
              <p>Checkboxes, tooltips, dropdown items, inline code badges.</p>
            </div>
            <div class="spec-card">
              <h4>Medium (8px Default)</h4>
              <div style="height:48px;background:var(--doc-sub);border:1px solid var(--doc-line-strong);border-radius:var(--as-radius-md);display:grid;place-items:center;font-family:var(--doc-mono);font-size:12px;">--as-radius-md (8px)</div>
              <p>Inputs, textareas, selects, alerts, toasts, dropdown menus.</p>
            </div>
            <div class="spec-card">
              <h4>Large (12px Container)</h4>
              <div style="height:48px;background:var(--doc-sub);border:1px solid var(--doc-line-strong);border-radius:var(--as-radius-lg);display:grid;place-items:center;font-family:var(--doc-mono);font-size:12px;">--as-radius-lg (12px)</div>
              <p>Modal dialogs, popovers, data tables, accordions, cards.</p>
            </div>
            <div class="spec-card">
              <h4>Full Pill (9999px)</h4>
              <div style="height:48px;background:var(--doc-sub);border:1px solid var(--doc-line-strong);border-radius:var(--as-radius-full);display:grid;place-items:center;font-family:var(--doc-mono);font-size:12px;">--as-radius-full (9999px)</div>
              <p>Buttons, status badges, switch tracks, macOS close circles.</p>
            </div>
          </div>
        </section>
      </div>
    </article>
  `;

  const themesDensityHtml = `
    <article class="doc-view" id="view-themes-density" data-title="Themes &amp; Density" data-section="foundations" aria-labelledby="t-themes-density">
      <header class="page-head">
        <div class="eyebrow">Foundations &middot; Adaptation</div>
        <h1 id="t-themes-density">Themes &amp; Standard Density</h1>
        <p class="lead">Dual Light and Dark themes paired with a single, unified Standard density rhythm (40px interactive controls and 44px table rows).</p>
      </header>
      <div class="doc-body">
        <section class="doc-section">
          <h2>Standard Control Rhythm</h2>
          <p>Aster uses a single Standard density mode across all components to guarantee generous touch targets and consistent visual alignment.</p>
          <div class="spec-wrap">
            <table class="spec-table">
              <thead><tr><th>Dimension Role</th><th>Token</th><th>Resolved Value</th></tr></thead>
              <tbody>
                <tr><td>Control Height (Button, Input, Select)</td><td><code>--as-density-control-height</code></td><td><strong>40px</strong></td></tr>
                <tr><td>Button Horizontal Padding</td><td><code>--as-space-6</code></td><td><strong>24px left / 24px right</strong></td></tr>
                <tr><td>Table Row Height</td><td><code>--as-density-table-row-height</code></td><td><strong>44px</strong></td></tr>
                <tr><td>Card Padding</td><td><code>--as-density-card-padding</code></td><td><strong>24px</strong></td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </article>
  `;

  const motionHtml = `
    <article class="doc-view" id="view-motion" data-title="Motion" data-section="foundations" aria-labelledby="t-motion">
      <header class="page-head">
        <div class="eyebrow">Foundations &middot; Interaction</div>
        <h1 id="t-motion">Motion &amp; Transitions</h1>
        <p class="lead">Physics-inspired easing curves, cursor-origin circular button fills, and instant prefers-reduced-motion degradation.</p>
      </header>
      <div class="doc-body">
        <section class="doc-section">
          <h2>Entrance Choreography Demo</h2>
          <div class="preview-card">
            <div class="preview-card__header">
              <span class="preview-card__title">Interactive Choreography</span>
              <button type="button" class="as-button as-button--secondary" id="replay-enter"><span class="as-button__label">Replay Animation</span></button>
            </div>
            <div class="preview-canvas" style="min-height: 180px;">
              <div id="enter-demo" class="is-entering" style="padding: 24px 32px; background: var(--as-semantic-color-surface-card); border: 1px solid var(--as-semantic-color-border-subtle); border-radius: var(--as-radius-lg); box-shadow: var(--as-elevation-shadow-overlay); text-align: center;">
                <h4 style="margin: 0 0 8px;">Modal Surface Elevation</h4>
                <p style="margin: 0; color: var(--as-semantic-color-text-muted); font-size: 13px;">Entering using var(--as-motion-duration-md) and var(--as-motion-ease-decelerate).</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </article>
  `;

  // --------------------------------------------------------------------------------
  // 5. Generate Individual Component Views (All 21) with 4 Primary Tabs:
  //    Tab 1: Preview | Tab 2: Code | Tab 3: Prompt | Tab 4: Anatomy
  // --------------------------------------------------------------------------------
  function buildComponentView(config) {
    const spec = COMPONENT_ANATOMY_SPECS[config.slug] || COMPONENT_ANATOMY_SPECS.button;
    const promptText = buildAgentPrompt(config, spec);
    const partsHtml = spec.parts.map(([pin, name, sel]) => `
      <span class="anatomy-badge" title="${esc(sel)}">
        <span class="anatomy-badge__pin">${esc(pin)}</span>
        <strong>${esc(name)}</strong>
        <code>${esc(sel)}</code>
      </span>
    `).join('');

    const anatomyRowsHtml = spec.rows.map(([part, val, tok, behavior]) => `
      <tr>
        <td><strong>${esc(part)}</strong></td>
        <td><code>${esc(val)}</code></td>
        <td><code>${esc(tok)}</code></td>
        <td><span class="pill">${esc(behavior)}</span></td>
      </tr>
    `).join('');

    return `
    <!-- =====================================================================
         ${config.name.toUpperCase()} COMPONENT
         ===================================================================== -->
    <article class="doc-view" id="view-${config.slug}" data-title="${config.name}" data-section="components" aria-labelledby="t-${config.slug}">
      <header class="page-head">
        <div class="eyebrow">Components &middot; ${config.category}</div>
        <h1 id="t-${config.slug}" tabindex="-1">${config.name}</h1>
        <p class="lead">${esc(config.description)}</p>
        <div class="component-meta">
          <span class="meta-tag meta-tag--success">WCAG 2.2 AA</span>
          <span class="meta-tag meta-tag--accent">${esc(spec.height.split(' (')[0])}</span>
          <span class="meta-tag">Radius: ${esc(spec.radius.split(' (')[0])}</span>
          <span class="meta-tag">Element: ${esc(config.element)}</span>
        </div>
        <nav class="component-audience-nav" aria-label="Component audience perspective">
          <span class="audience-nav-label">Audience Hubs:</span>
          <a href="#/designers" class="audience-chip">For Designers</a>
          <a href="#/developers" class="audience-chip">For Developers</a>
          <a href="#/agents" class="audience-chip">For AI Agents</a>
        </nav>
      </header>

      <div class="doc-body">
        <!-- Primary 4-Tab Component Workbench: Preview | Code | Prompt | Anatomy -->
        <section class="doc-section">
          <h2>Component Workbench</h2>
          <p>Switch between the live interactive preview, syntax-highlighted implementation code, copyable AI coding agent prompt, and designer anatomy blueprint.</p>

          <div class="preview-card" id="workbench-${config.slug}">
            <div class="preview-card__header">
              <span class="preview-card__title">${config.name} &middot; Canonical Spec</span>
              <div class="preview-tabs" role="tablist" aria-label="${config.name} documentation tabs">
                <button type="button" class="preview-tab" role="tab" data-tab="preview" aria-selected="true" tabindex="0">Preview</button>
                <button type="button" class="preview-tab" role="tab" data-tab="code" aria-selected="false" tabindex="-1">Code</button>
                <button type="button" class="preview-tab" role="tab" data-tab="prompt" aria-selected="false" tabindex="-1">Prompt</button>
                <button type="button" class="preview-tab" role="tab" data-tab="anatomy" aria-selected="false" tabindex="-1">Anatomy</button>
              </div>
            </div>

            <!-- TAB 1: PREVIEW -->
            <div class="preview-canvas" role="tabpanel" aria-label="${config.name} live preview">
              ${config.previewHtml}
            </div>

            <!-- TAB 2: CODE (Colorful Multi-Category Syntax Highlighting) -->
            <div class="preview-code" role="tabpanel" aria-label="${config.name} implementation code" hidden>
              <div class="code-block">
                <div class="code-block__bar">
                  <div class="code-block__meta">
                    <span class="code-block__dots" aria-hidden="true"><i></i><i></i><i></i></span>
                    <span>HTML / ES Module &middot; components/${config.slug}/${config.slug}.css</span>
                  </div>
                  <button type="button" class="copy-btn">Copy Code</button>
                </div>
                <pre><code>${config.codeSnippet}</code></pre>
              </div>
            </div>

            <!-- TAB 3: PROMPT (Copyable AI Coding Agent Implementation Prompt) -->
            <div class="preview-prompt" role="tabpanel" aria-label="${config.name} AI agent prompt" hidden>
              <div class="prompt-panel">
                <div class="prompt-panel__bar">
                  <div>
                    <div class="prompt-panel__title"><svg class="as-icon" width="15" height="15" aria-hidden="true"><use href="#i-star"/></svg> AI Agent Implementation Prompt &middot; ${config.name}</div>
                    <div class="prompt-panel__desc">Grounded in canonical tokens, geometry, ARIA contracts, and repository paths.</div>
                  </div>
                  <button type="button" class="copy-prompt-btn">Copy Prompt</button>
                </div>
                <pre class="prompt-panel__pre">${esc(promptText)}</pre>
              </div>
            </div>

            <!-- TAB 4: ANATOMY (Technical Blueprint Box & Designer Explanation) -->
            <div class="preview-anatomy" role="tabpanel" aria-label="${config.name} visual anatomy and measurements" hidden>
              <div class="anatomy-panel">
                <div class="anatomy-stage">
                  <div class="anatomy-blueprint-head">
                    <span>Technical Blueprint &middot; ${config.name}</span>
                    <span>Standard Density &middot; 4pt Spatial Scale</span>
                  </div>
                  
                  <!-- Exact Technical Measurement Blueprint Box Matching Reference Image -->
                  <div class="anatomy-blueprint-box" aria-label="${config.name} geometric measurement blueprint">
                    ${buildComponentBlueprintSvg(config.slug, spec)}
                  </div>

                  <!-- Annotated Structural Parts Badges -->
                  <div class="anatomy-callouts-strip" aria-label="Annotated structural parts">
                    ${partsHtml}
                  </div>

                  <!-- Key Dimension Rulers -->
                  <div class="anatomy-rulers" aria-label="Key geometric measurements">
                    <div class="anatomy-ruler-card">
                      <span>Height / Box</span>
                      <strong>${esc(spec.height.split(' (')[0])}</strong>
                      <small>${esc(spec.height)}</small>
                    </div>
                    <div class="anatomy-ruler-card">
                      <span>Horizontal Padding</span>
                      <strong>${esc(spec.paddingX.split(' (')[0])}</strong>
                      <small>${esc(spec.paddingX)}</small>
                    </div>
                    <div class="anatomy-ruler-card">
                      <span>Vertical Padding</span>
                      <strong>${esc(spec.paddingY.split(' (')[0])}</strong>
                      <small>${esc(spec.paddingY)}</small>
                    </div>
                    <div class="anatomy-ruler-card">
                      <span>Corner Radius</span>
                      <strong>${esc(spec.radius.split(' (')[0])}</strong>
                      <small>${esc(spec.radius)}</small>
                    </div>
                    <div class="anatomy-ruler-card">
                      <span>Typography</span>
                      <strong>${esc(spec.typography.split(' · ')[0])}</strong>
                      <small>${esc(spec.typography)}</small>
                    </div>
                    <div class="anatomy-ruler-card">
                      <span>Focus &amp; Secondary</span>
                      <strong>2px Focus Ring</strong>
                      <small>${esc(spec.iconGap)}</small>
                    </div>
                  </div>
                </div>

                <!-- Comprehensive Designer Explanation Section -->
                ${buildDesignerExplanation(config, spec)}

                <!-- Specification & Measurements Table -->
                <div class="spec-wrap">
                  <table class="spec-table anatomy-table">
                    <thead>
                      <tr>
                        <th>Anatomy Part / Dimension</th>
                        <th>Measurement</th>
                        <th>Canonical Token / Selector</th>
                        <th>Sizing Behavior</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${anatomyRowsHtml}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Usage Guidance -->
        <section class="doc-section">
          <h2>Usage &amp; Design Guidance</h2>
          <p>${esc(config.usageGuidance)}</p>
          <div class="spec-grid">
            <div class="spec-card">
              <h4>When to use</h4>
              <p>${esc(config.whenToUse)}</p>
            </div>
            <div class="spec-card">
              <h4>When not to use</h4>
              <p>${esc(config.whenNotToUse)}</p>
            </div>
          </div>
        </section>

        <!-- Variants & Interactive States -->
        <section class="doc-section">
          <h2>Variants &amp; Interactive States</h2>
          <p>Canonical variants and interactive states supported by <code>components/${config.slug}/${config.slug}.css</code>.</p>
          <div class="spec-wrap">
            ${config.variantsTable}
          </div>
        </section>

        <!-- Accessibility Specifications -->
        <section class="doc-section">
          <h2>Accessibility &amp; Keyboard Interaction</h2>
          <p>Strict conformance with W3C WAI-ARIA Authoring Practices Guide (APG) and WCAG 2.2 Level AA.</p>
          <div class="spec-wrap">
            <table class="spec-table">
              <thead><tr><th>Interaction / Key</th><th>Behavior &amp; Compliance Requirement</th></tr></thead>
              <tbody>
                ${config.a11yRows}
              </tbody>
            </table>
          </div>
        </section>

        <!-- Canonical Token Bindings -->
        <section class="doc-section">
          <h2>Canonical Token Bindings</h2>
          <p>Bound strictly to semantic design tokens. Zero primitive color leaks.</p>
          <div class="spec-wrap">
            <table class="spec-table">
              <thead><tr><th>Role / Target</th><th>Custom Property Binding</th><th>Light / Dark Resolved</th></tr></thead>
              <tbody>
                ${config.tokenRows}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </article>
    `;
  }

  // 1. Button
  const buttonHtml = buildComponentView({
    name: 'Button',
    slug: 'button',
    category: 'Form Controls',
    description: 'Tactile 40px pill button with 24px left/right padding, Shade-DS cursor-origin circular hover fill, accessible async loading state, and monochrome primary contrast.',
    element: '<button>',
    previewHtml: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 660px;">
        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
          <button type="button" class="as-button as-button--primary" id="btn-primary">
            <span class="as-button__label">Primary</span>
          </button>
          <button type="button" class="as-button as-button--secondary">
            <span class="as-button__label">Secondary</span>
          </button>
          <button type="button" class="as-button as-button--destructive">
            <span class="as-button__label">Destructive</span>
          </button>
          <button type="button" class="as-button as-button--ghost">
            <span class="as-button__label">Ghost</span>
          </button>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center; padding-top: 12px; border-top: 1px dashed var(--doc-line);">
          <button type="button" class="as-button as-button--primary" data-sim-save="true">
            <span class="as-button__label">Click to Save</span>
          </button>
          <button type="button" class="as-button as-button--secondary" id="aria-target" aria-disabled="true">
            <span class="as-button__label">Focus-retaining disabled</span>
          </button>
          <button type="button" class="as-button as-button--secondary" id="aria-toggle">
            <span class="as-button__label">Enable it</span>
          </button>
        </div>
      </div>
    `,
    codeSnippet: `&lt;!-- Primary Monochrome Pill Action (40px height, 24px horizontal padding) --&gt;
&lt;button type="button" class="as-button as-button--primary"&gt;
  &lt;span class="as-button__label"&gt;Deploy Cluster&lt;/span&gt;
&lt;/button&gt;

&lt;!-- Secondary Outlined Action --&gt;
&lt;button type="button" class="as-button as-button--secondary"&gt;
  &lt;span class="as-button__label"&gt;Cancel&lt;/span&gt;
&lt;/button&gt;

&lt;!-- Destructive &amp; Ghost Actions --&gt;
&lt;button type="button" class="as-button as-button--destructive"&gt;
  &lt;span class="as-button__label"&gt;Terminate Node&lt;/span&gt;
&lt;/button&gt;
&lt;button type="button" class="as-button as-button--ghost"&gt;
  &lt;span class="as-button__label"&gt;Inspect Logs&lt;/span&gt;
&lt;/button&gt;`,
    usageGuidance: 'Buttons trigger immediate actions. Aster buttons feature a 40px height, 24px left and right horizontal padding (--as-space-6), full pill geometry (9999px radius), and a Shade-DS cursor-origin circular hover fill.',
    whenToUse: 'Form submissions, modal confirmations, workflow triggers, and primary commands.',
    whenNotToUse: 'Navigating between pages or documentation sections (use semantic <a> anchor elements).',
    variantsTable: `
      <table class="spec-table" data-matrix="button">
        <thead><tr><th>Variant</th><th>Default</th><th>Hover</th><th>Pressed</th><th>Focus</th><th>Loading</th><th>Disabled</th></tr></thead>
        <tbody></tbody>
      </table>
    `,
    a11yRows: `
      <tr><td>Native Semantics</td><td>Standard <code>&lt;button type="button"&gt;</code> avoids unintended form submissions.</td></tr>
      <tr><td>Keyboard Trigger</td><td>Activated by both <code>Enter</code> and <code>Space</code> keys natively.</td></tr>
      <tr><td>Focus-Retaining Disabled</td><td>Declares <code>aria-disabled="true"</code> to remain in tab order while blocking execution.</td></tr>
      <tr><td>Async Loading</td><td>Sets <code>aria-busy="true"</code>, renders <code>.as-spinner</code>, and blocks duplicate clicks.</td></tr>
    `,
    tokenRows: `
      <tr><td>Primary Fill</td><td><code>--as-semantic-color-interactive-primary</code></td><td>#0f0f0f (Light) / #ffffff (Dark)</td></tr>
      <tr><td>Text on Primary</td><td><code>--as-semantic-color-text-on-primary</code></td><td>#ffffff (Light) / #0f0f0f (Dark)</td></tr>
      <tr><td>Horizontal Padding</td><td><code>--as-space-6</code></td><td>24px left / 24px right</td></tr>
      <tr><td>Control Height</td><td><code>--as-density-control-height</code></td><td>40px</td></tr>
      <tr><td>Pill Radius</td><td><code>--as-radius-full</code></td><td>9999px</td></tr>
    `
  });

  // 2. Input
  const inputHtml = buildComponentView({
    name: 'Input & Form Field',
    slug: 'input',
    category: 'Form Controls',
    description: 'Single-line 44px text input with 4px corner radius (Shade-DS Radius.S), Canvas #121212 background, and double 1px glass glow (zero wireframe outline).',
    element: '<input>',
    previewHtml: `
      <div style="max-width: 440px; width: 100%; display: flex; flex-direction: column; gap: 16px;">
        <div class="as-form-field" id="field-demo-cluster" style="margin-bottom: 0;">
          <label class="as-form-field__label" for="in-ws">Workspace Identifier</label>
          <div class="as-input-box">
            <input class="as-input" type="text" id="in-ws" name="workspace" placeholder="e.g. acme-platform" value="acme-platform" data-validate="slug" aria-describedby="in-ws-help in-ws-err" />
            <button type="button" class="as-input__action" data-clear-for="in-ws" id="btn-in-ws-clear" aria-label="Clear workspace name">
              <svg class="as-icon" aria-hidden="true"><use href="#i-x"/></svg>
            </button>
          </div>
          <p class="as-form-field__helper" id="in-ws-help">Lowercase letters, numbers, and hyphens only.</p>
          <p class="as-form-field__message as-form-field__error" id="in-ws-err" hidden><svg class="as-icon" aria-hidden="true"><use href="#i-alert"/></svg><span class="as-form-field__error-text">Use lowercase letters, numbers, and hyphens only.</span></p>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="as-button as-button--secondary" id="fill-invalid"><span class="as-button__label">Fill Invalid Value</span></button>
          <button type="button" class="as-button as-button--secondary" id="fill-valid"><span class="as-button__label">Fill Valid Value</span></button>
        </div>
      </div>
    `,
    codeSnippet: `&lt;div class="as-form-field"&gt;
  &lt;label class="as-form-field__label" for="ws-name"&gt;Workspace Name&lt;/label&gt;
  &lt;div class="as-input-box"&gt;
    &lt;input class="as-input" type="text" id="ws-name" name="ws-name" data-validate="slug" aria-describedby="ws-name-help ws-name-err" /&gt;
    &lt;button type="button" class="as-input__action" data-clear-for="ws-name" aria-label="Clear workspace name"&gt;
      &lt;svg class="as-icon" aria-hidden="true"&gt;&lt;use href="#i-x"/&gt;&lt;/svg&gt;
    &lt;/button&gt;
  &lt;/div&gt;
  &lt;p class="as-form-field__helper" id="ws-name-help"&gt;Must be unique across your organization.&lt;/p&gt;
  &lt;p class="as-form-field__message as-form-field__error" id="ws-name-err" hidden&gt;&lt;span class="as-form-field__error-text"&gt;&lt;/span&gt;&lt;/p&gt;
&lt;/div&gt;`,
    usageGuidance: 'Form fields collect single-line text input with 44px height, 4px radius, Canvas #121212 background, and double 1px glass glow.',
    whenToUse: 'Names, email addresses, slugs, search queries, API keys, and numeric strings.',
    whenNotToUse: 'Multi-line text (use Textarea) or selecting from predefined options (use Select).',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>State</th><th>Selector</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>Default</td><td><code>.as-input</code></td><td>Standard 44px single-line input with 4px radius (Shade-DS Radius.S)</td></tr>
          <tr><td>Invalid / Error</td><td><code>.as-form-field--error</code></td><td>Critical status glow and visible error message</td></tr>
          <tr><td>Disabled</td><td><code>:disabled</code></td><td>50% opacity, cursor not-allowed, non-editable</td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td>Explicit Labeling</td><td>Direct <code>for="id"</code> linkage guarantees screen reader announcement.</td></tr>
      <tr><td>Error Association</td><td>When invalid, <code>aria-describedby</code> prioritizes the error ID before helper ID.</td></tr>
      <tr><td>Aria Invalid</td><td>Sets <code>aria-invalid="true"</code> dynamically upon validation failure.</td></tr>
    `,
    tokenRows: `
      <tr><td>Input Height</td><td><code>height: 44px</code></td><td>44px (Exact Shade-DS Component Geometry)</td></tr>
      <tr><td>Corner Radius</td><td><code>--as-radius-sm</code></td><td>4px (Shade-DS Radius.S)</td></tr>
      <tr><td>Surface</td><td><code>--as-semantic-color-surface-canvas</code></td><td>#121212 (Dark Canvas) / #ffffff (Light)</td></tr>
      <tr><td>Glass Glow</td><td><code>box-shadow</code></td><td>0 0 1px 0px ..., inset 0 0 1px 0px ... (Zero outline stroke)</td></tr>
      <tr><td>Focus Glow</td><td><code>--as-semantic-color-border-focus</code></td><td>#64b5f6 / #1565c0 (Double 1px Focus Glow)</td></tr>
    `
  });

  // 3. Textarea
  const textareaHtml = buildComponentView({
    name: 'Textarea',
    slug: 'textarea',
    category: 'Form Controls',
    description: 'Multi-line text area supporting dynamic auto-resizing, live character counter synchronization, and 8px corner radius.',
    element: '<textarea>',
    previewHtml: `
      <div class="as-form-field" style="max-width: 440px; width: 100%;">
        <label class="as-form-field__label" for="txt-demo-input">Release Changelog Notes</label>
        <div class="as-textarea-box">
          <textarea class="as-textarea" id="txt-demo-input" maxlength="300" placeholder="Summarize changes included in this deployment...">Rolled out kernel 6.8 with eBPF runtime profiling enabled across worker nodes.</textarea>
          <div class="as-textarea__footer">
            <span class="as-textarea__counter">83 / 300</span>
          </div>
        </div>
      </div>
    `,
    codeSnippet: `&lt;div class="as-form-field"&gt;
  &lt;label class="as-form-field__label" for="deploy-notes"&gt;Release Notes&lt;/label&gt;
  &lt;div class="as-textarea-box"&gt;
    &lt;textarea class="as-textarea" id="deploy-notes" maxlength="300" placeholder="Enter notes..."&gt;&lt;/textarea&gt;
    &lt;div class="as-textarea__footer"&gt;
      &lt;span class="as-textarea__counter"&gt;0 / 300&lt;/span&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;`,
    usageGuidance: 'Textarea provides multi-line entry for long-form descriptions, commit messages, and deployment notes.',
    whenToUse: 'When user input is expected to exceed a single line.',
    whenNotToUse: 'Single-line strings such as emails, slugs, or passwords (use Input).',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>Feature</th><th>Hook</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>Default</td><td><code>.as-textarea</code></td><td>Min-height 96px with vertical resize and 8px radius</td></tr>
          <tr><td>Character Counter</td><td><code>.as-textarea__counter</code></td><td>Live count synchronized on input events</td></tr>
          <tr><td>Auto-Resize</td><td><code>data-auto-resize</code></td><td>Expands height dynamically with content</td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td><code>Tab</code></td><td>Moves focus cleanly into and out of the textarea.</td></tr>
      <tr><td>Explicit Label</td><td>Associated via <code>&lt;label for="id"&gt;</code>.</td></tr>
    `,
    tokenRows: `
      <tr><td>Surface Fill</td><td><code>--as-semantic-color-surface-card</code></td><td>#ffffff / #1e1e1e</td></tr>
      <tr><td>Border (Rest)</td><td><code>--as-semantic-color-border-strong</code></td><td>#777777 / #777777</td></tr>
      <tr><td>Corner Radius</td><td><code>--as-radius-md</code></td><td>8px</td></tr>
    `
  });

  // 4. Select
  const selectHtml = buildComponentView({
    name: 'Select',
    slug: 'select',
    category: 'Form Controls',
    description: 'Native 40px dropdown selection control with 8px corner radius and custom high-contrast chevron indicator.',
    element: '<select>',
    previewHtml: `
      <div class="as-form-field" style="max-width: 360px; width: 100%;">
        <label class="as-form-field__label" for="sel-demo-input">Primary Compute Region</label>
        <div class="as-select-box">
          <select class="as-select" id="sel-demo-input" name="region">
            <option value="eu-west-1" selected>Europe (Ireland) — eu-west-1</option>
            <option value="eu-central-1">Europe (Frankfurt) — eu-central-1</option>
            <option value="us-east-1">US East (N. Virginia) — us-east-1</option>
            <option value="ap-southeast-1">Asia Pacific (Singapore) — ap-southeast-1</option>
          </select>
          <svg class="as-select-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 6 8 10 12 6"></polyline></svg>
        </div>
      </div>
    `,
    codeSnippet: `&lt;div class="as-form-field"&gt;
  &lt;label class="as-form-field__label" for="select-region"&gt;Region&lt;/label&gt;
  &lt;div class="as-select-box"&gt;
    &lt;select class="as-select" id="select-region"&gt;
      &lt;option value="eu-west-1" selected&gt;Europe (Ireland)&lt;/option&gt;
      &lt;option value="us-east-1"&gt;US East (N. Virginia)&lt;/option&gt;
    &lt;/select&gt;
    &lt;svg class="as-select-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"&gt;&lt;polyline points="4 6 8 10 12 6"&gt;&lt;/polyline&gt;&lt;/svg&gt;
  &lt;/div&gt;
&lt;/div&gt;`,
    usageGuidance: 'Select controls enable choosing a single option from 4 or more predefined choices.',
    whenToUse: 'Selecting regions, roles, or categories from a predefined list.',
    whenNotToUse: '2–3 options that benefit from immediate visibility (use Radio Group).',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>State</th><th>Height</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>Default</td><td>40px</td><td>Standard form control height with 8px radius</td></tr>
          <tr><td>Disabled</td><td>40px</td><td>Unmodifiable state with 50% opacity</td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td>Native Picker</td><td>Uses native OS selection dialogs and Up/Down arrow cycling.</td></tr>
      <tr><td>Decorative Chevron</td><td>SVG chevron declares <code>aria-hidden="true"</code>.</td></tr>
    `,
    tokenRows: `
      <tr><td>Control Height</td><td><code>--as-density-control-height</code></td><td>40px</td></tr>
      <tr><td>Corner Radius</td><td><code>--as-radius-md</code></td><td>8px</td></tr>
      <tr><td>Border Strong</td><td><code>--as-semantic-color-border-strong</code></td><td>#777777 / #777777</td></tr>
    `
  });

  // 5. Checkbox
  const checkboxHtml = buildComponentView({
    name: 'Checkbox',
    slug: 'checkbox',
    category: 'Form Controls',
    description: 'Accessible selection control with 28px touch target, 18px visual box, 4px corner radius, and checked/indeterminate states.',
    element: '<input type="checkbox">',
    previewHtml: `
      <div style="display: flex; flex-direction: column; gap: var(--as-space-3);">
        <label class="as-checkbox-field">
          <span class="as-checkbox"><input type="checkbox" class="as-checkbox-input" checked></span>
          <span class="as-checkbox-field__content">
            <span class="as-checkbox-field__label">Enforce zero-trust network ingress</span>
            <span class="as-checkbox-field__description">Drop all unauthenticated inter-pod packets.</span>
          </span>
        </label>
        <label class="as-checkbox-field">
          <span class="as-checkbox"><input type="checkbox" class="as-checkbox-input" data-indeterminate="true"></span>
          <span class="as-checkbox-field__content">
            <span class="as-checkbox-field__label">Multi-zone telemetry collection</span>
            <span class="as-checkbox-field__description">Active on 2 of 3 availability zones.</span>
          </span>
        </label>
      </div>
    `,
    codeSnippet: `&lt;label class="as-checkbox-field"&gt;
  &lt;span class="as-checkbox"&gt;
    &lt;input type="checkbox" class="as-checkbox-input" checked&gt;
  &lt;/span&gt;
  &lt;span class="as-checkbox-field__content"&gt;
    &lt;span class="as-checkbox-field__label"&gt;Enforce Zero-Trust Ingress&lt;/span&gt;
    &lt;span class="as-checkbox-field__description"&gt;Drop unauthenticated packets.&lt;/span&gt;
  &lt;/span&gt;
&lt;/label&gt;`,
    usageGuidance: 'Checkboxes allow selecting one or more independent options or toggling a parent tri-state group.',
    whenToUse: 'Multi-select lists, table row selection, or boolean acknowledgments.',
    whenNotToUse: 'Mutually exclusive choices (use Radio Group) or instant system toggles (use Switch).',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>State</th><th>Visual Indicator</th><th>ARIA State</th></tr></thead>
        <tbody>
          <tr><td>Unchecked</td><td>18x18px card surface with 4px radius and strong border</td><td><code>checked = false</code></td></tr>
          <tr><td>Checked</td><td>Monochrome primary fill with high-contrast checkmark</td><td><code>checked = true</code></td></tr>
          <tr><td>Indeterminate</td><td>Monochrome primary fill with horizontal dash</td><td><code>aria-checked="mixed"</code></td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td><code>Space</code></td><td>Toggles checked state natively.</td></tr>
      <tr><td>Target Size</td><td>28x28px hit target exceeds WCAG 2.5.8 24px minimum.</td></tr>
    `,
    tokenRows: `
      <tr><td>Checked Fill</td><td><code>--as-semantic-color-interactive-primary</code></td><td>#0f0f0f / #ffffff</td></tr>
      <tr><td>Corner Radius</td><td><code>--as-radius-sm</code></td><td>4px</td></tr>
    `
  });

  // 6. Radio Group
  const radioHtml = buildComponentView({
    name: 'Radio Group',
    slug: 'radio',
    category: 'Form Controls',
    description: 'Mutually exclusive option sets wrapped in semantic fieldsets with 28px touch targets and concentric selection dots.',
    element: '<fieldset> + <input type="radio">',
    previewHtml: `
      <fieldset class="as-radio-group">
        <legend class="as-radio-group__legend">Deployment Canary Strategy</legend>
        <label class="as-radio-field">
          <span class="as-radio"><input type="radio" name="pg-radio-showcase" class="as-radio-input" checked></span>
          <span class="as-radio-field__content">
            <span class="as-radio-field__label">Rolling Update (Recommended)</span>
            <span class="as-radio-field__description">Replace worker pods progressively with zero downtime.</span>
          </span>
        </label>
        <label class="as-radio-field">
          <span class="as-radio"><input type="radio" name="pg-radio-showcase" class="as-radio-input"></span>
          <span class="as-radio-field__content">
            <span class="as-radio-field__label">Blue/Green Cutover</span>
            <span class="as-radio-field__description">Spin up secondary cluster and switch DNS routing.</span>
          </span>
        </label>
      </fieldset>
    `,
    codeSnippet: `&lt;fieldset class="as-radio-group"&gt;
  &lt;legend class="as-radio-group__legend"&gt;Rollout Strategy&lt;/legend&gt;
  &lt;label class="as-radio-field"&gt;
    &lt;span class="as-radio"&gt;&lt;input type="radio" name="strategy" class="as-radio-input" checked&gt;&lt;/span&gt;
    &lt;span class="as-radio-field__content"&gt;
      &lt;span class="as-radio-field__label"&gt;Rolling Update&lt;/span&gt;
    &lt;/span&gt;
  &lt;/label&gt;
&lt;/fieldset&gt;`,
    usageGuidance: 'Radio groups allow selecting exactly one option from a visible set of mutually exclusive choices.',
    whenToUse: '2–5 mutually exclusive options that should all be visible at once.',
    whenNotToUse: 'Multi-select options (use Checkbox) or 6+ compact options (use Select).',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>State</th><th>Visual Presentation</th></tr></thead>
        <tbody>
          <tr><td>Selected</td><td>18px outer circle with 8px concentric primary dot</td></tr>
          <tr><td>Unselected</td><td>18px circle with strong border</td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td>Arrow Keys</td><td>Moves selection and focus between radios in the group.</td></tr>
      <tr><td>Fieldset &amp; Legend</td><td>Grouped via <code>&lt;fieldset&gt;</code> and labeled by <code>&lt;legend&gt;</code>.</td></tr>
    `,
    tokenRows: `
      <tr><td>Selected Dot</td><td><code>--as-semantic-color-interactive-primary</code></td><td>#0f0f0f / #ffffff</td></tr>
      <tr><td>Circle Radius</td><td><code>--as-radius-full</code></td><td>9999px</td></tr>
    `
  });

  // 7. Switch
  const switchHtml = buildComponentView({
    name: 'Switch',
    slug: 'switch',
    category: 'Form Controls',
    description: 'Tactile 44x24px binary toggle switch communicating immediate on/off system preferences.',
    element: '<input type="checkbox" role="switch">',
    previewHtml: `
      <div style="display: flex; flex-direction: column; gap: var(--as-space-4); max-width: 420px; width: 100%;">
        <label class="as-switch-field">
          <span class="as-switch">
            <input type="checkbox" role="switch" class="as-switch-input" checked>
            <span class="as-switch-track"><span class="as-switch-thumb"></span></span>
          </span>
          <span class="as-switch-field__content">
            <span class="as-switch-field__label">Automatic Node Eviction</span>
            <span class="as-switch-field__description">Evict pods if memory saturation exceeds 92%.</span>
          </span>
        </label>
        <label class="as-switch-field">
          <span class="as-switch">
            <input type="checkbox" role="switch" class="as-switch-input">
            <span class="as-switch-track"><span class="as-switch-thumb"></span></span>
          </span>
          <span class="as-switch-field__content">
            <span class="as-switch-field__label">Maintenance Window Locking</span>
            <span class="as-switch-field__description">Block non-critical automated updates.</span>
          </span>
        </label>
      </div>
    `,
    codeSnippet: `&lt;label class="as-switch-field"&gt;
  &lt;span class="as-switch"&gt;
    &lt;input type="checkbox" role="switch" class="as-switch-input" checked&gt;
    &lt;span class="as-switch-track"&gt;&lt;span class="as-switch-thumb"&gt;&lt;/span&gt;&lt;/span&gt;
  &lt;/span&gt;
  &lt;span class="as-switch-field__content"&gt;
    &lt;span class="as-switch-field__label"&gt;Automatic Node Eviction&lt;/span&gt;
  &lt;/span&gt;
&lt;/label&gt;`,
    usageGuidance: 'Switches toggle standalone system settings that take effect immediately without form submission.',
    whenToUse: 'Instantaneous preference toggles (e.g. dark mode, auto-eviction, notifications).',
    whenNotToUse: 'Options inside a form requiring a Submit button (use Checkbox).',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>State</th><th>Track Fill</th><th>Thumb Position</th></tr></thead>
        <tbody>
          <tr><td>Checked (On)</td><td>Monochrome primary fill (<code>#0f0f0f</code> / <code>#ffffff</code>)</td><td>Translated +20px right</td></tr>
          <tr><td>Unchecked (Off)</td><td>Muted surface fill (<code>#eeeeee</code> / <code>#333333</code>)</td><td>Rest left (2px inset)</td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td>Role Switch</td><td>Declares <code>role="switch"</code> so assistive tech announces on/off state.</td></tr>
      <tr><td><code>Space</code></td><td>Toggles switch state.</td></tr>
    `,
    tokenRows: `
      <tr><td>Active Track</td><td><code>--as-semantic-color-interactive-primary</code></td><td>#0f0f0f / #ffffff</td></tr>
      <tr><td>Active Thumb</td><td><code>--as-semantic-color-text-on-primary</code></td><td>#ffffff / #0f0f0f</td></tr>
    `
  });

  // 8. Slider
  const sliderHtml = buildComponentView({
    name: 'Slider',
    slug: 'slider',
    category: 'Form Controls',
    description: 'Numeric range input with dynamically synchronized track progress and tabular value display.',
    element: '<input type="range">',
    previewHtml: `
      <div class="as-slider-field" style="max-width: 420px; width: 100%;">
        <div class="as-slider-field__header">
          <label class="as-slider-field__label" for="sld-showcase-input">Cluster Memory Allocation</label>
          <span class="as-slider-field__value">75%</span>
        </div>
        <div class="as-slider-box">
          <input type="range" class="as-slider" id="sld-showcase-input" min="10" max="100" value="75">
        </div>
      </div>
    `,
    codeSnippet: `&lt;div class="as-slider-field"&gt;
  &lt;div class="as-slider-field__header"&gt;
    &lt;label class="as-slider-field__label" for="mem-slider"&gt;Memory Limit&lt;/label&gt;
    &lt;span class="as-slider-field__value"&gt;75%&lt;/span&gt;
  &lt;/div&gt;
  &lt;div class="as-slider-box"&gt;
    &lt;input type="range" class="as-slider" id="mem-slider" min="10" max="100" value="75"&gt;
  &lt;/div&gt;
&lt;/div&gt;`,
    usageGuidance: 'Sliders adjust continuous or stepped numeric values within a bounded range.',
    whenToUse: 'Resource thresholds, capacity percentages, audio/display levels.',
    whenNotToUse: 'Exact arbitrary numbers where typing is faster (use Input type="number").',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>State</th><th>Track Height</th><th>Thumb</th></tr></thead>
        <tbody>
          <tr><td>Default</td><td>6px pill track with live <code>--_progress</code> fill</td><td>20x20px circle</td></tr>
          <tr><td>Disabled</td><td>50% opacity, pointer-events blocked</td><td>Static</td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td>Arrow Keys</td><td>Increments or decrements by step value.</td></tr>
      <tr><td>Home / End</td><td>Jumps to min or max bound.</td></tr>
    `,
    tokenRows: `
      <tr><td>Filled Track</td><td><code>--as-semantic-color-interactive-primary</code></td><td>#0f0f0f / #ffffff</td></tr>
      <tr><td>Unfilled Track</td><td><code>--as-semantic-color-surface-muted</code></td><td>#eeeeee / #333333</td></tr>
    `
  });

  // 9. Data Table
  const tableHtml = buildComponentView({
    name: 'Data Table',
    slug: 'table',
    category: 'Data Display',
    description: 'Structured tabular data display with 44px rows, column sorting, multi-row indeterminate selection, lifecycle states, and keyboard overflow scrolling.',
    element: '<table>',
    previewHtml: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div class="seg" data-index="0" style="--n: 4; --i: 0;" id="seg-tbl-state">
            <span class="seg__thumb" aria-hidden="true"></span>
            <button type="button" data-state="ready" aria-pressed="true">Ready</button>
            <button type="button" data-state="loading" aria-pressed="false">Loading</button>
            <button type="button" data-state="empty" aria-pressed="false">Empty</button>
            <button type="button" data-state="error" aria-pressed="false">Error</button>
          </div>
          <button type="button" class="as-button as-button--secondary" id="tbl-bulk" hidden><span class="as-button__label">Restart 0 selected</span></button>
        </div>

        <div class="as-table-container" id="table-container-demo">
          <div class="as-table-scroll" id="table-scroll-overflow" style="max-height: 380px;">
            <table class="as-table as-table--interactive" id="tbl-main">
              <caption class="as-sr-only">Cluster Infrastructure Workloads</caption>
              <thead>
                <tr>
                  <th scope="col" class="as-table__th as-table__th--check">
                    <span class="as-checkbox">
                      <input type="checkbox" class="as-checkbox-input" id="tbl-all" aria-label="Select all rows" />
                    </span>
                  </th>
                  <th scope="col" class="as-table__th" aria-sort="none">
                    <button type="button" class="as-table__sort" data-sort-key="node">
                      <span>Node</span>
                      <svg class="as-table__sort-icon" viewBox="0 0 10 14" aria-hidden="true"><path class="sort-up" d="M5 1L9 6H1L5 1Z"/><path class="sort-down" d="M5 13L1 8H9L5 13Z"/></svg>
                    </button>
                  </th>
                  <th scope="col" class="as-table__th" aria-sort="none">
                    <button type="button" class="as-table__sort" data-sort-key="region">
                      <span>Region</span>
                      <svg class="as-table__sort-icon" viewBox="0 0 10 14" aria-hidden="true"><path class="sort-up" d="M5 1L9 6H1L5 1Z"/><path class="sort-down" d="M5 13L1 8H9L5 13Z"/></svg>
                    </button>
                  </th>
                  <th scope="col" class="as-table__th" aria-sort="none">
                    <button type="button" class="as-table__sort" data-sort-key="status">
                      <span>Status</span>
                      <svg class="as-table__sort-icon" viewBox="0 0 10 14" aria-hidden="true"><path class="sort-up" d="M5 1L9 6H1L5 1Z"/><path class="sort-down" d="M5 13L1 8H9L5 13Z"/></svg>
                    </button>
                  </th>
                  <th scope="col" class="as-table__th as-table__th--num" aria-sort="none">
                    <button type="button" class="as-table__sort" data-sort-key="latency">
                      <span>Latency</span>
                      <svg class="as-table__sort-icon" viewBox="0 0 10 14" aria-hidden="true"><path class="sort-up" d="M5 1L9 6H1L5 1Z"/><path class="sort-down" d="M5 13L1 8H9L5 13Z"/></svg>
                    </button>
                  </th>
                  <th scope="col" class="as-table__th as-table__th--num" aria-sort="none">
                    <button type="button" class="as-table__sort" data-sort-key="cost">
                      <span>Cost / mo</span>
                      <svg class="as-table__sort-icon" viewBox="0 0 10 14" aria-hidden="true"><path class="sort-up" d="M5 1L9 6H1L5 1Z"/><path class="sort-down" d="M5 13L1 8H9L5 13Z"/></svg>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody id="tbl-body"></tbody>
            </table>
          </div>
          <div class="as-table-footer" id="tbl-foot">0 of 7 selected</div>
        </div>
      </div>
    `,
    codeSnippet: `&lt;div class="as-table-container"&gt;
  &lt;div class="as-table-scroll"&gt;
    &lt;table class="as-table as-table--interactive"&gt;
      &lt;caption class="as-sr-only"&gt;Active Deployments&lt;/caption&gt;
      &lt;thead&gt;
        &lt;tr&gt;
          &lt;th scope="col" class="as-table__th"&gt;Service&lt;/th&gt;
          &lt;th scope="col" class="as-table__th"&gt;Region&lt;/th&gt;
          &lt;th scope="col" class="as-table__th as-table__th--num"&gt;Latency&lt;/th&gt;
        &lt;/tr&gt;
      &lt;/thead&gt;
      &lt;tbody&gt;
        &lt;tr class="as-table__row"&gt;
          &lt;th scope="row" class="as-table__cell as-table__cell--primary"&gt;api-gateway&lt;/th&gt;
          &lt;td class="as-table__cell"&gt;us-east-1&lt;/td&gt;
          &lt;td class="as-table__cell as-table__cell--num"&gt;1.24 ms&lt;/td&gt;
        &lt;/tr&gt;
      &lt;/tbody&gt;
    &lt;/table&gt;
  &lt;/div&gt;
&lt;/div&gt;`,
    usageGuidance: 'Data tables organize multi-attribute records across 44px rows with sortable column headers and multi-row selection.',
    whenToUse: 'Datasets with comparable attributes such as server nodes, logs, and transactions.',
    whenNotToUse: 'Simple single-column lists or page layout grids.',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>Feature</th><th>Selector</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>Standard Table</td><td><code>.as-table</code></td><td>44px row height, 16px horizontal cell padding</td></tr>
          <tr><td>Interactive Rows</td><td><code>.as-table--interactive</code></td><td>Hover and <code>[data-selected]</code> row highlighting</td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td>Caption &amp; Scopes</td><td>Includes <code>&lt;caption&gt;</code>, <code>scope="col"</code>, and <code>scope="row"</code>.</td></tr>
      <tr><td>Sort Cycling</td><td>Updates <code>aria-sort="ascending|descending|none"</code> on header cells.</td></tr>
      <tr><td>Overflow Region</td><td>Scroll container receives <code>tabindex="0"</code> and <code>role="region"</code> when overflowing.</td></tr>
    `,
    tokenRows: `
      <tr><td>Row Height</td><td><code>--as-density-table-row-height</code></td><td>44px</td></tr>
      <tr><td>Header Surface</td><td><code>--as-semantic-color-surface-subtle</code></td><td>#f5f5f5 / #1e1e1e</td></tr>
      <tr><td>Row Divider</td><td><code>--as-semantic-color-border-subtle</code></td><td>#e0e0e0 / #333333</td></tr>
    `
  });

  // 10. Badge
  const badgeHtml = buildComponentView({
    name: 'Badge',
    slug: 'badge',
    category: 'Data Display',
    description: '24px status pills pairing full capsule geometry with semantic status colors and optional 6px dot indicators.',
    element: '<span>',
    previewHtml: `
      <div style="display: flex; flex-wrap: wrap; gap: var(--as-space-3); align-items: center;">
        <span class="as-badge as-badge--success"><span class="as-badge__dot"></span>Healthy</span>
        <span class="as-badge as-badge--warning"><span class="as-badge__dot"></span>Rebalancing</span>
        <span class="as-badge as-badge--critical"><span class="as-badge__dot"></span>Degraded</span>
        <span class="as-badge as-badge--info">v2.4.1</span>
        <span class="as-badge as-badge--muted">Internal</span>
      </div>
    `,
    codeSnippet: `&lt;span class="as-badge as-badge--success"&gt;
  &lt;span class="as-badge__dot"&gt;&lt;/span&gt;Healthy
&lt;/span&gt;
&lt;span class="as-badge as-badge--warning"&gt;
  &lt;span class="as-badge__dot"&gt;&lt;/span&gt;Rebalancing
&lt;/span&gt;
&lt;span class="as-badge as-badge--critical"&gt;Degraded&lt;/span&gt;`,
    usageGuidance: 'Badges communicate non-interactive status, health states, or version tags.',
    whenToUse: 'Status cells in tables, card headers, and metadata tags.',
    whenNotToUse: 'Interactive clickable actions (use Button).',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>Variant</th><th>Class</th><th>Semantics</th></tr></thead>
        <tbody>
          <tr><td>Success</td><td><code>.as-badge--success</code> / <code>--active</code></td><td>Healthy, online, active</td></tr>
          <tr><td>Warning</td><td><code>.as-badge--warning</code> / <code>--pending</code></td><td>Rebalancing, pending</td></tr>
          <tr><td>Critical</td><td><code>.as-badge--critical</code> / <code>--error</code></td><td>Degraded, offline, failed</td></tr>
          <tr><td>Info / Muted</td><td><code>.as-badge--info</code> / <code>--muted</code></td><td>Version tags, neutral labels</td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td>Non-Color-Alone</td><td>Conveys state via explicit text labels (WCAG 1.4.1).</td></tr>
      <tr><td>Contrast</td><td>Passes 4.5:1 text contrast in both themes.</td></tr>
    `,
    tokenRows: `
      <tr><td>Success Text</td><td><code>--as-semantic-color-status-success-text</code></td><td>#147244 / #34d399</td></tr>
      <tr><td>Warning Text</td><td><code>--as-semantic-color-status-warning-text</code></td><td>#92400e / #fbbf24</td></tr>
      <tr><td>Critical Text</td><td><code>--as-semantic-color-status-critical-text</code></td><td>#b91c1c / #f87171</td></tr>
    `
  });

  // 11. Progress
  const progressHtml = buildComponentView({
    name: 'Progress',
    slug: 'progress',
    category: 'Data Display',
    description: 'Accessible 8px progress tracks communicating determinate completion percentages or indeterminate activity.',
    element: '<div role="progressbar">',
    previewHtml: `
      <div style="display: flex; flex-direction: column; gap: var(--as-space-4); width: 100%; max-width: 440px;">
        <div class="as-progress-field">
          <div class="as-progress-field__header">
            <span class="as-progress-field__label">Volume Snapshot Compression</span>
            <span class="as-progress-field__value">68%</span>
          </div>
          <div class="as-progress" role="progressbar" aria-valuenow="68" aria-valuemin="0" aria-valuemax="100" aria-label="Volume Snapshot Compression">
            <span class="as-progress__bar" style="width: 68%;"></span>
          </div>
        </div>
        <div class="as-progress-field">
          <div class="as-progress-field__header">
            <span class="as-progress-field__label">Syncing Cryptographic Hash Table</span>
            <span class="as-progress-field__value">Indeterminate</span>
          </div>
          <div class="as-progress as-progress--indeterminate" role="progressbar" aria-label="Syncing hash table">
            <span class="as-progress__bar"></span>
          </div>
        </div>
      </div>
    `,
    codeSnippet: `&lt;!-- Determinate Progress --&gt;
&lt;div class="as-progress" role="progressbar" aria-valuenow="68" aria-valuemin="0" aria-valuemax="100" aria-label="Compression"&gt;
  &lt;span class="as-progress__bar" style="width: 68%;"&gt;&lt;/span&gt;
&lt;/div&gt;

&lt;!-- Indeterminate Progress --&gt;
&lt;div class="as-progress as-progress--indeterminate" role="progressbar" aria-label="Syncing"&gt;
  &lt;span class="as-progress__bar"&gt;&lt;/span&gt;
&lt;/div&gt;`,
    usageGuidance: 'Progress bars indicate completion percentage or ongoing background processing.',
    whenToUse: 'Migrations, uploads, snapshots, and multi-step jobs.',
    whenNotToUse: 'Inline button loading states (use Button spinner).',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>Mode</th><th>Class</th><th>ARIA Attributes</th></tr></thead>
        <tbody>
          <tr><td>Determinate</td><td><code>.as-progress</code></td><td><code>aria-valuenow</code>, <code>aria-valuemin</code>, <code>aria-valuemax</code></td></tr>
          <tr><td>Indeterminate</td><td><code>.as-progress--indeterminate</code></td><td>Omits <code>aria-valuenow</code></td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td>Progressbar Role</td><td>Declares <code>role="progressbar"</code> and accessible label.</td></tr>
      <tr><td>Reduced Motion</td><td>Indeterminate animation collapses to static bar under reduced motion.</td></tr>
    `,
    tokenRows: `
      <tr><td>Fill Bar</td><td><code>--as-semantic-color-interactive-primary</code></td><td>#0f0f0f / #ffffff</td></tr>
      <tr><td>Track Surface</td><td><code>--as-semantic-color-surface-muted</code></td><td>#eeeeee / #333333</td></tr>
    `
  });

  // 12. Skeleton
  const skeletonHtml = buildComponentView({
    name: 'Skeleton',
    slug: 'skeleton',
    category: 'Data Display',
    description: 'Screen-reader-suppressed loading placeholders with smooth shimmer wave animation.',
    element: '<div aria-hidden="true">',
    previewHtml: `
      <div style="display: flex; flex-direction: column; gap: var(--as-space-3); width: 100%; max-width: 380px;" aria-busy="true">
        <div style="display: flex; align-items: center; gap: var(--as-space-3);">
          <div class="as-skeleton as-skeleton--avatar" aria-hidden="true" style="width: 40px; height: 40px;"></div>
          <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
            <div class="as-skeleton as-skeleton--text" aria-hidden="true" style="width: 60%;"></div>
            <div class="as-skeleton as-skeleton--text" aria-hidden="true" style="width: 40%;"></div>
          </div>
        </div>
        <div class="as-skeleton as-skeleton--text" aria-hidden="true" style="width: 100%; height: 64px;"></div>
      </div>
    `,
    codeSnippet: `&lt;div aria-busy="true"&gt;
  &lt;div class="as-skeleton as-skeleton--avatar" aria-hidden="true" style="width: 40px; height: 40px;"&gt;&lt;/div&gt;
  &lt;div class="as-skeleton as-skeleton--text" aria-hidden="true" style="width: 80%;"&gt;&lt;/div&gt;
  &lt;div class="as-skeleton as-skeleton--text" aria-hidden="true" style="width: 50%;"&gt;&lt;/div&gt;
&lt;/div&gt;`,
    usageGuidance: 'Skeletons preserve layout geometry while asynchronous content loads.',
    whenToUse: 'Initial card, list, or table loading states.',
    whenNotToUse: 'Fast interactions under 200ms.',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>Shape</th><th>Selector</th><th>Radius</th></tr></thead>
        <tbody>
          <tr><td>Text Line</td><td><code>.as-skeleton--text</code></td><td>4px (<code>--as-radius-sm</code>)</td></tr>
          <tr><td>Avatar Circle</td><td><code>.as-skeleton--avatar</code></td><td>9999px (<code>--as-radius-full</code>)</td></tr>
          <tr><td>Block</td><td><code>.as-skeleton</code></td><td>8px (<code>--as-radius-md</code>)</td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td>Screen Reader Shield</td><td>Each placeholder sets <code>aria-hidden="true"</code> while parent sets <code>aria-busy="true"</code>.</td></tr>
    `,
    tokenRows: `
      <tr><td>Base Fill</td><td><code>--as-semantic-color-surface-subtle</code></td><td>#f5f5f5 / #1e1e1e</td></tr>
      <tr><td>Shimmer Highlight</td><td><code>--as-semantic-color-surface-muted</code></td><td>#eeeeee / #333333</td></tr>
    `
  });

  // 13. Alert
  const alertHtml = buildComponentView({
    name: 'Alert',
    slug: 'alert',
    category: 'Feedback & Status',
    description: 'Dismissible status banners with 8px radius, Shade-DS status surface, double 1px glass glow, and 12px solid red dot dismiss control.',
    element: '<div role="region|alert">',
    previewHtml: `
      <div style="display: flex; flex-direction: column; gap: var(--as-space-3); width: 100%; max-width: 540px;">
        <div class="as-alert as-alert--warning" role="region" aria-labelledby="al-w-title">
          <svg class="as-alert__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2 L14 13 L2 13 Z"></path><line x1="8" y1="6" x2="8" y2="9"></line><circle cx="8" cy="11" r="0.75" fill="currentColor"></circle></svg>
          <div class="as-alert__content">
            <div class="as-alert__title" id="al-w-title">Scheduled Rolling Kernel Upgrade</div>
            <div class="as-alert__description">Node pool eu-west-1a will drain active pods in 45 minutes. Click the red dot button to dismiss.</div>
          </div>
          <button type="button" class="as-alert__close" aria-label="Dismiss alert"></button>
        </div>
      </div>
    `,
    codeSnippet: `&lt;div class="as-alert as-alert--warning" role="region" aria-labelledby="alert-title"&gt;
  &lt;svg class="as-alert__icon" viewBox="0 0 16 16" aria-hidden="true"&gt;...&lt;/svg&gt;
  &lt;div class="as-alert__content"&gt;
    &lt;div class="as-alert__title" id="alert-title"&gt;Maintenance Notice&lt;/div&gt;
    &lt;div class="as-alert__description"&gt;Worker node drain initiated.&lt;/div&gt;
  &lt;/div&gt;
  &lt;button type="button" class="as-alert__close" aria-label="Dismiss alert"&gt;&lt;/button&gt;
&lt;/div&gt;`,
    usageGuidance: 'Alerts present prominent in-page notices with Shade-DS status surfaces, zero wireframe outlines, and a 12px solid red dot dismiss button (.as-alert__close) with kinetic hover scaling.',
    whenToUse: 'Contextual system warnings, maintenance notices, or error summaries.',
    whenNotToUse: 'Transient floating confirmations (use Toast).',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>Variant</th><th>Selector</th><th>Semantics</th></tr></thead>
        <tbody>
          <tr><td>Warning</td><td><code>.as-alert--warning</code></td><td>Pre-emptive maintenance or threshold notices</td></tr>
          <tr><td>Critical</td><td><code>.as-alert--critical</code></td><td>Blocking system errors or degraded clusters</td></tr>
          <tr><td>Success</td><td><code>.as-alert--success</code></td><td>Completed provisioning or migration</td></tr>
          <tr><td>Info</td><td><code>.as-alert--info</code></td><td>General advisory guidance</td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td>Role Region / Alert</td><td>Uses <code>role="region"</code> for static notices and <code>role="alert"</code> for urgent errors.</td></tr>
      <tr><td>Red Dot Close Button</td><td>12px solid red dot with <code>aria-label="Dismiss alert"</code> and 2px focus ring.</td></tr>
    `,
    tokenRows: `
      <tr><td>Corner Radius</td><td><code>--as-radius-md</code></td><td>8px</td></tr>
      <tr><td>Warning Surface</td><td><code>--as-semantic-color-surface-warning</code></td><td>#2c1f04 (Dark) / #fff8e1 (Light)</td></tr>
      <tr><td>Warning Text</td><td><code>--as-semantic-color-status-warning-text</code></td><td>#ff9800 (Dark) / #b05a00 (Light)</td></tr>
      <tr><td>Close Red Dot</td><td><code>.as-alert__close</code></td><td>12px circle (#ff453a dark / #c5221f light)</td></tr>
    `
  });

  // 14. Tooltip
  const tooltipHtml = buildComponentView({
    name: 'Tooltip',
    slug: 'tooltip',
    category: 'Feedback & Status',
    description: 'Contextual micro-copy bubble with 4px corner radius adhering to WCAG 2.2 SC 1.4.13 with Escape dismissal.',
    element: '<div role="tooltip">',
    previewHtml: `
      <div style="display: flex; gap: var(--as-space-5); align-items: center; justify-content: center;">
        <div class="as-tooltip-trigger">
          <button type="button" class="as-button as-button--secondary">
            <span class="as-button__label">Snapshot Volume</span>
          </button>
          <div class="as-tooltip" role="tooltip">Instant cryptographic volume snapshot</div>
        </div>
        <div class="as-tooltip-trigger">
          <button type="button" class="as-button as-button--ghost">
            <span class="as-button__label">Help Guide</span>
          </button>
          <div class="as-tooltip" role="tooltip">View automated failover documentation</div>
        </div>
      </div>
    `,
    codeSnippet: `&lt;div class="as-tooltip-trigger"&gt;
  &lt;button type="button" class="as-button as-button--secondary" aria-describedby="tip-snap"&gt;
    &lt;span class="as-button__label"&gt;Snapshot Volume&lt;/span&gt;
  &lt;/button&gt;
  &lt;div class="as-tooltip" id="tip-snap" role="tooltip"&gt;
    Instant cryptographic volume snapshot
  &lt;/div&gt;
&lt;/div&gt;`,
    usageGuidance: 'Tooltips display brief clarifying text on pointer hover or keyboard focus.',
    whenToUse: 'Clarifying icon buttons or terse technical abbreviations.',
    whenNotToUse: 'Interactive content or buttons inside the floating panel (use Popover).',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>Trigger</th><th>Behavior</th></tr></thead>
        <tbody>
          <tr><td>Hover &amp; Focus</td><td>Reveals tooltip bubble 8px above trigger</td></tr>
          <tr><td>Escape Key</td><td>Dismisses tooltip immediately without moving focus</td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td>WCAG 2.2 SC 1.4.13</td><td>Dismissible via <code>Escape</code>, hoverable, and persistent while focused.</td></tr>
    `,
    tokenRows: `
      <tr><td>Background</td><td><code>--as-semantic-color-text-default</code></td><td>#121212 / #e0e0e0</td></tr>
      <tr><td>Corner Radius</td><td><code>--as-radius-sm</code></td><td>4px</td></tr>
    `
  });

  // 15. Toast
  const toastHtml = buildComponentView({
    name: 'Toast',
    slug: 'toast',
    category: 'Feedback & Status',
    description: 'Ephemeral floating notifications injected into a polite live region with Shade-DS 12px red dot close controls.',
    element: 'showToast() + <div role="status">',
    previewHtml: `
      <div style="display: flex; flex-wrap: wrap; gap: var(--as-space-3); justify-content: center;">
        <button type="button" class="as-button as-button--primary" data-toast-trigger data-toast-variant="success" data-toast-title="Cluster Rebalanced" data-toast-message="Workloads successfully distributed across 3 AZs.">
          <span class="as-button__label">Spawn Success Toast</span>
        </button>
        <button type="button" class="as-button as-button--destructive" data-toast-trigger data-toast-variant="critical" data-toast-title="Pod Cordoned" data-toast-message="Node worker-02 memory exceeded threshold.">
          <span class="as-button__label">Spawn Critical Toast</span>
        </button>
      </div>
    `,
    codeSnippet: `import { showToast } from '/dist/js/aster.js';

// Spawn accessible notification with Shade-DS 12px red dot close button
showToast({
  title: 'Cluster Rebalanced',
  message: 'Workloads distributed across 3 availability zones.',
  variant: 'success', // 'success' | 'warning' | 'critical' | 'info'
  duration: 4000
});`,
    usageGuidance: 'Toasts provide non-disruptive confirmation of background actions and include a 12px Shade-DS solid red dot dismiss button (.as-toast__close).',
    whenToUse: 'Confirming saved settings, queued deployments, or background syncs.',
    whenNotToUse: 'Blocking errors requiring immediate user input (use Dialog).',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>Variant</th><th>Status Surface</th><th>ARIA Role</th></tr></thead>
        <tbody>
          <tr><td>Success / Warning / Info</td><td>Shade-DS status surface with double 1px glass glow</td><td><code>role="status"</code></td></tr>
          <tr><td>Critical</td><td>Critical status surface with double 1px glass glow</td><td><code>role="alert"</code></td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td>Polite Live Region</td><td>Injected into <code>.as-toast-container</code> without stealing keyboard focus.</td></tr>
      <tr><td>Red Dot Close</td><td>Includes 12px solid <code>.as-toast__close</code> red dot button with focus ring.</td></tr>
    `,
    tokenRows: `
      <tr><td>Surface</td><td><code>--as-semantic-color-surface-card</code></td><td>#ffffff / #1e1e1e</td></tr>
      <tr><td>Corner Radius</td><td><code>--as-radius-md</code></td><td>8px</td></tr>
      <tr><td>Shadow</td><td><code>--as-elevation-shadow-overlay</code></td><td>Ambient overlay shadow</td></tr>
    `
  });

  // 16. Dialog
  const dialogHtml = buildComponentView({
    name: 'Dialog',
    slug: 'dialog',
    category: 'Overlays & Dialogs',
    description: 'Native <dialog> modal window with 16px radius, backdrop blur (20px), double 1px glass glow shadows, macOS red circular close control, and pill CTA footer.',
    element: '<dialog>',
    previewHtml: `
      <div>
        <button type="button" class="as-button as-button--primary" data-dialog-open="pg-showcase-dlg">
          <span class="as-button__label">Open System Spec Dialog</span>
        </button>
        <dialog class="as-dialog" id="pg-showcase-dlg" aria-labelledby="pg-sc-dlg-t" aria-describedby="pg-sc-dlg-d">
          <div class="as-dialog__surface">
            <div class="as-dialog__header">
              <span class="as-dialog__title" id="pg-sc-dlg-t">SYSTEM SPEC</span>
              <button type="button" class="as-dialog__close" aria-label="Close dialog" data-dialog-close></button>
            </div>
            <div class="as-dialog__hero">
              <div class="as-dialog__hero-bg">
                <svg width="100%" height="100%" viewBox="0 0 400 200">
                  <circle cx="200" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="1"></circle>
                  <path d="M 100 100 Q 200 0 300 100" fill="none" stroke="currentColor" stroke-width="0.75"></path>
                </svg>
              </div>
              <h2 class="as-dialog__hero-title">SYSTEM SPEC</h2>
              <p class="as-dialog__hero-subtitle" id="pg-sc-dlg-d">The fundamental laws governing the creation of this digital artifact.</p>
            </div>
            <div class="as-dialog__body">
              <div class="as-dialog__section">
                <div class="as-dialog__section-title">
                  <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  <span>CORE RULES</span>
                </div>
                <ol class="as-dialog__rule-list">
                  <li class="as-dialog__rule-item"><span class="as-dialog__rule-num">1.</span><span>Hide complexity until desired.</span></li>
                  <li class="as-dialog__rule-item"><span class="as-dialog__rule-num">2.</span><span>Write Compact Helpful copy (max 3 lines, 40–80 chars per line, EL5 mode).</span></li>
                  <li class="as-dialog__rule-item"><span class="as-dialog__rule-num">3.</span><span>One primary focus at a time.</span></li>
                  <li class="as-dialog__rule-item"><span class="as-dialog__rule-num">4.</span><span>Design Adaptive always (adapt to any device).</span></li>
                  <li class="as-dialog__rule-item"><span class="as-dialog__rule-num">5.</span><span>Prioritize Stability &gt; Performance &gt; Usability &gt; Aesthetic.</span></li>
                </ol>
              </div>
            </div>
            <div class="as-dialog__footer">
              <button type="button" class="as-button as-button--primary as-button--lg as-button--pill-cta" data-dialog-close>
                <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path></svg>
                <span class="as-button__label">COPY AS MARKDOWN</span>
              </button>
            </div>
          </div>
        </dialog>
      </div>
    `,
    codeSnippet: `&lt;dialog class="as-dialog" id="system-spec-modal" aria-labelledby="modal-title" aria-describedby="modal-desc"&gt;
  &lt;div class="as-dialog__surface"&gt;
    &lt;div class="as-dialog__header"&gt;
      &lt;span class="as-dialog__title" id="modal-title"&gt;SYSTEM SPEC&lt;/span&gt;
      &lt;button type="button" class="as-dialog__close" data-dialog-close aria-label="Close dialog"&gt;&lt;/button&gt;
    &lt;/div&gt;
    &lt;div class="as-dialog__hero"&gt;
      &lt;h2 class="as-dialog__hero-title"&gt;SYSTEM SPEC&lt;/h2&gt;
      &lt;p class="as-dialog__hero-subtitle" id="modal-desc"&gt;The fundamental laws governing the creation of this digital artifact.&lt;/p&gt;
    &lt;/div&gt;
    &lt;div class="as-dialog__body"&gt;
      &lt;div class="as-dialog__section"&gt;
        &lt;div class="as-dialog__section-title"&gt;
          &lt;svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"&gt;&lt;path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/&gt;&lt;/svg&gt;
          &lt;span&gt;CORE RULES&lt;/span&gt;
        &lt;/div&gt;
        &lt;ol class="as-dialog__rule-list"&gt;
          &lt;li class="as-dialog__rule-item"&gt;&lt;span class="as-dialog__rule-num"&gt;1.&lt;/span&gt;&lt;span&gt;Hide complexity until desired.&lt;/span&gt;&lt;/li&gt;
        &lt;/ol&gt;
      &lt;/div&gt;
    &lt;/div&gt;
    &lt;div class="as-dialog__footer"&gt;
      &lt;button type="button" class="as-button as-button--primary as-button--lg as-button--pill-cta" data-dialog-close&gt;
        &lt;svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"&gt;&lt;path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"/&gt;&lt;/svg&gt;
        &lt;span class="as-button__label"&gt;COPY AS MARKDOWN&lt;/span&gt;
      &lt;/button&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/dialog&gt;`,
    usageGuidance: 'Dialogs interrupt workflow to display focused specs or capture critical decisions. Features double 1px glass glow outlines, 16px radius, Shade-DS 12px solid red dot close control, and high-contrast pill CTA.',
    whenToUse: 'Focused system specs, irreversible confirmations, critical warnings, and modal workflows.',
    whenNotToUse: 'Deep multi-section inspection (use Drawer) or passive status updates (use Toast).',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>Part</th><th>Dimensions</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>Glass Surface</td><td>Max 400px width, 16px radius</td><td>Centered modal card with 20px blur and double 1px glass glow shadows (border: none)</td></tr>
          <tr><td>Header Bar</td><td>48px height, 16px padding</td><td>Uppercase section title and 12px solid red dot dismiss control</td></tr>
          <tr><td>Hero Header</td><td>38px Bebas Neue headline</td><td>Gradient background with subtle abstract geometric vector overlay</td></tr>
          <tr><td>Close Control</td><td>12px solid circle (<code>#ff453a</code> / <code>#c5221f</code>)</td><td>Solid red dot with kinetic hover (scale 1.2) and active (scale 0.9) states</td></tr>
          <tr><td>Footer Action</td><td>Pill CTA (9999px radius)</td><td>Inverted monochrome pill button with Phosphor copy icon</td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td>Native showModal()</td><td>Traps focus cyclically inside modal surface.</td></tr>
      <tr><td>Escape &amp; Scrim</td><td>Pressing <code>Escape</code> or clicking backdrop closes modal and restores trigger focus.</td></tr>
    `,
    tokenRows: `
      <tr><td>Surface</td><td><code>--as-semantic-color-surface-card</code></td><td>#ffffff / #1e1e1e</td></tr>
      <tr><td>Corner Radius</td><td><code>--as-radius-lg</code></td><td>12px</td></tr>
      <tr><td>Overlay Shadow</td><td><code>--as-elevation-shadow-overlay</code></td><td>0 8px 24px rgba(0,0,0,0.12)</td></tr>
    `
  });

  // 17. Drawer
  const drawerHtml = buildComponentView({
    name: 'Drawer',
    slug: 'drawer',
    category: 'Overlays & Dialogs',
    description: 'Full-height slide-over sheet panel (440px max-width) with backdrop scrim, focus trapping, and Shade-DS 12px solid red dot close control.',
    element: '<div role="dialog" aria-modal="true">',
    previewHtml: `
      <div>
        <button type="button" class="as-button as-button--secondary" data-drawer-open="pg-showcase-drawer">
          <span class="as-button__label">Open Side Drawer</span>
        </button>
        <div class="as-drawer" id="pg-showcase-drawer" role="dialog" aria-modal="true" aria-labelledby="pg-sc-drw-t" hidden>
          <div class="as-drawer__backdrop" data-drawer-close></div>
          <div class="as-drawer__panel as-drawer__panel--right">
            <div class="as-drawer__header">
              <div>
                <h3 class="as-drawer__title" id="pg-sc-drw-t">Node Telemetry Stream</h3>
                <p class="as-drawer__description">Real-time metrics and kernel allocation.</p>
              </div>
              <button type="button" class="as-drawer__close" aria-label="Close drawer" data-drawer-close></button>
            </div>
            <div class="as-drawer__body">
              <p style="margin: 0; color: var(--as-semantic-color-text-muted);">Real-time stream connected. Node worker-01 running kernel 6.8 with zero dropped packets.</p>
            </div>
            <div class="as-drawer__footer">
              <button type="button" class="as-button as-button--secondary" data-drawer-close><span class="as-button__label">Close</span></button>
            </div>
          </div>
        </div>
      </div>
    `,
    codeSnippet: `&lt;div class="as-drawer" id="side-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" hidden&gt;
  &lt;div class="as-drawer__backdrop" data-drawer-close&gt;&lt;/div&gt;
  &lt;div class="as-drawer__panel as-drawer__panel--right"&gt;
    &lt;div class="as-drawer__header"&gt;
      &lt;h3 class="as-drawer__title" id="drawer-title"&gt;Node Telemetry&lt;/h3&gt;
      &lt;button type="button" class="as-drawer__close" data-drawer-close aria-label="Close drawer"&gt;&lt;/button&gt;
    &lt;/div&gt;
    &lt;div class="as-drawer__body"&gt;Telemetry details...&lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;`,
    usageGuidance: 'Drawers slide in from the viewport edge for deep inspection workflows while preserving background context.',
    whenToUse: 'Telemetry inspectors, log streams, and multi-field configuration panels.',
    whenNotToUse: 'Simple yes/no confirmations (use Dialog).',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>Placement</th><th>Class</th><th>Behavior</th></tr></thead>
        <tbody>
          <tr><td>Right Edge</td><td><code>.as-drawer__panel--right</code></td><td>Slides from right edge (max 440px)</td></tr>
          <tr><td>Left Edge</td><td><code>.as-drawer__panel--left</code></td><td>Slides from left edge (max 440px)</td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td>Focus Trap</td><td>Cycles <code>Tab</code> and <code>Shift+Tab</code> inside the open drawer.</td></tr>
      <tr><td>Red Dot Close Button</td><td>12px solid red dot <code>.as-drawer__close</code> with focus ring.</td></tr>
    `,
    tokenRows: `
      <tr><td>Panel Surface</td><td><code>--as-semantic-color-surface-card</code></td><td>#ffffff / #1e1e1e</td></tr>
      <tr><td>Border Hairline</td><td><code>--as-semantic-color-border-subtle</code></td><td>#e0e0e0 / #333333</td></tr>
    `
  });

  // 18. Popover
  const popoverHtml = buildComponentView({
    name: 'Popover',
    slug: 'popover',
    category: 'Overlays & Dialogs',
    description: 'Anchored floating contextual card (12px radius) with light dismissal, Escape support, and Shade-DS 12px solid red dot close control.',
    element: '<div role="dialog">',
    previewHtml: `
      <div class="as-popover-anchor">
        <button type="button" class="as-button as-button--secondary as-popover-trigger" id="pg-sc-pop-btn" aria-haspopup="dialog" aria-expanded="false">
          <span class="as-button__label">Filter Pods</span>
        </button>
        <div class="as-popover" role="dialog" aria-labelledby="pg-sc-pop-btn" hidden>
          <div class="as-popover__header">
            <h4 class="as-popover__title">Filter Preferences</h4>
            <button type="button" class="as-popover__close" aria-label="Close popover" data-popover-close></button>
          </div>
          <div class="as-popover__body">
            <p style="margin: 0; font-size: var(--as-typography-font-size-sm); color: var(--as-semantic-color-text-muted);">
              Display healthy worker instances only. Click the red dot button or outside to dismiss.
            </p>
          </div>
        </div>
      </div>
    `,
    codeSnippet: `&lt;div class="as-popover-anchor"&gt;
  &lt;button type="button" class="as-button as-button--secondary as-popover-trigger" id="pop-btn" aria-haspopup="dialog" aria-expanded="false"&gt;
    &lt;span class="as-button__label"&gt;Filter Pods&lt;/span&gt;
  &lt;/button&gt;
  &lt;div class="as-popover" role="dialog" aria-labelledby="pop-btn" hidden&gt;
    &lt;div class="as-popover__header"&gt;
      &lt;h4 class="as-popover__title"&gt;Filter Preferences&lt;/h4&gt;
      &lt;button type="button" class="as-popover__close" data-popover-close aria-label="Close popover"&gt;&lt;/button&gt;
    &lt;/div&gt;
    &lt;div class="as-popover__body"&gt;Display healthy worker instances only.&lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;`,
    usageGuidance: 'Popovers display rich non-modal content anchored to a trigger button, equipped with a 12px Shade-DS solid red dot close button (.as-popover__close).',
    whenToUse: 'Quick inline filter cards, contextual metadata inspectors, or setting callouts.',
    whenNotToUse: 'Plain text labels without interactive controls (use Tooltip).',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>Alignment</th><th>Class</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>Left Aligned</td><td><code>.as-popover</code></td><td>Aligned to trigger left edge (280px–360px)</td></tr>
          <tr><td>Right Aligned</td><td><code>.as-popover--right</code></td><td>Aligned to trigger right edge</td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td>Light Dismiss &amp; Close</td><td>Dismisses on outside click, <code>Escape</code> key, or <code>.as-popover__close</code> click.</td></tr>
      <tr><td>ARIA Expanded</td><td>Synchronizes <code>aria-expanded="true|false"</code> on the trigger button.</td></tr>
    `,
    tokenRows: `
      <tr><td>Card Surface</td><td><code>--as-semantic-color-surface-card</code></td><td>#ffffff / #1e1e1e</td></tr>
      <tr><td>Corner Radius</td><td><code>--as-radius-lg</code></td><td>12px</td></tr>
    `
  });

  // 19. Dropdown Menu
  const dropdownHtml = buildComponentView({
    name: 'Dropdown Menu',
    slug: 'dropdown',
    category: 'Overlays & Dialogs',
    description: 'Contextual action menu adhering to the W3C APG Menu Button pattern with roving ArrowUp/ArrowDown focus.',
    element: '<div role="menu">',
    previewHtml: `
      <div class="as-dropdown">
        <button type="button" class="as-button as-button--secondary as-dropdown__trigger" id="pg-sc-dd-btn" aria-haspopup="menu" aria-expanded="false">
          <span class="as-button__label">Cluster Operations</span>
          <svg class="as-dropdown__chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 6 8 10 12 6"></polyline></svg>
        </button>
        <div class="as-dropdown__menu" role="menu" aria-labelledby="pg-sc-dd-btn" hidden>
          <button type="button" class="as-dropdown__item" role="menuitem">Restart Active Pods</button>
          <button type="button" class="as-dropdown__item" role="menuitem">Export Telemetry</button>
          <div class="as-dropdown__divider" role="separator"></div>
          <button type="button" class="as-dropdown__item as-dropdown__item--destructive" role="menuitem">Drain Node Pool</button>
        </div>
      </div>
    `,
    codeSnippet: `&lt;div class="as-dropdown"&gt;
  &lt;button type="button" class="as-button as-button--secondary as-dropdown__trigger" id="menu-btn" aria-haspopup="menu" aria-expanded="false"&gt;
    &lt;span class="as-button__label"&gt;Cluster Operations&lt;/span&gt;
  &lt;/button&gt;
  &lt;div class="as-dropdown__menu" role="menu" aria-labelledby="menu-btn" hidden&gt;
    &lt;button type="button" class="as-dropdown__item" role="menuitem"&gt;Restart Active Pods&lt;/button&gt;
    &lt;div class="as-dropdown__divider" role="separator"&gt;&lt;/div&gt;
    &lt;button type="button" class="as-dropdown__item as-dropdown__item--destructive" role="menuitem"&gt;Drain Node Pool&lt;/button&gt;
  &lt;/div&gt;
&lt;/div&gt;`,
    usageGuidance: 'Dropdown menus group secondary commands into a keyboard-navigable list.',
    whenToUse: 'Row-level actions, overflow command menus, and contextual operations.',
    whenNotToUse: 'Form field option selection (use Select).',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>Item Type</th><th>Class</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>Standard Item</td><td><code>.as-dropdown__item</code></td><td>36px min-height button with 4px radius</td></tr>
          <tr><td>Destructive Item</td><td><code>.as-dropdown__item--destructive</code></td><td>Critical status text &amp; hover tint</td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td>Arrow Up / Down</td><td>Roves focus cyclically through menu items.</td></tr>
      <tr><td>Escape Key</td><td>Closes menu and restores focus to trigger button.</td></tr>
    `,
    tokenRows: `
      <tr><td>Menu Radius</td><td><code>--as-radius-md</code></td><td>8px</td></tr>
      <tr><td>Item Radius</td><td><code>--as-radius-sm</code></td><td>4px</td></tr>
    `
  });

  // 20. Tabs
  const tabsHtml = buildComponentView({
    name: 'Tabs',
    slug: 'tabs',
    category: 'Navigation & Layout',
    description: 'W3C APG compliant tabbed navigation with roving tabindex and ArrowLeft/ArrowRight cycling.',
    element: '<div role="tablist"> + <div role="tabpanel">',
    previewHtml: `
      <div class="as-tabs" style="width: 100%; max-width: 560px;">
        <div class="as-tabs__list" role="tablist" aria-label="Infrastructure Management Tabs" aria-orientation="horizontal">
          <button type="button" class="as-tabs__tab is-active" role="tab" id="pg-sc-tab-1" aria-selected="true" aria-controls="pg-sc-pan-1" tabindex="0">Worker Nodes</button>
          <button type="button" class="as-tabs__tab" role="tab" id="pg-sc-tab-2" aria-selected="false" aria-controls="pg-sc-pan-2" tabindex="-1">Storage Volumes</button>
          <button type="button" class="as-tabs__tab" role="tab" id="pg-sc-tab-3" aria-selected="false" aria-controls="pg-sc-pan-3" tabindex="-1">Ingress Routing</button>
        </div>
        <div class="as-tabs__panel is-active" role="tabpanel" id="pg-sc-pan-1" aria-labelledby="pg-sc-tab-1" tabindex="0">
          <p style="margin: 0; color: var(--as-semantic-color-text-muted);">Active nodes: 3 worker instances running kernel 6.8 with zero evictions.</p>
        </div>
        <div class="as-tabs__panel" role="tabpanel" id="pg-sc-pan-2" aria-labelledby="pg-sc-tab-2" tabindex="0" hidden>
          <p style="margin: 0; color: var(--as-semantic-color-text-muted);">Storage: 4 NVMe-backed SSD volumes attached across availability zones.</p>
        </div>
        <div class="as-tabs__panel" role="tabpanel" id="pg-sc-pan-3" aria-labelledby="pg-sc-tab-3" tabindex="0" hidden>
          <p style="margin: 0; color: var(--as-semantic-color-text-muted);">Network: Ingress mesh router handling 14,290 requests/sec with TLS termination.</p>
        </div>
      </div>
    `,
    codeSnippet: `&lt;div class="as-tabs"&gt;
  &lt;div class="as-tabs__list" role="tablist" aria-orientation="horizontal"&gt;
    &lt;button type="button" class="as-tabs__tab is-active" role="tab" id="tab-1" aria-selected="true" aria-controls="panel-1" tabindex="0"&gt;Worker Nodes&lt;/button&gt;
    &lt;button type="button" class="as-tabs__tab" role="tab" id="tab-2" aria-selected="false" aria-controls="panel-2" tabindex="-1"&gt;Storage Volumes&lt;/button&gt;
  &lt;/div&gt;
  &lt;div class="as-tabs__panel is-active" role="tabpanel" id="panel-1" aria-labelledby="tab-1" tabindex="0"&gt;Active nodes...&lt;/div&gt;
  &lt;div class="as-tabs__panel" role="tabpanel" id="panel-2" aria-labelledby="tab-2" tabindex="0" hidden&gt;Storage volumes...&lt;/div&gt;
&lt;/div&gt;`,
    usageGuidance: 'Tabs segment related content views within the same page context.',
    whenToUse: 'Switching between sibling sub-views (e.g. Preview, Code, Prompt, Anatomy).',
    whenNotToUse: 'Sequential multi-step wizards.',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>Part</th><th>Selector</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>Tab Trigger</td><td><code>.as-tabs__tab</code></td><td>12px x 16px padded button with 2px active underline</td></tr>
          <tr><td>Tab Panel</td><td><code>.as-tabs__panel</code></td><td>16px top-padded content panel</td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td>Arrow Left / Right</td><td>Cycles active tab and reveals associated tabpanel.</td></tr>
      <tr><td>Roving Tabindex</td><td>Active tab sets <code>tabindex="0"</code>; inactive tabs set <code>tabindex="-1"</code>.</td></tr>
    `,
    tokenRows: `
      <tr><td>Active Indicator</td><td><code>--as-semantic-color-interactive-primary</code></td><td>#0f0f0f / #ffffff</td></tr>
      <tr><td>Divider Border</td><td><code>--as-semantic-color-border-subtle</code></td><td>#e0e0e0 / #333333</td></tr>
    `
  });

  // 21. Accordion
  const accordionHtml = buildComponentView({
    name: 'Accordion',
    slug: 'accordion',
    category: 'Navigation & Layout',
    description: 'Vertically stacked disclosure panels (12px container radius) with semantic headings and single/multi expand modes.',
    element: '<h3> + <button aria-expanded>',
    previewHtml: `
      <div class="as-accordion" style="width: 100%; max-width: 560px;" data-single="true">
        <div class="as-accordion__item">
          <h3 class="as-accordion__heading">
            <button type="button" class="as-accordion__trigger" aria-expanded="true" aria-controls="pg-sc-acc-p1" id="pg-sc-acc-t1">
              <span class="as-accordion__title">Zero-Downtime Rollout Strategy</span>
              <svg class="as-accordion__chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 6 8 10 12 6"></polyline></svg>
            </button>
          </h3>
          <div class="as-accordion__panel" id="pg-sc-acc-p1" role="region" aria-labelledby="pg-sc-acc-t1">
            <div class="as-accordion__content">
              Pods are drained gracefully with health probe verification before terminating existing replicas.
            </div>
          </div>
        </div>
        <div class="as-accordion__item">
          <h3 class="as-accordion__heading">
            <button type="button" class="as-accordion__trigger" aria-expanded="false" aria-controls="pg-sc-acc-p2" id="pg-sc-acc-t2">
              <span class="as-accordion__title">Multi-Zone Network Peering</span>
              <svg class="as-accordion__chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 6 8 10 12 6"></polyline></svg>
            </button>
          </h3>
          <div class="as-accordion__panel" id="pg-sc-acc-p2" role="region" aria-labelledby="pg-sc-acc-t2" hidden>
            <div class="as-accordion__content">
              Workloads are spread evenly across three availability zones with automatic cross-zone failover.
            </div>
          </div>
        </div>
      </div>
    `,
    codeSnippet: `&lt;div class="as-accordion" data-single="true"&gt;
  &lt;div class="as-accordion__item"&gt;
    &lt;h3 class="as-accordion__heading"&gt;
      &lt;button type="button" class="as-accordion__trigger" aria-expanded="true" aria-controls="sec-1" id="trig-1"&gt;
        &lt;span class="as-accordion__title"&gt;Zero-Downtime Rollout Strategy&lt;/span&gt;
        &lt;svg class="as-accordion__chevron" viewBox="0 0 16 16" aria-hidden="true"&gt;&lt;polyline points="4 6 8 10 12 6"/&gt;&lt;/svg&gt;
      &lt;/button&gt;
    &lt;/h3&gt;
    &lt;div class="as-accordion__panel" id="sec-1" role="region" aria-labelledby="trig-1"&gt;
      &lt;div class="as-accordion__content"&gt;Pods are drained gracefully...&lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;`,
    usageGuidance: 'Accordions progressively disclose supplementary details inside a 12px radius stacked container.',
    whenToUse: 'FAQs, configuration groups, and collapsible architecture details.',
    whenNotToUse: 'Content that users must read all at once.',
    variantsTable: `
      <table class="spec-table">
        <thead><tr><th>Mode</th><th>Attribute</th><th>Behavior</th></tr></thead>
        <tbody>
          <tr><td>Single Expand</td><td><code>data-single="true"</code></td><td>Opening an item collapses sibling items</td></tr>
          <tr><td>Multi Expand</td><td><code>data-single="false"</code></td><td>Multiple panels can stay open simultaneously</td></tr>
        </tbody>
      </table>
    `,
    a11yRows: `
      <tr><td>Heading Hierarchy</td><td>Trigger button is wrapped in semantic <code>&lt;h3&gt;</code>/<code>&lt;h4&gt;</code>.</td></tr>
      <tr><td>Arrow Up / Down</td><td>Moves focus cyclically between accordion triggers.</td></tr>
    `,
    tokenRows: `
      <tr><td>Container Radius</td><td><code>--as-radius-lg</code></td><td>12px</td></tr>
      <tr><td>Divider Rule</td><td><code>--as-semantic-color-border-subtle</code></td><td>#e0e0e0 / #333333</td></tr>
    `
  });

  // Construct complete HTML file
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Aster Design System</title>
  <meta name="description" content="Aster: a token-first design system with human documentation, interactive playground, and agent-readable component contracts." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" />
  <!-- Canonical design tokens (generated; do not edit) -->
  <link rel="stylesheet" href="/dist/css/tokens.css" />
  <!-- Canonical component styles (generated from components/*; do not edit) -->
  <link rel="stylesheet" href="/dist/css/components.css" />
  <!-- Documentation & Playground shell styles -->
  <link rel="stylesheet" href="/playground/styles/playground.css" />
  <!-- Phosphor Icons Web Font for direct icon classes -->
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css" />
</head>
<body data-kind="landing">

${spriteHtml}

<a class="skip-link" href="#main-content">Skip to content</a>

<header class="site-header" role="banner">
  <div class="site-header__inner">
    <button type="button" class="icon-btn menu-btn" id="menu-btn" aria-label="Open navigation" aria-controls="sidebar" aria-expanded="false"><svg class="as-icon" width="20" height="20"><use href="#i-menu"/></svg></button>
    <a href="#/overview" class="brand" aria-label="Aster, home">
      <svg class="brand__mark" aria-hidden="true"><use href="#i-star"/></svg>
      <span>Aster</span>
      <span class="brand__ver">v0.2</span>
    </a>
    <nav class="top-nav" aria-label="Primary">
      <a href="#/overview" data-nav-section="overview">Home</a>
      <a href="#/installation" data-nav-section="docs">Docs</a>
      <a href="#/accordion" data-nav-section="components">Components</a>
      <a href="#/playground" data-nav-section="playground" class="top-nav__playground">Playground</a>
    </nav>
    <span class="header-spacer"></span>
    <button type="button" class="search-trigger" id="search-trigger" aria-label="Search documentation" aria-haspopup="dialog">
      <svg class="as-icon" aria-hidden="true"><use href="#i-search"/></svg>
      <span>Search docs...</span>
      <kbd>Ctrl K</kbd>
    </button>
    <div class="display-menu">
      <button type="button" class="icon-btn" id="display-btn" aria-label="Theme settings" aria-expanded="false" aria-controls="display-panel"><svg class="as-icon" width="20" height="20"><use href="#i-sliders"/></svg></button>
      <div class="display-panel" id="display-panel" role="group" aria-label="Theme settings" hidden>
        <h2>Theme Mode</h2>
        <div class="seg" data-index="0" style="--n: 2; --i: 0;" id="seg-theme">
          <span class="seg__thumb" aria-hidden="true"></span>
          <button type="button" id="btn-theme-light" aria-pressed="true">Light</button>
          <button type="button" id="btn-theme-dark" aria-pressed="false">Dark</button>
        </div>
      </div>
    </div>
  </div>
</header>

<div id="global-live-region" class="as-sr-only" role="status" aria-live="polite"></div>
<div class="scrim" id="scrim"></div>

<div class="docs-shell">
  <nav class="sidebar" id="sidebar" aria-label="Documentation">
    <div class="nav-group">
      <h2>Workspace</h2>
      <a class="nav-link" href="#/overview" data-route="overview">Home</a>
      <a class="nav-link" href="#/playground" data-route="playground">Interactive Playground</a>
      <a class="nav-link" href="#/installation" data-route="installation">Installation</a>
    </div>
    <div class="nav-group">
      <h2>Audience Hubs</h2>
      <a class="nav-link" href="#/designers" data-route="designers">For Designers</a>
      <a class="nav-link" href="#/developers" data-route="developers">For Developers</a>
      <a class="nav-link" href="#/agents" data-route="agents">For AI Agents</a>
    </div>
    <div class="nav-group">
      <h2>Foundations</h2>
      <a class="nav-link" href="#/colors" data-route="colors">Color System</a>
      <a class="nav-link" href="#/typography" data-route="typography">Typography</a>
      <a class="nav-link" href="#/spacing" data-route="spacing">Spacing &amp; Layout</a>
      <a class="nav-link" href="#/elevation" data-route="elevation">Radius &amp; Elevation</a>
      <a class="nav-link" href="#/themes-density" data-route="themes-density">Themes &amp; Density</a>
      <a class="nav-link" href="#/motion" data-route="motion">Motion</a>
    </div>
    <div class="nav-group">
      <h2>Components</h2>
      <a class="nav-link" href="#/accordion" data-route="accordion">Accordion</a>
      <a class="nav-link" href="#/alert" data-route="alert">Alert</a>
      <a class="nav-link" href="#/badge" data-route="badge">Badge</a>
      <a class="nav-link" href="#/button" data-route="button">Button</a>
      <a class="nav-link" href="#/checkbox" data-route="checkbox">Checkbox</a>
      <a class="nav-link" href="#/table" data-route="table">Data Table</a>
      <a class="nav-link" href="#/dialog" data-route="dialog">Dialog</a>
      <a class="nav-link" href="#/drawer" data-route="drawer">Drawer</a>
      <a class="nav-link" href="#/dropdown" data-route="dropdown">Dropdown Menu</a>
      <a class="nav-link" href="#/input" data-route="input">Input &amp; Field</a>
      <a class="nav-link" href="#/popover" data-route="popover">Popover</a>
      <a class="nav-link" href="#/progress" data-route="progress">Progress</a>
      <a class="nav-link" href="#/radio" data-route="radio">Radio Group</a>
      <a class="nav-link" href="#/select" data-route="select">Select</a>
      <a class="nav-link" href="#/skeleton" data-route="skeleton">Skeleton</a>
      <a class="nav-link" href="#/slider" data-route="slider">Slider</a>
      <a class="nav-link" href="#/switch" data-route="switch">Switch</a>
      <a class="nav-link" href="#/tabs" data-route="tabs">Tabs</a>
      <a class="nav-link" href="#/textarea" data-route="textarea">Textarea</a>
      <a class="nav-link" href="#/toast" data-route="toast">Toast</a>
      <a class="nav-link" href="#/tooltip" data-route="tooltip">Tooltip</a>
    </div>
  </nav>

  <main class="docs-main" id="main-content">
    ${overviewHtml}
    ${playgroundViewHtml}
    ${designersHtml}
    ${developersHtml}
    ${agentsHtml}
    ${installationHtml}
    ${colorsHtml}
    ${typographyHtml}
    ${spacingHtml}
    ${elevationHtml}
    ${themesDensityHtml}
    ${motionHtml}
    ${accordionHtml}
    ${alertHtml}
    ${badgeHtml}
    ${buttonHtml}
    ${checkboxHtml}
    ${tableHtml}
    ${dialogHtml}
    ${drawerHtml}
    ${dropdownHtml}
    ${inputHtml}
    ${popoverHtml}
    ${progressHtml}
    ${radioHtml}
    ${selectHtml}
    ${skeletonHtml}
    ${sliderHtml}
    ${switchHtml}
    ${tabsHtml}
    ${textareaHtml}
    ${toastHtml}
    ${tooltipHtml}
  </main>

  <aside class="toc" id="toc" aria-label="On this page"><h2>On this page</h2><div id="toc-links"></div></aside>
</div>

<!-- Command palette -->
<dialog class="palette" id="palette" aria-label="Search documentation">
  <form method="dialog" id="palette-form" style="display:contents">
    <div class="palette__field">
      <svg class="as-icon" aria-hidden="true"><use href="#i-search"/></svg>
      <input id="palette-input" type="text" role="combobox" aria-expanded="true" aria-controls="palette-list" aria-autocomplete="list" placeholder="Search pages, components, and sections..." autocomplete="off" aria-label="Search" />
      <kbd>Esc</kbd>
    </div>
    <ul class="palette__list" id="palette-list" role="listbox" aria-label="Results"></ul>
    <div class="palette__foot"><span>&uarr;&darr; navigate</span><span>Enter open</span><span>Esc close</span></div>
  </form>
</dialog>

<script type="module" src="/playground/scripts/playground.js"></script>
</body>
</html>
`;

  // Generate root index.html with relative links
  const rootHtml = fullHtml
    .replace('href="/dist/css/tokens.css"', 'href="./dist/css/tokens.css"')
    .replace('href="/dist/css/components.css"', 'href="./dist/css/components.css"')
    .replace('href="/playground/styles/playground.css"', 'href="./playground/styles/playground.css"')
    .replace('src="/playground/scripts/playground.js"', 'src="./playground/scripts/playground.js"')
    .replace('<title>Aster Design System</title>', '<title>Aster Design System</title>\n  <link rel="icon" type="image/svg+xml" href="./assets/brand/aster-logo-black.svg" />')
    .trim() + '\n';

  // Generate playground/index.html with relative links tailored for subpath
  const playgroundHtml = fullHtml
    .replace('href="/dist/css/tokens.css"', 'href="../dist/css/tokens.css"')
    .replace('href="/dist/css/components.css"', 'href="../dist/css/components.css"')
    .replace('href="/playground/styles/playground.css"', 'href="./styles/playground.css"')
    .replace('src="/playground/scripts/playground.js"', 'src="./scripts/playground.js"')
    .replace('<title>Aster Design System</title>', '<title>Aster Design System</title>\n  <link rel="icon" type="image/svg+xml" href="../assets/brand/aster-logo-black.svg" />')
    .trim() + '\n';

  writeFileSync(join(rootDir, 'index.html'), rootHtml, 'utf8');
  writeFileSync(join(rootDir, 'playground/index.html'), playgroundHtml, 'utf8');
  console.log('✓ Successfully compiled index.html (root `/`) and playground/index.html with 30 routes, portable relative asset links, and brand favicon!');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    buildPlayground();
  } catch (err) {
    console.error('Playground build failed:', err);
    process.exit(1);
  }
}
