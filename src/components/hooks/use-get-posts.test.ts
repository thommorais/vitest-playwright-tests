import { renderHook } from '@testing-library/react'
import * as services from '_/services/services'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePosts } from './use-get-posts'

// Mock SWR
vi.mock('swr', () => ({
	default: vi.fn(),
}))

// Mock services
vi.mock('_/services/services', () => ({
	ENDPOINTS: { POSTS: 'posts' },
	getPosts: vi.fn(),
}))

const mockUseSWR = vi.mocked((await import('swr')).default)
const mockGetPosts = vi.mocked(services.getPosts)

describe('usePosts', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should return loading state initially', () => {
		mockUseSWR.mockReturnValue({
			data: undefined,
			error: undefined,
			isLoading: true,
			mutate: vi.fn(),
			isValidating: false,
		})

		const { result } = renderHook(() => usePosts())

		expect(result.current).toEqual({
			data: undefined,
			error: undefined,
			isLoading: true,
		})
	})

	it('should return data when fetch succeeds', async () => {
		const mockPosts = [
			{ id: 1, userId: 1, title: 'Test Post 1', body: 'Content 1' },
			{ id: 2, userId: 1, title: 'Test Post 2', body: 'Content 2' },
		]

		mockGetPosts.mockResolvedValue({
			success: true,
			data: mockPosts,
		})

		mockUseSWR.mockReturnValue({
			data: mockPosts,
			error: undefined,
			isLoading: false,
			mutate: vi.fn(),
			isValidating: false,
		})

		const { result } = renderHook(() => usePosts())

		expect(result.current).toEqual({
			data: mockPosts,
			error: undefined,
			isLoading: false,
		})
	})

	it('should return error when fetch fails', () => {
		const errorMessage = 'Failed to fetch posts'
		const mockError = new Error(errorMessage)

		mockUseSWR.mockReturnValue({
			data: undefined,
			error: mockError,
			isLoading: false,
			mutate: vi.fn(),
			isValidating: false,
		})

		const { result } = renderHook(() => usePosts())

		expect(result.current).toEqual({
			data: undefined,
			error: errorMessage,
			isLoading: false,
		})
	})

	it('should call useSWR with correct parameters', () => {
		mockUseSWR.mockReturnValue({
			data: undefined,
			error: undefined,
			isLoading: true,
			mutate: vi.fn(),
			isValidating: false,
		})

		renderHook(() => usePosts())

		expect(mockUseSWR).toHaveBeenCalledWith('posts', expect.any(Function), {
			revalidateOnReconnect: true,
			revalidateOnFocus: true,
			refreshInterval: 5000,
		})
	})

	it('should handle service error correctly', async () => {
		const errorMessage = 'Service error'

		mockGetPosts.mockResolvedValue({
			success: false,
			error: errorMessage,
		})

		// Get the fetcher function from the useSWR call
		mockUseSWR.mockImplementation(() => {
			// Simulate SWR calling the fetcher and catching the error
			const mockError = new Error(errorMessage)
			return {
				data: undefined,
				error: mockError,
				isLoading: false,
				mutate: vi.fn(),
				isValidating: false,
			}
		})

		const { result } = renderHook(() => usePosts())

		expect(result.current.error).toBe(errorMessage)
		expect(result.current.data).toBeUndefined()
		expect(result.current.isLoading).toBe(false)
	})
})
