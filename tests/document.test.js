import { expect, test } from '@playwright/test'

test('html tag gets expected attributes', async ({ page, javaScriptEnabled }) => {
	await page.goto('/')
	expect(await page.getAttribute('html', 'data-ska-document-element')).toBeNull() // doesn't get private attribute
	expect(await page.getAttribute('html', 'lang')).toBe('en')
	expect(await page.getAttribute('html', 'style')).toContain('font-size: 14px')

	await page.getByText('JP page').click()
	await page.textContent('#jp')
	expect(await page.getAttribute('html', 'lang')).toBe('jp')
	expect(await page.getAttribute('html', 'style')).toContain('font-size: 16px')
	if (javaScriptEnabled) {
		await page.keyboard.up('h')
		expect(await page.getAttribute('html', 'class')).toContain('toggled')
		expect(await page.getAttribute('html', 'style')).toContain('--toggled: 1')
		// Make sure attributes don't get erroneously removed
		expect(await page.getAttribute('html', 'style')).toContain('font-size: 16px')
	}

	await page.getByText('home').click()
	await page.textContent('#home')
	expect(await page.getAttribute('html', 'lang')).toBe('en')
	expect(await page.getAttribute('html', 'style')).not.toContain('font-size: 16px')
	if (javaScriptEnabled) {
		expect(await page.getAttribute('html', 'class')).toContain('toggled')
		expect(await page.getAttribute('html', 'style')).toContain('--toggled: 1')
	}
})

test('body tag gets expected attributes', async ({ page, javaScriptEnabled }) => {
	await page.goto('/')
	expect(await page.getAttribute('body', 'data-ska-document-element')).toBeNull() // doesn't get private attribute
	expect(await page.getAttribute('body', 'data-sveltekit-preload-data')).toBe('hover')
	expect(await page.getAttribute('body', 'style')).toContain('color: green')

	await page.getByText('JP page').click()
	await page.textContent('#jp')
	expect(await page.getAttribute('body', 'class')).toContain('jp-page')
	expect(await page.getAttribute('body', 'style')).toContain('color: red')
	if (javaScriptEnabled) {
		await page.keyboard.up('b')
		expect(await page.getAttribute('body', 'class')).toContain('toggled')
		expect(await page.getAttribute('body', 'style')).toContain('--toggled: 1')
		// Make sure attributes don't get erroneously removed
		expect(await page.getAttribute('body', 'style')).toContain('color: red')
	}

	await page.getByText('home').click()
	await page.textContent('#home')
	expect(await page.getAttribute('html', 'style')).not.toContain('color: red')
	if (javaScriptEnabled) {
		expect(await page.getAttribute('body', 'class')).toContain('toggled')
		expect(await page.getAttribute('body', 'style')).toContain('--toggled: 1')
	} else {
		expect(await page.getAttribute('body', 'class')).toBeNull()
	}
})
