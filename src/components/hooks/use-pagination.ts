import { useCallback, useMemo, useState } from 'react'

type Pagination = {
	page: number
	perPage: number
}

type UsePaginationOptions = {
	initialPage?: number
	initialPerPage?: number
}

type UsePaginationReturn<T> = {
	pagination: Pagination
	paginatedData: T[]
	totalItems: number
	handlePagination: (page: number, perPage: number) => void
	resetToFirstPage: () => void
	goToPage: (page: number) => void
	setPerPage: (perPage: number) => void
}

const DEFAULT_PAGINATION = {
	page: 1,
	perPage: 10,
} as const

const paginate = <T>(array: T[], page: number, pageSize: number): T[] => {
	return [...array].slice((page - 1) * pageSize, page * pageSize)
}

const usePagination = <T>(data: T[], options: UsePaginationOptions = {}): UsePaginationReturn<T> => {
	const { initialPage = DEFAULT_PAGINATION.page, initialPerPage = DEFAULT_PAGINATION.perPage } = options

	const [pagination, setPagination] = useState<Pagination>({
		page: initialPage,
		perPage: initialPerPage,
	})

	const handlePagination = useCallback((page: number, perPage: number) => {
		setPagination(state => {
			if (state.perPage !== perPage) {
				return {
					page: DEFAULT_PAGINATION.page,
					perPage,
				}
			}
			return {
				page,
				perPage: state.perPage,
			}
		})
	}, [])

	const resetToFirstPage = useCallback(() => {
		setPagination(prev => ({ ...prev, page: DEFAULT_PAGINATION.page }))
	}, [])

	const goToPage = useCallback((page: number) => {
		setPagination(prev => ({ ...prev, page }))
	}, [])

	const setPerPage = useCallback((perPage: number) => {
		setPagination({
			page: DEFAULT_PAGINATION.page,
			perPage,
		})
	}, [])

	const paginatedData = useMemo(() => {
		return paginate(data, pagination.page, pagination.perPage)
	}, [data, pagination.page, pagination.perPage])

	const totalItems = data.length

	return {
		pagination,
		paginatedData,
		totalItems,
		handlePagination,
		resetToFirstPage,
		goToPage,
		setPerPage,
	}
}

export {
	DEFAULT_PAGINATION,
	paginate,
	usePagination,
	type Pagination,
	type UsePaginationOptions,
	type UsePaginationReturn,
}
