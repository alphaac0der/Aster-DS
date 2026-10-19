/**
 * Aster Design System — Skeleton Component Controller
 * Canonical Source: components/skeleton/skeleton.js
 *
 * Implements accessible attribute enforcement for skeleton placeholders.
 */

let initializedRoots = new WeakSet();

export function initSkeleton(root = typeof document !== 'undefined' ? document : null) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  // Ensure skeletons declare aria-hidden="true" so screen readers ignore placeholder shapes
  const skeletons = root.querySelectorAll('.as-skeleton:not([aria-hidden])');
  skeletons.forEach((sk) => {
    sk.setAttribute('aria-hidden', 'true');
  });
}
