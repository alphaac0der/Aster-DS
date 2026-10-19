/**
 * Aster Design System — Switch Component Controller
 * Canonical Source: components/switch/switch.js
 *
 * Implements accessible state synchronization for switch controls.
 */

let initializedRoots = new WeakSet();

export function initSwitch(root = typeof document !== 'undefined' ? document : null) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  // Ensure all switch inputs declare role="switch" for screen reader recognition
  const switches = root.querySelectorAll('input.as-switch-input:not([role="switch"])');
  switches.forEach((sw) => {
    sw.setAttribute('role', 'switch');
  });
}
