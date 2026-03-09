# Breaking Changes in `ng-hub-ui-avatar`

This document details the breaking changes introduced in major versions of `ng-hub-ui-avatar` and how to migrate your codebase.

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
