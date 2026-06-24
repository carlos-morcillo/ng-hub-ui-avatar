# ng-hub-ui-avatar

[Español](./README.es.md) | **English**

[![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-avatar.svg)](https://www.npmjs.com/package/ng-hub-ui-avatar)
[![npm](https://img.shields.io/npm/dt/ng-hub-ui-avatar.svg)](https://www.npmjs.com/package/ng-hub-ui-avatar)
[![license](https://img.shields.io/npm/l/ng-hub-ui-avatar.svg)](https://github.com/carlos-morcillo/ng-hub-ui-avatar/blob/main/LICENSE)

A universal avatar component for Angular applications that renders avatars from multiple sources (Gravatar, GitHub, Facebook, custom images, initials or plain text) and applies an automatic fallback strategy when a source fails.

> **⚠️ BREAKING CHANGES:** Version 21.1.0 removes the need for public stylesheet imports. Styles are now encapsulated within the component. Please read the [BREAKING_CHANGES.md](./BREAKING_CHANGES.md) file before upgrading.

## Documentation and Live Examples

This package is part of [Hub UI](https://hubui.dev/), a collection of Angular component libraries for standalone apps.

- Docs: https://hubui.dev/avatar/overview/
- Live examples: https://hubui.dev/avatar/examples/
- Hub UI: https://hubui.dev/

## 🧩 Library Family `ng-hub-ui`

This library is part of the **Hub UI** ecosystem:

- [ng-hub-ui-accordion](https://www.npmjs.com/package/ng-hub-ui-accordion) (deprecated — use ng-hub-ui-panels)
- [ng-hub-ui-action-sheet](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [ng-hub-ui-avatar](https://www.npmjs.com/package/ng-hub-ui-avatar) ← You are here
- [ng-hub-ui-board](https://www.npmjs.com/package/ng-hub-ui-board)
- [ng-hub-ui-breadcrumbs](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [ng-hub-ui-calendar](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [ng-hub-ui-dropdown](https://www.npmjs.com/package/ng-hub-ui-dropdown)
- [ng-hub-ui-ds](https://www.npmjs.com/package/ng-hub-ui-ds)
- [ng-hub-ui-forms](https://www.npmjs.com/package/ng-hub-ui-forms)
- [ng-hub-ui-history](https://www.npmjs.com/package/ng-hub-ui-history)
- [ng-hub-ui-milestones](https://www.npmjs.com/package/ng-hub-ui-milestones)
- [ng-hub-ui-modal](https://www.npmjs.com/package/ng-hub-ui-modal)
- [ng-hub-ui-nav](https://www.npmjs.com/package/ng-hub-ui-nav)
- [ng-hub-ui-paginable](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [ng-hub-ui-panels](https://www.npmjs.com/package/ng-hub-ui-panels)
- [ng-hub-ui-portal](https://www.npmjs.com/package/ng-hub-ui-portal)
- [ng-hub-ui-skeleton](https://www.npmjs.com/package/ng-hub-ui-skeleton)
- [ng-hub-ui-sortable](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [ng-hub-ui-stepper](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [ng-hub-ui-utils](https://www.npmjs.com/package/ng-hub-ui-utils)

## 📑 Table of Contents

- [Documentation and Live Examples](#documentation-and-live-examples)
- [🧩 Library Family `ng-hub-ui`](#-library-family-ng-hub-ui)
- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Styling](#styling)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## Description

`ng-hub-ui-avatar` is a universal avatar component for Angular applications. It can render avatars from multiple sources and apply an automatic fallback strategy when a source fails.

Supported avatar sources:

- Gravatar
- GitHub
- Facebook
- Custom image (`src`)
- Initials (`name`)
- Text value (`value`)

Fallback uses a source priority order. By default, the component tries the supported sources in their configured order until one succeeds.

> This project is a fork of [ngx-avatars](https://github.com/Heatmanofurioso/ngx-avatars), which itself continued the original avatar work. This package adapts and maintains the component for modern Angular applications.

## Features

- **Multiple Sources**: Gravatar, GitHub, Facebook, custom images, initials and plain text.
- **Automatic Fallback**: Configurable source priority order with graceful fallback when a source fails.
- **Initials Generation**: Builds initials avatars from a name with auto-generated background colors.
- **Async Remote Sources**: Resolves remote avatars (for example Gravatar) over HTTP with caching support.
- **Flexible Shape**: Round or square avatars with configurable corner radius and border.
- **CSS Variables**: Full theming via canonical `--hub-avatar-*` custom properties.
- **Signals API**: Modern Angular inputs/outputs built on signals.
- **Module Configuration**: Customize colors, source priority order and cache behavior via `AvatarModule.forRoot()`.

## Installation

```bash
npm install ng-hub-ui-avatar
```

## Quick Start

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AvatarModule } from 'ng-hub-ui-avatar';
import { AppComponent } from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, AvatarModule],
	providers: [provideHttpClient()],
	bootstrap: [AppComponent]
})
export class AppModule {}
```

> `HttpClient` is required for async remote sources (for example Gravatar or GitHub). For standalone bootstrap apps, add `provideHttpClient()` to your application providers and import `AvatarModule` in the components that use `<hub-avatar>`.

Then use the component in any template:

```html
<hub-avatar name="John Doe"></hub-avatar>
```

## Usage

`ng-hub-ui-avatar` is distributed as an Angular module. The `<hub-avatar>` component is declared and exported by `AvatarModule`.

### Module-based apps

```typescript
import { AvatarModule } from 'ng-hub-ui-avatar';

@NgModule({
	imports: [AvatarModule]
})
export class FeatureModule {}
```

### Standalone components

Because the component is provided by a module, import `AvatarModule` directly in the `imports` array of your standalone component:

```typescript
import { Component } from '@angular/core';
import { AvatarModule } from 'ng-hub-ui-avatar';

@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [AvatarModule],
	template: `<hub-avatar name="John Doe" [round]="true" size="64"></hub-avatar>`
})
export class ProfileComponent {}
```

### Examples

```html
<hub-avatar gravatarId="adde9b2b981a8083cf084c63ad86f753"></hub-avatar>
<hub-avatar gravatarId="user@gmail.com"></hub-avatar>
<hub-avatar githubId="angular"></hub-avatar>
<hub-avatar facebookId="nasa"></hub-avatar>
<hub-avatar src="assets/avatar.jpg"></hub-avatar>
<hub-avatar name="John Doe"></hub-avatar>
<hub-avatar value="75%"></hub-avatar>

<hub-avatar
	facebookId="userFacebookID"
	name="Haithem Mosbahi"
	src="assets/avatar.jpg"
	value="28%"
	gravatarId="adde9b2b981a8083cf084c63ad86f753"
	size="100"
	[round]="true"
></hub-avatar>
```

### Module configuration (`forRoot`)

`AvatarModule.forRoot()` allows overriding module-level behavior.

```typescript
import { AvatarModule, AvatarSource } from 'ng-hub-ui-avatar';

const avatarSourcesOrder = [AvatarSource.CUSTOM, AvatarSource.INITIALS];
const avatarColors = ['#FFB6C1', '#2c3e50', '#95a5a6', '#f39c12', '#1abc9c'];

@NgModule({
	imports: [
		AvatarModule.forRoot({
			sourcePriorityOrder: avatarSourcesOrder,
			colors: avatarColors,
			disableSrcCache: false
		})
	]
})
export class AppModule {}
```

`AvatarConfig` fields:

| Field                 | Type             | Description                                              |
| --------------------- | ---------------- | -------------------------------------------------------- |
| `colors`              | `string[]`       | Custom color palette for generated text avatars.        |
| `sourcePriorityOrder` | `AvatarSource[]` | Custom fallback order across avatar sources.             |
| `disableSrcCache`     | `boolean`        | Disables the cache for custom (image) source requests.   |

`AvatarSource` enum values: `FACEBOOK`, `GRAVATAR`, `GITHUB`, `CUSTOM`, `INITIALS`, `VALUE`.

> Note: `facebookId` is kept as a best-effort compatibility source and may fail depending on external API/privacy restrictions.

## API Reference

### Inputs

| Input            | Type                            | Default     | Description                                    |
| ---------------- | ------------------------------- | ----------- | ---------------------------------------------- |
| `facebookId`     | `string \| null`                | `undefined` | Facebook user id                               |
| `gravatarId`     | `string \| null`                | `undefined` | Gravatar email/hash                            |
| `githubId`       | `string \| null`                | `undefined` | GitHub user id                                 |
| `src`            | `string \| SafeUrl \| null`     | `undefined` | Custom image source                            |
| `alt`            | `string \| null`                | `undefined` | Custom image alt text                          |
| `name`           | `string \| null`                | `undefined` | Text source used to generate initials          |
| `value`          | `string \| null`                | `undefined` | Direct text avatar value                       |
| `size`           | `number \| string`              | `50`        | Avatar size in px                              |
| `textSizeRatio`  | `number`                        | `3`         | Text size ratio (`size / textSizeRatio`)       |
| `initialsSize`   | `number \| string`              | `0`         | Max initials length (`0` means no limit)       |
| `round`          | `boolean`                       | `true`      | Enables circular shape                         |
| `cornerRadius`   | `number \| string`              | `0`         | Radius in px when `round` is `false`           |
| `bgColor`        | `string`                        | `undefined` | Background color override                      |
| `fgColor`        | `string`                        | `#FFF`      | Foreground/text color                          |
| `borderColor`    | `string`                        | `undefined` | Border color (applies a 1px solid border)      |
| `style`          | `Record<string, any> \| string` | `{}`        | Custom inline styles merged into avatar styles |
| `placeholder`    | `string`                        | `undefined` | Reserved placeholder input                     |
| `referrerpolicy` | `string \| null`                | `undefined` | Referrer policy for avatar image requests      |
| `status`         | `HubAvatarStatus \| string \| null` | `null`  | Presence indicator dot at the bottom-end corner. Built-ins: `online` (success), `away` (warning), `busy` (danger), `offline` (neutral). Any custom string is accepted — set `--hub-avatar-status-color` to colour it. When `null` (default) no dot is rendered. |

`HubAvatarStatus` is an exported type covering the built-in statuses: `'online' | 'away' | 'busy' | 'offline'`.

### Outputs

| Output          | Type                   | Description                                                              |
| --------------- | ---------------------- | ----------------------------------------------------------------------- |
| `clickOnAvatar` | `EventEmitter<Source>` | Fired on avatar click with the source used to render the current avatar |

The emitted `Source` payload exposes:

- `sourceType`: source type (`facebook`, `gravatar`, `github`, `custom`, `initials`, `value`).
- `sourceId`: identifier used by that source.
- `getAvatar(size)`: function that resolves the avatar URL/value.

## Styling

Styles are encapsulated within the component using canonical `--hub-avatar-*` tokens. Since version 21.1.0 you no longer need to import a global stylesheet.

Full CSS variable catalog:

- [`./docs/css-variables-reference.md`](./docs/css-variables-reference.md)

Framework-agnostic customization example:

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

Bootstrap integration example (optional):

```scss
hub-avatar {
	--hub-avatar-bg-color: var(--bs-primary);
	--hub-avatar-fg-color: var(--bs-white);
	--hub-avatar-border-color: var(--bs-border-color);
}
```

### Presence status

Set the `status` input to render a small dot at the bottom-end corner. The dot scales with the avatar (the component exposes the live size on the host as `--hub-avatar-size`).

```html
<hub-avatar name="John Doe" status="online"></hub-avatar>
<hub-avatar name="Jane Doe" status="busy"></hub-avatar>
<hub-avatar name="Custom" status="dnd"></hub-avatar>
```

Built-ins map to the design-system colours: `online` → success, `away` → warning, `busy` → danger, `offline` → neutral. Any custom string is accepted; colour it with `--hub-avatar-status-color`:

```scss
hub-avatar[data-status='dnd'] {
	--hub-avatar-status-color: #9333ea;
}
```

Status tokens:

| Variable                        | Default                                                        | Usage                                  |
| ------------------------------- | ------------------------------------------------------------- | -------------------------------------- |
| `--hub-avatar-status-size`      | `calc(var(--hub-avatar-size, 50px) * 0.28)`                   | Diameter of the status dot             |
| `--hub-avatar-status-offset`    | `0px`                                                         | Inset of the dot from the corner       |
| `--hub-avatar-status-ring-width`| `max(2px, calc(var(--hub-avatar-size, 50px) * 0.05))`        | Width of the ring around the dot       |
| `--hub-avatar-status-ring-color`| `var(--hub-sys-surface-page, #fff)`                          | Colour of the ring around the dot      |
| `--hub-avatar-status-color`     | `var(--hub-sys-text-muted, #6c757d)`                         | Dot colour (re-based per built-in status) |

### Avatar group

Wrap several `<hub-avatar>` in a `.hub-avatar-group` to overlap them into a stacked group; each avatar gets a ring so the edges read cleanly.

```html
<div class="hub-avatar-group">
	<hub-avatar name="John Doe"></hub-avatar>
	<hub-avatar name="Jane Doe"></hub-avatar>
	<hub-avatar name="Sam Smith"></hub-avatar>
</div>
```

Group tokens:

| Variable                       | Default                                                  | Usage                              |
| ------------------------------ | -------------------------------------------------------- | ---------------------------------- |
| `--hub-avatar-group-overlap`   | `calc(var(--hub-avatar-size, 50px) * 0.3)`              | Horizontal overlap between avatars |
| `--hub-avatar-group-ring-width`| `max(2px, calc(var(--hub-avatar-size, 50px) * 0.04))`   | Ring width around each avatar      |
| `--hub-avatar-group-ring-color`| `var(--hub-sys-surface-page, #fff)`                     | Ring colour around each avatar     |

### Sass theming mixin

The `hub-avatar-theme()` mixin themes an avatar in a single include — shape/surface, initials typography, the status dot and the group ring. Every parameter is optional and defaults to `null`, so only the ones you pass are emitted as `--hub-avatar-*` overrides. It is token-based, with no Bootstrap dependency.

```scss
@use 'ng-hub-ui-avatar/styles/mixins/avatar-theme' as *;

hub-avatar.brand {
	@include hub-avatar-theme(
		$size: 64px,
		$border-radius: 1rem,
		$bg: #ede9fe,
		$fg: #5b21b6,
		$status-ring-color: #ede9fe
	);
}
```

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for the full version history.

## Contributing

Contributions and collaboration are welcome.

- Fork the repository.
- Create a feature branch.
- Commit and push your changes.
- Open a pull request.

## Support

If you find this project helpful and would like to support its development, you can buy me a coffee:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/carlosmorcillo)

- **Issues**: [GitHub Issues](https://github.com/carlos-morcillo/ng-hub-ui-avatar/issues)
- **Author**: [Carlos Morcillo](https://www.carlosmorcillo.com)

## License

This project is licensed under the MIT License.
