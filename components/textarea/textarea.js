/**
 * Aster Design System — Textarea Component Controller
 * Canonical Source: components/textarea/textarea.js
 *
 * Implements auto-resize and character counting behaviors for textareas.
 */

let initializedRoots = new WeakSet();

export function autoResizeTextarea(textarea) {
  if (!textarea) return;
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
}

export function syncTextareaCounter(textarea, counterEl) {
  if (!textarea || !counterEl) return;
  const current = textarea.value.length;
  const max = textarea.getAttribute('maxlength');
  counterEl.textContent = max ? `${current} / ${max}` : `${current}`;
}

export function initTextarea(root = typeof document !== 'undefined' ? document : null) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  // Auto-resize listener
  root.addEventListener('input', (event) => {
    const target = event.target;
    if (target && target.matches && target.matches('textarea.as-textarea[data-auto-resize]')) {
      autoResizeTextarea(target);
    }

    // Counter synchronization
    if (target && target.matches && target.matches('textarea.as-textarea')) {
      const box = target.closest('.as-textarea-box');
      if (box) {
        const counter = box.querySelector('.as-textarea__counter');
        if (counter) {
          syncTextareaCounter(target, counter);
        }
      }
    }
  });

  // Initial pass for auto-resize and counter elements
  const allTextareas = root.querySelectorAll('textarea.as-textarea');
  allTextareas.forEach((ta) => {
    if (ta.hasAttribute('data-auto-resize')) {
      autoResizeTextarea(ta);
    }
    const box = ta.closest('.as-textarea-box');
    if (box) {
      const counter = box.querySelector('.as-textarea__counter');
      if (counter) {
        syncTextareaCounter(ta, counter);
      }
    }
  });
}
