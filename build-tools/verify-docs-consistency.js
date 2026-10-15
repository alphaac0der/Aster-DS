import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const tokensCssPath = join(rootDir, 'dist/css/tokens.css');
const docFiles = [
  join(rootDir, 'docs/tokens.md'),
  join(rootDir, 'skills/using-aster-tokens/SKILL.md')
];

console.log('========================================================================================');
console.log('               ASTER DESIGN SYSTEM — DOCUMENTATION CONSISTENCY CHECKER                 ');
console.log('========================================================================================\n');

// 1. Verify CSS build output exists
if (!existsSync(tokensCssPath)) {
  console.error(`ERROR: Build output missing at '${tokensCssPath}'.`);
  console.error('Please run "npm run build:tokens" before verifying documentation consistency.\n');
  process.exit(1);
}

// 2. Verify build output freshness against tokens/ directory
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = readdirSync(dirPath);
  for (const file of files) {
    const fullPath = join(dirPath, file);
    if (statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.json')) {
      arrayOfFiles.push(fullPath);
    }
  }
  return arrayOfFiles;
}

const tokenSourceFiles = getAllFiles(join(rootDir, 'tokens'));
const cssMtime = statSync(tokensCssPath).mtimeMs;

let stale = false;
let newestFile = '';
for (const file of tokenSourceFiles) {
  const fileMtime = statSync(file).mtimeMs;
  if (fileMtime > cssMtime) {
    stale = true;
    newestFile = file;
    break;
  }
}

if (stale) {
  console.error(`ERROR: Build output 'dist/css/tokens.css' is stale.`);
  console.error(`Token source file '${newestFile}' was modified after the last compilation.`);
  console.error('Please run "npm run build:tokens" before testing documentation consistency.\n');
  process.exit(1);
}

// 3. Extract all valid CSS custom property names from dist/css/tokens.css
const cssContent = readFileSync(tokensCssPath, 'utf8');
const validTokens = new Set();
const cssVarRegex = /--as-[a-z0-9-]+(?=:)/g;
let match;
while ((match = cssVarRegex.exec(cssContent)) !== null) {
  validTokens.add(match[0]);
}

console.log(`✓ Loaded ${validTokens.size} canonical CSS variables from dist/css/tokens.css.`);

// 4. Inspect documentation files for referenced CSS variables
let totalReferences = 0;
let totalPatterns = 0;
let invalidReferences = 0;
const errors = [];

// Matches token expressions starting with --as-
// Captures concrete variables, wildcards (*), and grammar templates ([category])
const tokenExprRegex = /--as-[a-z0-9-]+(?:\*|\[[a-z0-9-]+\])?/g;

for (const docPath of docFiles) {
  if (!existsSync(docPath)) {
    console.error(`ERROR: Target documentation file missing at '${docPath}'.`);
    process.exit(1);
  }

  const content = readFileSync(docPath, 'utf8');
  const lines = content.split('\n');

  console.log(`\nChecking: ${docPath.replace(rootDir, '').replace(/^[\\/]/, '')}`);

  const fileTokensSeen = new Set();
  const filePatternsSeen = new Set();

  lines.forEach((line, index) => {
    let match;
    while ((match = tokenExprRegex.exec(line)) !== null) {
      const expr = match[0];

      // Identify family wildcards (e.g. --as-space-*) and grammar templates (e.g. --as-[category])
      const isPattern = expr.endsWith('*') || expr.endsWith('-') || expr.includes('[') || expr.includes(']');
      if (isPattern) {
        totalPatterns++;
        filePatternsSeen.add(expr);
        continue;
      }

      totalReferences++;
      fileTokensSeen.add(expr);

      if (!validTokens.has(expr)) {
        invalidReferences++;
        errors.push({
          file: docPath.replace(rootDir, '').replace(/^[\\/]/, ''),
          line: index + 1,
          token: expr
        });
      }
    }
  });

  console.log(`  • Found ${fileTokensSeen.size} unique CSS variable references across ${lines.length} lines.`);
  console.log(`  • Recognized ${filePatternsSeen.size} token family/grammar pattern(s) (${Array.from(filePatternsSeen).join(', ')}).`);
}

console.log('\n----------------------------------------------------------------------------------------');
if (invalidReferences > 0) {
  console.error(`FAILED: Found ${invalidReferences} invalid or uncompiled token reference(s):\n`);
  for (const err of errors) {
    console.error(`  ✖ ${err.file}:${err.line} -> Unknown variable: '${err.token}'`);
  }
  console.error('\nPlease update the documentation to match the canonical tokens in tokens/ and dist/css/tokens.css.\n');
  process.exit(1);
} else {
  console.log(`SUCCESS: All ${totalReferences} token references across documentation files are valid.`);
  console.log('✓ Documentation is strictly synchronized with production CSS variables.\n');
  process.exit(0);
}
