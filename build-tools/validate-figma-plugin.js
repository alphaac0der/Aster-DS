import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

export function validateFigmaPlugin() {
  console.log('================ Aster Figma Plugin Validator ================');

  const manifestPath = resolve(rootDir, 'tools/figma-plugin/manifest.json');
  const codePath = resolve(rootDir, 'tools/figma-plugin/code.js');

  // 1. Manifest Validation
  if (!existsSync(manifestPath)) {
    throw new Error(`Missing manifest: ${manifestPath}`);
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  if (!manifest.name || typeof manifest.name !== 'string') {
    throw new Error('Manifest missing valid "name" field');
  }
  if (!manifest.id || typeof manifest.id !== 'string') {
    throw new Error('Manifest missing valid "id" field');
  }
  if (!manifest.api || typeof manifest.api !== 'string') {
    throw new Error('Manifest missing valid "api" field');
  }
  if (manifest.main !== 'code.js') {
    throw new Error(`Manifest "main" must be "code.js", got "${manifest.main}"`);
  }
  if (!Array.isArray(manifest.editorType) || !manifest.editorType.includes('figma')) {
    throw new Error('Manifest "editorType" must include "figma"');
  }
  console.log(`✔ PASS: manifest.json is valid (Plugin: "${manifest.name}", API: ${manifest.api})`);

  // 2. Code Syntax & Parsing
  if (!existsSync(codePath)) {
    throw new Error(`Missing plugin code: ${codePath}`);
  }
  const code = readFileSync(codePath, 'utf8');

  try {
    new vm.Script(code);
    console.log('✔ PASS: code.js parsed without syntax errors.');
  } catch (parseErr) {
    throw new Error(`code.js syntax error: ${parseErr.message}`);
  }

  // 3. Payload Integrity Assertions
  function assertContains(keyword, desc) {
    if (!code.includes(keyword)) {
      throw new Error(`code.js missing required element: ${desc} ("${keyword}")`);
    }
  }

  assertContains('Aster Colors', 'Collection name for colors');
  assertContains('Aster Density', 'Collection name for density');
  assertContains('Aster Dimensions', 'Collection name for dimensions');
  assertContains('dimensions/radius/full', 'Full pill radius variable');
  assertContains('density/control/height', 'Standard control height variable');
  assertContains('semantic/color/interactive/primary', 'Primary interactive color variable');

  assertContains('Bebas Neue', 'Display typography font family');
  assertContains('Manrope', 'Sans interface font family');
  assertContains('Space Mono', 'Mono typography font family');
  assertContains('Merriweather', 'Editorial typography font family');

  assertContains('Aster / Elevation / Raised', 'Raised elevation effect style');
  assertContains('Aster / Elevation / Overlay', 'Overlay elevation effect style');

  assertContains('buildButtonComponentSet', 'Button component builder function');
  assertContains('buildInputComponentSet', 'Input component builder function');
  assertContains('buildBadgeComponentSet', 'Badge component builder function');
  assertContains('figma.combineAsVariants', 'Variant combination API call');

  // Idempotency guards
  assertContains('getLocalVariableCollections', 'Collection reuse check');
  assertContains('getLocalTextStyles', 'Text style reuse check');
  assertContains('getLocalEffectStyles', 'Effect style reuse check');
  assertContains('❖ Aster DS Library', 'Isolated library page naming');

  console.log('✔ PASS: All payload integrity and idempotency assertions PASSED.');
  console.log('================================================================');
}

if (process.argv[1] && process.argv[1].endsWith('validate-figma-plugin.js')) {
  try {
    validateFigmaPlugin();
    process.exit(0);
  } catch (err) {
    console.error('FAILED:', err.message);
    process.exit(1);
  }
}
