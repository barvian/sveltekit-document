import { parse, walk, SyntaxKind } from 'html5parser'
import { mergeAttributes } from './_util.js'

/**
 * @type {import('@sveltejs/kit').Handle}
 */
export default ({ event, resolve }) =>
	resolve(event, {
		async transformPageChunk({ html, done }) {
			if (!done || !/%ska.html.attributes%|%ska.body.attributes%/.test(html)) return html

			const ast = parse(html, { setAttributeMap: true })
			/** @type {Record<string, import('html5parser').ITag[]>} */
			let nodes = {}
			walk(ast, {
				enter(node) {
					if (
						node.type !== SyntaxKind.Tag ||
						!node.attributeMap?.['data-ska-document-element']?.value
					)
						return
					const elem = node.attributeMap['data-ska-document-element'].value.value
					if (!nodes[elem]) nodes[elem] = []
					nodes[elem].push(node)
				}
			})

			const rawAttributes = Object.fromEntries(
				Object.entries(nodes).map(([tag, nodes]) => {
					const merged = mergeAttributes(
						nodes.map((node) =>
							Object.fromEntries(
								Object.entries(node.attributeMap ?? {}).map(([name, attr]) => [
									name,
									attr.value?.value ?? ''
								])
							)
						)
					)
					const raw = Object.entries(merged)
						.map(([attr, val]) => attr + '="' + val + '"')
						.join(' ')
					return [tag, raw]
				})
			)

			return html
				.replace('%ska.html.attributes%', rawAttributes.html ?? '')
				.replace('%ska.body.attributes%', rawAttributes.body ?? '')
		}
	})
