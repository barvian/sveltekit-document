import { it, expect } from 'vitest'
import preprocessor, { IMPORT_ACTION } from './_preprocessor.js'
import { preprocess } from 'svelte/compiler'

it('injects script tags', async () => {
	const processed = await preprocess('', preprocessor())
	expect(processed.code).toBe(`<script>${IMPORT_ACTION}</script>`)
})

it('injects import statements', async () => {
	const code = `<script>console.log()</script>Template`
	const processed = await preprocess(code, preprocessor())
	expect(processed.code).toBe(`<script>${IMPORT_ACTION}\nconsole.log()</script>Template`)
})

it('expands html tags', async () => {
	const code = `<div><html class="test" on:click={() => {}} /></div>`
	const processed = await preprocess(code, preprocessor())
	expect(processed.code).toBe(
		`<script>${IMPORT_ACTION}</script><div><div hidden style="display:none !important"><div data-ska-element="html" use:__skaElement class="test" on:click={() => {}}></div></div></div>`
	)
})

it('errors for html tags with children', async () => {
	expect.assertions(1)
	const code = `<html>child</html>`
	try {
		await preprocess(code, preprocessor())
	} catch (/** @type {any} */ e) {
		expect(e.message).toContain('child elements')
	}
})

it('expands svelte:body tags', async () => {
	const code = `<svelte:body class="test" on:click={() => {}} />Template`
	const processed = await preprocess(code, preprocessor())
	expect(processed.code).toBe(
		`<script>${IMPORT_ACTION}</script><svelte:body on:click={() => {}} /><div hidden style="display:none !important"><div data-ska-element="body" use:__skaElement class="test"></div></div>Template`
	)
})
