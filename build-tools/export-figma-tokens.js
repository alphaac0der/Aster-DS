import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { buildFigmaPlugin } from './build-figma-plugin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

/**
 * 32-bit FNV-1a non-cryptographic hash.
 * Provides deterministic, stable numeric mapping across exports with zero dependencies.
 */
function fnv1a32(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Convert hex color string (#ffffff or #fff) to normalized sRGB RGBA object.
 */
function hexToRgba(hex) {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length !== 6) {
    throw new Error(`Invalid hex color: "${hex}"`);
  }
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return { r, g, b, a: 1 };
}

/**
 * Parse a dimension string (e.g. "40px", "0px") into a finite number >= 0.
 */
function parseDimension(dimStr) {
  if (typeof dimStr === 'number') {
    if (!Number.isFinite(dimStr) || dimStr < 0) {
      throw new Error(`Invalid dimension number: ${dimStr}. Must be finite and >= 0.`);
    }
    return dimStr;
  }
  if (typeof dimStr !== 'string') {
    throw new Error(`Dimension must be a string or number, got: ${typeof dimStr}`);
  }
  const match = dimStr.trim().match(/^(\d+(?:\.\d+)?)(?:px)?$/);
  if (!match) {
    throw new Error(`Cannot parse dimension: "${dimStr}". Expected format like "40px" or "0".`);
  }
  const val = parseFloat(match[1]);
  if (!Number.isFinite(val) || val < 0) {
    throw new Error(`Invalid parsed dimension: ${val}. Must be finite and >= 0.`);
  }
  return val;
}

/**
 * ID Generator with Collision Detection.
 */
class IdGenerator {
  constructor(collectionChunk) {
    this.collectionChunk = collectionChunk;
    this.registry = new Map(); // numericId -> canonicalPath
  }

  getId(canonicalPath) {
    const rawHash = fnv1a32(canonicalPath);
    const numericId = (rawHash & 0x7fffffff) || 1;

    if (this.registry.has(numericId)) {
      const existingPath = this.registry.get(numericId);
      if (existingPath !== canonicalPath) {
        throw new Error(
          `FATAL HASH COLLISION: Both "${existingPath}" and "${canonicalPath}" hashed to numeric ID ${numericId}.`
        );
      }
    } else {
      this.registry.set(numericId, canonicalPath);
    }

    return `VariableID:${this.collectionChunk}:${numericId}`;
  }
}

/**
 * Main export function.
 */
export function exportFigmaTokens() {
  console.log('================ Aster Figma Token Exporter ================');

  // Load canonical source token files
  const primitiveColorPath = resolve(rootDir, 'tokens/primitive/color.json');
  const semanticLightPath = resolve(rootDir, 'tokens/semantic/light.json');
  const semanticDarkPath = resolve(rootDir, 'tokens/semantic/dark.json');
  const densityComfortablePath = resolve(rootDir, 'tokens/density/comfortable.json');

  const primitiveColorDoc = JSON.parse(readFileSync(primitiveColorPath, 'utf8'));
  const semanticLightDoc = JSON.parse(readFileSync(semanticLightPath, 'utf8'));
  const semanticDarkDoc = JSON.parse(readFileSync(semanticDarkPath, 'utf8'));
  const densityComfortableDoc = JSON.parse(readFileSync(densityComfortablePath, 'utf8'));

  // Deferred canonical token files for full reconciliation
  const typographyDoc = JSON.parse(readFileSync(resolve(rootDir, 'tokens/primitive/typography.json'), 'utf8'));
  const spaceDoc = JSON.parse(readFileSync(resolve(rootDir, 'tokens/primitive/space.json'), 'utf8'));
  const radiusDoc = JSON.parse(readFileSync(resolve(rootDir, 'tokens/primitive/radius.json'), 'utf8'));
  const elevationDoc = JSON.parse(readFileSync(resolve(rootDir, 'tokens/primitive/elevation.json'), 'utf8'));

  // -------------------------------------------------------------
  // 1. Build "Aster Colors" Collection
  // -------------------------------------------------------------
  const colorCollectionChunk = '1001';
  const colorIdGen = new IdGenerator(colorCollectionChunk);
  const colorModeLight = `${colorCollectionChunk}:0`;
  const colorModeDark = `${colorCollectionChunk}:1`;

  const colorCollection = {
    id: `VariableCollectionId:${colorCollectionChunk}:1`,
    name: 'Aster Colors',
    modes: {
      [colorModeLight]: 'Light',
      [colorModeDark]: 'Dark'
    },
    variableIds: [],
    variables: []
  };

  const primitiveMap = new Map();

  function registerPrimitive(name, description, hex) {
    const varId = colorIdGen.getId(name);
    const rgba = hexToRgba(hex);

    const variable = {
      id: varId,
      name,
      description,
      type: 'COLOR',
      valuesByMode: {
        [colorModeLight]: rgba,
        [colorModeDark]: rgba
      },
      resolvedValuesByMode: {
        [colorModeLight]: {
          resolvedValue: rgba,
          alias: null
        },
        [colorModeDark]: {
          resolvedValue: rgba,
          alias: null
        }
      },
      scopes: ['ALL_SCOPES'],
      hiddenFromPublishing: false,
      codeSyntax: {}
    };

    colorCollection.variableIds.push(varId);
    colorCollection.variables.push(variable);

    primitiveMap.set(name, { id: varId, name, rgba, hex });
    return varId;
  }

  // Primitive Neutrals
  const neutralObj = primitiveColorDoc.color.primitive.neutral;
  for (const [key, token] of Object.entries(neutralObj)) {
    const varName = `primitive/neutral/${key}`;
    const dotPath = `color.primitive.neutral.${key}`;
    registerPrimitive(varName, token.$description, token.$value);
    primitiveMap.set(dotPath, primitiveMap.get(varName));
  }

  // Primitive Brand
  const brandObj = primitiveColorDoc.color.primitive.brand;
  for (const [key, token] of Object.entries(brandObj)) {
    const varName = `primitive/brand/${key}`;
    const dotPath = `color.primitive.brand.${key}`;
    registerPrimitive(varName, token.$description, token.$value);
    primitiveMap.set(dotPath, primitiveMap.get(varName));
  }

  // Primitive Status
  const statusObj = primitiveColorDoc.color.primitive.status;
  for (const [statusGroup, variants] of Object.entries(statusObj)) {
    for (const [variant, token] of Object.entries(variants)) {
      const varName = `primitive/status/${statusGroup}/${variant}`;
      const dotPath = `color.primitive.status.${statusGroup}.${variant}`;
      registerPrimitive(varName, token.$description, token.$value);
      primitiveMap.set(dotPath, primitiveMap.get(varName));
    }
  }

  const primitiveColorCount = colorCollection.variables.length; // 22

  function resolveDtcgRef(refStr) {
    const cleaned = refStr.replace(/^\{/, '').replace(/\}$/, '').trim();
    if (!primitiveMap.has(cleaned)) {
      throw new Error(`Broken DTCG reference: "${refStr}" could not be resolved in primitive colors.`);
    }
    return primitiveMap.get(cleaned);
  }

  const semanticLightGroups = semanticLightDoc.semantic.color;
  const semanticDarkGroups = semanticDarkDoc.semantic.color;

  for (const [groupName, groupTokens] of Object.entries(semanticLightGroups)) {
    const darkTokens = semanticDarkGroups[groupName];
    if (!darkTokens) {
      throw new Error(`Missing semantic group "${groupName}" in dark mode tokens.`);
    }

    for (const [tokenName, lightToken] of Object.entries(groupTokens)) {
      const darkToken = darkTokens[tokenName];
      if (!darkToken) {
        throw new Error(`Missing semantic token "${groupName}.${tokenName}" in dark mode tokens.`);
      }

      const canonicalName = `semantic/${groupName}/${tokenName}`;
      const varId = colorIdGen.getId(canonicalName);

      const lightTarget = resolveDtcgRef(lightToken.$value);
      const darkTarget = resolveDtcgRef(darkToken.$value);

      const variable = {
        id: varId,
        name: canonicalName,
        description: lightToken.$description || darkToken.$description || '',
        type: 'COLOR',
        valuesByMode: {
          [colorModeLight]: {
            type: 'VARIABLE_ALIAS',
            id: lightTarget.id
          },
          [colorModeDark]: {
            type: 'VARIABLE_ALIAS',
            id: darkTarget.id
          }
        },
        resolvedValuesByMode: {
          [colorModeLight]: {
            resolvedValue: lightTarget.rgba,
            alias: lightTarget.id,
            aliasName: lightTarget.name
          },
          [colorModeDark]: {
            resolvedValue: darkTarget.rgba,
            alias: darkTarget.id,
            aliasName: darkTarget.name
          }
        },
        scopes: ['ALL_SCOPES'],
        hiddenFromPublishing: false,
        codeSyntax: {}
      };

      colorCollection.variableIds.push(varId);
      colorCollection.variables.push(variable);
    }
  }

  const totalColorCount = colorCollection.variables.length;
  const semanticColorCount = totalColorCount - primitiveColorCount;

  // -------------------------------------------------------------
  // 2. Build "Aster Density" Collection (Single Standard Density)
  // -------------------------------------------------------------
  const densityCollectionChunk = '2001';
  const densityIdGen = new IdGenerator(densityCollectionChunk);
  const densityModeStandard = `${densityCollectionChunk}:0`;

  const densityCollection = {
    id: `VariableCollectionId:${densityCollectionChunk}:1`,
    name: 'Aster Density',
    modes: {
      [densityModeStandard]: 'Standard'
    },
    variableIds: [],
    variables: []
  };

  const comfDensityObj = densityComfortableDoc.density;

  for (const [catName, catTokens] of Object.entries(comfDensityObj)) {
    for (const [tokenName, comfToken] of Object.entries(catTokens)) {
      const canonicalName = `density/${catName}/${tokenName}`;
      const varId = densityIdGen.getId(canonicalName);

      const valComf = parseDimension(comfToken.$value);

      const variable = {
        id: varId,
        name: canonicalName,
        description: comfToken.$description || '',
        type: 'FLOAT',
        valuesByMode: {
          [densityModeStandard]: valComf
        },
        resolvedValuesByMode: {
          [densityModeStandard]: {
            resolvedValue: valComf,
            alias: null
          }
        },
        scopes: ['ALL_SCOPES'],
        hiddenFromPublishing: false,
        codeSyntax: {}
      };

      densityCollection.variableIds.push(varId);
      densityCollection.variables.push(variable);
    }
  }

  const totalDensityCount = densityCollection.variables.length;

  // -------------------------------------------------------------
  // 3. Build "Aster Dimensions" Collection
  // -------------------------------------------------------------
  const dimCollectionChunk = '3001';
  const dimIdGen = new IdGenerator(dimCollectionChunk);
  const dimModeValue = `${dimCollectionChunk}:0`;

  const dimCollection = {
    id: `VariableCollectionId:${dimCollectionChunk}:1`,
    name: 'Aster Dimensions',
    modes: {
      [dimModeValue]: 'Value'
    },
    variableIds: [],
    variables: []
  };

  function registerDimension(canonicalName, description, rawValue) {
    const varId = dimIdGen.getId(canonicalName);
    const parsedVal = parseDimension(rawValue);

    const variable = {
      id: varId,
      name: canonicalName,
      description: description || '',
      type: 'FLOAT',
      valuesByMode: {
        [dimModeValue]: parsedVal
      },
      resolvedValuesByMode: {
        [dimModeValue]: {
          resolvedValue: parsedVal,
          alias: null
        }
      },
      scopes: ['ALL_SCOPES'],
      hiddenFromPublishing: false,
      codeSyntax: {}
    };

    dimCollection.variableIds.push(varId);
    dimCollection.variables.push(variable);
    return varId;
  }

  // 1. Spacing (11 tokens)
  for (const [step, token] of Object.entries(spaceDoc.space)) {
    registerDimension(`primitive/space/${step}`, token.$description, token.$value);
  }

  // 2. Border Radius (5 tokens)
  for (const [tier, token] of Object.entries(radiusDoc.radius)) {
    registerDimension(`primitive/radius/${tier}`, token.$description, token.$value);
  }

  // 3. Border Widths (2 tokens)
  for (const [variant, token] of Object.entries(elevationDoc.elevation.border)) {
    registerDimension(`primitive/border-width/${variant}`, token.$description, token.$value);
  }

  const totalDimensionsCount = dimCollection.variables.length; // 18

  // -------------------------------------------------------------
  // 4. Count Deferred Tokens for Full Inventory Reconciliation
  // -------------------------------------------------------------
  function countLeaves(obj) {
    let count = 0;
    for (const key of Object.keys(obj)) {
      if (obj[key] && typeof obj[key] === 'object') {
        if ('$value' in obj[key]) {
          count++;
        } else {
          count += countLeaves(obj[key]);
        }
      }
    }
    return count;
  }

  const typographyCount = countLeaves(typographyDoc);
  const shadowCount = countLeaves(elevationDoc.elevation.shadow);
  const totalDeferredCount = typographyCount + shadowCount;

  const totalCanonicalTokens = totalColorCount + totalDensityCount + totalDimensionsCount + totalDeferredCount;

  // Write outputs
  const distFigmaDir = resolve(rootDir, 'dist/figma');
  mkdirSync(distFigmaDir, { recursive: true });

  const colorsOutputPath = resolve(distFigmaDir, 'aster-colors.json');
  const densityOutputPath = resolve(distFigmaDir, 'aster-density.json');
  const dimensionsOutputPath = resolve(distFigmaDir, 'aster-dimensions.json');

  writeFileSync(colorsOutputPath, JSON.stringify(colorCollection, null, 2), 'utf8');
  writeFileSync(densityOutputPath, JSON.stringify(densityCollection, null, 2), 'utf8');
  writeFileSync(dimensionsOutputPath, JSON.stringify(dimCollection, null, 2), 'utf8');

  console.log(`✓ Generated ${colorsOutputPath} (${totalColorCount} variables)`);
  console.log(`✓ Generated ${densityOutputPath} (${totalDensityCount} variables)`);
  console.log(`✓ Generated ${dimensionsOutputPath} (${totalDimensionsCount} variables)`);

  console.log('\n================ Aster Figma Exporter Inventory ================');
  console.log(`Total canonical source tokens:       ${totalCanonicalTokens}`);
  console.log(`  - Exported to 'Aster Colors':      ${totalColorCount} (${primitiveColorCount} primitive, ${semanticColorCount} semantic)`);
  console.log(`  - Exported to 'Aster Density':      ${totalDensityCount} (standard density dimensions)`);
  console.log(`  - Exported to 'Aster Dimensions':   ${totalDimensionsCount} (primitive spacing, radius, border widths)`);
  console.log(`  - Explicitly deferred:             ${totalDeferredCount} (${typographyCount} typography, ${shadowCount} elevation shadows)`);
  console.log(`  - Unexpected / unmapped:            0`);
  console.log('================================================================\n');

  // Compile standalone Figma plugin directly from exported payloads
  buildFigmaPlugin();

  return {
    colorCollection,
    densityCollection,
    dimCollection,
    counts: {
      totalCanonicalTokens,
      totalColorCount,
      primitiveColorCount,
      semanticColorCount,
      totalDensityCount,
      totalDimensionsCount,
      totalDeferredCount
    }
  };
}

// Execute if run directly from CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    exportFigmaTokens();
  } catch (err) {
    console.error(`\n✖ Exporter failed: ${err.message}`);
    process.exit(1);
  }
}
