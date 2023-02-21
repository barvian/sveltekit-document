import { preprocessor, appTemplate } from './src/lib/index.js'

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: preprocessor(),
	kit: {
		files: {
			appTemplate
		}
	}
}