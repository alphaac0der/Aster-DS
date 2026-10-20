/**
 * Aster Design System — Slider Component Controller
 * Canonical Source: components/slider/slider.js
 *
 * Synchronizes the visual fill progress (--_progress) and display value on input changes.
 */

let initializedRoots = new WeakSet();

export function syncSliderProgress(slider, valueDisplay = null) {
  if (!slider) return;
  const min = parseFloat(slider.min || 0);
  const max = parseFloat(slider.max || 100);
  const val = parseFloat(slider.value || 0);
  const percent = max > min ? Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100)) : 0;

  slider.style.setProperty('--_progress', `${percent}%`);

  const display = valueDisplay || 
    slider.closest('.as-slider-field')?.querySelector('.as-slider-field__value') ||
    (slider.id ? (document.querySelector(`[data-slider-value="${slider.id}"]`) || document.getElementById(`${slider.id}-val`)) : null);

  if (display) {
    if (!display.dataset.unit) {
      if (display.textContent.includes('%')) display.dataset.unit = '%';
      else if (display.textContent.includes('px')) display.dataset.unit = 'px';
      else if (display.textContent.includes('ms')) display.dataset.unit = 'ms';
      else display.dataset.unit = '';
    }
    const unit = display.dataset.unit || '';
    display.textContent = `${slider.value}${unit}`;
  }

  slider.setAttribute('aria-valuenow', String(val));
}

export function initSlider(root = typeof document !== 'undefined' ? document : null) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  // Sync all sliders in root on initialization
  const sliders = root.querySelectorAll('input[type="range"].as-slider');
  sliders.forEach((slider) => {
    syncSliderProgress(slider);
  });

  // Delegated input and change listeners for real-time progress track sync (mouse drag, touch, keyboard arrow keys)
  root.addEventListener('input', (event) => {
    const target = event.target;
    if (target && target.matches && target.matches('input[type="range"].as-slider')) {
      syncSliderProgress(target);
    }
  });

  root.addEventListener('change', (event) => {
    const target = event.target;
    if (target && target.matches && target.matches('input[type="range"].as-slider')) {
      syncSliderProgress(target);
    }
  });
}
