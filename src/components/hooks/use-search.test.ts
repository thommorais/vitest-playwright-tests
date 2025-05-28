import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useSearch } from './use-search'

describe('useSearch', () => {
	const testData = [
		{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
		{ id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
		{ id: 3, name: 'Bob Johnson', email: 'bob@test.com', role: 'user' },
		{ id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'moderator' },
		{ id: 5, name: 'Charlie Wilson', email: 'charlie@test.com', role: 'user' },
	]

	it('should initialize with empty search term and return all data', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['name', 'email'] }))

		expect(result.current.searchTerm).toBe('')
		expect(result.current.searchResult).toEqual(testData)
	})

	it('should filter data by single search field', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['name'] }))

		act(() => {
			result.current.handleSearch('john')
		})

		expect(result.current.searchTerm).toBe('john')
		expect(result.current.searchResult).toEqual([
			{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
			{ id: 3, name: 'Bob Johnson', email: 'bob@test.com', role: 'user' },
		])
	})

	it('should filter data by multiple search fields', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['name', 'email'] }))

		act(() => {
			result.current.handleSearch('test.com')
		})

		expect(result.current.searchResult).toEqual([
			{ id: 3, name: 'Bob Johnson', email: 'bob@test.com', role: 'user' },
			{ id: 5, name: 'Charlie Wilson', email: 'charlie@test.com', role: 'user' },
		])
	})

	it('should be case insensitive', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['name'] }))

		act(() => {
			result.current.handleSearch('ALICE')
		})

		expect(result.current.searchResult).toEqual([
			{ id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'moderator' },
		])
	})

	it('should trim whitespace from search term', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['name'] }))

		act(() => {
			result.current.handleSearch('  jane  ')
		})

		expect(result.current.searchResult).toEqual([
			{ id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
		])
	})

	it('should return empty array when no matches found', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['name'] }))

		act(() => {
			result.current.handleSearch('nonexistent')
		})

		expect(result.current.searchResult).toEqual([])
	})

	it('should return all data when search term is cleared', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['name'] }))

		act(() => {
			result.current.handleSearch('john')
		})

		expect(result.current.searchResult).toHaveLength(2)

		act(() => {
			result.current.handleSearch('')
		})

		expect(result.current.searchResult).toEqual(testData)
	})

	it('should handle empty data array', () => {
		const { result } = renderHook(() => useSearch([], { searchFields: ['name'] }))

		act(() => {
			result.current.handleSearch('anything')
		})

		expect(result.current.searchResult).toEqual([])
	})

	it('should ignore non-string field values', () => {
		const dataWithNumbers = [
			{ id: 1, name: 'John', age: 25 },
			{ id: 2, name: 'Jane', age: 30 },
		]

		const { result } = renderHook(() => useSearch(dataWithNumbers, { searchFields: ['name', 'age'] }))

		act(() => {
			result.current.handleSearch('25')
		})

		expect(result.current.searchResult).toEqual([])
	})

	it('should handle partial matches', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['email'] }))

		act(() => {
			result.current.handleSearch('example')
		})

		expect(result.current.searchResult).toHaveLength(3)
	})

	it('should update search results when data changes', () => {
		const { result, rerender } = renderHook(({ data }) => useSearch(data, { searchFields: ['name'] }), {
			initialProps: { data: testData.slice(0, 2) },
		})

		act(() => {
			result.current.handleSearch('john')
		})

		expect(result.current.searchResult).toHaveLength(1)

		rerender({ data: testData })

		expect(result.current.searchResult).toHaveLength(2)
	})
})
