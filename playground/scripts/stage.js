/**
 * Aster Design System — Playground Stage
 *
 * One full-bleed stage, one component at a time. Shared by the Astro docs site
 * (apps/docs/src/pages/playground.astro) and the static portal (#/playground).
 * Consumes dist/ only: every stage component is canonical Aster markup, and the
 * markup shown in the Code tab is exactly what is rendered.
 */
import {
  initAsterComponents,
  syncSliderProgress,
  setCheckboxIndeterminate,
  syncInputClear
} from '../../dist/js/aster.js';

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const CHEVRON = '<svg class="as-select-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 6 8 10 12 6"></polyline></svg>';
const ALERT_ICON = '<svg class="as-alert__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2 L14 13 L2 13 Z"></path><line x1="8" y1="6" x2="8" y2="9"></line><circle cx="8" cy="11" r="0.75" fill="currentColor"></circle></svg>';
const sprite = (id, size = 16) => `<svg class="as-icon" width="${size}" height="${size}" aria-hidden="true"><use href="#${id}"/></svg>`;

const opt = (key, label, options, value) => ({ key, label, type: 'select', options, value });
const txt = (key, label, value) => ({ key, label, type: 'text', value });
const tog = (key, label, value = false) => ({ key, label, type: 'switch', value });
const rng = (key, label, min, max, value, unit = '') => ({ key, label, type: 'range', min, max, value, unit });

/* --------------------------------------------------------------------------
   Component recipes: controls + canonical markup for all 21 components
   -------------------------------------------------------------------------- */
const RECIPES = [
  {
    slug: 'button', name: 'Button', group: 'Form Controls', element: '<button>', target: '.as-button',
    controls: [
      opt('variant', 'Variant', ['primary', 'secondary', 'destructive', 'ghost'], 'primary'),
      txt('label', 'Label', 'Do Something'),
      tog('icon', 'Leading icon', true),
      opt('state', 'State', ['default', 'hover', 'pressed', 'focus', 'loading', 'disabled', 'aria-disabled'], 'default')
    ],
    render(v) {
      const force = { hover: ' is-hover', pressed: ' is-pressed', focus: ' is-focus' }[v.state] || '';
      const attrs = v.state === 'loading' ? ' aria-busy="true"' : v.state === 'disabled' ? ' disabled' : v.state === 'aria-disabled' ? ' aria-disabled="true"' : '';
      const lead = v.state === 'loading' ? '<span class="as-spinner" aria-hidden="true"></span>\n  ' : v.icon ? `${sprite('i-star')}\n  ` : '';
      return `<button type="button" class="as-button as-button--${v.variant}${force}"${attrs}>\n  ${lead}<span class="as-button__label">${esc(v.label)}</span>\n</button>`;
    }
  },
  {
    slug: 'input', name: 'Input', group: 'Form Controls', element: '<input>', target: '.as-input-box', width: 'sm',
    controls: [
      txt('label', 'Label', 'Workspace Identifier'),
      txt('value', 'Value', 'acme-platform'),
      txt('helper', 'Helper text', 'Lowercase letters, numbers, and hyphens only.'),
      opt('state', 'State', ['default', 'error', 'disabled'], 'default')
    ],
    render(v) {
      const err = v.state === 'error';
      const described = err ? 'pg-in-err pg-in-help' : 'pg-in-help';
      return `<div class="as-form-field${err ? ' as-form-field--error' : ''}">
  <label class="as-form-field__label" for="pg-in">${esc(v.label)}</label>
  <div class="as-input-box">
    <input class="as-input" type="text" id="pg-in" value="${esc(v.value)}" aria-describedby="${described}"${err ? ' aria-invalid="true"' : ''}${v.state === 'disabled' ? ' disabled' : ''} />
    <button type="button" class="as-input__action" data-clear-for="pg-in" aria-label="Clear value">
      ${sprite('i-x', 14)}
    </button>
  </div>${err ? `\n  <p class="as-form-field__message as-form-field__error" id="pg-in-err">${sprite('i-alert')}<span class="as-form-field__error-text">Use lowercase letters, numbers, and hyphens only.</span></p>` : ''}
  <p class="as-form-field__helper" id="pg-in-help">${esc(v.helper)}</p>
</div>`;
    }
  },
  {
    slug: 'textarea', name: 'Textarea', group: 'Form Controls', element: '<textarea>', target: '.as-textarea-box', width: 'sm',
    controls: [
      txt('label', 'Label', 'Release Notes'),
      txt('value', 'Value', 'Rolled out kernel 6.8 across worker nodes.'),
      rng('max', 'Max length', 50, 500, 300),
      tog('disabled', 'Disabled')
    ],
    render(v) {
      return `<div class="as-form-field">
  <label class="as-form-field__label" for="pg-ta">${esc(v.label)}</label>
  <div class="as-textarea-box">
    <textarea class="as-textarea" id="pg-ta" maxlength="${v.max}"${v.disabled ? ' disabled' : ''}>${esc(v.value)}</textarea>
    <div class="as-textarea__footer">
      <span class="as-textarea__counter">${v.value.length} / ${v.max}</span>
    </div>
  </div>
</div>`;
    }
  },
  {
    slug: 'select', name: 'Select', group: 'Form Controls', element: '<select>', target: '.as-select-box', width: 'sm',
    controls: [txt('label', 'Label', 'Compute Region'), tog('disabled', 'Disabled')],
    render(v) {
      return `<div class="as-form-field">
  <label class="as-form-field__label" for="pg-sel">${esc(v.label)}</label>
  <div class="as-select-box">
    <select class="as-select" id="pg-sel"${v.disabled ? ' disabled' : ''}>
      <option value="eu-west-1" selected>Europe (Ireland)</option>
      <option value="us-east-1">US East (N. Virginia)</option>
      <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
    </select>
    ${CHEVRON}
  </div>
</div>`;
    }
  },
  {
    slug: 'checkbox', name: 'Checkbox', group: 'Form Controls', element: '<input type="checkbox">', target: '.as-checkbox-field',
    controls: [
      txt('label', 'Label', 'Enforce zero-trust ingress'),
      txt('desc', 'Description', 'Drop unauthenticated packets.'),
      opt('state', 'State', ['checked', 'unchecked', 'indeterminate'], 'checked'),
      tog('disabled', 'Disabled')
    ],
    render(v) {
      const attrs = (v.state === 'checked' ? ' checked' : '') + (v.state === 'indeterminate' ? ' data-indeterminate="true"' : '') + (v.disabled ? ' disabled' : '');
      return `<label class="as-checkbox-field">
  <span class="as-checkbox"><input type="checkbox" class="as-checkbox-input"${attrs}></span>
  <span class="as-checkbox-field__content">
    <span class="as-checkbox-field__label">${esc(v.label)}</span>
    <span class="as-checkbox-field__description">${esc(v.desc)}</span>
  </span>
</label>`;
    }
  },
  {
    slug: 'radio', name: 'Radio', group: 'Form Controls', element: '<fieldset>', target: '.as-radio-group',
    controls: [
      txt('legend', 'Legend', 'Rollout Strategy'),
      opt('selected', 'Selected', ['Rolling Update', 'Blue/Green Cutover', 'Canary'], 'Rolling Update'),
      tog('disabled', 'Disabled')
    ],
    render(v) {
      const row = (name) => `  <label class="as-radio-field">
    <span class="as-radio"><input type="radio" name="pg-radio" class="as-radio-input"${name === v.selected ? ' checked' : ''}${v.disabled ? ' disabled' : ''}></span>
    <span class="as-radio-field__content"><span class="as-radio-field__label">${name}</span></span>
  </label>`;
      return `<fieldset class="as-radio-group">
  <legend class="as-radio-group__legend">${esc(v.legend)}</legend>
${['Rolling Update', 'Blue/Green Cutover', 'Canary'].map(row).join('\n')}
</fieldset>`;
    }
  },
  {
    slug: 'switch', name: 'Switch', group: 'Form Controls', element: '<input role="switch">', target: '.as-switch-field',
    controls: [
      txt('label', 'Label', 'Automatic Node Eviction'),
      txt('desc', 'Description', 'Evict pods above 92% memory.'),
      tog('checked', 'On', true),
      tog('disabled', 'Disabled')
    ],
    render(v) {
      return `<label class="as-switch-field">
  <span class="as-switch">
    <input type="checkbox" role="switch" class="as-switch-input"${v.checked ? ' checked' : ''}${v.disabled ? ' disabled' : ''}>
    <span class="as-switch-track"><span class="as-switch-thumb"></span></span>
  </span>
  <span class="as-switch-field__content">
    <span class="as-switch-field__label">${esc(v.label)}</span>
    <span class="as-switch-field__description">${esc(v.desc)}</span>
  </span>
</label>`;
    }
  },
  {
    slug: 'slider', name: 'Slider', group: 'Form Controls', element: '<input type="range">', target: '.as-slider-field', width: 'sm',
    controls: [txt('label', 'Label', 'Memory Allocation'), rng('value', 'Value', 0, 100, 75, '%'), tog('disabled', 'Disabled')],
    render(v) {
      return `<div class="as-slider-field">
  <div class="as-slider-field__header">
    <label class="as-slider-field__label" for="pg-sld">${esc(v.label)}</label>
    <span class="as-slider-field__value">${v.value}%</span>
  </div>
  <div class="as-slider-box">
    <input type="range" class="as-slider" id="pg-sld" min="0" max="100" value="${v.value}"${v.disabled ? ' disabled' : ''}>
  </div>
</div>`;
    }
  },
  {
    slug: 'table', name: 'Table', group: 'Data Display', element: '<table>', target: '.as-table-container', width: 'lg',
    controls: [rng('rows', 'Rows', 1, 5, 4), tog('status', 'Status column', true), tog('striped', 'Striped')],
    render(v) {
      const data = [
        ['iad-01', 'us-east-1', 'Active', 'success', '1.24 ms'],
        ['sfo-04', 'us-west-2', 'Active', 'success', '2.89 ms'],
        ['fra-09', 'eu-central-1', 'Degraded', 'warning', '14.10 ms'],
        ['gru-05', 'sa-east-1', 'Offline', 'critical', '38.70 ms'],
        ['lhr-02', 'eu-west-2', 'Active', 'success', '3.07 ms']
      ].slice(0, v.rows);
      const rows = data.map(([n, r, s, c, l]) => `        <tr class="as-table__row">
          <th scope="row" class="as-table__cell as-table__cell--primary">${n}</th>
          <td class="as-table__cell">${r}</td>${v.status ? `\n          <td class="as-table__cell"><span class="as-badge as-badge--${c}">${s}</span></td>` : ''}
          <td class="as-table__cell as-table__cell--num">${l}</td>
        </tr>`).join('\n');
      return `<div class="as-table-container">
  <div class="as-table-scroll">
    <table class="as-table as-table--interactive${v.striped ? ' as-table--striped' : ''}">
      <caption class="as-sr-only">Cluster nodes</caption>
      <thead>
        <tr>
          <th scope="col" class="as-table__th">Node</th>
          <th scope="col" class="as-table__th">Region</th>${v.status ? '\n          <th scope="col" class="as-table__th">Status</th>' : ''}
          <th scope="col" class="as-table__th as-table__th--num">Latency</th>
        </tr>
      </thead>
      <tbody>
${rows}
      </tbody>
    </table>
  </div>
</div>`;
    }
  },
  {
    slug: 'badge', name: 'Badge', group: 'Data Display', element: '<span>', target: '.as-badge',
    controls: [opt('variant', 'Variant', ['success', 'warning', 'critical', 'info', 'muted'], 'success'), txt('label', 'Label', 'Healthy'), tog('dot', 'Status dot', true)],
    render(v) {
      return `<span class="as-badge as-badge--${v.variant}">\n  ${v.dot ? '<span class="as-badge__dot"></span>' : ''}${esc(v.label)}\n</span>`;
    }
  },
  {
    slug: 'progress', name: 'Progress', group: 'Data Display', element: '<div role="progressbar">', target: '.as-progress', width: 'sm',
    controls: [txt('label', 'Label', 'Snapshot Compression'), rng('value', 'Value', 0, 100, 68, '%'), tog('indeterminate', 'Indeterminate')],
    render(v) {
      const label = esc(v.label);
      const bar = v.indeterminate
        ? `<div class="as-progress as-progress--indeterminate" role="progressbar" aria-label="${label}">\n    <span class="as-progress__bar"></span>\n  </div>`
        : `<div class="as-progress" role="progressbar" aria-valuenow="${v.value}" aria-valuemin="0" aria-valuemax="100" aria-label="${label}">\n    <span class="as-progress__bar" style="width: ${v.value}%;"></span>\n  </div>`;
      return `<div class="as-progress-field">
  <div class="as-progress-field__header">
    <span class="as-progress-field__label">${label}</span>
    <span class="as-progress-field__value">${v.indeterminate ? 'Working' : `${v.value}%`}</span>
  </div>
  ${bar}
</div>`;
    }
  },
  {
    slug: 'skeleton', name: 'Skeleton', group: 'Data Display', element: '<div aria-hidden="true">', target: '[aria-busy]', width: 'sm',
    controls: [tog('avatar', 'Avatar', true), rng('lines', 'Text lines', 1, 5, 3)],
    render(v) {
      const widths = [100, 80, 92, 60, 72];
      const lines = widths.slice(0, v.lines).map((w) => `    <div class="as-skeleton as-skeleton--text" aria-hidden="true" style="width: ${w}%;"></div>`).join('\n');
      return `<div aria-busy="true" style="display: flex; gap: var(--as-space-3);">${v.avatar ? '\n  <div class="as-skeleton as-skeleton--avatar" aria-hidden="true" style="width: 40px; height: 40px; flex: none;"></div>' : ''}
  <div style="flex: 1; display: flex; flex-direction: column; gap: var(--as-space-2);">
${lines}
  </div>
</div>`;
    }
  },
  {
    slug: 'alert', name: 'Alert', group: 'Feedback', element: '<div role="region">', target: '.as-alert', width: 'md',
    controls: [
      opt('variant', 'Variant', ['warning', 'critical', 'success', 'info'], 'warning'),
      txt('title', 'Title', 'Scheduled Kernel Upgrade'),
      txt('desc', 'Description', 'Node pool eu-west-1a drains in 45 minutes.')
    ],
    render(v) {
      return `<div class="as-alert as-alert--${v.variant}" role="region" aria-labelledby="pg-al-t">
  ${ALERT_ICON}
  <div class="as-alert__content">
    <div class="as-alert__title" id="pg-al-t">${esc(v.title)}</div>
    <div class="as-alert__description">${esc(v.desc)}</div>
  </div>
  <button type="button" class="as-alert__close" aria-label="Dismiss alert"></button>
</div>`;
    }
  },
  {
    slug: 'tooltip', name: 'Tooltip', group: 'Feedback', element: '<div role="tooltip">', target: '.as-button', hint: 'Hover or focus the button',
    controls: [txt('label', 'Trigger label', 'Snapshot Volume'), txt('tip', 'Tooltip text', 'Instant cryptographic snapshot')],
    render(v) {
      return `<div class="as-tooltip-trigger">
  <button type="button" class="as-button as-button--secondary" aria-describedby="pg-tip">
    <span class="as-button__label">${esc(v.label)}</span>
  </button>
  <div class="as-tooltip" id="pg-tip" role="tooltip">${esc(v.tip)}</div>
</div>`;
    }
  },
  {
    slug: 'toast', name: 'Toast', group: 'Feedback', element: 'showToast()', target: '.as-button', hint: 'Click to spawn a toast',
    controls: [
      opt('variant', 'Variant', ['success', 'warning', 'critical', 'info'], 'success'),
      txt('title', 'Title', 'Cluster Rebalanced'),
      txt('message', 'Message', 'Workloads distributed across 3 zones.')
    ],
    render(v) {
      return `<button type="button" class="as-button as-button--primary" data-toast-trigger data-toast-variant="${v.variant}" data-toast-title="${esc(v.title)}" data-toast-message="${esc(v.message)}">
  <span class="as-button__label">Spawn Toast</span>
</button>`;
    }
  },
  {
    slug: 'dialog', name: 'Dialog', group: 'Overlays', element: '<dialog>', target: '.as-button', hint: 'Click to open the dialog',
    controls: [txt('title', 'Title', 'SYSTEM SPEC'), txt('subtitle', 'Subtitle', 'The laws governing this artifact.'), txt('cta', 'Action label', 'ACKNOWLEDGE')],
    render(v) {
      return `<button type="button" class="as-button as-button--primary" data-dialog-open="pg-dlg">
  <span class="as-button__label">Open Dialog</span>
</button>
<dialog class="as-dialog" id="pg-dlg" aria-labelledby="pg-dlg-t" aria-describedby="pg-dlg-d">
  <div class="as-dialog__surface">
    <div class="as-dialog__header">
      <span class="as-dialog__title" id="pg-dlg-t">${esc(v.title)}</span>
      <button type="button" class="as-dialog__close" data-dialog-close aria-label="Close dialog"></button>
    </div>
    <div class="as-dialog__hero">
      <h2 class="as-dialog__hero-title">${esc(v.title)}</h2>
      <p class="as-dialog__hero-subtitle" id="pg-dlg-d">${esc(v.subtitle)}</p>
    </div>
    <div class="as-dialog__footer">
      <button type="button" class="as-button as-button--primary as-button--lg as-button--pill-cta" data-dialog-close>
        <span class="as-button__label">${esc(v.cta)}</span>
      </button>
    </div>
  </div>
</dialog>`;
    }
  },
  {
    slug: 'drawer', name: 'Drawer', group: 'Overlays', element: '<div role="dialog">', target: '.as-button', hint: 'Click to open the drawer',
    controls: [opt('side', 'Side', ['right', 'left'], 'right'), txt('title', 'Title', 'Node Telemetry'), txt('body', 'Body', 'Node worker-01 running kernel 6.8 with zero dropped packets.')],
    render(v) {
      return `<button type="button" class="as-button as-button--secondary" data-drawer-open="pg-drw">
  <span class="as-button__label">Open Drawer</span>
</button>
<div class="as-drawer" id="pg-drw" role="dialog" aria-modal="true" aria-labelledby="pg-drw-t" hidden>
  <div class="as-drawer__backdrop" data-drawer-close></div>
  <div class="as-drawer__panel as-drawer__panel--${v.side}">
    <div class="as-drawer__header">
      <h3 class="as-drawer__title" id="pg-drw-t">${esc(v.title)}</h3>
      <button type="button" class="as-drawer__close" data-drawer-close aria-label="Close drawer"></button>
    </div>
    <div class="as-drawer__body">${esc(v.body)}</div>
    <div class="as-drawer__footer">
      <button type="button" class="as-button as-button--secondary" data-drawer-close><span class="as-button__label">Close</span></button>
    </div>
  </div>
</div>`;
    }
  },
  {
    slug: 'popover', name: 'Popover', group: 'Overlays', element: '<div role="dialog">', target: '.as-button', hint: 'Click to open the popover',
    controls: [txt('label', 'Trigger label', 'Filter Pods'), txt('title', 'Title', 'Filter Preferences'), txt('body', 'Body', 'Display healthy worker instances only.'), opt('align', 'Align', ['left', 'right'], 'left')],
    render(v) {
      return `<div class="as-popover-anchor">
  <button type="button" class="as-button as-button--secondary as-popover-trigger" id="pg-pop" aria-haspopup="dialog" aria-expanded="false">
    <span class="as-button__label">${esc(v.label)}</span>
  </button>
  <div class="as-popover${v.align === 'right' ? ' as-popover--right' : ''}" role="dialog" aria-labelledby="pg-pop" hidden>
    <div class="as-popover__header">
      <h4 class="as-popover__title">${esc(v.title)}</h4>
      <button type="button" class="as-popover__close" data-popover-close aria-label="Close popover"></button>
    </div>
    <div class="as-popover__body">${esc(v.body)}</div>
  </div>
</div>`;
    }
  },
  {
    slug: 'dropdown', name: 'Dropdown', group: 'Overlays', element: '<div role="menu">', target: '.as-button', hint: 'Click, then use the arrow keys',
    controls: [txt('label', 'Trigger label', 'Cluster Operations'), tog('destructive', 'Destructive item', true)],
    render(v) {
      return `<div class="as-dropdown">
  <button type="button" class="as-button as-button--secondary as-dropdown__trigger" id="pg-dd" aria-haspopup="menu" aria-expanded="false">
    <span class="as-button__label">${esc(v.label)}</span>
    <svg class="as-dropdown__chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 6 8 10 12 6"></polyline></svg>
  </button>
  <div class="as-dropdown__menu" role="menu" aria-labelledby="pg-dd" hidden>
    <button type="button" class="as-dropdown__item" role="menuitem">Restart Active Pods</button>
    <button type="button" class="as-dropdown__item" role="menuitem">Export Telemetry</button>${v.destructive ? `
    <div class="as-dropdown__divider" role="separator"></div>
    <button type="button" class="as-dropdown__item as-dropdown__item--destructive" role="menuitem">Drain Node Pool</button>` : ''}
  </div>
</div>`;
    }
  },
  {
    slug: 'tabs', name: 'Tabs', group: 'Navigation', element: '<div role="tablist">', target: '.as-tabs', width: 'md',
    controls: [opt('active', 'Active tab', ['Nodes', 'Volumes', 'Ingress'], 'Nodes')],
    render(v) {
      const items = [['Nodes', 'Three worker instances running kernel 6.8.'], ['Volumes', 'Four NVMe volumes attached across zones.'], ['Ingress', 'Mesh router handling 14,290 requests/sec.']];
      const tabs = items.map(([n], i) => {
        const on = n === v.active;
        return `    <button type="button" class="as-tabs__tab${on ? ' is-active' : ''}" role="tab" id="pg-tab-${i}" aria-selected="${on}" aria-controls="pg-pan-${i}" tabindex="${on ? 0 : -1}">${n}</button>`;
      }).join('\n');
      const panels = items.map(([n, body], i) => {
        const on = n === v.active;
        return `  <div class="as-tabs__panel${on ? ' is-active' : ''}" role="tabpanel" id="pg-pan-${i}" aria-labelledby="pg-tab-${i}" tabindex="0"${on ? '' : ' hidden'}>${body}</div>`;
      }).join('\n');
      return `<div class="as-tabs">
  <div class="as-tabs__list" role="tablist" aria-label="Infrastructure" aria-orientation="horizontal">
${tabs}
  </div>
${panels}
</div>`;
    }
  },
  {
    slug: 'accordion', name: 'Accordion', group: 'Navigation', element: '<button aria-expanded>', target: '.as-accordion', width: 'md',
    controls: [tog('single', 'Single expand', true), tog('open', 'First item open', true)],
    render(v) {
      const items = [['Zero-Downtime Rollouts', 'Pods drain gracefully with health probe verification.'], ['Multi-Zone Peering', 'Workloads spread across three availability zones.']];
      const body = items.map(([t, c], i) => {
        const on = i === 0 && v.open;
        return `  <div class="as-accordion__item">
    <h3 class="as-accordion__heading">
      <button type="button" class="as-accordion__trigger" aria-expanded="${on}" aria-controls="pg-acc-p${i}" id="pg-acc-t${i}">
        <span class="as-accordion__title">${t}</span>
        <svg class="as-accordion__chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 6 8 10 12 6"></polyline></svg>
      </button>
    </h3>
    <div class="as-accordion__panel" id="pg-acc-p${i}" role="region" aria-labelledby="pg-acc-t${i}"${on ? '' : ' hidden'}>
      <div class="as-accordion__content">${c}</div>
    </div>
  </div>`;
      }).join('\n');
      return `<div class="as-accordion" data-single="${v.single}">\n${body}\n</div>`;
    }
  }
];

function highlight(raw) {
  return esc(raw).replace(
    /(&lt;\/?[\w-]+)|([\w:-]+)(?==&quot;)|(&quot;.*?&quot;)|(\/?&gt;)/g,
    (m, tag, attr, str, close) => {
      if (tag || close) return `<span class="tok-tag">${m}</span>`;
      if (attr) return `<span class="tok-attr">${m}</span>`;
      if (str) return `<span class="tok-str">${m}</span>`;
      return m;
    }
  );
}

const RULER_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="8" width="20" height="8" rx="1.5"/><path d="M7 8v3M12 8v4M17 8v3"/></svg>';
const GRID_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/></svg>';

function shell() {
  const groups = [...new Set(RECIPES.map((r) => r.group))];
  const tabs = [['props', 'Props'], ['code', 'Code'], ['spec', 'Spec'], ['events', 'Events']];
  return `
  <section class="pg-stage" data-backdrop="plain" aria-label="Component stage">
    <div class="pg-stage__dots" aria-hidden="true"></div>
    <div class="pg-stage__dots pg-stage__dots--lit" aria-hidden="true"></div>
    <div class="pg-stage__ghost" id="pg-ghost" aria-hidden="true"></div>

    <div class="pg-stage__meta">
      <span id="pg-meta-index"></span>
      <span id="pg-meta-element"></span>
      <span class="pg-stage__hint" id="pg-meta-hint"></span>
    </div>

    <div class="pg-stage__scene" id="pg-scene">
      <div class="pg-stage__mount" id="pg-stage-mount"></div>
    </div>
    <div class="pg-measure" id="pg-measure" aria-hidden="true" hidden></div>

    <aside class="pg-panel" id="pg-panel" aria-label="Component inspector" hidden>
      <header class="pg-panel__head" id="pg-panel-head">
        <span class="pg-panel__title" id="pg-panel-title"></span>
        <button type="button" class="as-dialog__close" id="pg-panel-close" aria-label="Close inspector"></button>
      </header>
      <div class="pg-panel__tabs" role="tablist" aria-label="Inspector views">
        ${tabs.map(([id, label], i) => `<button type="button" role="tab" class="pg-panel__tab" id="pg-tab-btn-${id}" data-pg-tab="${id}" aria-controls="pg-view-${id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${label}</button>`).join('')}
      </div>
      <div class="pg-panel__body">
        <div role="tabpanel" id="pg-view-props" aria-labelledby="pg-tab-btn-props">
          <details class="pg-sec" open>
            <summary>Component</summary>
            <div class="pg-sec__body" id="pg-controls"></div>
          </details>
          <details class="pg-sec">
            <summary>Stage</summary>
            <div class="pg-sec__body" id="pg-stage-controls"></div>
          </details>
        </div>
        <div role="tabpanel" id="pg-view-code" aria-labelledby="pg-tab-btn-code" hidden>
          <div class="code-block pg-code" id="pg-live-code">
            <div class="code-block__bar">
              <div class="code-block__meta"><span>HTML</span></div>
              <button type="button" class="copy-btn">Copy Code</button>
            </div>
            <pre><code id="pg-live-code-el" data-highlighted="true"></code></pre>
          </div>
        </div>
        <div role="tabpanel" id="pg-view-spec" aria-labelledby="pg-tab-btn-spec" hidden>
          <p class="pg-note">Computed from the rendered element in the current theme.</p>
          <dl class="pg-spec" id="pg-spec"></dl>
          <a class="as-button as-button--secondary pg-docs-link" id="pg-docs-link"><span class="as-button__label">Read the docs</span></a>
        </div>
        <div role="tabpanel" id="pg-view-events" aria-labelledby="pg-tab-btn-events" hidden>
          <div class="pg-events__bar">
            <p class="pg-note">Interact with the component to log events.</p>
            <button type="button" class="pg-link-btn" id="pg-events-clear">Clear</button>
          </div>
          <ol class="pg-events" id="pg-events"></ol>
        </div>
      </div>
      <footer class="pg-panel__foot">
        <button type="button" class="pg-link-btn" id="pg-undo" disabled>Undo</button>
        <button type="button" class="pg-link-btn" id="pg-redo" disabled>Redo</button>
        <span class="pg-panel__spacer"></span>
        <button type="button" class="pg-link-btn" id="pg-reset">Reset</button>
      </footer>
    </aside>

    <nav class="pg-dock" aria-label="Playground controls">
      <button type="button" class="pg-dock__icon" id="pg-prev" aria-label="Previous component">${sprite('i-arrow-left')}</button>
      <button type="button" class="pg-dock__current" id="pg-open-picker" aria-haspopup="dialog">
        ${GRID_ICON}
        <span id="pg-dock-name"></span>
        <small id="pg-dock-count"></small>
      </button>
      <button type="button" class="pg-dock__icon" id="pg-next" aria-label="Next component">${sprite('i-arrow')}</button>
      <span class="pg-dock__rule" aria-hidden="true"></span>
      <button type="button" class="pg-dock__icon" id="pg-toggle-measure" aria-label="Measure component" aria-pressed="false" title="Measure">${RULER_ICON}</button>
      <button type="button" class="pg-dock__inspect" id="pg-toggle-panel" aria-expanded="false" aria-controls="pg-panel">
        ${sprite('i-sliders')}
        <span>Inspect</span>
      </button>
    </nav>

    <dialog class="pg-picker" id="pg-picker" aria-labelledby="pg-picker-title">
      <header class="pg-picker__head">
        <h2 id="pg-picker-title">Components</h2>
        <button type="button" class="as-dialog__close" id="pg-picker-close" aria-label="Close component list"></button>
      </header>
      <div class="pg-picker__body">
        ${groups.map((g) => `<section>
          <h3>${g}</h3>
          <div class="pg-picker__grid">
            ${RECIPES.filter((r) => r.group === g).map((r) => `<button type="button" class="pg-dock__btn" data-pg-comp="${r.slug}" aria-pressed="false"><span>${r.name}</span><small>${esc(r.element)}</small></button>`).join('')}
          </div>
        </section>`).join('')}
      </div>
    </dialog>
  </section>`;
}

/**
 * Mounts the stage into `host`.
 * @param {HTMLElement} host
 * @param {{ docsHref?: (slug: string) => string }} [options]
 * @returns {{ refresh: () => void }}
 */
export function mountStage(host, options = {}) {
  if (!host) return { refresh() {} };
  const docsHref = options.docsHref || ((slug) => `/components/${slug}`);
  host.innerHTML = shell();
  initAsterComponents(document);

  const $ = (s, r = host) => r.querySelector(s);
  const $$ = (s, r = host) => Array.from(r.querySelectorAll(s));
  const stage = $('.pg-stage');
  const mount = $('#pg-stage-mount');
  const scene = $('#pg-scene');
  const measure = $('#pg-measure');
  const panel = $('#pg-panel');
  const picker = $('#pg-picker');
  const live = document.getElementById('global-live-region');
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const say = (msg) => {
    if (!live) return;
    live.textContent = '';
    setTimeout(() => { live.textContent = msg; }, 40);
  };

  const defaults = (r) => Object.fromEntries(r.controls.map((c) => [c.key, c.value]));
  const values = Object.fromEntries(RECIPES.map((r) => [r.slug, defaults(r)]));
  const history = Object.fromEntries(RECIPES.map((r) => [r.slug, { undo: [], redo: [], lastKey: null, lastAt: 0 }]));
  const view = { index: 0, measuring: false, ghost: true, sparkle: true, backdrop: 'plain', tab: 'props' };
  const recipe = () => RECIPES[view.index];

  /* ---- Control rendering ---- */
  function controlHtml(c, value, attr) {
    const id = `pg-ctrl-${c.key}`;
    const label = `<label class="pg-field__label" for="${id}">${esc(c.label)}</label>`;
    if (c.type === 'select') {
      return `<div class="pg-field">${label}<div class="as-select-box"><select class="as-select" id="${id}" ${attr}="${c.key}">${c.options.map((o) => `<option value="${esc(o)}"${o === value ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>${CHEVRON}</div></div>`;
    }
    if (c.type === 'text') {
      return `<div class="pg-field">${label}<div class="as-input-box"><input class="as-input" type="text" id="${id}" ${attr}="${c.key}" value="${esc(value)}" autocomplete="off" /></div></div>`;
    }
    if (c.type === 'range') {
      return `<div class="pg-field"><div class="pg-field__row">${label}<output class="pg-field__value" for="${id}">${value}${c.unit}</output></div><input type="range" class="as-slider" id="${id}" ${attr}="${c.key}" min="${c.min}" max="${c.max}" value="${value}" /></div>`;
    }
    return `<label class="as-switch-field pg-switch" for="${id}"><span class="as-switch-field__content"><span class="as-switch-field__label">${esc(c.label)}</span></span><span class="as-switch"><input type="checkbox" role="switch" class="as-switch-input" id="${id}" ${attr}="${c.key}"${value ? ' checked' : ''}><span class="as-switch-track"><span class="as-switch-thumb"></span></span></span></label>`;
  }

  function renderControls() {
    const box = $('#pg-controls');
    const r = recipe();
    box.innerHTML = r.controls.map((c) => controlHtml(c, values[r.slug][c.key], 'data-key')).join('');
    $$('input[type="range"]', box).forEach((s) => syncSliderProgress(s));
  }

  const STAGE_CONTROLS = [
    opt('backdrop', 'Backdrop', ['plain', 'dots', 'grid'], 'plain'),
    tog('ghost', 'Ghost title', true),
    tog('sparkle', 'Sparkle on click', true)
  ];
  $('#pg-stage-controls').innerHTML = STAGE_CONTROLS.map((c) => controlHtml({ ...c, key: `stage-${c.key}` }, c.value, 'data-stage-key')).join('')
    + '<p class="pg-note">Stage concept inspired by <a href="https://github.com/shifatmasud/Shade-DS" target="_blank" rel="noopener noreferrer">Shade-DS</a> by Shifat Masud.</p>';

  /* ---- Stage rendering ---- */
  let restoreBtn = null;
  function renderMount() {
    const r = recipe();
    const html = r.render(values[r.slug]);
    restoreBtn = null;
    mount.dataset.width = r.width || 'auto';
    mount.innerHTML = html;
    $$('input[type="range"].as-slider', mount).forEach((s) => syncSliderProgress(s));
    $$('[data-indeterminate="true"]', mount).forEach((c) => setCheckboxIndeterminate(c, true));
    $$('.as-input', mount).forEach((i) => syncInputClear(i));
    const code = $('#pg-live-code-el');
    code.dataset.raw = html;
    code.innerHTML = highlight(html);
    schedule();
  }

  function renderChrome(direction) {
    const r = recipe();
    const count = `${String(view.index + 1).padStart(2, '0')} / ${RECIPES.length}`;
    $('#pg-ghost').textContent = r.name;
    $('#pg-meta-index').textContent = r.group;
    $('#pg-meta-element').textContent = r.element;
    $('#pg-meta-hint').textContent = r.hint || '';
    $('#pg-dock-name').textContent = r.name;
    $('#pg-dock-count').textContent = count;
    $('#pg-panel-title').textContent = r.name;
    const docs = $('#pg-docs-link');
    docs.href = docsHref(r.slug);
    $$('.pg-dock__btn').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pgComp === r.slug)));
    if (direction && !reduced()) {
      [mount, $('#pg-ghost')].forEach((el) => {
        el.dataset.enter = direction;
        el.getAnimations().forEach((a) => a.cancel());
        el.classList.remove('is-entering');
        void el.offsetWidth;
        el.classList.add('is-entering');
      });
    }
  }

  function selectComponent(index, direction) {
    view.index = (index + RECIPES.length) % RECIPES.length;
    renderControls();
    renderMount();
    renderChrome(direction);
    renderHistory();
    log('select', recipe().slug);
    say(`${recipe().name}. ${view.index + 1} of ${RECIPES.length}.`);
  }

  /* ---- Undo / redo ---- */
  function renderHistory() {
    const h = history[recipe().slug];
    $('#pg-undo').disabled = !h.undo.length;
    $('#pg-redo').disabled = !h.redo.length;
  }
  function record(key) {
    const h = history[recipe().slug];
    const now = Date.now();
    if (!(key === h.lastKey && now - h.lastAt < 800)) h.undo.push({ ...values[recipe().slug] });
    h.lastKey = key;
    h.lastAt = now;
    h.redo.length = 0;
  }
  function travel(from, to) {
    const slug = recipe().slug;
    const h = history[slug];
    if (!h[from].length) return;
    h[to].push({ ...values[slug] });
    values[slug] = h[from].pop();
    h.lastKey = null;
    renderControls();
    renderMount();
    renderHistory();
  }
  $('#pg-undo').addEventListener('click', () => travel('undo', 'redo'));
  $('#pg-redo').addEventListener('click', () => travel('redo', 'undo'));
  $('#pg-reset').addEventListener('click', () => {
    const r = recipe();
    record('__reset');
    history[r.slug].lastKey = null;
    values[r.slug] = defaults(r);
    renderControls();
    renderMount();
    renderHistory();
    say(`${r.name} reset.`);
  });

  /* ---- Control events ---- */
  const readControl = (el) => (el.type === 'checkbox' ? el.checked : el.type === 'range' ? Number(el.value) : el.value);
  function onControl(e) {
    const el = e.target;
    if (el.dataset.key) {
      if (e.type === 'input' && el.tagName === 'SELECT') return;
      if (e.type === 'change' && (el.type === 'text' || el.type === 'range')) return;
      const value = readControl(el);
      record(el.dataset.key);
      values[recipe().slug][el.dataset.key] = value;
      if (el.type === 'range') {
        const c = recipe().controls.find((x) => x.key === el.dataset.key);
        const out = el.parentElement.querySelector('output');
        if (out) out.textContent = `${value}${c.unit}`;
      }
      renderMount();
      renderHistory();
      log('prop', `${el.dataset.key} = ${value}`);
    } else if (el.dataset.stageKey && e.type === 'change') {
      const key = el.dataset.stageKey.replace('stage-', '');
      view[key] = readControl(el);
      stage.dataset.backdrop = view.backdrop;
      stage.toggleAttribute('data-no-ghost', !view.ghost);
    }
  }
  panel.addEventListener('input', onControl);
  panel.addEventListener('change', onControl);

  /* ---- Inspector panel ---- */
  const togglePanelBtn = $('#pg-toggle-panel');
  function setPanel(open, returnFocus) {
    panel.hidden = !open;
    stage.toggleAttribute('data-panel-open', open);
    togglePanelBtn.setAttribute('aria-expanded', String(open));
    if (open) renderSpec();
    if (!open && returnFocus) togglePanelBtn.focus();
    schedule();
  }
  togglePanelBtn.addEventListener('click', () => setPanel(panel.hidden));
  $('#pg-panel-close').addEventListener('click', () => setPanel(false, true));
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setPanel(false, true);
    }
  });

  const tabBtns = $$('.pg-panel__tab');
  function setTab(id, focus) {
    view.tab = id;
    tabBtns.forEach((b) => {
      const on = b.dataset.pgTab === id;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
      $(`#pg-view-${b.dataset.pgTab}`).hidden = !on;
    });
    if (id === 'spec') renderSpec();
  }
  tabBtns.forEach((b, i) => {
    b.addEventListener('click', () => setTab(b.dataset.pgTab));
    b.addEventListener('keydown', (e) => {
      const n = tabBtns.length;
      const next = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      setTab(tabBtns[next].dataset.pgTab, true);
    });
  });

  // Optional convenience: drag the inspector by its header (wide screens only).
  const head = $('#pg-panel-head');
  const drag = { active: false, x: 0, y: 0, dx: 0, dy: 0, startX: 0, startY: 0 };
  head.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button') || !window.matchMedia('(min-width: 720px)').matches) return;
    drag.active = true;
    drag.startX = e.clientX - drag.dx;
    drag.startY = e.clientY - drag.dy;
    head.setPointerCapture(e.pointerId);
  });
  head.addEventListener('pointermove', (e) => {
    if (!drag.active) return;
    const s = stage.getBoundingClientRect();
    const p = panel.getBoundingClientRect();
    const base = { left: p.left - drag.dx, top: p.top - drag.dy };
    drag.dx = Math.min(s.right - base.left - p.width, Math.max(s.left - base.left, e.clientX - drag.startX));
    drag.dy = Math.min(s.bottom - base.top - p.height, Math.max(s.top - base.top, e.clientY - drag.startY));
    panel.style.transform = `translate(${drag.dx}px, ${drag.dy}px)`;
  });
  const endDrag = () => { drag.active = false; };
  head.addEventListener('pointerup', endDrag);
  head.addEventListener('pointercancel', endDrag);

  /* ---- Spec ---- */
  function renderSpec() {
    const box = $('#pg-spec');
    const el = $(recipe().target, mount);
    if (!el) {
      box.innerHTML = '';
      return;
    }
    const cs = getComputedStyle(el);
    const px = (v) => String(Math.round(parseFloat(v) * 100) / 100);
    const rows = [
      ['Size', `${el.offsetWidth} × ${el.offsetHeight}`],
      ['Padding', `${px(cs.paddingTop)} ${px(cs.paddingRight)} ${px(cs.paddingBottom)} ${px(cs.paddingLeft)}`],
      ['Radius', `${cs.borderTopLeftRadius}`],
      ['Font', `${cs.fontFamily.split(',')[0].replace(/["']/g, '')} ${px(cs.fontSize)} / ${cs.fontWeight}`],
      ['Text', cs.color],
      ['Fill', cs.backgroundColor]
    ];
    box.innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
  }

  /* ---- Measure overlay: redlines read from the live DOM ---- */
  let frame = 0;
  function schedule() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      drawMeasure();
      if (view.tab === 'spec' && !panel.hidden) renderSpec();
    });
  }
  function drawMeasure() {
    measure.hidden = !view.measuring;
    if (!view.measuring) return;
    const el = $(recipe().target, mount);
    if (!el || !stage.clientWidth) {
      measure.innerHTML = '';
      return;
    }
    const s = stage.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const left = r.left - s.left;
    const top = r.top - s.top;
    const pl = parseFloat(cs.paddingLeft) || 0;
    const pr = parseFloat(cs.paddingRight) || 0;
    const pt = parseFloat(cs.paddingTop) || 0;
    const pb = parseFloat(cs.paddingBottom) || 0;
    const radius = Math.round(parseFloat(cs.borderTopLeftRadius) || 0);
    const box = (cls, x, y, w, h, text = '') => `<div class="${cls}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${text ? `<span>${text}</span>` : ''}</div>`;
    measure.innerHTML = [
      box('pg-measure__box', left, top, r.width, r.height),
      pl ? box('pg-measure__pad', left, top, pl, r.height, Math.round(pl)) : '',
      pr ? box('pg-measure__pad', r.right - s.left - pr, top, pr, r.height, Math.round(pr)) : '',
      pt ? box('pg-measure__pad pg-measure__pad--y', left, top, r.width, pt, Math.round(pt)) : '',
      pb ? box('pg-measure__pad pg-measure__pad--y', left, r.bottom - s.top - pb, r.width, pb, Math.round(pb)) : '',
      box('pg-measure__w', left, top - 22, r.width, 10, el.offsetWidth),
      // Keep the tags on screen when the component fills the stage width (phones).
      box('pg-measure__h', Math.max(16, left - 22), top, 10, r.height, el.offsetHeight),
      `<div class="pg-measure__r" style="left:${Math.min(r.right - s.left + 10, s.width - 64)}px;top:${top - 28}px">r ${radius}</div>`
    ].join('');
  }
  $('#pg-toggle-measure').addEventListener('click', (e) => {
    view.measuring = !view.measuring;
    e.currentTarget.setAttribute('aria-pressed', String(view.measuring));
    drawMeasure();
  });
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(schedule);
    ro.observe(stage);
    ro.observe(mount);
  }
  scene.addEventListener('transitionend', schedule);
  scene.addEventListener('scroll', schedule, { passive: true });
  mount.addEventListener('animationend', (e) => {
    if (e.target === mount) mount.classList.remove('is-entering');
    schedule();
  });
  new MutationObserver(schedule).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* ---- Events log ---- */
  const eventsEl = $('#pg-events');
  function log(type, detail) {
    const t = new Date();
    const stamp = [t.getHours(), t.getMinutes(), t.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':');
    const li = document.createElement('li');
    li.innerHTML = `<time>${stamp}</time><b>${esc(type)}</b><span>${esc(detail)}</span>`;
    eventsEl.prepend(li);
    while (eventsEl.children.length > 60) eventsEl.lastElementChild.remove();
  }
  const describe = (el) => {
    const cls = typeof el.className === 'string' ? el.className.split(/\s+/).find((c) => c.startsWith('as-')) : '';
    return `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`;
  };
  ['click', 'change', 'focusin', 'toggle', 'close'].forEach((type) => {
    mount.addEventListener(type, (e) => log(type, describe(e.target)), true);
  });
  mount.addEventListener('input', (e) => {
    const t = e.target;
    if (t.matches('input[type="range"].as-slider')) {
      const value = t.closest('.as-slider-field')?.querySelector('.as-slider-field__value');
      if (value) value.textContent = `${t.value}%`;
    }
    log('input', `${describe(t)} = ${t.value}`);
    schedule();
  });
  $('#pg-events-clear').addEventListener('click', () => { eventsEl.textContent = ''; });

  /* ---- Dismissed alert: offer a way back ---- */
  new MutationObserver(() => {
    if (restoreBtn || mount.childElementCount) return;
    restoreBtn = document.createElement('button');
    restoreBtn.type = 'button';
    restoreBtn.className = 'as-button as-button--secondary';
    restoreBtn.innerHTML = '<span class="as-button__label">Restore component</span>';
    restoreBtn.addEventListener('click', () => {
      renderMount();
      mount.querySelector('button')?.focus();
    });
    mount.appendChild(restoreBtn);
    schedule();
  }).observe(mount, { childList: true });

  /* ---- Navigation ---- */
  $('#pg-prev').addEventListener('click', () => selectComponent(view.index - 1, 'back'));
  $('#pg-next').addEventListener('click', () => selectComponent(view.index + 1, 'forward'));
  $('#pg-open-picker').addEventListener('click', () => picker.showModal());
  $('#pg-picker-close').addEventListener('click', () => picker.close());
  picker.addEventListener('click', (e) => {
    if (e.target === picker) {
      picker.close();
      return;
    }
    const btn = e.target.closest('[data-pg-comp]');
    if (!btn) return;
    if (picker.open) picker.close();
    const next = RECIPES.findIndex((r) => r.slug === btn.dataset.pgComp);
    selectComponent(next, next < view.index ? 'back' : 'forward');
  });
  document.addEventListener('keydown', (e) => {
    if (!stage.clientWidth || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    if (e.altKey || e.ctrlKey || e.metaKey || picker.open) return;
    const t = e.target;
    if (t.closest && t.closest('input, select, textarea, dialog, [role="tab"], [role="menu"], .pg-stage__mount, .palette')) return;
    e.preventDefault();
    if (e.key === 'ArrowLeft') selectComponent(view.index - 1, 'back');
    else selectComponent(view.index + 1, 'forward');
  });

  /* ---- Cursor spotlight on the dot field ---- */
  if (window.matchMedia('(pointer: fine)').matches && !reduced()) {
    stage.addEventListener('pointermove', (e) => {
      const s = stage.getBoundingClientRect();
      stage.style.setProperty('--pg-mx', `${e.clientX - s.left}px`);
      stage.style.setProperty('--pg-my', `${e.clientY - s.top}px`);
    }, { passive: true });
  }

  /* ---- Sparkle burst, in the shape of the Aster mark ---- */
  const SPARKLE_TONES = ['text-default', 'status-active-text', 'status-focus-text', 'status-warning-text'];
  function burst(x, y) {
    const s = stage.getBoundingClientRect();
    for (let i = 0; i < 12; i += 1) {
      const star = document.createElement('span');
      star.className = 'pg-sparkle';
      star.setAttribute('aria-hidden', 'true');
      star.innerHTML = sprite('i-star', 10 + (i % 3) * 5);
      star.style.left = `${x - s.left}px`;
      star.style.top = `${y - s.top}px`;
      star.style.color = `var(--as-semantic-color-${SPARKLE_TONES[i % SPARKLE_TONES.length]})`;
      stage.appendChild(star);
      const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 56 + Math.random() * 72;
      star.animate(
        [
          { transform: 'translate(-50%, -50%) scale(0.4)', opacity: 1 },
          { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) rotate(${90 + Math.random() * 120}deg) scale(1)`, opacity: 0 }
        ],
        { duration: 620 + Math.random() * 240, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      ).onfinish = () => star.remove();
    }
  }
  mount.addEventListener('click', (e) => {
    // The entry transform would confine a position: fixed drawer opened mid-animation.
    mount.classList.remove('is-entering');
    const btn = e.target.closest('.as-button');
    if (!btn || !view.sparkle || reduced() || btn.disabled || btn.getAttribute('aria-disabled') === 'true') return;
    const r = btn.getBoundingClientRect();
    burst(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2);
  });

  selectComponent(0);
  eventsEl.textContent = '';
  return { refresh: schedule };
}
