import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

function hexToRgba(hex) {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return { r, g, b, a: 1 };
}

function rgbaRoughEqual(a, b, epsilon = 0.0001) {
  if (!a || !b) return false;
  return (
    Math.abs(a.r - b.r) < epsilon &&
    Math.abs(a.g - b.g) < epsilon &&
    Math.abs(a.b - b.b) < epsilon &&
    Math.abs(a.a - b.a) < epsilon
  );
}

export function validateFigmaTokens() {
  console.log('================ Aster Figma Payload Validator ================');
  let errors = [];
  let warnings = [];

  const colorsFile = resolve(rootDir, 'dist/figma/aster-colors.json');
  const densityFile = resolve(rootDir, 'dist/figma/aster-density.json');
  const dimensionsFile = resolve(rootDir, 'dist/figma/aster-dimensions.json');

  if (!existsSync(colorsFile)) {
    errors.push(`Missing generated file: ${colorsFile}. Run "npm run export:figma" first.`);
  }
  if (!existsSync(densityFile)) {
    errors.push(`Missing generated file: ${densityFile}. Run "npm run export:figma" first.`);
  }
  if (!existsSync(dimensionsFile)) {
    errors.push(`Missing generated file: ${dimensionsFile}. Run "npm run export:figma" first.`);
  }

  if (errors.length > 0) {
    for (const err of errors) console.error(`✖ ${err}`);
    process.exit(1);
  }

  const colorsDoc = JSON.parse(readFileSync(colorsFile, 'utf8'));
  const densityDoc = JSON.parse(readFileSync(densityFile, 'utf8'));
  const dimensionsDoc = JSON.parse(readFileSync(dimensionsFile, 'utf8'));

  // -------------------------------------------------------------
  // 1. Validate "Aster Colors"
  // -------------------------------------------------------------
  console.log('Checking: dist/figma/aster-colors.json ...');

  if (colorsDoc.id !== 'VariableCollectionId:1001:1') {
    errors.push(`Aster Colors has unexpected ID "${colorsDoc.id}". Expected "VariableCollectionId:1001:1".`);
  }
  if (colorsDoc.name !== 'Aster Colors') {
    errors.push(`Aster Colors has unexpected name "${colorsDoc.name}". Expected "Aster Colors".`);
  }

  // Check modes
  const expectedColorModes = {
    '1001:0': 'Light',
    '1001:1': 'Dark'
  };
  const actualColorModes = colorsDoc.modes || {};
  for (const [modeId, modeName] of Object.entries(expectedColorModes)) {
    if (actualColorModes[modeId] !== modeName) {
      errors.push(`Aster Colors mode mismatch: expected "${modeId}": "${modeName}", found "${actualColorModes[modeId]}".`);
    }
  }

  // Check variables list & ID uniqueness
  const colorVarIdSet = new Set();
  const colorVarMap = new Map();

  for (const v of colorsDoc.variables || []) {
    // ID format check
    if (!/^VariableID:1001:\d+$/.test(v.id)) {
      errors.push(`Variable "${v.name}" has invalid ID format: "${v.id}". Expected "VariableID:1001:<positive-int>".`);
    }
    if (colorVarIdSet.has(v.id)) {
      errors.push(`Duplicate variable ID found in Aster Colors: "${v.id}" (name: ${v.name}).`);
    }
    colorVarIdSet.add(v.id);
    colorVarMap.set(v.id, v);

    // Type check
    if (v.type !== 'COLOR') {
      errors.push(`Variable "${v.name}" has invalid type "${v.type}". Expected "COLOR".`);
    }
  }

  // Verify variableIds array matches variables
  if (colorsDoc.variableIds.length !== colorsDoc.variables.length) {
    errors.push(`Aster Colors variableIds length (${colorsDoc.variableIds.length}) does not match variables count (${colorsDoc.variables.length}).`);
  }

  for (let i = 0; i < colorsDoc.variableIds.length; i++) {
    if (colorsDoc.variableIds[i] !== colorsDoc.variables[i].id) {
      errors.push(`Index mismatch at variableIds[${i}]: "${colorsDoc.variableIds[i]}" vs variable.id "${colorsDoc.variables[i].id}".`);
    }
  }

  // Verify aliases & resolved values
  let primitiveCount = 0;
  let semanticCount = 0;

  for (const v of colorsDoc.variables || []) {
    if (v.name.startsWith('primitive/')) {
      primitiveCount++;
      // Primitive must have direct RGBA values across both modes
      for (const modeId of ['1001:0', '1001:1']) {
        const val = v.valuesByMode[modeId];
        if (!val || typeof val.r !== 'number' || typeof val.g !== 'number' || typeof val.b !== 'number' || val.a !== 1) {
          errors.push(`Primitive variable "${v.name}" mode "${modeId}" has invalid RGBA value.`);
        }
        const resolved = v.resolvedValuesByMode[modeId];
        if (!resolved || resolved.alias !== null) {
          errors.push(`Primitive variable "${v.name}" mode "${modeId}" should have alias: null.`);
        }
      }
    } else if (v.name.startsWith('semantic/')) {
      semanticCount++;
      // Semantic must have aliases pointing to existing variables in collection
      for (const modeId of ['1001:0', '1001:1']) {
        const aliasEntry = v.valuesByMode[modeId];
        if (!aliasEntry || aliasEntry.type !== 'VARIABLE_ALIAS' || !aliasEntry.id) {
          errors.push(`Semantic variable "${v.name}" mode "${modeId}" is not a valid VARIABLE_ALIAS.`);
          continue;
        }
        if (!colorVarMap.has(aliasEntry.id)) {
          errors.push(`Semantic variable "${v.name}" mode "${modeId}" points to non-existent variable ID: "${aliasEntry.id}".`);
          continue;
        }

        const targetVar = colorVarMap.get(aliasEntry.id);
        const resolved = v.resolvedValuesByMode[modeId];
        if (!resolved || resolved.alias !== aliasEntry.id) {
          errors.push(`Semantic variable "${v.name}" mode "${modeId}" resolved alias does not match valuesByMode ID.`);
        }
        if (resolved.aliasName !== targetVar.name) {
          errors.push(`Semantic variable "${v.name}" mode "${modeId}" aliasName "${resolved.aliasName}" does not match target name "${targetVar.name}".`);
        }
        if (!rgbaRoughEqual(resolved.resolvedValue, targetVar.valuesByMode[modeId])) {
          errors.push(`Semantic variable "${v.name}" mode "${modeId}" resolvedValue does not match target RGBA value.`);
        }
      }
    } else {
      errors.push(`Unexpected variable naming: "${v.name}". Must start with "primitive/" or "semantic/".`);
    }
  }

  if (primitiveCount !== 22) {
    errors.push(`Expected 22 primitive colors, found ${primitiveCount}.`);
  }
  if (semanticCount !== 17) {
    errors.push(`Expected 17 semantic colors, found ${semanticCount}.`);
  }

  console.log(`  ✓ Checked ${colorsDoc.variables.length} color variables (22 primitive, 17 semantic).`);
  console.log('  ✓ All color aliases resolve to internal targets with matching RGBA values.');
  console.log('  ✓ Mode mappings strictly valid ("1001:0": Light, "1001:1": Dark).');

  // -------------------------------------------------------------
  // 2. Validate "Aster Density"
  // -------------------------------------------------------------
  console.log('\nChecking: dist/figma/aster-density.json ...');

  if (densityDoc.id !== 'VariableCollectionId:2001:1') {
    errors.push(`Aster Density has unexpected ID "${densityDoc.id}". Expected "VariableCollectionId:2001:1".`);
  }
  if (densityDoc.name !== 'Aster Density') {
    errors.push(`Aster Density has unexpected name "${densityDoc.name}". Expected "Aster Density".`);
  }

  const expectedDensityModes = {
    '2001:0': 'Comfortable',
    '2001:1': 'Compact'
  };
  const actualDensityModes = densityDoc.modes || {};
  for (const [modeId, modeName] of Object.entries(expectedDensityModes)) {
    if (actualDensityModes[modeId] !== modeName) {
      errors.push(`Aster Density mode mismatch: expected "${modeId}": "${modeName}", found "${actualDensityModes[modeId]}".`);
    }
  }

  const densityVarIdSet = new Set();
  for (const v of densityDoc.variables || []) {
    if (!/^VariableID:2001:\d+$/.test(v.id)) {
      errors.push(`Density variable "${v.name}" has invalid ID format: "${v.id}". Expected "VariableID:2001:<positive-int>".`);
    }
    if (densityVarIdSet.has(v.id)) {
      errors.push(`Duplicate variable ID found in Aster Density: "${v.id}" (name: ${v.name}).`);
    }
    densityVarIdSet.add(v.id);

    if (v.type !== 'FLOAT') {
      errors.push(`Density variable "${v.name}" has invalid type "${v.type}". Expected "FLOAT".`);
    }

    for (const modeId of ['2001:0', '2001:1']) {
      const numVal = v.valuesByMode[modeId];
      if (typeof numVal !== 'number' || !Number.isFinite(numVal) || numVal < 0) {
        errors.push(`Density variable "${v.name}" mode "${modeId}" has invalid numeric value: ${numVal}. Must be finite and >= 0.`);
      }
      const resolved = v.resolvedValuesByMode[modeId];
      if (!resolved || resolved.resolvedValue !== numVal || resolved.alias !== null) {
        errors.push(`Density variable "${v.name}" mode "${modeId}" resolved value mismatch.`);
      }
    }
  }

  if (densityDoc.variables.length !== 6) {
    errors.push(`Expected 6 density tokens, found ${densityDoc.variables.length}.`);
  }

  console.log(`  ✓ Checked ${densityDoc.variables.length} density variables.`);
  console.log('  ✓ All numeric dimensions are finite, non-negative numbers (>= 0).');
  console.log('  ✓ Mode mappings strictly valid ("2001:0": Comfortable, "2001:1": Compact).');

  // -------------------------------------------------------------
  // 3. Validate "Aster Dimensions"
  // -------------------------------------------------------------
  console.log('\nChecking: dist/figma/aster-dimensions.json ...');

  if (dimensionsDoc.id !== 'VariableCollectionId:3001:1') {
    errors.push(`Aster Dimensions has unexpected ID "${dimensionsDoc.id}". Expected "VariableCollectionId:3001:1".`);
  }
  if (dimensionsDoc.name !== 'Aster Dimensions') {
    errors.push(`Aster Dimensions has unexpected name "${dimensionsDoc.name}". Expected "Aster Dimensions".`);
  }

  const expectedDimensionsModes = {
    '3001:0': 'Value'
  };
  const actualDimensionsModes = dimensionsDoc.modes || {};
  for (const [modeId, modeName] of Object.entries(expectedDimensionsModes)) {
    if (actualDimensionsModes[modeId] !== modeName) {
      errors.push(`Aster Dimensions mode mismatch: expected "${modeId}": "${modeName}", found "${actualDimensionsModes[modeId]}".`);
    }
  }

  const dimVarIdSet = new Set();
  let spaceCount = 0;
  let radiusCount = 0;
  let borderWidthCount = 0;

  for (const v of dimensionsDoc.variables || []) {
    if (!/^VariableID:3001:\d+$/.test(v.id)) {
      errors.push(`Dimension variable "${v.name}" has invalid ID format: "${v.id}". Expected "VariableID:3001:<positive-int>".`);
    }
    if (dimVarIdSet.has(v.id)) {
      errors.push(`Duplicate variable ID found in Aster Dimensions: "${v.id}" (name: ${v.name}).`);
    }
    dimVarIdSet.add(v.id);

    if (v.type !== 'FLOAT') {
      errors.push(`Dimension variable "${v.name}" has invalid type "${v.type}". Expected "FLOAT".`);
    }

    if (!Array.isArray(v.scopes) || !v.scopes.includes('ALL_SCOPES')) {
      errors.push(`Dimension variable "${v.name}" should have scopes ["ALL_SCOPES"].`);
    }

    const numVal = v.valuesByMode['3001:0'];
    if (typeof numVal !== 'number' || !Number.isFinite(numVal) || numVal < 0) {
      errors.push(`Dimension variable "${v.name}" mode "3001:0" has invalid numeric value: ${numVal}. Must be finite and >= 0.`);
    }
    const resolved = v.resolvedValuesByMode['3001:0'];
    if (!resolved || resolved.resolvedValue !== numVal || resolved.alias !== null) {
      errors.push(`Dimension variable "${v.name}" mode "3001:0" resolved value mismatch (expected alias: null).`);
    }

    if (v.name.startsWith('primitive/space/')) spaceCount++;
    else if (v.name.startsWith('primitive/radius/')) radiusCount++;
    else if (v.name.startsWith('primitive/border-width/')) borderWidthCount++;
    else errors.push(`Unexpected dimension variable name: "${v.name}".`);
  }

  if (dimensionsDoc.variables.length !== 18) {
    errors.push(`Expected 18 dimension tokens, found ${dimensionsDoc.variables.length}.`);
  }
  if (spaceCount !== 11) errors.push(`Expected 11 space tokens, found ${spaceCount}.`);
  if (radiusCount !== 5) errors.push(`Expected 5 radius tokens, found ${radiusCount}.`);
  if (borderWidthCount !== 2) errors.push(`Expected 2 border width tokens, found ${borderWidthCount}.`);

  console.log(`  ✓ Checked ${dimensionsDoc.variables.length} dimension variables (11 space, 5 radius, 2 border-width).`);
  console.log('  ✓ All numeric dimensions are finite, non-negative numbers (>= 0).');
  console.log('  ✓ Mode mapping strictly valid ("3001:0": Value).');
  console.log('  ✓ Scopes strictly ["ALL_SCOPES"].');

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log('\n================================================================');
  if (errors.length > 0) {
    console.error(`FAILED: ${errors.length} validation error(s) found:`);
    for (const err of errors) console.error(`  ✖ ${err}`);
    process.exit(1);
  } else {
    console.log('SUCCESS: All Figma variable payloads conform strictly to specification.');
    console.log('================================================================\n');
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    validateFigmaTokens();
  } catch (err) {
    console.error(`\n✖ Validator crashed: ${err.message}`);
    process.exit(1);
  }
}
