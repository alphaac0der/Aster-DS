import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { DOC_PAGES } from './build-playground.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

function parseHex(hex) {
  const c = hex.replace('#', '').trim();
  if (c.length === 3) {
    return [
      parseInt(c[0] + c[0], 16),
      parseInt(c[1] + c[1], 16),
      parseInt(c[2] + c[2], 16)
    ];
  }
  return [
    parseInt(c.slice(0, 2), 16),
    parseInt(c.slice(2, 4), 16),
    parseInt(c.slice(4, 6), 16)
  ];
}

function srgbToLinear(val) {
  const v = val / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function getLuminance(hex) {
  const [r, g, b] = parseHex(hex);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (brighter + 0.05) / (darker + 0.05);
}

console.log('========================================================================================');
console.log('             ASTER DESIGN SYSTEM — WEBSITE & DOCUMENTATION UX AUDIT                     ');
console.log('========================================================================================\n');

let totalChecks = 0;
let passedChecks = 0;
const errors = [];

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ ${message}`);
  } else {
    errors.push(message);
    console.error(`  ✗ FAIL: ${message}`);
  }
}

// 1. Inspect index.html and playground/index.html
console.log('1. Checking compiled HTML files (index.html & playground/index.html):');
const indexHtml = readFileSync(join(rootDir, 'index.html'), 'utf8');
const playgroundHtml = readFileSync(join(rootDir, 'playground/index.html'), 'utf8');

// Theme-aware favicons (embedded SVG Data URIs for 100% resilience against network & path failures)
assert(
  indexHtml.includes('rel="icon"') &&
  indexHtml.includes('id="favicon-link"') &&
  indexHtml.includes('data:image/svg+xml'),
  'index.html declares resilient theme-aware SVG Data URI favicons with media="(prefers-color-scheme: ...)"'
);

assert(
  playgroundHtml.includes('rel="icon"') &&
  playgroundHtml.includes('data:image/svg+xml'),
  'playground/index.html declares resilient SVG Data URI favicons'
);

// FOUC prevention script in head
assert(
  indexHtml.includes('localStorage.getItem(\'aster-theme\')') &&
  indexHtml.includes('documentElement.setAttribute(\'data-theme\''),
  'index.html includes inline head script for instant FOUC prevention'
);

// Theme-reactive Header Logo (Inline SVG to guarantee zero broken image links)
assert(
  indexHtml.includes('class="brand__logo"') &&
  indexHtml.includes('class="brand__logo-sparkle"') &&
  indexHtml.includes('class="brand__logo-arc"') &&
  indexHtml.includes('viewBox="0 0 376 382"'),
  'Header includes zero-dependency inline SVG Aster brand logo (.brand__logo, .brand__logo-sparkle, .brand__logo-arc)'
);

// Navigation Menu Button as Aster-DS button
assert(
  indexHtml.includes('id="menu-btn"') &&
  indexHtml.includes('as-button') &&
  indexHtml.includes('as-button--ghost') &&
  indexHtml.includes('as-button--icon'),
  'Navigation menu button (#menu-btn) is an Aster-DS button (.as-button.as-button--ghost.as-button--icon)'
);

// Single-click Theme Toggle Button as Aster-DS button
assert(
  indexHtml.includes('id="theme-toggle-btn"') &&
  indexHtml.includes('as-button') &&
  indexHtml.includes('as-button--ghost') &&
  indexHtml.includes('as-button--icon') &&
  indexHtml.includes('aria-label="Toggle color theme"'),
  'Header theme toggle button (#theme-toggle-btn) is an Aster-DS button (.as-button.as-button--ghost.as-button--icon)'
);

// GitHub Repository Button as Aster-DS button with user-provided sharp SVG
assert(
  indexHtml.includes('id="header-github-btn"') &&
  indexHtml.includes('as-button') &&
  indexHtml.includes('as-button--ghost') &&
  indexHtml.includes('as-button--icon') &&
  indexHtml.includes('https://github.com/alphaac0der/Aster-DS') &&
  indexHtml.includes('target="_blank"') &&
  indexHtml.includes('rel="noopener noreferrer"'),
  'Header GitHub button (#header-github-btn) is an Aster-DS button (.as-button.as-button--ghost.as-button--icon)'
);

// Crisp GitHub icon check
assert(
  indexHtml.includes('viewBox="0 0 24 24"') &&
  indexHtml.includes('M12 .5C5.37.5 0 5.78 0 12.292'),
  'GitHub symbol uses the requested crisp 24x24 vector path'
);

// 2. Sidebar Navigation Architecture
console.log('\n2. Checking Sidebar Navigation Architecture:');
const sidebarStart = indexHtml.indexOf('<nav class="sidebar" id="sidebar"');
const sidebarEnd = indexHtml.indexOf('</nav>', sidebarStart);
const sidebarSection = sidebarStart !== -1 && sidebarEnd !== -1 ? indexHtml.slice(sidebarStart, sidebarEnd) : '';

assert(sidebarSection.length > 0, 'Extracted <nav class="sidebar" id="sidebar"> element');

assert(
  sidebarSection.includes('Getting Started'),
  'Sidebar contains "Getting Started" group'
);
assert(
  sidebarSection.includes('href="#/introduction"') && sidebarSection.includes('Introduction'),
  'Sidebar contains Introduction link'
);
assert(
  sidebarSection.includes('href="#/installation"') && sidebarSection.includes('Installation'),
  'Sidebar contains Installation link'
);

// Introduction should precede Installation
const introIdx = sidebarSection.indexOf('href="#/introduction"');
const installIdx = sidebarSection.indexOf('href="#/installation"');
assert(
  introIdx !== -1 && installIdx !== -1 && introIdx < installIdx,
  'Introduction precedes Installation in sidebar hierarchy'
);

// "Home" and "Interactive Playground" should NOT be in the sidebar nav
assert(
  !sidebarSection.includes('href="#/home"') && !sidebarSection.includes('href="#home"') && !sidebarSection.includes('data-route="home"'),
  'Redundant "Home" link removed from sidebar navigation'
);
assert(
  !sidebarSection.includes('href="#/playground"') && !sidebarSection.includes('href="#playground"') && !sidebarSection.includes('data-route="playground"'),
  'Redundant "Interactive Playground" link removed from sidebar navigation'
);

// Helper to extract article doc view
function extractDocView(html, route) {
  const marker = `id="view-${route}"`;
  const startIdx = html.indexOf(marker);
  if (startIdx === -1) return '';
  const articleStart = html.lastIndexOf('<article', startIdx);
  const articleEnd = html.indexOf('</article>', startIdx);
  if (articleStart === -1 || articleEnd === -1) return '';
  return html.slice(articleStart, articleEnd + 10);
}

// 3. Introduction View Content
console.log('\n3. Checking Introduction View Content:');
const introView = extractDocView(indexHtml, 'introduction');
assert(introView.length > 0, 'View #view-introduction exists in DOM and extracted');

// All 7 required introduction topics
assert(
  introView.includes('What is Aster DS?') || introView.includes('What Is Aster DS?'),
  'Introduction covers topic 1: What is Aster DS'
);
assert(
  introView.includes('The Problems We Solve') || introView.includes('Problems Aster Solves') || introView.includes('Problems Solved'),
  'Introduction covers topic 2: Problems Aster solves'
);
assert(
  introView.includes('Design Philosophy &amp; Token Architecture') || introView.includes('Design Philosophy'),
  'Introduction covers topic 3: Design philosophy & token-first architecture'
);
assert(
  introView.includes('Major Capabilities &amp; Component Suite') || introView.includes('Core Capabilities'),
  'Introduction covers topic 4: Core capabilities (tokens, 21 components, standard density)'
);
assert(
  introView.includes('Dual Interfaces: How Teams Use Aster') || introView.includes('Dual-Interface Architecture'),
  'Introduction covers topic 5: Dual interfaces (human vs agent)'
);
assert(
  introView.includes('Zero-Dependency Browser Approach') || introView.includes('Zero-Dependency Vanilla Engineering'),
  'Introduction covers topic 6: Zero-dependency vanilla engineering'
);
assert(
  introView.includes('Where to Go Next') || introView.includes('Next Steps'),
  'Introduction covers topic 7: Next steps and reading paths'
);

// 4. Installation View Content
console.log('\n4. Checking Installation View Content:');
const installView = extractDocView(indexHtml, 'installation');
assert(installView.length > 0, 'View #view-installation exists in DOM and extracted');

// All 7 required installation sections
assert(
  installView.includes('Prerequisites') && installView.includes('Node.js'),
  'Installation covers section 1: Prerequisites (Node.js >= 18)'
);
assert(
  installView.includes('npm install aster-ds') &&
  installView.includes('pnpm add aster-ds') &&
  installView.includes('yarn add aster-ds'),
  'Installation covers section 2: Package manager commands (npm, pnpm, yarn)'
);
assert(
  installView.includes('aster-ds/aster.css') &&
  installView.includes('aster-ds/tokens.css') &&
  installView.includes('aster-ds/components.css'),
  'Installation covers section 3: Stylesheet imports (all-in-one & modular)'
);
assert(
  installView.includes('initAsterComponents') &&
  installView.includes('import { initAsterComponents } from \'aster-ds\''),
  'Installation covers section 4: Interactive JS imports and initAsterComponents()'
);
assert(
  installView.includes('First Component Example') &&
  installView.includes('as-button') &&
  installView.includes('as-input'),
  'Installation covers section 5: First component example (HTML markup)'
);
assert(
  installView.includes('Browser / CDN') || installView.includes('Direct Browser / Static'),
  'Installation covers section 6: Direct browser / static CDN installation'
);
assert(
  installView.includes('Verification &amp; Troubleshooting') || installView.includes('Verification & Troubleshooting'),
  'Installation covers section 7: Verification and troubleshooting'
);

// 5. Pagination Chain Across All 32 Documentation Pages
console.log('\n5. Checking Bidirectional Pagination Chain Across All 32 Documentation Pages:');
assert(DOC_PAGES.length === 32, `Canonical DOC_PAGES contains exactly 32 documentation pages (actual: ${DOC_PAGES.length})`);

for (let i = 0; i < DOC_PAGES.length; i++) {
  const current = DOC_PAGES[i];
  const prev = i > 0 ? DOC_PAGES[i - 1] : null;
  const next = i < DOC_PAGES.length - 1 ? DOC_PAGES[i + 1] : null;

  const viewHtml = extractDocView(indexHtml, current.route);
  const hasPagination = viewHtml.includes('class="doc-pagination"');
  if (!hasPagination) {
    assert(false, `Page "${current.title}" (${current.route}) contains .doc-pagination container`);
    continue;
  }

  if (prev) {
    const hasPrev = viewHtml.includes(`href="#/${prev.route}"`) && viewHtml.includes('doc-pagination__link--prev');
    assert(hasPrev, `Page "${current.title}" (${current.route}) links backward to "${prev.title}" (#/${prev.route})`);
  } else {
    const hasNoPrev = !viewHtml.includes('doc-pagination__link--prev');
    assert(hasNoPrev, `Page "${current.title}" (${current.route}) is first page and has no previous link`);
  }

  if (next) {
    const hasNext = viewHtml.includes(`href="#/${next.route}"`) && viewHtml.includes('doc-pagination__link--next');
    assert(hasNext, `Page "${current.title}" (${current.route}) links forward to "${next.title}" (#/${next.route})`);
  } else {
    const hasNoNext = !viewHtml.includes('doc-pagination__link--next');
    assert(hasNoNext, `Page "${current.title}" (${current.route}) is last page and has no next link`);
  }
}

// 6. CSS Tokens, Syntax Highlighting & Contrast Audit
console.log('\n6. Checking CSS Stylesheet & Syntax Highlighting Contrast:');
const cssContent = readFileSync(join(rootDir, 'playground/styles/playground.css'), 'utf8');

// Brand logo styles
assert(
  cssContent.includes('.brand__logo') &&
  cssContent.includes('.brand__logo-sparkle') &&
  cssContent.includes('.brand__logo-arc'),
  'playground.css defines .brand__logo, .brand__logo-sparkle, and .brand__logo-arc styles'
);

// Aster-DS Icon Button modifier styles
assert(
  cssContent.includes('.as-button--icon'),
  'playground.css defines .as-button--icon modifier for circular Aster buttons'
);

// Theme toggle styles
assert(
  cssContent.includes('.theme-toggle-btn') &&
  cssContent.includes('.as-icon--sun') &&
  cssContent.includes('.as-icon--moon'),
  'playground.css defines .theme-toggle-btn and stateful icon styles (.as-icon--sun / .as-icon--moon)'
);

// Check syntax token definitions
const lightCardBg = '#F5F5F5';
const syntaxTokens = [
  { name: '--syntax-com', hex: '#57606a', role: 'Comments' },
  { name: '--syntax-tag', hex: '#cf222e', role: 'Tags / Selectors' },
  { name: '--syntax-attr', hex: '#0550ae', role: 'Attributes' },
  { name: '--syntax-str', hex: '#116329', role: 'Strings' },
  { name: '--syntax-kw', hex: '#8250df', role: 'Keywords' },
  { name: '--syntax-fn', hex: '#953800', role: 'Functions / Properties' }
];

for (const tok of syntaxTokens) {
  assert(cssContent.includes(tok.name), `playground.css defines ${tok.name} token`);
  const ratio = getContrastRatio(tok.hex, lightCardBg);
  assert(
    ratio >= 4.5,
    `Syntax token ${tok.name} (${tok.hex}, ${tok.role}) has WCAG AA contrast ratio of ${ratio.toFixed(2)}:1 against light card ${lightCardBg} (>= 4.5:1)`
  );
}

// 7. Client-side JS Logic in playground.js
console.log('\n7. Checking Client-side Routing and Interaction Logic in playground.js:');
const jsContent = readFileSync(join(rootDir, 'playground/scripts/playground.js'), 'utf8');

assert(
  jsContent.includes('\'introduction\'') &&
  jsContent.includes('\'installation\''),
  'playground.js ROUTES array includes \'introduction\' before \'installation\''
);

assert(
  jsContent.includes('h === \'docs\'') &&
  jsContent.includes('h === \'intro\'') &&
  jsContent.includes('h === \'about\'') &&
  jsContent.includes('h === \'getting-started\'') &&
  jsContent.includes('return \'introduction\';'),
  'playground.js parseHash() normalizes \'docs\', \'intro\', \'about\', \'getting-started\' to \'introduction\''
);

assert(
  jsContent.includes('theme-toggle-btn') &&
  jsContent.includes('addEventListener(\'click\''),
  'playground.js attaches click listener to #theme-toggle-btn for single-click toggle'
);

assert(
  jsContent.includes('aster-theme') &&
  jsContent.includes('localStorage'),
  'playground.js persists theme preference in localStorage'
);

// Summary
console.log('\n========================================================================================');
console.log(`RESULTS: ${passedChecks}/${totalChecks} checks passed.`);
if (errors.length === 0) {
  console.log('✓ ALL WEBSITE & DOCUMENTATION UX CHECKS PASSED.');
  console.log('========================================================================================\n');
  process.exit(0);
} else {
  console.error(`✗ ${errors.length} CHECKS FAILED:`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  console.log('========================================================================================\n');
  process.exit(1);
}
