import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePagination, paginate, DEFAULT_PAGINATION } from './use-pagination'

describe('paginate utility', () => {
  it('should paginate array correctly', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    
    expect(paginate(data, 1, 3)).toEqual([1, 2, 3])
    expect(paginate(data, 2, 3)).toEqual([4, 5, 6])
    expect(paginate(data, 3, 3)).toEqual([7, 8, 9])
    expect(paginate(data, 4, 3)).toEqual([10])
  })

  it('should handle empty array', () => {
    expect(paginate([], 1, 5)).toEqual([])
  })

  it('should handle page beyond data length', () => {
    const data = [1, 2, 3]
    expect(paginate(data, 5, 2)).toEqual([])
  })
})

describe('usePagination', () => {
  const testData = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }))

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePagination(testData))

    expect(result.current.pagination).toEqual({
      page: DEFAULT_PAGINATION.page,
      perPage: DEFAULT_PAGINATION.perPage,
    })
    expect(result.current.totalItems).toBe(25)
    expect(result.current.paginatedData).toHaveLength(10)
    expect(result.current.paginatedData[0]).toEqual({ id: 1, name: 'Item 1' })
  })

  it('should initialize with custom values', () => {
    const { result } = renderHook(() => 
      usePagination(testData, { initialPage: 2, initialPerPage: 5 })
    )

    expect(result.current.pagination).toEqual({ page: 2, perPage: 5 })
    expect(result.current.paginatedData).toHaveLength(5)
    expect(result.current.paginatedData[0]).toEqual({ id: 6, name: 'Item 6' })
  })

  it('should handle pagination changes', () => {
    const { result } = renderHook(() => usePagination(testData))

    act(() => {
      result.current.handlePagination(2, 10)
    })

    expect(result.current.pagination).toEqual({ page: 2, perPage: 10 })
    expect(result.current.paginatedData[0]).toEqual({ id: 11, name: 'Item 11' })
  })

  it('should reset to first page when perPage changes', () => {
    const { result } = renderHook(() => usePagination(testData))

    act(() => {
      result.current.goToPage(3)
    })

    expect(result.current.pagination.page).toBe(3)

    act(() => {
      result.current.handlePagination(3, 15)
    })

    expect(result.current.pagination).toEqual({ page: 1, perPage: 15 })
  })

  it('should go to specific page', () => {
    const { result } = renderHook(() => usePagination(testData))

    act(() => {
      result.current.goToPage(3)
    })

    expect(result.current.pagination.page).toBe(3)
    expect(result.current.paginatedData[0]).toEqual({ id: 21, name: 'Item 21' })
  })

  it('should reset to first page', () => {
    const { result } = renderHook(() => usePagination(testData))

    act(() => {
      result.current.goToPage(3)
    })

    act(() => {
      result.current.resetToFirstPage()
    })

    expect(result.current.pagination.page).toBe(1)
  })

  it('should set per page and reset to first page', () => {
    const { result } = renderHook(() => usePagination(testData))

    act(() => {
      result.current.goToPage(2)
    })

    act(() => {
      result.current.setPerPage(20)
    })

    expect(result.current.pagination).toEqual({ page: 1, perPage: 20 })
    expect(result.current.paginatedData).toHaveLength(20)
  })

  it('should handle empty data', () => {
    const { result } = renderHook(() => usePagination([]))

    expect(result.current.totalItems).toBe(0)
    expect(result.current.paginatedData).toEqual([])
  })

  it('should update when data changes', () => {
    const { result, rerender } = renderHook(
      ({ data }) => usePagination(data),
      { initialProps: { data: testData.slice(0, 5) } }
    )

    expect(result.current.totalItems).toBe(5)
    expect(result.current.paginatedData).toHaveLength(5)

    rerender({ data: testData })

    expect(result.current.totalItems).toBe(25)
    expect(result.current.paginatedData).toHaveLength(10)
  })
})