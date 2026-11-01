# Manual Testing Checklist

Automated tests catch only part of accessibility and can't judge real use. Run this before a major release and write down what you tested and when.

## Keyboard (about 20 minutes)

Put the mouse away and use each component page.

- [ ] `Tab` reaches every control, in a sensible order, and focus is always visible.
- [ ] Buttons and links respond to `Enter`. Buttons, checkboxes, and switches respond to `Space`.
- [ ] Dialog and Drawer keep focus inside while open, close with `Escape`, and return focus to the button that opened them.
- [ ] Dropdown, Tabs, Radio, and Accordion respond to the arrow keys.
- [ ] Tooltip appears on focus and closes with `Escape`.

## Screen reader (about 1 hour)

Use NVDA with Chrome or Firefox on Windows, or VoiceOver with Safari on a Mac.

- [ ] Every control announces its name, role, and state, such as "Maintenance mode, switch, on".
- [ ] Field errors are read when you return to the field.
- [ ] Toasts are announced without moving focus.
- [ ] Dialogs announce their title when they open.
- [ ] Loading skeletons are not read out.
- [ ] Avatar status is read as part of the name.
- [ ] Table captions and column headers are read.

## Display (about 15 minutes)

- [ ] Zoom the browser to 200%. Nothing is cut off or overlapping.
- [ ] At phone width, pages don't scroll sideways, and the playground inspector is usable.
- [ ] With reduced motion turned on in system settings, animations stop.
- [ ] With Windows High Contrast turned on, controls and focus remain visible.

## Browsers (about 15 minutes)

Open the Playground and a few component pages in each.

- [ ] Chrome and Edge
- [ ] Firefox: the Select menu may be the browser's own
- [ ] Safari: the Select menu may be the browser's own

## Figma plugin (about 10 minutes)

In Figma, run `tools/figma-plugin` (see the [Figma library guide](figma-library-guide.md)).

- [ ] It finishes without errors.
- [ ] Button is 48px tall with 16px top and bottom padding.
- [ ] Variables are created in both Light and Dark modes.

The plugin doesn't include Card, Link, or Avatar yet. Motion and the theme-aware shadows aren't exported either.
