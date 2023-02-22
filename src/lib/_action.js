import { mergeAttributes } from './_util.js'

/**
 * The Svelte action that forwards attributes changes
 * and events to a target element
 *
 * @param {HTMLElement} node
 */
export default (node) => {
	const el = node.dataset.skaDocumentElement
	if (!el) throw new Error(`[data-ska-document-element] must be set if using element action`)
	/** @type {Record<string, HTMLElement>} */
	const targets = {
		html: document.documentElement,
		body: document.body
	}
	const target = targets[el]
	if (!target)
		throw new Error(
			`[data-ska-document-element] must be one of ${Object.keys(targets)} is using element action`
		)

	// Forward events. Pretty lucky that Svelte runs actions
	// before attaching event listeners
	node.addEventListener = target.addEventListener.bind(target)
	node.removeEventListener = target.removeEventListener.bind(target)

	update(el, node, target)

	// Forward attribute changes
	const observer = new MutationObserver((mutationList) => {
		update(
			el,
			node,
			target,
			/** @type {string[]} */ (
				// TS can't figure out the .filter
				mutationList.map((mut) => mut.attributeName).filter((attr) => attr)
			)
		)
	})
	observer.observe(node, { attributes: true })

	return {
		destroy() {
			observer.disconnect()
			update(el, node, target)
		}
	}
}

/**
 * Child components get mounted before parents, making them really hard
 * to track esp during client-side navigation, so query DOM
 * as source of truth (which is more like how SSR works anyway)
 * @param {string} el
 * @param {HTMLElement} node
 * @param {HTMLElement} target
 * @param {string[]} [filter]
 */
function update(el, node, target, filter) {
	const nodes = document.querySelectorAll(
		filter
			? filter.map((attr) => `[data-ska-document-element="${el}"][${attr}]`).join(', ')
			: `[data-ska-document-element="${el}"]`
	)
	const prevAttributes = getAttributesPojo(node)
	const merged = mergeAttributes(
		Array.from(nodes).map((node) => getAttributesPojo(node)),
		filter
	)
	Object.entries(merged).forEach(([attr, val]) => {
		target.setAttribute(attr, val)
	})
	// Remove attributes that existed before the update but not after
	Object.keys(prevAttributes)
		.filter((attr) => (filter ? filter.includes(attr) : true))
		.filter((attr) => !(attr in merged))
		.forEach((attr) => target.removeAttribute(attr))
}

/** @param {Element} node */
const getAttributesPojo = (node) => {
	/** @type {Record<string, string>} */
	const attrs = {}
	for (const attr of node.attributes) {
		attrs[attr.name] = attr.value
	}
	return attrs
}
