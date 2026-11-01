/**
 * Aster Design System — Live Component Anatomy
 *
 * Renders the real component (inert) and reads every number from it, so the
 * diagram cannot drift from the CSS. Only the part names and descriptions below
 * are authored by hand.
 */
import { syncSliderProgress } from '../../dist/js/aster.js';
import { RECIPES } from './stage.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const part = (selector, name, desc, main = false) => ({ selector, name, desc, main });

/** Designer-facing part list per component. `main` is selected first. */
const ANATOMY = {
  button: {
    resize: 'Width hugs content, height fixed',
    parts: [
      part('.as-button', 'Container', 'The pill. Sets the height, padding and clickable area.', true),
      part('.as-icon', 'Leading icon', 'Optional. Sits before the label.'),
      part('.as-button__label', 'Label', 'The action, in a few words.')
    ]
  },
  input: {
    resize: 'Width fills parent, height fixed',
    parts: [
      part('.as-form-field__label', 'Label', 'Always visible above the field. Never floats.'),
      part('.as-input-box', 'Field', 'The visible box. Shows hover, focus and error states.', true),
      part('.as-input', 'Value', 'The text the person types.'),
      part('.as-input__action', 'Clear button', 'Appears only when there is a value.'),
      part('.as-form-field__helper', 'Helper text', 'Guidance under the field.')
    ]
  },
  textarea: {
    resize: 'Width fills parent, height grows with content',
    parts: [
      part('.as-form-field__label', 'Label', 'Always visible above the field.'),
      part('.as-textarea-box', 'Field', 'The visible box around the text and counter.', true),
      part('.as-textarea', 'Value', 'Multi-line text area.'),
      part('.as-textarea__counter', 'Counter', 'Characters used and the limit.')
    ]
  },
  select: {
    resize: 'Width fills parent, height fixed',
    note: 'The open menu is styled like Dropdown. See that component for menu measurements.',
    parts: [
      part('.as-form-field__label', 'Label', 'Always visible above the field.'),
      part('.as-select-box', 'Field', 'The visible box. Opens the menu when clicked.', true),
      part('.as-select', 'Selected value', 'Shows the current choice.'),
      part('.as-select-chevron', 'Chevron', 'Points down when closed and up when open.')
    ]
  },
  checkbox: {
    parts: [
      part('.as-checkbox-field', 'Row', 'Holds the control and text. The whole row is clickable.', true),
      part('.as-checkbox', 'Hit area', 'Invisible touch target around the box.'),
      part('.as-checkbox-input', 'Box', 'Shows unchecked, checked or mixed.'),
      part('.as-checkbox-field__label', 'Label', 'What the option does.'),
      part('.as-checkbox-field__description', 'Description', 'Optional extra detail.')
    ]
  },
  radio: {
    parts: [
      part('.as-radio-group', 'Group', 'Holds one set of options. Only one can be selected.', true),
      part('.as-radio-group__legend', 'Group title', 'Names the choice being made.'),
      part('.as-radio', 'Hit area', 'Invisible touch target around the circle.'),
      part('.as-radio-input', 'Circle', 'Filled when selected.'),
      part('.as-radio-field__label', 'Option label', 'The name of this option.')
    ]
  },
  switch: {
    parts: [
      part('.as-switch-field', 'Row', 'Holds the switch and text. The whole row is clickable.', true),
      part('.as-switch-track', 'Track', 'The capsule. Filled when on.'),
      part('.as-switch-thumb', 'Thumb', 'Slides right when on.'),
      part('.as-switch-field__label', 'Label', 'The setting being controlled.'),
      part('.as-switch-field__description', 'Description', 'Optional extra detail.')
    ]
  },
  slider: {
    resize: 'Width fills parent',
    parts: [
      part('.as-slider-field', 'Container', 'Stacks the header above the track.', true),
      part('.as-slider-field__label', 'Label', 'What the value controls.'),
      part('.as-slider-field__value', 'Value', 'The current number.'),
      part('.as-slider', 'Track and thumb', 'Drag the thumb or use the arrow keys.')
    ]
  },
  table: {
    resize: 'Width fills parent, height grows with rows',
    parts: [
      part('.as-table-container', 'Container', 'Rounded card around the table.', true),
      part('.as-table__th', 'Header cell', 'Names the column.'),
      part('.as-table__row', 'Row', 'One record. Highlights on hover.'),
      part('.as-table__cell--primary', 'Primary cell', 'Identifies the row.'),
      part('.as-badge', 'Status', 'Badge inside a cell.'),
      part('.as-table__cell--num', 'Number cell', 'Right-aligned so digits line up.')
    ]
  },
  badge: {
    parts: [
      part('.as-badge', 'Container', 'The pill. Holds the dot and status text.', true),
      part('.as-badge__dot', 'Status dot', 'Optional. Reinforces the status text.')
    ]
  },
  progress: {
    resize: 'Width fills parent',
    parts: [
      part('.as-progress-field', 'Container', 'Stacks the header above the track.'),
      part('.as-progress-field__label', 'Label', 'The task in progress.'),
      part('.as-progress-field__value', 'Value', 'Percent complete.'),
      part('.as-progress', 'Track', 'The full length of the task.', true),
      part('.as-progress__bar', 'Fill', 'Grows as the task completes.')
    ]
  },
  skeleton: {
    parts: [
      part('[aria-busy]', 'Container', 'Holds placeholders in the shape of the real content.', true),
      part('.as-skeleton--avatar', 'Avatar placeholder', 'Stands in for a profile image.'),
      part('.as-skeleton--text', 'Text placeholder', 'Stands in for one line of text.')
    ]
  },
  alert: {
    parts: [
      part('.as-alert', 'Container', 'The banner. Its color shows the status.', true),
      part('.as-alert__icon', 'Status icon', 'Shows the status without relying on color.'),
      part('.as-alert__title', 'Title', 'The message in a few words.'),
      part('.as-alert__description', 'Description', 'Details or next steps.'),
      part('.as-alert__close', 'Dismiss', 'Red dot that removes the alert.')
    ]
  },
  tooltip: {
    note: 'Shown open here. In use it appears on hover or keyboard focus.',
    parts: [
      part('.as-button', 'Trigger', 'The element the tooltip explains.'),
      part('.as-tooltip', 'Bubble', 'Short text shown above the trigger.', true)
    ]
  },
  toast: {
    width: 360,
    note: 'Shown in place here. In use it floats at the bottom right of the screen.',
    html: `<div class="as-toast as-toast--success" role="status"><div class="as-toast__content"><div class="as-toast__title">Cluster Rebalanced</div><div class="as-toast__message">Workloads distributed across 3 zones.</div></div><button type="button" class="as-toast__close" aria-label="Dismiss notification"></button></div>`,
    parts: [
      part('.as-toast', 'Container', 'The floating card.', true),
      part('.as-toast__title', 'Title', 'What happened.'),
      part('.as-toast__message', 'Message', 'One line of detail.'),
      part('.as-toast__close', 'Dismiss', 'Closes it before it times out.')
    ]
  },
  dialog: {
    pick: '.as-dialog',
    note: 'Shown without the dimmed screen behind it.',
    parts: [
      part('.as-dialog__surface', 'Surface', 'The modal card.', true),
      part('.as-dialog__header', 'Header', 'Holds the small title and close control.'),
      part('.as-dialog__close', 'Close', 'Red dot that closes the dialog.'),
      part('.as-dialog__hero-title', 'Headline', 'The main title, in the display font.'),
      part('.as-dialog__hero-subtitle', 'Subtitle', 'One sentence of context.'),
      part('.as-dialog__footer', 'Footer', 'Holds the main action.')
    ]
  },
  drawer: {
    pick: '.as-drawer',
    note: 'Shown at a sample height. In use it fills the full screen height.',
    parts: [
      part('.as-drawer__panel', 'Panel', 'The sheet that slides in from the edge.', true),
      part('.as-drawer__header', 'Header', 'Holds the title and close control.'),
      part('.as-drawer__close', 'Close', 'Red dot that closes the drawer.'),
      part('.as-drawer__body', 'Body', 'Scrolling content area.'),
      part('.as-drawer__footer', 'Footer', 'Stays pinned at the bottom for actions.')
    ]
  },
  popover: {
    reveal: true,
    note: 'Shown open here. In use it floats over the page below the trigger.',
    parts: [
      part('.as-button', 'Trigger', 'Opens and closes the popover.'),
      part('.as-popover', 'Card', 'The floating surface.', true),
      part('.as-popover__header', 'Header', 'Holds the title and close control.'),
      part('.as-popover__close', 'Close', 'Red dot that closes the popover.'),
      part('.as-popover__body', 'Body', 'The contextual content.')
    ]
  },
  dropdown: {
    reveal: true,
    note: 'Shown open here. In use it floats over the page below the trigger.',
    parts: [
      part('.as-button', 'Trigger', 'Opens and closes the menu.'),
      part('.as-dropdown__chevron', 'Chevron', 'Flips when the menu opens.'),
      part('.as-dropdown__menu', 'Menu', 'The floating surface.', true),
      part('.as-dropdown__item', 'Item', 'One action.'),
      part('.as-dropdown__divider', 'Divider', 'Separates groups of actions.'),
      part('.as-dropdown__item--destructive', 'Destructive item', 'An action that removes something.')
    ]
  },
  tabs: {
    parts: [
      part('.as-tabs__list', 'Tab bar', 'The row of tabs and its divider line.', true),
      part('.as-tabs__tab.is-active', 'Active tab', 'The tab being shown, with an underline.'),
      part('.as-tabs__tab:not(.is-active)', 'Inactive tab', 'Click or use the arrow keys to switch.'),
      part('.as-tabs__panel.is-active', 'Panel', 'The content of the active tab.')
    ]
  },
  accordion: {
    parts: [
      part('.as-accordion', 'Container', 'Stacks the items in one card.', true),
      part('.as-accordion__trigger', 'Header', 'Click to open or close the item.'),
      part('.as-accordion__title', 'Title', 'Names the section.'),
      part('.as-accordion__chevron', 'Chevron', 'Flips when the item opens.'),
      part('.as-accordion__content', 'Content', 'Shown when the item is open.')
    ]
  }
};

const WIDTHS = { sm: 380, md: 540, lg: 720 };
const WEIGHTS = { 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'Semibold', 700: 'Bold' };

/* --------------------------------------------------------------------------
   Token matching: tokens are found by comparing resolved values
   -------------------------------------------------------------------------- */
let tokenNames = null;
function collectTokenNames() {
  if (tokenNames) return tokenNames;
  const found = new Set();
  const walk = (rules) => {
    for (const rule of rules) {
      if (rule.style) {
        for (const prop of rule.style) if (prop.startsWith('--as-')) found.add(prop);
      }
      if (rule.cssRules) walk(rule.cssRules);
    }
  };
  for (const sheet of document.styleSheets) {
    try { walk(sheet.cssRules); } catch { /* cross-origin stylesheet */ }
  }
  tokenNames = [...found];
  return tokenNames;
}
const tokenValue = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

function parseColor(str) {
  let m = str.match(/^rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[,/ ]+([\d.]+))?\)/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
  m = str.match(/^color\(srgb ([\d.e-]+) ([\d.e-]+) ([\d.e-]+)(?: \/ ([\d.]+))?\)/);
  if (m) return { r: m[1] * 255, g: m[2] * 255, b: m[3] * 255, a: m[4] === undefined ? 1 : +m[4] };
  return null;
}
const toHex = ({ r, g, b }) => `#${[r, g, b].map((n) => Math.round(n).toString(16).padStart(2, '0')).join('').toUpperCase()}`;

function resolveColor(value) {
  const probe = document.createElement('span');
  probe.style.color = value;
  probe.style.display = 'none';
  document.body.appendChild(probe);
  const out = getComputedStyle(probe).color;
  probe.remove();
  return parseColor(out);
}

function colorToken(color, prefixes) {
  const key = `${toHex(color)}${color.a}`;
  const names = collectTokenNames();
  for (const prefix of prefixes) {
    for (const name of names) {
      if (!name.startsWith(`--as-semantic-color-${prefix}`)) continue;
      const c = resolveColor(tokenValue(name));
      if (c && `${toHex(c)}${c.a}` === key) return name;
    }
  }
  return '';
}

function colorRow(label, raw, prefixes) {
  const color = parseColor(raw);
  if (!color) return { label, value: raw, token: '' };
  if (color.a === 0) return null;
  const alpha = color.a < 1 ? ` at ${Math.round(color.a * 100)}%` : '';
  return { label, value: `${toHex(color)}${alpha}`, token: colorToken(color, prefixes), swatch: raw };
}

function pxToken(prefix, px) {
  return collectTokenNames().find((name) => name.startsWith(prefix) && tokenValue(name) === `${px}px`) || '';
}
function fontToken(px) {
  const names = collectTokenNames().filter((n) => n.startsWith('--as-typography-font-size-'));
  const hits = names.filter((n) => parseFloat(tokenValue(n)) * 16 === px);
  return hits.find((n) => n.endsWith('-base')) || hits[0] || '';
}
const round = (n) => Math.round(n * 100) / 100;

/** Every row is read from the rendered element. */
function specRows(el, resize) {
  const cs = getComputedStyle(el);
  const rows = [{ label: 'Size', value: `${el.getBoundingClientRect ? round(sizeOf(el).w) : 0} × ${round(sizeOf(el).h)}`, token: '' }];
  if (resize) rows.push({ label: 'Resizing', value: resize, token: '' });

  const [t, r, b, l] = ['Top', 'Right', 'Bottom', 'Left'].map((s) => parseFloat(cs[`padding${s}`]) || 0);
  if (t || r || b || l) {
    const same = t === b && l === r;
    const tokens = same ? [pxToken('--as-space-', t), pxToken('--as-space-', l)].filter(Boolean) : [];
    rows.push({
      label: 'Padding',
      value: same ? `${t} top and bottom, ${l} left and right` : `${t} top, ${r} right, ${b} bottom, ${l} left`,
      token: [...new Set(tokens)].join(', ')
    });
  }
  if (/flex|grid/.test(cs.display)) {
    const gap = parseFloat(cs.flexDirection?.startsWith('column') ? cs.rowGap : cs.columnGap) || 0;
    if (gap) rows.push({ label: 'Gap', value: `${gap}`, token: pxToken('--as-space-', gap) });
  }
  const radius = parseFloat(cs.borderTopLeftRadius) || 0;
  if (radius) rows.push({ label: 'Corner radius', value: cs.borderTopLeftRadius.endsWith('%') ? 'Full circle' : `${radius}`, token: pxToken('--as-radius-', radius) });

  const fill = colorRow('Fill', cs.backgroundColor, ['surface', 'interactive', 'text', 'status']);
  if (fill) rows.push(fill);
  const bw = parseFloat(cs.borderTopWidth) || 0;
  if (bw && cs.borderTopStyle !== 'none') {
    const stroke = colorRow('Border', cs.borderTopColor, ['border', 'text', 'status']);
    if (stroke) rows.push({ ...stroke, value: `${bw}, ${stroke.value}` });
  }
  if (cs.boxShadow && cs.boxShadow !== 'none') rows.push({ label: 'Effect', value: describeShadow(cs.boxShadow), token: '' });

  const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
  if (hasText) {
    const size = parseFloat(cs.fontSize);
    const family = cs.fontFamily.split(',')[0].replace(/["']/g, '');
    const weight = WEIGHTS[cs.fontWeight] || cs.fontWeight;
    rows.push({ label: 'Text style', value: `${family} ${weight}, ${round(size)}`, token: fontToken(size) });
    if (cs.lineHeight !== 'normal') rows.push({ label: 'Line height', value: `${round(parseFloat(cs.lineHeight))}`, token: '' });
    const ink = colorRow('Text color', cs.color, ['text', 'status', 'interactive']);
    if (ink) rows.push(ink);
  } else if (el.tagName.toLowerCase() === 'svg') {
    const ink = colorRow('Color', cs.color, ['text', 'status', 'interactive']);
    if (ink) rows.push(ink);
  }
  return rows;
}
function describeShadow(shadow) {
  const layers = shadow.split(/,(?![^(]*\))/).length;
  return `${layers} shadow ${layers === 1 ? 'layer' : 'layers'}`;
}
/** Layout size, unaffected by the diagram's display scale. */
function sizeOf(el) {
  if (el.offsetWidth !== undefined) return { w: el.offsetWidth, h: el.offsetHeight };
  const s = el.closest('.pa-sample');
  const scale = Number(s?.dataset.scale) || 1;
  const r = el.getBoundingClientRect();
  return { w: r.width / scale, h: r.height / scale };
}

/* --------------------------------------------------------------------------
   Sample + panel
   -------------------------------------------------------------------------- */
function buildSample(slug, cfg, recipe) {
  const sample = document.createElement('div');
  sample.className = 'pa-sample';
  sample.dataset.slug = slug;
  sample.inert = true;
  const values = Object.fromEntries(recipe.controls.map((c) => [c.key, c.value]));
  sample.innerHTML = cfg.html || recipe.render(values);
  if (cfg.pick) {
    const keep = sample.querySelector(cfg.pick);
    sample.replaceChildren(keep);
    keep.removeAttribute('hidden');
    if (keep.tagName === 'DIALOG') keep.setAttribute('open', '');
    sample.querySelector('.as-drawer__backdrop')?.remove();
  }
  if (cfg.reveal) sample.querySelectorAll('[hidden]').forEach((n) => n.removeAttribute('hidden'));
  sample.querySelectorAll('*').forEach((n) => {
    ['id', 'for', 'aria-labelledby', 'aria-describedby', 'aria-controls'].forEach((a) => n.removeAttribute(a));
    if (n.name) n.name = `pa-${slug}`;
  });
  const width = cfg.width || WIDTHS[recipe.width];
  if (width) sample.style.width = `${width}px`;
  sample.querySelectorAll('input[type="range"].as-slider').forEach((s) => syncSliderProgress(s));
  return sample;
}

function mount(host) {
  const slug = host.dataset.anatomy;
  const cfg = ANATOMY[slug];
  const recipe = RECIPES.find((r) => r.slug === slug);
  if (!cfg || !recipe) return;

  host.innerHTML = `
    <div class="pa">
      <div class="pa-stage">
        <div class="pa-scale" aria-hidden="true"></div>
        <svg class="pa-lines" aria-hidden="true"></svg>
        <div class="pa-redlines" aria-hidden="true"></div>
        <div class="pa-pins"></div>
      </div>
      <div class="pa-info">
        <div>
          <h3 class="pa-heading">Parts</h3>
          <ol class="pa-parts"></ol>
        </div>
        <div class="pa-spec" aria-live="polite">
          <h3 class="pa-heading pa-spec__title"></h3>
          <dl class="pa-spec__rows"></dl>
          <p class="pa-note">${cfg.note ? `${esc(cfg.note)} ` : ''}Values are read from the rendered component in pixels, for the current theme. Tokens are matched by value.</p>
        </div>
      </div>
    </div>`;

  const stage = host.querySelector('.pa-stage');
  const sample = buildSample(slug, cfg, recipe);
  stage.prepend(sample);

  const parts = cfg.parts.map((p) => ({ ...p, el: sample.querySelector(p.selector) })).filter((p, i) => {
    if (!p.el) (host.dataset.missing = `${host.dataset.missing || ''} ${cfg.parts[i].selector}`.trim());
    return p.el;
  });
  let selected = Math.max(0, parts.findIndex((p) => p.main));

  const list = host.querySelector('.pa-parts');
  list.innerHTML = parts.map((p, i) => `<li><button type="button" class="pa-part" data-i="${i}"><span class="pa-num">${i + 1}</span><span><strong>${esc(p.name)}</strong><small>${esc(p.desc)}</small></span></button></li>`).join('');

  function renderSpec() {
    const p = parts[selected];
    if (!p) return;
    host.querySelector('.pa-spec__title').textContent = p.name;
    const res = selected === parts.findIndex((x) => x.main) ? cfg.resize : '';
    host.querySelector('.pa-spec__rows').innerHTML = specRows(p.el, res).map((r) => `<div><dt>${esc(r.label)}</dt><dd>${r.swatch ? `<i class="pa-swatch" style="background:${esc(r.swatch)}"></i>` : ''}${esc(r.value)}${r.token ? `<code>${esc(r.token)}</code>` : ''}</dd></div>`).join('');
    host.querySelectorAll('[data-i]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.i) === selected)));
  }

  function relRect(el, s) {
    const r = el.getBoundingClientRect();
    return { left: r.left - s.left, top: r.top - s.top, right: r.right - s.left, bottom: r.bottom - s.top, width: r.width, height: r.height };
  }

  function drawRedlines() {
    const box = host.querySelector('.pa-redlines');
    const p = parts[selected];
    if (!p) return;
    const s = stage.getBoundingClientRect();
    const r = relRect(p.el, s);
    const scale = Number(sample.dataset.scale) || 1;
    const cs = getComputedStyle(p.el);
    const size = sizeOf(p.el);
    const zone = (cls, x, y, w, h, label, pos) => `<div class="${cls}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${label ? `<span class="pa-tag pa-tag--${pos}">${label}</span>` : ''}</div>`;
    const html = [zone('pa-box', r.left, r.top, r.width, r.height)];
    const pad = ['Top', 'Right', 'Bottom', 'Left'].map((k) => (parseFloat(cs[`padding${k}`]) || 0));
    if (pad[0]) html.push(zone('pa-zone', r.left, r.top, r.width, pad[0] * scale, pad[0], 'in'));
    if (pad[2]) html.push(zone('pa-zone', r.left, r.bottom - pad[2] * scale, r.width, pad[2] * scale, pad[2], 'in'));
    // Side zones stop at the top and bottom zones so no area is hatched twice.
    const sideTop = r.top + pad[0] * scale;
    const sideHeight = Math.max(0, r.height - (pad[0] + pad[2]) * scale);
    if (pad[3]) html.push(zone('pa-zone', r.left, sideTop, pad[3] * scale, sideHeight, pad[3], 'in'));
    if (pad[1]) html.push(zone('pa-zone', r.right - pad[1] * scale, sideTop, pad[1] * scale, sideHeight, pad[1], 'in'));

    if (/flex/.test(cs.display)) {
      const column = cs.flexDirection.startsWith('column');
      const gap = parseFloat(column ? cs.rowGap : cs.columnGap) || 0;
      const kids = [...p.el.children].filter((k) => k.getBoundingClientRect().width && getComputedStyle(k).position !== 'absolute');
      if (gap) {
        kids.slice(1).forEach((k, i) => {
          const a = relRect(kids[i], s);
          const c = relRect(k, s);
          if (column) html.push(zone('pa-zone pa-zone--gap', r.left, a.bottom, r.width, c.top - a.bottom, gap, 'in'));
          else html.push(zone('pa-zone pa-zone--gap', a.right, r.top, c.left - a.right, r.height, gap, 'in'));
        });
      }
    }
    // Rulers sit outside the whole sample so they never cross neighboring parts.
    const outer = relRect(sample, s);
    html.push(zone('pa-dim pa-dim--w', r.left, Math.max(r.bottom, outer.bottom) + 14, r.width, 9, Math.round(size.w * 100) / 100, 'dim'));
    html.push(zone('pa-dim pa-dim--h', Math.min(r.left, outer.left) - 23, r.top, 9, r.height, Math.round(size.h * 100) / 100, 'dim'));
    box.innerHTML = html.join('');
  }

  function drawPins() {
    const s = stage.getBoundingClientRect();
    const rects = parts.map((p) => relRect(p.el, s));
    const sampleRect = relRect(sample, s);
    // Tall components list pins down the right so leader lines stay off the content.
    const side = sampleRect.height > 100 && s.width > 460;
    const sampleBox = rects.reduce((acc, r) => ({ top: Math.min(acc.top, r.top), right: Math.max(acc.right, r.right), left: Math.min(acc.left, r.left) }), { top: sampleRect.top, right: sampleRect.right, left: sampleRect.left });
    const order = rects.map((r, i) => ({ i, c: side ? r.top + r.height / 2 : r.left + r.width / 2 })).sort((a, b) => a.c - b.c);
    const STEP = 32;
    const limit = side ? s.height - 18 : s.width - 18;
    let cursor = 18 - STEP;
    order.forEach((o) => { o.pos = Math.max(o.c, cursor + STEP); cursor = o.pos; });
    for (let k = order.length - 1, next = limit + STEP; k >= 0; k -= 1) {
      order[k].pos = Math.min(order[k].pos, next - STEP);
      next = order[k].pos;
    }
    const pinX = Math.min(s.width - 18, sampleBox.right + 44);
    const pinY = Math.max(18, sampleBox.top - 44);
    let pinHtml = '';
    let lineHtml = '';
    order.forEach((o) => {
      const r = rects[o.i];
      const x = side ? pinX : o.pos;
      const y = side ? o.pos : pinY;
      const tx = side ? r.right : r.left + r.width / 2;
      const ty = side ? r.top + r.height / 2 : r.top;
      lineHtml += `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" data-l="${o.i}"/><circle cx="${tx}" cy="${ty}" r="2.5" data-l="${o.i}"/>`;
      pinHtml += `<button type="button" class="pa-pin" data-i="${o.i}" style="left:${x}px;top:${y}px" aria-label="${o.i + 1}: ${esc(parts[o.i].name)}">${o.i + 1}</button>`;
    });
    host.querySelector('.pa-lines').innerHTML = lineHtml;
    host.querySelector('.pa-pins').innerHTML = pinHtml;
    markLines();
  }
  function markLines() {
    host.querySelectorAll('[data-l]').forEach((n) => n.classList.toggle('is-on', Number(n.dataset.l) === selected));
  }

  function layout() {
    const stageW = stage.clientWidth;
    if (!stageW) return;
    sample.style.transform = 'none';
    const w = sample.offsetWidth;
    const h = sample.offsetHeight;
    const narrow = stageW < 460;
    const avail = stageW - (narrow ? 56 : 180);
    let scale = Math.min(2, avail / w, 380 / h);
    if (scale > 1) scale = Math.floor(scale * 4) / 4;
    // Parts positioned outside the sample (the tooltip bubble) need room above it.
    sample.style.transform = `scale(${scale})`;
    const sampleTop = sample.getBoundingClientRect().top;
    const overTop = Math.max(0, ...parts.map((p) => sampleTop - p.el.getBoundingClientRect().top));
    const stageH = Math.max(280, h * scale + overTop + 190);
    stage.style.height = `${stageH}px`;
    const left = (stageW - w * scale) / 2 - (narrow ? 0 : 16);
    const top = (stageH - h * scale - overTop) / 2 + overTop;
    sample.style.left = `${left}px`;
    sample.style.top = `${top}px`;
    sample.style.transform = `scale(${scale})`;
    sample.dataset.scale = String(scale);
    host.querySelector('.pa-scale').textContent = `Shown at ${Math.round(scale * 100)}%. Numbers are real size.`;
    drawPins();
    drawRedlines();
    renderSpec();
  }

  function select(i) {
    if (i === selected) return;
    selected = i;
    markLines();
    drawRedlines();
    renderSpec();
  }
  host.addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (b) select(Number(b.dataset.i));
  });
  host.addEventListener('pointerover', (e) => {
    const b = e.target.closest('[data-i]');
    if (b) select(Number(b.dataset.i));
  });
  host.addEventListener('focusin', (e) => {
    const b = e.target.closest('[data-i]');
    if (b) select(Number(b.dataset.i));
  });

  let frame = 0;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(layout);
  };
  new ResizeObserver(schedule).observe(stage);
  new MutationObserver(schedule).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  document.fonts?.ready.then(schedule);
  layout();
}

/** Reads every part of a component from an off-screen render. */
export function measureComponent(slug) {
  const cfg = ANATOMY[slug];
  const recipe = RECIPES.find((r) => r.slug === slug);
  if (!cfg || !recipe) return null;
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;left:-9999px;top:0;visibility:hidden;';
  host.setAttribute('aria-hidden', 'true');
  const sample = buildSample(slug, cfg, recipe);
  host.appendChild(sample);
  document.body.appendChild(host);
  const parts = cfg.parts.map((p) => ({ ...p, el: sample.querySelector(p.selector) })).filter((p) => p.el);
  const main = parts.find((p) => p.main) || parts[0];
  const mainStyle = getComputedStyle(main.el);
  const result = {
    height: /height fixed/.test(cfg.resize || '') ? main.el.offsetHeight : null,
    radius: Math.round(parseFloat(mainStyle.borderTopLeftRadius) || 0),
    parts: parts.map((p) => ({ name: p.name, rows: specRows(p.el, p === main ? cfg.resize : '') }))
  };
  host.remove();
  return result;
}

/** Fills header chips and the Prompt tab's geometry from real measurements. */
export function applyMeasurements(slug, root = document) {
  const data = measureComponent(slug);
  if (!data) return;
  const height = root.querySelector('[data-measured="height"]');
  if (height) {
    height.textContent = data.height ? `Height: ${data.height}px` : '';
    height.hidden = !data.height;
  }
  const radius = root.querySelector('[data-measured="radius"]');
  if (radius) radius.textContent = `Radius: ${data.radius >= 999 ? 'Full' : `${data.radius}px`}`;
  const prompt = root.querySelector('[data-measured="prompt"]');
  if (prompt) {
    const lines = data.parts.flatMap((p) => [`- **${p.name}**`, ...p.rows.map((r) => `  - ${r.label}: ${r.value}${r.token ? ` (${r.token})` : ''}`)]);
    prompt.textContent = prompt.textContent.replace(
      /## 4\.[^\n]*\n[\s\S]*?(?=\n## 5\.)/,
      `## 4. Measured Geometry (pixels, read from the rendered component in the current theme)\n${lines.join('\n')}\n`
    );
  }
}

/** Mounts each [data-anatomy] host the first time it becomes visible. */
export function initAnatomy(root = document) {
  const hosts = [...root.querySelectorAll('[data-anatomy]')];
  const io = new ResizeObserver((entries) => {
    entries.forEach((en) => {
      if (!en.contentRect.width || en.target.dataset.anatomyReady) return;
      en.target.dataset.anatomyReady = 'true';
      io.unobserve(en.target);
      mount(en.target);
    });
  });
  hosts.forEach((h) => io.observe(h));
}
