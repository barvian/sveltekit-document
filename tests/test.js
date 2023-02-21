import { expect, test } from '@playwright/test'

test('html has expected attributes', async ({ page }) => {
	await page.goto('/');
	expect(await page.getAttribute('html', 'lang')).toBe('en');
});

test('body has expected attributes', async ({ page }) => {
	await page.goto('/');
	expect(await page.getAttribute('body', 'data-sveltekit-preload-data')).toBe('hover');
});
