/**
 * Aster Design System — Checkbox Component Controller
 * Canonical Source: components/checkbox/checkbox.js
 *
 * Provides programmatically synchronized indeterminate states and group controllers.
 */

let initializedRoots = new WeakSet();

export function setCheckboxIndeterminate(input, isIndeterminate = true) {
  if (!input) return;
  input.indeterminate = Boolean(isIndeterminate);
  if (isIndeterminate) {
    input.setAttribute('aria-checked', 'mixed');
  } else {
    input.removeAttribute('aria-checked');
  }
}

export function initCheckbox(root = typeof document !== 'undefined' ? document : null) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  // Sync data-indeterminate attribute to DOM indeterminate property on boot
  const indeterminateCheckboxes = root.querySelectorAll('input.as-checkbox-input[data-indeterminate="true"]');
  indeterminateCheckboxes.forEach((cb) => {
    setCheckboxIndeterminate(cb, true);
  });
}
