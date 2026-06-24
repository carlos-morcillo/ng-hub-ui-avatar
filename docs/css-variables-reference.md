# ng-hub-ui-avatar - CSS Variables Reference

Complete reference of all CSS custom properties exposed by `ng-hub-ui-avatar`.
Use these variables to customize avatar rendering without editing component source code.

---

## Table of Contents

- [How it Works](#how-it-works)
- [Importing Styles](#importing-styles)
- [Base System Fallbacks](#base-system-fallbacks)
- [Avatar Variables](#avatar-variables)
- [Customization Examples](#customization-examples)
- [Best Practices](#best-practices)

---

## How it Works

The avatar styles are encapsulated within the component using canonical tokens (`--hub-avatar-*`).

This allows:

- Easy customization via CSS variables on the component's host or parent.
- Clean separation of concerns with component-level styles.
- Runtime theming via CSS custom properties.

---

## Importing Styles

Starting from version 21.1.0, you don't need to import a global stylesheet. The styles are now strictly encapsulated within `HubAvatarComponent`.

If you were previously using:

```scss
@use 'ng-hub-ui-avatar/src/lib/styles/avatar.scss';
```

You can now remove this import. The component handles its own styling automatically.

---

## Base System Fallbacks

`ng-hub-ui-avatar` defines and/or consumes these base tokens:

| Variable | Default |
| --- | --- |
| `--hub-ref-color-white` | `#fff` |
| `--hub-ref-radius-sm` | `0.25rem` |
| `--hub-ref-border-width` | `1px` |
| `--hub-ref-font-family-base` | `Helvetica, Arial, sans-serif` |
| `--hub-sys-surface-page` | `#fff` |
| `--hub-sys-text-primary` | `#212529` |
| `--hub-sys-text-muted` | `#6c757d` |
| `--hub-sys-color-success` | — (status `online`) |
| `--hub-sys-color-warning` | — (status `away`) |
| `--hub-sys-color-danger` | — (status `busy`) |

---

## Avatar Variables

Defined and consumed by `projects/avatar/src/lib/styles/avatar.scss`.

### Core

| Variable | Default | Usage |
| --- | --- | --- |
| `--hub-avatar-size` | `50px` | Avatar width/height |
| `--hub-avatar-overflow` | `hidden` | Overflow clipping behavior |
| `--hub-avatar-object-fit` | `cover` | Image content fit |

### Shape and Border

| Variable | Default | Usage |
| --- | --- | --- |
| `--hub-avatar-border-radius-round` | `50%` | Round avatar radius token |
| `--hub-avatar-border-radius-square` | `var(--hub-ref-radius-sm, 0.25rem)` | Default square corner radius |
| `--hub-avatar-border-radius` | `var(--hub-avatar-border-radius-round, var(--hub-avatar-border-radius-square, 0.25rem))` | Effective radius used by host/container/content |
| `--hub-avatar-border-width-default` | `var(--hub-ref-border-width, 1px)` | Base border width used when border is enabled |
| `--hub-avatar-border-width` | `0` | Effective avatar border width |
| `--hub-avatar-border-color` | `transparent` | Effective avatar border color |

### Text and Surface

| Variable | Default | Usage |
| --- | --- | --- |
| `--hub-avatar-fg-color` | `var(--hub-ref-color-white, #fff)` | Text color for text avatars |
| `--hub-avatar-bg-color` | `var(--hub-sys-surface-page, #fff)` | Background for avatar content |
| `--hub-avatar-font-family` | `var(--hub-ref-font-family-base, Helvetica, Arial, sans-serif)` | Text avatar font family |
| `--hub-avatar-font-weight` | `400` | Text avatar font weight |
| `--hub-avatar-font-size` | `calc(var(--hub-avatar-size, 50px) / 3)` | Text avatar font size |
| `--hub-avatar-line-height` | `var(--hub-avatar-size, 50px)` | Text avatar line height |
| `--hub-avatar-text-transform` | `uppercase` | Text transform for initials/value avatars |
| `--hub-avatar-text-align` | `center` | Text alignment for text avatars |

### Presence Status

Opt-in dot rendered when the `status` input is set. The colour is re-based per built-in status (`online` → success, `away` → warning, `busy` → danger, `offline` → neutral); any custom status keeps the neutral default unless you set `--hub-avatar-status-color`.

| Variable | Default | Usage |
| --- | --- | --- |
| `--hub-avatar-status-size` | `calc(var(--hub-avatar-size, 50px) * 0.28)` | Diameter of the status dot |
| `--hub-avatar-status-offset` | `0px` | Inset of the dot from the bottom-end corner |
| `--hub-avatar-status-ring-width` | `max(2px, calc(var(--hub-avatar-size, 50px) * 0.05))` | Width of the ring around the dot |
| `--hub-avatar-status-ring-color` | `var(--hub-sys-surface-page, #fff)` | Colour of the ring around the dot |
| `--hub-avatar-status-color` | `var(--hub-sys-text-muted, #6c757d)` | Dot colour (re-based per built-in status) |

### Stacked Group

Applied when avatars are wrapped in a `.hub-avatar-group` to overlap them; each avatar gets a ring so the edges read cleanly.

| Variable | Default | Usage |
| --- | --- | --- |
| `--hub-avatar-group-overlap` | `calc(var(--hub-avatar-size, 50px) * 0.3)` | Horizontal overlap between avatars |
| `--hub-avatar-group-ring-width` | `max(2px, calc(var(--hub-avatar-size, 50px) * 0.04))` | Ring width around each avatar |
| `--hub-avatar-group-ring-color` | `var(--hub-sys-surface-page, #fff)` | Ring colour around each avatar |

---

## Customization Examples

### Framework-Agnostic

```scss
hub-avatar {
  --hub-avatar-size: 64px;
  --hub-avatar-border-radius: 16px;
  --hub-avatar-fg-color: #ffffff;
  --hub-avatar-bg-color: #0d6efd;
  --hub-avatar-border-width: 2px;
  --hub-avatar-border-color: #0a58ca;
}
```

### Bootstrap Integration (Optional)

```scss
hub-avatar {
  --hub-avatar-bg-color: var(--bs-primary);
  --hub-avatar-fg-color: var(--bs-white);
  --hub-avatar-border-color: var(--bs-border-color);
}
```

### Compact Avatar

```scss
hub-avatar.compact {
  --hub-avatar-size: 32px;
  --hub-avatar-font-size: 11px;
}
```

---

## Best Practices

- Prefer `--hub-avatar-*` tokens for direct component theming.
- Override `--hub-sys-*` and `--hub-ref-*` tokens for consistent cross-component behavior.
- Use framework variables like `--bs-*` only as optional integration, not as required defaults.
- Keep dynamic behavior (`size`, `round`, `cornerRadius`) through component inputs, and theme visual values with tokens.
