# Component Review Report — Nova Style Regeneration

Generated: 2026-04-07 | **All issues fixed**: 2026-04-07

All components were regenerated via `npx shadcn-svelte add <component> --overwrite` with `"style": "nova"` in `components.json`.

## Summary

| Category | Count | Status |
|----------|-------|--------|
| Components reviewed | 58 | |
| Fully clean | 22 | |
| With issues | 36 | **All fixed** |
| Functional bugs | 5 | ✅ Fixed |
| Naming bugs | 3 | ✅ Fixed |
| Import/type issues | 4 | ✅ Fixed |
| Duplicated classes | 6 | ✅ Fixed |
| Missing data-slot | 23 files | ✅ Fixed |
| A11y issues | 2 | ✅ Fixed |
| Small fixes | 8 | ✅ Fixed |
| Structural/convention | ~10 | Intentional — not changed |

## Clean Components (no issues)

aspect-ratio, avatar, badge, card, checkbox, collapsible, data-table, dialog, hover-card, kbd, label, scroll-area, separator, skeleton, switch, tabs, toggle, toggle-group, tooltip, typography, resizable

## Functional Bugs

| File | Issue | Fix |
|------|-------|-----|
| `button-group/button-group-text.svelte` | `children` not destructured → content silently swallowed via `mergedProps` | Destructure `children` from `$props()` |
| `item/item.svelte` | `children` flows silently through `restProps` instead of being destructured | Destructure `children` explicitly |
| `command/command-dialog.svelte` | `restProps` spread on both `<Dialog.Root>` AND `<Command>` → misrouted props | Remove `{...restProps}` from `<Command>` |
| `command/command-dialog.svelte` | `<Dialog.Header>` outside `<Dialog.Content>` → title not associated with dialog role | Move `<Dialog.Header>` inside `<Dialog.Content>` |
| `input/input.svelte` | `bind:value` on file input → runtime error (file input value is read-only) | Remove `bind:value` from `type === "file"` branch |

## Naming Bugs

| File | Issue | Fix |
|------|-------|-----|
| `empty/empty-media.svelte` | `data-slot="empty-icon"` doesn't match component name | Change to `data-slot="empty-media"` |
| `field/field-title.svelte` | `data-slot="field-label"` collides with `field-label.svelte` | Change to `data-slot="field-title"` |
| `sheet/sheet-content.svelte` | Inline close button uses `data-slot="sheet-close"` — collides with standalone `sheet-close.svelte` | Change to `data-slot="sheet-close-button"` |

## Import / Type Issues

| File | Issue | Fix |
|------|-------|-----|
| `menubar/menubar-label.svelte` | `WithElementRef` imported from `bits-ui` instead of `$lib/utils.js` | Fix import path |
| `select/select-content.svelte` | Double import from `$lib/utils.js` (2 separate import statements) | Merge into single import |
| `select/select-label.svelte` | Trailing `& {}` dead intersection type | Remove `& {}` |
| `sheet/sheet-content.svelte` | `children: Snippet` required but called with `children?.()` optional chaining | Change to `children?: Snippet` |

## Duplicated Classes

| File | Issue | Fix |
|------|-------|-----|
| `drawer/drawer-content.svelte` | Handle bar `<div>` has duplicated class block | Remove duplicate suffix |
| `empty/empty-description.svelte` | `text-sm/relaxed` appears twice | Remove duplicate |
| `input-otp/input-otp-slot.svelte` | Caret div: `bg-foreground h-4 w-px` duplicated | Remove duplicate |
| `slider/slider.svelte` | `bg-muted`, `data-horizontal:w-full`, `data-vertical:h-full` duplicated | Deduplicate |
| `context-menu/context-menu-label.svelte` | `data-inset:pl-7` + `data-[inset]:pl-8` mixed/duplicated | Keep `data-inset:pl-8`, remove `data-inset:pl-7` |
| `context-menu/context-menu-sub-trigger.svelte` | `data-inset:pl-7` + `data-inset:ps-8` duplicated | Keep `data-inset:ps-8`, remove `data-inset:pl-7` |

## Small Fixes

| File | Issue | Fix |
|------|-------|-----|
| `accordion/accordion-content.svelte` | `className` on inner `<div>` instead of outer `AccordionPrimitive.Content` | Move `cn()` to outer element |
| `popover/popover-trigger.svelte` | `cn("", className)` no-op empty string | Change to `cn(className)` |
| `radio-group/radio-group.svelte` | `$bindable("")` overrides undefined | Change to `$bindable(undefined)` |
| `progress/progress.svelte` | `overflow-x-hidden` doesn't clip vertically | Change to `overflow-hidden` |
| `carousel/carousel-previous.svelte` | `bind:ref` after `restProps` (inconsistent with next) | Move before `restProps` |
| `breadcrumb/breadcrumb-page.svelte` | `role="link"` incorrect on `<span>` | Remove `role="link"` |
| `button/button.svelte` | `role="link"` redundant on `<a>` when disabled | Remove redundant role |
| `dropdown-menu/dropdown-menu-label.svelte` | Mixed inset selector forms | Align to `data-inset:` form |

## Missing data-slot (~20 files)

| File | data-slot to add |
|------|-----------------|
| `chart/chart-tooltip.svelte` | `chart-tooltip` |
| `calendar/calendar-month.svelte` | `calendar-month` |
| `calendar/calendar-months.svelte` | `calendar-months` |
| `calendar/calendar-nav.svelte` | `calendar-nav` |
| `calendar/calendar-month-select.svelte` | `calendar-month-select` |
| `calendar/calendar-year-select.svelte` | `calendar-year-select` |
| `form/form-element-field.svelte` | `form-element-field` |
| `form/form-legend.svelte` | `form-legend` |
| `form/form-fieldset.svelte` | `form-fieldset` |
| `form/form-field-errors.svelte` | `form-field-errors` |
| `pagination/pagination-next-button.svelte` | `pagination-next-button` |
| `pagination/pagination-prev-button.svelte` | `pagination-prev-button` |
| `input-group/input-group-text.svelte` | `input-group-text` |
| `input-group/input-group-button.svelte` | `input-group-button` |
| `sonner/sonner.svelte` | `sonner` |
| `spinner/spinner.svelte` | `spinner` |
| `range-calendar/range-calendar.svelte` | `range-calendar` |
| `range-calendar/range-calendar-month.svelte` | `range-calendar-month` |
| `range-calendar/range-calendar-months.svelte` | `range-calendar-months` |
| `range-calendar/range-calendar-nav.svelte` | `range-calendar-nav` |
| `range-calendar/range-calendar-grid-body.svelte` | `range-calendar-grid-body` |
| `range-calendar/range-calendar-grid-head.svelte` | `range-calendar-grid-head` |
| `sidebar/sidebar.svelte` | `sidebar` (on `collapsible === "none"` branch) |

## A11y Issues

| File | Issue | Fix |
|------|-------|-----|
| `field/field.svelte` | `role="group"` without accessible name | Remove `role="group"` |
| `item/item-group.svelte` | `role="list"` on `<div>` without `listitem` children | Remove `role="list"` |
| `menubar/menubar-label.svelte` | `<div>` plain instead of ARIA primitive for label | Low priority — flag only |

## Structural Notes (intentional trade-offs, not fixed)

- `table.svelte` — `className`/`ref` on `<table>` but `data-slot` on wrapper `<div>` (two-element layout)
- `textarea.svelte` — `data-slot` overridable via props (used by input-group pattern)
- `native-select.svelte` — `ref` on `<select>` but `className` on wrapper (two-element layout)
- `carousel-content.svelte` — `data-slot` on viewport, `ref` on container (Embla architecture)
- `range-calendar-month/year-select.svelte` — `ref` on inner primitive, `className` on outer `<span>`
- `calendar-caption.svelte` — renderless fragment, dead `ref`/`restProps`
- `sidebar.svelte` desktop — `className`/`restProps` on inner container (fixed positioning layout)

> **Note:** All fixes will be overwritten if components are re-regenerated with `npx shadcn-svelte add`. Consider contributing fixes upstream or maintaining a post-generation script.
