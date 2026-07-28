# Changelog

All notable changes to this project will be documented in this file.

## [22.8.0] - 2026-07-28

### Added

- **`interactive` input** (default `false`): marks the avatar as an interactive control. When enabled, the container exposes `role="button"`, becomes focusable (`tabindex="0"`) and triggers `clickOnAvatar` with Enter/Space (Space scroll prevented). Enable it whenever you bind `(clickOnAvatar)` — the click target used to be mouse-only and invisible to assistive technology.

## [22.7.0] - 2026-07-07

### Changed

- **BREAKING (packaging) — SCSS ships at `ng-hub-ui-avatar/styles`.** The theme mixin now builds to `dist/avatar/styles/...` (was `dist/avatar/src/lib/styles/...`), so `@use 'ng-hub-ui-avatar/styles'` resolves. Update any `@use` that reached into `src/lib/styles`.

- **`<hub-avatar>` `badgeColor` accepts ANY colour.** On top of the built-in semantic accents, the input now also accepts a **registered custom accent** and a **literal colour** (`#ff0000`, `rgb(...)`, `oklch(...)`, a CSS named colour), resolved through the shared `resolveHubAccent` resolver (a local copy of the canonical `ng-hub-ui-utils` helper): a bareword becomes `var(--hub-sys-color-<name>, <name>)`; a literal is used as-is. The single `--hub-<comp>-accent` slot derives the rest of the family, so built-in colours are unchanged.
- **Internal — host bindings moved to the `host` metadata object.** `@HostBinding` / `@HostListener` decorators were replaced by the `host` object in the component/directive metadata (Angular style guide). No public API or behaviour change.

## [22.6.0] - 2026-07-07

### Added

- **`[autoColor]` input for initials avatars.** In `[name]` mode the background colour is derived from a hash of the name and applied inline, which beats any `--hub-avatar-bg-color` theme a consumer sets (and forced `!important` workarounds). `[autoColor]="false"` now suppresses that inline colour so the avatar can be themed purely through the `--hub-avatar-bg-color` CSS variable. Defaults to `true` (unchanged behaviour); an explicit `bgColor` still wins over both.

## [22.5.1] - 2026-07-02

### Fixed

- CSS variable fallbacks realigned to the ds light defaults (`--hub-ref-font-family-base`: `Helvetica, Arial, sans-serif` → `system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`); fallbacks only apply when ng-hub-ui-ds is not loaded.
- **Initials avatar honours `--hub-avatar-font-family`.** The initials text no longer pins `Helvetica, Arial, sans-serif` through an inline `font` shorthand (which shadowed the token); only the size is set inline, so the family follows `.avatar-content`'s `--hub-avatar-font-family` — the ds `system-ui` stack by default, matching image/badge text.
- Docs: `docs/css-variables-reference.md` default values resynchronized with the actual code declarations (now guarded by the repo-level `tokens-parity` check F).
- Docs: the README customization example no longer overrides `--hub-avatar-size` — the avatar box is sized from the `size` input at runtime (the inline host style overrules CSS), so the variable is reclassified as `INTERNAL` in the token spec; use the input to size the avatar.

## [22.5.0] - 2026-06-30

### Added

- **Standalone `AvatarComponent`.** `<hub-avatar>` is now a standalone component (`standalone: true`) — import it directly with `imports: [AvatarComponent]`, no `NgModule` required. Aligns the library with the rest of the ng-hub-ui ecosystem and modern Angular.
- **`provideAvatar(config?)`** — a standalone-friendly environment provider that replaces `AvatarModule.forRoot()` for configuring source priority, colour palette and src-cache behaviour. Optional: the component works with sensible defaults out of the box.

### Changed

- `AvatarModule` is now a thin re-export of the standalone `AvatarComponent` (it no longer declares it). Existing `imports: [AvatarModule]` and `AvatarModule.forRoot(config)` usages keep working unchanged.

### Deprecated

- **`AvatarModule`** and **`AvatarModule.forRoot()`** — prefer importing `AvatarComponent` and registering `provideAvatar()`. The module remains for backward compatibility and will be removed in a future major version.

## [22.4.0] - 2026-06-26

### Changed

- **Accent system migrated to the open-set "local accent slot" pattern.** A coloured-circle avatar variant now re-bases a single `--hub-avatar-accent` slot (instead of `--hub-avatar-bg-color` directly), and the role family — `--hub-avatar-accent-emphasis`, `--hub-avatar-accent-subtle` and the new `--hub-avatar-accent-on` (contrast colour) — is derived **locally** from it with `color-mix(in oklch, …)` / relative color, mirroring the `ng-hub-ui-ds` engine. The circle fill (`--hub-avatar-bg-color`) feeds from the slot and the foreground (`--hub-avatar-fg-color`) now defaults to `--hub-avatar-accent-on`, so **light accents (e.g. `light`) get legible dark text automatically**. The built-in variant list and the `$hub-avatar-semantic-colors` Sass map were extended from 8 to the **nine canonical accents** (added `neutral`). The `hub-avatar-color-variants()` mixin (and its default map — **preserved**) now feed the accent slot, so any custom accent (e.g. `brand`) works the same way with no recompilation.

### Added

- New tokens `--hub-avatar-accent` (the semantic slot), `--hub-avatar-accent-emphasis`, `--hub-avatar-accent-subtle` and `--hub-avatar-accent-on`.

### Notes

- The runtime `bgColor` / `fgColor` inputs (applied as inline styles) are unaffected and continue to override the slot-fed defaults. The independent `$bg` / `$fg` parameters of `hub-avatar-theme()` keep their existing behaviour (explicit surface overrides, not the semantic slot).

## [22.3.0] - 2026-06-26

### Changed (BREAKING)

- **`status` → `badge`.** The presence-only `status` input is replaced by a general **`badge`** overlay: `badge` (bare/empty) or `[badge]="true"` renders a **dot**; `badge="4k"` / `[badge]="9"` renders a **labelled pill**; `null` / absent renders nothing. Colour comes from a **semantic** `badgeColor` input — `primary · secondary · success · danger · warning · info · light · dark` (→ `--hub-sys-color-*`). Presence is now expressed through the colour: online → `success`, away → `warning`, busy → `danger`, offline → `secondary`. The `HubAvatarStatus` type is renamed to `HubAvatarBadgeColor`, and the `--hub-avatar-status-*` tokens to `--hub-avatar-badge-*`. **Migration:** `status="online"` → `badge badgeColor="success"`. See `BREAKING_CHANGES.md`.

### Added

- **Semantic colour variants for both the avatar and its badge**, generated in one loop. Out of the box: a coloured-circle avatar variant per semantic colour (`<hub-avatar class="hub-avatar--success">`) and the matching `badgeColor`.
- **`hub-avatar-color-variants($colors)` mixin** — emit those avatar + badge colour variants in your own CSS, defaulting to the eight semantic colours or your own map (e.g. a brand colour). Plus **`hub-avatar-badge-color($color)`** and new `$content-*` / `$badge-*` parameters on `hub-avatar-theme()`.
- New tokens: `--hub-avatar-badge-color` / `-text-color` / `-size` / `-offset` / `-ring-width` / `-ring-color` / `-font-size` / `-padding`.

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
