import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable, Subject, of, throwError } from 'rxjs';
import { AvatarComponent } from './avatar.component';
import { AvatarModule } from './avatar.module';
import { AvatarService } from './avatar.service';
import { AvatarSource } from './sources/avatar-source.enum';
import { Source } from './sources/source';
import { SourceFactory } from './sources/source.factory';
// TD-139 — imported through the package entry point on purpose: this is the very type a
// consumer has to be able to reach to write a `(clickOnAvatar)` handler.
import { Source as PublicApiSource } from '../public_api';

class AvatarServiceMock {
	fetchAvatar(avatarUrl: string): Observable<{
		avatar_url: string;
	}> {
		return avatarUrl === 'https://api.github.com/users/github-username'
			? of({
					avatar_url: 'https://mocked.url/foo.jpg'
				})
			: throwError(() => new Error('Mocked error for ' + avatarUrl));
	}

	compareSources(source1: AvatarSource, source2: AvatarSource): number {
		return 0;
	}

	isSource(source: string): boolean {
		return true;
	}

	isTextAvatar(sourceType: AvatarSource) {
		return true;
	}

	getRandomColor(avatarText: string): string {
		return '';
	}

	markSourceAsFailed(source: Source): void {}

	sourceHasFailedBefore(source: Source): boolean {
		return source.sourceType === AvatarSource.GRAVATAR;
	}
}

describe('AvatarComponent', () => {
	let component: AvatarComponent;
	let fixture: ComponentFixture<AvatarComponent>;
	let avatarService: AvatarService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AvatarModule],
			providers: [SourceFactory, provideHttpClientTesting(), { provide: AvatarService, useClass: AvatarServiceMock }]
		}).compileComponents();

		fixture = TestBed.createComponent(AvatarComponent);
		component = fixture.componentInstance;
		avatarService = TestBed.inject(AvatarService);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('AvatarText', () => {
		it('should display the initials of the given value', () => {
			fixture.componentRef.setInput('name', 'John Doe');
			fixture.detectChanges();

			const avatarTextEl = fixture.debugElement.query(By.css('.avatar-container > div'));
			expect(avatarTextEl.nativeElement.textContent.trim()).toBe('JD');
		});

		// TD-183 — the fallback chain is derived from the inputs, so emptying them empties the
		// avatar. Patching the chain entry by entry from `SimpleChanges` used to drop the source
		// and stop there: with nothing left to resolve, the initials of a name that had just been
		// unset stayed on screen for good.
		it('stops painting a source once its input is cleared', () => {
			fixture.componentRef.setInput('name', 'John Doe');
			fixture.detectChanges();
			expect(fixture.debugElement.query(By.css('.avatar-container > div')).nativeElement.textContent.trim()).toBe('JD');

			fixture.componentRef.setInput('name', null);
			fixture.detectChanges();

			expect(fixture.debugElement.query(By.css('.avatar-container > div'))).toBeNull();
		});
	});

	// The projected-content flag is written from a content hook, one step outside the pass that
	// paints the avatar, so it has to reach the DOM on its own — and it has to win over a source
	// the consumer also declared.
	describe('projected content', () => {
		@Component({
			standalone: true,
			imports: [AvatarComponent],
			template: `<hub-avatar name="John Doe" bgColor="#123456"><i class="icon"></i></hub-avatar>`
		})
		class ProjectedContentHostComponent {}

		it('paints the projected slot instead of the source, and dresses it', () => {
			const host = TestBed.createComponent(ProjectedContentHostComponent);
			host.detectChanges();

			const container: HTMLElement = host.debugElement.query(By.css('.avatar-container')).nativeElement;
			const slot: HTMLElement = host.debugElement.query(By.css('.hub-avatar__custom')).nativeElement;

			expect(container.classList.contains('hub-avatar--custom')).toBe(true);
			expect(host.debugElement.query(By.css('.avatar-content'))).toBeNull();
			expect(slot.style.backgroundColor).toBe('rgb(18, 52, 86)');
		});
	});

	/**
	 * The repaint an OnPush host will not do on its own.
	 *
	 * The avatar that arrives from the network lands in a subscription, after the pass that
	 * would have painted it. Angular 22 makes OnPush the default for a component that does not
	 * declare a strategy, so this is the write that silently stopped reaching the DOM. What
	 * repaints it now is that the write goes to a signal the template reads, which is why the
	 * component no longer holds a ChangeDetectorRef.
	 */
	it('paints an avatar that arrives after the change detection pass', () => {
		const respuesta = new Subject<{ avatar_url: string }>();
		vi.spyOn(avatarService, 'isTextAvatar').mockReturnValue(false);
		vi.spyOn(avatarService, 'sourceHasFailedBefore').mockReturnValue(false);
		vi.spyOn(avatarService, 'fetchAvatar').mockReturnValue(respuesta.asObservable());

		fixture.componentRef.setInput('githubId', 'github-username');
		fixture.detectChanges();

		expect(fixture.debugElement.query(By.css('.avatar-container > img'))).toBeNull();

		respuesta.next({ avatar_url: 'https://mocked.url/foo.jpg' });
		fixture.detectChanges();

		const avatarImgEl = fixture.debugElement.query(By.css('.avatar-container > img'));
		expect(avatarImgEl).not.toBeNull();
		expect(avatarImgEl.nativeElement.src).toContain('https://mocked.url/foo.jpg');
	});

	it('should not try again failed sources', () => {
		fixture.componentRef.setInput('gravatarId', 'invalid@example.com');
		fixture.componentRef.setInput('name', 'John Doe');
		fixture.detectChanges();

		const avatarTextEl = fixture.debugElement.query(By.css('.avatar-container > div'));
		expect(avatarTextEl.nativeElement.textContent.trim()).toBe('JD');
	});

	it('should fall back to the next source when an async source fails', () => {
		vi.spyOn(avatarService, 'isTextAvatar').mockReturnValue(false);
		vi.spyOn(avatarService, 'sourceHasFailedBefore').mockReturnValue(false);
		fixture.componentRef.setInput('githubId', 'unknown-user');
		fixture.componentRef.setInput('src', 'https://fallback.example/avatar.png');
		fixture.detectChanges();

		const avatarImgEl = fixture.debugElement.query(By.css('.avatar-container > img'));
		expect(avatarImgEl.nativeElement.src).toBe('https://fallback.example/avatar.png');
	});

	// HUBUI-015 — the hash colour must not beat consumer theming.
	describe('autoColor', () => {
		const buildInitials = (name: string): HTMLElement => {
			fixture.componentRef.setInput('name', name);
			fixture.detectChanges();

			return fixture.debugElement.query(By.css('.avatar-container > div')).nativeElement;
		};

		it('applies the hash background colour inline by default', () => {
			vi.spyOn(avatarService, 'getRandomColor').mockReturnValue('rgb(1, 2, 3)');

			expect(buildInitials('John Doe').style.backgroundColor).toBe('rgb(1, 2, 3)');
		});

		it('omits the inline background colour when [autoColor]="false" so the token can theme it', () => {
			const spy = vi.spyOn(avatarService, 'getRandomColor').mockReturnValue('rgb(1, 2, 3)');
			fixture.componentRef.setInput('autoColor', false);

			expect(buildInitials('John Doe').style.backgroundColor).toBe('');
			expect(spy).not.toHaveBeenCalled();
		});

		it('still honours an explicit bgColor even when [autoColor]="false"', () => {
			fixture.componentRef.setInput('autoColor', false);
			fixture.componentRef.setInput('bgColor', '#123456');

			expect(buildInitials('John Doe').style.backgroundColor).toBe('rgb(18, 52, 86)');
		});
	});

	// Any-colour badgeColor: a bareword resolves to its ds token (raw fallback),
	// a literal colour is passed through unchanged onto the `--hub-avatar-badge-color` slot.
	describe('badgeColor', () => {
		it('resolves a semantic name to its ds token with a raw fallback', () => {
			fixture.componentRef.setInput('badgeColor', 'primary');
			fixture.detectChanges();

			expect(fixture.nativeElement.style.getPropertyValue('--hub-avatar-badge-color')).toBe(
				'var(--hub-sys-color-primary, primary)'
			);
		});

		it('passes a literal colour through unchanged', () => {
			fixture.componentRef.setInput('badgeColor', '#ff0000');
			fixture.detectChanges();

			expect(fixture.nativeElement.style.getPropertyValue('--hub-avatar-badge-color')).toBe('#ff0000');
		});
	});

	// TD-096 — the image must be named after the person, never after the URL it was
	// resolved from: a screen reader used to read the whole Gravatar address aloud.
	describe('image alt', () => {
		beforeEach(() => {
			vi.spyOn(avatarService, 'isTextAvatar').mockImplementation((sourceType: AvatarSource) =>
				[AvatarSource.INITIALS, AvatarSource.VALUE].includes(sourceType)
			);
			vi.spyOn(avatarService, 'sourceHasFailedBefore').mockReturnValue(false);
		});

		const buildCustomImage = (): HTMLImageElement => {
			fixture.componentRef.setInput('src', 'https://images.example/john-doe.png');
			fixture.detectChanges();

			return fixture.debugElement.query(By.css('.avatar-container > img')).nativeElement;
		};

		it('names the image after `name` when no alt is given', () => {
			fixture.componentRef.setInput('name', 'John Doe');
			const avatarImgEl = buildCustomImage();

			expect(avatarImgEl.getAttribute('alt')).toBe('John Doe');
		});

		it('leaves the alt empty instead of announcing the source URL', () => {
			const avatarImgEl = buildCustomImage();

			expect(avatarImgEl.getAttribute('alt')).toBe('');
		});

		it('honours an explicit alt over the name', () => {
			fixture.componentRef.setInput('name', 'John Doe');
			fixture.componentRef.setInput('alt', 'Portrait of John Doe');
			const avatarImgEl = buildCustomImage();

			expect(avatarImgEl.getAttribute('alt')).toBe('Portrait of John Doe');
		});

		it('names an asynchronously resolved image too', () => {
			fixture.componentRef.setInput('githubId', 'github-username');
			fixture.componentRef.setInput('name', 'John Doe');
			fixture.detectChanges();

			const avatarImgEl = fixture.debugElement.query(By.css('.avatar-container > img')).nativeElement;
			expect(avatarImgEl.src).toContain('https://mocked.url/foo.jpg');
			expect(avatarImgEl.getAttribute('alt')).toBe('John Doe');
		});
	});

	// TD-139 — the click payload must be reachable as a type and honest as a value: the
	// index it is read from is a cursor over the fallback list and legitimately sits
	// outside it, so the emission used to be `undefined` while typed `Source`.
	describe('clickOnAvatar payload', () => {
		const clickAvatar = (): void => {
			fixture.debugElement.query(By.css('.avatar-container')).nativeElement.click();
		};

		it('emits the source painting the avatar, typed with the exported Source', () => {
			// Typing the handler with the entry-point import is half the assertion: the spec
			// stops compiling if `Source` is not part of the public surface.
			let payload: PublicApiSource | null | undefined;
			component.clickOnAvatar.subscribe((source) => (payload = source));

			fixture.componentRef.setInput('name', 'John Doe');
			fixture.detectChanges();

			clickAvatar();

			expect(payload?.sourceType).toBe(AvatarSource.INITIALS);
		});

		it('reports null, never undefined, when no source has resolved', () => {
			let payload: PublicApiSource | null | undefined = undefined;
			let emitted = false;
			component.clickOnAvatar.subscribe((source) => {
				payload = source;
				emitted = true;
			});

			clickAvatar();

			expect(emitted).toBe(true);
			expect(payload).toBeNull();
		});

		it('reports null once every source has failed', () => {
			vi.spyOn(avatarService, 'sourceHasFailedBefore').mockReturnValue(true);

			let payload: PublicApiSource | null | undefined = undefined;
			component.clickOnAvatar.subscribe((source) => (payload = source));

			fixture.componentRef.setInput('gravatarId', 'invalid@example.com');
			fixture.detectChanges();

			clickAvatar();

			expect(payload).toBeNull();
		});
	});
	// TD-140 — `placeholder` was declared and read nowhere, so an avatar with nothing left to
	// paint rendered an empty circle while the input sat in both READMEs. These hold the
	// contract it now has: last resort, never a source, and it gives up quietly when it breaks.
	describe('placeholder', () => {
		const placeholderImg = () => fixture.debugElement.query(By.css('img.hub-avatar__placeholder'));

		it('paints the placeholder when nothing else resolves', () => {
			fixture.componentRef.setInput('placeholder', 'https://cdn.example/anonymous.png');
			fixture.detectChanges();

			expect(placeholderImg()).not.toBeNull();
			expect(placeholderImg().nativeElement.src).toBe('https://cdn.example/anonymous.png');
		});

		it('renders nothing at all when no placeholder is given', () => {
			fixture.detectChanges();

			expect(fixture.debugElement.query(By.css('.avatar-container img'))).toBeNull();
		});

		it('stays out of the fallback chain, so a resolved source still wins', () => {
			fixture.componentRef.setInput('placeholder', 'https://cdn.example/anonymous.png');
			fixture.componentRef.setInput('name', 'John Doe');
			fixture.detectChanges();

			expect(placeholderImg()).toBeNull();
			expect(fixture.debugElement.query(By.css('div.avatar-content')).nativeElement.textContent.trim()).toBe('JD');
		});

		it('takes over once every declared source has failed', () => {
			vi.spyOn(avatarService, 'sourceHasFailedBefore').mockReturnValue(true);
			fixture.componentRef.setInput('placeholder', 'https://cdn.example/anonymous.png');
			fixture.componentRef.setInput('gravatarId', 'invalid@example.com');
			fixture.detectChanges();

			expect(placeholderImg()).not.toBeNull();
		});

		it('gives up when the placeholder itself fails to load, instead of retrying it forever', () => {
			fixture.componentRef.setInput('placeholder', 'https://cdn.example/missing.png');
			fixture.detectChanges();

			placeholderImg().triggerEventHandler('error', new Event('error'));
			fixture.detectChanges();

			expect(placeholderImg()).toBeNull();
		});

		it('gives a replacement placeholder its own chance after one failed', () => {
			fixture.componentRef.setInput('placeholder', 'https://cdn.example/missing.png');
			fixture.detectChanges();
			placeholderImg().triggerEventHandler('error', new Event('error'));
			fixture.detectChanges();

			fixture.componentRef.setInput('placeholder', 'https://cdn.example/anonymous.png');
			fixture.detectChanges();

			expect(placeholderImg()).not.toBeNull();
		});
	});
});
