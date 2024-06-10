

const isDebugMode = process.env.NODE_OPTIONS?.includes('--inspect') || process.env.NODE_OPTIONS?.includes('--inspect-brk');

/** @type {import('jest').Config} */
const jestConfig = {
	verbose: isDebugMode,
	watch: false,	
	projects: [
		{
			"displayName": "e2e",
			"testMatch": [
				"<rootDir>/tests/e2e.test.js"
			],		
			// @ts-ignore
			maxWorkers: 1
			
		},
		{
			displayName: "unit",
			testMatch: [
				"<rootDir>/tests/unit.test.js"
			],
			// @ts-ignore
			maxWorkers: "50%"
		}
	]
};

module.exports = jestConfig;
