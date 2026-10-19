/**
 * Aster Design System — Canonical TypeScript Declarations
 * Canonical Source: components/index.d.ts
 */

export interface AsterInitOptions {
  [key: string]: unknown;
}

export interface ButtonSpotGeometry {
  x: number;
  y: number;
  radius: number;
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
  field?: string;
}

export interface SelectionState {
  allSelected: boolean;
  noneSelected: boolean;
  partiallySelected: boolean;
  selectedCount: number;
  totalCount: number;
}

export interface ToastOptions {
  title?: string;
  message?: string;
  type?: 'neutral' | 'success' | 'warning' | 'error' | 'info';
  duration?: number;
  dismissible?: boolean;
}

/**
 * Initializes all canonical Aster component behaviors on the given root (defaults to document).
 */
export function initAsterComponents(root?: Document | Element | null, options?: AsterInitOptions): void;

// Button
export function computeButtonSpotGeometry(button: HTMLElement, clientX: number, clientY: number): ButtonSpotGeometry;
export function updateButtonSpot(button: HTMLElement, x: number, y: number): void;
export function isButtonInactive(button: HTMLElement): boolean;
export function setButtonLoading(button: HTMLElement, loading: boolean): void;
export function initButton(root?: Document | Element | null, options?: AsterInitOptions): void;

// Input
export function syncInputClear(input: HTMLInputElement): void;
export function setFieldValidation(field: HTMLElement, isValid: boolean, message?: string): void;
export function validateInput(input: HTMLInputElement): ValidationResult;
export function initInput(root?: Document | Element | null, options?: AsterInitOptions): void;

// Table
export function computeSelectionState(table: HTMLElement): SelectionState;
export function syncTableOverflow(table: HTMLElement): void;
export function syncAllTablesOverflow(root?: Document | Element | null): void;
export function cycleColumnSort(th: HTMLElement): void;
export function initTable(root?: Document | Element | null, options?: AsterInitOptions): void;

// Form Essentials
export function setCheckboxIndeterminate(checkbox: HTMLInputElement, indeterminate: boolean): void;
export function initCheckbox(root?: Document | Element | null, options?: AsterInitOptions): void;
export function initRadio(root?: Document | Element | null, options?: AsterInitOptions): void;
export function initSwitch(root?: Document | Element | null, options?: AsterInitOptions): void;
export function autoResizeTextarea(textarea: HTMLTextAreaElement): void;
export function syncTextareaCounter(textarea: HTMLTextAreaElement): void;
export function initTextarea(root?: Document | Element | null, options?: AsterInitOptions): void;
export function initSelect(root?: Document | Element | null, options?: AsterInitOptions): void;
export function syncSliderProgress(slider: HTMLInputElement): void;
export function initSlider(root?: Document | Element | null, options?: AsterInitOptions): void;
export function initBadge(root?: Document | Element | null, options?: AsterInitOptions): void;

// Feedback & Utilities
export function dismissAlert(alert: HTMLElement): void;
export function initAlert(root?: Document | Element | null, options?: AsterInitOptions): void;
export function setProgressValue(progress: HTMLElement, value: number, max?: number): void;
export function initProgress(root?: Document | Element | null, options?: AsterInitOptions): void;
export function initSkeleton(root?: Document | Element | null, options?: AsterInitOptions): void;
export function hideAllTooltips(root?: Document | Element | null): void;
export function initTooltip(root?: Document | Element | null, options?: AsterInitOptions): void;
export function getOrCreateToastContainer(): HTMLElement;
export function showToast(messageOrOptions: string | ToastOptions, options?: ToastOptions): HTMLElement;
export function dismissToast(toast: HTMLElement): void;
export function initToast(root?: Document | Element | null, options?: AsterInitOptions): void;

// Overlays & Navigation
export function openDialog(dialog: HTMLElement): void;
export function closeDialog(dialog: HTMLElement): void;
export function initDialog(root?: Document | Element | null, options?: AsterInitOptions): void;
export function openDropdown(triggerOrDropdown: HTMLElement): void;
export function closeDropdown(dropdown: HTMLElement): void;
export function closeAllDropdowns(root?: Document | Element | null): void;
export function initDropdown(root?: Document | Element | null, options?: AsterInitOptions): void;
export function openPopover(triggerOrPopover: HTMLElement): void;
export function closePopover(popover: HTMLElement): void;
export function closeAllPopovers(root?: Document | Element | null): void;
export function initPopover(root?: Document | Element | null, options?: AsterInitOptions): void;
export function selectTab(tabButton: HTMLElement): void;
export function initTabs(root?: Document | Element | null, options?: AsterInitOptions): void;
export function toggleAccordionItem(header: HTMLElement): void;
export function initAccordion(root?: Document | Element | null, options?: AsterInitOptions): void;
export function openDrawer(drawer: HTMLElement): void;
export function closeDrawer(drawer: HTMLElement): void;
export function initDrawer(root?: Document | Element | null, options?: AsterInitOptions): void;
