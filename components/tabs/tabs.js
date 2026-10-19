/**
 * Aster Design System — Tabs Component Controller
 * Canonical Source: components/tabs/tabs.js
 *
 * Implements accessible W3C APG Tablist keyboard navigation, selection states,
 * and synchronized panel visibility.
 */

let initializedRoots = new WeakSet();

export function selectTab(tabEl) {
  if (!tabEl || tabEl.getAttribute('aria-selected') === 'true') return;
  const tablist = tabEl.closest('[role="tablist"]');
  if (!tablist) return;

  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const prevIdx = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
  const nextIdx = tabs.indexOf(tabEl);
  const direction = prevIdx !== -1 && nextIdx < prevIdx ? 'backward' : 'forward';
  const container = tablist.closest('.as-tabs');

  tabs.forEach((tab) => {
    const isTarget = tab === tabEl;
    tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    tab.setAttribute('tabindex', isTarget ? '0' : '-1');
    tab.classList.toggle('is-active', isTarget);

    const controlsId = tab.getAttribute('aria-controls');
    if (controlsId) {
      const panel = container ? container.querySelector(`#${controlsId}`) : document.getElementById(controlsId);
      if (panel) {
        panel.dataset.direction = direction;
        panel.hidden = !isTarget;
        panel.classList.toggle('is-active', isTarget);
      }
    }
  });
}

export function initTabs(root = typeof document !== 'undefined' ? document : null) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  // Click listener for tabs
  root.addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (tab && !tab.disabled) {
      selectTab(tab);
    }
  });

  // W3C APG Tablist Keyboard Navigation
  root.addEventListener('keydown', (event) => {
    const activeTab = document.activeElement ? document.activeElement.closest('[role="tab"]') : null;
    if (!activeTab) return;

    const tablist = activeTab.closest('[role="tablist"]');
    if (!tablist) return;

    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]:not(:disabled)'));
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex === -1) return;

    let targetTab = null;

    switch (event.key) {
      case 'ArrowRight': {
        event.preventDefault();
        targetTab = tabs[(currentIndex + 1) % tabs.length];
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        targetTab = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
        break;
      }
      case 'Home': {
        event.preventDefault();
        targetTab = tabs[0];
        break;
      }
      case 'End': {
        event.preventDefault();
        targetTab = tabs[tabs.length - 1];
        break;
      }
    }

    if (targetTab) {
      targetTab.focus();
      selectTab(targetTab);
    }
  });
}
