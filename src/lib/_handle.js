import { load } from 'cheerio'
import { mergeAttributes } from './_util.js'

/**
 * @type {import('@sveltejs/kit').Handle}
 */
export default ({ event, resolve }) =>
	resolve(event, {
		async transformPageChunk({ html, done }) {
			if (!done || !/%sveltekit.html.attributes%|%sveltekit.body.attributes%/.test(html))
				return html

			const $ = load(html)
			/** @param {string} el */
			const getAttributesString = (el) => {
				const attrs = mergeAttributes(
					$('[data-ska-document-element="' + el + '"]')
						.toArray()
						.map((el) => /** @type {import('cheerio').Element} */ (el).attribs)
				)
				return Object.entries(attrs)
					.map(([attr, val]) => attr + '="' + val + '"')
					.join(' ')
			}

			return html
				.replace('%sveltekit.html.attributes%', getAttributesString('html'))
				.replace('%sveltekit.body.attributes%', getAttributesString('body'))
		}
	})
