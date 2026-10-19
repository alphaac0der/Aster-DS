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

  if (valueDisplay) {
    valueDisplay.textContent = slider.value;
  }
}

export function initSlider(root = typeof document !== 'undefined' ? document : null) {
  if (!root || initializedRoots.has(root)) return;
  initializedRoots.add(root);

  // Sync all sliders in root on initialization
  const sliders = root.querySelectorAll('input[type="range"].as-slider');
  sliders.forEach((slider) => {
    const field = slider.closest('.as-slider-field');
    const valueDisplay = field ? field.querySelector('.as-slider-field__value') : null;
    syncSliderProgress(slider, valueDisplay);
  });

  // Delegated input listener for real-time progress track sync
  root.addEventListener('input', (event) => {
    const target = event.target;
    if (target && target.matches && target.matches('input[type="range"].as-slider')) {
      const field = target.closest('.as-slider-field');
      const valueDisplay = field ? field.querySelector('.as-slider-field__value') : null;
      syncSliderProgress(target, valueDisplay);
    }
  });
}
