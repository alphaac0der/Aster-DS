/**
 * Aster Design System — Alert Component Controller
 * Canonical Source: components/alert/alert.js
 *
 * Implements dismissal actions and accessible region bindings for alerts.
 */

let initializedRoots = new WeakSet();

export function dismissAlert(alertEl) {
  if (!alertEl) return;
  alertEl.style.opacity = '0';
  alertEl.style.transform = 'scale(0.97)';
  setTimeout(() => {
    alertEl.remove();
  }, 160);
}

export function initAlert(root = typeof document !== 'undefined' ? document : null) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  // Delegated click listener for dismiss buttons
  root.addEventListener('click', (event) => {
    const target = event.target;
    if (target && target.matches && target.matches('.as-alert__close, .as-alert__close *')) {
      const btn = target.closest('.as-alert__close');
      const alert = btn ? btn.closest('.as-alert') : null;
      if (alert) {
        dismissAlert(alert);
      }
    }
  });
}
