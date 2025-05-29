import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths(), tailwindcss()],
	test: {
		include: ['**/*.test.ts'],
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
		globals: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			include: ['src/**/*.{ts,tsx,js,jsx}'],
			reportsDirectory: './tests/unit/coverage',
			exclude: [
				'node_modules/',
				'src/test/',
				'**/*.d.ts',
				'**/index.ts',
				'**/main.tsx',
				'vite.config.ts',
				'**/*.{test,spec}.*',
			],
			all: true,
		},
	},
})
