import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths(), tailwindcss()],
	test: {
		include: ['**/*.test.ts'],
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
		globals: true,
		coverage: {
			reporter: ['text', 'json', 'html', 'lcov'],
			exclude: ['node_modules/', 'src/test/', '**/*.d.ts', '**/index.ts', '**/main.tsx', 'vite.config.ts'],
		},
	},
})
