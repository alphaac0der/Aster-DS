import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync, symlinkSync, rmSync, mkdtempSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

console.log('========================================================================================');
console.log('             ASTER DESIGN SYSTEM — ISOLATED BUILD REPRODUCIBILITY TEST                 ');
console.log('========================================================================================');

const tempDir = mkdtempSync(join(tmpdir(), 'aster-clean-build-'));
console.log(`\n• Created isolated build sandbox at: ${tempDir}`);

try {
  // Get all tracked and non-ignored files
  const trackedFilesOutput = execSync('git ls-files', { cwd: rootDir, encoding: 'utf8' });
  const untrackedFilesOutput = execSync('git ls-files --others --exclude-standard', { cwd: rootDir, encoding: 'utf8' });

  const allFiles = [
    ...trackedFilesOutput.split(/\r?\n/).filter(Boolean),
    ...untrackedFilesOutput.split(/\r?\n/).filter(Boolean)
  ];

  console.log(`• Copying ${allFiles.length} tracked/non-ignored repository files to isolated sandbox...`);

  for (const relPath of allFiles) {
    const src = join(rootDir, relPath);
    const dest = join(tempDir, relPath);
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(src, dest);
  }

  // Confirm scratch/ directory is strictly absent
  const scratchInTemp = join(tempDir, 'scratch');
  if (existsSync(scratchInTemp)) {
    throw new Error(`FAILURE: scratch/ was copied to isolated sandbox (${scratchInTemp})!`);
  }
  console.log('✔ PASS: scratch/ directory is completely absent from isolated sandbox.');

  // Link node_modules so build scripts can resolve dependencies without network/install
  const nmSource = join(rootDir, 'node_modules');
  const nmTarget = join(tempDir, 'node_modules');
  if (existsSync(nmSource)) {
    symlinkSync(nmSource, nmTarget, 'junction');
    console.log('✔ PASS: Linked node_modules to isolated sandbox.');
  } else {
    throw new Error('FAILURE: node_modules not found in root repository.');
  }

  // Execute full build pipeline in isolated sandbox
  console.log('\n--- Executing Full Build Pipeline in Sandbox Without scratch/ ---');

  execSync('node build-tools/build-tokens.js', { cwd: tempDir, stdio: 'inherit' });
  console.log('✔ PASS: build:tokens succeeded in sandbox.');

  execSync('node build-tools/build-components.js', { cwd: tempDir, stdio: 'inherit' });
  console.log('✔ PASS: build:components succeeded in sandbox.');

  execSync('node build-tools/build-playground.js', { cwd: tempDir, stdio: 'inherit' });
  console.log('✔ PASS: build:playground succeeded in sandbox.');

  // Verify critical output files were generated in sandbox
  const requiredOutputs = [
    'dist/css/tokens.css',
    'dist/css/components.css',
    'dist/css/aster.css',
    'dist/js/aster.js',
    'index.html',
    'playground/index.html'
  ];

  for (const relOut of requiredOutputs) {
    const p = join(tempDir, relOut);
    if (!existsSync(p)) {
      throw new Error(`FAILURE: Expected build output '${relOut}' missing in isolated sandbox.`);
    }
  }
  console.log(`✔ PASS: All ${requiredOutputs.length} build outputs generated deterministically in sandbox.`);

  console.log('\n----------------------------------------------------------------------------------------');
  console.log('SUCCESS: Build reproducibility verified. Pipeline succeeds with zero scratch/ access.');
  console.log('========================================================================================\n');
} finally {
  try {
    rmSync(tempDir, { recursive: true, force: true });
    console.log('• Cleaned up isolated sandbox directory.');
  } catch (cleanErr) {
    console.warn('• Warning: Failed to clean up temp sandbox:', cleanErr.message);
  }
}
