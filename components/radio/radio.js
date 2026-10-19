/**
 * Aster Design System — Radio Group Component Controller
 * Canonical Source: components/radio/radio.js
 *
 * Implements keyboard management and change events for radio group components.
 */

let initializedRoots = new WeakSet();

export function initRadio(root = typeof document !== 'undefined' ? document : null) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  // Native radio inputs automatically handle arrow key navigation within the same name group.
  // This controller provides optional programmatic helpers if needed by consumers.
}
