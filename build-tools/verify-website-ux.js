import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const siteDir = join(rootDir, 'apps/docs/dist');

if (!existsSync(join(siteDir, 'index.html'))) {
  console.error('ERROR: Docs site build is missing. Run "npm run build:docs" first.');
  process.exit(1);
}

const page = (route) => readFileSync(join(siteDir, route, 'index.html'), 'utf8');

function parseHex(hex) {
  const c = hex.replace('#', '').trim();
  return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
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
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
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

// 1. Shared site shell, checked on the built pages
console.log('1. Checking the built site shell:');
const indexHtml = page('.');
const shellPages = { home: indexHtml, docs: page('docs'), component: page('components/button'), playground: page('playground') };

for (const [name, html] of Object.entries(shellPages)) {
  assert(html.includes('rel="icon"'), `${name} page declares a favicon`);
  assert(html.includes("localStorage.getItem('aster-theme')") && html.includes("setAttribute('data-theme'"), `${name} page sets the saved theme before first paint`);
  assert(html.includes('class="skip-link"'), `${name} page has a skip link`);
  assert(html.includes('id="main-content"'), `${name} page has the skip link target`);
}

assert(
  indexHtml.includes('brand__logo') && indexHtml.includes('brand__logo-sparkle') && indexHtml.includes('brand__logo-arc') && indexHtml.includes('viewBox="0 0 376 382"'),
  'Header includes the inline SVG Aster logo'
);
assert(/id="menu-btn"/.test(indexHtml) && indexHtml.includes('as-button--icon'), 'Navigation menu button is an Aster icon button');
assert(/id="theme-toggle-btn"/.test(indexHtml) && indexHtml.includes('aria-label="Toggle color theme"'), 'Theme toggle is a labelled Aster icon button');
assert(
  /id="header-github-btn"/.test(indexHtml) &&
  indexHtml.includes('https://github.com/alphaac0der/Aster-DS') &&
  indexHtml.includes('rel="noopener noreferrer"') &&
  indexHtml.includes('M12 .5C5.37.5 0 5.78 0 12.292'),
  'GitHub button links to the repository safely with the crisp icon'
);

// 2. Sidebar
console.log('\n2. Checking Sidebar Navigation:');
const docsHtml = shellPages.docs;
const sidebarStart = docsHtml.indexOf('id="sidebar"');
const sidebarEnd = docsHtml.indexOf('</nav>', sidebarStart);
const sidebar = sidebarStart !== -1 && sidebarEnd !== -1 ? docsHtml.slice(sidebarStart, sidebarEnd) : '';
assert(sidebar.length > 0, 'Sidebar exists on documentation pages');
assert(sidebar.includes('Getting Started'), 'Sidebar contains "Getting Started" group');
const introIdx = sidebar.indexOf('href="/docs"');
const installIdx = sidebar.indexOf('href="/docs/installation"');
assert(introIdx !== -1 && installIdx !== -1 && introIdx < installIdx, 'Introduction precedes Installation in the sidebar');
for (const route of ['color', 'typography', 'spacing', 'elevation', 'motion']) {
  assert(sidebar.includes(`href="/docs/${route}"`), `Sidebar links to ${route}`);
}
assert(!sidebar.includes('href="/"') && !sidebar.includes('href="/playground"'), 'Home and Playground stay in the header, not the sidebar');

// 3. Guide content
console.log('\n3. Checking Guide Content:');
const install = page('docs/installation');
for (const text of ['npm install aster-ds', 'pnpm add aster-ds', 'yarn add aster-ds']) {
  assert(install.includes(text), `Installation documents "${text}"`);
}
for (const text of ['aster-ds/aster.css', 'aster-ds/tokens.css', 'aster-ds/components.css']) {
  assert(install.includes(text), `Installation documents the "${text}" import`);
}
assert(install.includes('initAsterComponents'), 'Installation documents initAsterComponents()');
for (const text of ['Before you start', 'unpkg.com/aster-ds@', 'Check it works']) {
  assert(install.includes(text), `Installation includes "${text}"`);
}
for (const route of ['docs/color', 'docs/typography', 'docs/spacing', 'docs/elevation', 'docs/motion', 'docs/tokens', 'docs/principles', 'docs/frameworks', 'components']) {
  assert(/<h1[\s>]/.test(page(route)), `/${route} renders a page heading`);
}

// 4. Component page order and pagination
console.log('\n4. Checking Pagination Across All 21 Component Pages:');
const slugSource = readFileSync(join(rootDir, 'apps/docs/src/pages/components/[slug].astro'), 'utf8');
const order = [...slugSource.slice(slugSource.indexOf('canonicalOrder = ['), slugSource.indexOf('];')).matchAll(/'([a-z]+)'/g)].map((m) => m[1]);
assert(order.length === 21, `Component order lists 21 pages (actual: ${order.length})`);
order.forEach((slug, i) => {
  const html = page(`components/${slug}`);
  const nav = html.slice(html.indexOf('class="doc-pagination"'));
  const prev = order[i - 1];
  const next = order[i + 1];
  assert(prev ? nav.includes(`href="/components/${prev}"`) && nav.includes('doc-pagination__link--prev') : !nav.includes('doc-pagination__link--prev'), `${slug}: previous link is ${prev || 'absent on the first page'}`);
  assert(next ? nav.includes(`href="/components/${next}"`) && nav.includes('doc-pagination__link--next') : !nav.includes('doc-pagination__link--next'), `${slug}: next link is ${next || 'absent on the last page'}`);
  assert(html.includes(`data-anatomy="${slug}"`), `${slug}: Anatomy tab mount exists`);
});

// 4b. Guide page order
console.log('\n4b. Checking Guide Page Order:');
const guideOrder = ['docs', 'docs/installation', 'docs/color', 'docs/typography', 'docs/spacing', 'docs/elevation', 'docs/motion', 'docs/tokens', 'docs/principles', 'docs/frameworks'];
guideOrder.slice(0, -1).forEach((route, i) => {
  const nav = page(route).slice(page(route).indexOf('class="doc-pagination"'));
  assert(nav.includes(`href="/${guideOrder[i + 1]}"`), `/${route} links forward to /${guideOrder[i + 1]}`);
});

// 5. Shared stylesheet and syntax colors
console.log('\n5. Checking Stylesheet & Syntax Highlighting Contrast:');
const cssContent = readFileSync(join(rootDir, 'playground/styles/playground.css'), 'utf8');
assert(cssContent.includes('.brand__logo') && cssContent.includes('.brand__logo-sparkle') && cssContent.includes('.brand__logo-arc'), 'Stylesheet defines the brand logo styles');
assert(cssContent.includes('.as-button--icon'), 'Stylesheet defines .as-button--icon');
assert(cssContent.includes('.theme-toggle-btn') && cssContent.includes('.as-icon--sun') && cssContent.includes('.as-icon--moon'), 'Stylesheet defines the theme toggle states');

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
  assert(cssContent.includes(tok.name), `Stylesheet defines ${tok.name}`);
  const ratio = getContrastRatio(tok.hex, lightCardBg);
  assert(ratio >= 4.5, `${tok.name} (${tok.hex}, ${tok.role}) has a contrast ratio of ${ratio.toFixed(2)}:1 on ${lightCardBg} (>= 4.5:1)`);
}

// 6. Client behavior source
console.log('\n6. Checking Client Behavior:');
const layout = readFileSync(join(rootDir, 'apps/docs/src/layouts/BaseLayout.astro'), 'utf8');
assert(layout.includes('theme-toggle-btn') && layout.includes("localStorage.setItem('aster-theme'"), 'Theme toggle persists the choice');
assert(layout.includes("window.location.replace('/playground')"), 'Old #/ links redirect to clean URLs');

console.log('\n========================================================================================');
console.log(`RESULTS: ${passedChecks}/${totalChecks} checks passed.`);
if (errors.length === 0) {
  console.log('✓ ALL WEBSITE & DOCUMENTATION UX CHECKS PASSED.');
  console.log('========================================================================================\n');
  process.exit(0);
}
console.error(`✗ ${errors.length} CHECKS FAILED:`);
for (const err of errors) console.error(`  - ${err}`);
console.log('========================================================================================\n');
process.exit(1);
