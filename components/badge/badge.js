/**
 * Aster Design System — Badge Component Controller
 * Canonical Source: components/badge/badge.js
 *
 * Provides badge utility methods and initialization if needed.
 */

let initializedRoots = new WeakSet();

export function initBadge(root = typeof document !== 'undefined' ? document : null) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  // Badges are largely presentational HTML/CSS components.
}
