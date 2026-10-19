/**
 * Aster Design System — Popover Component Controller
 * Canonical Source: components/popover/popover.js
 *
 * Implements anchored popover toggling, close button handling, outside-click light dismiss,
 * and Escape key dismissal with focus restoration.
 */

let initializedRoots = new WeakSet();

export function closeAllPopovers(root = document) {
  const openPopovers = root.querySelectorAll('.as-popover:not([hidden])');
  openPopovers.forEach((pop) => {
    pop.hidden = true;
    const anchor = pop.closest('.as-popover-anchor');
    if (anchor) {
      const trigger = anchor.querySelector('.as-popover-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
  });
}

export function openPopover(popoverEl) {
  const pop = typeof popoverEl === 'string' ? document.getElementById(popoverEl) : popoverEl;
  if (!pop) return;
  const anchor = pop.closest('.as-popover-anchor');
  const trigger = anchor ? anchor.querySelector('.as-popover-trigger') : null;

  closeAllPopovers(pop.ownerDocument || document);
  pop.hidden = false;
  if (trigger) trigger.setAttribute('aria-expanded', 'true');
}

export function closePopover(popoverEl) {
  const pop = typeof popoverEl === 'string' ? document.getElementById(popoverEl) : popoverEl;
  if (!pop) return;
  const anchor = pop.closest('.as-popover-anchor');
  const trigger = anchor ? anchor.querySelector('.as-popover-trigger') : null;

  pop.hidden = true;
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

export function initPopover(root = typeof document !== 'undefined' ? document : null) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  root.addEventListener('click', (event) => {
    const closeBtn = event.target.closest('.as-popover__close, [data-popover-close]');
    if (closeBtn) {
      const pop = closeBtn.closest('.as-popover');
      if (pop) {
        closePopover(pop);
        const anchor = pop.closest('.as-popover-anchor');
        const trigger = anchor ? anchor.querySelector('.as-popover-trigger') : null;
        if (trigger) trigger.focus();
      }
      return;
    }

    const trigger = event.target.closest('.as-popover-trigger');
    if (trigger) {
      const anchor = trigger.closest('.as-popover-anchor');
      if (!anchor) return;
      const popover = anchor.querySelector('.as-popover');
      if (!popover) return;

      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closePopover(popover);
      } else {
        openPopover(popover);
      }
      return;
    }

    // Inside popover clicks shouldn't close it automatically unless requested
    if (event.target.closest('.as-popover')) {
      return;
    }

    // Outside clicks light-dismiss all popovers
    closeAllPopovers(root);
  });

  // Escape key closes active popover
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const openPopovers = root.querySelectorAll('.as-popover:not([hidden])');
      openPopovers.forEach((pop) => {
        closePopover(pop);
        const anchor = pop.closest('.as-popover-anchor');
        const trigger = anchor ? anchor.querySelector('.as-popover-trigger') : null;
        if (trigger) trigger.focus();
      });
    }
  });
}
