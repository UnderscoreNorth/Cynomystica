import { sveltekit } from '@sveltejs/kit/vite';
import socketMain from './src/lib/server/socketMain';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		{
			name: 'sveltekit-socket-io',
			configureServer(server) {
				socketMain(server);
			}
		}
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
};

export default config;
