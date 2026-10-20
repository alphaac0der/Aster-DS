/**
 * Aster Design System — Select Component Controller
 * Canonical Source: components/select/select.js
 *
 * Implements accessible native select listeners and programmatic state synchronization.
 */

let initializedRoots = new WeakSet();

export function initSelect(root = typeof document !== 'undefined' ? document : null) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  // Sync open state and chevron rotation on focus/click/change/blur
  root.addEventListener('click', (event) => {
    const target = event.target;
    if (target && target.matches && target.matches('.as-select')) {
      const box = target.closest('.as-select-box');
      if (box && !target.disabled) {
        box.classList.toggle('is-open');
      }
    }
  });

  root.addEventListener('change', (event) => {
    const target = event.target;
    if (target && target.matches && target.matches('.as-select')) {
      const box = target.closest('.as-select-box');
      if (box) {
        box.classList.remove('is-open');
      }
    }
  });

  root.addEventListener('focusout', (event) => {
    const target = event.target;
    if (target && target.matches && target.matches('.as-select')) {
      const box = target.closest('.as-select-box');
      if (box) {
        box.classList.remove('is-open');
      }
    }
  });

  root.addEventListener('keydown', (event) => {
    const target = event.target;
    if (target && target.matches && target.matches('.as-select')) {
      if (event.key === 'Escape' || event.key === 'Enter') {
        const box = target.closest('.as-select-box');
        if (box) {
          box.classList.remove('is-open');
        }
      }
    }
  });
}
