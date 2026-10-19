/**
 * Aster Design System — Progress Component Controller
 * Canonical Source: components/progress/progress.js
 *
 * Implements accessible programmatic progress updates.
 */

let initializedRoots = new WeakSet();

export function setProgressValue(progressEl, value, max = 100) {
  if (!progressEl) return;
  const bar = progressEl.querySelector('.as-progress__bar') || progressEl;
  const clamped = Math.max(0, Math.min(max, value));
  const percent = max > 0 ? (clamped / max) * 100 : 0;

  bar.style.setProperty('--_progress', `${percent}%`);
  bar.style.width = `${percent}%`;
  progressEl.setAttribute('aria-valuenow', String(Math.round(percent)));

  const field = progressEl.closest('.as-progress-field');
  if (field) {
    const valText = field.querySelector('.as-progress-field__value');
    if (valText) {
      valText.textContent = `${Math.round(percent)}%`;
    }
  }
}

export function initProgress(root = typeof document !== 'undefined' ? document : null) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  // Sync initial progress bars
  const progressBars = root.querySelectorAll('.as-progress[aria-valuenow]');
  progressBars.forEach((p) => {
    const val = parseFloat(p.getAttribute('aria-valuenow') || 0);
    const max = parseFloat(p.getAttribute('aria-valuemax') || 100);
    setProgressValue(p, val, max);
  });
}
