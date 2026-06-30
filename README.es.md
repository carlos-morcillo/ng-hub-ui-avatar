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
- **Contenido personalizado proyectado**: coloca cualquier icono (FontAwesome, Material…), un SVG en línea, una imagen o un emoji dentro de `<hub-avatar>` y se dimensiona, centra y espacia de forma agnóstica.
- **Reserva automática**: orden de prioridad de fuentes configurable con reserva elegante cuando una fuente falla.
- **Generación de iniciales**: crea avatares de iniciales a partir de un nombre con colores de fondo autogenerados.
- **Fuentes remotas asíncronas**: resuelve avatares remotos (por ejemplo Gravatar) por HTTP con soporte de caché.
- **Forma flexible**: avatares redondos o cuadrados con radio de esquina y borde configurables.
- **Variables CSS**: tematización completa mediante las propiedades personalizadas canónicas `--hub-avatar-*`.
- **API de signals**: inputs/outputs modernos de Angular basados en signals.
- **Standalone primero**: `<hub-avatar>` es un componente standalone — impórtalo directamente, sin `NgModule`. Personaliza colores, orden de prioridad de fuentes y caché con `provideAvatar()`.

## Instalación

```bash
npm install ng-hub-ui-avatar
```

## Inicio rápido

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAvatar } from 'ng-hub-ui-avatar';
import { AppComponent } from './app.component';

bootstrapApplication(AppComponent, {
	providers: [
		provideHttpClient(), // necesario para fuentes remotas asíncronas (Gravatar, GitHub…)
		provideAvatar() // opcional — pásale una config para personalizar fuentes/colores/caché
	]
});
```

Luego importa el componente standalone y úsalo en cualquier plantilla:

```typescript
import { Component } from '@angular/core';
import { AvatarComponent } from 'ng-hub-ui-avatar';

@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [AvatarComponent],
	template: `<hub-avatar name="John Doe" [round]="true" size="64"></hub-avatar>`
})
export class ProfileComponent {}
```

> `provideAvatar()` es opcional — `<hub-avatar>` funciona con valores por defecto. `HttpClient` solo hace falta para fuentes remotas asíncronas (Gravatar, GitHub).

## Uso

`<hub-avatar>` es un componente **standalone**: importa `AvatarComponent` directamente en el `imports` de cualquier componente standalone (como arriba). No hace falta ningún `NgModule`.

### Componentes standalone

```typescript
import { Component } from '@angular/core';
import { AvatarComponent } from 'ng-hub-ui-avatar';

@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [AvatarComponent],
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

### Contenido personalizado (iconos, SVG, imágenes)

Proyecta cualquier contenido directamente dentro de `<hub-avatar>` — un icono de cualquier biblioteca, un `<svg>` en línea, una `<img>` o incluso un emoji — y el avatar lo gestiona de forma agnóstica: lo centra, aplica un padding decente y lo recorta a la forma del avatar (redondo o cuadrado). Los iconos de fuente heredan tamaño y color; los SVG/imágenes en línea rellenan el avatar. Todo escala con `size`.

```html
<!-- FontAwesome (o cualquier fuente de iconos) -->
<hub-avatar><i class="fa-solid fa-user"></i></hub-avatar>

<!-- Material Symbols -->
<hub-avatar size="72"><span class="material-symbols-outlined">rocket_launch</span></hub-avatar>

<!-- SVG en línea -->
<hub-avatar size="64">
	<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 2 7l10 5 10-5-10-5Z" /></svg>
</hub-avatar>

<!-- Emoji -->
<hub-avatar>🚀</hub-avatar>
```

Se activa automáticamente cuando proyectas contenido y tiene prioridad sobre las fuentes de imagen/iniciales. El círculo usa el fondo propio del avatar (`--hub-avatar-bg-color`, el color de acento por defecto) con un primer plano blanco, así que se ve como un círculo de color sin configurar nada. Tematízalo con los inputs habituales `bgColor` / `fgColor` / `borderColor`, y ajusta el tamaño con los tokens `--hub-avatar-content-*` (ver [Estilos](#estilos)).

### Configuración (`provideAvatar`)

`provideAvatar()` permite personalizar el comportamiento en aplicaciones standalone (reemplazo de `AvatarModule.forRoot()`).

```typescript
import { provideAvatar, AvatarSource } from 'ng-hub-ui-avatar';

bootstrapApplication(AppComponent, {
	providers: [
		provideAvatar({
			sourcePriorityOrder: [AvatarSource.CUSTOM, AvatarSource.INITIALS],
			colors: ['#FFB6C1', '#2c3e50', '#95a5a6', '#f39c12', '#1abc9c'],
			disableSrcCache: false
		})
	]
});
```

> **`NgModule` heredado (deprecado):** `AvatarModule` se sigue exportando por compatibilidad y solo reexporta el componente standalone. Está **deprecado** — usa `AvatarComponent` + `provideAvatar()`. `AvatarModule.forRoot(config)` también sigue funcionando.

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
| `badge`          | `string \| number \| boolean \| null` | `null` | Superposición en la esquina. `badge` / `[badge]="true"` → **punto**; `badge="4k"` / `[badge]="9"` → **etiqueta** (pill); `null` / ausente → nada. |
| `badgeColor`     | `HubAvatarBadgeColor \| string \| null` | `null` | Color **semántico** del badge: `primary · secondary · success · danger · warning · info · light · dark` (→ `--hub-sys-color-*`). También acepta cualquier cadena (usa `--hub-avatar-badge-color`). |

`HubAvatarBadgeColor` es un tipo exportado con los colores semánticos: `'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'`. La presencia se expresa con el color: online → `success`, away → `warning`, busy → `danger`, offline → `secondary`.

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

### Contenido personalizado

Cuando proyectas contenido dentro de `<hub-avatar>` (ver [Contenido personalizado](#contenido-personalizado-iconos-svg-im%C3%A1genes)), el **fondo es el del propio avatar** (`--hub-avatar-bg-color`, el **color de acento por defecto**) y el icono usa el **primer plano del avatar** (`--hub-avatar-fg-color`, blanco) — así que se ve como un círculo de color sin configurar nada. Tematízalo con los inputs habituales `bgColor` / `fgColor` (o `--hub-avatar-bg-color` / `--hub-avatar-fg-color`) como cualquier otro avatar. Dos tokens extra controlan el **tamaño** del contenido proyectado, ambos relativos a `--hub-avatar-size`:

| Token                            | Por defecto                           | Descripción                                                          |
| -------------------------------- | ------------------------------------- | -------------------------------------------------------------------- |
| `--hub-avatar-content-padding`   | `calc(var(--hub-avatar-size) * 0.2)`  | Espacio entre el contenido proyectado y el borde del avatar.         |
| `--hub-avatar-content-icon-size` | `calc(var(--hub-avatar-size) * 0.55)` | Tamaño de fuente para iconos de fuente / emoji (lo hereda el glifo). |

```scss
hub-avatar {
	--hub-avatar-bg-color: #e7f1ff; // el fondo propio del avatar — también el círculo del contenido
	--hub-avatar-fg-color: #0d6efd; // color del icono (o usa el input `fgColor`)
	--hub-avatar-content-icon-size: calc(var(--hub-avatar-size) * 0.6);
}
```

### Badge (punto o etiqueta)

El input `badge` muestra una superposición en la esquina — un **punto** (ideal para presencia) o una **etiqueta** (pill) con un contador / texto. Coloréalo con el input semántico `badgeColor`. Todo escala con el avatar.

```html
<!-- punto de presencia: badge (sin contenido) + color semántico -->
<hub-avatar name="Ada Lovelace" badge badgeColor="success"></hub-avatar>   <!-- online -->
<hub-avatar name="Grace Hopper" badge badgeColor="warning"></hub-avatar>   <!-- away -->
<hub-avatar name="Alan Turing" badge badgeColor="danger"></hub-avatar>     <!-- busy -->
<hub-avatar name="Linus T" badge badgeColor="secondary"></hub-avatar>      <!-- offline -->

<!-- badge con etiqueta -->
<hub-avatar name="Carlos M" badge="4k" badgeColor="danger"></hub-avatar>
```

`badgeColor` mapea a `--hub-sys-color-*`. Para un color custom, usa `--hub-avatar-badge-color` (por elemento o con el [mixin de variantes](#variantes-de-color--mixins)):

```scss
hub-avatar[data-badge-color='brand'] {
	--hub-avatar-badge-color: #9333ea;
}
```

Tokens del badge:

| Variable                          | Por defecto                                           | Uso                                    |
| --------------------------------- | ----------------------------------------------------- | -------------------------------------- |
| `--hub-avatar-badge-size`         | `calc(var(--hub-avatar-size, 50px) * 0.28)`           | Diámetro del punto / alto mín. etiqueta |
| `--hub-avatar-badge-offset`       | `0px`                                                 | Separación respecto a la esquina       |
| `--hub-avatar-badge-ring-width`   | `max(2px, calc(var(--hub-avatar-size, 50px) * 0.05))` | Ancho del anillo del badge             |
| `--hub-avatar-badge-ring-color`   | `var(--hub-sys-surface-page, #fff)`                   | Color del anillo del badge             |
| `--hub-avatar-badge-color`        | `var(--hub-sys-color-secondary, #6c757d)`             | Relleno del badge (semántico por `badgeColor`) |
| `--hub-avatar-badge-text-color`   | `var(--hub-ref-color-white, #fff)`                    | Color del texto de la etiqueta         |
| `--hub-avatar-badge-font-size`    | `calc(var(--hub-avatar-size, 50px) * 0.22)`           | Tamaño de fuente de la etiqueta        |
| `--hub-avatar-badge-padding`      | `calc(var(--hub-avatar-size, 50px) * 0.08)`           | Padding horizontal de la etiqueta      |

### Variantes de color & mixins

Cada color semántico funciona de fábrica, tanto para el badge (`badgeColor="success"`) como para un **círculo de avatar** de color (`class="hub-avatar--success"`). Para (re)generarlos en tu CSS — o registrar un **color custom** (p. ej. tu marca) — usa el mixin `hub-avatar-color-variants()`, que emite las variantes de avatar **y** badge en un solo bucle sobre un mapa de colores:

```scss
@use 'ng-hub-ui-avatar/styles/mixins/avatar-theme' as avatar;

// los ocho colores semánticos (por defecto)
@include avatar.hub-avatar-color-variants();

// añade los tuyos — genera <hub-avatar class="hub-avatar--brand"> y badgeColor="brand"
@include avatar.hub-avatar-color-variants((
	'brand': var(--my-brand),
	'accent': #00d4aa
));
```

### Grupo de avatares

Envuelve varios `<hub-avatar>` en un `.hub-avatar-group` para superponerlos en un grupo apilado; cada avatar recibe un anillo para que los bordes se distingan con claridad.

```html
<div class="hub-avatar-group">
	<hub-avatar name="John Doe"></hub-avatar>
	<hub-avatar name="Jane Doe"></hub-avatar>
	<hub-avatar name="Sam Smith"></hub-avatar>
</div>
```

Tokens de grupo:

| Variable                       | Por defecto                                              | Uso                                  |
| ------------------------------ | -------------------------------------------------------- | ------------------------------------ |
| `--hub-avatar-group-overlap`   | `calc(var(--hub-avatar-size, 50px) * 0.3)`              | Superposición horizontal entre avatares |
| `--hub-avatar-group-ring-width`| `max(2px, calc(var(--hub-avatar-size, 50px) * 0.04))`   | Ancho del anillo de cada avatar      |
| `--hub-avatar-group-ring-color`| `var(--hub-sys-surface-page, #fff)`                     | Color del anillo de cada avatar      |

### Mixin de tematización Sass

El mixin `hub-avatar-theme()` tematiza un avatar en una sola llamada — forma/superficie, tipografía de las iniciales, el tamaño del contenido proyectado, el badge y el anillo del grupo. Cada parámetro es opcional y por defecto es `null`, así que solo se emiten como sobrescrituras `--hub-avatar-*` los que pasas. Está basado en tokens, sin dependencia de Bootstrap.

```scss
@use 'ng-hub-ui-avatar/styles/mixins/avatar-theme' as avatar;

hub-avatar.brand {
	@include avatar.hub-avatar-theme(
		$size: 64px,
		$border-radius: 1rem,
		$bg: #ede9fe,
		$fg: #5b21b6,
		$badge-color: #f43f5e
	);
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
