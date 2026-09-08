import { ModuleWithProviders, NgModule } from '@angular/core';

import { AvatarConfig } from './avatar-config';
import { AVATAR_CONFIG } from './avatar-config.token';
import { HubAvatarComponent } from './avatar.component';

/**
 * Backward-compatibility module for `<hub-avatar>`.
 *
 * @deprecated `HubAvatarComponent` is now a standalone component. Import it directly
 * (`imports: [HubAvatarComponent]`) and, if you need custom configuration, register
 * `provideAvatar()` in your application providers. This module only re-exports the
 * standalone component. Scheduled for removal in **23.0.0**.
 */
@NgModule({
	imports: [HubAvatarComponent],
	exports: [HubAvatarComponent]
})
export class AvatarModule {
	/**
	 * @deprecated Use `provideAvatar(config)` with the standalone APIs instead.
	 * Kept so existing `AvatarModule.forRoot()` consumers keep working; it goes with the
	 * module in **23.0.0**.
	 */
	static forRoot(avatarConfig?: AvatarConfig): ModuleWithProviders<AvatarModule> {
		return {
			ngModule: AvatarModule,
			providers: [
				{
					provide: AVATAR_CONFIG,
					useValue: avatarConfig ? avatarConfig : {}
				}
			]
		};
	}
}
