import * as url from 'node:url'

export { default as handle } from './_handle.js'
export { default as preprocessor } from './_preprocessor.js'
export const appTemplate = url.fileURLToPath(new URL('./_app.html', import.meta.url))