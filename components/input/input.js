/**
 * Aster Design System — Input / Form Field Component Behavior
 * Canonical Source: components/input/input.js
 *
 * Implements:
 * 1. Clear button visibility & reset ([data-clear-for="<input-id>"])
 * 2. Password visibility toggle ([data-toggle-pw="<input-id>"])
 * 3. Accessible validation error lifecycle (aria-invalid, error element, aria-describedby priority)
 */

const initializedRoots = new WeakSet();

/**
 * Synchronizes visibility of an associated clear button ([data-clear-for] or [data-action="clear"]).
 */
export function syncInputClear(input, root = input?.ownerDocument || document) {
  if (!input) return;
  const btn = (input.id && root?.querySelector?.(`[data-clear-for="${input.id}"]`)) ||
    input.closest?.('.as-input-box')?.querySelector?.('[data-action="clear"], .as-input__action--clear');
  if (btn) {
    btn.hidden = !input.value || input.disabled || input.readOnly;
  }
}

/**
 * Updates a form field's validation state and synchronizes aria-invalid and aria-describedby.
 */
export function setFieldValidation(input, errorMessage = '') {
  if (!input) return true;
  const doc = input.ownerDocument || document;
  const field = input.closest?.('.as-form-field');
  const box = input.closest?.('.as-input-box');
  const errId = `${input.id}-err`;
  const errEl = input.id ? doc.getElementById(errId) : field?.querySelector?.('.as-form-field__error');
  const msg = String(errorMessage || '').trim();
  const isInvalid = Boolean(msg);

  if (field) {
    field.classList.toggle('as-form-field--error', isInvalid);
    field.classList.toggle('as-form-field--invalid', isInvalid);
  }
  if (box) {
    box.classList.toggle('as-input-box--invalid', isInvalid);
  }

  if (isInvalid) {
    input.setAttribute('aria-invalid', 'true');
  } else {
    input.removeAttribute('aria-invalid');
  }

  if (errEl) {
    errEl.hidden = !isInvalid;
    const textSpan = errEl.querySelector('span:not(.as-form-field__error-icon)') || errEl;
    textSpan.textContent = msg;
    if (errEl.id) {
      const currentIds = (input.getAttribute('aria-describedby') || '')
        .split(/\s+/)
        .filter((id) => id && id !== errEl.id);
      const nextIds = isInvalid ? [errEl.id, ...currentIds] : currentIds;
      if (nextIds.length) {
        input.setAttribute('aria-describedby', nextIds.join(' '));
      } else {
        input.removeAttribute('aria-describedby');
      }
    }
  }

  return !isInvalid;
}

/**
 * Validates an input with a declarative [data-validate] rule (e.g. "slug").
 */
export function validateInput(input, options = {}) {
  if (!input) return true;
  const rule = input.dataset?.validate;
  if (!rule) return true;

  const v = input.value.trim();
  let msg = '';
  if (!v && input.required) {
    msg = input.dataset.requiredMessage || 'Enter a workspace name.';
  } else if (rule === 'slug' && v && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) {
    msg = input.dataset.patternMessage || 'Use lowercase letters, numbers and single dashes, like acme-platform.';
  } else if (typeof options.customValidator === 'function') {
    msg = options.customValidator(input, v) || '';
  }

  const wasInvalid = input.getAttribute('aria-invalid') === 'true';
  const valid = setFieldValidation(input, msg);

  if (typeof options.onAnnounce === 'function') {
    if (!valid && !wasInvalid && !options.quiet) {
      options.onAnnounce(`Error: ${msg}`);
    } else if (valid && wasInvalid) {
      options.onAnnounce('Valid.');
    }
  }
  return valid;
}

/**
 * Attaches delegated input/form-field listeners to the given root (defaults to document).
 */
export function initInput(root = typeof document !== 'undefined' ? document : null, options = {}) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  const announce = options.onAnnounce || (() => {});

  root.querySelectorAll?.('.as-input').forEach((input) => syncInputClear(input, root));

  root.addEventListener('input', (e) => {
    const input = e.target?.closest?.('.as-input');
    if (!input) return;
    syncInputClear(input, root);
    if (input.dataset?.validate && input.getAttribute('aria-invalid') === 'true') {
      validateInput(input, { ...options, quiet: true });
    }
  });

  root.addEventListener('focusout', (e) => {
    const input = e.target?.closest?.('.as-input[data-validate]');
    if (input) {
      validateInput(input, options);
    }
  });

  root.addEventListener('click', (e) => {
    const clear = e.target?.closest?.('[data-clear-for], [data-action="clear"], .as-input__action--clear');
    if (clear) {
      const doc = clear.ownerDocument || root;
      const input = clear.dataset?.clearFor
        ? doc.getElementById(clear.dataset.clearFor)
        : clear.closest?.('.as-input-box')?.querySelector('.as-input');
      if (!input) return;
      input.value = '';
      syncInputClear(input, doc);
      input.focus();
      if (input.getAttribute('aria-invalid') === 'true') {
        validateInput(input, { ...options, quiet: true });
      }
      announce('Cleared.');
      return;
    }

    const pw = e.target?.closest?.('[data-toggle-pw], [data-action="toggle-pw"], .as-input__action--pw');
    if (pw) {
      const doc = pw.ownerDocument || root;
      const input = pw.dataset?.togglePw
        ? doc.getElementById(pw.dataset.togglePw)
        : pw.closest?.('.as-input-box')?.querySelector('.as-input');
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      pw.setAttribute('aria-pressed', String(show));
      const useEl = pw.querySelector('use');
      if (useEl) {
        useEl.setAttribute('href', show ? '#i-eye-off' : '#i-eye');
      }
      announce(show ? 'Password is visible.' : 'Password is hidden.');
    }
  });
}
