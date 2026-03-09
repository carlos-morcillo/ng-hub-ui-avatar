import { Component, OnChanges, OnDestroy, SecurityContext, SimpleChanges, input, output } from '@angular/core';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { map, takeWhile } from 'rxjs/operators';
import { AvatarService } from './avatar.service';
import { AsyncSource } from './sources/async-source';
import { AvatarSource } from './sources/avatar-source.enum';
import { Source } from './sources/source';
import { SourceFactory } from './sources/source.factory';

type StyleObject = Record<string, string | number | null | undefined>;
type Style = StyleObject | string;

/**
 * Universal avatar component that
 * generates avatar from different sources
 *
 * export
 * class AvatarComponent
 * implements {OnChanges}
 */

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'hub-avatar',
	standalone: false,
	template: `
		<div (click)="onAvatarClicked()" class="avatar-container" [ngStyle]="hostStyle">
			@if (avatarSrc) {
				<img
					[src]="avatarSrc"
					[alt]="customAlt() ? customAlt() : avatarAlt"
					[width]="size()"
					[height]="size()"
					[ngStyle]="avatarStyle"
					[referrerPolicy]="referrerpolicy()"
					(error)="fetchAvatarSource()"
					class="avatar-content"
					loading="lazy"
				/>
			} @else {
				@if (avatarText) {
					<div class="avatar-content" [ngStyle]="avatarStyle">
						{{ avatarText }}
					</div>
				}
			}
		</div>
	`
})
export class AvatarComponent implements OnChanges, OnDestroy {
	readonly round = input(true);
	readonly size = input<string | number>(50);
	readonly textSizeRatio = input(3);
	readonly bgColor = input<string>();
	readonly fgColor = input('#FFF');
	readonly borderColor = input<string>();
	readonly style = input<Style>({});
	readonly cornerRadius = input<string | number>(0);
	readonly facebook = input<string | null>(undefined, { alias: 'facebookId' });
	readonly gravatar = input<string | null>(undefined, { alias: 'gravatarId' });
	readonly github = input<string | null>(undefined, { alias: 'githubId' });
	readonly custom = input<string | SafeUrl | null>(undefined, { alias: 'src' });
	readonly customAlt = input<string | null>(undefined, { alias: 'alt' });
	readonly initials = input<string | null>(undefined, { alias: 'name' });
	readonly value = input<string | null>();
	readonly referrerpolicy = input<string | null>();
	readonly placeholder = input<string>();
	readonly initialsSize = input<string | number>(0);

	readonly clickOnAvatar = output<Source>();

	isAlive = true;
	avatarSrc: SafeUrl | null = null;
	avatarAlt: SafeUrl | null = null;
	avatarText: string | null = null;
	avatarStyle: StyleObject = {};
	hostStyle: StyleObject = {};

	private currentIndex = -1;
	private sources: Source[] = [];

	constructor(
		private sourceFactory: SourceFactory,
		private avatarService: AvatarService,
		private sanitizer: DomSanitizer
	) {}

	onAvatarClicked(): void {
		this.clickOnAvatar.emit(this.sources[this.currentIndex]);
	}

	/**
	 * Detect inputs change
	 *
	 * param {{ [propKey: string]: SimpleChange }} changes
	 *
	 * memberof AvatarComponent
	 */
	ngOnChanges(changes: SimpleChanges): void {
		for (const propName in changes) {
			if (this.avatarService.isSource(propName)) {
				const sourceType: AvatarSource = AvatarSource[propName.toUpperCase() as keyof typeof AvatarSource];
				const currentValue = changes[propName].currentValue;
				if (currentValue && typeof currentValue === 'string') {
					this.addSource(sourceType, currentValue);
				} else {
					const sanitized = this.sanitizer.sanitize(SecurityContext.URL, currentValue);
					if (sanitized) {
						this.addSource(sourceType, sanitized);
					} else {
						this.removeSource(sourceType);
					}
				}
			}
		}
		// Reinitialize when any source input changes so fallback order is recalculated.
		this.initializeAvatar();
	}

	/**
	 * Fetch avatar source
	 *
	 * memberOf AvatarComponent
	 */
	fetchAvatarSource(): void {
		const previousSource = this.sources[this.currentIndex];
		if (previousSource) {
			this.avatarService.markSourceAsFailed(previousSource);
		}

		const source = this.findNextSource();
		if (!source) {
			return;
		}

		if (this.avatarService.isTextAvatar(source.sourceType)) {
			this.buildTextAvatar(source);
			this.avatarSrc = null;
		} else {
			this.buildImageAvatar(source);
		}
	}

	private findNextSource(): Source | null {
		while (++this.currentIndex < this.sources.length) {
			const source = this.sources[this.currentIndex];
			if (source && !this.avatarService.sourceHasFailedBefore(source)) {
				return source;
			}
		}

		return null;
	}

	ngOnDestroy(): void {
		this.isAlive = false;
	}

	/**
	 * Initialize the avatar component and its fallback system
	 */
	private initializeAvatar(): void {
		const computedBorderRadius = this.round()
			? '50%'
			: this.cornerRadius() + 'px';
		this.hostStyle = {
			width: this.size() + 'px',
			height: this.size() + 'px',
			borderRadius: computedBorderRadius
		};

		this.currentIndex = -1;
		if (this.sources.length > 0) {
			this.sortAvatarSources();
			this.fetchAvatarSource();
		}
	}

	private sortAvatarSources(): void {
		this.sources.sort((source1: Source, source2: Source) =>
			this.avatarService.compareSources(source1.sourceType, source2.sourceType)
		);
	}

	private buildTextAvatar(avatarSource: Source): void {
		this.avatarText = avatarSource.getAvatar(+this.initialsSize());
		this.avatarStyle = this.getInitialsStyle(avatarSource.sourceId);
	}

	private buildImageAvatar(avatarSource: Source): void {
		this.avatarStyle = this.getImageStyle();
		if (avatarSource instanceof AsyncSource) {
			this.fetchAndProcessAsyncAvatar(avatarSource);
		} else {
			this.avatarSrc = this.sanitizer.bypassSecurityTrustUrl(avatarSource.getAvatar(+this.size()));
			this.avatarAlt = avatarSource.getAvatar(+this.size());
		}
	}

	/**
	 *
	 * returns initials style
	 *
	 * memberOf AvatarComponent
	 */
	private getInitialsStyle(avatarValue: string): StyleObject {
		const borderColor = this.borderColor();
		const bgColor = this.bgColor();
		const hasCornerRadius = !this.round() || +this.cornerRadius() > 0;
		const hasCustomFgColor = this.fgColor() !== '#FFF';
		return {
			textAlign: 'center',
			borderRadius: hasCornerRadius ? (this.round() ? '100%' : this.cornerRadius() + 'px') : undefined,
			border: borderColor ? '1px solid ' + borderColor : undefined,
			textTransform: 'uppercase',
			color: hasCustomFgColor ? this.fgColor() : undefined,
			backgroundColor: bgColor ? bgColor : this.avatarService.getRandomColor(avatarValue),
			font: Math.floor(+this.size() / this.textSizeRatio()) + 'px Helvetica, Arial, sans-serif',
			lineHeight: this.size() + 'px',
			...this.getCustomStyleObject()
		};
	}

	/**
	 *
	 * returns image style
	 *
	 * memberOf AvatarComponent
	 */
	private getImageStyle(): StyleObject {
		const borderColor = this.borderColor();
		const hasCornerRadius = !this.round() || +this.cornerRadius() > 0;
		return {
			maxWidth: '100%',
			borderRadius: hasCornerRadius ? (this.round() ? '50%' : this.cornerRadius() + 'px') : undefined,
			border: borderColor ? '1px solid ' + borderColor : undefined,
			width: this.size() + 'px',
			height: this.size() + 'px',
			...this.getCustomStyleObject()
		};
	}

	private getCustomStyleObject(): StyleObject {
		const customStyle = this.style();
		if (!customStyle) {
			return {};
		}

		if (typeof customStyle === 'string') {
			return this.parseInlineStyleString(customStyle);
		}

		return customStyle;
	}

	private parseInlineStyleString(styleString: string): StyleObject {
		const styleObject: StyleObject = {};
		styleString
			.split(';')
			.map((declaration) => declaration.trim())
			.filter((declaration) => declaration.length > 0)
			.forEach((declaration) => {
				const separatorIndex = declaration.indexOf(':');
				if (separatorIndex <= 0) {
					return;
				}
				const property = declaration.slice(0, separatorIndex).trim();
				const value = declaration.slice(separatorIndex + 1).trim();
				if (property && value) {
					styleObject[property] = value;
				}
			});
		return styleObject;
	}

	/**
	 * Fetch avatar image asynchronously.
	 *
	 * param {Source} source represents avatar source
	 * memberof AvatarComponent
	 */
	private fetchAndProcessAsyncAvatar(source: AsyncSource): void {
		if (this.avatarService.sourceHasFailedBefore(source)) {
			return;
		}

		this.avatarService
			.fetchAvatar(source.getAvatar(+this.size()))
			.pipe(
				takeWhile(() => this.isAlive),
				map((response) => source.processResponse(response, +this.size()))
			)
			.subscribe({
				next: (avatarSrc) => (this.avatarSrc = avatarSrc),
				error: () => {
					this.fetchAvatarSource();
				}
			});
	}

	/**
	 * Add avatar source
	 *
	 * param sourceType avatar source type e.g facebook,twitter, etc.
	 * param sourceValue  source value e.g facebookId value, etc.
	 */
	private addSource(sourceType: AvatarSource, sourceValue: string): void {
		const source = this.sources.find((s) => s.sourceType === sourceType);
		if (source) {
			source.sourceId = sourceValue;
		} else {
			this.sources.push(this.sourceFactory.newInstance(sourceType, sourceValue));
		}
	}

	/**
	 * Remove avatar source
	 *
	 * param sourceType avatar source type e.g facebook,twitter, etc.
	 */
	private removeSource(sourceType: AvatarSource): void {
		this.sources = this.sources.filter((source) => source.sourceType !== sourceType);
	}
}
