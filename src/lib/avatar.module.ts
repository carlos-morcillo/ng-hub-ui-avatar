import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { AvatarConfig } from './avatar-config';
import { AvatarConfigService } from './avatar-config.service';
import { AVATAR_CONFIG } from './avatar-config.token';
import { AvatarComponent } from './avatar.component';
import { AvatarService } from './avatar.service';
import { SourceFactory } from './sources/source.factory';

@NgModule({
	imports: [CommonModule],
	declarations: [AvatarComponent],
	providers: [SourceFactory, AvatarService, AvatarConfigService],
	exports: [AvatarComponent]
})
export class AvatarModule {
	static forRoot(
		avatarConfig?: AvatarConfig
	): ModuleWithProviders<AvatarModule> {
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
