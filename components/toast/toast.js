/**
 * Aster Design System — Toast Component Controller
 * Canonical Source: components/toast/toast.js
 *
 * Implements accessible toast creation, auto-dismiss timers with hover pause,
 * and live region announcements.
 */

let initializedRoots = new WeakSet();

export function getOrCreateToastContainer(root = document) {
  let container = root.querySelector('.as-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'as-toast-container';
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Notifications');
    document.body.appendChild(container);
  }
  return container;
}

export function showToast(options = {}) {
  const {
    title = '',
    message = '',
    variant = 'info',
    duration = 4000,
    root = document
  } = options;

  const container = getOrCreateToastContainer(root);
  const toast = document.createElement('div');
  toast.className = `as-toast as-toast--${variant}`;
  toast.setAttribute('role', variant === 'critical' ? 'alert' : 'status');

  toast.innerHTML = `
    <div class="as-toast__content">
      ${title ? `<div class="as-toast__title">${title}</div>` : ''}
      ${message ? `<div class="as-toast__message">${message}</div>` : ''}
    </div>
    <button type="button" class="as-toast__close" aria-label="Dismiss notification">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="12" y1="4" x2="4" y2="12"></line>
        <line x1="4" y1="4" x2="12" y2="12"></line>
      </svg>
    </button>
  `;

  container.appendChild(toast);

  // Trigger entrance transition
  requestAnimationFrame(() => {
    toast.classList.add('is-open');
  });

  let timeoutId = null;
  function startDismissTimer() {
    if (duration > 0) {
      timeoutId = setTimeout(() => dismissToast(toast), duration);
    }
  }

  function pauseDismissTimer() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  // Hover and focus pause dismissal timer (WCAG 2.2 guideline)
  toast.addEventListener('mouseenter', pauseDismissTimer);
  toast.addEventListener('mouseleave', startDismissTimer);
  toast.addEventListener('focusin', pauseDismissTimer);
  toast.addEventListener('focusout', startDismissTimer);

  startDismissTimer();
  return toast;
}

export function dismissToast(toast) {
  if (!toast) return;
  toast.classList.remove('is-open');
  setTimeout(() => {
    toast.remove();
  }, 260);
}

export function initToast(root = typeof document !== 'undefined' ? document : null) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  // Delegated listener for declarative toast triggers: data-toast-trigger
  root.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-toast-trigger]');
    if (trigger) {
      showToast({
        title: trigger.getAttribute('data-toast-title') || 'Action Complete',
        message: trigger.getAttribute('data-toast-message') || '',
        variant: trigger.getAttribute('data-toast-variant') || 'info',
        duration: trigger.getAttribute('data-toast-duration') ? parseInt(trigger.getAttribute('data-toast-duration'), 10) : 4000
      });
      return;
    }

    const closeBtn = event.target.closest('.as-toast__close');
    if (closeBtn) {
      const toast = closeBtn.closest('.as-toast');
      if (toast) {
        dismissToast(toast);
      }
    }
  });
}
