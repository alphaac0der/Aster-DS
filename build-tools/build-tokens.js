import StyleDictionary from 'style-dictionary';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

async function build() {
  console.log('--- Building Aster Design Tokens ---');

  // NOTE: This build script is currently configured for initial TECHNICAL FIXTURES only.
  // These are test tokens to validate DTCG parsing and CSS compilation.
  // They are NOT Aster's final design tokens. When production tokens are authored,
  // this configuration will be updated to point to canonical token sets.

  // 1. Build Light Theme & Primitives (:root)
  const sdLight = new StyleDictionary({
    source: [
      'tokens/primitive/fixture-primitive.json',
      'tokens/semantic/fixture-semantic-light.json'
    ],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix: 'as',
        buildPath: 'dist/css/',
        files: [
          {
            destination: 'tokens-light.css',
            format: 'css/variables',
            options: {
              selector: ':root',
              outputReferences: false
            }
          }
        ]
      }
    }
  });

  await sdLight.buildAllPlatforms();
  console.log('✓ Compiled light mode and primitive tokens to dist/css/tokens-light.css');

  // 2. Build Dark Theme Overrides ([data-theme="dark"])
  const sdDark = new StyleDictionary({
    source: [
      'tokens/primitive/fixture-primitive.json',
      'tokens/semantic/fixture-semantic-dark.json'
    ],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix: 'as',
        buildPath: 'dist/css/',
        files: [
          {
            destination: 'tokens-dark.css',
            format: 'css/variables',
            filter: (token) => token.path.includes('semantic'),
            options: {
              selector: '[data-theme="dark"]',
              outputReferences: false
            }
          }
        ]
      }
    }
  });

  await sdDark.buildAllPlatforms();
  console.log('✓ Compiled dark mode semantic overrides to dist/css/tokens-dark.css');

  console.log('--- Token Build Complete ---');
}

build().catch((err) => {
  console.error('Token build failed:', err);
  process.exit(1);
});
