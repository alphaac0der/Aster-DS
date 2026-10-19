/**
 * Aster Design System — Canonical Component Entry Point
 * Canonical Source: components/index.js
 */

export {
  computeButtonSpotGeometry,
  updateButtonSpot,
  isButtonInactive,
  setButtonLoading,
  initButton
} from './button/button.js';

export {
  syncInputClear,
  setFieldValidation,
  validateInput,
  initInput
} from './input/input.js';

export {
  computeSelectionState,
  syncTableOverflow,
  syncAllTablesOverflow,
  cycleColumnSort,
  initTable
} from './table/table.js';

export {
  setCheckboxIndeterminate,
  initCheckbox
} from './checkbox/checkbox.js';

export {
  initRadio
} from './radio/radio.js';

export {
  initSwitch
} from './switch/switch.js';

export {
  autoResizeTextarea,
  syncTextareaCounter,
  initTextarea
} from './textarea/textarea.js';

export {
  initSelect
} from './select/select.js';

export {
  syncSliderProgress,
  initSlider
} from './slider/slider.js';

export {
  initBadge
} from './badge/badge.js';

export {
  dismissAlert,
  initAlert
} from './alert/alert.js';

export {
  setProgressValue,
  initProgress
} from './progress/progress.js';

export {
  initSkeleton
} from './skeleton/skeleton.js';

export {
  hideAllTooltips,
  initTooltip
} from './tooltip/tooltip.js';

export {
  getOrCreateToastContainer,
  showToast,
  dismissToast,
  initToast
} from './toast/toast.js';

export {
  openDialog,
  closeDialog,
  initDialog
} from './dialog/dialog.js';

export {
  openDropdown,
  closeDropdown,
  closeAllDropdowns,
  initDropdown
} from './dropdown/dropdown.js';

export {
  openPopover,
  closePopover,
  closeAllPopovers,
  initPopover
} from './popover/popover.js';

export {
  selectTab,
  initTabs
} from './tabs/tabs.js';

export {
  toggleAccordionItem,
  initAccordion
} from './accordion/accordion.js';

export {
  openDrawer,
  closeDrawer,
  initDrawer
} from './drawer/drawer.js';

import { initButton } from './button/button.js';
import { initInput } from './input/input.js';
import { initTable } from './table/table.js';
import { initCheckbox } from './checkbox/checkbox.js';
import { initRadio } from './radio/radio.js';
import { initSwitch } from './switch/switch.js';
import { initTextarea } from './textarea/textarea.js';
import { initSelect } from './select/select.js';
import { initSlider } from './slider/slider.js';
import { initBadge } from './badge/badge.js';
import { initAlert } from './alert/alert.js';
import { initProgress } from './progress/progress.js';
import { initSkeleton } from './skeleton/skeleton.js';
import { initTooltip } from './tooltip/tooltip.js';
import { initToast } from './toast/toast.js';
import { initDialog } from './dialog/dialog.js';
import { initDropdown } from './dropdown/dropdown.js';
import { initPopover } from './popover/popover.js';
import { initTabs } from './tabs/tabs.js';
import { initAccordion } from './accordion/accordion.js';
import { initDrawer } from './drawer/drawer.js';

/**
 * Initializes all canonical Aster component behaviors on the given root (defaults to document).
 */
export function initAsterComponents(root = typeof document !== 'undefined' ? document : null, options = {}) {
  initButton(root, options);
  initInput(root, options);
  initTable(root, options);
  initCheckbox(root, options);
  initRadio(root, options);
  initSwitch(root, options);
  initTextarea(root, options);
  initSelect(root, options);
  initSlider(root, options);
  initBadge(root, options);
  initAlert(root, options);
  initProgress(root, options);
  initSkeleton(root, options);
  initTooltip(root, options);
  initToast(root, options);
  initDialog(root, options);
  initDropdown(root, options);
  initPopover(root, options);
  initTabs(root, options);
  initAccordion(root, options);
  initDrawer(root, options);
}
