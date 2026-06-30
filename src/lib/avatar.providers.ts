import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AvatarConfig } from './avatar-config';
import { AVATAR_CONFIG } from './avatar-config.token';

/**
 * Registers the avatar configuration for standalone applications.
 *
 * Standalone-friendly replacement for `AvatarModule.forRoot()`. Add it to your
 * `bootstrapApplication` providers (or a route's `providers`) to customise the
 * avatar source priority, colour palette or src-cache behaviour. Calling it is
 * optional — `<hub-avatar>` works out of the box with sensible defaults.
 *
 * ```ts
 * import { provideAvatar } from 'ng-hub-ui-avatar';
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideAvatar({ sourcePriorityOrder: [AvatarSource.GRAVATAR, AvatarSource.INITIALS] })
 *   ]
 * });
 * ```
 *
 * @param config Optional avatar configuration.
 * @returns Environment providers to add to the application config.
 */
export function provideAvatar(config?: AvatarConfig): EnvironmentProviders {
	return makeEnvironmentProviders([
		{
			provide: AVATAR_CONFIG,
			useValue: config ?? {}
		}
	]);
}
