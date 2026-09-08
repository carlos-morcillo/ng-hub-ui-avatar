import * as api from './public_api';

/**
 * The `Hub` prefix is a promise about the whole exported surface, and a promise nothing
 * enforces is one class away from being false: the next class added to `public_api.ts` lands
 * unprefixed and nobody notices until a consumer's own `AvatarComponent` collides with ours.
 * So the surface is read back from the compiled module rather than listed by hand, and the
 * only names allowed through without the prefix are the aliases kept for the consumers who
 * already import them — each of which has to resolve to the very same class.
 */

/** The deprecated names, mapped to the class each one must still resolve to. */
const ALIASES: ReadonlyArray<readonly [string, string]> = [
	['AvatarComponent', 'HubAvatarComponent'],
	['AvatarService', 'HubAvatarService']
];

/**
 * `AvatarModule` keeps its name on purpose: `BREAKING_CHANGES.md` already announces it for
 * removal in 23.0.0, so a prefixed name would be born deprecated and die in the same release.
 */
const UNPREFIXED_BY_DESIGN = new Set([...ALIASES.map(([deprecated]) => deprecated), 'AvatarModule']);

/** Angular stamps one of these on every class it compiles; plain functions carry none. */
const ANGULAR_DEFINITIONS = ['ɵcmp', 'ɵdir', 'ɵpipe', 'ɵmod', 'ɵprov', 'ɵfac'];

function isAngularClass(value: unknown): boolean {
	return typeof value === 'function' && ANGULAR_DEFINITIONS.some((key) => key in (value as object));
}

describe('ng-hub-ui-avatar public surface', () => {
	it('exports no class without the Hub prefix beyond the names kept for compatibility', () => {
		const unprefixed = Object.entries(api)
			.filter(([name, value]) => isAngularClass(value) && !name.startsWith('Hub'))
			.map(([name]) => name)
			.filter((name) => !UNPREFIXED_BY_DESIGN.has(name));

		expect(unprefixed).toEqual([]);
	});

	it.each(ALIASES)('%s still resolves to %s', (deprecated, current) => {
		const surface = api as Record<string, unknown>;

		expect(surface[deprecated]).toBeDefined();
		expect(surface[deprecated]).toBe(surface[current]);
	});
});
