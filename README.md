## &lt;ng-hub-ui-avatar&gt;

[![npm version](https://badge.fury.io/js/ng-hub-ui-avatar.svg)](https://badge.fury.io/js/ng-hub-ui-avatar.svg)
[![npm](https://img.shields.io/npm/dt/ng-hub-ui-avatar.svg)](https://www.npmjs.com/package/ng-hub-ui-avatar)
![size](https://img.shields.io/bundlephobia/minzip/ng-hub-ui-avatar.svg)

## NPM Project

[ng-hub-ui-avatar](https://www.npmjs.com/package/ng-hub-ui-avatar)

## Inspiration

This project is a fork of [ngx-avatars](https://github.com/Heatmanofurioso/ngx-avatars), which itself was a continuation of ngx-avatar. The goal is to maintain and evolve the solution by updating it to Angular 19 and providing ongoing maintenance. All credit goes to the original authors and contributors of both projects.

## Part of ng-hub-ui Family

This component is part of the ng-hub-ui ecosystem, which includes:

- [ng-hub-ui-table](https://www.npmjs.com/package/ng-hub-ui-table)
- [ng-hub-ui-modal](https://www.npmjs.com/package/ng-hub-ui-modal)
- [ng-hub-ui-stepper](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [ng-hub-ui-breadcrumbs](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [ng-hub-ui-portal](https://www.npmjs.com/package/ng-hub-ui-portal)

## Description

A universal avatar component for Angular 19 applications that fetches / generates avatar based on the information you have about the user. The component has a fallback system that if for example an invalid Facebook ID is used it will try google ID and so on.

You can use this component whether you have a single source or a multiple avatar sources. In this case the fallback system will fetch the first valid avatar.

Moreover, the component can shows name initials or simple value as avatar.

![Angular Avatar component preview](https://cdn.rawgit.com/HaithemMosbahi/ngx-avatar/0bac9072/demo.png)

Supported avatar sources:

- Facebook
- Google
- Twitter
- Instagram
- Vkontakte (VK)
- Skype
- Gravatar
- GitHub
- Custom image
- name initials
- value

The fallback system uses the same order as the above source list, Facebook has the highest priority, if it fails, google source will be used, and so on.

If you enjoy watching videos, check out this [tutorial](https://medium.com/letsboot/lets-play-with-ngx-avatar-ec585dc39161) on medium which explains how to use ngx-avatars in your angular application.

Check out this [link](https://stackblitz.com/edit/ngx-avatar-demo) to play with ngx-avatars :grinning:

## Installation

Install avatar component using [Yarn](https://yarnpkg.com/):

```bash
$ yarn add ng-hub-ui-avatar
```

or

```bash
$ npm install ng-hub-ui-avatar --save
```

## Usage

1. Import AvatarModule:

Once you have installed ng-hub-ui-avatar, you can import it in your `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

// Import your AvatarModule
import { AvatarModule } from 'ng-hub-ui-avatar';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		// Specify AvatarModule as an import
		AvatarModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
```

- `HttpClientModule` is mandatory in order to fetch the avatar from external sources (Gravatar, Google, ...).

2. Start using it:

Once the AvatarModule is imported, you can start using the component in your Angular application:

```html
<hub-avatar></hub-avatar>
```

## Examples

```html
<hub-avatar facebookId="1508319875"></hub-avatar>
<hub-avatar googleId="1508319875"></hub-avatar>
<hub-avatar twitterId="1508319875"></hub-avatar>
<hub-avatar instagramId="dccomics" size="70"></hub-avatar>
<hub-avatar skypeId="1508319875"></hub-avatar>
<hub-avatar gravatarId="adde9b2b981a8083cf084c63ad86f753"></hub-avatar>
<hub-avatar gravatarId="user@gmail.com"></hub-avatar>
<hub-avatar src="assets/avatar.jpg"></hub-avatar>
<hub-avatar name="John Doe"></hub-avatar>
<hub-avatar value="75%"></hub-avatar>

<hub-avatar facebookId="userFacebookID" skypeId="userSkypeID" googleId="google" name="Haithem Mosbahi" src="assets/avatar.jpg" value="28%" twitterId="twitter" gravatarId="adde9b2b981a8083cf084c63ad86f753" size="100" [round]="true"> </hub-avatar>
```

## Options

| Attribute        | Type      | Default   | Description                                                                                                                                                                              |
| ---------------- | --------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `facebookId`     | _string_  | null      |                                                                                                                                                                                          | Facebook ID                                                         |
| `googleId`       | _string_  | null      |                                                                                                                                                                                          | Google ID                                                           |
| `twitterId`      | _string_  | null      |                                                                                                                                                                                          | Twitter Handle                                                      |
| `instagramId`    | _string_  | null      |                                                                                                                                                                                          | Instagram Handle                                                    |
| `vkontakteId`    | _string_  | null      |                                                                                                                                                                                          | VK ID                                                               |
| `skypeId`        | _string_  | null      |                                                                                                                                                                                          | Skype ID                                                            |
| `gravatarId`     | _string_  | null      |                                                                                                                                                                                          | email or md5 email related to gravatar                              |
| `githubId`       | _string_  | null      |                                                                                                                                                                                          | Github ID                                                           |
| `src`            | _string_  | null      |                                                                                                                                                                                          | Fallback image to use                                               |
| `name`           | _string_  | null      |                                                                                                                                                                                          | Will be used to generate avatar based on the initials of the person |
| `value`          | _string_  | null      |                                                                                                                                                                                          | Show a value as avatar                                              |
| `initialsSize`   | _number_  | 0         | Restricts the size of initials - it goes along with the name property and can be used to fix the number of characters that will be displayed as initials. The `0` means no restrictions. |
| `bgColor`        | _string_  | random    | Give the background a fixed color with a hex like for example #FF0000                                                                                                                    |
| `fgColor`        | _string_  | #FFF      | Give the text a fixed color with a hex like for example #FF0000                                                                                                                          |
| `size`           | _number_  | 50        | Size of the avatar                                                                                                                                                                       |
| `textSizeRatio`  | _number_  | 3         | For text based avatars the size of the text as a fragment of size (size / textSizeRatio)                                                                                                 |
| `round`          | _boolean_ | true      | Round the avatar corners                                                                                                                                                                 |
| `cornerRadius`   | _number_  | 0         | Square avatars can have rounded corners using this property                                                                                                                              |
| `borderColor`    | _string_  | undefined | Add border with the given color. border's default style is '1px solid borderColor'                                                                                                       |
| `style`          | _object_  |           | Style that will be applied on the root element                                                                                                                                           |
| `clickOnAvatar`  | _Output_  |           | Fired when the avatar is clicked. The component emits the source object that has been used to fetch the avatar.                                                                          |
| `referrerpolicy` | _string_  | null      | Adds the noreferrer flag to the img tag.                                                                                                                                                 |

The source object has the following properties:

- sourceType : avatar source ( Facebook, twitter, etc)
- sourceId : identifier of the user
- getAvatar(size) : method to fetch user avatar from the current source

## Override Avatar Configuration

The avatar module provides the possibility of customizing the avatar component by overriding some of its options. For example, the avatar module comes with a set of default colors used to randomly fill the background color of the avatar. Thus, it's possible to change the default list of colors and to pass your own list.

All you need to do is to configure the AvatarModule by calling **forRoot** method. The forRoot method takes an AvatarConfig Object that contains the overridden options.

AvatarConfig interface has two properties:

- **avatarColors:** allows the user to override the default avatar colors by providing a new set of colors
- **sourcePriorityOrder:** allows the user to change the avatar source priority order. If you want the avatar component to look for user initials first, twitter before facebook or any order you want, this is can be done using the sourcePriorityOrder property

The following code shows an example on how to import the AvatarModule with your own source priority order.
With the given order, the avatar component will look first for the custom avatar image and then for user initials and after that it will look the rest of sources.

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { UserService } from './user.service';
import { AvatarModule, AvatarSource } from 'ngx-avatars';

const avatarSourcesOrder = [AvatarSource.CUSTOM, AvatarSource.INITIALS];

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		// import AvatarModule in your app with your own configuration
		AvatarModule.forRoot({
			sourcePriorityOrder: avatarSourcesOrder
		})
	],
	providers: [UserService],
	bootstrap: [AppComponent]
})
export class AppModule {}
```

Here's an example on how to import the AvatarModule with your own set of colors.

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UserService } from './user.service';
import { AvatarModule } from 'ngx-avatars';
import { HttpClientModule } from '@angular/common/http';

const avatarColors = ['#FFB6C1', '#2c3e50', '#95a5a6', '#f39c12', '#1abc9c'];

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		// import AvatarModule in your app with your own configuration
		AvatarModule.forRoot({
			colors: avatarColors
		})
	],
	providers: [UserService],
	bootstrap: [AppComponent]
})
export class AppModule {}
```

**Avatar Styling**

In addition to the style attribute, ngx-avatar style can be customized using css classes. Thus, the generated code offers two css classes that can be overridden :

- **avatar-container** : class that represents the avatar container - the host element. Styles in this class will be applied on the avatar whether is an image or text.
- **avatar-content** : css class that represents the avatar element which is embedded inside the avatar-container.

To overcome Angular's view encapsulation, you may need to use the /deep/ operator to target it. Here's an example that shows how to override ngx-avatars style :

```html
<ngx-avatars class="my-avatar" value="HM"> </ngx-avatars>
```

Your css file might look like this

```css
.my-avatar /deep/ .avatar-content {
	background-color: red !important;
}
```

## Release Notes & History

- 1.0.0: Initial fork from ngx-avatars, updated to Angular 19

## Contributing

Contributions and all possible collaboration are welcome.

- Fork it!
- Create your feature branch: git checkout -b my-new-feature
- Commit your changes: git commit -am 'Add some feature'
- Push to the branch: git push origin my-new-feature
- Submit a pull request :D

# Testing

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Support the Project

If you find this project helpful and would like to support its development, you can buy me a coffee:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/carlosmorcillo)

Your support is greatly appreciated and helps maintain and improve this project!

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/carlos-morcillo) file for details.

---

Made with ❤️ by [Carlos Morcillo Fernández](https://www.carlosmorcillo.com/)
