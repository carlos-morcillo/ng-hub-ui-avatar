# Breaking Changes in `ng-hub-ui-avatar`

This document details the breaking changes introduced in major versions of `ng-hub-ui-avatar` and how to migrate your codebase.

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
