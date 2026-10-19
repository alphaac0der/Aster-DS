/**
 * Aster Design System — Accordion Component Controller
 * Canonical Source: components/accordion/accordion.js
 *
 * Implements accessible disclosure toggles, single/multi-expand modes,
 * and keyboard navigation across accordion headers.
 */

let initializedRoots = new WeakSet();

export function toggleAccordionItem(triggerEl) {
  if (!triggerEl) return;
  const isExpanded = triggerEl.getAttribute('aria-expanded') === 'true';
  const targetId = triggerEl.getAttribute('aria-controls');
  const panel = targetId ? document.getElementById(targetId) : null;
  const accordion = triggerEl.closest('.as-accordion');

  // Single-expand mode: close siblings if requested
  if (accordion && accordion.dataset.single === 'true' && !isExpanded) {
    const triggers = accordion.querySelectorAll('.as-accordion__trigger[aria-expanded="true"]');
    triggers.forEach((trig) => {
      trig.setAttribute('aria-expanded', 'false');
      const pId = trig.getAttribute('aria-controls');
      const p = pId ? document.getElementById(pId) : null;
      if (p) p.hidden = true;
    });
  }

  const nextState = !isExpanded;
  triggerEl.setAttribute('aria-expanded', nextState ? 'true' : 'false');
  if (panel) {
    panel.hidden = !nextState;
  }
}

export function initAccordion(root = typeof document !== 'undefined' ? document : null) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  // Click toggle
  root.addEventListener('click', (event) => {
    const trigger = event.target.closest('.as-accordion__trigger');
    if (trigger) {
      toggleAccordionItem(trigger);
    }
  });

  // W3C APG Accordion Header Keyboard Navigation
  root.addEventListener('keydown', (event) => {
    const activeTrigger = document.activeElement ? document.activeElement.closest('.as-accordion__trigger') : null;
    if (!activeTrigger) return;

    const accordion = activeTrigger.closest('.as-accordion');
    if (!accordion) return;

    const triggers = Array.from(accordion.querySelectorAll('.as-accordion__trigger:not(:disabled)'));
    const currentIndex = triggers.indexOf(activeTrigger);
    if (currentIndex === -1) return;

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const next = triggers[(currentIndex + 1) % triggers.length];
        next?.focus();
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const prev = triggers[(currentIndex - 1 + triggers.length) % triggers.length];
        prev?.focus();
        break;
      }
      case 'Home': {
        event.preventDefault();
        triggers[0]?.focus();
        break;
      }
      case 'End': {
        event.preventDefault();
        triggers[triggers.length - 1]?.focus();
        break;
      }
    }
  });
}
