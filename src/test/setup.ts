import { cleanup } from '@testing-library/react'
// Vitest setup file
import { beforeEach } from 'vitest'

// Clean up after each test
beforeEach(() => {
	cleanup()
})
