/**
 * Aster Design System — Button Component Behavior
 * Canonical Source: components/button/button.js
 *
 * Implements:
 * 1. Shade-DS cursor-origin circular hover fill (--_x, --_y, --_max-d)
 * 2. Tactile keyboard press feedback (Enter / Space -> .is-pressed)
 * 3. Defensive activation cancellation for aria-disabled="true" and aria-busy="true"
 * 4. Programmatic setButtonLoading() helper
 */

const initializedRoots = new WeakSet();

/**
 * Pure calculation of pointer coordinates and exact corner-reaching diameter.
 */
export function computeButtonSpotGeometry(clientX, clientY, rect, offsetWidth, offsetHeight) {
  const w = offsetWidth || rect.width;
  const h = offsetHeight || rect.height;
  if (!rect.width || !rect.height || !w || !h) return null;
  const rawX = ((clientX - rect.left) / rect.width) * w;
  const rawY = ((clientY - rect.top) / rect.height) * h;
  const x = Math.max(0, Math.min(w, rawX));
  const y = Math.max(0, Math.min(h, rawY));
  const maxD = Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) * 2 + 4);
  return { x, y, maxD };
}

/**
 * Updates --_x, --_y, and --_max-d on a button element from a pointer event.
 */
export function updateButtonSpot(e) {
  const btn = e.target?.closest?.('.as-button');
  if (!btn || isButtonInactive(btn)) return;
  const rect = btn.getBoundingClientRect();
  const geom = computeButtonSpotGeometry(e.clientX, e.clientY, rect, btn.offsetWidth, btn.offsetHeight);
  if (!geom) return;
  btn.style.setProperty('--_x', `${geom.x.toFixed(1)}px`);
  btn.style.setProperty('--_y', `${geom.y.toFixed(1)}px`);
  btn.style.setProperty('--_max-d', `${geom.maxD}px`);
}

/**
 * Checks whether a button is disabled (native or focus-retaining) or loading.
 */
export function isButtonInactive(btn) {
  if (!btn) return true;
  return Boolean(
    btn.disabled ||
    btn.getAttribute('aria-disabled') === 'true' ||
    btn.getAttribute('aria-busy') === 'true'
  );
}

/**
 * Programmatically toggles a button's loading state while preserving width stability.
 */
export function setButtonLoading(btn, isLoading, loadingText = null) {
  if (!btn) return;
  const label = btn.querySelector('.as-button__label') || btn;
  if (isLoading) {
    if (btn.getAttribute('aria-busy') === 'true') return;
    btn.dataset.asOrigWidth = btn.style.minWidth || '';
    if (btn.offsetWidth) btn.style.minWidth = `${btn.offsetWidth}px`;
    btn.setAttribute('aria-busy', 'true');
    btn.classList.remove('is-pressed');
    if (loadingText !== null) {
      btn.dataset.asOrigLabel = label.textContent;
      label.innerHTML = `<span class="as-spinner" aria-hidden="true"></span> ${loadingText}`;
    } else if (!btn.querySelector('.as-spinner')) {
      const spinner = btn.ownerDocument.createElement('span');
      spinner.className = 'as-spinner';
      spinner.setAttribute('aria-hidden', 'true');
      btn.insertBefore(spinner, btn.firstChild);
      btn.dataset.asInjectedSpinner = 'true';
    }
  } else {
    btn.removeAttribute('aria-busy');
    btn.style.minWidth = btn.dataset.asOrigWidth || '';
    delete btn.dataset.asOrigWidth;
    if (btn.dataset.asOrigLabel !== undefined) {
      label.textContent = btn.dataset.asOrigLabel;
      delete btn.dataset.asOrigLabel;
    } else if (btn.dataset.asInjectedSpinner === 'true') {
      btn.querySelector('.as-spinner')?.remove();
      delete btn.dataset.asInjectedSpinner;
    }
  }
}

/**
 * Attaches delegated button interaction listeners to the given root (defaults to document).
 */
export function initButton(root = typeof document !== 'undefined' ? document : null, options = {}) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  const isReducedMotion = options.reducedMotion || (() =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );

  root.addEventListener('pointerover', updateButtonSpot, { passive: true });
  root.addEventListener('pointermove', updateButtonSpot, { passive: true });
  root.addEventListener('pointerdown', (e) => {
    updateButtonSpot(e);
    if (isReducedMotion()) return;
    const btn = e.target?.closest?.('.as-button');
    if (!btn || isButtonInactive(btn)) return;
    const rect = btn.getBoundingClientRect();
    const geom = computeButtonSpotGeometry(e.clientX, e.clientY, rect, btn.offsetWidth, btn.offsetHeight);
    if (!geom) return;
    const ripple = btn.ownerDocument.createElement('span');
    ripple.className = 'as-ripple-ring';
    ripple.setAttribute('aria-hidden', 'true');
    ripple.style.left = `${geom.x.toFixed(1)}px`;
    ripple.style.top = `${geom.y.toFixed(1)}px`;
    ripple.style.setProperty('--_ripple-d', `${Math.ceil(geom.maxD * 1.25)}px`);
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 720);
  }, { passive: true });
  root.addEventListener('pointerout', updateButtonSpot, { passive: true });

  root.addEventListener('keydown', (e) => {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    const btn = e.target?.closest?.('.as-button');
    if (!btn) return;
    if (isButtonInactive(btn)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    if (!isReducedMotion()) btn.classList.add('is-pressed');
  });

  root.addEventListener('keyup', (e) => {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    const btn = e.target?.closest?.('.as-button');
    if (btn) btn.classList.remove('is-pressed');
  });

  root.addEventListener('focusout', (e) => {
    const btn = e.target?.closest?.('.as-button');
    if (btn && !btn.closest?.('[data-matrix="button"]')) {
      btn.classList.remove('is-pressed');
    }
  });

  // Defensive capture-phase click safeguard for aria-disabled="true" and aria-busy="true"
  root.addEventListener('click', (e) => {
    const btn = e.target?.closest?.('.as-button');
    if (!btn) return;
    if (btn.getAttribute('aria-disabled') === 'true' || btn.getAttribute('aria-busy') === 'true') {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (typeof options.onBlockedActivate === 'function') {
        options.onBlockedActivate(btn, e);
      }
      return;
    }

    if (btn.hasAttribute('data-enable-success') || btn.dataset.enableSuccess === 'true') {
      triggerButtonSuccess(btn, btn.dataset.successLabel || 'Success!');
    }
  }, true);
}

/**
 * Programmatically triggers the Shade-DS Success state on a button.
 */
export function triggerButtonSuccess(btn, successLabel = null, durationMs = 2000) {
  if (!btn || isButtonInactive(btn)) return;
  const labelEl = btn.querySelector('.as-button__label') || btn;
  const originalHtml = labelEl.innerHTML;
  btn.setAttribute('data-success', 'true');
  btn.classList.add('is-success');
  
  if (successLabel) {
    labelEl.innerHTML = `<svg class="as-icon" width="16" height="16" aria-hidden="true" style="margin-right:6px;"><use href="#i-check"/></svg> ${successLabel}`;
  }

  setTimeout(() => {
    btn.removeAttribute('data-success');
    btn.classList.remove('is-success');
    if (successLabel) {
      labelEl.innerHTML = originalHtml;
    }
  }, durationMs);
}
