# Changelog

All notable changes to this project will be documented in this file.

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
