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

The avatar styles use the token fallback chain:

```text
component token -> sys/ref token -> literal fallback
```

The component also exposes runtime variables through `ngStyle` so inputs like `size`, `round`, `cornerRadius`, `bgColor`, `fgColor`, and `borderColor` map to CSS custom properties.

---

## Importing Styles

Add avatar styles to your global stylesheet:

```scss
@use 'ng-hub-ui-avatar/src/lib/styles/avatar.scss';
```

---

## Base System Fallbacks

`ng-hub-ui-avatar` defines and/or consumes these base tokens:

| Variable | Default |
| --- | --- |
| `--hub-ref-color-white` | `#fff` |
| `--hub-ref-radius-sm` | `0.25rem` |
| `--hub-ref-border-width` | `1px` |
| `--hub-ref-font-family-sans-serif` | `Helvetica, Arial, sans-serif` |
| `--hub-sys-surface-page` | `#fff` |
| `--hub-sys-text-primary` | `#212529` |

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
| `--hub-avatar-font-family` | `var(--hub-ref-font-family-sans-serif, Helvetica, Arial, sans-serif)` | Text avatar font family |
| `--hub-avatar-font-weight` | `400` | Text avatar font weight |
| `--hub-avatar-font-size` | `calc(var(--hub-avatar-size, 50px) / 3)` | Text avatar font size |
| `--hub-avatar-line-height` | `var(--hub-avatar-size, 50px)` | Text avatar line height |
| `--hub-avatar-text-transform` | `uppercase` | Text transform for initials/value avatars |
| `--hub-avatar-text-align` | `center` | Text alignment for text avatars |

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
