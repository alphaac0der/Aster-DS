import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

/**
 * Compiles the standalone Figma plugin script (tools/figma-plugin/code.js)
 * directly from canonical token distribution files.
 *
 * Implements Aster DS's premium minimal SaaS aesthetic with:
 * - 2D matrix layouts for Component Sets with explicit column and row headers
 * - Authentic Phosphor SVG vector icons with component boolean properties
 * - 1:1 variable bindings to fills, strokes, radii, and spacing
 * - Polished presentation artboards and a live Contextual Composition showcase
 */
export function buildFigmaPlugin() {
  console.log('--- Compiling Aster DS Figma Plugin ---');

  const colorsJson = JSON.parse(readFileSync(resolve(rootDir, 'dist/figma/aster-colors.json'), 'utf8'));
  const densityJson = JSON.parse(readFileSync(resolve(rootDir, 'dist/figma/aster-density.json'), 'utf8'));
  const dimensionsJson = JSON.parse(readFileSync(resolve(rootDir, 'dist/figma/aster-dimensions.json'), 'utf8'));
  const typographyJson = JSON.parse(readFileSync(resolve(rootDir, 'tokens/primitive/typography.json'), 'utf8'));
  const elevationJson = JSON.parse(readFileSync(resolve(rootDir, 'tokens/primitive/elevation.json'), 'utf8'));

  const pluginDir = resolve(rootDir, 'tools/figma-plugin');
  mkdirSync(pluginDir, { recursive: true });

  const codeContent = `/**
 * Aster Design System — Native Figma Library Setup Plugin
 * Generated automatically from canonical token sources in Git.
 * DO NOT EDIT MANUALLY. Recompile via 'npm run build' or 'node build-tools/build-figma-plugin.js'.
 *
 * Repository: https://github.com/alphaac0der/Aster-DS
 * Version: 0.0.1
 */

// -------------------------------------------------------------
// Canonical Token Payloads
// -------------------------------------------------------------
const ASTER_COLORS = ${JSON.stringify(colorsJson, null, 2)};
const ASTER_DENSITY = ${JSON.stringify(densityJson, null, 2)};
const ASTER_DIMENSIONS = ${JSON.stringify(dimensionsJson, null, 2)};
const ASTER_TYPOGRAPHY = ${JSON.stringify(typographyJson, null, 2)};
const ASTER_ELEVATION = ${JSON.stringify(elevationJson, null, 2)};

// -------------------------------------------------------------
// Phosphor Vector Icon Definitions (16x16 / 14x14)
// -------------------------------------------------------------
const ICONS = {
  arrowRight: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.33334 8H12.6667M12.6667 8L8.66668 4M12.6667 8L8.66668 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plus: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3.33334V12.6667M3.33334 8H12.6667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  sparkle: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.33334L9.5 6.5L14.6667 8L9.5 9.5L8 14.6667L6.5 9.5L1.33334 8L6.5 6.5L8 1.33334Z" fill="currentColor"/></svg>',
  search: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5"/><path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  eye: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.5 8C1.5 8 3.5 3.5 8 3.5C12.5 3.5 14.5 8 14.5 8C14.5 8 12.5 12.5 8 12.5C3.5 12.5 1.5 8 1.5 8Z" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/></svg>',
  info: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.25"/><path d="M7 6.5V10M7 4H7.005" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  checkCircle: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.25"/><path d="M4.5 7L6.2 8.7L9.5 5.3" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  xCircle: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.25"/><path d="M5 5L9 9M9 5L5 9" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>'
};

// -------------------------------------------------------------
// Plugin Execution Logic
// -------------------------------------------------------------
async function runAsterSetup() {
  figma.notify('❖ Building Aster DS Library...', { timeout: 2000 });

  try {
    // 1. Synchronize Variable Collections
    const variableMap = await syncVariableCollections();

    // 2. Synchronize Native Typography Text Styles
    const textStyles = await syncTextStyles();

    // 3. Synchronize Native Effect Styles (Elevation Shadows)
    const effectStyles = await syncEffectStyles();

    // 4. Setup Target Page & Canvas Artboard
    const { libraryPage, contentContainer } = setupLibraryPage(textStyles);

    // 5. Construct Visual Header & Overview
    buildHeaderHero(contentContainer, textStyles);

    // 6. Construct Refined Component Sets
    await buildButtonComponentSet(contentContainer, variableMap, textStyles, effectStyles);
    await buildInputComponentSet(contentContainer, variableMap, textStyles, effectStyles);
    await buildBadgeComponentSet(contentContainer, variableMap, textStyles, effectStyles);

    // 7. Construct In-Context Showcase Card
    await buildContextualShowcase(contentContainer, variableMap, textStyles, effectStyles);

    figma.currentPage = libraryPage;
    figma.viewport.scrollAndZoomIntoView([contentContainer]);

    figma.notify('✔ Aster DS Library successfully built with production-grade components & tokens!', {
      timeout: 6000
    });
  } catch (err) {
    console.error('Aster DS Setup Error:', err);
    figma.notify('✖ Aster Setup Error: ' + (err && err.message ? err.message : String(err)), {
      error: true,
      timeout: 10000
    });
  }
}

// -------------------------------------------------------------
// 1. Variable Synchronization Helper
// -------------------------------------------------------------
async function syncVariableCollections() {
  const variableMap = new Map();
  const collectionsData = [ASTER_COLORS, ASTER_DENSITY, ASTER_DIMENSIONS];
  const existingCollections = figma.variables.getLocalVariableCollections();

  for (const colData of collectionsData) {
    let col = existingCollections.find(c => c.name === colData.name);
    if (!col) {
      col = figma.variables.createVariableCollection(colData.name);
    }

    // Align modes
    const modeEntries = Object.entries(colData.modes);
    if (modeEntries.length > 0) {
      const [firstKey, firstName] = modeEntries[0];
      if (col.modes.length > 0 && col.modes[0].name !== firstName) {
        col.renameMode(col.modes[0].modeId, firstName);
      }
      for (let i = 1; i < modeEntries.length; i++) {
        const [modeKey, modeName] = modeEntries[i];
        const existingMode = col.modes.find(m => m.name === modeName);
        if (!existingMode) {
          col.addMode(modeName);
        }
      }
    }

    const modeNameToId = new Map(col.modes.map(m => [m.name, m.modeId]));
    const modeKeyToId = new Map();
    for (const [key, name] of modeEntries) {
      if (modeNameToId.has(name)) {
        modeKeyToId.set(key, modeNameToId.get(name));
      }
    }

    // Pass 1: Create or fetch variables
    const localVars = figma.variables.getLocalVariables().filter(v => v.variableCollectionId === col.id);
    const varNameToObj = new Map(localVars.map(v => [v.name, v]));

    for (const vData of colData.variables) {
      let v = varNameToObj.get(vData.name);
      if (!v) {
        v = figma.variables.createVariable(vData.name, col, vData.type);
        varNameToObj.set(vData.name, v);
      }
      if (vData.description) {
        v.description = vData.description;
      }
      if (vData.scopes) {
        v.scopes = vData.scopes;
      }

      for (const [modeKey, val] of Object.entries(vData.valuesByMode)) {
        const actualModeId = modeKeyToId.get(modeKey) || col.modes[0].modeId;
        if (typeof val === 'number') {
          v.setValueForMode(actualModeId, val);
        } else if (val && typeof val === 'object' && val.r !== undefined) {
          v.setValueForMode(actualModeId, { r: val.r, g: val.g, b: val.b, a: val.a !== undefined ? val.a : 1 });
        }
      }

      variableMap.set(vData.name, v);
      variableMap.set(vData.id, v);
    }

    // Pass 2: Set Variable Aliases for semantic references
    for (const vData of colData.variables) {
      const v = variableMap.get(vData.name);
      if (!v) continue;

      for (const [modeKey, val] of Object.entries(vData.valuesByMode)) {
        const actualModeId = modeKeyToId.get(modeKey) || col.modes[0].modeId;
        if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
          const targetVar = variableMap.get(val.id);
          if (targetVar) {
            try {
              v.setValueForMode(actualModeId, figma.variables.createVariableAlias(targetVar));
            } catch (aliasErr) {
              const resolved = vData.resolvedValuesByMode?.[modeKey]?.resolvedValue;
              if (resolved && resolved.r !== undefined) {
                v.setValueForMode(actualModeId, { r: resolved.r, g: resolved.g, b: resolved.b, a: 1 });
              }
            }
          }
        }
      }
    }
  }

  return variableMap;
}

// -------------------------------------------------------------
// 2. Native Typography Text Styles
// -------------------------------------------------------------
async function syncTextStyles() {
  const styles = new Map();

  async function safeLoadFont(family, style) {
    try {
      await figma.loadFontAsync({ family, style });
      return { family, style };
    } catch (e) {
      try {
        await figma.loadFontAsync({ family: 'Inter', style: style === 'SemiBold' || style === 'Medium' ? 'Medium' : 'Regular' });
        return { family: 'Inter', style: style === 'SemiBold' || style === 'Medium' ? 'Medium' : 'Regular' };
      } catch (err2) {
        return { family: 'Inter', style: 'Regular' };
      }
    }
  }

  const fontDisplay = await safeLoadFont('Bebas Neue', 'Regular');
  const fontBody = await safeLoadFont('Manrope', 'Regular');
  const fontBodyMedium = await safeLoadFont('Manrope', 'Medium');
  const fontBodySemi = await safeLoadFont('Manrope', 'SemiBold');
  const fontMono = await safeLoadFont('Space Mono', 'Regular');
  const fontSerif = await safeLoadFont('Merriweather', 'Regular');

  const typographyDefs = [
    {
      name: 'Aster / Display (Hero)',
      font: fontDisplay,
      fontSize: 48,
      lineHeight: { value: 100, unit: 'PERCENT' },
      description: 'Display and hero headline typography (Bebas Neue)'
    },
    {
      name: 'Aster / Section (Headline)',
      font: fontBodySemi,
      fontSize: 22,
      lineHeight: { value: 125, unit: 'PERCENT' },
      description: 'Card and component section title (Manrope SemiBold)'
    },
    {
      name: 'Aster / Body (Regular)',
      font: fontBody,
      fontSize: 14,
      lineHeight: { value: 145, unit: 'PERCENT' },
      description: 'Standard interface and body copy (Manrope Regular)'
    },
    {
      name: 'Aster / Body (Medium)',
      font: fontBodyMedium,
      fontSize: 14,
      lineHeight: { value: 145, unit: 'PERCENT' },
      description: 'Interactive button and control label text (Manrope Medium)'
    },
    {
      name: 'Aster / Body Large (Title)',
      font: fontBodySemi,
      fontSize: 16,
      lineHeight: { value: 125, unit: 'PERCENT' },
      description: 'Card titles and prominent headers (Manrope SemiBold)'
    },
    {
      name: 'Aster / Label (Small)',
      font: fontBodyMedium,
      fontSize: 11,
      lineHeight: { value: 16, unit: 'PIXELS' },
      letterSpacing: { value: 5, unit: 'PERCENT' },
      description: 'Uppercase form field label text (Manrope Medium)'
    },
    {
      name: 'Aster / Code & Data (Mono)',
      font: fontMono,
      fontSize: 12,
      lineHeight: { value: 145, unit: 'PERCENT' },
      description: 'Technical data, measurements, and code snippets (Space Mono)'
    },
    {
      name: 'Aster / Badge (Mono)',
      font: fontMono,
      fontSize: 11,
      lineHeight: { value: 120, unit: 'PERCENT' },
      description: 'Compact status badge tags (Space Mono)'
    },
    {
      name: 'Aster / Editorial (Serif)',
      font: fontSerif,
      fontSize: 16,
      lineHeight: { value: 160, unit: 'PERCENT' },
      description: 'Expressive editorial callouts and quotes (Merriweather)'
    }
  ];

  const existingStyles = figma.getLocalTextStyles();

  for (const def of typographyDefs) {
    let s = existingStyles.find(st => st.name === def.name);
    if (!s) {
      s = figma.createTextStyle();
      s.name = def.name;
    }
    s.fontName = def.font;
    s.fontSize = def.fontSize;
    if (def.lineHeight) s.lineHeight = def.lineHeight;
    if (def.letterSpacing) s.letterSpacing = def.letterSpacing;
    if (def.description) s.description = def.description;
    styles.set(def.name, s);
  }

  return styles;
}

// -------------------------------------------------------------
// 3. Native Effect Styles (Elevation Shadows)
// -------------------------------------------------------------
async function syncEffectStyles() {
  const styles = new Map();
  const existingEffects = figma.getLocalEffectStyles();

  const effectDefs = [
    {
      name: 'Aster / Elevation / None',
      description: 'Flat surface with zero drop shadow',
      effects: []
    },
    {
      name: 'Aster / Elevation / Card',
      description: 'Subtle ambient lift for cards and panels (0 4px 12px rgba(0,0,0,0.04))',
      effects: [
        {
          type: 'DROP_SHADOW',
          color: { r: 0, g: 0, b: 0, a: 0.04 },
          offset: { x: 0, y: 4 },
          radius: 12,
          spread: 0,
          visible: true,
          blendMode: 'NORMAL'
        }
      ]
    },
    {
      name: 'Aster / Elevation / Raised',
      description: 'Subtle ambient lift for small menus and tooltips (0 2px 4px rgba(0,0,0,0.04))',
      effects: [
        {
          type: 'DROP_SHADOW',
          color: { r: 0, g: 0, b: 0, a: 0.04 },
          offset: { x: 0, y: 2 },
          radius: 4,
          spread: 0,
          visible: true,
          blendMode: 'NORMAL'
        }
      ]
    },
    {
      name: 'Aster / Elevation / Overlay',
      description: 'Floating modal and dialog elevation shadow (0 8px 24px rgba(0,0,0,0.12))',
      effects: [
        {
          type: 'DROP_SHADOW',
          color: { r: 0, g: 0, b: 0, a: 0.12 },
          offset: { x: 0, y: 8 },
          radius: 24,
          spread: 0,
          visible: true,
          blendMode: 'NORMAL'
        }
      ]
    }
  ];

  for (const def of effectDefs) {
    let s = existingEffects.find(st => st.name === def.name);
    if (!s) {
      s = figma.createEffectStyle();
      s.name = def.name;
    }
    s.description = def.description;
    s.effects = def.effects;
    styles.set(def.name, s);
  }

  return styles;
}

// -------------------------------------------------------------
// 4. Target Page & Layout Setup
// -------------------------------------------------------------
function setupLibraryPage(textStyles) {
  const pageName = '❖ Aster DS Library';
  let libraryPage = figma.root.children.find(p => p.name === pageName);
  if (!libraryPage) {
    libraryPage = figma.createPage();
    libraryPage.name = pageName;
  }

  libraryPage.backgrounds = [{ type: 'SOLID', color: { r: 0.96, g: 0.96, b: 0.965 } }];

  const containerName = '❖ Aster Components';
  let contentContainer = libraryPage.children.find(n => n.name === containerName && n.type === 'FRAME');
  if (contentContainer) {
    for (const child of [...contentContainer.children]) {
      child.remove();
    }
  } else {
    contentContainer = figma.createFrame();
    contentContainer.name = containerName;
    libraryPage.appendChild(contentContainer);
  }

  contentContainer.layoutMode = 'VERTICAL';
  contentContainer.primaryAxisSizingMode = 'AUTO';
  contentContainer.counterAxisSizingMode = 'FIXED';
  contentContainer.resize(1340, 100);
  contentContainer.itemSpacing = 56;
  contentContainer.paddingTop = 64;
  contentContainer.paddingBottom = 80;
  contentContainer.paddingLeft = 64;
  contentContainer.paddingRight = 64;
  contentContainer.fills = [];

  return { libraryPage, contentContainer };
}

// -------------------------------------------------------------
// Helper: Helpers for Variable Binding and Icon Creation
// -------------------------------------------------------------
function makeSolidPaint(variable, fallbackRgb) {
  const paint = {
    type: 'SOLID',
    color: fallbackRgb ? { r: fallbackRgb.r, g: fallbackRgb.g, b: fallbackRgb.b } : { r: 0, g: 0, b: 0 }
  };
  if (variable && figma.variables && typeof figma.variables.setBoundVariableForPaint === 'function') {
    return figma.variables.setBoundVariableForPaint(paint, 'color', variable);
  }
  return paint;
}

function bindNodeVariable(node, field, variable) {
  if (node && variable && typeof node.setBoundVariable === 'function') {
    try {
      node.setBoundVariable(field, variable);
    } catch (e) {}
  }
}

function createIconNode(svgString, name, size = 16) {
  try {
    const iconFrame = figma.createNodeFromSvg(svgString);
    iconFrame.name = name;
    iconFrame.resize(size, size);
    iconFrame.layoutMode = 'NONE';
    return iconFrame;
  } catch (err) {
    const placeholder = figma.createFrame();
    placeholder.name = name;
    placeholder.resize(size, size);
    placeholder.fills = [];
    return placeholder;
  }
}

function applyIconColor(node, colorPaint) {
  if (!node) return;
  if ('strokes' in node && node.strokes && node.strokes.length > 0) {
    node.strokes = [colorPaint];
  }
  if ('fills' in node && node.fills && node.fills.length > 0) {
    node.fills = [colorPaint];
  }
  if ('children' in node) {
    for (const child of node.children) {
      applyIconColor(child, colorPaint);
    }
  }
}

// -------------------------------------------------------------
// 5. Header Hero & Overview
// -------------------------------------------------------------
function buildHeaderHero(parent, textStyles) {
  const heroCard = figma.createFrame();
  heroCard.name = 'Header: Aster DS Overview';
  heroCard.layoutMode = 'VERTICAL';
  heroCard.itemSpacing = 16;
  heroCard.primaryAxisSizingMode = 'AUTO';
  heroCard.counterAxisSizingMode = 'FIXED';
  heroCard.resize(1212, 200);
  heroCard.paddingTop = 36;
  heroCard.paddingBottom = 36;
  heroCard.paddingLeft = 40;
  heroCard.paddingRight = 40;
  heroCard.cornerRadius = 16;
  heroCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  heroCard.strokes = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.88 } }];
  heroCard.strokeWeight = 1;

  // Badge Tag
  const badgeRow = figma.createFrame();
  badgeRow.name = 'Badge Tag';
  badgeRow.layoutMode = 'HORIZONTAL';
  badgeRow.primaryAxisSizingMode = 'AUTO';
  badgeRow.counterAxisSizingMode = 'AUTO';
  badgeRow.paddingTop = 4;
  badgeRow.paddingBottom = 4;
  badgeRow.paddingLeft = 10;
  badgeRow.paddingRight = 10;
  badgeRow.cornerRadius = 9999;
  badgeRow.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.94, b: 0.94 } }];

  const badgeText = figma.createText();
  const badgeStyle = textStyles.get('Aster / Badge (Mono)');
  if (badgeStyle) badgeText.textStyleId = badgeStyle.id;
  badgeText.characters = 'ASTER-DS • FIGMA LIBRARY MVP';
  badgeText.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
  badgeRow.appendChild(badgeText);
  heroCard.appendChild(badgeRow);

  // Main Display Title
  const title = figma.createText();
  title.name = 'Library Title';
  const displayStyle = textStyles.get('Aster / Display (Hero)');
  if (displayStyle) title.textStyleId = displayStyle.id;
  title.characters = 'ASTER DESIGN SYSTEM';
  title.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.07, b: 0.07 } }];
  heroCard.appendChild(title);

  // Description
  const desc = figma.createText();
  desc.name = 'Description';
  const bodyRegular = textStyles.get('Aster / Body (Regular)');
  if (bodyRegular) desc.textStyleId = bodyRegular.id;
  desc.characters = 'Token-first, zero-dependency design system library synchronized with aster-ds@0.0.1. Features 82 variables (Aster Colors, Density, Dimensions) with native Light/Dark modes, 8 text styles, 3 effect styles, and native Auto Layout components for Button, Input, and Badge.';
  desc.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
  heroCard.appendChild(desc);

  parent.appendChild(heroCard);
}

// -------------------------------------------------------------
// 6. Refined Button Component Set
// -------------------------------------------------------------
async function buildButtonComponentSet(parent, variableMap, textStyles, effectStyles) {
  const card = figma.createFrame();
  card.name = 'Section: Button Component';
  card.layoutMode = 'VERTICAL';
  card.itemSpacing = 28;
  card.primaryAxisSizingMode = 'AUTO';
  card.counterAxisSizingMode = 'FIXED';
  card.resize(1212, 100);
  card.paddingTop = 36;
  card.paddingBottom = 40;
  card.paddingLeft = 40;
  card.paddingRight = 40;
  card.cornerRadius = 16;
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  card.strokes = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.88 } }];
  card.strokeWeight = 1;

  // Section Header
  const header = figma.createFrame();
  header.name = 'Header';
  header.layoutMode = 'VERTICAL';
  header.itemSpacing = 6;
  header.fills = [];

  const title = figma.createText();
  title.name = 'Title';
  const sectionTitleStyle = textStyles.get('Aster / Section (Headline)');
  if (sectionTitleStyle) title.textStyleId = sectionTitleStyle.id;
  title.characters = 'Button Component Set';
  title.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.07, b: 0.07 } }];
  header.appendChild(title);

  const subtitle = figma.createText();
  subtitle.name = 'Subtitle';
  const bodyRegular = textStyles.get('Aster / Body (Regular)');
  if (bodyRegular) subtitle.textStyleId = bodyRegular.id;
  subtitle.characters = 'Standard 40px control height (--as-density-control-height), 24px horizontal padding (--as-space-6), and full pill radius (--as-radius-full). Available in 4 functional variants across 5 states.';
  subtitle.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
  header.appendChild(subtitle);
  card.appendChild(header);

  // Column Labels Row
  const colsHeader = figma.createFrame();
  colsHeader.name = 'Columns Header';
  colsHeader.layoutMode = 'HORIZONTAL';
  colsHeader.itemSpacing = 0;
  colsHeader.primaryAxisSizingMode = 'FIXED';
  colsHeader.counterAxisSizingMode = 'AUTO';
  colsHeader.resize(1132, 28);
  colsHeader.fills = [];

  // Corner Spacer (matches row label width of 140px)
  const cornerSpacer = figma.createFrame();
  cornerSpacer.resize(140, 20);
  cornerSpacer.fills = [];
  colsHeader.appendChild(cornerSpacer);

  const states = ['default', 'hover', 'pressed', 'focus', 'disabled'];
  const stateLabels = ['Default', 'Hover', 'Pressed', 'Focus Ring', 'Disabled'];

  for (let i = 0; i < stateLabels.length; i++) {
    const colHeaderBox = figma.createFrame();
    colHeaderBox.resize(190, 20);
    colHeaderBox.fills = [];
    colHeaderBox.layoutMode = 'HORIZONTAL';
    colHeaderBox.primaryAxisAlignItems = 'CENTER';

    const colText = figma.createText();
    const labelStyle = textStyles.get('Aster / Label (Small)');
    if (labelStyle) colText.textStyleId = labelStyle.id;
    colText.characters = stateLabels[i].toUpperCase();
    colText.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
    colHeaderBox.appendChild(colText);
    colsHeader.appendChild(colHeaderBox);
  }
  card.appendChild(colsHeader);

  // Matrix Workspace Container
  const matrixContainer = figma.createFrame();
  matrixContainer.name = 'Button Variants Matrix';
  matrixContainer.layoutMode = 'NONE';
  matrixContainer.resize(1132, 340);
  matrixContainer.fills = [];

  const variants = ['primary', 'secondary', 'destructive', 'ghost'];
  const variantLabels = ['Primary', 'Secondary', 'Destructive', 'Ghost'];

  const varRadiusFull = variableMap.get('dimensions/radius/full');
  const varSpace6 = variableMap.get('dimensions/space/6');
  const varSpace2 = variableMap.get('dimensions/space/2');
  const varControlHeight = variableMap.get('density/control/height');
  const varFocusRing = variableMap.get('semantic/color/border/focus');
  const varBorderSubtle = variableMap.get('semantic/color/border/subtle');

  const components = [];

  for (let row = 0; row < variants.length; row++) {
    const variant = variants[row];

    // Row Label Text
    const rowLabel = figma.createText();
    rowLabel.name = \`RowLabel: \${variantLabels[row]}\`;
    const labelStyle = textStyles.get('Aster / Body Large (Title)');
    if (labelStyle) rowLabel.textStyleId = labelStyle.id;
    rowLabel.characters = variantLabels[row];
    rowLabel.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
    rowLabel.x = 0;
    rowLabel.y = row * 82 + 10;
    matrixContainer.appendChild(rowLabel);

    for (let col = 0; col < states.length; col++) {
      const state = states[col];

      const btn = figma.createComponent();
      btn.name = \`Variant=\${variant}, State=\${state}\`;
      btn.layoutMode = 'HORIZONTAL';
      btn.primaryAxisAlignItems = 'CENTER';
      btn.counterAxisAlignItems = 'CENTER';
      btn.primaryAxisSizingMode = 'AUTO';
      btn.counterAxisSizingMode = 'FIXED';
      btn.resize(140, 40);

      // Positioning in 2D Matrix
      btn.x = 140 + col * 190;
      btn.y = row * 82;

      // Spacing & Geometry
      btn.paddingLeft = 24;
      btn.paddingRight = 24;
      btn.paddingTop = 8;
      btn.paddingBottom = 8;
      btn.itemSpacing = 8;
      btn.cornerRadius = 9999;

      bindNodeVariable(btn, 'cornerRadius', varRadiusFull);
      bindNodeVariable(btn, 'paddingLeft', varSpace6);
      bindNodeVariable(btn, 'paddingRight', varSpace6);
      bindNodeVariable(btn, 'paddingTop', varSpace2);
      bindNodeVariable(btn, 'paddingBottom', varSpace2);
      bindNodeVariable(btn, 'minHeight', varControlHeight);

      let fillVar = null;
      let textVar = null;
      let strokeVar = null;
      let fallbackBg = { r: 0.1, g: 0.1, b: 0.1 };
      let fallbackFg = { r: 1, g: 1, b: 1 };
      let opacity = 1.0;

      if (variant === 'primary') {
        fillVar = variableMap.get('semantic/color/interactive/primary');
        textVar = variableMap.get('semantic/color/interactive/primary/text');
        fallbackBg = { r: 0.06, g: 0.06, b: 0.06 };
        fallbackFg = { r: 1, g: 1, b: 1 };
        if (state === 'hover') {
          fillVar = variableMap.get('semantic/color/interactive/primary/hover');
          fallbackBg = { r: 0.2, g: 0.2, b: 0.2 };
        }
        if (state === 'pressed') {
          fillVar = variableMap.get('semantic/color/interactive/primary/active');
          fallbackBg = { r: 0.0, g: 0.0, b: 0.0 };
        }
      } else if (variant === 'secondary') {
        fillVar = variableMap.get('semantic/color/surface/card');
        textVar = variableMap.get('semantic/color/text/default');
        strokeVar = varBorderSubtle;
        fallbackBg = { r: 0.96, g: 0.96, b: 0.96 };
        fallbackFg = { r: 0.07, g: 0.07, b: 0.07 };
        if (state === 'hover') {
          fillVar = variableMap.get('semantic/color/surface/subtle');
          fallbackBg = { r: 0.93, g: 0.93, b: 0.93 };
        }
        if (state === 'pressed') {
          fillVar = variableMap.get('semantic/color/surface/muted');
          fallbackBg = { r: 0.88, g: 0.88, b: 0.88 };
        }
      } else if (variant === 'destructive') {
        fillVar = variableMap.get('semantic/color/surface/critical');
        textVar = variableMap.get('semantic/color/status/critical/text');
        strokeVar = variableMap.get('semantic/color/status/critical/text');
        fallbackBg = { r: 0.98, g: 0.92, b: 0.92 };
        fallbackFg = { r: 0.77, g: 0.13, b: 0.13 };
      } else if (variant === 'ghost') {
        fillVar = null;
        textVar = variableMap.get('semantic/color/text/default');
        fallbackFg = { r: 0.07, g: 0.07, b: 0.07 };
        if (state === 'hover') {
          fillVar = variableMap.get('semantic/color/surface/subtle');
          fallbackBg = { r: 0.94, g: 0.94, b: 0.94 };
        }
        if (state === 'pressed') {
          fillVar = variableMap.get('semantic/color/surface/muted');
          fallbackBg = { r: 0.9, g: 0.9, b: 0.9 };
        }
      }

      if (state === 'disabled') {
        opacity = 0.45;
      }

      // Apply Fill
      if (fillVar) {
        btn.fills = [makeSolidPaint(fillVar, fallbackBg)];
      } else {
        btn.fills = [];
      }

      // Apply Stroke
      if (state === 'focus') {
        btn.strokes = [makeSolidPaint(varFocusRing, { r: 0.08, g: 0.39, b: 0.75 })];
        btn.strokeWeight = 2;
        btn.strokeAlign = 'OUTSIDE';
      } else if (strokeVar) {
        btn.strokes = [makeSolidPaint(strokeVar, { r: 0.85, g: 0.85, b: 0.85 })];
        btn.strokeWeight = 1;
        btn.strokeAlign = 'INSIDE';
      } else {
        btn.strokes = [];
      }

      btn.opacity = opacity;

      // Leading Icon
      const leadingIcon = createIconNode(ICONS.plus, 'Leading Icon', 16);
      applyIconColor(leadingIcon, makeSolidPaint(textVar, fallbackFg));
      leadingIcon.visible = false;
      btn.appendChild(leadingIcon);

      // Label Text
      const label = figma.createText();
      label.name = 'Label';
      const bodyMedium = textStyles.get('Aster / Body (Medium)');
      if (bodyMedium) label.textStyleId = bodyMedium.id;
      label.characters = 'Button';
      label.fills = [makeSolidPaint(textVar, fallbackFg)];
      btn.appendChild(label);

      // Trailing Icon
      const trailingIcon = createIconNode(ICONS.arrowRight, 'Trailing Icon', 16);
      applyIconColor(trailingIcon, makeSolidPaint(textVar, fallbackFg));
      trailingIcon.visible = false;
      btn.appendChild(trailingIcon);

      matrixContainer.appendChild(btn);
      components.push(btn);
    }
  }

  card.appendChild(matrixContainer);

  // Combine into single Figma Component Set
  const componentSet = figma.combineAsVariants(components, card);
  componentSet.name = 'Button';
  componentSet.description = 'Aster Design System standard pill button (40px height, full-pill radius, 4 variants, 5 states).';
  parent.appendChild(card);
}

// -------------------------------------------------------------
// 7. Refined Input Component Set
// -------------------------------------------------------------
async function buildInputComponentSet(parent, variableMap, textStyles, effectStyles) {
  const card = figma.createFrame();
  card.name = 'Section: Input Component';
  card.layoutMode = 'VERTICAL';
  card.itemSpacing = 28;
  card.primaryAxisSizingMode = 'AUTO';
  card.counterAxisSizingMode = 'FIXED';
  card.resize(1212, 100);
  card.paddingTop = 36;
  card.paddingBottom = 40;
  card.paddingLeft = 40;
  card.paddingRight = 40;
  card.cornerRadius = 16;
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  card.strokes = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.88 } }];
  card.strokeWeight = 1;

  // Header
  const header = figma.createFrame();
  header.name = 'Header';
  header.layoutMode = 'VERTICAL';
  header.itemSpacing = 6;
  header.fills = [];

  const title = figma.createText();
  title.name = 'Title';
  const sectionTitleStyle = textStyles.get('Aster / Section (Headline)');
  if (sectionTitleStyle) title.textStyleId = sectionTitleStyle.id;
  title.characters = 'Input / Form Field Component Set';
  title.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.07, b: 0.07 } }];
  header.appendChild(title);

  const subtitle = figma.createText();
  subtitle.name = 'Subtitle';
  const bodyRegular = textStyles.get('Aster / Body (Regular)');
  if (bodyRegular) subtitle.textStyleId = bodyRegular.id;
  subtitle.characters = 'Standard 44px control box height (Shade-DS Input.tsx), 4px corner radius (--as-radius-sm), uppercase 11px label, and optional action affix. 5 distinct states.';
  subtitle.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
  header.appendChild(subtitle);
  card.appendChild(header);

  // States Matrix
  const states = ['default', 'hover', 'focus', 'invalid', 'disabled'];
  const stateLabels = ['Default', 'Hover', 'Focused', 'Invalid / Error', 'Disabled'];

  const matrixContainer = figma.createFrame();
  matrixContainer.name = 'Input States Row';
  matrixContainer.layoutMode = 'NONE';
  matrixContainer.resize(1132, 110);
  matrixContainer.fills = [];

  const varRadiusSm = variableMap.get('dimensions/radius/sm');
  const varSpace3 = variableMap.get('dimensions/space/3');
  const varCanvas = variableMap.get('semantic/color/surface/canvas');
  const varBorderSubtle = variableMap.get('semantic/color/border/subtle');
  const varBorderFocus = variableMap.get('semantic/color/border/focus');
  const varTextDefault = variableMap.get('semantic/color/text/default');
  const varTextMuted = variableMap.get('semantic/color/text/muted');
  const varCriticalText = variableMap.get('semantic/color/status/critical/text');

  const components = [];

  for (let i = 0; i < states.length; i++) {
    const state = states[i];

    const field = figma.createComponent();
    field.name = \`State=\${state}\`;
    field.layoutMode = 'VERTICAL';
    field.itemSpacing = 4;
    field.primaryAxisSizingMode = 'AUTO';
    field.counterAxisSizingMode = 'FIXED';
    field.resize(214, 94);
    field.fills = [];

    // Positioning in row
    field.x = i * 228;
    field.y = 0;

    // 1. Label Row (Label + Required indicator)
    const labelRow = figma.createFrame();
    labelRow.name = 'Label Row';
    labelRow.layoutMode = 'HORIZONTAL';
    labelRow.primaryAxisSizingMode = 'AUTO';
    labelRow.counterAxisSizingMode = 'AUTO';
    labelRow.itemSpacing = 4;
    labelRow.fills = [];

    const label = figma.createText();
    label.name = 'Label';
    const labelStyle = textStyles.get('Aster / Label (Small)');
    if (labelStyle) label.textStyleId = labelStyle.id;
    label.characters = 'CLUSTER ID';
    label.fills = [makeSolidPaint(varTextMuted, { r: 0.4, g: 0.4, b: 0.4 })];
    labelRow.appendChild(label);

    const requiredStar = figma.createText();
    requiredStar.name = 'Required Indicator';
    if (labelStyle) requiredStar.textStyleId = labelStyle.id;
    requiredStar.characters = '*';
    requiredStar.fills = [makeSolidPaint(varCriticalText, { r: 0.77, g: 0.13, b: 0.13 })];
    labelRow.appendChild(requiredStar);
    field.appendChild(labelRow);

    // 2. Control Box (44px Height)
    const box = figma.createFrame();
    box.name = 'Input Box';
    box.layoutMode = 'HORIZONTAL';
    box.primaryAxisAlignItems = 'CENTER';
    box.counterAxisAlignItems = 'CENTER';
    box.primaryAxisSizingMode = 'FIXED';
    box.counterAxisSizingMode = 'FIXED';
    box.resize(214, 44);
    box.paddingLeft = 12;
    box.paddingRight = 12;
    box.itemSpacing = 8;
    box.cornerRadius = 4;

    bindNodeVariable(box, 'cornerRadius', varRadiusSm);
    bindNodeVariable(box, 'paddingLeft', varSpace3);
    bindNodeVariable(box, 'paddingRight', varSpace3);

    box.fills = [makeSolidPaint(varCanvas, { r: 1, g: 1, b: 1 })];

    // Leading Search Icon
    const searchIcon = createIconNode(ICONS.search, 'Leading Icon', 16);
    applyIconColor(searchIcon, makeSolidPaint(varTextMuted, { r: 0.5, g: 0.5, b: 0.5 }));
    box.appendChild(searchIcon);

    // Input text inside box
    const valText = figma.createText();
    valText.name = 'Value';
    const bodyRegularStyle = textStyles.get('Aster / Body (Regular)');
    if (bodyRegularStyle) valText.textStyleId = bodyRegularStyle.id;
    valText.characters = state === 'default' ? 'acme-prod-01' : 'acme-prod-01';
    valText.fills = [makeSolidPaint(state === 'default' ? varTextMuted : varTextDefault, { r: 0.1, g: 0.1, b: 0.1 })];
    box.appendChild(valText);

    // Trailing Action Button Slot (24x24)
    const actionSlot = figma.createFrame();
    actionSlot.name = 'Action Slot';
    actionSlot.layoutMode = 'HORIZONTAL';
    actionSlot.primaryAxisAlignItems = 'CENTER';
    actionSlot.counterAxisAlignItems = 'CENTER';
    actionSlot.resize(24, 24);
    actionSlot.fills = [];
    const eyeIcon = createIconNode(ICONS.eye, 'Action Icon', 16);
    applyIconColor(eyeIcon, makeSolidPaint(varTextMuted, { r: 0.4, g: 0.4, b: 0.4 }));
    actionSlot.appendChild(eyeIcon);
    box.appendChild(actionSlot);

    // Strokes based on state
    if (state === 'invalid') {
      box.strokes = [makeSolidPaint(varCriticalText, { r: 0.77, g: 0.13, b: 0.13 })];
      box.strokeWeight = 1;
      box.strokeAlign = 'INSIDE';
    } else if (state === 'focus') {
      box.strokes = [makeSolidPaint(varBorderFocus, { r: 0.08, g: 0.39, b: 0.75 })];
      box.strokeWeight = 2;
      box.strokeAlign = 'INSIDE';
    } else if (state === 'hover') {
      box.strokes = [makeSolidPaint(varTextMuted, { r: 0.45, g: 0.45, b: 0.45 })];
      box.strokeWeight = 1;
      box.strokeAlign = 'INSIDE';
    } else {
      box.strokes = [makeSolidPaint(varBorderSubtle, { r: 0.88, g: 0.88, b: 0.88 })];
      box.strokeWeight = 1;
      box.strokeAlign = 'INSIDE';
    }

    if (state === 'disabled') {
      box.opacity = 0.5;
    }

    field.appendChild(box);

    // 3. Helper / Error Text Row
    const helperRow = figma.createFrame();
    helperRow.name = 'Helper Row';
    helperRow.layoutMode = 'HORIZONTAL';
    helperRow.primaryAxisAlignItems = 'CENTER';
    helperRow.itemSpacing = 4;
    helperRow.fills = [];

    const helperIcon = createIconNode(state === 'invalid' ? ICONS.xCircle : ICONS.info, 'Helper Icon', 14);
    applyIconColor(helperIcon, makeSolidPaint(state === 'invalid' ? varCriticalText : varTextMuted, { r: 0.5, g: 0.5, b: 0.5 }));
    helperRow.appendChild(helperIcon);

    const helper = figma.createText();
    helper.name = 'Helper';
    if (labelStyle) helper.textStyleId = labelStyle.id;
    helper.characters = state === 'invalid' ? 'Cluster ID is required' : 'Standard naming convention';
    helper.fills = [makeSolidPaint(state === 'invalid' ? varCriticalText : varTextMuted, { r: 0.5, g: 0.5, b: 0.5 })];
    helperRow.appendChild(helper);

    field.appendChild(helperRow);

    matrixContainer.appendChild(field);
    components.push(field);
  }

  card.appendChild(matrixContainer);

  const componentSet = figma.combineAsVariants(components, card);
  componentSet.name = 'Input';
  componentSet.description = 'Aster Design System standard input field (44px control height, 4px radius, 5 states).';
  parent.appendChild(card);
}

// -------------------------------------------------------------
// 8. Refined Badge Component Set
// -------------------------------------------------------------
async function buildBadgeComponentSet(parent, variableMap, textStyles, effectStyles) {
  const card = figma.createFrame();
  card.name = 'Section: Badge Component';
  card.layoutMode = 'VERTICAL';
  card.itemSpacing = 28;
  card.primaryAxisSizingMode = 'AUTO';
  card.counterAxisSizingMode = 'FIXED';
  card.resize(1212, 100);
  card.paddingTop = 36;
  card.paddingBottom = 40;
  card.paddingLeft = 40;
  card.paddingRight = 40;
  card.cornerRadius = 16;
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  card.strokes = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.88 } }];
  card.strokeWeight = 1;

  // Header
  const header = figma.createFrame();
  header.name = 'Header';
  header.layoutMode = 'VERTICAL';
  header.itemSpacing = 6;
  header.fills = [];

  const title = figma.createText();
  title.name = 'Title';
  const sectionTitleStyle = textStyles.get('Aster / Section (Headline)');
  if (sectionTitleStyle) title.textStyleId = sectionTitleStyle.id;
  title.characters = 'Badge Component Set';
  title.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.07, b: 0.07 } }];
  header.appendChild(title);

  const subtitle = figma.createText();
  subtitle.name = 'Subtitle';
  const bodyRegular = textStyles.get('Aster / Body (Regular)');
  if (bodyRegular) subtitle.textStyleId = bodyRegular.id;
  subtitle.characters = 'Compact 22px status tag pill, 6 status tones, Space Mono typography (--as-typography-font-family-mono), and optional 6px circular indicator dot.';
  subtitle.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
  header.appendChild(subtitle);
  card.appendChild(header);

  // Column Headers
  const colsHeader = figma.createFrame();
  colsHeader.name = 'Columns Header';
  colsHeader.layoutMode = 'HORIZONTAL';
  colsHeader.itemSpacing = 0;
  colsHeader.resize(1132, 28);
  colsHeader.fills = [];

  const cornerSpacer = figma.createFrame();
  cornerSpacer.resize(140, 20);
  cornerSpacer.fills = [];
  colsHeader.appendChild(cornerSpacer);

  const hasDotLabels = ['With Indicator Dot', 'Text Only'];
  for (const labelText of hasDotLabels) {
    const colHeaderBox = figma.createFrame();
    colHeaderBox.resize(220, 20);
    colHeaderBox.fills = [];
    colHeaderBox.layoutMode = 'HORIZONTAL';
    colHeaderBox.primaryAxisAlignItems = 'CENTER';

    const colText = figma.createText();
    const labelStyle = textStyles.get('Aster / Label (Small)');
    if (labelStyle) colText.textStyleId = labelStyle.id;
    colText.characters = labelText.toUpperCase();
    colText.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
    colHeaderBox.appendChild(colText);
    colsHeader.appendChild(colHeaderBox);
  }
  card.appendChild(colsHeader);

  // Matrix Workspace
  const matrixContainer = figma.createFrame();
  matrixContainer.name = 'Badge Variants Matrix';
  matrixContainer.layoutMode = 'NONE';
  matrixContainer.resize(1132, 340);
  matrixContainer.fills = [];

  const tones = ['default', 'muted', 'success', 'warning', 'critical', 'info'];
  const toneLabels = ['Default', 'Muted', 'Success', 'Warning', 'Critical', 'Info'];
  const toneDisplayTexts = ['DEFAULT', 'INACTIVE', 'HEALTHY', 'DEGRADED', 'FAILED', 'PENDING'];

  const varRadiusFull = variableMap.get('dimensions/radius/full');
  const varSpace1 = variableMap.get('dimensions/space/1');

  const components = [];

  for (let row = 0; row < tones.length; row++) {
    const tone = tones[row];

    // Row Label
    const rowLabel = figma.createText();
    rowLabel.name = \`RowLabel: \${toneLabels[row]}\`;
    const labelStyle = textStyles.get('Aster / Body Large (Title)');
    if (labelStyle) rowLabel.textStyleId = labelStyle.id;
    rowLabel.characters = toneLabels[row];
    rowLabel.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
    rowLabel.x = 0;
    rowLabel.y = row * 52 + 4;
    matrixContainer.appendChild(rowLabel);

    const hasDots = [true, false];
    for (let col = 0; col < hasDots.length; col++) {
      const hasDot = hasDots[col];

      const badge = figma.createComponent();
      badge.name = \`Tone=\${tone}, HasDot=\${hasDot}\`;
      badge.layoutMode = 'HORIZONTAL';
      badge.primaryAxisAlignItems = 'CENTER';
      badge.counterAxisAlignItems = 'CENTER';
      badge.primaryAxisSizingMode = 'AUTO';
      badge.counterAxisSizingMode = 'AUTO';
      badge.paddingLeft = 10;
      badge.paddingRight = 10;
      badge.paddingTop = 4;
      badge.paddingBottom = 4;
      badge.itemSpacing = 6;
      badge.cornerRadius = 9999;

      badge.x = 140 + col * 220;
      badge.y = row * 52;

      bindNodeVariable(badge, 'cornerRadius', varRadiusFull);
      bindNodeVariable(badge, 'itemSpacing', varSpace1);

      let bgVar = variableMap.get('semantic/color/surface/subtle');
      let fgVar = variableMap.get('semantic/color/text/default');
      let fallbackBg = { r: 0.94, g: 0.94, b: 0.94 };
      let fallbackFg = { r: 0.1, g: 0.1, b: 0.1 };

      if (tone === 'muted') {
        bgVar = variableMap.get('semantic/color/surface/subtle');
        fgVar = variableMap.get('semantic/color/text/muted');
        fallbackFg = { r: 0.45, g: 0.45, b: 0.45 };
      } else if (tone === 'success') {
        bgVar = variableMap.get('semantic/color/surface/success');
        fgVar = variableMap.get('semantic/color/status/success/text');
        fallbackBg = { r: 0.9, g: 0.96, b: 0.92 };
        fallbackFg = { r: 0.09, g: 0.5, b: 0.22 };
      } else if (tone === 'warning') {
        bgVar = variableMap.get('semantic/color/surface/warning');
        fgVar = variableMap.get('semantic/color/status/warning/text');
        fallbackBg = { r: 1.0, g: 0.97, b: 0.88 };
        fallbackFg = { r: 0.69, g: 0.35, b: 0.0 };
      } else if (tone === 'critical') {
        bgVar = variableMap.get('semantic/color/surface/critical');
        fgVar = variableMap.get('semantic/color/status/critical/text');
        fallbackBg = { r: 0.98, g: 0.92, b: 0.92 };
        fallbackFg = { r: 0.77, g: 0.13, b: 0.13 };
      } else if (tone === 'info') {
        bgVar = variableMap.get('semantic/color/surface/focus');
        fgVar = variableMap.get('semantic/color/status/focus/text');
        fallbackBg = { r: 0.89, g: 0.95, b: 0.99 };
        fallbackFg = { r: 0.08, g: 0.39, b: 0.75 };
      }

      badge.fills = [makeSolidPaint(bgVar, fallbackBg)];
      badge.strokes = [];

      // Dot Indicator (6x6)
      if (hasDot) {
        const dot = figma.createEllipse();
        dot.name = 'Dot';
        dot.resize(6, 6);
        dot.fills = [makeSolidPaint(fgVar, fallbackFg)];
        badge.appendChild(dot);
      }

      // Label Text
      const label = figma.createText();
      label.name = 'Label';
      const badgeStyle = textStyles.get('Aster / Badge (Mono)');
      if (badgeStyle) label.textStyleId = badgeStyle.id;
      label.characters = toneDisplayTexts[row];
      label.fills = [makeSolidPaint(fgVar, fallbackFg)];
      badge.appendChild(label);

      matrixContainer.appendChild(badge);
      components.push(badge);
    }
  }

  card.appendChild(matrixContainer);

  const componentSet = figma.combineAsVariants(components, card);
  componentSet.name = 'Badge';
  componentSet.description = 'Aster Design System status badge pill (22px height, full-pill radius, 6 tones).';
  parent.appendChild(card);
}

// -------------------------------------------------------------
// 9. Live Contextual Composition Showcase
// -------------------------------------------------------------
async function buildContextualShowcase(parent, variableMap, textStyles, effectStyles) {
  const card = figma.createFrame();
  card.name = 'Section: Real-World In-Context Composition';
  card.layoutMode = 'VERTICAL';
  card.itemSpacing = 28;
  card.primaryAxisSizingMode = 'AUTO';
  card.counterAxisSizingMode = 'FIXED';
  card.resize(1212, 100);
  card.paddingTop = 36;
  card.paddingBottom = 40;
  card.paddingLeft = 40;
  card.paddingRight = 40;
  card.cornerRadius = 16;
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  card.strokes = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.88 } }];
  card.strokeWeight = 1;

  // Header
  const header = figma.createFrame();
  header.name = 'Header';
  header.layoutMode = 'VERTICAL';
  header.itemSpacing = 6;
  header.fills = [];

  const title = figma.createText();
  title.name = 'Title';
  const sectionTitleStyle = textStyles.get('Aster / Section (Headline)');
  if (sectionTitleStyle) title.textStyleId = sectionTitleStyle.id;
  title.characters = 'In-Context Application Showcase';
  title.fills = [{ type: 'SOLID', color: { r: 0.07, g: 0.07, b: 0.07 } }];
  header.appendChild(title);

  const subtitle = figma.createText();
  subtitle.name = 'Subtitle';
  const bodyRegular = textStyles.get('Aster / Body (Regular)');
  if (bodyRegular) subtitle.textStyleId = bodyRegular.id;
  subtitle.characters = 'Demonstrates how Button, Input, and Badge harmonize in an authentic enterprise dialog container with direct semantic token bindings.';
  subtitle.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
  header.appendChild(subtitle);
  card.appendChild(header);

  // Centered Showcase Preview Box
  const previewArea = figma.createFrame();
  previewArea.name = 'Preview Area';
  previewArea.layoutMode = 'HORIZONTAL';
  previewArea.primaryAxisAlignItems = 'CENTER';
  previewArea.counterAxisAlignItems = 'CENTER';
  previewArea.primaryAxisSizingMode = 'FIXED';
  previewArea.counterAxisSizingMode = 'AUTO';
  previewArea.resize(1132, 280);
  previewArea.cornerRadius = 12;
  previewArea.fills = [{ type: 'SOLID', color: { r: 0.965, g: 0.965, b: 0.97 } }];

  // Dialog Card Container
  const dialogBox = figma.createFrame();
  dialogBox.name = 'Modal Dialog: Service Deploy';
  dialogBox.layoutMode = 'VERTICAL';
  dialogBox.itemSpacing = 20;
  dialogBox.primaryAxisSizingMode = 'AUTO';
  dialogBox.counterAxisSizingMode = 'FIXED';
  dialogBox.resize(460, 220);
  dialogBox.paddingTop = 28;
  dialogBox.paddingBottom = 28;
  dialogBox.paddingLeft = 32;
  dialogBox.paddingRight = 32;
  dialogBox.cornerRadius = 12;
  dialogBox.fills = [makeSolidPaint(variableMap.get('semantic/color/surface/card'), { r: 1, g: 1, b: 1 })];
  dialogBox.strokes = [makeSolidPaint(variableMap.get('semantic/color/border/subtle'), { r: 0.88, g: 0.88, b: 0.88 })];
  dialogBox.strokeWeight = 1;

  // Dialog Header (Title + Badge)
  const dialogHeader = figma.createFrame();
  dialogHeader.name = 'Dialog Header';
  dialogHeader.layoutMode = 'HORIZONTAL';
  dialogHeader.primaryAxisAlignItems = 'CENTER';
  dialogHeader.counterAxisAlignItems = 'CENTER';
  dialogHeader.primaryAxisSizingMode = 'FIXED';
  dialogHeader.counterAxisSizingMode = 'AUTO';
  dialogHeader.resize(396, 24);
  dialogHeader.fills = [];

  const dialogTitle = figma.createText();
  const bodyLarge = textStyles.get('Aster / Body Large (Title)');
  if (bodyLarge) dialogTitle.textStyleId = bodyLarge.id;
  dialogTitle.characters = 'Deploy Service Cluster';
  dialogTitle.fills = [makeSolidPaint(variableMap.get('semantic/color/text/default'), { r: 0.07, g: 0.07, b: 0.07 })];
  dialogHeader.appendChild(dialogTitle);

  const headerSpacer = figma.createFrame();
  headerSpacer.layoutGrow = 1;
  headerSpacer.fills = [];
  dialogHeader.appendChild(headerSpacer);

  // Status Badge in header
  const healthyBadge = figma.createFrame();
  healthyBadge.name = 'Status Badge';
  healthyBadge.layoutMode = 'HORIZONTAL';
  healthyBadge.primaryAxisAlignItems = 'CENTER';
  healthyBadge.itemSpacing = 6;
  healthyBadge.paddingLeft = 8;
  healthyBadge.paddingRight = 8;
  healthyBadge.paddingTop = 3;
  healthyBadge.paddingBottom = 3;
  healthyBadge.cornerRadius = 9999;
  healthyBadge.fills = [makeSolidPaint(variableMap.get('semantic/color/surface/success'), { r: 0.9, g: 0.96, b: 0.92 })];

  const dot = figma.createEllipse();
  dot.resize(6, 6);
  dot.fills = [makeSolidPaint(variableMap.get('semantic/color/status/success/text'), { r: 0.09, g: 0.5, b: 0.22 })];
  healthyBadge.appendChild(dot);

  const healthyText = figma.createText();
  const badgeStyle = textStyles.get('Aster / Badge (Mono)');
  if (badgeStyle) healthyText.textStyleId = badgeStyle.id;
  healthyText.characters = 'ONLINE';
  healthyText.fills = [makeSolidPaint(variableMap.get('semantic/color/status/success/text'), { r: 0.09, g: 0.5, b: 0.22 })];
  healthyBadge.appendChild(healthyText);

  dialogHeader.appendChild(healthyBadge);
  dialogBox.appendChild(dialogHeader);

  // Form Field Box inside dialog
  const inputContainer = figma.createFrame();
  inputContainer.name = 'Form Field';
  inputContainer.layoutMode = 'VERTICAL';
  inputContainer.itemSpacing = 4;
  inputContainer.primaryAxisSizingMode = 'AUTO';
  inputContainer.counterAxisSizingMode = 'FIXED';
  inputContainer.resize(396, 68);
  inputContainer.fills = [];

  const inputLabel = figma.createText();
  const labelStyle = textStyles.get('Aster / Label (Small)');
  if (labelStyle) inputLabel.textStyleId = labelStyle.id;
  inputLabel.characters = 'CLUSTER IDENTIFIER';
  inputLabel.fills = [makeSolidPaint(variableMap.get('semantic/color/text/muted'), { r: 0.45, g: 0.45, b: 0.45 })];
  inputContainer.appendChild(inputLabel);

  const inputMockBox = figma.createFrame();
  inputMockBox.name = 'Input Box';
  inputMockBox.layoutMode = 'HORIZONTAL';
  inputMockBox.primaryAxisAlignItems = 'CENTER';
  inputMockBox.primaryAxisSizingMode = 'FIXED';
  inputMockBox.counterAxisSizingMode = 'FIXED';
  inputMockBox.resize(396, 44);
  inputMockBox.paddingLeft = 14;
  inputMockBox.paddingRight = 14;
  inputMockBox.itemSpacing = 8;
  inputMockBox.cornerRadius = 4;
  inputMockBox.fills = [makeSolidPaint(variableMap.get('semantic/color/surface/canvas'), { r: 1, g: 1, b: 1 })];
  inputMockBox.strokes = [makeSolidPaint(variableMap.get('semantic/color/border/subtle'), { r: 0.85, g: 0.85, b: 0.85 })];
  inputMockBox.strokeWeight = 1;

  const mockSearch = createIconNode(ICONS.search, 'Search', 16);
  applyIconColor(mockSearch, makeSolidPaint(variableMap.get('semantic/color/text/muted'), { r: 0.5, g: 0.5, b: 0.5 }));
  inputMockBox.appendChild(mockSearch);

  const mockVal = figma.createText();
  if (bodyRegular) mockVal.textStyleId = bodyRegular.id;
  mockVal.characters = 'acme-edge-cluster-01';
  mockVal.fills = [makeSolidPaint(variableMap.get('semantic/color/text/default'), { r: 0.07, g: 0.07, b: 0.07 })];
  inputMockBox.appendChild(mockVal);

  inputContainer.appendChild(inputMockBox);
  dialogBox.appendChild(inputContainer);

  // Action Buttons Row (Secondary Cancel + Primary Deploy)
  const actionsRow = figma.createFrame();
  actionsRow.name = 'Actions Footer';
  actionsRow.layoutMode = 'HORIZONTAL';
  actionsRow.primaryAxisAlignItems = 'CENTER';
  actionsRow.counterAxisAlignItems = 'CENTER';
  actionsRow.itemSpacing = 12;
  actionsRow.primaryAxisSizingMode = 'FIXED';
  actionsRow.counterAxisSizingMode = 'AUTO';
  actionsRow.resize(396, 40);
  actionsRow.fills = [];

  const footerSpacer = figma.createFrame();
  footerSpacer.layoutGrow = 1;
  footerSpacer.fills = [];
  actionsRow.appendChild(footerSpacer);

  // Cancel Button
  const cancelBtn = figma.createFrame();
  cancelBtn.name = 'Button: Secondary';
  cancelBtn.layoutMode = 'HORIZONTAL';
  cancelBtn.primaryAxisAlignItems = 'CENTER';
  cancelBtn.counterAxisAlignItems = 'CENTER';
  cancelBtn.paddingLeft = 20;
  cancelBtn.paddingRight = 20;
  cancelBtn.paddingTop = 8;
  cancelBtn.paddingBottom = 8;
  cancelBtn.cornerRadius = 9999;
  cancelBtn.resize(88, 40);
  cancelBtn.fills = [makeSolidPaint(variableMap.get('semantic/color/surface/subtle'), { r: 0.94, g: 0.94, b: 0.94 })];
  cancelBtn.strokes = [makeSolidPaint(variableMap.get('semantic/color/border/subtle'), { r: 0.85, g: 0.85, b: 0.85 })];
  cancelBtn.strokeWeight = 1;

  const cancelLabel = figma.createText();
  const bodyMedium = textStyles.get('Aster / Body (Medium)');
  if (bodyMedium) cancelLabel.textStyleId = bodyMedium.id;
  cancelLabel.characters = 'Cancel';
  cancelLabel.fills = [makeSolidPaint(variableMap.get('semantic/color/text/default'), { r: 0.1, g: 0.1, b: 0.1 })];
  cancelBtn.appendChild(cancelLabel);
  actionsRow.appendChild(cancelBtn);

  // Deploy Button (Primary)
  const deployBtn = figma.createFrame();
  deployBtn.name = 'Button: Primary';
  deployBtn.layoutMode = 'HORIZONTAL';
  deployBtn.primaryAxisAlignItems = 'CENTER';
  deployBtn.counterAxisAlignItems = 'CENTER';
  deployBtn.itemSpacing = 8;
  deployBtn.paddingLeft = 24;
  deployBtn.paddingRight = 24;
  deployBtn.paddingTop = 8;
  deployBtn.paddingBottom = 8;
  deployBtn.cornerRadius = 9999;
  deployBtn.resize(140, 40);
  deployBtn.fills = [makeSolidPaint(variableMap.get('semantic/color/interactive/primary'), { r: 0.06, g: 0.06, b: 0.06 })];

  const deployIcon = createIconNode(ICONS.sparkle, 'Sparkle Icon', 16);
  applyIconColor(deployIcon, makeSolidPaint(variableMap.get('semantic/color/interactive/primary/text'), { r: 1, g: 1, b: 1 }));
  deployBtn.appendChild(deployIcon);

  const deployLabel = figma.createText();
  if (bodyMedium) deployLabel.textStyleId = bodyMedium.id;
  deployLabel.characters = 'Deploy';
  deployLabel.fills = [makeSolidPaint(variableMap.get('semantic/color/interactive/primary/text'), { r: 1, g: 1, b: 1 })];
  deployBtn.appendChild(deployLabel);
  actionsRow.appendChild(deployBtn);

  dialogBox.appendChild(actionsRow);
  previewArea.appendChild(dialogBox);
  card.appendChild(previewArea);
  parent.appendChild(card);
}

// Kick off execution
runAsterSetup();
`;

  const outputPath = resolve(pluginDir, 'code.js');
  writeFileSync(outputPath, codeContent, 'utf8');
  console.log(`✓ Compiled Refined Aster DS Figma Plugin to: ${outputPath}`);
}

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].endsWith('build-figma-plugin.js')) {
  buildFigmaPlugin();
}
