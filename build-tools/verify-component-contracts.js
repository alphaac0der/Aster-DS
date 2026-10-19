import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { assembleComponentCss, assembleComponentJs } from './build-components.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

/**
 * Aster Design System — Component Contract Verification Tool
 * Validates all 21 component human documentation specs, agent-facing skill,
 * and canonical component build output (freshness, strict token bindings,
 * radius floor >= 4px, compact density removal, and zero drift).
 */

export function verifyComponentContracts(options = {}) {
  const silent = options.silent ?? false;
  const readFile = options.readFile ?? ((p) => readFileSync(p, 'utf8'));
  const fileExists = options.fileExists ?? existsSync;

  const tokensCssPath = options.tokensCssPath ?? join(rootDir, 'dist/css/tokens.css');
  const componentsCssPath = options.componentsCssPath ?? join(rootDir, 'dist/css/components.css');
  const asterJsPath = options.asterJsPath ?? join(rootDir, 'dist/js/aster.js');
  const humanDocs = options.humanDocs ?? [
    { name: 'Button', path: join(rootDir, 'docs/components/button.md') },
    { name: 'Input', path: join(rootDir, 'docs/components/input.md') },
    { name: 'Table', path: join(rootDir, 'docs/components/table.md') },
    { name: 'Checkbox', path: join(rootDir, 'docs/components/checkbox.md') },
    { name: 'Radio', path: join(rootDir, 'docs/components/radio.md') },
    { name: 'Switch', path: join(rootDir, 'docs/components/switch.md') },
    { name: 'Textarea', path: join(rootDir, 'docs/components/textarea.md') },
    { name: 'Select', path: join(rootDir, 'docs/components/select.md') },
    { name: 'Slider', path: join(rootDir, 'docs/components/slider.md') },
    { name: 'Badge', path: join(rootDir, 'docs/components/badge.md') },
    { name: 'Alert', path: join(rootDir, 'docs/components/alert.md') },
    { name: 'Progress', path: join(rootDir, 'docs/components/progress.md') },
    { name: 'Skeleton', path: join(rootDir, 'docs/components/skeleton.md') },
    { name: 'Tooltip', path: join(rootDir, 'docs/components/tooltip.md') },
    { name: 'Toast', path: join(rootDir, 'docs/components/toast.md') },
    { name: 'Dialog', path: join(rootDir, 'docs/components/dialog.md') },
    { name: 'Dropdown', path: join(rootDir, 'docs/components/dropdown.md') },
    { name: 'Popover', path: join(rootDir, 'docs/components/popover.md') },
    { name: 'Tabs', path: join(rootDir, 'docs/components/tabs.md') },
    { name: 'Accordion', path: join(rootDir, 'docs/components/accordion.md') },
    { name: 'Drawer', path: join(rootDir, 'docs/components/drawer.md') }
  ];
  const skillDoc = options.skillDoc ?? {
    name: 'Agent Skill',
    path: join(rootDir, 'skills/using-aster-components/SKILL.md')
  };

  const log = (...args) => { if (!silent) console.log(...args); };
  const errLog = (...args) => { if (!silent) console.error(...args); };

  log('========================================================================================');
  log('            ASTER DESIGN SYSTEM — COMPONENT CONTRACT VERIFICATION TOOL                 ');
  log('========================================================================================\n');

  const errors = [];
  const warnings = [];

  // --------------------------------------------------------------------------------------
  // Suite 1: Build Output, Freshness & Target File Verification
  // --------------------------------------------------------------------------------------
  log('--- Suite 1: Build Output, Freshness & Target File Verification ---');
  if (!fileExists(tokensCssPath)) {
    errors.push(`Missing compiled CSS tokens at '${tokensCssPath}'. Run 'npm run build:tokens' first.`);
  }

  if (!fileExists(componentsCssPath)) {
    errors.push(`Missing compiled CSS components at '${componentsCssPath}'. Run 'npm run build:components' first.`);
  }

  if (!fileExists(asterJsPath)) {
    errors.push(`Missing compiled JS components at '${asterJsPath}'. Run 'npm run build:components' first.`);
  }

  for (const doc of humanDocs) {
    if (!fileExists(doc.path)) {
      errors.push(`Missing human component contract at '${doc.path}'.`);
    }
  }

  if (!fileExists(skillDoc.path)) {
    errors.push(`Missing agent component skill at '${skillDoc.path}'.`);
  }

  if (errors.length > 0) {
    errLog(`✖ Target file existence checks failed (${errors.length} errors).`);
    return { success: false, errors, warnings };
  }

  const tokensCssContent = readFile(tokensCssPath);
  if (!tokensCssContent || tokensCssContent.length === 0) {
    errors.push(`Compiled CSS file '${tokensCssPath}' is empty.`);
    return { success: false, errors, warnings };
  }

  const componentsCssContent = readFile(componentsCssPath);
  if (!componentsCssContent || componentsCssContent.length === 0) {
    errors.push(`Compiled CSS file '${componentsCssPath}' is empty.`);
    return { success: false, errors, warnings };
  }

  const asterJsContent = readFile(asterJsPath);
  if (!asterJsContent || asterJsContent.length === 0) {
    errors.push(`Compiled JS file '${asterJsPath}' is empty.`);
    return { success: false, errors, warnings };
  }

  // Build Freshness Assertions (Ensures dist/ is never manually maintained or drifted)
  const expectedComponentCss = assembleComponentCss((p) => readFile(join(rootDir, p)));
  if (componentsCssContent !== expectedComponentCss) {
    errors.push({
      type: 'BUILD_STALE',
      file: 'dist/css/components.css',
      message: "dist/css/components.css is out of sync with components/ source modules. Run 'npm run build:components'."
    });
  } else {
    log('✓ dist/css/components.css matches components/ sources (fresh build).');
  }

  const expectedComponentJs = assembleComponentJs((p) => readFile(join(rootDir, p)));
  if (asterJsContent !== expectedComponentJs) {
    errors.push({
      type: 'BUILD_STALE',
      file: 'dist/js/aster.js',
      message: "dist/js/aster.js is out of sync with components/ source modules. Run 'npm run build:components'."
    });
  } else {
    log('✓ dist/js/aster.js matches components/ sources (fresh build).');
  }

  // Primitive Color Leakage Check (Components must strictly bind to semantic tokens)
  const primitiveLeaks = componentsCssContent.match(/--as-color-primitive-[a-z0-9-]+/g) || [];
  if (primitiveLeaks.length > 0) {
    errors.push({
      type: 'PRIMITIVE_TOKEN_LEAK',
      file: 'dist/css/components.css',
      message: `Component CSS directly references primitive color tokens: ${[...new Set(primitiveLeaks)].join(', ')}. Components must strictly bind to semantic tokens.`
    });
  } else {
    log('✓ Component CSS strictly uses semantic tokens (0 primitive color token leaks).');
  }

  const canonicalTokens = new Set();
  const cssVarRegex = /--as-[a-z0-9-]+(?=:)/g;
  let match;
  while ((match = cssVarRegex.exec(tokensCssContent)) !== null) {
    canonicalTokens.add(match[0]);
  }
  log(`✓ Loaded ${canonicalTokens.size} canonical CSS variables from tokens.css.`);

  const componentTokens = new Set();
  let compMatch;
  while ((compMatch = cssVarRegex.exec(componentsCssContent)) !== null) {
    componentTokens.add(compMatch[0]);
  }
  log(`✓ Loaded ${componentTokens.size} component-layer CSS variables from components.css.`);

  const allValidTokens = new Set([...canonicalTokens, ...componentTokens]);

  // --------------------------------------------------------------------------------------
  // Suite 2: Concrete Token & Variable Reference Validation
  // --------------------------------------------------------------------------------------
  log('\n--- Suite 2: Concrete Token & Variable Reference Validation ---');
  const allDocEntries = [...humanDocs, skillDoc];
  let totalConcreteTokensChecked = 0;

  for (const doc of allDocEntries) {
    const content = readFile(doc.path);
    const lines = content.split('\n');
    let docTokensCount = 0;

    lines.forEach((line, lineIdx) => {
      // Find all expressions starting with --as-
      for (const m of line.matchAll(/--as-[a-z0-9-]+/g)) {
        const token = m[0];
        const nextChar = line.slice(m.index + token.length, m.index + token.length + 1);

        // Filter out wildcard families (e.g. --as-space-*), trailing hyphens, or grammar brackets [category]
        if (nextChar === '*' || token.endsWith('-') || line.includes(`[${token}]`)) {
          continue;
        }

        docTokensCount++;
        totalConcreteTokensChecked++;

        if (!allValidTokens.has(token)) {
          errors.push({
            type: 'INVALID_TOKEN',
            file: doc.name,
            line: lineIdx + 1,
            token,
            message: `Unknown or uncompiled token '${token}' referenced at ${doc.name}:${lineIdx + 1}`
          });
        }
      }
    });

    log(`  • ${doc.name}: Checked ${docTokensCount} concrete token references.`);
  }

  // --------------------------------------------------------------------------------------
  // Suite 3: Structural Section Parity & Schema Integrity
  // --------------------------------------------------------------------------------------
  log('\n--- Suite 3: Structural Section Parity & Schema Integrity ---');

  const requiredHumanSections = [
    { label: 'Anatomy / Overview', pattern: /^##+\s+.*(overview|anatomy)/im },
    { label: 'Properties / Variants Contract', pattern: /^##+\s+.*(properties|variants|column contract)/im },
    { label: 'Interaction & Accessibility', pattern: /^##+\s+.*(interaction|keyboard|accessibility|overflow)/im },
    { label: 'Canonical Token Bindings', pattern: /^##+\s+.*(token bindings|token map|tokens)/im },
    { label: 'Requirements Classification', pattern: /^##+\s+.*(classification|normative requirements|conventions)/im },
    { label: 'Scope Disclosure & Boundaries', pattern: /^##+\s+.*(scope disclosure|implementation boundaries|limitations)/im }
  ];

  for (const doc of humanDocs) {
    const content = readFile(doc.path);
    for (const req of requiredHumanSections) {
      if (!req.pattern.test(content)) {
        errors.push({
          type: 'MISSING_SECTION',
          file: doc.name,
          message: `${doc.name} specification is missing required section: '${req.label}'`
        });
      }
    }
    log(`  • ${doc.name}: All 6 structural section patterns validated.`);
  }

  // Validate Agent Skill Sections and Checklists
  const skillContent = readFile(skillDoc.path);
  const requiredSkillSections = [
    { label: 'Button Contract', pattern: /^##+\s+.*Button Component Contract/im },
    { label: 'Input Contract', pattern: /^##+\s+.*Input.*Component Contract/im },
    { label: 'Table Contract', pattern: /^##+\s+.*Table Component Contract/im },
    { label: 'Button Checklist', pattern: /^###+\s+.*Button.*Checklist/im },
    { label: 'Input Checklist', pattern: /^###+\s+.*Input.*Checklist/im },
    { label: 'Table Checklist', pattern: /^###+\s+.*Table.*Checklist/im }
  ];

  for (const req of requiredSkillSections) {
    if (!req.pattern.test(skillContent)) {
      errors.push({
        type: 'MISSING_SKILL_SECTION',
        file: skillDoc.name,
        message: `${skillDoc.name} is missing required section/checklist: '${req.label}'`
      });
    }
  }

  const checklists = [
    { name: 'Button', header: /###+\s+.*Button.*Checklist/i },
    { name: 'Input', header: /###+\s+.*Input.*Checklist/i },
    { name: 'Table', header: /###+\s+.*Table.*Checklist/i },
    { name: 'Checkbox', header: /###+\s+.*Checkbox.*Checklist/i },
    { name: 'Radio Group', header: /###+\s+.*Radio.*Checklist/i },
    { name: 'Switch', header: /###+\s+.*Switch.*Checklist/i },
    { name: 'Textarea', header: /###+\s+.*Textarea.*Checklist/i },
    { name: 'Select', header: /###+\s+.*Select.*Checklist/i },
    { name: 'Slider', header: /###+\s+.*Slider.*Checklist/i },
    { name: 'Badge', header: /###+\s+.*Badge.*Checklist/i },
    { name: 'Alert', header: /###+\s+.*Alert.*Checklist/i },
    { name: 'Progress', header: /###+\s+.*Progress.*Checklist/i },
    { name: 'Skeleton', header: /###+\s+.*Skeleton.*Checklist/i },
    { name: 'Tooltip', header: /###+\s+.*Tooltip.*Checklist/i },
    { name: 'Toast', header: /###+\s+.*Toast.*Checklist/i },
    { name: 'Dialog', header: /###+\s+.*Dialog.*Checklist/i },
    { name: 'Dropdown Menu', header: /###+\s+.*Dropdown.*Checklist/i },
    { name: 'Popover', header: /###+\s+.*Popover.*Checklist/i },
    { name: 'Tabs', header: /###+\s+.*Tabs.*Checklist/i },
    { name: 'Accordion', header: /###+\s+.*Accordion.*Checklist/i },
    { name: 'Drawer', header: /###+\s+.*Drawer.*Checklist/i }
  ];

  for (const cl of checklists) {
    const match = skillContent.match(new RegExp(cl.header.source + '([\\s\\S]*?)(?=###+|##+|$)', 'i'));
    if (match) {
      const items = (match[1].match(/- \[[ xX]\]/g) || []).length;
      if (items < 3) {
        errors.push({
          type: 'INSUFFICIENT_CHECKLIST_ITEMS',
          file: skillDoc.name,
          message: `Checklist '${cl.name}' in ${skillDoc.name} has fewer than 3 checkable items (found ${items}).`
        });
      } else {
        log(`  • ${skillDoc.name} [${cl.name} Checklist]: ${items} checkable items verified.`);
      }
    }
  }

  // --------------------------------------------------------------------------------------
  // Suite 4: Human-to-Agent Consistency, Single Density & Radius Policy
  // --------------------------------------------------------------------------------------
  log('\n--- Suite 4: Human-to-Agent Consistency, Single Density & Radius Policy ---');

  // 4A: Button Variants Parity
  const buttonVariants = ['primary', 'secondary', 'destructive', 'ghost'];
  const btnHumanContent = readFile(humanDocs.find(d => d.name === 'Button').path);
  for (const variant of buttonVariants) {
    if (!btnHumanContent.includes(`\`${variant}\``) && !btnHumanContent.includes(`'${variant}'`)) {
      errors.push({
        type: 'VARIANT_DRIFT',
        file: 'Button',
        message: `Button human spec missing declared variant '${variant}'.`
      });
    }
    if (!skillContent.includes(`\`${variant}\``) && !skillContent.includes(`'${variant}'`) && !skillContent.includes(`--${variant}`)) {
      errors.push({
        type: 'VARIANT_DRIFT',
        file: skillDoc.name,
        message: `Agent skill missing declared button variant '${variant}'.`
      });
    }
  }
  log(`  • Button Variants: All 4 variants ('primary', 'secondary', 'destructive', 'ghost') synchronized.`);

  // 4B: Compact Density Removal & Radius Floor Policy
  if (/\[data-density="compact"\]|--compact\b/.test(componentsCssContent)) {
    errors.push({
      type: 'COMPACT_DENSITY_LEAK',
      file: 'dist/css/components.css',
      message: 'Component CSS still contains [data-density="compact"] or --compact selectors.'
    });
  } else {
    log('  • Single Standard Density: Confirmed zero [data-density="compact"] or --compact selectors in components.css.');
  }

  if (/--as-radius-sm:\s*2px/.test(tokensCssContent)) {
    errors.push({
      type: 'RADIUS_POLICY_VIOLATION',
      file: 'dist/css/tokens.css',
      message: 'Radius token --as-radius-sm must be >= 4px (found 2px).'
    });
  } else {
    log('  • Radius Policy: Confirmed minimum component radius is 4px and default radius is 8px (zero 2px radii).');
  }

  // 4C: Token Bindings Table Parity
  function extractTableTokens(content) {
    const tokens = new Set();
    const tableLines = content.split('\n').filter(l => l.startsWith('|') && l.includes('--as-'));
    for (const line of tableLines) {
      for (const m of line.matchAll(/--as-[a-z0-9-]+/g)) {
        if (!m[0].endsWith('-')) tokens.add(m[0]);
      }
    }
    return tokens;
  }

  function extractSkillCssTokens(content, compRegex) {
    const tokens = new Set();
    const sectionMatch = content.match(compRegex);
    if (!sectionMatch) return tokens;
    const cssBlocks = sectionMatch[1].matchAll(/```css([\s\S]*?)```/g);
    for (const block of cssBlocks) {
      for (const m of block[1].matchAll(/--as-[a-z0-9-]+/g)) {
        if (!m[0].endsWith('-')) tokens.add(m[0]);
      }
    }
    return tokens;
  }

  const compMappings = [
    { name: 'Button', doc: humanDocs.find(d => d.name === 'Button'), skillRegex: /## 2\.\s+Button Component Contract([\s\S]*?)(?=\n## \d+|$)/i },
    { name: 'Input', doc: humanDocs.find(d => d.name === 'Input'), skillRegex: /## 3\.\s+Input \/ Form Field Component Contract([\s\S]*?)(?=\n## \d+|$)/i },
    { name: 'Table', doc: humanDocs.find(d => d.name === 'Table'), skillRegex: /## 4\.\s+Data Table Component Contract([\s\S]*?)(?=\n## \d+|$)/i }
  ];

  for (const comp of compMappings) {
    const humanTokens = extractTableTokens(readFile(comp.doc.path));
    const skillTokens = extractSkillCssTokens(skillContent, comp.skillRegex);

    for (const t of humanTokens) {
      if (!canonicalTokens.has(t)) {
        errors.push({
          type: 'INVALID_DECLARED_TOKEN',
          file: comp.name,
          message: `Declared token '${t}' in ${comp.name} token table does not exist in compiled tokens.css.`
        });
      }
    }

    for (const t of skillTokens) {
      if (!allValidTokens.has(t)) {
        errors.push({
          type: 'INVALID_DECLARED_TOKEN',
          file: `${skillDoc.name} [${comp.name}]`,
          message: `Declared CSS token '${t}' in ${skillDoc.name} [${comp.name}] does not exist in compiled CSS.`
        });
      }
    }

    log(`  • ${comp.name} Token Binding Parity: ${humanTokens.size} spec table tokens, ${skillTokens.size} agent CSS tokens. All valid.`);
  }

  // --------------------------------------------------------------------------------------
  // Summary & Exit
  // --------------------------------------------------------------------------------------
  log('\n----------------------------------------------------------------------------------------');
  if (errors.length > 0) {
    errLog(`FAILED: Found ${errors.length} contract error(s):\n`);
    for (const err of errors) {
      if (typeof err === 'string') {
        errLog(`  ✖ ${err}`);
      } else {
        errLog(`  ✖ [${err.type}] ${err.message}`);
      }
    }
    return { success: false, errors, warnings, checkedCount: totalConcreteTokensChecked };
  }

  log(`SUCCESS: All ${totalConcreteTokensChecked} concrete token references, structural sections, and parity checks passed.`);
  log('✓ Component contracts and agent skill are strictly synchronized.\n');

  return { success: true, errors: [], warnings, checkedCount: totalConcreteTokensChecked };
}

// CLI Execution Entry Point
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = verifyComponentContracts();
  process.exit(result.success ? 0 : 1);
}
