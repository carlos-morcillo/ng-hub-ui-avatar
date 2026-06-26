# Changelog

All notable changes to this project will be documented in this file.

## [22.2.1] - 2026-06-26

### Fixed

- Corrected the Angular peer dependency range from `>=16.0.0` to `>=18.0.0`. The library uses `input()` (Angular 17.1), `output()` (17.3) and the `@if` control flow (17), so it never actually worked on Angular 16 / 17.0–17.2 — the declared range now reflects the real minimum.
- Declared `ts-md5` (used by the Gravatar source) and `tslib` as runtime `dependencies`. Previously `ts-md5` was not declared at all (only listed under `allowedNonPeerDependencies`), so consumers using the Gravatar source could hit a missing-module error, and `tslib` was a peer dependency. Both now install automatically with the package.

## [22.2.0] - 2026-06-26

### Added

- **Projected custom content** — place any icon (`<i class="fa…">`, `<span class="material-icons">`…), an inline `<svg>`, an `<img>` or an emoji directly inside `<hub-avatar>` and it is handled agnostically: font icons inherit a sensible size while SVG/images fill the avatar, both centred with decent padding, clipped to the avatar shape (round or square) and scaling with `size`. It activates automatically when content is projected and takes precedence over the image/initials sources. The content sits on the avatar's own background (`--hub-avatar-bg-color`) with the avatar foreground colour (white), so it reads as a coloured circle out of the box; the existing `bgColor` / `fgColor` / `borderColor` / `style` inputs still apply. Two new sizing tokens: `--hub-avatar-content-padding` and `--hub-avatar-content-icon-size`.

### Changed

- The default `--hub-avatar-bg-color` is now the design-system accent (`--hub-sys-color-primary`) instead of the page surface, so icon/content avatars render as a coloured circle by default (matching how a milestone node fills with the accent). Initials and value avatars are unaffected — they already override the background with their own (auto-generated or `bgColor`) colour — and image avatars cover it.

## [22.1.1] - 2026-06-25

### Fixed

- Design-token consistency pass: aligned inline fallback defaults with the canonical `ng-hub-ui-ds` values and routed hardcoded literals (z-index, font-weight, line-height, radii and theme-aware colours) through their `--hub-sys-*` / `--hub-ref-*` tokens, so they follow the active theme. No visual change when the ds tokens are loaded.

## [22.1.0] - 2026-06-24

### Added

- New **`status` input** — a semantic presence indicator dot at the bottom-end corner. Built-ins map to the design-system colours: `online` → success, `away` → warning, `busy` → danger, `offline` → neutral (driven by a `data-status` `@each` loop); any custom string is accepted (set `--hub-avatar-status-color`). When unset (default) no dot renders. The dot scales with the avatar — the component now exposes the live size on the host as `--hub-avatar-size`. New tokens `--hub-avatar-status-size` / `-offset` / `-ring-width` / `-ring-color` / `-color`. A `HubAvatarStatus` type is now exported for the built-in statuses.
- New **`.hub-avatar-group`** helper class — wrap several `<hub-avatar>` to overlap them into a stacked group; each avatar gets a ring so the edges read cleanly. New tokens `--hub-avatar-group-overlap` / `-ring-width` / `-ring-color`.
- New **`hub-avatar-theme()` Sass mixin** (`styles/mixins/avatar-theme`) — theme an avatar in one call: shape/surface, initials typography, the status dot and the group ring. Every parameter is optional and defaults to `null`, so only the ones you pass are emitted as `--hub-avatar-*` overrides. Token-based, no Bootstrap dependency.

### Fixed

- Aligned the font-family token reference with the canonical `ng-hub-ui-ds` name: `--hub-ref-font-family-sans-serif` → `--hub-ref-font-family-base` (no visual change).

## [22.0.0] - 2026-06-17

### Changed

- Aligned with Angular 22.
- README documentation standardized.


## [21.1.1] - 2026-06-14

### Changed

- Replaced the deprecated `ngStyle` directive with the native `[style]` binding (Angular soft-deprecated `ngStyle`/`ngClass` in November 2024 in favour of native bindings, for better performance and smaller bundles).

## [21.1.0] - 2026-03-17

### Changed

- **BREAKING CHANGE:** Internal styles are now encapsulated within `HubAvatarComponent` via `avatar.component.scss`.
- Modernized unit tests to use `fixture.componentRef.setInput`.
- Improved test environment configuration.

## [21.0.0] - 2026-03-09

### Changed

- **BREAKING CHANGE:** Modernized component inputs to use Angular Signals.
- Refactored component structure to improve readability and maintainability.
- Updated documentation and README for better clarity, including details about project inspiration, ng-hub-ui family support, and formatting fixes.

### Removed

- **BREAKING CHANGE:** Removed `google`, `instagram`, `skype`, `twitter`, and `vkontakte` avatar sources from the library.
