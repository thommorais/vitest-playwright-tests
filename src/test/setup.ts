// Vitest setup file
import { beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Clean up after each test
beforeEach(() => {
  cleanup()
})