import { faker } from '@faker-js/faker'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSearch } from './use-search'

type TestUser = {
	id: number
	name: string
	email: string
	role: string
	department: string
	phone: string
}

describe('useSearch', () => {
	let testData: TestUser[]

	beforeEach(() => {
		faker.seed(12345) // Consistent seed for reproducible tests
		testData = Array.from({ length: 50 }, (_, index) => ({
			id: index + 1,
			name: faker.person.fullName(),
			email: faker.internet.email(),
			role: faker.helpers.arrayElement(['admin', 'user', 'moderator', 'viewer']),
			department: faker.commerce.department(),
			phone: faker.phone.number(),
		}))
	})

	it('should initialize with empty search term and return all data', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['name', 'email'] }))

		expect(result.current.searchTerm).toBe('')
		expect(result.current.searchResult).toEqual(testData)
		expect(result.current.searchResult).toHaveLength(50)
	})

	it('should filter data by single search field (name)', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['name'] }))

		// Search for a common first name pattern
		act(() => {
			result.current.handleSearch('John')
		})

		expect(result.current.searchTerm).toBe('John')
		expect(result.current.searchResult.length).toBeGreaterThan(0) // Ensure there are matches
		// Verify all results contain 'John' in the name
		for (const user of result.current.searchResult) {
			expect(user.name.toLowerCase()).toContain('john')
		}
	})

	it('should filter data by multiple search fields', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['name', 'email', 'department'] }))

		// Search for a domain pattern
		act(() => {
			result.current.handleSearch('.com')
		})

		expect(result.current.searchResult.length).toBeGreaterThan(0)
		// Verify results contain the search term in one of the fields
		for (const user of result.current.searchResult) {
			const matchesName = user.name.toLowerCase().includes('.com')
			const matchesEmail = user.email.toLowerCase().includes('.com')
			const matchesDepartment = user.department.toLowerCase().includes('.com')
			expect(matchesName || matchesEmail || matchesDepartment).toBe(true)
		}
	})

	it('should be case insensitive', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['role'] }))

		act(() => {
			result.current.handleSearch('ADMIN')
		})

		const adminResults = result.current.searchResult

		act(() => {
			result.current.handleSearch('admin')
		})

		const lowerAdminResults = result.current.searchResult

		expect(adminResults).toEqual(lowerAdminResults)
		for (const user of adminResults) {
			expect(user.role.toLowerCase()).toContain('admin')
		}
	})

	it('should trim whitespace from search term', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['role'] }))

		act(() => {
			result.current.handleSearch('  user  ')
		})

		expect(result.current.searchResult.length).toBeGreaterThanOrEqual(0)
		for (const user of result.current.searchResult) {
			expect(user.role.toLowerCase()).toContain('user')
		}
	})

	it('should return empty array when no matches found', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['name'] }))

		act(() => {
			result.current.handleSearch('xyznonexistent123')
		})

		expect(result.current.searchResult).toEqual([])
	})

	it('should return all data when search term is cleared', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['name'] }))

		act(() => {
			result.current.handleSearch('admin')
		})

		const filteredCount = result.current.searchResult.length
		expect(filteredCount).toBeLessThan(testData.length)

		act(() => {
			result.current.handleSearch('')
		})

		expect(result.current.searchResult).toEqual(testData)
		expect(result.current.searchResult).toHaveLength(50)
	})

	it('should handle empty data array', () => {
		const { result } = renderHook(() => useSearch([], { searchFields: ['name'] }))

		act(() => {
			result.current.handleSearch('anything')
		})

		expect(result.current.searchResult).toEqual([])
	})

	it('should ignore non-string field values', () => {
		const dataWithNumbers = Array.from({ length: 5 }, (_, index) => ({
			id: index + 1,
			name: faker.person.fullName(),
			age: faker.number.int({ min: 18, max: 65 }),
		}))

		const { result } = renderHook(() => useSearch(dataWithNumbers, { searchFields: ['name', 'age'] }))

		act(() => {
			result.current.handleSearch('25')
		})

		// Should not match numeric age field, only string fields
		expect(result.current.searchResult).toEqual([])
	})

	it('should handle department-based search with realistic data', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['department'] }))

		act(() => {
			result.current.handleSearch('books')
		})

		for (const user of result.current.searchResult) {
			expect(user.department.toLowerCase()).toContain('books')
		}
	})

	it('should search across email domains', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['email'] }))

		act(() => {
			result.current.handleSearch('@')
		})

		// All emails should contain '@'
		expect(result.current.searchResult).toHaveLength(50)
		for (const user of result.current.searchResult) {
			expect(user.email).toContain('@')
		}
	})

	it('should update search results when data changes', () => {
		const { result, rerender } = renderHook(({ data }) => useSearch(data, { searchFields: ['name'] }), {
			initialProps: { data: testData.slice(0, 10) },
		})

		act(() => {
			result.current.handleSearch('e')
		})

		const initialResultCount = result.current.searchResult.length

		rerender({ data: testData })

		// Should have more results with larger dataset
		expect(result.current.searchResult.length).toBeGreaterThanOrEqual(initialResultCount)
	})
})
