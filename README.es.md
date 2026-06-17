# ng-hub-ui-avatar

**Español** | [English](./README.md)

[![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-avatar.svg)](https://www.npmjs.com/package/ng-hub-ui-avatar)
[![npm](https://img.shields.io/npm/dt/ng-hub-ui-avatar.svg)](https://www.npmjs.com/package/ng-hub-ui-avatar)
[![license](https://img.shields.io/npm/l/ng-hub-ui-avatar.svg)](https://github.com/carlos-morcillo/ng-hub-ui-avatar/blob/main/LICENSE)

Un componente de avatar universal para aplicaciones Angular que muestra avatares a partir de múltiples fuentes (Gravatar, GitHub, Facebook, imágenes personalizadas, iniciales o texto plano) y aplica una estrategia de reserva automática cuando una fuente falla.

> **⚠️ CAMBIOS QUE ROMPEN COMPATIBILIDAD:** La versión 21.1.0 elimina la necesidad de importar hojas de estilo públicas. Los estilos ahora están encapsulados dentro del componente. Lee el archivo [BREAKING_CHANGES.md](./BREAKING_CHANGES.md) antes de actualizar.

## Documentación y ejemplos en vivo

Este paquete forma parte de [Hub UI](https://hubui.dev/), una colección de bibliotecas de componentes Angular para aplicaciones standalone.

- Documentación: https://hubui.dev/avatar/overview/
- Ejemplos en vivo: https://hubui.dev/avatar/examples/
- Hub UI: https://hubui.dev/

## 🧩 Familia de bibliotecas `ng-hub-ui`

Esta biblioteca forma parte del ecosistema **Hub UI**:

- [ng-hub-ui-accordion](https://www.npmjs.com/package/ng-hub-ui-accordion) (obsoleta — usa ng-hub-ui-panels)
- [ng-hub-ui-action-sheet](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [ng-hub-ui-avatar](https://www.npmjs.com/package/ng-hub-ui-avatar) ← Estás aquí
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

## 📑 Tabla de contenidos

- [Documentación y ejemplos en vivo](#documentación-y-ejemplos-en-vivo)
- [🧩 Familia de bibliotecas `ng-hub-ui`](#-familia-de-bibliotecas-ng-hub-ui)
- [Descripción](#descripción)
- [Características](#características)
- [Instalación](#instalación)
- [Inicio rápido](#inicio-rápido)
- [Uso](#uso)
- [Referencia de la API](#referencia-de-la-api)
- [Estilos](#estilos)
- [Changelog](#changelog)
- [Contribuir](#contribuir)
- [Soporte](#soporte)
- [Licencia](#licencia)

## Descripción

`ng-hub-ui-avatar` es un componente de avatar universal para aplicaciones Angular. Puede mostrar avatares a partir de múltiples fuentes y aplicar una estrategia de reserva automática cuando una fuente falla.

Fuentes de avatar soportadas:

- Gravatar
- GitHub
- Facebook
- Imagen personalizada (`src`)
- Iniciales (`name`)
- Valor de texto (`value`)

La reserva utiliza un orden de prioridad de fuentes. Por defecto, el componente prueba las fuentes soportadas en el orden configurado hasta que una tiene éxito.

> Este proyecto es un fork de [ngx-avatars](https://github.com/Heatmanofurioso/ngx-avatars), que a su vez continuó el trabajo original de avatar. Este paquete adapta y mantiene el componente para aplicaciones Angular modernas.

## Características

- **Múltiples fuentes**: Gravatar, GitHub, Facebook, imágenes personalizadas, iniciales y texto plano.
- **Reserva automática**: orden de prioridad de fuentes configurable con reserva elegante cuando una fuente falla.
- **Generación de iniciales**: crea avatares de iniciales a partir de un nombre con colores de fondo autogenerados.
- **Fuentes remotas asíncronas**: resuelve avatares remotos (por ejemplo Gravatar) por HTTP con soporte de caché.
- **Forma flexible**: avatares redondos o cuadrados con radio de esquina y borde configurables.
- **Variables CSS**: tematización completa mediante las propiedades personalizadas canónicas `--hub-avatar-*`.
- **API de signals**: inputs/outputs modernos de Angular basados en signals.
- **Configuración de módulo**: personaliza colores, orden de prioridad de fuentes y comportamiento de caché mediante `AvatarModule.forRoot()`.

## Instalación

```bash
npm install ng-hub-ui-avatar
```

## Inicio rápido

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

> `HttpClient` es necesario para las fuentes remotas asíncronas (por ejemplo Gravatar o GitHub). En aplicaciones con arranque standalone, añade `provideHttpClient()` a los providers de tu aplicación e importa `AvatarModule` en los componentes que usen `<hub-avatar>`.

Luego usa el componente en cualquier plantilla:

```html
<hub-avatar name="John Doe"></hub-avatar>
```

## Uso

`ng-hub-ui-avatar` se distribuye como un módulo de Angular. El componente `<hub-avatar>` está declarado y exportado por `AvatarModule`.

### Aplicaciones basadas en módulos

```typescript
import { AvatarModule } from 'ng-hub-ui-avatar';

@NgModule({
	imports: [AvatarModule]
})
export class FeatureModule {}
```

### Componentes standalone

Como el componente lo proporciona un módulo, importa `AvatarModule` directamente en el array `imports` de tu componente standalone:

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

### Ejemplos

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

### Configuración del módulo (`forRoot`)

`AvatarModule.forRoot()` permite sobrescribir el comportamiento a nivel de módulo.

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

Campos de `AvatarConfig`:

| Campo                 | Tipo             | Descripción                                                  |
| --------------------- | ---------------- | ------------------------------------------------------------ |
| `colors`              | `string[]`       | Paleta de colores personalizada para avatares de texto.      |
| `sourcePriorityOrder` | `AvatarSource[]` | Orden de reserva personalizado entre las fuentes de avatar.  |
| `disableSrcCache`     | `boolean`        | Desactiva la caché para las peticiones de fuente personalizada (imagen). |

Valores del enum `AvatarSource`: `FACEBOOK`, `GRAVATAR`, `GITHUB`, `CUSTOM`, `INITIALS`, `VALUE`.

> Nota: `facebookId` se mantiene como fuente de compatibilidad de mejor esfuerzo y puede fallar según las restricciones de la API externa o de privacidad.

## Referencia de la API

### Inputs

| Input            | Tipo                            | Por defecto | Descripción                                       |
| ---------------- | ------------------------------- | ----------- | ------------------------------------------------- |
| `facebookId`     | `string \| null`                | `undefined` | Id de usuario de Facebook                         |
| `gravatarId`     | `string \| null`                | `undefined` | Email/hash de Gravatar                            |
| `githubId`       | `string \| null`                | `undefined` | Id de usuario de GitHub                           |
| `src`            | `string \| SafeUrl \| null`     | `undefined` | Fuente de imagen personalizada                    |
| `alt`            | `string \| null`                | `undefined` | Texto alternativo de la imagen personalizada      |
| `name`           | `string \| null`                | `undefined` | Texto usado para generar las iniciales            |
| `value`          | `string \| null`                | `undefined` | Valor de avatar de texto directo                  |
| `size`           | `number \| string`              | `50`        | Tamaño del avatar en px                           |
| `textSizeRatio`  | `number`                        | `3`         | Ratio del tamaño de texto (`size / textSizeRatio`) |
| `initialsSize`   | `number \| string`              | `0`         | Longitud máxima de iniciales (`0` sin límite)     |
| `round`          | `boolean`                       | `true`      | Activa la forma circular                          |
| `cornerRadius`   | `number \| string`              | `0`         | Radio en px cuando `round` es `false`             |
| `bgColor`        | `string`                        | `undefined` | Color de fondo personalizado                      |
| `fgColor`        | `string`                        | `#FFF`      | Color de primer plano/texto                       |
| `borderColor`    | `string`                        | `undefined` | Color de borde (aplica un borde sólido de 1px)    |
| `style`          | `Record<string, any> \| string` | `{}`        | Estilos en línea combinados con los del avatar    |
| `placeholder`    | `string`                        | `undefined` | Input de placeholder reservado                    |
| `referrerpolicy` | `string \| null`                | `undefined` | Política de referrer para las peticiones de imagen |

### Outputs

| Output          | Tipo                   | Descripción                                                                |
| --------------- | ---------------------- | -------------------------------------------------------------------------- |
| `clickOnAvatar` | `EventEmitter<Source>` | Se emite al hacer clic en el avatar con la fuente usada para renderizarlo  |

El payload `Source` emitido expone:

- `sourceType`: tipo de fuente (`facebook`, `gravatar`, `github`, `custom`, `initials`, `value`).
- `sourceId`: identificador usado por esa fuente.
- `getAvatar(size)`: función que resuelve la URL/valor del avatar.

## Estilos

Los estilos están encapsulados dentro del componente usando los tokens canónicos `--hub-avatar-*`. Desde la versión 21.1.0 ya no necesitas importar una hoja de estilos global.

Catálogo completo de variables CSS:

- [`./docs/css-variables-reference.md`](./docs/css-variables-reference.md)

Ejemplo de personalización agnóstica de framework:

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

Ejemplo de integración con Bootstrap (opcional):

```scss
hub-avatar {
	--hub-avatar-bg-color: var(--bs-primary);
	--hub-avatar-fg-color: var(--bs-white);
	--hub-avatar-border-color: var(--bs-border-color);
}
```

## Changelog

Consulta [CHANGELOG.md](./CHANGELOG.md) para ver el historial completo de versiones.

## Contribuir

Las contribuciones y la colaboración son bienvenidas.

- Haz un fork del repositorio.
- Crea una rama de funcionalidad.
- Haz commit y push de tus cambios.
- Abre una pull request.

## Soporte

Si este proyecto te resulta útil y quieres apoyar su desarrollo, puedes invitarme a un café:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/carlosmorcillo)

- **Issues**: [GitHub Issues](https://github.com/carlos-morcillo/ng-hub-ui-avatar/issues)
- **Autor**: [Carlos Morcillo](https://www.carlosmorcillo.com)

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.
