/**
 * Aster Design System — Dropdown Menu Component Controller
 * Canonical Source: components/dropdown/dropdown.js
 *
 * Implements accessible keyboard navigation, roving focus, Escape dismissal,
 * and light-dismiss outside click handling for W3C APG Menu Buttons.
 */

let initializedRoots = new WeakSet();

export function closeAllDropdowns(root = document) {
  const openMenus = root.querySelectorAll('.as-dropdown__menu:not([hidden])');
  openMenus.forEach((menu) => {
    menu.hidden = true;
    const parent = menu.closest('.as-dropdown');
    if (parent) {
      const trigger = parent.querySelector('.as-dropdown__trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
  });
}

export function openDropdown(dropdownEl) {
  const dropdown = typeof dropdownEl === 'string' ? document.getElementById(dropdownEl) : dropdownEl;
  if (!dropdown) return;
  const trigger = dropdown.querySelector('.as-dropdown__trigger');
  const menu = dropdown.querySelector('.as-dropdown__menu');
  if (trigger && menu) {
    closeAllDropdowns(dropdown.ownerDocument || document);
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    const firstItem = menu.querySelector('.as-dropdown__item:not(:disabled)');
    if (firstItem) firstItem.focus();
  }
}

export function closeDropdown(dropdownEl) {
  const dropdown = typeof dropdownEl === 'string' ? document.getElementById(dropdownEl) : dropdownEl;
  if (!dropdown) return;
  const trigger = dropdown.querySelector('.as-dropdown__trigger');
  const menu = dropdown.querySelector('.as-dropdown__menu');
  if (trigger && menu) {
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  }
}

export function initDropdown(root = typeof document !== 'undefined' ? document : null) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  // Trigger toggle click
  root.addEventListener('click', (event) => {
    const trigger = event.target.closest('.as-dropdown__trigger');
    if (trigger) {
      const dropdown = trigger.closest('.as-dropdown');
      if (!dropdown) return;
      const menu = dropdown.querySelector('.as-dropdown__menu');
      if (!menu) return;

      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeDropdown(dropdown);
      } else {
        openDropdown(dropdown);
      }
      return;
    }

    // Menu item click
    const item = event.target.closest('.as-dropdown__item');
    if (item) {
      const dropdown = item.closest('.as-dropdown');
      if (dropdown) {
        closeDropdown(dropdown);
        const trigger = dropdown.querySelector('.as-dropdown__trigger');
        if (trigger) trigger.focus();
      }
      return;
    }

    // Outside click dismissal
    if (!event.target.closest('.as-dropdown')) {
      closeAllDropdowns(root);
    }
  });

  // Keyboard navigation
  root.addEventListener('keydown', (event) => {
    const activeEl = document.activeElement;
    if (!activeEl) return;

    const dropdown = activeEl.closest('.as-dropdown');
    if (!dropdown) return;

    const trigger = dropdown.querySelector('.as-dropdown__trigger');
    const menu = dropdown.querySelector('.as-dropdown__menu');
    if (!menu) return;

    const isMenuOpen = !menu.hidden;
    const items = Array.from(menu.querySelectorAll('.as-dropdown__item:not(:disabled)'));

    // Trigger keydown
    if (activeEl === trigger) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openDropdown(dropdown);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        openDropdown(dropdown);
        const lastItem = items[items.length - 1];
        if (lastItem) lastItem.focus();
      }
      return;
    }

    // Menu keydown
    if (isMenuOpen && menu.contains(activeEl)) {
      const currentIndex = items.indexOf(activeEl);

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          const nextIndex = (currentIndex + 1) % items.length;
          items[nextIndex]?.focus();
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          items[prevIndex]?.focus();
          break;
        }
        case 'Home': {
          event.preventDefault();
          items[0]?.focus();
          break;
        }
        case 'End': {
          event.preventDefault();
          items[items.length - 1]?.focus();
          break;
        }
        case 'Escape': {
          event.preventDefault();
          closeDropdown(dropdown);
          trigger?.focus();
          break;
        }
        case 'Tab': {
          closeDropdown(dropdown);
          break;
        }
      }
    }
  });
}
