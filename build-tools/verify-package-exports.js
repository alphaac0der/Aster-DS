import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('========================================================================================');
console.log('            ASTER DESIGN SYSTEM — PACKAGE EXPORT & DISTRIBUTION VERIFIER                 ');
console.log('========================================================================================\n');

const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));

let failures = 0;
function assert(name, condition, detail = '') {
  if (condition) {
    console.log(`  ✔ PASS: ${name}${detail ? ` (${detail})` : ''}`);
  } else {
    console.error(`  ✖ FAIL: ${name}${detail ? ` (${detail})` : ''}`);
    failures++;
  }
}

// 1. Verify basic package metadata
assert('Package name is aster-design-system', pkg.name === 'aster-design-system', pkg.name);
assert('Package is marked private (not for publishing)', pkg.private === true);
assert('Package is configured as ES module (type: module)', pkg.type === 'module');
assert('Package main entry point declared', pkg.main === './dist/js/aster.js');
assert('Package module entry point declared', pkg.module === './dist/js/aster.js');
assert('Package style entry point declared', pkg.style === './dist/css/aster.css');

// 2. Verify all files declared in exports map exist on disk
console.log('\n--- Verifying Exports Map Targets ---');
for (const [subpath, target] of Object.entries(pkg.exports)) {
  const filePath = typeof target === 'string' ? target : (target.import || target.default);
  const fullPath = join(rootDir, filePath);
  const exists = existsSync(fullPath);
  assert(`Export '${subpath}' resolves to disk target`, exists, filePath);
}

// 3. Verify files whitelist array
console.log('\n--- Verifying Files Whitelist ---');
assert('Files array defines dist/', pkg.files.includes('dist/'));
assert('Files array defines docs/', pkg.files.includes('docs/'));
assert('Files array defines skills/', pkg.files.includes('skills/'));
assert('Files array defines README.md', pkg.files.includes('README.md'));

// 4. Test self-referencing ESM import
console.log('\n--- Testing Package Import Execution ---');
try {
  const aster = await import('aster-design-system');
  assert('Can import package root via aster-design-system', Boolean(aster));
  assert('Exports initAsterComponents()', typeof aster.initAsterComponents === 'function');
  assert('Exports setButtonLoading()', typeof aster.setButtonLoading === 'function');
  assert('Exports setFieldValidation()', typeof aster.setFieldValidation === 'function');
  assert('Exports validateInput()', typeof aster.validateInput === 'function');
  assert('Exports computeSelectionState()', typeof aster.computeSelectionState === 'function');
  assert('Exports syncTableOverflow()', typeof aster.syncTableOverflow === 'function');
  assert('Exports showToast()', typeof aster.showToast === 'function');
} catch (err) {
  assert('Self-import succeeded without error', false, err.message);
}

console.log('\n----------------------------------------------------------------------------------------');
if (failures === 0) {
  console.log('✔ All package distribution exports and resolution checks PASSED.\n');
  process.exit(0);
} else {
  console.error(`✖ Found ${failures} package export verification failure(s)!\n`);
  process.exit(1);
}
