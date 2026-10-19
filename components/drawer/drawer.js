/**
 * Aster Design System — Drawer Component Controller
 * Canonical Source: components/drawer/drawer.js
 *
 * Implements accessible slide-over drawer opening, focus trapping,
 * backdrop dismissal, and Escape key handling with focus restoration.
 */

let initializedRoots = new WeakSet();
let lastFocusedElement = null;

export function openDrawer(drawerOrId) {
  const drawer = typeof drawerOrId === 'string' ? document.getElementById(drawerOrId) : drawerOrId;
  if (!drawer) return;

  lastFocusedElement = document.activeElement;
  drawer.hidden = false;

  // Focus close button or first interactive element inside drawer
  const focusable = drawer.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length > 0) {
    focusable[0].focus();
  }
}

export function closeDrawer(drawerOrId) {
  const drawer = typeof drawerOrId === 'string' ? document.getElementById(drawerOrId) : drawerOrId;
  if (!drawer) return;

  drawer.hidden = true;
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

export function initDrawer(root = typeof document !== 'undefined' ? document : null) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  // Trigger clicks: data-drawer-open="id"
  root.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-drawer-open]');
    if (trigger) {
      const drawerId = trigger.getAttribute('data-drawer-open');
      openDrawer(drawerId);
      return;
    }

    const closeBtn = event.target.closest('[data-drawer-close]');
    if (closeBtn) {
      const drawer = closeBtn.closest('.as-drawer');
      if (drawer) {
        closeDrawer(drawer);
      }
    }
  });

  // Keyboard navigation & Focus trap
  root.addEventListener('keydown', (event) => {
    const openDrawers = Array.from(document.querySelectorAll('.as-drawer:not([hidden])'));
    if (openDrawers.length === 0) return;

    const activeDrawer = openDrawers[openDrawers.length - 1];

    if (event.key === 'Escape') {
      event.preventDefault();
      closeDrawer(activeDrawer);
      return;
    }

    if (event.key === 'Tab') {
      const focusables = Array.from(
        activeDrawer.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusables.length === 0) return;

      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstEl || !activeDrawer.contains(document.activeElement)) {
          event.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl || !activeDrawer.contains(document.activeElement)) {
          event.preventDefault();
          firstEl.focus();
        }
      }
    }
  });
}
