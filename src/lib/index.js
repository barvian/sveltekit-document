import * as url from 'node:url'

export { default as preprocessor } from './preprocessor.js'
export const appTemplate = url.fileURLToPath(new URL('./app.html', import.meta.url))
