import MagicString from 'magic-string'
import * as url from 'node:url'
import { parse as parseMarkup } from 'svelte-parse-markup'

export const IMPORT_ACTION = `import __skaDocumentElement from '${url.fileURLToPath(
	new URL('./_action.js', import.meta.url)
)}';`

/**
 * @return {import('svelte/types/compiler/preprocess').PreprocessorGroup}
 */
export default () => ({
	markup({ content }) {
		const s = new MagicString(content)
		const root = parseMarkup(content)
		if (root.instance) {
			s.appendLeft(
				// @ts-ignore I'm not sure why .start is not listed
				root.instance.content.start,
				// TODO: do something different if
				// instance.content.sourceType is not module?
				IMPORT_ACTION + '\n'
			)
		} else {
			s.prepend(`<script>${IMPORT_ACTION}</script>`)
		}

		expand(root.html, s, content)

		return {
			code: s.toString(),
			map: s.generateMap()
		}
	}
})

/**
 * @param {import('svelte/types/compiler/interfaces').TemplateNode} node
 * @param {MagicString} s
 * @param {string} content
 */
function expand(node, s, content) {
	// Have to type this for some reason:
	const attributes =
		/** @type {import('svelte/types/compiler/interfaces').Element['attributes']} */ (
			node.attributes
		)
	if (node.name === 'html') {
		if (node.children && node.children.length > 0) {
			throw new Error(`<html> cannot contain any child elements`)
		}
		s.update(
			node.start,
			node.end,
			// Make sure you use close the inner div, because Cheerio doesn't like unclosed tags
			`<div hidden style="display:none !important"><div data-ska-document-element="html" use:__skaDocumentElement ${getRawAttributes(
				attributes,
				content
			)}></div></div>`
		)
	} else if (node.name === 'svelte:body') {
		s.update(
			node.start,
			node.end,
			`<svelte:body ${getRawAttributes(
				attributes.filter((attr) => attr.type === 'EventHandler'),
				content
			)} /><div hidden style="display:none !important"><div data-ska-document-element="body" use:__skaDocumentElement ${getRawAttributes(
				attributes.filter((attr) => attr.type !== 'EventHandler'),
				content
			)}></div></div>`
		)
	} else if (node.children) {
		node.children.forEach((node) => expand(node, s, content))
	}
}

/**
 * @param {import('svelte/types/compiler/interfaces').Element['attributes']} attributes
 * @param {string} content
 */
const getRawAttributes = (attributes, content) =>
	attributes.map((attr) => content.substring(attr.start, attr.end)).join(' ')
