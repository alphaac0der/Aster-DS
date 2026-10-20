import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const WebSocket = globalThis.WebSocket;
const ARTIFACT_DIR = process.env.ARTIFACT_DIR || path.join(process.cwd(), '.artifacts');

/**
 * Aster Design System — Automated Browser Component Audit Tool
 * Drives headless Chrome via Chrome DevTools Protocol (CDP) to verify Button, Input,
 * and Table components in real rendering and interaction environments.
 */

const CHROME_PATH = process.env.CHROME_PATH || (
  process.platform === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' :
  process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' :
  'google-chrome'
);
const DEBUG_PORT = 9223;
const TEST_URL = 'http://127.0.0.1:3000/examples/clean-consumer/index.html';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 0;
    this.pending = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        if (payload.id && this.pending.has(payload.id)) {
          const { resolve, reject } = this.pending.get(payload.id);
          this.pending.delete(payload.id);
          if (payload.error) reject(new Error(payload.error.message));
          else resolve(payload.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.id;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(`Eval exception: ${res.exceptionDetails.text} (${expression})`);
    }
    return res.result?.value;
  }

  async dispatchMouseEvent(type, x, y, button = 'none', clickCount = 0) {
    await this.send('Input.dispatchMouseEvent', {
      type,
      x,
      y,
      button,
      clickCount
    });
  }

  async getElementBox(selector) {
    return await this.eval(`
      (() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left, y: r.top, width: r.width, height: r.height };
      })()
    `);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runBrowserAudit() {
  console.log('========================================================================================');
  console.log('            ASTER DESIGN SYSTEM — REAL BROWSER COMPONENT AUDIT                         ');
  console.log('========================================================================================\n');

  console.log('• Ensuring local Aster HTTP server is running on port 3000...');
  const serverProc = spawn(process.execPath, ['build-tools/serve-playground.js'], {
    stdio: 'ignore'
  });
  await wait(400);

  console.log(`• Spawning headless Chrome on port ${DEBUG_PORT}...`);
  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    'about:blank'
  ]);

  let cdp = null;
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  function assert(title, condition, extraInfo = '') {
    if (condition) {
      results.passed++;
      results.tests.push({ title, status: 'PASS' });
      console.log(`  ✔ PASS: ${title} ${extraInfo ? `(${extraInfo})` : ''}`);
    } else {
      results.failed++;
      results.tests.push({ title, status: 'FAIL', extraInfo });
      console.error(`  ✖ FAIL: ${title} ${extraInfo ? `— ${extraInfo}` : ''}`);
    }
  }

  try {
    // Wait for Chrome to be ready
    let targets = null;
    for (let attempt = 0; attempt < 20; attempt++) {
      try {
        targets = await fetchJson(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
        if (targets && targets.length) break;
      } catch {
        await wait(200);
      }
    }

    if (!targets || !targets.length) {
      throw new Error('Chrome failed to respond on debug port.');
    }

    const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
    cdp = new CdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('DOM.enable');

    console.log(`• Navigating to clean consumer example: ${TEST_URL}`);
    await cdp.send('Page.navigate', { url: TEST_URL });
    await wait(800); // Allow render and module initialization

    // ----------------------------------------------------------------------------------
    // Suite 1: Clean Consumer Loading & Zero Runtime Errors
    // ----------------------------------------------------------------------------------
    console.log('\n--- Suite 1: Clean Consumer Loading & Initialization ---');
    const pageTitle = await cdp.eval('document.title');
    assert('Page loaded successfully', pageTitle.includes('Aster Design System'), pageTitle);

    const isInitialized = await cdp.eval('typeof window.__buttonActivations !== "undefined"');
    assert('Aster ES module initialized correctly', isInitialized);

    const activeStylesheets = await cdp.eval(`
      Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.getAttribute('href'))
    `);
    assert('Loaded strictly canonical dist/ assets',
      activeStylesheets.includes('/dist/css/tokens.css') &&
      activeStylesheets.includes('/dist/css/components.css') &&
      !activeStylesheets.some(h => h.includes('playground.css')),
      activeStylesheets.join(', ')
    );

    // ----------------------------------------------------------------------------------
    // Suite 2: Button Component Behavioral Audit
    // ----------------------------------------------------------------------------------
    console.log('\n--- Suite 2: Button Component Audit ---');

    // 2A: Variants, Control Heights & 24px Horizontal Padding (Phase 15)
    const btnGeometry = await cdp.eval(`
      (() => {
        const primary = document.querySelector('#btn-primary');
        const secondary = document.querySelector('#btn-secondary');
        const destructive = document.querySelector('#btn-destructive');
        const ghost = document.querySelector('#btn-ghost');
        const compactPrimary = document.querySelector('#btn-compact-primary');

        const csP = getComputedStyle(primary);

        return {
          standardHeight: parseFloat(csP.height),
          paddingLeft: csP.paddingLeft,
          paddingRight: csP.paddingRight,
          hasCompactEl: Boolean(compactPrimary),
          borderRadius: csP.borderRadius,
          primaryBg: csP.backgroundColor,
          ghostBg: getComputedStyle(ghost).backgroundColor
        };
      })()
    `);
    assert('Button Standard Height is 40px', btnGeometry.standardHeight === 40, `${btnGeometry.standardHeight}px`);
    assert('Button horizontal padding is 24px left and 24px right', btnGeometry.paddingLeft === '24px' && btnGeometry.paddingRight === '24px', `${btnGeometry.paddingLeft} / ${btnGeometry.paddingRight}`);
    assert('Compact mode button removed (single Standard density)', btnGeometry.hasCompactEl === false);
    assert('Button Primary fill is Shade-DS monochrome #0F0F0F in Light Mode', btnGeometry.primaryBg === 'rgb(15, 15, 15)', btnGeometry.primaryBg);
    assert('Button is full pill shape (9999px radius)', parseInt(btnGeometry.borderRadius) >= 999, btnGeometry.borderRadius);
    assert('Ghost button background is transparent at rest', btnGeometry.ghostBg === 'rgba(0, 0, 0, 0)', btnGeometry.ghostBg);

    // 2B: Pointer-Origin Circular Hover Animation
    const primaryBox = await cdp.getElementBox('#btn-primary');
    const hoverX = Math.round(primaryBox.x + 25);
    const hoverY = Math.round(primaryBox.y + 18);

    await cdp.dispatchMouseEvent('mouseMoved', hoverX, hoverY);
    await wait(60);

    const hoverProperties = await cdp.eval(`
      (() => {
        const btn = document.querySelector('#btn-primary');
        const x = btn.style.getPropertyValue('--_x');
        const y = btn.style.getPropertyValue('--_y');
        const maxD = btn.style.getPropertyValue('--_max-d');
        const beforeCS = getComputedStyle(btn, '::before');
        return { x, y, maxD, beforeWidth: beforeCS.width, beforeHeight: beforeCS.height, beforeZ: beforeCS.zIndex };
      })()
    `);
    assert('Pointer-origin --_x and --_y tracked on hover',
      hoverProperties.x.includes('px') && hoverProperties.y.includes('px'),
      `x: ${hoverProperties.x}, y: ${hoverProperties.y}, maxD: ${hoverProperties.maxD}`
    );
    assert('StateLayer ::before is positioned at z-index -1 below text/icons', hoverProperties.beforeZ === '-1', hoverProperties.beforeZ);

    // Move pointer out of button and verify exit
    await cdp.dispatchMouseEvent('mouseMoved', 10, 10);
    await wait(300);

    // 2C: Keyboard Focus & Activation
    await cdp.eval(`document.querySelector('#btn-primary').focus()`);
    const isFocused = await cdp.eval(`document.activeElement.id === 'btn-primary'`);
    assert('Button receives keyboard focus via Tab/focus()', isFocused);

    // 2C-2: Reduced Motion Verification via CDP Emulation
    await cdp.send('Emulation.setEmulatedMedia', {
      media: 'screen',
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });
    await wait(50);
    const reducedMotionCheck = await cdp.eval(`
      (() => {
        const btn = document.querySelector('#btn-primary');
        const cs = getComputedStyle(btn);
        const rootCS = getComputedStyle(document.documentElement);
        return {
          transform: cs.transform,
          rootLift: rootCS.getPropertyValue('--as-motion-lift').trim(),
          rootLiftScale: rootCS.getPropertyValue('--as-motion-lift-scale').trim()
        };
      })()
    `);
    assert('Prefers-reduced-motion collapses lift to 0px', reducedMotionCheck.rootLift === '0px', reducedMotionCheck.rootLift);
    assert('Prefers-reduced-motion collapses lift scale to 1', reducedMotionCheck.rootLiftScale === '1', reducedMotionCheck.rootLiftScale);
    assert('Button transform is none under reduced motion', reducedMotionCheck.transform === 'none', reducedMotionCheck.transform);

    // Reset emulated media
    await cdp.send('Emulation.setEmulatedMedia', { media: 'screen', features: [] });
    await wait(50);

    // 2D: Disabled and Loading Safeguards
    const clickCountsBefore = await cdp.eval(`window.__buttonActivations`);
    // Click native disabled
    await cdp.eval(`document.querySelector('#btn-native-disabled').click()`);
    // Click aria-disabled
    await cdp.eval(`document.querySelector('#btn-aria-disabled').click()`);
    // Click aria-busy
    await cdp.eval(`document.querySelector('#btn-aria-busy').click()`);
    // Click normal primary button
    await cdp.eval(`document.querySelector('#btn-primary').click()`);

    const clickCountsAfter = await cdp.eval(`window.__buttonActivations`);
    assert('Native disabled button blocked from action trigger', !clickCountsAfter['Native Disabled']);
    assert('Focus-retaining aria-disabled button blocked from action trigger', !clickCountsAfter['ARIA Disabled']);
    assert('Loading aria-busy button blocked from action trigger', !clickCountsAfter['ARIA Busy']);
    assert('Standard enabled button triggers action successfully', clickCountsAfter['Primary Submit'] === 1);

    // 2E: Asynchronous setButtonLoading() Helper Test
    await cdp.eval(`document.querySelector('#btn-test-loader').click()`);
    await wait(100);
    const loadingState = await cdp.eval(`
      (() => {
        const btn = document.querySelector('#btn-test-loader');
        const hasBusy = btn.getAttribute('aria-busy') === 'true';
        const hasSpinner = Boolean(btn.querySelector('.as-spinner'));
        const text = btn.textContent.trim();
        return { hasBusy, hasSpinner, text };
      })()
    `);
    assert('setButtonLoading() sets aria-busy="true"', loadingState.hasBusy);
    assert('setButtonLoading() renders accessible .as-spinner', loadingState.hasSpinner);
    assert('setButtonLoading() updates text stably', loadingState.text.includes('Executing Rollout...'), loadingState.text);

    // ----------------------------------------------------------------------------------
    // Suite 3: Input / Form Field Component Audit
    // ----------------------------------------------------------------------------------
    console.log('\n--- Suite 3: Input / Form Field Audit ---');

    // 3A: Label & Helper Text Programmatic Association
    const inputAssoc = await cdp.eval(`
      (() => {
        const inp = document.querySelector('#inp-cluster-name');
        const label = document.querySelector('label[for="inp-cluster-name"]');
        const describedby = inp.getAttribute('aria-describedby') || '';
        const helper = document.getElementById(describedby);
        return {
          hasLabel: Boolean(label),
          describedby,
          helperFound: Boolean(helper),
          helperText: helper?.textContent?.trim()
        };
      })()
    `);
    assert('Input has explicit <label for="id"> association', inputAssoc.hasLabel);
    assert('Input has aria-describedby pointing to rendered helper ID',
      inputAssoc.helperFound,
      `aria-describedby: "${inputAssoc.describedby}"`
    );

    // 3B: Validation Lifecycle & Error Priority Ordering
    await cdp.eval(`
      (() => {
        const inp = document.querySelector('#inp-cluster-name');
        inp.value = 'INVALID SLUG WITH SPACES!';
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('focusout', { bubbles: true }));
      })()
    `);
    await wait(100);

    const errorState = await cdp.eval(`
      (() => {
        const inp = document.querySelector('#inp-cluster-name');
        const field = document.querySelector('#field-cluster-name');
        const errEl = document.querySelector('#inp-cluster-name-err');
        const describedBy = inp.getAttribute('aria-describedby') || '';
        return {
          ariaInvalid: inp.getAttribute('aria-invalid'),
          fieldHasClass: field.classList.contains('as-form-field--error'),
          errVisible: !errEl.hidden,
          errText: errEl.querySelector('.as-form-field__error-text')?.textContent?.trim(),
          describedBy
        };
      })()
    `);
    assert('Input receives aria-invalid="true" upon failed validation', errorState.ariaInvalid === 'true');
    assert('Field receives .as-form-field--error state class', errorState.fieldHasClass);
    assert('Error message element unhides and displays guidance', errorState.errVisible, errorState.errText);
    assert('aria-describedby places error ID FIRST followed by helper ID',
      errorState.describedBy.startsWith('inp-cluster-name-err'),
      errorState.describedBy
    );

    // 3C: Error Clearing
    await cdp.eval(`
      (() => {
        const inp = document.querySelector('#inp-cluster-name');
        inp.value = 'valid-cluster-01';
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('focusout', { bubbles: true }));
      })()
    `);
    await wait(100);

    const clearedState = await cdp.eval(`
      (() => {
        const inp = document.querySelector('#inp-cluster-name');
        const field = document.querySelector('#field-cluster-name');
        const errEl = document.querySelector('#inp-cluster-name-err');
        return {
          ariaInvalid: inp.getAttribute('aria-invalid'),
          fieldHasClass: field.classList.contains('as-form-field--error'),
          errVisible: !errEl.hidden,
          describedBy: inp.getAttribute('aria-describedby') || ''
        };
      })()
    `);
    assert('aria-invalid removed when value corrected', clearedState.ariaInvalid === null);
    assert('Error element hidden and field error class cleared', !clearedState.errVisible && !clearedState.fieldHasClass);
    assert('aria-describedby restores to helper ID only without stale error ID',
      !clearedState.describedBy.includes('inp-cluster-name-err'),
      clearedState.describedBy
    );

    // 3D: Clear Action Button
    await cdp.eval(`document.querySelector('.as-input__action--clear').click()`);
    const valAfterClear = await cdp.eval(`document.querySelector('#inp-cluster-name').value`);
    const isClearBtnHidden = await cdp.eval(`document.querySelector('.as-input__action--clear').hidden`);
    assert('Clear action resets input value to empty string', valAfterClear === '');
    assert('Clear action button hides when input is empty', isClearBtnHidden);

    // 3E: Password Toggle Action Button
    const pwBefore = await cdp.eval(`document.querySelector('#inp-api-key').type`);
    await cdp.eval(`document.querySelector('.as-input__action--pw').click()`);
    const pwToggled = await cdp.eval(`
      (() => {
        const inp = document.querySelector('#inp-api-key');
        const btn = document.querySelector('.as-input__action--pw');
        return { type: inp.type, pressed: btn.getAttribute('aria-pressed') };
      })()
    `);
    assert('Password toggle button switches input type to "text"', pwToggled.type === 'text');
    assert('Password toggle button sets aria-pressed="true"', pwToggled.pressed === 'true');

    // Toggle back
    await cdp.eval(`document.querySelector('.as-input__action--pw').click()`);
    const pwRestored = await cdp.eval(`document.querySelector('#inp-api-key').type`);
    assert('Password toggle switches back to "password"', pwRestored === 'password');

    // 3F: Shade-DS Input Geometry & Surface Verification
    const inputStyle = await cdp.eval(`
      (() => {
        const box = document.querySelector('#field-cluster-name .as-input-box');
        const csBox = getComputedStyle(box);
        return {
          boxH: csBox.height,
          boxRadius: csBox.borderRadius,
          boxBorder: csBox.borderStyle,
          boxShadow: csBox.boxShadow
        };
      })()
    `);
    assert('Input box height is 44px comfortable matching Shade-DS', inputStyle.boxH === '44px', inputStyle.boxH);
    assert('Input box border-radius is 4px (Radius.S) matching Shade-DS', inputStyle.boxRadius === '4px', inputStyle.boxRadius);
    assert('Input box has no wireframe border stroke', inputStyle.boxBorder === 'none' || inputStyle.boxBorder === '', inputStyle.boxBorder);
    assert('Input box uses Shade-DS double 1px glass glow box-shadow', inputStyle.boxShadow.includes('1px'), inputStyle.boxShadow);

    // ----------------------------------------------------------------------------------
    // Suite 4: Data Table Component Audit
    // ----------------------------------------------------------------------------------
    console.log('\n--- Suite 4: Data Table Audit ---');

    // 4A: Native Table Semantics
    const tableSemantics = await cdp.eval(`
      (() => {
        const tbl = document.querySelector('#tbl-nodes');
        const caption = tbl.querySelector('caption');
        const thead = tbl.querySelector('thead');
        const tbody = tbl.querySelector('tbody');
        const colHeaders = Array.from(tbl.querySelectorAll('th[scope="col"]')).length;
        const rowHeaders = Array.from(tbl.querySelectorAll('tbody th[scope="row"]')).length;
        return {
          hasCaption: Boolean(caption),
          captionText: caption?.textContent?.trim(),
          hasThead: Boolean(thead),
          hasTbody: Boolean(tbody),
          colHeaders,
          rowHeaders
        };
      })()
    `);
    assert('Table has accessible <caption> element', tableSemantics.hasCaption, tableSemantics.captionText);
    assert('Table uses native <thead>, <tbody>, and scope="col" headers', tableSemantics.colHeaders >= 5, `${tableSemantics.colHeaders} col headers`);
    assert('Table rows declare scope="row" primary identifiers', tableSemantics.rowHeaders >= 3, `${tableSemantics.rowHeaders} row headers`);

    // 4B: Conditional Horizontal Overflow Region (WCAG SC 2.1.1)
    const tableOverflowA = await cdp.eval(`
      (() => {
        const el = document.querySelector('#table-scroll-overflow');
        return {
          tabindex: el.getAttribute('tabindex'),
          role: el.getAttribute('role'),
          ariaLabel: el.getAttribute('aria-label'),
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth
        };
      })()
    `);
    assert('Overflowing Table A dynamically receives tabindex="0"', tableOverflowA.tabindex === '0');
    assert('Overflowing Table A receives role="region"', tableOverflowA.role === 'region');
    assert('Overflowing Table A receives aria-label from caption', Boolean(tableOverflowA.ariaLabel), tableOverflowA.ariaLabel);

    const tableOverflowB = await cdp.eval(`
      (() => {
        const el = document.querySelector('#table-scroll-fit');
        return {
          tabindex: el.getAttribute('tabindex'),
          role: el.getAttribute('role'),
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth
        };
      })()
    `);
    assert('Non-overflowing Table B does NOT declare tabindex (avoids redundant tab stop)', tableOverflowB.tabindex === null);
    assert('Non-overflowing Table B does NOT declare role="region"', tableOverflowB.role === null);

    // 4C: Column Sort Cycling & Accessible State
    const sortBtn = await cdp.eval(`
      (() => {
        const th = document.querySelector('th[aria-sort]:nth-child(3)');
        const btn = th.querySelector('.as-table__sort-btn');
        btn.click();
        return {
          ariaSortAfter1: th.getAttribute('aria-sort'),
          key: btn.dataset.sortKey
        };
      })()
    `);
    assert('Clicking sort button cycles aria-sort to "ascending"', sortBtn.ariaSortAfter1 === 'ascending');

    const sortBtnSecond = await cdp.eval(`
      (() => {
        const th = document.querySelector('th[aria-sort]:nth-child(3)');
        th.querySelector('.as-table__sort-btn').click();
        return th.getAttribute('aria-sort');
      })()
    `);
    assert('Clicking sort button a second time cycles aria-sort to "descending"', sortBtnSecond === 'descending');

    // 4D: Multi-Row Checkbox Selection & Indeterminate State
    // Check row 1
    await cdp.eval(`
      (() => {
        const row1 = document.querySelector('input[data-row-id="node-1"]');
        row1.checked = true;
        row1.dispatchEvent(new Event('change', { bubbles: true }));
      })()
    `);
    const selectState1 = await cdp.eval(`
      (() => {
        const allBox = document.querySelector('#chk-select-all');
        const row1 = document.querySelector('#row-node-1');
        return {
          allChecked: allBox.checked,
          allIndeterminate: allBox.indeterminate,
          row1Selected: row1.hasAttribute('data-selected')
        };
      })()
    `);
    assert('Row 1 gets data-selected attribute when checked', selectState1.row1Selected);
    assert('Select-all header checkbox reflects indeterminate state on partial selection', selectState1.allIndeterminate && !selectState1.allChecked);

    // Check all remaining rows
    await cdp.eval(`
      (() => {
        document.querySelectorAll('input[data-row-id]').forEach(b => {
          b.checked = true;
          b.dispatchEvent(new Event('change', { bubbles: true }));
        });
      })()
    `);
    const selectStateAll = await cdp.eval(`
      (() => {
        const allBox = document.querySelector('#chk-select-all');
        return { allChecked: allBox.checked, allIndeterminate: allBox.indeterminate };
      })()
    `);
    assert('Select-all header checkbox is checked and not indeterminate when all rows selected', selectStateAll.allChecked && !selectStateAll.allIndeterminate);

    // Click select-all to clear all
    await cdp.eval(`
      (() => {
        const allBox = document.querySelector('#chk-select-all');
        allBox.checked = false;
        allBox.dispatchEvent(new Event('change', { bubbles: true }));
      })()
    `);
    const selectStateCleared = await cdp.eval(`
      (() => {
        const anySelected = document.querySelectorAll('tr[data-selected]').length;
        const allBox = document.querySelector('#chk-select-all');
        return { anySelected, allChecked: allBox.checked, allIndeterminate: allBox.indeterminate };
      })()
    `);
    assert('Unchecking select-all clears all row data-selected states', selectStateCleared.anySelected === 0);

    // ----------------------------------------------------------------------------------
    // Suite 5: Batch A Form Essentials Component Audit
    // ----------------------------------------------------------------------------------
    console.log('\n--- Suite 5: Batch A Form Essentials Component Audit ---');

    // 5A: Checkbox (Checked, Indeterminate & Touch Boundary)
    const chkState = await cdp.eval(`
      (() => {
        const t = document.querySelector('#chk-telemetry');
        const ad = document.querySelector('#chk-auto-drain');
        const box = t.closest('.as-checkbox');
        const r = box.getBoundingClientRect();
        return {
          tChecked: t.checked,
          adIndeterminate: ad.indeterminate,
          adAriaChecked: ad.getAttribute('aria-checked'),
          boxWidth: r.width,
          boxHeight: r.height
        };
      })()
    `);
    assert('Checkbox telemetry is checked by default', chkState.tChecked);
    assert('Checkbox auto-drain is indeterminate with aria-checked="mixed"', chkState.adIndeterminate && chkState.adAriaChecked === 'mixed');
    assert('Checkbox touch boundary is at least 28px', chkState.boxWidth >= 28 && chkState.boxHeight >= 28, `${chkState.boxWidth}x${chkState.boxHeight}`);

    // Toggle Checkbox
    await cdp.eval(`document.querySelector('#chk-telemetry').click()`);
    const chkAfterToggle = await cdp.eval(`document.querySelector('#chk-telemetry').checked`);
    assert('Clicking checkbox toggles checked state to false', chkAfterToggle === false);

    // 5B: Radio Group (Fieldset & Mutual Exclusivity)
    const radState = await cdp.eval(`
      (() => {
        const rolling = document.querySelector('#rad-rolling');
        const canary = document.querySelector('#rad-canary');
        const grp = rolling.closest('fieldset.as-radio-group');
        const legend = grp ? grp.querySelector('legend.as-radio-group__legend') : null;
        return {
          hasFieldset: Boolean(grp),
          hasLegend: Boolean(legend),
          rollingChecked: rolling.checked,
          canaryChecked: canary.checked
        };
      })()
    `);
    assert('Radio group is wrapped in fieldset with legend', radState.hasFieldset && radState.hasLegend);
    assert('Radio rolling is checked by default', radState.rollingChecked && !radState.canaryChecked);

    // Click Canary radio
    await cdp.eval(`document.querySelector('#rad-canary').click()`);
    const radStateAfter = await cdp.eval(`
      (() => {
        const rolling = document.querySelector('#rad-rolling');
        const canary = document.querySelector('#rad-canary');
        return { rollingChecked: rolling.checked, canaryChecked: canary.checked };
      })()
    `);
    assert('Clicking canary radio switches selection exclusively', radStateAfter.canaryChecked && !radStateAfter.rollingChecked);

    // 5C: Switch (Toggle & Role)
    const swState = await cdp.eval(`
      (() => {
        const sw = document.querySelector('#sw-maintenance');
        return {
          role: sw.getAttribute('role'),
          checked: sw.checked
        };
      })()
    `);
    assert('Switch declares role="switch"', swState.role === 'switch');
    assert('Switch maintenance mode is unchecked by default', swState.checked === false);

    // Click Switch
    await cdp.eval(`document.querySelector('#sw-maintenance').click()`);
    const swAfterClick = await cdp.eval(`document.querySelector('#sw-maintenance').checked`);
    assert('Clicking switch toggles state to checked', swAfterClick === true);

    // 5D: Select Dropdown (Control Height & Value Change)
    const selState = await cdp.eval(`
      (() => {
        const sel = document.querySelector('#sel-region');
        const box = sel.closest('.as-select-box');
        const r = box.getBoundingClientRect();
        return {
          val: sel.value,
          height: Math.round(r.height),
          hasChevron: Boolean(box.querySelector('.as-select-chevron'))
        };
      })()
    `);
    assert('Select initial value is eu-west-1', selState.val === 'eu-west-1');
    assert('Select box height is 44px matching Shade-DS control height', selState.height === 44, `${selState.height}px`);
    assert('Select box renders decorative chevron', selState.hasChevron);

    // Change select value
    await cdp.eval(`
      (() => {
        const sel = document.querySelector('#sel-region');
        sel.value = 'us-east-1';
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      })()
    `);
    const selAfter = await cdp.eval(`document.querySelector('#sel-region').value`);
    assert('Select value updates to us-east-1', selAfter === 'us-east-1');

    // 5E: Slider Range (Progress Sync)
    const sldState = await cdp.eval(`
      (() => {
        const sld = document.querySelector('#sld-memory');
        const progress = sld.style.getPropertyValue('--_progress');
        const valText = document.querySelector('#sld-memory-val').textContent;
        return { val: sld.value, progress, valText };
      })()
    `);
    assert('Slider initial value is 75', sldState.val === '75');
    assert('Slider --_progress CSS property is synchronized', sldState.progress.includes('%'), sldState.progress);

    // Change slider value
    await cdp.eval(`
      (() => {
        const sld = document.querySelector('#sld-memory');
        sld.value = '50';
        sld.dispatchEvent(new Event('input', { bubbles: true }));
      })()
    `);
    const sldAfter = await cdp.eval(`
      (() => {
        const sld = document.querySelector('#sld-memory');
        const progress = sld.style.getPropertyValue('--_progress');
        const valText = document.querySelector('#sld-memory-val').textContent;
        return { val: sld.value, progress, valText };
      })()
    `);
    assert('Slider --_progress updates on input event', sldAfter.progress.includes('%') && sldAfter.val === '50', sldAfter.progress);

    // 5F: Textarea (Counter & Auto-Resize)
    const txtState = await cdp.eval(`
      (() => {
        const ta = document.querySelector('#txt-deploy-notes');
        const counter = ta.closest('.as-textarea-box').querySelector('.as-textarea__counter');
        return {
          valLength: ta.value.length,
          counterText: counter ? counter.textContent : ''
        };
      })()
    `);
    assert('Textarea counter reflects initial value length', txtState.counterText.includes(String(txtState.valLength)), txtState.counterText);

    // Type new text into textarea
    await cdp.eval(`
      (() => {
        const ta = document.querySelector('#txt-deploy-notes');
        ta.value = 'Short note.';
        ta.dispatchEvent(new Event('input', { bubbles: true }));
      })()
    `);
    const txtAfter = await cdp.eval(`
      (() => {
        const ta = document.querySelector('#txt-deploy-notes');
        const counter = ta.closest('.as-textarea-box').querySelector('.as-textarea__counter');
        return counter ? counter.textContent : '';
      })()
    `);
    assert('Textarea counter updates dynamically on input event', txtAfter.includes('11 / 300'), txtAfter);

    // ----------------------------------------------------------------------------------
    // Suite 6: Batch B Feedback & Utilities Component Audit
    // ----------------------------------------------------------------------------------
    console.log('\n--- Suite 6: Batch B Feedback & Utilities Component Audit ---');

    // 6A: Badge (Status & Dot Indicator)
    const badgeState = await cdp.eval(`
      (() => {
        const b = document.querySelector('#badge-prod');
        const dot = b ? b.querySelector('.as-badge__dot') : null;
        return {
          exists: Boolean(b),
          hasSuccessClass: b ? b.classList.contains('as-badge--success') : false,
          hasDot: Boolean(dot),
          text: b ? b.textContent.trim() : ''
        };
      })()
    `);
    assert('Badge healthy renders with success class', badgeState.hasSuccessClass);
    assert('Badge contains status dot indicator', badgeState.hasDot);
    assert('Badge text conveys state explicitly', badgeState.text.includes('Healthy'), badgeState.text);

    // 6B: Alert (Region Role, Title, No Outline & Dismissal)
    const alertState = await cdp.eval(`
      (() => {
        const a = document.querySelector('#alert-maintenance');
        const title = a ? a.querySelector('.as-alert__title') : null;
        const cs = a ? getComputedStyle(a) : null;
        return {
          exists: Boolean(a),
          role: a ? a.getAttribute('role') : null,
          titleText: title ? title.textContent : '',
          borderStyle: cs ? cs.borderStyle : '',
          outlineStyle: cs ? cs.outlineStyle : ''
        };
      })()
    `);
    assert('Alert declares role="region"', alertState.role === 'region');
    assert('Alert renders title text', alertState.titleText.includes('Scheduled Rolling Kernel Upgrade'), alertState.titleText);
    assert('Alert outline and border strokes are removed per Shade-DS system', (alertState.borderStyle === 'none' || alertState.borderStyle === '') && (alertState.outlineStyle === 'none' || alertState.outlineStyle === ''));

    // Dismiss Alert
    await cdp.eval(`document.querySelector('#btn-dismiss-alert').click()`);
    await wait(300);
    const alertAfterDismiss = await cdp.eval(`Boolean(document.querySelector('#alert-maintenance'))`);
    assert('Dismissing alert removes it from DOM', alertAfterDismiss === false);

    // 6C: Progress (Role & Values)
    const progState = await cdp.eval(`
      (() => {
        const p = document.querySelector('#prog-sync');
        const pIndet = document.querySelector('#prog-indet');
        return {
          role: p.getAttribute('role'),
          valNow: p.getAttribute('aria-valuenow'),
          indetClass: pIndet.classList.contains('as-progress--indeterminate')
        };
      })()
    `);
    assert('Progress declares role="progressbar"', progState.role === 'progressbar');
    assert('Progress determinate has aria-valuenow="68"', progState.valNow === '68', progState.valNow);
    assert('Progress indeterminate has as-progress--indeterminate class', progState.indetClass);

    // 6D: Skeleton (Screen Reader Suppression)
    const skelState = await cdp.eval(`
      (() => {
        const skels = Array.from(document.querySelectorAll('.as-skeleton'));
        const allAriaHidden = skels.length > 0 && skels.every(s => s.getAttribute('aria-hidden') === 'true');
        return { count: skels.length, allAriaHidden };
      })()
    `);
    assert('All skeleton placeholders declare aria-hidden="true"', skelState.allAriaHidden, `count: ${skelState.count}`);

    // 6E: Tooltip (Focus Visibility & Escape Dismissal)
    const tipInitial = await cdp.eval(`
      (() => {
        const tip = document.querySelector('#tip-backup');
        const cs = getComputedStyle(tip);
        return { opacity: cs.opacity, visibility: cs.visibility };
      })()
    `);
    assert('Tooltip is hidden at rest', tipInitial.opacity === '0' || tipInitial.visibility === 'hidden');

    // Focus trigger button
    await cdp.eval(`document.querySelector('#btn-trigger-backup').focus()`);
    await wait(300);
    const tipFocused = await cdp.eval(`
      (() => {
        const tip = document.querySelector('#tip-backup');
        const cs = getComputedStyle(tip);
        return { opacity: cs.opacity, visibility: cs.visibility };
      })()
    `);
    assert('Tooltip becomes visible on focus', tipFocused.visibility === 'visible' && tipFocused.opacity === '1', JSON.stringify(tipFocused));

    // Press Escape to dismiss tooltip (WCAG 2.2 SC 1.4.13)
    await cdp.eval(`
      (() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      })()
    `);
    await wait(50);
    const tipAfterEscape = await cdp.eval(`
      (() => {
        const tip = document.querySelector('#tip-backup');
        return getComputedStyle(tip).display === 'none';
      })()
    `);
    assert('Pressing Escape dismisses tooltip immediately', tipAfterEscape);

    // Blur trigger button
    await cdp.eval(`document.querySelector('#btn-trigger-backup').blur()`);

    // 6F: Toast (Creation & Notification Live Region)
    await cdp.eval(`document.querySelector('#btn-spawn-toast').click()`);
    await wait(100);
    const toastState = await cdp.eval(`
      (() => {
        const toast = document.querySelector('.as-toast.as-toast--success');
        const container = toast ? toast.closest('.as-toast-container') : null;
        return {
          exists: Boolean(toast),
          role: toast ? toast.getAttribute('role') : null,
          hasOpenClass: toast ? toast.classList.contains('is-open') : false,
          containerRole: container ? container.getAttribute('role') : null
        };
      })()
    `);
    assert('Spawning toast renders inside .as-toast-container[role="region"]', toastState.exists && toastState.containerRole === 'region');
    assert('Success toast declares role="status"', toastState.role === 'status');
    assert('Toast has is-open entrance animation class', toastState.hasOpenClass);

    // Close toast via close button
    await cdp.eval(`document.querySelector('.as-toast__close').click()`);
    await wait(350);
    const toastAfterClose = await cdp.eval(`Boolean(document.querySelector('.as-toast'))`);
    assert('Dismissing toast removes it from container', toastAfterClose === false);

    // ----------------------------------------------------------------------------------
    // Suite 7: Batch C Overlays & Navigation Component Audit
    // ----------------------------------------------------------------------------------
    console.log('\n--- Suite 7: Batch C Overlays & Navigation Component Audit ---');

    // 7A: Modal Dialog (Opening, Semantics, macOS Red Close Button & Dismissal)
    await cdp.eval(`document.querySelector('#btn-open-dialog').click()`);
    await wait(200);
    // Note: showModal() auto-focuses the first focusable element (#btn-close-dialog); move focus to #btn-cancel-dialog and wait for 160ms transition to measure rest state
    await cdp.eval(`document.querySelector('#btn-cancel-dialog').focus()`);
    await wait(280);
    const dialogOpenState = await cdp.eval(`
      (() => {
        const dlg = document.querySelector('#dlg-cluster-rebalance');
        const closeBtn = dlg.querySelector('.as-dialog__close');
        const csClose = getComputedStyle(closeBtn);
        const svg = closeBtn.querySelector('svg');
        const csSvgRest = getComputedStyle(svg);
        return {
          open: dlg.open,
          hasAriaLabelledby: dlg.hasAttribute('aria-labelledby'),
          hasAriaDescribedby: dlg.hasAttribute('aria-describedby'),
          closeW: csClose.width,
          closeH: csClose.height,
          closeBg: csClose.backgroundColor,
          closeRadius: csClose.borderRadius
        };
      })()
    `);
    assert('Modal dialog opens on trigger click', dialogOpenState.open);
    assert('Dialog declares aria-labelledby and aria-describedby', dialogOpenState.hasAriaLabelledby && dialogOpenState.hasAriaDescribedby);
    assert('Dialog close control is Shade-DS 12x12 red circular dot',
      dialogOpenState.closeW === '12px' &&
      dialogOpenState.closeH === '12px' &&
      (dialogOpenState.closeBg === 'rgb(197, 34, 31)' || dialogOpenState.closeBg === 'rgb(255, 69, 58)') &&
      parseInt(dialogOpenState.closeRadius) >= 6,
      `${dialogOpenState.closeW}x${dialogOpenState.closeH}, bg=${dialogOpenState.closeBg}`
    );

    // Hover Dialog close button and verify scale(1.2)
    await cdp.eval(`document.querySelector('#btn-close-dialog').classList.add('is-hover')`);
    await wait(180);
    const dialogCloseHoverTransform = await cdp.eval(`
      getComputedStyle(document.querySelector('#btn-close-dialog')).transform
    `);
    assert('Dialog close control scales on hover (scale 1.2)', dialogCloseHoverTransform.includes('1.2') || dialogCloseHoverTransform.startsWith('matrix'), dialogCloseHoverTransform);
    await cdp.eval(`document.querySelector('#btn-close-dialog').classList.remove('is-hover')`);

    // Close Dialog
    await cdp.eval(`document.querySelector('#btn-close-dialog').click()`);
    await wait(200);
    const dialogClosed = await cdp.eval(`document.querySelector('#dlg-cluster-rebalance').open`);
    assert('Dialog closes when close button is clicked', dialogClosed === false);

    // 7B: Slide-Over Drawer (Opening, Semantics, macOS Red Close & Dismissal)
    await cdp.eval(`document.querySelector('#btn-open-drawer').click()`);
    await wait(200);
    const drawerOpenState = await cdp.eval(`
      (() => {
        const drw = document.querySelector('#drawer-cluster-metrics');
        const closeBtn = drw.querySelector('.as-drawer__close');
        const csClose = getComputedStyle(closeBtn);
        return {
          hidden: drw.hidden,
          role: drw.getAttribute('role'),
          ariaModal: drw.getAttribute('aria-modal'),
          closeBg: csClose.backgroundColor,
          closeW: csClose.width
        };
      })()
    `);
    assert('Slide-over drawer unhides on trigger click', drawerOpenState.hidden === false);
    assert('Drawer declares role="dialog" and aria-modal="true"', drawerOpenState.role === 'dialog' && drawerOpenState.ariaModal === 'true');
    assert('Drawer close control is Shade-DS 12x12 red circular dot', drawerOpenState.closeW === '12px' && (drawerOpenState.closeBg === 'rgb(197, 34, 31)' || drawerOpenState.closeBg === 'rgb(255, 69, 58)'));

    // Close Drawer via close button
    await cdp.eval(`document.querySelector('#btn-close-drawer').click()`);
    await wait(200);
    const drawerClosed = await cdp.eval(`document.querySelector('#drawer-cluster-metrics').hidden`);
    assert('Drawer closes when close button is clicked', drawerClosed === true);

    // 7C: Dropdown Menu (Open, Keyboard Navigation & Escape Dismissal)
    await cdp.eval(`document.querySelector('#dd-trigger-ops').click()`);
    await wait(150);
    const ddOpenState = await cdp.eval(`
      (() => {
        const trig = document.querySelector('#dd-trigger-ops');
        const menu = document.querySelector('#dd-menu-ops');
        return {
          ariaExpanded: trig.getAttribute('aria-expanded'),
          menuHidden: menu.hidden,
          focusedItem: document.activeElement ? document.activeElement.textContent.trim() : ''
        };
      })()
    `);
    assert('Dropdown trigger sets aria-expanded="true"', ddOpenState.ariaExpanded === 'true');
    assert('Dropdown menu becomes visible', ddOpenState.menuHidden === false);
    assert('Dropdown moves focus to first enabled item', ddOpenState.focusedItem.includes('Drain Worker Pods'), ddOpenState.focusedItem);

    // Press Escape to dismiss dropdown
    await cdp.eval(`
      (() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      })()
    `);
    await wait(100);
    const ddClosedState = await cdp.eval(`
      (() => {
        const trig = document.querySelector('#dd-trigger-ops');
        const menu = document.querySelector('#dd-menu-ops');
        return {
          ariaExpanded: trig.getAttribute('aria-expanded'),
          menuHidden: menu.hidden
        };
      })()
    `);
    assert('Dropdown closes on Escape key', ddClosedState.menuHidden === true && ddClosedState.ariaExpanded === 'false');

    // 7D: Popover (macOS Red Close Control & Light Dismissal)
    await cdp.eval(`document.querySelector('#pop-trigger-filter').click()`);
    await wait(150);
    const popOpenState = await cdp.eval(`
      (() => {
        const trig = document.querySelector('#pop-trigger-filter');
        const pop = document.querySelector('#pop-card-filter');
        const closeBtn = pop.querySelector('.as-popover__close');
        const csClose = closeBtn ? getComputedStyle(closeBtn) : null;
        return {
          ariaExpanded: trig.getAttribute('aria-expanded'),
          hidden: pop.hidden,
          closeBg: csClose ? csClose.backgroundColor : null,
          closeW: csClose ? csClose.width : null
        };
      })()
    `);
    assert('Popover unhides on trigger click', popOpenState.hidden === false && popOpenState.ariaExpanded === 'true');
    assert('Popover close control is Shade-DS 12x12 red circular dot', popOpenState.closeW === '12px' && (popOpenState.closeBg === 'rgb(197, 34, 31)' || popOpenState.closeBg === 'rgb(255, 69, 58)'));

    // Click Popover close button to dismiss
    await cdp.eval(`document.querySelector('#pop-card-filter .as-popover__close').click()`);
    await wait(150);
    const popClosedState = await cdp.eval(`
      (() => {
        const trig = document.querySelector('#pop-trigger-filter');
        const pop = document.querySelector('#pop-card-filter');
        return {
          ariaExpanded: trig.getAttribute('aria-expanded'),
          hidden: pop.hidden
        };
      })()
    `);
    assert('Popover dismisses cleanly when .as-popover__close is clicked', popClosedState.hidden === true && popClosedState.ariaExpanded === 'false');

    // 7E: Tabs (Selection & Keyboard Navigation)
    const tabsInitial = await cdp.eval(`
      (() => {
        const tab1 = document.querySelector('#tab-nodes');
        const pan1 = document.querySelector('#panel-nodes');
        return {
          selected: tab1.getAttribute('aria-selected'),
          tabindex: tab1.getAttribute('tabindex'),
          hidden: pan1.hidden
        };
      })()
    `);
    assert('First tab is selected by default with tabindex="0"', tabsInitial.selected === 'true' && tabsInitial.tabindex === '0' && !tabsInitial.hidden);

    // Click second tab
    await cdp.eval(`document.querySelector('#tab-storage').click()`);
    await wait(100);
    const tabsAfterClick = await cdp.eval(`
      (() => {
        const tab1 = document.querySelector('#tab-nodes');
        const tab2 = document.querySelector('#tab-storage');
        const pan1 = document.querySelector('#panel-nodes');
        const pan2 = document.querySelector('#panel-storage');
        return {
          tab1Selected: tab1.getAttribute('aria-selected'),
          tab1Tabindex: tab1.getAttribute('tabindex'),
          tab2Selected: tab2.getAttribute('aria-selected'),
          tab2Tabindex: tab2.getAttribute('tabindex'),
          pan1Hidden: pan1.hidden,
          pan2Hidden: pan2.hidden
        };
      })()
    `);
    assert('Clicking storage tab switches selection and reveals panel',
      tabsAfterClick.tab2Selected === 'true' &&
      tabsAfterClick.tab2Tabindex === '0' &&
      tabsAfterClick.tab1Selected === 'false' &&
      tabsAfterClick.tab1Tabindex === '-1' &&
      !tabsAfterClick.pan2Hidden &&
      tabsAfterClick.pan1Hidden
    );

    // 7F: Accordion (Toggle & Single-Expand Behavior)
    await cdp.eval(`document.querySelector('#acc-trig-kernel').click()`);
    await wait(100);
    const acc1State = await cdp.eval(`
      (() => {
        const trig = document.querySelector('#acc-trig-kernel');
        const pan = document.querySelector('#acc-panel-kernel');
        return {
          expanded: trig.getAttribute('aria-expanded'),
          hidden: pan.hidden
        };
      })()
    `);
    assert('Clicking accordion header expands item', acc1State.expanded === 'true' && acc1State.hidden === false);

    // Click second accordion header (under data-single="true")
    await cdp.eval(`document.querySelector('#acc-trig-failover').click()`);
    await wait(100);
    const acc2State = await cdp.eval(`
      (() => {
        const trig1 = document.querySelector('#acc-trig-kernel');
        const pan1 = document.querySelector('#acc-panel-kernel');
        const trig2 = document.querySelector('#acc-trig-failover');
        const pan2 = document.querySelector('#acc-panel-failover');
        return {
          trig1Expanded: trig1.getAttribute('aria-expanded'),
          pan1Hidden: pan1.hidden,
          trig2Expanded: trig2.getAttribute('aria-expanded'),
          pan2Hidden: pan2.hidden
        };
      })()
    `);
    assert('Expanding second accordion item collapses first under single-expand mode',
      acc2State.trig2Expanded === 'true' &&
      !acc2State.pan2Hidden &&
      acc2State.trig1Expanded === 'false' &&
      acc2State.pan1Hidden
    );

    // ----------------------------------------------------------------------------------
    // Suite 8: System Themes & Shade-DS Visual Foundation Verification
    // ----------------------------------------------------------------------------------
    console.log('\n--- Suite 8: System Themes & Shade-DS Visual Foundation Verification ---');

    // Switch to dark theme
    await cdp.eval(`document.getElementById('btn-toggle-theme').click()`);
    await wait(350);

    const darkThemeStyles = await cdp.eval(`
      (() => {
        const bodyBg = getComputedStyle(document.body).backgroundColor;
        const cardBg = getComputedStyle(document.querySelector('.consumer-section')).backgroundColor;
        const textCol = getComputedStyle(document.body).color;
        const btnPrimaryBg = getComputedStyle(document.querySelector('#btn-primary')).backgroundColor;
        const btnPrimaryCol = getComputedStyle(document.querySelector('#btn-primary')).color;
        return { bodyBg, cardBg, textCol, btnPrimaryBg, btnPrimaryCol };
      })()
    `);
    assert('Dark theme canvas background is Shade-DS #121212 (rgb(18, 18, 18))', darkThemeStyles.bodyBg === 'rgb(18, 18, 18)', darkThemeStyles.bodyBg);
    assert('Dark theme elevated card background is Shade-DS #1E1E1E (rgb(30, 30, 30))', darkThemeStyles.cardBg === 'rgb(30, 30, 30)', darkThemeStyles.cardBg);
    assert('Dark theme primary button inverts to high-contrast white (#FFFFFF) with #0F0F0F text',
      darkThemeStyles.btnPrimaryBg === 'rgb(255, 255, 255)' && darkThemeStyles.btnPrimaryCol === 'rgb(15, 15, 15)',
      `bg=${darkThemeStyles.btnPrimaryBg}, color=${darkThemeStyles.btnPrimaryCol}`
    );

    // Switch back to light theme
    await cdp.eval(`document.getElementById('btn-toggle-theme').click()`);
    await wait(200);

    // ----------------------------------------------------------------------------------
    // Suite 9: Phase 15 Website Information Architecture, 4 Component Tabs, Syntax Highlighting & Separate Playground
    // ----------------------------------------------------------------------------------
    console.log('\n--- Suite 9: Phase 15 Website Architecture, 4 Tabs & Interactive Playground Audit ---');

    // 9A: Root Landing Page Served Directly at '/'
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:3000/' });
    await wait(800);

    const rootLandingCheck = await cdp.eval(`
      (() => {
        const homeView = document.querySelector('#view-overview');
        const globalNavLinks = Array.from(document.querySelectorAll('.top-nav a')).map(a => a.textContent.trim());
        const fontDisplay = getComputedStyle(document.documentElement).getPropertyValue('--as-typography-font-family-display').trim();
        const fontSerif = getComputedStyle(document.documentElement).getPropertyValue('--as-typography-font-family-serif').trim();
        return {
          pathname: location.pathname,
          homeActive: Boolean(homeView && homeView.hasAttribute('data-active')),
          bodyKind: document.body.dataset.kind,
          globalNavLinks,
          hasBebasNeue: fontDisplay.includes('Bebas Neue'),
          hasMerriweather: fontSerif.includes('Merriweather')
        };
      })()
    `);
    assert('Root URL "/" serves the Aster Landing Page directly without redirecting to /playground/',
      rootLandingCheck.pathname === '/' && rootLandingCheck.homeActive && rootLandingCheck.bodyKind === 'landing',
      `pathname=${rootLandingCheck.pathname}, kind=${rootLandingCheck.bodyKind}`
    );
    assert('Global header navigation includes Home, Docs, Components, Playground',
      rootLandingCheck.globalNavLinks.includes('Home') &&
      rootLandingCheck.globalNavLinks.includes('Docs') &&
      rootLandingCheck.globalNavLinks.includes('Playground') &&
      rootLandingCheck.globalNavLinks.includes('Components'),
      rootLandingCheck.globalNavLinks.join(', ')
    );
    assert('Four-role typography tokens (--as-typography-font-family-display Bebas Neue & --as-typography-font-family-serif Merriweather) active on root',
      rootLandingCheck.hasBebasNeue && rootLandingCheck.hasMerriweather
    );

    // 9B: Verify all 21 component routes exist and every component has all 4 Primary Tabs (Preview, Code, Prompt, Anatomy)
    const COMPONENT_ROUTES = [
      'button', 'input', 'textarea', 'select', 'checkbox', 'radio', 'switch', 'slider',
      'table', 'badge', 'progress', 'skeleton',
      'alert', 'tooltip', 'toast', 'dialog', 'drawer', 'popover', 'dropdown',
      'tabs', 'accordion'
    ];

    const fourTabsAudit = await cdp.eval(`
      (() => {
        const routes = ${JSON.stringify(COMPONENT_ROUTES)};
        const missingViews = [];
        const missingLinks = [];
        const incompleteTabs = [];
        routes.forEach(r => {
          const view = document.querySelector('#view-' + r);
          if (!view) {
            missingViews.push(r);
            return;
          }
          if (!document.querySelector('a.nav-link[data-route="' + r + '"]')) missingLinks.push(r);
          const card = view.querySelector('.preview-card');
          if (!card) {
            incompleteTabs.push(r + ':no-card');
            return;
          }
          const tPreview = card.querySelector('.preview-tab[data-tab="preview"]');
          const tCode = card.querySelector('.preview-tab[data-tab="code"]');
          const tPrompt = card.querySelector('.preview-tab[data-tab="prompt"]');
          const tAnatomy = card.querySelector('.preview-tab[data-tab="anatomy"]');
          const pCanvas = card.querySelector('.preview-canvas');
          const pCode = card.querySelector('.preview-code');
          const pPrompt = card.querySelector('.preview-prompt');
          const pAnatomy = card.querySelector('.preview-anatomy');
          if (!tPreview || !tCode || !tPrompt || !tAnatomy || !pCanvas || !pCode || !pPrompt || !pAnatomy) {
            incompleteTabs.push(r);
          }
        });
        return { total: routes.length, missingViews, missingLinks, incompleteTabs };
      })()
    `);
    assert('All 21 component documentation views exist in DOM', fourTabsAudit.missingViews.length === 0, `Missing: ${fourTabsAudit.missingViews.join(', ') || 'none'}`);
    assert('All 21 component sidebar navigation links exist in DOM', fourTabsAudit.missingLinks.length === 0, `Missing: ${fourTabsAudit.missingLinks.join(', ') || 'none'}`);
    assert('All 21 component pages have all 4 primary tabs (Preview, Code, Prompt, Anatomy) and panels',
      fourTabsAudit.incompleteTabs.length === 0,
      `Incomplete: ${fourTabsAudit.incompleteTabs.join(', ') || 'none'}`
    );

    // 9C: Navigate to #/button and test all 4 Tabs (Preview -> Code -> Prompt -> Anatomy)
    await cdp.eval(`location.hash = '#/button'`);
    await wait(300);
    const buttonViewActive = await cdp.eval(`
      (() => {
        const v = document.querySelector('#view-button');
        const l = document.querySelector('a.nav-link[data-route="button"]');
        return {
          isActive: v && v.hasAttribute('data-active'),
          currentAttr: l && l.getAttribute('aria-current')
        };
      })()
    `);
    assert('Navigating to #/button activates button view', buttonViewActive.isActive);
    assert('Button nav-link receives aria-current="page"', buttonViewActive.currentAttr === 'page');

    // Switch to Tab 2: Code & verify colorful multi-category syntax highlighting
    const codeTabAudit = await cdp.eval(`
      (async () => {
        const card = document.querySelector('#view-button .preview-card');
        const codeTab = card.querySelector('.preview-tab[data-tab="code"]');
        codeTab.click();
        const canvas = card.querySelector('.preview-canvas');
        const codePanel = card.querySelector('.preview-code');
        const hasTags = codePanel.querySelectorAll('.tok-tag').length > 0;
        const hasAttrs = codePanel.querySelectorAll('.tok-attr').length > 0;
        const hasStrings = codePanel.querySelectorAll('.tok-str').length > 0;
        const hasComments = codePanel.querySelectorAll('.tok-com').length > 0;
        const hasGutter = codePanel.querySelectorAll('.code-gutter').length > 0;
        const tagColor = getComputedStyle(codePanel.querySelector('.tok-tag')).color;
        const attrColor = getComputedStyle(codePanel.querySelector('.tok-attr')).color;
        const strColor = getComputedStyle(codePanel.querySelector('.tok-str')).color;
        const copyBtn = card.querySelector('.copy-btn');
        copyBtn.click();
        await new Promise(r => setTimeout(r, 60));
        return {
          tabSelected: codeTab.getAttribute('aria-selected'),
          canvasHidden: canvas.hidden,
          codeHidden: codePanel.hidden,
          hasTags,
          hasAttrs,
          hasStrings,
          hasComments,
          hasGutter,
          distinctColors: tagColor !== attrColor && attrColor !== strColor,
          colors: { tagColor, attrColor, strColor },
          copyBtnText: copyBtn.textContent.trim()
        };
      })()
    `);
    assert('Clicking Code tab reveals code panel with line-number gutter',
      codeTabAudit.tabSelected === 'true' && codeTabAudit.canvasHidden && !codeTabAudit.codeHidden && codeTabAudit.hasGutter
    );
    assert('Code block renders colorful multi-category syntax highlighting (.tok-tag, .tok-attr, .tok-str, .tok-com)',
      codeTabAudit.hasTags && codeTabAudit.hasAttrs && codeTabAudit.hasStrings && codeTabAudit.hasComments && codeTabAudit.distinctColors,
      JSON.stringify(codeTabAudit.colors)
    );
    assert('Clicking Copy Code button provides "Copied!" feedback', codeTabAudit.copyBtnText.includes('Copied'));

    // Switch to Tab 3: Prompt & verify AI Agent prompt + Copy Prompt button
    const promptTabAudit = await cdp.eval(`
      (async () => {
        const card = document.querySelector('#view-button .preview-card');
        const promptTab = card.querySelector('.preview-tab[data-tab="prompt"]');
        promptTab.click();
        const promptPanel = card.querySelector('.preview-prompt');
        const promptPre = promptPanel.querySelector('.prompt-panel__pre');
        const copyPromptBtn = promptPanel.querySelector('.copy-prompt-btn');
        copyPromptBtn.click();
        await new Promise(r => setTimeout(r, 60));
        return {
          tabSelected: promptTab.getAttribute('aria-selected'),
          promptHidden: promptPanel.hidden,
          promptText: promptPre ? promptPre.textContent : '',
          copyBtnText: copyPromptBtn ? copyPromptBtn.textContent.trim() : ''
        };
      })()
    `);
    assert('Clicking Prompt tab reveals AI implementation prompt grounded in canonical files and tokens',
      promptTabAudit.tabSelected === 'true' &&
      !promptTabAudit.promptHidden &&
      promptTabAudit.promptText.includes('components/button/button.css') &&
      promptTabAudit.promptText.includes('24px')
    );
    assert('Clicking Copy Prompt button copies AI prompt and shows "Copied Prompt!"', promptTabAudit.copyBtnText.includes('Copied Prompt'));

    // Switch to Tab 4: Anatomy & verify Visual Blueprint Diagram + Measurement Specification Table
    const anatomyTabAudit = await cdp.eval(`
      (() => {
        const card = document.querySelector('#view-button .preview-card');
        const anatomyTab = card.querySelector('.preview-tab[data-tab="anatomy"]');
        anatomyTab.click();
        const anatomyPanel = card.querySelector('.preview-anatomy');
        const pins = anatomyPanel.querySelectorAll('.anatomy-badge__pin').length;
        const tableText = anatomyPanel.querySelector('.anatomy-table')?.textContent || '';
        return {
          tabSelected: anatomyTab.getAttribute('aria-selected'),
          anatomyHidden: anatomyPanel.hidden,
          pins,
          has24pxSpec: tableText.includes('24px / 24px'),
          hasFixedVsDynamic: tableText.includes('Fixed') && tableText.includes('Content-Dependent')
        };
      })()
    `);
    assert('Clicking Anatomy tab reveals annotated blueprint diagram with callout pins and Fixed vs Content-Dependent measurement table',
      anatomyTabAudit.tabSelected === 'true' &&
      !anatomyTabAudit.anatomyHidden &&
      anatomyTabAudit.pins >= 4 &&
      anatomyTabAudit.has24pxSpec &&
      anatomyTabAudit.hasFixedVsDynamic
    );

    // Switch back to Preview tab
    await cdp.eval(`document.querySelector('#view-button .preview-card .preview-tab[data-tab="preview"]').click()`);

    // 9D: Separate Interactive Playground Page (#/playground)
    await cdp.eval(`location.hash = '#/playground'`);
    await wait(300);
    const playgroundPageAudit = await cdp.eval(`
      (() => {
        const v = document.querySelector('#view-playground');
        const bodyKind = document.body.dataset.kind;
        const compBtn = document.querySelector('.pg-dock__btn[data-pg-comp="alert"]');
        if (compBtn) compBtn.click();
        const stageHtmlAfterAlert = document.querySelector('#pg-stage-mount')?.innerHTML || '';
        const btnComp = document.querySelector('.pg-dock__btn[data-pg-comp="button"]');
        if (btnComp) btnComp.click();
        const labelInput = document.querySelector('#pg-ctrl-label');
        if (labelInput) {
          labelInput.value = 'Custom Ship Action';
          labelInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const stageText = document.querySelector('#pg-stage-mount')?.textContent || '';
        const liveCodeTokens = document.querySelectorAll('#pg-live-code-el .tok-tag').length;
        return {
          isActive: Boolean(v && v.hasAttribute('data-active')),
          bodyKind,
          hasAlertCloseInStage: stageHtmlAfterAlert.includes('as-alert__close'),
          updatedStageText: stageText.includes('Custom Ship Action'),
          liveCodeTokens
        };
      })()
    `);
    assert('Navigating to #/playground activates dedicated full-bleed Interactive Playground view',
      playgroundPageAudit.isActive && playgroundPageAudit.bodyKind === 'playground'
    );
    assert('Interactive Playground switches component stage and updates live syntax-highlighted code dynamically',
      playgroundPageAudit.hasAlertCloseInStage && playgroundPageAudit.updatedStageText && playgroundPageAudit.liveCodeTokens > 0
    );

    // 9E: Live Slider Dynamic Synchronization in Showcase
    await cdp.eval(`location.hash = '#/slider'`);
    await wait(300);
    const sliderSync = await cdp.eval(`
      (() => {
        const sliderView = document.querySelector('#view-slider');
        const slider = sliderView.querySelector('.as-slider');
        slider.value = 85;
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        const display = sliderView.querySelector('.as-slider-field__value');
        return {
          sliderValue: slider.value,
          displayText: display ? display.textContent.trim() : null
        };
      })()
    `);
    assert('Showcase slider updates dynamic value indicator', sliderSync.displayText === '85%');

    // 9F: Search Command Palette Interaction
    const searchPalette = await cdp.eval(`
      (() => {
        const trigger = document.querySelector('#search-trigger');
        trigger.click();
        const dlg = document.querySelector('#palette');
        const input = document.querySelector('#palette-input');
        input.value = 'playground';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const results = Array.from(document.querySelectorAll('#palette-list li[role="option"]')).map(li => li.textContent);
        const isOpen = dlg && !dlg.hasAttribute('hidden') && dlg.open;
        return {
          isOpen: Boolean(isOpen),
          count: results.length,
          firstResult: results[0] || null
        };
      })()
    `);
    assert('Search command palette opens on trigger click', searchPalette.isOpen);
    assert('Search palette queries and returns matching items', searchPalette.count > 0 && searchPalette.firstResult.toLowerCase().includes('playground'), searchPalette.firstResult);

    // Close palette
    await cdp.eval(`document.querySelector('#palette').close()`);

    // 9G: Responsive Mobile Navigation Drawer
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });
    await wait(200);

    const mobileMenuOpen = await cdp.eval(`
      (() => {
        const menuBtn = document.querySelector('#menu-btn');
        menuBtn.click();
        return {
          navOpen: document.body.hasAttribute('data-nav-open'),
          btnExpanded: menuBtn.getAttribute('aria-expanded')
        };
      })()
    `);
    assert('Clicking menu button in mobile viewport opens navigation drawer', mobileMenuOpen.navOpen && mobileMenuOpen.btnExpanded === 'true');

    // Click link inside mobile drawer to navigate and verify auto-close
    const mobileNavClick = await cdp.eval(`
      (async () => {
        const link = document.querySelector('a.nav-link[data-route="tabs"]');
        link.click();
        await new Promise(r => setTimeout(r, 150));
        return {
          navOpen: document.body.hasAttribute('data-nav-open'),
          tabsActive: document.querySelector('#view-tabs').hasAttribute('data-active')
        };
      })()
    `);
    assert('Selecting item in mobile drawer navigates and closes drawer', !mobileNavClick.navOpen && mobileNavClick.tabsActive);

    // Reset viewport to desktop standard
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    // 9H: Installation & Audience Separation Hubs
    await cdp.eval(`location.hash = '#/installation'`);
    await wait(200);
    const installCheck = await cdp.eval(`
      (() => {
        const v = document.querySelector('#view-installation');
        return Boolean(v && v.hasAttribute('data-active') && v.textContent.includes('aster.css'));
      })()
    `);
    assert('Navigating to #/installation activates installation view', installCheck);

    await cdp.eval(`location.hash = '#/designers'`);
    await wait(200);
    const designersCheck = await cdp.eval(`
      (() => {
        const v = document.querySelector('#view-designers');
        return Boolean(v && v.hasAttribute('data-active') && v.textContent.includes('Figma Variable Collections'));
      })()
    `);
    assert('Navigating to #/designers activates Designer hub', designersCheck);

    await cdp.eval(`location.hash = '#/developers'`);
    await wait(200);
    const developersCheck = await cdp.eval(`
      (() => {
        const v = document.querySelector('#view-developers');
        return Boolean(v && v.hasAttribute('data-active') && v.textContent.includes('Package Exports Map'));
      })()
    `);
    assert('Navigating to #/developers activates Developer hub', developersCheck);

    await cdp.eval(`location.hash = '#/agents'`);
    await wait(200);
    const agentsCheck = await cdp.eval(`
      (() => {
        const v = document.querySelector('#view-agents');
        return Boolean(v && v.hasAttribute('data-active') && v.textContent.includes('Canonical Source of Truth Map'));
      })()
    `);
    assert('Navigating to #/agents activates AI Agent hub', agentsCheck);

    // ----------------------------------------------------------------------------------
    // Suite 10: Visual Artifact Evidence Capture (Phase 15)
    // ----------------------------------------------------------------------------------
    console.log('\n--- Suite 10: Visual Evidence Capture (Phase 15) ---');
    async function saveScreenshot(filename, fullPage = false) {
      if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: fullPage });
      const buf = Buffer.from(shot.data, 'base64');
      const outPath = path.join(ARTIFACT_DIR, filename);
      fs.writeFileSync(outPath, buf);
      console.log(`  ✓ Saved screenshot artifact: ${filename} (${buf.length} bytes)`);
    }

    // 1. Home Landing Page at Root '/' (Light & Dark)
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:3000/' });
    await wait(600);
    await cdp.eval(`(() => {
      const toggle = document.getElementById('theme-toggle-btn');
      const lightBtn = document.getElementById('btn-theme-light');
      if (lightBtn) lightBtn.click();
      else if (toggle && document.documentElement.getAttribute('data-theme') === 'dark') toggle.click();
      else document.documentElement.setAttribute('data-theme', 'light');
    })()`);
    await wait(250);
    await saveScreenshot('phase15-home-light.png');

    await cdp.eval(`(() => {
      const toggle = document.getElementById('theme-toggle-btn');
      const darkBtn = document.getElementById('btn-theme-dark');
      if (darkBtn) darkBtn.click();
      else if (toggle && document.documentElement.getAttribute('data-theme') !== 'dark') toggle.click();
      else document.documentElement.setAttribute('data-theme', 'dark');
    })()`);
    await wait(300);
    await saveScreenshot('phase15-home-dark.png');

    // Switch back to Light Mode
    await cdp.eval(`(() => {
      const toggle = document.getElementById('theme-toggle-btn');
      const lightBtn = document.getElementById('btn-theme-light');
      if (lightBtn) lightBtn.click();
      else if (toggle && document.documentElement.getAttribute('data-theme') === 'dark') toggle.click();
      else document.documentElement.setAttribute('data-theme', 'light');
    })()`);
    await wait(200);

    // 2. Separate Interactive Playground Page (#/playground)
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:3000/#/playground' });
    await wait(600);
    await saveScreenshot('phase15-playground-light.png');

    // 3. Button Component — All 4 Tabs (Preview, Code, Prompt, Anatomy)
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:3000/#/button' });
    await wait(600);
    await saveScreenshot('phase15-button-preview.png');

    await cdp.eval(`(() => {
      const toggle = document.getElementById('theme-toggle-btn');
      const darkBtn = document.getElementById('btn-theme-dark');
      if (darkBtn) darkBtn.click();
      else if (toggle && document.documentElement.getAttribute('data-theme') !== 'dark') toggle.click();
      else document.documentElement.setAttribute('data-theme', 'dark');
    })()`);
    await wait(250);
    await saveScreenshot('phase15-button-dark.png');
    await cdp.eval(`(() => {
      const toggle = document.getElementById('theme-toggle-btn');
      const lightBtn = document.getElementById('btn-theme-light');
      if (lightBtn) lightBtn.click();
      else if (toggle && document.documentElement.getAttribute('data-theme') === 'dark') toggle.click();
      else document.documentElement.setAttribute('data-theme', 'light');
    })()`);
    await wait(250);

    await cdp.eval(`document.querySelector('#view-button .preview-card .preview-tab[data-tab="code"]').click()`);
    await wait(250);
    await saveScreenshot('phase15-button-code.png');

    await cdp.eval(`document.querySelector('#view-button .preview-card .preview-tab[data-tab="prompt"]').click()`);
    await wait(250);
    await saveScreenshot('phase15-button-prompt.png');

    await cdp.eval(`
      (() => {
        const card = document.querySelector('#view-button .preview-card');
        card.querySelector('.preview-tab[data-tab="anatomy"]').click();
        card.scrollIntoView({ behavior: 'auto', block: 'start' });
      })()
    `);
    await wait(250);
    await saveScreenshot('phase15-button-anatomy.png');

    await cdp.eval(`document.querySelector('#view-button .anatomy-designer-explanation')?.scrollIntoView({ behavior: 'auto', block: 'start' })`);
    await wait(250);
    await saveScreenshot('phase15-button-designer-explanation.png');

    // 4. Dialog Component with macOS Red Circular Close Control (Dark Theme matching Shade-DS reference)
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:3000/#/dialog' });
    await wait(600);
    await cdp.eval(`document.documentElement.setAttribute('data-theme', 'dark')`);
    await wait(200);
    await cdp.eval(`document.querySelector('#view-dialog [data-dialog-open="pg-showcase-dlg"]')?.click()`);
    await wait(300);
    await saveScreenshot('phase15-dialog-macos-close.png');
    await cdp.eval(`document.querySelector('#pg-showcase-dlg')?.close()`);
    await cdp.eval(`document.documentElement.removeAttribute('data-theme')`);

    // 4B. Input Component with Shade-DS Canvas Background & 1px Glass Glow
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:3000/#/input' });
    await wait(600);
    await cdp.eval(`document.documentElement.setAttribute('data-theme', 'dark')`);
    await wait(200);
    await saveScreenshot('phase15-input-dark.png');
    await cdp.eval(`document.documentElement.removeAttribute('data-theme')`);

    // 4C. Alert Component with Status Surfaces & Zero Outlines
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:3000/#/alert' });
    await wait(600);
    await cdp.eval(`document.documentElement.setAttribute('data-theme', 'dark')`);
    await wait(200);
    await saveScreenshot('phase15-alert-dark.png');
    await cdp.eval(`document.documentElement.removeAttribute('data-theme')`);

    // 5. Clean Consumer Example (Light & Dark Standard)
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:3000/examples/clean-consumer/index.html' });
    await wait(500);
    await saveScreenshot('phase15-consumer-light.png');

    await cdp.eval(`document.getElementById('btn-toggle-theme').click()`);
    await wait(250);
    await saveScreenshot('phase15-consumer-dark.png');

    // 6. Mobile Navigation Drawer
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:3000/#/button' });
    await wait(500);
    await cdp.eval(`document.querySelector('#menu-btn').click()`);
    await wait(300);
    await saveScreenshot('phase15-mobile-drawer.png');

    // Reset device metrics
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await wait(100);

    // ----------------------------------------------------------------------------------
    // Summary
    // ----------------------------------------------------------------------------------
    console.log('\n----------------------------------------------------------------------------------------');
    console.log(`BROWSER AUDIT COMPLETE: ${results.passed} passed, ${results.failed} failed.`);
    if (results.failed === 0) {
      console.log('✔ All real-browser component behavior, interaction, and accessibility audits PASSED.\n');
    } else {
      console.error(`✖ Found ${results.failed} browser audit failures!\n`);
    }

  } catch (err) {
    console.error('Fatal audit error:', err);
    results.failed++;
  } finally {
    if (cdp) cdp.close();
    try {
      chromeProc.kill();
    } catch {}
    try {
      serverProc.kill();
    } catch {}
  }

  return results;
}

runBrowserAudit().then((res) => {
  process.exit(res.failed === 0 ? 0 : 1);
});
