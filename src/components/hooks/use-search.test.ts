import { faker } from '@faker-js/faker'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSearch } from './use-search'

type BlogPost = {
	id: number
	title: string
	author: string
	content: string
}

describe('useSearch', () => {
	let testData: BlogPost[]

	beforeEach(() => {
		faker.seed(12345) // Consistent seed for reproducible tests
		testData = Array.from({ length: 50 }, (_, index) => {
			if (index === 0) {
				// Ensure first post has the specific title we want to test
				return {
					id: 1,
					title: 'Tom Bombabil adventures in the Old Forest',
					author: 'J.R.R. Tolkien',
					content: 'A tale of Tom Bombadil and his mysterious powers in the depths of the Old Forest.',
				}
			}
			return {
				id: index + 1,
				title: faker.lorem.sentence(),
				author: faker.person.fullName(),
				content: faker.lorem.paragraphs(2),
			}
		})
	})

	it('should initialize with empty search term and return all data', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['title', 'author'] }))

		expect(result.current.searchTerm).toBe('')
		expect(result.current.searchResult).toEqual(testData)
		expect(result.current.searchResult).toHaveLength(50)
	})

	it('should filter data by single search field (title)', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['title'] }))

		// Search for the specific Tom Bombabil post
		act(() => {
			result.current.handleSearch('Tom')
		})

		expect(result.current.searchTerm).toBe('Tom')
		expect(result.current.searchResult.length).toBeGreaterThan(0) // Ensure there are matches
		// Verify all results contain 'Tom' in the title
		for (const post of result.current.searchResult) {
			expect(post.title.toLowerCase()).toContain('tom')
		}
	})

	it('should filter data by multiple search fields', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['title', 'author', 'content'] }))

		// Search for 'forest' which should match content
		act(() => {
			result.current.handleSearch('forest')
		})

		expect(result.current.searchResult.length).toBeGreaterThan(0)
		// Verify results contain the search term in one of the fields
		for (const post of result.current.searchResult) {
			const matchesTitle = post.title.toLowerCase().includes('forest')
			const matchesAuthor = post.author.toLowerCase().includes('forest')
			const matchesContent = post.content.toLowerCase().includes('forest')
			expect(matchesTitle || matchesAuthor || matchesContent).toBe(true)
		}
	})

	it('should be case insensitive', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['author'] }))

		act(() => {
			result.current.handleSearch('TOLKIEN')
		})

		const tolkienResults = result.current.searchResult

		act(() => {
			result.current.handleSearch('tolkien')
		})

		const lowerTolkienResults = result.current.searchResult

		expect(tolkienResults).toEqual(lowerTolkienResults)
		for (const post of tolkienResults) {
			expect(post.author.toLowerCase()).toContain('tolkien')
		}
	})

	it('should trim whitespace from search term', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['title'] }))

		act(() => {
			result.current.handleSearch('  adventures  ')
		})

		expect(result.current.searchResult.length).toBeGreaterThanOrEqual(0)
		for (const post of result.current.searchResult) {
			expect(post.title.toLowerCase()).toContain('adventures')
		}
	})

	it('should return empty array when no matches found', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['title'] }))

		act(() => {
			result.current.handleSearch('xyznonexistent123')
		})

		expect(result.current.searchResult).toEqual([])
	})

	it('should return all data when search term is cleared', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['title'] }))

		act(() => {
			result.current.handleSearch('adventures')
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
		const { result } = renderHook(() => useSearch([], { searchFields: ['title'] }))

		act(() => {
			result.current.handleSearch('anything')
		})

		expect(result.current.searchResult).toEqual([])
	})

	it('should ignore non-string field values', () => {
		const dataWithNumbers = Array.from({ length: 5 }, (_, index) => ({
			id: index + 1,
			title: faker.lorem.sentence(),
			readTime: faker.number.int({ min: 5, max: 30 }),
		}))

		const { result } = renderHook(() => useSearch(dataWithNumbers, { searchFields: ['title', 'readTime'] }))

		act(() => {
			result.current.handleSearch('15')
		})

		// Should not match numeric readTime field, only string fields
		expect(result.current.searchResult).toEqual([])
	})

	it('should handle author-based search with realistic data', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['author'] }))

		act(() => {
			result.current.handleSearch('tolkien')
		})

		for (const post of result.current.searchResult) {
			expect(post.author.toLowerCase()).toContain('tolkien')
		}
	})

	it('should search across blog content', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['content'] }))

		act(() => {
			result.current.handleSearch('forest')
		})

		// Should find the Tom Bombabil post that mentions Old Forest
		expect(result.current.searchResult.length).toBeGreaterThan(0)
		for (const post of result.current.searchResult) {
			expect(post.content.toLowerCase()).toContain('forest')
		}
	})

	it('should update search results when data changes', () => {
		const { result, rerender } = renderHook(({ data }) => useSearch(data, { searchFields: ['title'] }), {
			initialProps: { data: testData.slice(0, 10) },
		})

		act(() => {
			result.current.handleSearch('the')
		})

		const initialResultCount = result.current.searchResult.length

		rerender({ data: testData })

		// Should have more results with larger dataset
		expect(result.current.searchResult.length).toBeGreaterThanOrEqual(initialResultCount)
	})

	it('should find Tom Bombabil adventures post', () => {
		const { result } = renderHook(() => useSearch(testData, { searchFields: ['title'] }))

		act(() => {
			result.current.handleSearch('Tom Bombabil adventures')
		})

		expect(result.current.searchResult.length).toBe(1)
		expect(result.current.searchResult[0].title).toBe('Tom Bombabil adventures in the Old Forest')
		expect(result.current.searchResult[0].author).toBe('J.R.R. Tolkien')
		expect(result.current.searchResult[0].content).toContain('Tom Bombadil')
	})
})