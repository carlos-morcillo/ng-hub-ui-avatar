import { Inject, Injectable, Optional } from '@angular/core';

import { AvatarConfig } from './avatar-config';
import { AVATAR_CONFIG } from './avatar-config.token';
import { AvatarSource } from './sources/avatar-source.enum';

@Injectable({ providedIn: 'root' })
export class AvatarConfigService {
	constructor(
		@Optional()
		@Inject(AVATAR_CONFIG)
		public userConfig: AvatarConfig
	) {}

	public getAvatarSources(defaultSources: AvatarSource[]): AvatarSource[] {
		if (
			this.userConfig &&
			this.userConfig.sourcePriorityOrder &&
			this.userConfig.sourcePriorityOrder.length
		) {
			const uniqueSources = [
				...new Set(this.userConfig.sourcePriorityOrder)
			];
			const validSources = uniqueSources.filter((source) =>
				defaultSources.includes(source)
			);
			return [
				...validSources,
				...defaultSources.filter(
					(source) => !validSources.includes(source)
				)
			];
		}
		return defaultSources;
	}

	public getAvatarColors(defaultColors: string[]): string[] {
		return (
			(this.userConfig &&
				this.userConfig.colors &&
				this.userConfig.colors.length &&
				this.userConfig.colors) ||
			defaultColors
		);
	}

	public getDisableSrcCache(defaultDisableSrcCache: boolean): boolean {
		if (
			this.userConfig == null ||
			this.userConfig.disableSrcCache == null
		) {
			return defaultDisableSrcCache;
		} else {
			return this.userConfig.disableSrcCache;
		}
	}
}
