import {
  Component,
  OnChanges,
  OnDestroy,
  SecurityContext,
  SimpleChanges,
  input,
  output
} from '@angular/core';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { map, takeWhile } from 'rxjs/operators';
import { AvatarService } from './avatar.service';
import { AsyncSource } from './sources/async-source';
import { AvatarSource } from './sources/avatar-source.enum';
import { Source } from './sources/source';
import { SourceFactory } from './sources/source.factory';

type Style = Partial<CSSStyleDeclaration>;

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
	styles: [
		`
			:host {
				border-radius: 50%;
			}
		`
	],
	template: `
		<div
		  (click)="onAvatarClicked()"
		  class="avatar-container"
		  [ngStyle]="hostStyle"
		  >
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
		      <div
		        class="avatar-content"
		        [ngStyle]="avatarStyle"
		        >
		        {{ avatarText }}
		      </div>
		    }
		  }
		</div>
		`
})
export class AvatarComponent implements OnChanges, OnDestroy {
	public readonly round = input(true);
	public readonly size = input<string | number>(50);
	public readonly textSizeRatio = input(3);
	public readonly bgColor = input<string>();
	public readonly fgColor = input('#FFF');
	public readonly borderColor = input<string>();
	public readonly style = input<Style>({});
	public readonly cornerRadius = input<string | number>(0);
	public readonly facebook = input<string | null>(undefined, { alias: "facebookId" });
	public readonly twitter = input<string | null>(undefined, { alias: "twitterId" });
	public readonly google = input<string | null>(undefined, { alias: "googleId" });
	public readonly instagram = input<string | null>(undefined, { alias: "instagramId" });
	public readonly vkontakte = input<string | null>(undefined, { alias: "vkontakteId" });
	public readonly skype = input<string | null>(undefined, { alias: "skypeId" });
	public readonly gravatar = input<string | null>(undefined, { alias: "gravatarId" });
	public readonly github = input<string | null>(undefined, { alias: "githubId" });
	public readonly custom = input<string | SafeUrl | null>(undefined, { alias: "src" });
	public readonly customAlt = input<string | null>(undefined, { alias: "alt" });
	public readonly initials = input<string | null>(undefined, { alias: "name" });
	public readonly value = input<string | null>();
	public readonly referrerpolicy = input<string | null>();
	public readonly placeholder = input<string>();
	public readonly initialsSize = input<string | number>(0);

	public readonly clickOnAvatar = output<Source>();

	public isAlive = true;
	public avatarSrc: SafeUrl | null = null;
	public avatarAlt: SafeUrl | null = null;
	public avatarText: string | null = null;
	public avatarStyle: Style = {};
	public hostStyle: Style = {};

	private currentIndex = -1;
	private sources: Source[] = [];

	constructor(
		public sourceFactory: SourceFactory,
		private avatarService: AvatarService,
		private sanitizer: DomSanitizer
	) {}

	public onAvatarClicked(): void {
		this.clickOnAvatar.emit(this.sources[this.currentIndex]);
	}

	/**
	 * Detect inputs change
	 *
	 * param {{ [propKey: string]: SimpleChange }} changes
	 *
	 * memberof AvatarComponent
	 */
	public ngOnChanges(changes: SimpleChanges): void {
		for (const propName in changes) {
			if (this.avatarService.isSource(propName)) {
				const sourceType: AvatarSource =
					AvatarSource[
						propName.toUpperCase() as keyof typeof AvatarSource
					];
				const currentValue = changes[propName].currentValue;
				if (currentValue && typeof currentValue === 'string') {
					this.addSource(sourceType, currentValue);
				} else {
					const sanitized = this.sanitizer.sanitize(
						SecurityContext.URL,
						currentValue
					);
					if (sanitized) {
						this.addSource(sourceType, sanitized);
					} else {
						this.removeSource(sourceType);
					}
				}
			}
		}
		// reinitialize the avatar component when a source property value has changed
		// the fallback system must be re-invoked with the new values.
		this.initializeAvatar();
	}

	/**
	 * Fetch avatar source
	 *
	 * memberOf AvatarComponent
	 */
	public fetchAvatarSource(): void {
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

	public ngOnDestroy(): void {
		this.isAlive = false;
	}

	/**
	 * Initialize the avatar component and its fallback system
	 */
	private initializeAvatar(): void {
		this.currentIndex = -1;
		if (this.sources.length > 0) {
			this.sortAvatarSources();
			this.fetchAvatarSource();
			this.hostStyle = {
				width: this.size() + 'px',
				height: this.size() + 'px'
			};
		}
	}

	private sortAvatarSources(): void {
		this.sources.sort((source1: Source, source2: Source) =>
			this.avatarService.compareSources(
				source1.sourceType,
				source2.sourceType
			)
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
			this.avatarSrc = this.sanitizer.bypassSecurityTrustUrl(
				avatarSource.getAvatar(+this.size())
			);
			this.avatarAlt = avatarSource.getAvatar(+this.size());
		}
	}

	/**
	 *
	 * returns initials style
	 *
	 * memberOf AvatarComponent
	 */
	private getInitialsStyle(avatarValue: string): Style {
		const borderColor = this.borderColor();
  const bgColor = this.bgColor();
  return {
			textAlign: 'center',
			borderRadius: this.round() ? '100%' : this.cornerRadius() + 'px',
			border: borderColor ? '1px solid ' + borderColor : '',
			textTransform: 'uppercase',
			color: this.fgColor(),
			backgroundColor: bgColor
				? bgColor
				: this.avatarService.getRandomColor(avatarValue),
			font:
				Math.floor(+this.size() / this.textSizeRatio()) +
				'px Helvetica, Arial, sans-serif',
			lineHeight: this.size() + 'px',
			...this.style()
		};
	}

	/**
	 *
	 * returns image style
	 *
	 * memberOf AvatarComponent
	 */
	private getImageStyle(): Style {
		const borderColor = this.borderColor();
  return {
			maxWidth: '100%',
			borderRadius: this.round() ? '50%' : this.cornerRadius() + 'px',
			border: borderColor ? '1px solid ' + borderColor : '',
			width: this.size() + 'px',
			height: this.size() + 'px',
			...this.style()
		};
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
			this.sources.push(
				this.sourceFactory.newInstance(sourceType, sourceValue)
			);
		}
	}

	/**
	 * Remove avatar source
	 *
	 * param sourceType avatar source type e.g facebook,twitter, etc.
	 */
	private removeSource(sourceType: AvatarSource): void {
		this.sources = this.sources.filter(
			(source) => source.sourceType !== sourceType
		);
	}
}
