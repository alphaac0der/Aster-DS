/**
 * Aster Design System — Foundations pages
 *
 * Fills in token values from the browser, so the docs show what the current theme
 * really resolves to and cannot drift from dist/css/tokens.css.
 */
const rootValue = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

function parseColor(value) {
  const probe = document.createElement('span');
  probe.style.color = value;
  probe.style.display = 'none';
  document.body.appendChild(probe);
  const out = getComputedStyle(probe).color;
  probe.remove();
  const m = out.match(/[\d.]+/g);
  return m ? m.slice(0, 3).map(Number) : [0, 0, 0];
}
const toHex = (rgb) => `#${rgb.map((n) => Math.round(n).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
const luminance = (rgb) => {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

function refresh(root) {
  root.querySelectorAll('[data-resolve]').forEach((el) => {
    const value = rootValue(el.dataset.resolve);
    const rem = value.match(/^([\d.]+)rem$/);
    el.textContent = el.dataset.kind === 'color' ? toHex(parseColor(value)) : rem ? `${Number(rem[1]) * 16}px` : value;
  });
  root.querySelectorAll('[data-contrast-fg]').forEach((row) => {
    const ratio = contrast(parseColor(rootValue(row.dataset.contrastFg)), parseColor(rootValue(row.dataset.contrastBg)));
    const need = Number(row.dataset.contrastNeed);
    row.querySelector('[data-ratio]').textContent = `${ratio.toFixed(2)}:1`;
    row.querySelector('[data-result]').textContent = ratio >= need ? `Passes ${need}:1` : `Below ${need}:1`;
  });
}

function initMotion(root) {
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-motion-play]');
    if (!btn) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const status = root.querySelector('[data-motion-status]');
    if (status) status.textContent = reduced ? 'Your system asks for reduced motion, so the demos stay still.' : '';
    if (reduced) return;
    root.querySelectorAll('[data-motion-dot]').forEach((dot) => {
      const track = dot.parentElement.clientWidth - dot.offsetWidth;
      dot.animate(
        [{ transform: 'translateX(0)' }, { transform: `translateX(${track}px)` }],
        { duration: parseFloat(rootValue(dot.dataset.duration || '--as-motion-duration-reveal')), easing: dot.dataset.easing ? rootValue(dot.dataset.easing) : 'linear', fill: 'both' }
      );
    });
  });
}

export function initFoundations(root = document) {
  refresh(root);
  initMotion(root);
  new MutationObserver(() => refresh(root)).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
