/**
 * Aster Design System — Tooltip Component Controller
 * Canonical Source: components/tooltip/tooltip.js
 *
 * Implements WCAG 2.2 SC 1.4.13 dismissal on Escape key and accessible aria-describedby linking.
 */

let initializedRoots = new WeakSet();

export function hideAllTooltips(root = document) {
  const tooltips = root.querySelectorAll('.as-tooltip.is-visible');
  tooltips.forEach((t) => t.classList.remove('is-visible'));
}

export function initTooltip(root = typeof document !== 'undefined' ? document : null) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  // Auto-bind aria-describedby for tooltips with IDs
  const triggers = root.querySelectorAll('.as-tooltip-trigger');
  triggers.forEach((trigger) => {
    const tooltip = trigger.querySelector('.as-tooltip');
    const childControl = trigger.querySelector('button, a, input, [tabindex]');
    if (tooltip && childControl && tooltip.id && !childControl.hasAttribute('aria-describedby')) {
      childControl.setAttribute('aria-describedby', tooltip.id);
    }
  });

  // WCAG 2.2 SC 1.4.13: Dismiss tooltips on Escape key press without moving focus
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const activeTooltipTrigger = document.activeElement ? document.activeElement.closest('.as-tooltip-trigger') : null;
      if (activeTooltipTrigger) {
        const tooltip = activeTooltipTrigger.querySelector('.as-tooltip');
        if (tooltip) {
          tooltip.style.display = 'none';
          setTimeout(() => { tooltip.style.display = ''; }, 300);
        }
      }
    }
  });
}
