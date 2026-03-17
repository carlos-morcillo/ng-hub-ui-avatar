## <ng-hub-ui-avatar>

[![npm version](https://badge.fury.io/js/ng-hub-ui-avatar.svg)](https://badge.fury.io/js/ng-hub-ui-avatar.svg)
[![npm](https://img.shields.io/npm/dt/ng-hub-ui-avatar.svg)](https://www.npmjs.com/package/ng-hub-ui-avatar)
![size](https://img.shields.io/bundlephobia/minzip/ng-hub-ui-avatar.svg)

> **⚠️ BREAKING CHANGES:** Version 21.1.0 removes the need for public stylesheet imports. Styles are now encapsulated within the component. Please read the [BREAKING_CHANGES.md](./BREAKING_CHANGES.md) file before upgrading.

## NPM Project

[ng-hub-ui-avatar](https://www.npmjs.com/package/ng-hub-ui-avatar)

## Inspiration

This project is a fork of [ngx-avatars](https://github.com/Heatmanofurioso/ngx-avatars), which itself continued the original avatar work. This package adapts and maintains the component for modern Angular applications.

## Part of ng-hub-ui Family

This component is part of the ng-hub-ui ecosystem, which includes:

- [ng-hub-ui-paginable](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [ng-hub-ui-modal](https://www.npmjs.com/package/ng-hub-ui-modal)
- [ng-hub-ui-stepper](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [ng-hub-ui-breadcrumbs](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [ng-hub-ui-portal](https://www.npmjs.com/package/ng-hub-ui-portal)

## Description

`ng-hub-ui-avatar` is a universal avatar component for Angular applications.
It can render avatars from multiple sources and apply an automatic fallback strategy when a source fails.

Supported avatar sources:

- Facebook
- Gravatar
- GitHub
- Custom image (`src`)
- Initials (`name`)
- Text value (`value`)

Fallback uses source priority order. By default, the component tries supported sources in its configured order until one succeeds.

## Installation

Install avatar component using [Yarn](https://yarnpkg.com/):

```bash
yarn add ng-hub-ui-avatar
```

or

```bash
npm install ng-hub-ui-avatar --save
```

## Usage

### 1. Import `AvatarModule`

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AvatarModule } from 'ng-hub-ui-avatar';

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, HttpClientModule, AvatarModule],
	bootstrap: [AppComponent]
})
export class AppModule {}
```

- `HttpClientModule` is required for async remote sources (for example Gravatar, Google, GitHub).

### 2. Start using the component

```html
<hub-avatar></hub-avatar>
```

## Examples

```html
<hub-avatar facebookId="nasa"></hub-avatar>
<hub-avatar gravatarId="adde9b2b981a8083cf084c63ad86f753"></hub-avatar>
<hub-avatar gravatarId="user@gmail.com"></hub-avatar>
<hub-avatar githubId="angular"></hub-avatar>
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

## Component API

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
| `borderColor`    | `string`                        | `undefined` | Border color (applies 1px solid border)        |
| `style`          | `Record<string, any> \| string` | `{}`        | Custom inline styles merged into avatar styles |
| `placeholder`    | `string`                        | `undefined` | Reserved placeholder input                     |
| `referrerpolicy` | `string \| null`                | `undefined` | Referrer policy for avatar image requests      |

### Outputs

| Output          | Type                   | Description                                                             |
| --------------- | ---------------------- | ----------------------------------------------------------------------- |
| `clickOnAvatar` | `EventEmitter<Source>` | Fired on avatar click with the source used to render the current avatar |

### Source payload (`clickOnAvatar`)

- `sourceType`: source type (`facebook`, `twitter`, etc.)
- `sourceId`: identifier used by that source
- `getAvatar(size)`: function that resolves avatar URL/value

## Module Configuration (`forRoot`)

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

- `colors?: string[]` -> custom color palette for generated text avatars.
- `sourcePriorityOrder?: AvatarSource[]` -> custom fallback order.
- `disableSrcCache?: boolean` -> disables cache for custom source requests.

Note: `facebookId` is kept as best-effort compatibility source and may fail depending on external API/privacy restrictions.

## Styling

Full CSS variable catalog:

- [`./docs/css-variables-reference.md`](./docs/css-variables-reference.md)

Import the library stylesheet once in your global styles:

```scss
@use 'ng-hub-ui-avatar/src/lib/styles/avatar.scss';
```

Framework-agnostic customization example:

```scss
hub-avatar {
	--hub-avatar-size: 56px;
	--hub-avatar-border-radius: 12px;
	--hub-avatar-fg-color: #ffffff;
	--hub-avatar-bg-color: #0d6efd;
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

## Build and Test

Build library package:

```bash
npm run build avatar -- --configuration production
```

Run avatar tests:

```bash
npm test -- avatar
```

## Release Notes & History

- `1.0.0`: Initial fork and package publication.

## Contributing

Contributions and collaboration are welcome.

- Fork the repository.
- Create a feature branch.
- Commit and push your changes.
- Open a pull request.

## Support the Project

If you find this project helpful and would like to support its development, you can buy me a coffee:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/carlosmorcillo)

Your support helps maintain and improve this project.

## License

This project is licensed under the MIT License.
