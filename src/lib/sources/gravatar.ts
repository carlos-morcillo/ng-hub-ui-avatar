import { Source } from './source';
import { AvatarSource } from './avatar-source.enum';

function isRetina(): boolean {
	if (typeof window !== 'undefined' && window !== null) {
		if (window.devicePixelRatio > 1.25) {
			return true;
		}

		const mediaQuery =
			'(-webkit-min-device-pixel-ratio: 1.25), (min--moz-device-pixel-ratio: 1.25), (-o-min-device-pixel-ratio: 5/4), (min-resolution: 1.25dppx)';
		if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
			return true;
		}
	}

	return false;
}

/**
 *  Helper function to calculate MD5 hash using the Crypto API.
 */
function hashMD5(value: string): Promise<string> {
	// Convert string to Uint8Array
	const encoder = new TextEncoder();
	const data = encoder.encode(value);

	// Use SubtleCrypto for hashing
	return crypto.subtle.digest('MD5', data).then((hash) => {
		// Convert ArrayBuffer to hexadecimal string
		return Array.from(new Uint8Array(hash))
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');
	});
}

/**
 *  Gravatar source implementation.
 *  Fetch avatar source based on gravatar email
 */
export class Gravatar implements Source {
	readonly sourceType: AvatarSource = AvatarSource.GRAVATAR;
	sourceId: string;

	constructor(public value: string) {
		// Use regex to check if the value is already an MD5 hash, otherwise calculate it
		if (value.match('^[a-f0-9]{32}$')) {
			this.sourceId = value;
		} else {
			hashMD5(value).then((hash) => {
				this.sourceId = hash;
			});
		}
	}

	getAvatar(size: number): string {
		const avatarSize = isRetina() ? size * 2 : size;
		return `https://secure.gravatar.com/avatar/${this.sourceId}?s=${avatarSize}&d=404`;
	}
}
