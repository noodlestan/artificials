export const ENDPOINTS: Record<string, Record<string, string>> = {
	noodlestan: {
		site: 'https://noodlestan.org',
		github: 'https://github.com/noodlestan',
		discord: 'https://discord.gg/4MBbPK7sU',
		license: 'https://noodlestan.mit-license.org/2026',
		email: 'hello@noodlestan.org',
		contact: 'mailto:hello@noodlestan.org',
	},
	['art-js']: {
		site: 'https://github.com/noodlestan/art-js',
		github: 'https://github.com/noodlestan/art-js',
	},
	['art-lib']: {
		site: 'https://github.com/noodlestan/art-lib',
		github: 'https://github.com/noodlestan/art-lib',
	},
	['art-md']: {
		site: 'https://art-md.noodlestan.org',
		github: 'https://github.com/noodlestan/art-md',
	},
	['art-works']: {
		site: 'https://github.com/noodlestan/art-works',
		github: 'https://github.com/noodlestan/art-works',
	},
	artificials: {
		site: 'https://github.com/noodlestan/artificials',
		github: 'https://github.com/noodlestan/artificials',
	},
} as const;
