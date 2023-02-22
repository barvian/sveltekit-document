# The missing document manager for SvelteKit

A tiny utility for SvelteKit that lets you change the `<html>`, `<head>`, and `<body>` tags from any page or layout—with full SSR support. Here's an example:

```svelte
<!-- you could already do this: -->
<svelte:head>
    <title>Hello world!</title>
</svelte:head>
<svelte:body on:click={onBodyClick} />

<!-- but now you can do this: -->
<html lang="en" on:keyup={onHtmlKeyup} />
<svelte:body class:dark={darkModeEnabled} />
```

The full list of features it offers is:

- Expands `<svelte:body>` to work with attributes, not just event listeners (accessible in SSR via `%sveltekit.body.attributes%` in `app.html`)
- Treats `<html>` as a make-shift `<svelte:html>`, forwarding attributes and event listeners to the page's `<html>` element (accessible in SSR via `%sveltekit.html.attributes%` in `app.html`)

## Installation

1. Grab the package from NPM:

   ```sh
   npm install @sveltekit-addons/document --save-dev
   ```

1. Include the preprocessor in your `svelte.config.js` file:

   ```diff
   + import { preprocessor as documentPreprocessor } from '@sveltekit-addons/document'

   export default {
   -   preprocess: [vitePreprocess()]
   +   preprocess: [vitePreprocess(), documentPreprocessor()] // Make sure it's at the very end
   }
   ```

1. Add the handle to your `src/hooks.server.js` (create that file if it doesn't exist):

   - If you don't have any other handles:
     ```diff
     + export { handle } from '@sveltekit-addons/document'
     ```
   - If you have a `handle` export already:

     ```diff
     + import { handle as documentHandle } from '@sveltekit-addons/document'
     + import { sequence } from '@sveltejs/kit/hooks'

     - export const handle = ...
     + const handle = ...
     + export const handle = sequence(handle, documentHandle)
     ```

1. Add the SSR placeholders to your `src/app.html`:

   - Manually:
     ```diff
     <!DOCTYPE html>
     - <html>
     + <html %sveltekit.html.attributes%>
     <head>
         ...
     </head>
     - <body>
     + <body %sveltekit.body.attributes%>
     ```
   - Or by using the provided `app.html` template (meaning you can delete yours):

     ```diff
     // svelte.config.js
     + import { appTemplate } from '@sveltekit-addons/document'

     export default {
         // ...
     +   kit: {
     +     files: {
     +       appTemplate
     +     }
     +   }
     }
     ```
