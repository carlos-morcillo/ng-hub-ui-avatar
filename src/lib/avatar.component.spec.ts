import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable, of, throwError } from 'rxjs';
import { AvatarComponent } from './avatar.component';
import { AvatarModule } from './avatar.module';
import { AvatarService } from './avatar.service';
import { AvatarSource } from './sources/avatar-source.enum';
import { Source } from './sources/source';
import { SourceFactory } from './sources/source.factory';

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

    markSourceAsFailed(source: Source): void { }

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
            providers: [
                SourceFactory,
                provideHttpClientTesting(),
                { provide: AvatarService, useClass: AvatarServiceMock }
            ]
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
            component.ngOnChanges({
                initials: new SimpleChange(null, 'John Doe', true)
            });

            fixture.detectChanges();

            const avatarTextEl = fixture.debugElement.query(By.css('.avatar-container > div'));
            expect(avatarTextEl.nativeElement.textContent.trim()).toBe('JD');
        });
    });

    it('should not try again failed sources', () => {
        fixture.componentRef.setInput('gravatarId', 'invalid@example.com');
        fixture.componentRef.setInput('name', 'John Doe');
        component.ngOnChanges({
            gravatar: new SimpleChange(null, 'invalid@example.com', true),
            initials: new SimpleChange(null, 'John Doe', true)
        });

        fixture.detectChanges();

        const avatarTextEl = fixture.debugElement.query(By.css('.avatar-container > div'));
        expect(avatarTextEl.nativeElement.textContent.trim()).toBe('JD');
    });

    it('should fall back to the next source when an async source fails', () => {
        vi.spyOn(avatarService, 'isTextAvatar').mockReturnValue(false);
        vi.spyOn(avatarService, 'sourceHasFailedBefore').mockReturnValue(false);
        fixture.componentRef.setInput('githubId', 'unknown-user');
        fixture.componentRef.setInput('src', 'https://fallback.example/avatar.png');
        component.ngOnChanges({
            github: new SimpleChange(null, 'unknown-user', true),
            custom: new SimpleChange(null, 'https://fallback.example/avatar.png', true)
        });

        fixture.detectChanges();

        const avatarImgEl = fixture.debugElement.query(By.css('.avatar-container > img'));
        expect(avatarImgEl.nativeElement.src).toBe('https://fallback.example/avatar.png');
    });

    // HUBUI-015 — the hash colour must not beat consumer theming.
    describe('autoColor', () => {
        beforeEach(() => {
            // The shared mock reports every property as an avatar source; scope it back
            // to the real source inputs so setting `autoColor` / `bgColor` isn't mistaken
            // for a source in the auto-fired ngOnChanges.
            vi.spyOn(avatarService, 'isSource').mockImplementation((prop: string) =>
                ['facebook', 'gravatar', 'github', 'custom', 'initials', 'value'].includes(prop)
            );
        });

        const buildInitials = (name: string) => {
            fixture.componentRef.setInput('name', name);
            component.ngOnChanges({ initials: new SimpleChange(null, name, true) });
            fixture.detectChanges();
        };

        it('applies the hash background colour inline by default', () => {
            vi.spyOn(avatarService, 'getRandomColor').mockReturnValue('rgb(1, 2, 3)');
            buildInitials('John Doe');
            expect(component.avatarStyle['backgroundColor']).toBe('rgb(1, 2, 3)');
        });

        it('omits the inline background colour when [autoColor]="false" so the token can theme it', () => {
            const spy = vi.spyOn(avatarService, 'getRandomColor').mockReturnValue('rgb(1, 2, 3)');
            fixture.componentRef.setInput('autoColor', false);
            buildInitials('John Doe');
            expect(component.avatarStyle['backgroundColor']).toBeUndefined();
            expect(spy).not.toHaveBeenCalled();
        });

        it('still honours an explicit bgColor even when [autoColor]="false"', () => {
            fixture.componentRef.setInput('autoColor', false);
            fixture.componentRef.setInput('bgColor', '#123456');
            buildInitials('John Doe');
            expect(component.avatarStyle['backgroundColor']).toBe('#123456');
        });
    });

    // Any-colour badgeColor: a bareword resolves to its ds token (raw fallback),
    // a literal colour is passed through unchanged onto the `--hub-avatar-badge-color` slot.
    describe('badgeColor', () => {
        beforeEach(() => {
            // The shared mock reports every property as an avatar source; scope it back to the real
            // source inputs so setting `badgeColor` isn't mistaken for a source in the auto-fired ngOnChanges.
            vi.spyOn(avatarService, 'isSource').mockImplementation((prop: string) =>
                ['facebook', 'gravatar', 'github', 'custom', 'initials', 'value'].includes(prop)
            );
        });

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
});
