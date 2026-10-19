/**
 * Aster Design System — Data Table Component Behavior
 * Canonical Source: components/table/table.js
 *
 * Implements:
 * 1. Conditional horizontal overflow accessibility (WCAG 2.1.1):
 *    Dynamically toggles tabindex="0", role="region", and aria-label on .as-table-scroll
 *    (or .as-table-container) only when scrollWidth > clientWidth.
 * 2. Authoritative aria-sort state cycling on <th scope="col"> via .as-table__sort buttons.
 * 3. Multi-row checkbox selection state calculation (checked, indeterminate, tr[data-selected]).
 */

const initializedRoots = new WeakSet();

/**
 * Pure calculation for header select-all checkbox state.
 */
export function computeSelectionState(selectedCount, totalCount, isReady = true) {
  const checked = Boolean(isReady && totalCount > 0 && selectedCount === totalCount);
  const indeterminate = Boolean(isReady && selectedCount > 0 && selectedCount < totalCount);
  return { checked, indeterminate };
}

/**
 * Synchronizes keyboard scroll region attributes on a horizontal table scroll wrapper
 * based on whether its content overflows horizontally (scrollWidth > clientWidth).
 */
export function syncTableOverflow(scrollEl) {
  if (!scrollEl) return false;
  // If this container is an outer card wrapper that contains an inner .as-table-scroll, delegate to the inner one
  if (scrollEl.classList?.contains('as-table-container') && scrollEl.querySelector('.as-table-scroll')) {
    return false;
  }
  const overflows = scrollEl.scrollWidth > scrollEl.clientWidth + 1;
  if (overflows) {
    scrollEl.setAttribute('tabindex', '0');
    scrollEl.setAttribute('role', 'region');
    if (!scrollEl.getAttribute('aria-label')) {
      const caption = scrollEl.querySelector('.as-table__caption, caption');
      const label = caption?.textContent?.trim() || 'Data table';
      scrollEl.setAttribute('aria-label', label);
      scrollEl.dataset.asInjectedLabel = 'true';
    }
  } else {
    scrollEl.removeAttribute('tabindex');
    scrollEl.removeAttribute('role');
    if (scrollEl.dataset?.asInjectedLabel === 'true') {
      scrollEl.removeAttribute('aria-label');
      delete scrollEl.dataset.asInjectedLabel;
    }
  }
  return overflows;
}

/**
 * Synchronizes all .as-table-scroll and .as-table-container elements within a root container.
 */
export function syncAllTablesOverflow(root = typeof document !== 'undefined' ? document : null) {
  if (!root || !root.querySelectorAll) return;
  root.querySelectorAll('.as-table-scroll, .as-table-container').forEach(syncTableOverflow);
}

/**
 * Cycles the aria-sort state on a sortable column's <th> and resets sibling headers.
 */
export function cycleColumnSort(sortBtn) {
  if (!sortBtn) return null;
  const th = sortBtn.closest('th');
  const table = sortBtn.closest('table');
  if (!th || !table) return null;

  const current = th.getAttribute('aria-sort') || 'none';
  const nextDir = current === 'ascending' ? 'descending' : 'ascending';
  const key = sortBtn.dataset?.sortKey || null;

  table.querySelectorAll('th[aria-sort]').forEach((header) => {
    header.setAttribute('aria-sort', header === th ? nextDir : 'none');
  });

  return { key, dir: nextDir, label: sortBtn.textContent.trim(), th };
}

/**
 * Attaches table overflow observers, sort trigger listeners, and checkbox selection syncing.
 */
export function initTable(root = typeof document !== 'undefined' ? document : null, options = {}) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  syncAllTablesOverflow(root);

  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const target = entry.target.matches?.('.as-table-scroll, .as-table-container')
          ? entry.target
          : entry.target.closest?.('.as-table-scroll, .as-table-container');
        if (target) syncTableOverflow(target);
      }
    });
    root.querySelectorAll?.('.as-table-scroll, .as-table-container').forEach((el) => {
      ro.observe(el);
      const tbl = el.querySelector('.as-table');
      if (tbl) ro.observe(tbl);
    });
  } else if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => syncAllTablesOverflow(root), { passive: true });
  }

  // Delegated sort button click listener
  root.addEventListener?.('click', (e) => {
    const sortBtn = e.target?.closest?.('.as-table__sort, .as-table__sort-btn');
    if (!sortBtn) return;
    const result = cycleColumnSort(sortBtn);
    if (result && typeof options.onSort === 'function') {
      options.onSort(result, e);
    }
  });

  // Delegated table checkbox selection listener
  root.addEventListener?.('change', (e) => {
    const chk = e.target?.closest?.('.as-table th input[type="checkbox"], .as-table td input[type="checkbox"]');
    if (!chk) return;
    const table = chk.closest('table');
    if (!table) return;
    const headerChk = table.querySelector('thead th input[type="checkbox"]');
    const rowChks = Array.from(table.querySelectorAll('tbody td input[type="checkbox"]'));
    if (!rowChks.length) return;

    if (chk === headerChk) {
      rowChks.forEach((rc) => {
        rc.checked = headerChk.checked;
        rc.closest('tr')?.toggleAttribute('data-selected', headerChk.checked);
      });
      headerChk.indeterminate = false;
    } else {
      chk.closest('tr')?.toggleAttribute('data-selected', chk.checked);
      const selectedCount = rowChks.filter((rc) => rc.checked).length;
      const state = computeSelectionState(selectedCount, rowChks.length);
      if (headerChk) {
        headerChk.checked = state.checked;
        headerChk.indeterminate = state.indeterminate;
      }
    }
    if (typeof options.onSelectionChange === 'function') {
      const selectedCount = rowChks.filter((rc) => rc.checked).length;
      options.onSelectionChange({ selectedCount, totalCount: rowChks.length, table }, e);
    }
  });
}
