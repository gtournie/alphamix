import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { importAssets } from 'svelte-preprocess-import-assets'

const config = {
	preprocess: [vitePreprocess(), importAssets()],
	kit: {
		adapter: adapter()
	}
};

export default config;
