import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// --- sRGB Relative Luminance Math (WCAG 2.2 Specification) ---
function hexToRgb(hex) {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function getRelativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) => {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1, hex2) {
  const lum1 = getRelativeLuminance(hexToRgb(hex1));
  const lum2 = getRelativeLuminance(hexToRgb(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// --- Token Loader & Alias Resolver ---
function loadJson(path) {
  return JSON.parse(readFileSync(join(rootDir, path), 'utf8'));
}

const primitiveTokens = loadJson('tokens/primitive/color.json');
const semanticLight = loadJson('tokens/semantic/light.json');
const semanticDark = loadJson('tokens/semantic/dark.json');

function resolveAlias(aliasStr) {
  if (!aliasStr.startsWith('{') || !aliasStr.endsWith('}')) return aliasStr;
  const path = aliasStr.slice(1, -1).split('.');
  // Traverse primitiveTokens
  let current = primitiveTokens;
  for (const segment of path) {
    if (current[segment] !== undefined) {
      current = current[segment];
    } else {
      throw new Error(`Failed to resolve alias: ${aliasStr} at segment: ${segment}`);
    }
  }
  return current.$value;
}

function getSemanticMap(semanticTree) {
  const colors = semanticTree.semantic.color;
  return {
    'surface.canvas': resolveAlias(colors.surface.canvas.$value),
    'surface.card': resolveAlias(colors.surface.card.$value),
    'surface.subtle': resolveAlias(colors.surface.subtle.$value),
    'text.default': resolveAlias(colors.text.default.$value),
    'text.muted': resolveAlias(colors.text.muted.$value),
    'border.strong': resolveAlias(colors.border.strong.$value),
    'border.focus': resolveAlias(colors.border.focus.$value),
    'interactive.primary': resolveAlias(colors.interactive.primary.$value),
    'interactive.primary-text': resolveAlias(colors.interactive['primary-text'].$value),
    'interactive.link': resolveAlias(colors.interactive.link.$value),
    'status.success-text': resolveAlias(colors.status['success-text'].$value),
    'status.warning-text': resolveAlias(colors.status['warning-text'].$value),
    'status.critical-text': resolveAlias(colors.status['critical-text'].$value)
  };
}

const lightTokens = getSemanticMap(semanticLight);
const darkTokens = getSemanticMap(semanticDark);

// --- Role-Aware Verification Matrix ---
const testMatrix = [
  // Text pairings (Mandatory AA: 4.5:1, Target AAA: 7:1)
  { name: 'Primary Text on Canvas', fg: 'text.default', bg: 'surface.canvas', required: 4.5, type: 'text' },
  { name: 'Primary Text on Card', fg: 'text.default', bg: 'surface.card', required: 4.5, type: 'text' },
  { name: 'Secondary Muted Text on Canvas', fg: 'text.muted', bg: 'surface.canvas', required: 4.5, type: 'text' },
  { name: 'Secondary Muted Text on Card', fg: 'text.muted', bg: 'surface.card', required: 4.5, type: 'text' },
  { name: 'Primary Button Text on Fill', fg: 'interactive.primary-text', bg: 'interactive.primary', required: 4.5, type: 'text' },
  { name: 'Interactive Link on Canvas', fg: 'interactive.link', bg: 'surface.canvas', required: 4.5, type: 'text' },
  { name: 'Success Text on Canvas', fg: 'status.success-text', bg: 'surface.canvas', required: 4.5, type: 'text' },
  { name: 'Warning Text on Canvas', fg: 'status.warning-text', bg: 'surface.canvas', required: 4.5, type: 'text' },
  { name: 'Critical Text on Canvas', fg: 'status.critical-text', bg: 'surface.canvas', required: 4.5, type: 'text' },
  // UI & Boundary pairings (Mandatory AA: 3:1)
  { name: 'Control Border on Canvas', fg: 'border.strong', bg: 'surface.canvas', required: 3.0, type: 'ui' },
  { name: 'Control Border on Card', fg: 'border.strong', bg: 'surface.card', required: 3.0, type: 'ui' },
  { name: 'Button Fill on Canvas', fg: 'interactive.primary', bg: 'surface.canvas', required: 3.0, type: 'ui' },
  { name: 'Focus Ring on Canvas', fg: 'border.focus', bg: 'surface.canvas', required: 3.0, type: 'focus' }
];

console.log('========================================================================================');
console.log('                 ASTER DESIGN SYSTEM — ROLE-AWARE CONTRAST VERIFICATION                 ');
console.log('========================================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runThemeTests(themeName, tokens) {
  console.log(`--- Theme: ${themeName.toUpperCase()} ---`);
  console.log('----------------------------------------------------------------------------------------');
  console.log(
    'Role Pairing'.padEnd(32) +
    'FG / BG'.padEnd(20) +
    'Ratio'.padEnd(10) +
    'Required'.padEnd(12) +
    'Status'
  );
  console.log('----------------------------------------------------------------------------------------');

  for (const test of testMatrix) {
    totalTests++;
    const fgHex = tokens[test.fg];
    const bgHex = tokens[test.bg];
    const ratio = getContrastRatio(fgHex, bgHex);
    const passed = ratio >= test.required;
    const isAAA = test.type === 'text' && ratio >= 7.0;

    if (passed) {
      passedTests++;
    } else {
      failedTests++;
    }

    const statusStr = passed
      ? (isAAA ? '✔ PASS (AAA)' : '✔ PASS (AA)')
      : '✖ FAIL';

    const ratioStr = ratio.toFixed(2) + ':1';
    const reqStr = test.required.toFixed(1) + ':1 (' + test.type + ')';
    const hexPairStr = `${fgHex}/${bgHex}`;

    console.log(
      test.name.padEnd(32) +
      hexPairStr.padEnd(20) +
      ratioStr.padEnd(10) +
      reqStr.padEnd(12) +
      statusStr
    );
  }
  console.log('\n');
}

runThemeTests('Light Mode', lightTokens);
runThemeTests('Dark Mode', darkTokens);

console.log('========================================================================================');
console.log(`SUMMARY: ${passedTests}/${totalTests} tests passed (${failedTests} failures).`);
console.log('========================================================================================');

console.log('\nSCOPE & COVERAGE DISCLOSURE:');
console.log('• COVERED: Mathematical sRGB contrast ratios between canonical foreground/background tokens.');
console.log('• COVERED: WCAG 2.2 Success Criterion 1.4.3 (Contrast Minimum) & 1.4.11 (Non-text Contrast).');
console.log('• NOT COVERED: Contextual typography size rendering, line height, or real DOM reflow.');
console.log('• NOT COVERED: Focus indicator obscured state (2.4.11) or touch target boundaries (2.5.8).');
console.log('• NOTE: Component-level testing in actual layouts is required to evaluate holistic compliance.\n');

if (failedTests > 0) {
  console.error(`ERROR: ${failedTests} required contrast pairing(s) failed WCAG 2.2 AA validation.`);
  process.exit(1);
} else {
  console.log('✓ All required semantic color pairings achieve 100% WCAG 2.2 AA compliance.');
  process.exit(0);
}
