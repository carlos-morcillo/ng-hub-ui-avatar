import { AfterContentInit, Component, ElementRef, OnChanges, OnDestroy, SecurityContext, SimpleChanges, ViewChild, input, output } from '@angular/core';

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
 * Built-in semantic presence statuses for the avatar indicator dot.
 * `online` → success · `away` → warning · `busy` → danger · `offline` → neutral.
 */
export type HubAvatarStatus = 'online' | 'away' | 'busy' | 'offline';

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
	styleUrl: './avatar.component.scss',
	template: `
		<div (click)="onAvatarClicked()" class="avatar-container" [class.hub-avatar--custom]="hasCustomContent" [style]="hostStyle">
			<span #customContent class="hub-avatar__custom" [style]="customContentStyle"><ng-content></ng-content></span>
			@if (!hasCustomContent) {
				@if (avatarSrc) {
					<img
						[src]="avatarSrc"
						[alt]="customAlt() ? customAlt() : avatarAlt"
						[width]="size()"
						[height]="size()"
						[style]="avatarStyle"
						[referrerPolicy]="referrerpolicy()"
						(error)="fetchAvatarSource()"
						class="avatar-content"
						loading="lazy"
					/>
				} @else {
					@if (avatarText) {
						<div class="avatar-content" [style]="avatarStyle">
							{{ avatarText }}
						</div>
					}
				}
			}
		</div>
		@if (status()) {
			<span class="hub-avatar__status" aria-hidden="true"></span>
		}
	`,
	host: {
		'[attr.data-status]': 'status() || null',
		'[style.--hub-avatar-size]': 'avatarSizePx'
	}
})
export class AvatarComponent implements AfterContentInit, OnChanges, OnDestroy {
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
	/**
	 * Semantic presence indicator shown as a small dot at the bottom-end corner.
	 * Built-ins: `online` (success) · `away` (warning) · `busy` (danger) · `offline`
	 * (neutral). Any custom string is accepted — set `--hub-avatar-status-color`
	 * to colour it. When unset (default) no dot is rendered.
	 */
	readonly status = input<HubAvatarStatus | (string & {}) | null>(null);

	readonly clickOnAvatar = output<Source>();

	/** Wrapper around the projected content (`<ng-content>`), used to detect whether the consumer projected anything. */
	@ViewChild('customContent', { static: true }) private customContentRef?: ElementRef<HTMLElement>;

	/** True when the consumer projected custom content (an icon, SVG, image, …) into the avatar. */
	hasCustomContent = false;

	/** Inline style applied to the projected-content slot (honours `bgColor` / `fgColor` / `borderColor` / `style`). */
	customContentStyle: StyleObject = {};

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
	 * Detects projected content once it is available and, when present, computes its style.
	 * Runs after content init so `<ng-content>` nodes are already in place.
	 */
	ngAfterContentInit(): void {
		const host = this.customContentRef?.nativeElement;
		this.hasCustomContent = !!host && this.hasMeaningfulProjectedContent(host);
		if (this.hasCustomContent) {
			this.customContentStyle = this.getCustomContentStyle();
		}
	}

	/**
	 * Returns true when the projected slot holds a real element or non-whitespace text,
	 * so whitespace-only projection does not flip the avatar into custom-content mode.
	 *
	 * @param host The element wrapping the projected content.
	 */
	private hasMeaningfulProjectedContent(host: HTMLElement): boolean {
		return Array.from(host.childNodes).some(
			(node) =>
				node.nodeType === Node.ELEMENT_NODE ||
				(node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim().length > 0)
		);
	}

	/**
	 * Builds the inline style for the projected-content slot. Sensible visible defaults
	 * (a themed background circle and a readable foreground colour) come from CSS tokens;
	 * the `bgColor` / `fgColor` / `borderColor` / `style` inputs override them when set.
	 */
	private getCustomContentStyle(): StyleObject {
		const borderColor = this.borderColor();
		const bgColor = this.bgColor();
		const hasCustomFgColor = this.fgColor() !== '#FFF';
		return {
			backgroundColor: bgColor ? bgColor : undefined,
			color: hasCustomFgColor ? this.fgColor() : undefined,
			border: borderColor ? '1px solid ' + borderColor : undefined,
			...this.getCustomStyleObject()
		};
	}

	/**
	 * The avatar size as a px string. Exposed on the host as `--hub-avatar-size`
	 * so the status dot (and any token-driven child) scales with the avatar.
	 */
	get avatarSizePx(): string {
		return (parseFloat(String(this.size())) || 50) + 'px';
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
		if (this.hasCustomContent) {
			this.customContentStyle = this.getCustomContentStyle();
		}
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
