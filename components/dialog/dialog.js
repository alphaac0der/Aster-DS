/**
 * Aster Design System — Dialog Component Controller
 * Canonical Source: components/dialog/dialog.js
 *
 * Implements accessible modal dialog open/close lifecycle, focus management,
 * backdrop click dismissal, and Escape key handling.
 */

let initializedRoots = new WeakSet();

export function openDialog(dialogOrId) {
  const el = typeof dialogOrId === 'string' ? document.getElementById(dialogOrId) : dialogOrId;
  if (!el || typeof el.showModal !== 'function') return;
  if (!el.open) {
    el.showModal();
  }
}

export function closeDialog(dialogOrId) {
  const el = typeof dialogOrId === 'string' ? document.getElementById(dialogOrId) : dialogOrId;
  if (!el || typeof el.close !== 'function') return;
  if (el.open) {
    el.close();
  }
}

export function initDialog(root = typeof document !== 'undefined' ? document : null) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  // Delegated trigger click handlers: data-dialog-open="dialog-id"
  root.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-dialog-open]');
    if (trigger) {
      const dialogId = trigger.getAttribute('data-dialog-open');
      const dialog = document.getElementById(dialogId);
      if (dialog && typeof dialog.showModal === 'function') {
        dialog.showModal();
      }
    }

    const closeBtn = event.target.closest('[data-dialog-close]');
    if (closeBtn) {
      const dialog = closeBtn.closest('dialog.as-dialog');
      if (dialog && typeof dialog.close === 'function') {
        dialog.close();
      }
    }
  });

  // Backdrop click dismiss for modal dialogs
  root.addEventListener('click', (event) => {
    if (event.target.tagName === 'DIALOG' && event.target.classList.contains('as-dialog')) {
      const rect = event.target.getBoundingClientRect();
      const clickedInDialog = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!clickedInDialog) {
        event.target.close();
      }
    }
  });
}
