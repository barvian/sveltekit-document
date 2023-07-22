/** @type {import('@playwright/test').PlaywrightTestConfig} */
export default {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: './tests',
	projects: [
		{
			name: `js`,
			use: {
				javaScriptEnabled: true
			}
		},
		{
			name: `no-js`,
			use: {
				javaScriptEnabled: false
			}
		}
	]
}