# Breaking Changes in `ng-hub-ui-avatar`

This document details the breaking changes introduced in major versions of `ng-hub-ui-avatar` and how to migrate your codebase.

## [22.10.0] - 2026-09-06
### The avatar's render state is internal, and `ngOnChanges` is gone

- **Change**: `avatarSrc`, `avatarText`, `avatarStyle`, `hostStyle`, `hasCustomContent` and
  `customContentStyle` were public mutable fields holding what the component had just painted.
  They are now `protected` signals derived from the inputs, and the component no longer implements
  `OnChanges` — the fallback chain is computed instead of patched from `SimpleChanges`.
- **Impact**: reading any of those fields off a `ViewChild`-ed `AvatarComponent` no longer compiles,
  and neither does calling `avatar.ngOnChanges(...)` by hand (a test double driving the component
  that way is the likely place this shows up). Nothing changes for a template that only binds inputs
  and listens to `clickOnAvatar`, which is every documented use.
- **Migration**: read the inputs you passed in, not the state the avatar derived from them. A test
  that used to call `ngOnChanges` to make a change land should set the input and let change detection
  run:

    ```ts
    // Before
    fixture.componentRef.setInput('name', 'John Doe');
    component.ngOnChanges({ initials: new SimpleChange(null, 'John Doe', true) });
    fixture.detectChanges();

    // After
    fixture.componentRef.setInput('name', 'John Doe');
    fixture.detectChanges();
    ```

### `clickOnAvatar` emits `Source | null`

- **Change**: the output payload is now `Source | null`. It was typed `Source` but could hand you
  `undefined` — an avatar built from projected content alone has no source, and neither has one
  whose whole fallback chain failed.
- **Impact**: with `strictTemplates`, a handler declared `(source: Source)` no longer accepts
  `$event`. Nothing changes at runtime except that the two cases above now arrive as `null`.
- **Migration**: widen the handler and read the source through the null check.

    ```ts
    import { Source } from 'ng-hub-ui-avatar'; // now exported from the entry point

    onAvatarClick(source: Source | null): void {
    	if (!source) {
    		return;
    	}
    	console.log(source.sourceType);
    }
    ```

## [22.7.0] - 2026-07-07

### SCSS ships at `ng-hub-ui-avatar/styles` (packaging path)

- **Change**: the theming mixin now builds to `dist/avatar/styles/...` instead of `dist/avatar/src/lib/styles/...`, and a `styles/index.scss` root entry forwards it.
- **Impact**: a `@use` that reached into the old `src/lib/styles/...` path no longer resolves.
- **Migration**: `@use 'ng-hub-ui-avatar/styles' as *;`

## Version 22.3.0

### `status` input replaced by a general `badge`

The presence-only `status` input has been replaced by a more general **`badge`** overlay that can be a plain dot **or** carry a label (count / text), coloured by a **semantic** `badgeColor`.

| Before (`status`) | After (`badge` + `badgeColor`) |
| ----------------- | ------------------------------ |
| `status="online"` | `badge badgeColor="success"` |
| `status="away"` | `badge badgeColor="warning"` |
| `status="busy"` | `badge badgeColor="danger"` |
| `status="offline"` | `badge badgeColor="secondary"` |
| `status="custom"` + `--hub-avatar-status-color` | `badge badgeColor="<semantic>"` (or `--hub-avatar-badge-color`) |

New: a **labelled** badge — `<hub-avatar badge="4k" badgeColor="danger">`.

Renames:

- Type `HubAvatarStatus` → `HubAvatarBadgeColor` (now the semantic colour set, not presence keywords).
- Tokens `--hub-avatar-status-{size,offset,ring-width,ring-color,color}` → `--hub-avatar-badge-{size,offset,ring-width,ring-color,color}`.
- `hub-avatar-theme()` parameters `$status-*` → `$badge-*`.

## Version 21.1.0

### Removal of Public SCSS Entry Point

The standalone file `src/lib/styles/avatar.scss` has been removed. Styles are now strictly encapsulated within the `HubAvatarComponent` via `avatar.component.scss`.

**Migration Steps:**

1.  **Remove manual style imports:** If you were importing the stylesheet manually in your global `styles.scss`, remove the following line:

    ```scss
    @use 'ng-hub-ui-avatar/src/lib/styles/avatar.scss';
    ```

2.  **Automatic Styling:** The component now handles its own styles. Ensure your build pipeline correctly processes component-level SCSS.

3.  **Theming:** If you need to override component styles, use CSS custom properties (variables) as documented in the `css-variables-reference.md`.

## Version 21.0.0

### Angular Signals Migration

All component inputs have been modernized and migrated to use Angular Signals.
If your application binds to `HubAvatarComponent` properties programmatically or inspects its instance, you will need to read them as functions (e.g., `avatar.size()`) rather than direct properties. Template bindings `[size]="something"` remain unaffected, but internal mechanics now rely on `signal` syntax entirely.

### Removed Avatar Sources

The following avatar provider sources have been removed from the component to streamline dependencies and due to instability or changes in the providers' APIs:

- `googleId`
- `instagramId`
- `skypeId`
- `twitterId`
- `vkontakteId`

**Migration Steps:**
If you were using any of these attributes (e.g., `<hub-avatar twitterId="angular"></hub-avatar>`), you must implement a custom resolution logic in your app and pass the final image string via the `src` direct input, or use an alternative supported source like `githubId` or `gravatarId`.
