# Changelog

All notable changes to this project will be documented in this file.

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
