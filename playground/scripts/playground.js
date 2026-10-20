/**
 * Aster Design System — Documentation & Interactive Playground Client Script (Phase 15)
 * Vanilla JavaScript, zero dependencies.
 * Features:
 *   - Hash router supporting `/` (Home), `#/playground` (Shade-DS-inspired live stage),
 *     audience hubs, foundations, and all 21 component pages.
 *   - 4-tab component showcase controller (Preview, Code, Prompt, Anatomy) with keyboard support.
 *   - Deterministic multi-category syntax highlighter (tags, attributes, strings, keywords,
 *     functions/tokens, numbers, comments) with line-number gutters.
 *   - Interactive Playground controller with live component stage, blueprint measurement
 *     overlays, real-time property controls, and synchronized code generation.
 */
import {
  initAsterComponents,
  setButtonLoading,
  setFieldValidation,
  validateInput,
  computeSelectionState,
  syncTableOverflow,
  showToast
} from '../../dist/js/aster.js';

(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const live = $('#global-live-region');
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function announce(msg) {
    if (!live) return;
    live.textContent = '';
    setTimeout(() => { live.textContent = msg; }, 40);
  }
  const esc = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Initialize canonical Aster component delegated behaviors
  initAsterComponents(document, {
    reducedMotion,
    onAnnounce: announce,
    onBlockedActivate: (btn) => {
      if (btn.getAttribute('aria-disabled') === 'true') {
        announce('This action is unavailable.');
      }
    }
  });

  /* ------------------------------------------------------------------------
     1. Theme Controller (Light & Dark — Standard Density Only)
     ------------------------------------------------------------------------ */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } }
  };

  $$('.seg').forEach((seg) => {
    seg.style.setProperty('--n', String($$('button', seg).length));
  });

  function setSeg(seg, index) {
    if (!seg) return;
    seg.style.setProperty('--i', String(index));
    $$('button', seg).forEach((b, i) => b.setAttribute('aria-pressed', String(i === index)));
  }

  function setTheme(theme, silent) {
    const isDark = theme === 'dark';
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    root.removeAttribute('data-density');
    setSeg($('#seg-theme'), isDark ? 1 : 0);
    const themeBtn = $('#theme-toggle-btn');
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      themeBtn.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }
    const pgThemeBtn = $('#pg-toggle-theme');
    if (pgThemeBtn) {
      pgThemeBtn.setAttribute('aria-pressed', String(isDark));
      pgThemeBtn.textContent = isDark ? 'Theme: Dark' : 'Theme: Light';
    }
    const favLink = $('#favicon-link');
    if (favLink) {
      favLink.setAttribute('href', isDark
        ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 376 382' fill='none'%3E%3Cpath d='M210.5 239C210.517 241.153 209.862 243.258 208.627 245.023C207.392 246.787 205.638 248.122 203.609 248.844L161.977 263.983L146.844 305.609C146.098 307.619 144.755 309.352 142.995 310.576C141.235 311.8 139.143 312.455 137 312.455C134.857 312.455 132.764 311.8 131.005 310.576C129.245 309.352 127.902 307.619 127.156 305.609L112.023 263.977L70.3906 248.844C68.3811 248.098 66.6481 246.755 65.4242 244.995C64.2004 243.235 63.5444 241.143 63.5444 239C63.5444 236.857 64.2004 234.764 65.4242 233.005C66.6481 231.245 68.3811 229.902 70.3906 229.156L112.023 214.023L127.156 172.391C127.902 170.381 129.245 168.648 131.005 167.424C132.764 166.2 134.857 165.544 137 165.544C139.143 165.544 141.235 166.2 142.995 167.424C144.755 168.648 146.098 170.381 146.844 172.391L161.983 214.023L203.609 229.156C205.638 229.878 207.392 231.213 208.627 232.977C209.862 234.742 210.517 236.847 210.5 239Z' fill='%23FFFFFF'/%3E%3Cpath d='M21 20H142C198 20.1667 354.5 53 354.5 198V361.5' stroke-width='40' stroke-linecap='round' stroke='%23FFFFFF'/%3E%3Cpath d='M65 110H137.564C171.147 110.1 265 129.81 265 216.852V315' stroke-width='40' stroke-linecap='round' stroke='%23FFFFFF'/%3E%3C/svg%3E"
        : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 376 382' fill='none'%3E%3Cpath d='M210.5 239C210.517 241.153 209.862 243.258 208.627 245.023C207.392 246.787 205.638 248.122 203.609 248.844L161.977 263.983L146.844 305.609C146.098 307.619 144.755 309.352 142.995 310.576C141.235 311.8 139.143 312.455 137 312.455C134.857 312.455 132.764 311.8 131.005 310.576C129.245 309.352 127.902 307.619 127.156 305.609L112.023 263.977L70.3906 248.844C68.3811 248.098 66.6481 246.755 65.4242 244.995C64.2004 243.235 63.5444 241.143 63.5444 239C63.5444 236.857 64.2004 234.764 65.4242 233.005C66.6481 231.245 68.3811 229.902 70.3906 229.156L112.023 214.023L127.156 172.391C127.902 170.381 129.245 168.648 131.005 167.424C132.764 166.2 134.857 165.544 137 165.544C139.143 165.544 141.235 166.2 142.995 167.424C144.755 168.648 146.098 170.381 146.844 172.391L161.983 214.023L203.609 229.156C205.638 229.878 207.392 231.213 208.627 232.977C209.862 234.742 210.517 236.847 210.5 239Z' fill='%23121212'/%3E%3Cpath d='M21 20H142C198 20.1667 354.5 53 354.5 198V361.5' stroke-width='40' stroke-linecap='round' stroke='%23121212'/%3E%3Cpath d='M65 110H137.564C171.147 110.1 265 129.81 265 216.852V315' stroke-width='40' stroke-linecap='round' stroke='%23121212'/%3E%3C/svg%3E"
      );
    }
    store.set('aster-theme', isDark ? 'dark' : 'light');
    refreshResolved();
    if (!silent) announce(`Theme: ${isDark ? 'Dark' : 'Light'}.`);
  }

  $('#theme-toggle-btn')?.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  $('#btn-theme-light')?.addEventListener('click', () => setTheme('light'));
  $('#btn-theme-dark')?.addEventListener('click', () => setTheme('dark'));

  const displayBtn = $('#display-btn');
  const displayPanel = $('#display-panel');
  function toggleDisplay(open) {
    if (!displayPanel || !displayBtn) return;
    displayPanel.hidden = !open;
    displayBtn.setAttribute('aria-expanded', String(open));
  }
  displayBtn?.addEventListener('click', () => toggleDisplay(displayPanel.hidden));
  document.addEventListener('click', (e) => {
    if (displayPanel && !displayPanel.hidden && !e.target.closest('.display-menu')) {
      toggleDisplay(false);
    }
  });

  /* ------------------------------------------------------------------------
     2. Router (Home at `/`, Separate `#/playground`, Docs, 21 Components)
     ------------------------------------------------------------------------ */
  const ROUTES = [
    'overview', 'playground', 'introduction', 'installation', 'designers', 'developers', 'agents',
    'colors', 'typography', 'spacing', 'elevation', 'themes-density', 'motion',
    'button', 'input', 'textarea', 'select', 'checkbox', 'radio', 'switch', 'slider',
    'table', 'badge', 'progress', 'skeleton',
    'alert', 'tooltip', 'toast', 'dialog', 'drawer', 'popover', 'dropdown',
    'tabs', 'accordion'
  ];
  const views = $$('.doc-view');
  let currentRoute = null;

  views.forEach((v) => {
    const r = v.id.replace('view-', '');
    $$('.doc-section[id]', v).forEach((s) => { s.id = `${r}--${s.id}`; });
  });

  function parseHash() {
    let h = location.hash.replace(/^#\/?/, '').split('?')[0].trim().toLowerCase();
    if (!h || h === 'home' || h === 'landing') return 'overview';
    if (h === 'docs' || h === 'getting-started' || h === 'intro' || h === 'about') return 'introduction';
    if (h === 'components') return 'accordion';
    if (h === 'foundations') return 'colors';
    if (h === 'for-designers') return 'designers';
    if (h === 'for-developers') return 'developers';
    if (h === 'for-agents') return 'agents';
    return ROUTES.includes(h) ? h : 'overview';
  }

  function show(route, opts = {}) {
    currentRoute = route;
    views.forEach((v) => {
      if (v.id === `view-${route}`) v.setAttribute('data-active', '');
      else v.removeAttribute('data-active');
    });
    const view = $(`#view-${route}`);
    if (!view) return;
    document.body.setAttribute('data-kind', view.dataset.kind || 'docs');
    $$('.nav-link').forEach((a) => {
      if (a.dataset.route === route) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    $$('.top-nav a').forEach((a) => {
      const sec = a.dataset.navSection;
      let match = false;
      if (sec === 'overview' && view.dataset.section === 'overview') match = true;
      else if (sec === 'playground' && view.dataset.section === 'playground') match = true;
      else if (sec === 'components' && view.dataset.section === 'components') match = true;
      else if (sec === 'docs' && ['docs', 'getting-started', 'foundations', 'designers', 'developers', 'agents'].includes(view.dataset.section)) match = true;
      if (match) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    document.title = route === 'overview'
      ? 'Aster Design System'
      : `${view.dataset.title} \u00b7 Aster Design System`;
    closeNav();
    buildToc();
    if (route === 'colors') renderColors();
    if (route === 'playground') syncPlaygroundStage();
    if (opts.scroll !== false) window.scrollTo({ top: 0, behavior: 'auto' });
    if (opts.focus) {
      const h1 = $('h1', view);
      if (h1) h1.focus({ preventScroll: true });
    }
    if (opts.announce) announce(`${view.dataset.title} page.`);
  }

  window.addEventListener('hashchange', () => {
    const r = parseHash();
    if (r !== currentRoute) show(r, { focus: true, announce: true });
  });

  /* ------------------------------------------------------------------------
     3. Mobile Navigation Drawer
     ------------------------------------------------------------------------ */
  const menuBtn = $('#menu-btn');
  function openNav() {
    document.body.setAttribute('data-nav-open', '');
    menuBtn?.setAttribute('aria-expanded', 'true');
  }
  function closeNav() {
    document.body.removeAttribute('data-nav-open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  }
  menuBtn?.addEventListener('click', () => (document.body.hasAttribute('data-nav-open') ? closeNav() : openNav()));
  $('#scrim')?.addEventListener('click', closeNav);
  $('#sidebar')?.addEventListener('click', (e) => {
    if (e.target.closest('.nav-link')) closeNav();
  });

  /* ------------------------------------------------------------------------
     4. On-This-Page (TOC) with Scroll Spy
     ------------------------------------------------------------------------ */
  let spy = null;
  function buildToc() {
    const view = $('.doc-view[data-active]');
    const links = $('#toc-links');
    if (!view || !links) return;
    if (spy) spy.disconnect();
    links.textContent = '';
    const heads = $$('.doc-section', view)
      .filter((s) => !s.closest('[hidden]'))
      .map((s) => $('h2', s))
      .filter(Boolean);
    const map = new Map();
    heads.forEach((h) => {
      const a = document.createElement('a');
      a.href = `#/${currentRoute}`;
      a.textContent = h.textContent;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        h.closest('.doc-section').scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
      });
      links.appendChild(a);
      map.set(h, a);
    });
    if (!('IntersectionObserver' in window) || !heads.length) return;
    spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          map.forEach((a) => a.removeAttribute('aria-current'));
          map.get(en.target)?.setAttribute('aria-current', 'location');
        }
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    heads.forEach((h) => spy.observe(h));
  }

  /* ------------------------------------------------------------------------
     5. Live Token Resolution (Swatches & Contrast Table)
     ------------------------------------------------------------------------ */
  function tokenValue(name) {
    return getComputedStyle(root).getPropertyValue(name).trim();
  }
  function colorToRgb(token) {
    const probe = document.createElement('span');
    probe.style.color = `var(${token})`;
    probe.style.display = 'none';
    document.body.appendChild(probe);
    const c = getComputedStyle(probe).color;
    probe.remove();
    const m = c.match(/[\d.]+/g);
    return m ? m.slice(0, 3).map(Number) : [0, 0, 0];
  }
  const toHex = (rgb) => '#' + rgb.map((n) => Math.round(n).toString(16).padStart(2, '0')).join('');
  function luminance([r, g, b]) {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }
  function ratio(a, b) {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  }

  function refreshResolved() {
    $$('tr[data-token]').forEach((tr) => {
      const cell = $('.resolved', tr);
      if (!cell) return;
      const v = tokenValue(tr.dataset.token) || '(unset)';
      cell.textContent = '';
      if (/^(#|rgb)/i.test(v)) {
        const sw = document.createElement('i');
        sw.style.background = v;
        cell.appendChild(sw);
      }
      cell.appendChild(document.createTextNode(v));
    });
    if (currentRoute === 'colors') renderColors();
  }

  const NEUTRALS = [
    ['Canvas (Base Surface 1)', '--as-semantic-color-surface-canvas'],
    ['Card (Base Surface 2)', '--as-semantic-color-surface-card'],
    ['Subtle (Base Surface 3)', '--as-semantic-color-surface-subtle'],
    ['Muted Surface', '--as-semantic-color-surface-muted'],
    ['Content 1 (Default)', '--as-semantic-color-text-default'],
    ['Content 2 (Muted)', '--as-semantic-color-text-muted'],
    ['Border Subtle', '--as-semantic-color-border-subtle'],
    ['Border Strong (Content 3)', '--as-semantic-color-border-strong']
  ];
  const ACCENT = [
    ['Primary Fill (Accent Surface 1)', '--as-semantic-color-interactive-primary'],
    ['Primary Hover (Accent Surface 2)', '--as-semantic-color-interactive-primary-hover'],
    ['Primary Text (Accent Content 1)', '--as-semantic-color-interactive-primary-text'],
    ['Focus Ring', '--as-semantic-color-border-focus']
  ];
  const STATUS_SWATCHES = [
    ['Success Surface', '--as-semantic-color-surface-success'],
    ['Success Content', '--as-semantic-color-status-success-text'],
    ['Warning Surface', '--as-semantic-color-surface-warning'],
    ['Warning Content', '--as-semantic-color-status-warning-text'],
    ['Critical Surface', '--as-semantic-color-surface-critical'],
    ['Critical Content (Red Dot)', '--as-semantic-color-status-critical-text'],
    ['Focus Surface', '--as-semantic-color-surface-focus'],
    ['Focus Content', '--as-semantic-color-status-focus-text'],
    ['Active Layout Surface', '--as-semantic-color-surface-active'],
    ['Active Layout Content', '--as-semantic-color-status-active-text']
  ];
  const PAIRS = [
    ['Default text on canvas', '--as-semantic-color-text-default', '--as-semantic-color-surface-canvas', 4.5],
    ['Muted text on card', '--as-semantic-color-text-muted', '--as-semantic-color-surface-card', 4.5],
    ['Muted text on canvas', '--as-semantic-color-text-muted', '--as-semantic-color-surface-canvas', 4.5],
    ['Text on primary fill', '--as-semantic-color-interactive-primary-text', '--as-semantic-color-interactive-primary', 4.5],
    ['Primary fill on canvas', '--as-semantic-color-interactive-primary', '--as-semantic-color-surface-canvas', 3],
    ['Focus ring on canvas', '--as-semantic-color-border-focus', '--as-semantic-color-surface-canvas', 3],
    ['Control border on card', '--as-semantic-color-border-strong', '--as-semantic-color-surface-card', 3],
    ['Success text on success surface', '--as-semantic-color-status-success-text', '--as-semantic-color-surface-success', 4.5],
    ['Warning text on warning surface', '--as-semantic-color-status-warning-text', '--as-semantic-color-surface-warning', 4.5],
    ['Critical text on critical surface', '--as-semantic-color-status-critical-text', '--as-semantic-color-surface-critical', 4.5],
    ['Focus text on focus surface', '--as-semantic-color-status-focus-text', '--as-semantic-color-surface-focus', 4.5],
    ['Active text on active surface', '--as-semantic-color-status-active-text', '--as-semantic-color-surface-active', 4.5]
  ];
  function swatches(host, list) {
    if (!host) return;
    host.textContent = '';
    list.forEach(([name, token]) => {
      const el = document.createElement('div');
      el.className = 'swatch';
      el.innerHTML = `<div class="swatch__chip" style="background:var(${token})"></div><div class="swatch__meta"><strong>${esc(name)}</strong><code>${toHex(colorToRgb(token))}</code></div>`;
      host.appendChild(el);
    });
  }
  function renderColors() {
    swatches($('#swatches-neutral'), NEUTRALS);
    swatches($('#swatches-accent'), ACCENT);
    swatches($('#swatches-status'), STATUS_SWATCHES);
    const body = $('#contrast-table tbody');
    if (!body) return;
    body.textContent = '';
    PAIRS.forEach(([label, fg, bg, need]) => {
      const a = colorToRgb(fg), b = colorToRgb(bg);
      const r = ratio(a, b);
      const ok = r >= need;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${esc(label)}</td><td class="resolved">${toHex(a)}</td><td class="resolved">${toHex(b)}</td><td class="resolved">${r.toFixed(2)}:1</td><td class="resolved">${need}:1</td><td><span class="meta-tag ${ok ? 'meta-tag--success' : ''}">${ok ? 'Pass' : 'Fail'}</span></td>`;
      body.appendChild(tr);
    });
  }

  /* ------------------------------------------------------------------------
     6. Deterministic Multi-Category Syntax Highlighter & Line Numbers
     ------------------------------------------------------------------------ */
  const MASTER_TOKEN_RE = /(&lt;!--[\s\S]*?--&gt;|\/\*[\s\S]*?\*\/|\/\/[^\n]*|^\s*#[^\n]*)|(&lt;\/?[a-zA-Z][\w:-]*|\/?&gt;)|(\b[a-zA-Z_:][\w:.-]*(?=\s*=))|("[^"]*"|'[^']*'|`[^`]*`)|(\b(?:import|from|export|const|let|var|function|return|async|await|if|else|new|true|false|null|undefined|document|window)\b)|(--as-[\w-]+|\b(?:initAsterComponents|setButtonLoading|setFieldValidation|validateInput|computeSelectionState|syncTableOverflow|showToast|addEventListener|getElementById|querySelector)\b)|(\b\d+(?:\.\d+)?(?:px|rem|ms|s|%)?\b)/gm;

  function highlightCode(rawText) {
    const escaped = esc(rawText);
    return escaped.replace(MASTER_TOKEN_RE, (match, com, tag, attr, str, kw, fn, num) => {
      if (com) return `<span class="tok-com">${com}</span>`;
      if (tag) return `<span class="tok-tag">${tag}</span>`;
      if (attr) return `<span class="tok-attr">${attr}</span>`;
      if (str) return `<span class="tok-str">${str}</span>`;
      if (kw) return `<span class="tok-kw">${kw}</span>`;
      if (fn) return `<span class="tok-fn">${fn}</span>`;
      if (num) return `<span class="tok-num">${num}</span>`;
      return match;
    });
  }

  function enhanceCodeBlocks(scope = document) {
    $$('.code-block', scope).forEach((block) => {
      const codeEl = $('code', block);
      if (!codeEl || codeEl.dataset.highlighted === 'true') return;
      const raw = codeEl.textContent.trim();
      codeEl.dataset.raw = raw;
      codeEl.innerHTML = highlightCode(raw);
      codeEl.dataset.highlighted = 'true';

      const pre = codeEl.closest('pre');
      if (pre && !pre.parentElement.classList.contains('code-editor-body')) {
        const linesCount = raw.split('\n').length;
        const wrapper = document.createElement('div');
        wrapper.className = 'code-editor-body';
        const gutter = document.createElement('div');
        gutter.className = 'code-gutter';
        gutter.setAttribute('aria-hidden', 'true');
        gutter.innerHTML = Array.from({ length: linesCount }, (_, i) => `<span>${i + 1}</span>`).join('');
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(gutter);
        wrapper.appendChild(pre);
      }
    });
  }
  enhanceCodeBlocks(document);

  /* ------------------------------------------------------------------------
     7. Component Showcase 4-Tab Controller (Preview, Code, Prompt, Anatomy)
     ------------------------------------------------------------------------ */
  function activatePreviewTab(tab, focus = false) {
    const header = tab.closest('.preview-card__header');
    if (!header) return;
    const card = header.closest('.preview-card');
    if (!card) return;
    const tabs = $$('.preview-tab', header);
    const mode = tab.dataset.tab; // 'preview' | 'code' | 'prompt' | 'anatomy'
    tabs.forEach((t) => {
      const active = t === tab;
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
    });
    const canvas = $('.preview-canvas', card);
    const code = $('.preview-code', card);
    const prompt = $('.preview-prompt', card);
    const anatomy = $('.preview-anatomy', card);
    if (canvas) canvas.hidden = mode !== 'preview';
    if (code) code.hidden = mode !== 'code';
    if (prompt) prompt.hidden = mode !== 'prompt';
    if (anatomy) anatomy.hidden = mode !== 'anatomy';
    if (focus) tab.focus();
    announce(`${tab.textContent.trim()} tab active.`);
  }

  document.addEventListener('click', (e) => {
    const tab = e.target.closest('.preview-tab');
    if (!tab) return;
    activatePreviewTab(tab, false);
  });

  document.addEventListener('keydown', (e) => {
    const tab = e.target.closest('.preview-tab');
    if (!tab) return;
    const header = tab.closest('.preview-card__header');
    if (!header) return;
    const tabs = $$('.preview-tab', header);
    const idx = tabs.indexOf(tab);
    if (idx === -1) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      activatePreviewTab(tabs[(idx + 1) % tabs.length], true);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      activatePreviewTab(tabs[(idx - 1 + tabs.length) % tabs.length], true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      activatePreviewTab(tabs[0], true);
    } else if (e.key === 'End') {
      e.preventDefault();
      activatePreviewTab(tabs[tabs.length - 1], true);
    }
  });

  /* ------------------------------------------------------------------------
     8. Copy Code & Copy Prompt Buttons
     ------------------------------------------------------------------------ */
  async function copyTextToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return;
      }
    } catch { /* fallback */ }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch { /* ignore */ }
    ta.remove();
  }

  document.addEventListener('click', async (e) => {
    const codeBtn = e.target.closest('.copy-btn');
    if (codeBtn) {
      const block = codeBtn.closest('.code-block');
      const codeEl = $('code', block) || $('pre', block);
      if (!codeEl) return;
      const text = (codeEl.dataset.raw || codeEl.textContent).trim();
      await copyTextToClipboard(text);
      const orig = codeBtn.dataset.origLabel || codeBtn.textContent;
      codeBtn.dataset.origLabel = orig;
      codeBtn.textContent = 'Copied!';
      codeBtn.classList.add('is-copied');
      announce('Code copied to clipboard.');
      setTimeout(() => {
        codeBtn.textContent = orig;
        codeBtn.classList.remove('is-copied');
      }, 1800);
      return;
    }

    const promptBtn = e.target.closest('.copy-prompt-btn');
    if (promptBtn) {
      const panel = promptBtn.closest('.prompt-panel');
      const pre = $('.prompt-panel__pre', panel);
      if (!pre) return;
      const text = pre.textContent.trim();
      await copyTextToClipboard(text);
      const orig = promptBtn.dataset.origLabel || promptBtn.textContent;
      promptBtn.dataset.origLabel = orig;
      promptBtn.textContent = 'Copied Prompt!';
      promptBtn.classList.add('is-copied');
      announce('AI Agent prompt copied to clipboard.');
      setTimeout(() => {
        promptBtn.textContent = orig;
        promptBtn.classList.remove('is-copied');
      }, 1800);
    }
  });

  /* ------------------------------------------------------------------------
     9. Button State Matrix & Interactive Demos
     ------------------------------------------------------------------------ */
  const BTN_VARIANTS = ['primary', 'secondary', 'destructive', 'ghost'];
  const BTN_STATES = [
    ['default', ''],
    ['hover', 'is-hover'],
    ['pressed', 'is-pressed'],
    ['focus', 'is-focus'],
    ['loading', ''],
    ['disabled', '']
  ];
  (function buildButtonMatrix() {
    const body = $('[data-matrix="button"] tbody');
    if (!body) return;
    BTN_VARIANTS.forEach((v) => {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = v[0].toUpperCase() + v.slice(1);
      tr.appendChild(th);
      BTN_STATES.forEach(([state, cls]) => {
        const td = document.createElement('td');
        const b = document.createElement('button');
        b.type = 'button';
        b.className = `as-button as-button--${v} ${cls}`.trim();
        if (state === 'loading') {
          b.setAttribute('aria-busy', 'true');
          b.innerHTML = '<span class="as-spinner" aria-hidden="true"></span><span class="as-button__label">Saving</span>';
        } else {
          b.innerHTML = '<span class="as-button__label">Button</span>';
        }
        if (state === 'disabled') b.disabled = true;
        if (cls) b.tabIndex = -1;
        td.appendChild(b);
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
  })();

  document.addEventListener('click', (e) => {
    const sim = e.target.closest('[data-sim-save]');
    if (!sim) return;
    if (sim.getAttribute('aria-busy') === 'true') return;
    const label = $('.as-button__label', sim);
    const original = label ? label.textContent : sim.textContent;
    setButtonLoading(sim, true, 'Saving');
    announce('Saving.');
    setTimeout(() => {
      setButtonLoading(sim, false);
      if (label) label.textContent = original;
      announce('Saved.');
    }, 1600);
  });

  const ariaTarget = $('#aria-target');
  const ariaToggle = $('#aria-toggle');
  if (ariaTarget && ariaToggle) {
    ariaTarget.addEventListener('click', () => announce('Action performed.'));
    ariaToggle.addEventListener('click', () => {
      const disabled = ariaTarget.getAttribute('aria-disabled') === 'true';
      const label = $('.as-button__label', ariaTarget);
      const toggleLabel = $('.as-button__label', ariaToggle) || ariaToggle;
      if (disabled) {
        ariaTarget.removeAttribute('aria-disabled');
        if (label) label.textContent = 'Publish';
        toggleLabel.textContent = 'Disable it';
        announce('Publish button enabled.');
      } else {
        ariaTarget.setAttribute('aria-disabled', 'true');
        if (label) label.textContent = 'Focus-retaining disabled';
        toggleLabel.textContent = 'Enable it';
        announce('Publish button disabled, still focusable.');
      }
    });
  }

  /* ------------------------------------------------------------------------
     10. Input Validation Presets & Slider Sync
     ------------------------------------------------------------------------ */
  const setWs = (v) => {
    const input = $('#in-ws');
    if (!input) return;
    input.value = v;
    validateInput(input, { onAnnounce: announce });
  };
  $('#fill-invalid')?.addEventListener('click', () => setWs('Acme Platform!'));
  $('#fill-valid')?.addEventListener('click', () => setWs('acme-platform'));

  $$('.as-slider').forEach((slider) => {
    const container = slider.closest('.as-slider-field') || slider.parentElement;
    const valEl = container ? $('.as-slider-field__value', container) || $('#home-card-slider-val') : null;
    if (valEl && slider.id === 'home-card-slider') valEl.textContent = `${slider.value}%`;
    else if (valEl) valEl.textContent = `${slider.value}%`;
    slider.style.setProperty('--_progress', `${slider.value}%`);
  });
  document.addEventListener('input', (e) => {
    const slider = e.target.closest('.as-slider');
    if (!slider) return;
    const container = slider.closest('.as-slider-field') || slider.parentElement;
    const valEl = container ? $('.as-slider-field__value', container) || $('#home-card-slider-val') : null;
    if (valEl) valEl.textContent = `${slider.value}%`;
    slider.style.setProperty('--_progress', `${slider.value}%`);
  });

  // Home Page Component Cards Interactive Logic
  const homeBtn = $('#home-card-btn');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      const label = homeBtn.querySelector('.as-button__label');
      if (label) {
        const orig = label.textContent;
        label.textContent = 'Active!';
        homeBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
          homeBtn.style.transform = '';
          label.textContent = orig;
        }, 800);
      }
    });
  }

  const homeProgField = $('#home-card-progress-field');
  const homeProgBar = $('#home-card-progress-bar');
  const homeProgVal = $('#home-card-progress-val');
  const homeProg = $('#home-card-progress');
  const progSteps = [25, 48, 68, 85, 100];
  let progIdx = 2;
  if (homeProgField && homeProgBar && homeProgVal) {
    homeProgField.addEventListener('click', () => {
      progIdx = (progIdx + 1) % progSteps.length;
      const nextVal = progSteps[progIdx];
      homeProgBar.style.width = `${nextVal}%`;
      homeProgVal.textContent = `${nextVal}%`;
      if (homeProg) homeProg.setAttribute('aria-valuenow', nextVal);
    });
  }

  const bHealthy = $('#home-badge-healthy');
  const bSync = $('#home-badge-sync');
  bHealthy?.addEventListener('click', () => {
    bHealthy.classList.toggle('as-badge--success');
    bHealthy.classList.toggle('as-badge--neutral');
  });
  bSync?.addEventListener('click', () => {
    bSync.classList.toggle('as-badge--warning');
    bSync.classList.toggle('as-badge--info');
  });

  /* ------------------------------------------------------------------------
     11. Data Table: Sort, Multi-Row Selection, Lifecycle States
     ------------------------------------------------------------------------ */
  const NODES = [
    { id: 'iad-01', node: 'iad-01', region: 'us-east-1', status: 'Active', latency: 1.24, cost: 142.5 },
    { id: 'sfo-04', node: 'sfo-04', region: 'us-west-2', status: 'Active', latency: 2.89, cost: 210 },
    { id: 'fra-09', node: 'fra-09', region: 'eu-central-1', status: 'Degraded', latency: 14.1, cost: 185.2 },
    { id: 'sin-02', node: 'sin-02', region: 'ap-southeast-1', status: 'Active', latency: 4.52, cost: 98.4 },
    { id: 'syd-03', node: 'syd-03', region: 'ap-southeast-2', status: 'Active', latency: 6.31, cost: 121.75 },
    { id: 'gru-05', node: 'gru-05', region: 'sa-east-1', status: 'Offline', latency: 38.7, cost: 76 },
    { id: 'lhr-02', node: 'lhr-02', region: 'eu-west-2', status: 'Active', latency: 3.07, cost: 167.3 }
  ];
  const BADGE = { Active: 'as-badge--active', Degraded: 'as-badge--pending', Offline: 'as-badge--error' };
  const tbl = { mode: 'ready', key: null, dir: 'ascending', selected: new Set() };
  const tbody = $('#tbl-body');
  const allBox = $('#tbl-all');
  const bulk = $('#tbl-bulk');
  const foot = $('#tbl-foot');
  const COLS = 6;

  function tableRows() {
    const rows = [...NODES];
    if (tbl.key) {
      const m = tbl.dir === 'ascending' ? 1 : -1;
      rows.sort((a, b) => (typeof a[tbl.key] === 'number' ? a[tbl.key] - b[tbl.key] : String(a[tbl.key]).localeCompare(String(b[tbl.key]))) * m);
    }
    return rows;
  }
  function stateRow(inner) {
    return `<tr><td class="as-table__state" colspan="${COLS}"><div class="as-table__state-content ${inner.cls || ''}">${inner.html}</div></td></tr>`;
  }
  function renderTable() {
    if (!tbody) return;
    const table = tbody.closest('table');
    const ready = tbl.mode === 'ready';
    table.setAttribute('aria-busy', String(tbl.mode === 'loading'));
    $$('.as-table__sort', table).forEach((b) => { b.disabled = !ready; });
    if (allBox) allBox.disabled = !ready;
    if (tbl.mode === 'loading') {
      tbody.innerHTML = Array.from({ length: 5 }, () => `<tr class="as-table__row" aria-hidden="true">${
        Array.from({ length: COLS }, (_, i) => `<td class="as-table__cell"><span class="as-skeleton" style="width:${i === 0 ? 18 : 40 + ((i * 17) % 40)}%;${i === 0 ? 'width:18px' : ''}"></span></td>`).join('')}</tr>`).join('');
    } else if (tbl.mode === 'empty') {
      tbody.innerHTML = stateRow({ html: '<svg class="as-table__state-icon" aria-hidden="true"><use href="#i-inbox"/></svg><strong>No nodes match</strong><span>Nothing is registered for this partition yet. Adjust your filters or add a node.</span><button type="button" class="as-button as-button--secondary" data-tbl-action="reset"><span class="as-button__label">Reset filters</span></button>' });
    } else if (tbl.mode === 'error') {
      tbody.innerHTML = stateRow({ cls: 'as-table__state-content--error', html: '<svg class="as-table__state-icon" aria-hidden="true" style="color:inherit"><use href="#i-plug"/></svg><strong>Could not reach telemetry</strong><span style="color:var(--as-semantic-color-text-muted)">Check your connection and try again. Your selection is kept.</span><button type="button" class="as-button as-button--secondary" data-tbl-action="retry"><span class="as-button__label">Retry</span></button>' });
    } else {
      tbody.innerHTML = tableRows().map((n) => {
        const sel = tbl.selected.has(n.id);
        return `<tr class="as-table__row"${sel ? ' data-selected' : ''}>
          <td class="as-table__cell as-table__cell--check"><label class="as-checkbox"><input type="checkbox" class="as-checkbox-input" data-id="${n.id}" aria-label="Select ${n.node}"${sel ? ' checked' : ''}></label></td>
          <th scope="row" class="as-table__cell as-table__cell--primary">${n.node}</th>
          <td class="as-table__cell">${n.region}</td>
          <td class="as-table__cell"><span class="as-badge ${BADGE[n.status]}">${n.status}</span></td>
          <td class="as-table__cell as-table__cell--num">${n.latency.toFixed(2)} ms</td>
          <td class="as-table__cell as-table__cell--num">$${n.cost.toFixed(2)}</td></tr>`;
      }).join('');
    }
    syncSelection(false);
  }
  function syncSelection(say) {
    if (!allBox || !bulk || !foot) return;
    const total = NODES.length, n = tbl.selected.size, ready = tbl.mode === 'ready';
    const state = computeSelectionState(n, total, ready);
    allBox.checked = state.checked;
    allBox.indeterminate = state.indeterminate;
    bulk.hidden = n === 0;
    bulk.textContent = `Restart ${n} selected`;
    foot.textContent = tbl.mode === 'loading' ? 'Loading nodes\u2026' : tbl.mode === 'empty' ? '0 rows' : tbl.mode === 'error' ? 'Failed to load' : `${n} of ${total} selected`;
    if (say) announce(`${n} of ${total} selected.`);
  }

  tbody?.addEventListener('change', (e) => {
    const box = e.target.closest('input[data-id]');
    if (!box) return;
    if (box.checked) tbl.selected.add(box.dataset.id); else tbl.selected.delete(box.dataset.id);
    box.closest('tr').toggleAttribute('data-selected', box.checked);
    syncSelection(true);
  });
  allBox?.addEventListener('change', () => {
    if (allBox.checked) NODES.forEach((n) => tbl.selected.add(n.id)); else tbl.selected.clear();
    $$('input[data-id]', tbody).forEach((b) => { b.checked = allBox.checked; b.closest('tr').toggleAttribute('data-selected', allBox.checked); });
    syncSelection(true);
  });
  bulk?.addEventListener('click', () => {
    const n = tbl.selected.size;
    tbl.selected.clear(); renderTable();
    announce(`Restart requested for ${n} nodes. Selection cleared.`);
  });

  $$('.as-table__sort, .as-table__sort-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sortKey;
      tbl.dir = tbl.key === key && tbl.dir === 'ascending' ? 'descending' : 'ascending';
      tbl.key = key;
      $$('.as-table__th[aria-sort]').forEach((th) => th.setAttribute('aria-sort', th.contains(btn) ? tbl.dir : 'none'));
      renderTable();
      announce(`Sorted by ${btn.textContent.trim()}, ${tbl.dir}.`);
    });
  });

  const segState = $('#seg-tbl-state');
  function setTableMode(mode) {
    if (!segState) return;
    tbl.mode = mode;
    const btns = $$('button', segState);
    const idx = btns.findIndex((b) => b.dataset.state === mode);
    segState.style.setProperty('--i', String(idx));
    btns.forEach((b, i) => b.setAttribute('aria-pressed', String(i === idx)));
    renderTable();
  }
  segState?.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-state]');
    if (!b) return;
    setTableMode(b.dataset.state);
    announce({ ready: 'Table loaded.', loading: 'Table is loading.', empty: 'Table is empty.', error: 'Table failed to load.' }[b.dataset.state]);
  });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-tbl-action]');
    if (!a) return;
    if (a.dataset.tblAction === 'reset') { setTableMode('ready'); announce('Filters reset. Table loaded.'); }
    if (a.dataset.tblAction === 'retry') {
      setTableMode('loading'); announce('Retrying.');
      setTimeout(() => { if (tbl.mode === 'loading') { setTableMode('ready'); announce('Table loaded.'); } }, 1200);
    }
  });
  renderTable();

  /* ------------------------------------------------------------------------
     12. Separate Interactive Playground Controller (`#/playground`)
     ------------------------------------------------------------------------ */
  const PG_STATE = {
    comp: 'button',
    variant: 'primary',
    label: 'Deploy Cluster',
    disabled: false,
    ariaDisabled: false,
    loading: false,
    showIcon: true,
    showBlueprint: true,
    surface: 'canvas'
  };

  const PG_RECIPES = {
    button: {
      title: 'Button',
      variants: ['primary', 'secondary', 'destructive', 'ghost'],
      defaultVariant: 'primary',
      defaultLabel: 'Deploy Cluster',
      blueprint: ['Height: 40px (--as-density-control-height)', 'Padding X: 24px (--as-space-6)', 'Padding Y: 8px', 'Radius: 9999px (--as-radius-full)', 'Font: Manrope 14px / 500'],
      render(st) {
        const iconHtml = st.showIcon
          ? '<svg class="as-icon" width="16" height="16" aria-hidden="true"><use href="#i-star"/></svg>'
          : '';
        const spinnerHtml = st.loading
          ? '<span class="as-spinner" aria-hidden="true"></span>'
          : iconHtml;
        const attrs = [
          'type="button"',
          `class="as-button as-button--${st.variant}"`,
          'id="pg-live-btn"',
          st.disabled ? 'disabled' : '',
          st.ariaDisabled ? 'aria-disabled="true"' : '',
          st.loading ? 'aria-busy="true"' : ''
        ].filter(Boolean).join(' ');
        return `<button ${attrs}>\n  ${spinnerHtml ? spinnerHtml + '\n  ' : ''}<span class="as-button__label">${esc(st.label || 'Button')}</span>\n</button>`;
      }
    },
    input: {
      title: 'Input & Field',
      variants: ['default', 'error'],
      defaultVariant: 'default',
      defaultLabel: 'Workspace Identifier',
      blueprint: ['Height: 44px (Exact Shade-DS)', 'Padding X: 12px (--as-space-3)', 'Radius: 4px (--as-radius-sm / Shade-DS Radius.S)', 'Surface: Canvas #121212 / Double 1px Glass Glow'],
      render(st) {
        const isErr = st.variant === 'error';
        return `<div class="as-form-field${isErr ? ' as-form-field--error' : ''}" style="width: 340px; margin: 0;">\n  <label class="as-form-field__label" for="pg-live-input">${esc(st.label || 'Workspace Identifier')}</label>\n  <div class="as-input-box">\n    <input class="as-input" type="text" id="pg-live-input" value="acme-production"${st.disabled ? ' disabled' : ''}${isErr ? ' aria-invalid="true"' : ''} />\n  </div>\n  <p class="as-form-field__helper">${isErr ? 'Invalid slug format.' : 'Lowercase letters, numbers, and hyphens.'}</p>\n</div>`;
      }
    },
    badge: {
      title: 'Badge',
      variants: ['success', 'warning', 'critical', 'info', 'muted'],
      defaultVariant: 'success',
      defaultLabel: 'Healthy Cluster',
      blueprint: ['Height: 24px', 'Padding X: 10px', 'Radius: 9999px (--as-radius-full)', 'Dot: 6px circle'],
      render(st) {
        return `<span class="as-badge as-badge--${st.variant}">\n  ${st.showIcon ? '<span class="as-badge__dot"></span>' : ''}${esc(st.label || 'Healthy')}\n</span>`;
      }
    },
    alert: {
      title: 'Alert',
      variants: ['warning', 'critical', 'success', 'info'],
      defaultVariant: 'warning',
      defaultLabel: 'Rolling Kernel Upgrade Scheduled',
      blueprint: ['Padding: 16px (--as-space-4)', 'Radius: 8px (--as-radius-md)', 'Close Control: 12px Shade-DS Solid Red Dot', 'Surface: Shade-DS Status Surface with Double 1px Glass Glow'],
      render(st) {
        return `<div class="as-alert as-alert--${st.variant}" role="region" aria-label="System Alert" style="width: min(100%, 480px);">\n  <div class="as-alert__content">\n    <div class="as-alert__title">${esc(st.label || 'System Notice')}</div>\n    <div class="as-alert__description">Worker nodes in eu-west-1a will rebalance automatically.</div>\n  </div>\n  <button type="button" class="as-alert__close" aria-label="Dismiss alert"></button>\n</div>`;
      }
    },
    switch: {
      title: 'Switch',
      variants: ['checked', 'unchecked'],
      defaultVariant: 'checked',
      defaultLabel: 'Automatic Failover Routing',
      blueprint: ['Track: 44px x 24px', 'Thumb: 18px circle', 'Radius: 9999px (--as-radius-full)'],
      render(st) {
        const checked = st.variant === 'checked' ? ' checked' : '';
        return `<label class="as-switch-field">\n  <span class="as-switch">\n    <input type="checkbox" role="switch" class="as-switch-input"${checked}${st.disabled ? ' disabled' : ''}>\n    <span class="as-switch-track"><span class="as-switch-thumb"></span></span>\n  </span>\n  <span class="as-switch-field__content">\n    <span class="as-switch-field__label">${esc(st.label || 'Automatic Failover')}</span>\n  </span>\n</label>`;
      }
    },
    dialog: {
      title: 'Dialog Modal',
      variants: ['primary', 'secondary'],
      defaultVariant: 'primary',
      defaultLabel: 'Open Interactive Dialog',
      blueprint: ['Max Width: 400px (Shade-DS)', 'Radius: 16px (--as-radius-lg)', 'Close Button: 12px Shade-DS Solid Red Dot', 'Surface: 20px blur with Double 1px Glass Glow'],
      render(st) {
        return `<button type="button" class="as-button as-button--${st.variant}" data-dialog-open="pg-showcase-dlg">\n  <span class="as-button__label">${esc(st.label || 'Open Interactive Dialog')}</span>\n</button>`;
      }
    }
  };

  function syncPlaygroundStage() {
    const mount = $('#pg-stage-mount');
    const bpBox = $('#pg-blueprint-overlay');
    const codeEl = $('#pg-live-code-el');
    const varSelect = $('#pg-ctrl-variant');
    const labelInput = $('#pg-ctrl-label');
    if (!mount || !codeEl) return;

    const recipe = PG_RECIPES[PG_STATE.comp] || PG_RECIPES.button;
    if (!recipe.variants.includes(PG_STATE.variant)) {
      PG_STATE.variant = recipe.defaultVariant;
    }
    if (varSelect) {
      varSelect.innerHTML = recipe.variants
        .map((v) => `<option value="${v}"${v === PG_STATE.variant ? ' selected' : ''}>${v}</option>`)
        .join('');
    }
    if (labelInput && document.activeElement !== labelInput) {
      labelInput.value = PG_STATE.label;
    }

    const htmlSnippet = recipe.render(PG_STATE);
    mount.innerHTML = htmlSnippet;

    if (bpBox) {
      bpBox.hidden = !PG_STATE.showBlueprint;
      bpBox.innerHTML = recipe.blueprint.map((b) => `<span class="anatomy-badge"><code>${esc(b)}</code></span>`).join('');
    }

    codeEl.dataset.raw = htmlSnippet;
    codeEl.innerHTML = highlightCode(htmlSnippet);
  }

  $$('.pg-dock__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const comp = btn.dataset.pgComp;
      if (!comp || !PG_RECIPES[comp]) return;
      PG_STATE.comp = comp;
      PG_STATE.variant = PG_RECIPES[comp].defaultVariant;
      PG_STATE.label = PG_RECIPES[comp].defaultLabel;
      PG_STATE.disabled = false;
      PG_STATE.ariaDisabled = false;
      PG_STATE.loading = false;
      const disBox = $('#pg-ctrl-disabled');
      const ariaBox = $('#pg-ctrl-aria-disabled');
      const loadBox = $('#pg-ctrl-loading');
      if (disBox) disBox.checked = false;
      if (ariaBox) ariaBox.checked = false;
      if (loadBox) loadBox.checked = false;
      $$('.pg-dock__btn').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      syncPlaygroundStage();
      announce(`Selected ${PG_RECIPES[comp].title} in playground.`);
    });
  });

  $('#pg-ctrl-variant')?.addEventListener('change', (e) => {
    PG_STATE.variant = e.target.value;
    syncPlaygroundStage();
  });
  $('#pg-ctrl-label')?.addEventListener('input', (e) => {
    PG_STATE.label = e.target.value;
    syncPlaygroundStage();
  });
  $('#pg-ctrl-disabled')?.addEventListener('change', (e) => {
    PG_STATE.disabled = e.target.checked;
    syncPlaygroundStage();
  });
  $('#pg-ctrl-aria-disabled')?.addEventListener('change', (e) => {
    PG_STATE.ariaDisabled = e.target.checked;
    syncPlaygroundStage();
  });
  $('#pg-ctrl-loading')?.addEventListener('change', (e) => {
    PG_STATE.loading = e.target.checked;
    syncPlaygroundStage();
  });
  $('#pg-ctrl-icon')?.addEventListener('change', (e) => {
    PG_STATE.showIcon = e.target.checked;
    syncPlaygroundStage();
  });
  $('#pg-toggle-blueprint')?.addEventListener('click', (e) => {
    PG_STATE.showBlueprint = !PG_STATE.showBlueprint;
    e.currentTarget.setAttribute('aria-pressed', String(PG_STATE.showBlueprint));
    syncPlaygroundStage();
  });
  $('#pg-toggle-surface')?.addEventListener('click', (e) => {
    PG_STATE.surface = PG_STATE.surface === 'canvas' ? 'subtle' : 'canvas';
    const canvas = $('#pg-stage-canvas');
    if (canvas) canvas.dataset.surface = PG_STATE.surface;
    e.currentTarget.setAttribute('aria-pressed', String(PG_STATE.surface === 'subtle'));
  });
  $('#pg-toggle-theme')?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });

  /* ------------------------------------------------------------------------
     13. Motion Page & Toast Triggers
     ------------------------------------------------------------------------ */
  $('#replay-enter')?.addEventListener('click', () => {
    const el = $('#enter-demo');
    if (!el) return;
    el.classList.remove('is-entering');
    void el.offsetWidth;
    el.classList.add('is-entering');
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-toast-trigger]');
    if (!btn) return;
    showToast({
      title: btn.dataset.toastTitle || 'Action Complete',
      message: btn.dataset.toastMessage || 'Operation synchronized across availability zones.',
      variant: btn.dataset.toastVariant || 'success'
    });
  });

  /* ------------------------------------------------------------------------
     14. Command Palette (`Ctrl+K` / `/`)
     ------------------------------------------------------------------------ */
  const dlg = $('#palette');
  const pInput = $('#palette-input');
  const pList = $('#palette-list');
  let entries = null, shown = [], active = 0;

  function buildIndex() {
    entries = [];
    views.forEach((v) => {
      const route = v.id.replace('view-', '');
      entries.push({ label: v.dataset.title, hint: 'Page', route });
      $$('.doc-section', v).forEach((s) => {
        const h = $('h2', s);
        if (!h) return;
        entries.push({ label: `${v.dataset.title}: ${h.textContent}`, hint: 'Section', route, el: s });
      });
    });
  }
  function renderPalette() {
    if (!pInput || !pList) return;
    const q = pInput.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    shown = entries.filter((en) => q.every((w) => en.label.toLowerCase().includes(w) || en.hint.toLowerCase().includes(w))).slice(0, 40);
    active = 0;
    if (!shown.length) {
      pList.innerHTML = '<li class="palette__empty" role="presentation">No results</li>';
      pInput.removeAttribute('aria-activedescendant');
      return;
    }
    pList.innerHTML = shown.map((en, i) => `<li role="option" id="pal-${i}" data-i="${i}" aria-selected="${i === 0}">${esc(en.label)}<small>${esc(en.hint)}</small></li>`).join('');
    pInput.setAttribute('aria-activedescendant', 'pal-0');
  }
  function setActive(i) {
    if (!shown.length || !pList || !pInput) return;
    active = (i + shown.length) % shown.length;
    $$('li[role="option"]', pList).forEach((li, k) => li.setAttribute('aria-selected', String(k === active)));
    const li = $(`#pal-${active}`);
    if (li) li.scrollIntoView({ block: 'nearest' });
    pInput.setAttribute('aria-activedescendant', `pal-${active}`);
  }
  function go(en) {
    if (!dlg) return;
    dlg.close();
    if (en.route !== currentRoute) {
      history.pushState(null, '', `#/${en.route}`);
      show(en.route, { focus: !en.el, announce: !en.el, scroll: !en.el });
    }
    if (en.el) {
      requestAnimationFrame(() => {
        en.el.scrollIntoView({ behavior: 'auto', block: 'center' });
        announce(`Opened ${en.label}.`);
      });
    }
  }
  function openPalette() {
    if (!dlg || !pInput) return;
    if (!entries) buildIndex();
    pInput.value = '';
    renderPalette();
    dlg.showModal();
    pInput.focus();
  }
  $('#search-trigger')?.addEventListener('click', openPalette);
  pInput?.addEventListener('input', renderPalette);
  pInput?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); if (shown[active]) go(shown[active]); }
  });
  pList?.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-i]');
    if (li) go(shown[Number(li.dataset.i)]);
  });
  dlg?.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (dlg) (dlg.open ? dlg.close() : openPalette());
      return;
    }
    if (e.key === '/' && dlg && !dlg.open && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '')) {
      e.preventDefault();
      openPalette();
      return;
    }
    if (e.key === 'Escape') {
      if (displayPanel && !displayPanel.hidden) { toggleDisplay(false); displayBtn?.focus(); }
      else if (document.body.hasAttribute('data-nav-open')) { closeNav(); menuBtn?.focus(); }
    }
  });

  /* ------------------------------------------------------------------------
     15. Boot
     ------------------------------------------------------------------------ */
  const params = new URLSearchParams(location.search);
  const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(params.get('theme') || store.get('aster-theme') || (sysDark ? 'dark' : 'light'), true);
  syncPlaygroundStage();
  show(parseHash(), { scroll: false });
  refreshResolved();
})();
