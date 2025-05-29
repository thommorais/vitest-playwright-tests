import { createSearcher } from '_/lib/fuzzy-search'
import { useCallback, useDeferredValue, useMemo, useState } from 'react'

type SearchableItem = {
	[key: string]: unknown
}

type UseSearchOptions<T> = {
	searchFields: (keyof T)[]
}

type UseSearchReturn<T> = {
	searchResult: T[]
	handleSearch: (term: string) => void
}

const useSearch = <T extends SearchableItem>(data: T[], options: UseSearchOptions<T>): UseSearchReturn<T> => {
	const [searchTerm, setSearchTerm] = useState('')

	const handleSearch = useCallback((term: string) => setSearchTerm(term), [])

	const fuzzySearch = useMemo(() => {
		if (!data.length) return null

		return createSearcher<T>(data, {
			getValue: item => {
				return options.searchFields
					.map(field => String(item[field] ?? ''))
					.join(' ')
					.toLowerCase()
					.trim()
			},
			threshold: 0.6,
		})
	}, [data, options.searchFields])

	const deferredSearchTerm = useDeferredValue(searchTerm)

	const searchResult = useMemo(() => {
		if (!data.length) return []
		if (!fuzzySearch) return data

		const term = deferredSearchTerm.toLowerCase().trim()
		return term ? fuzzySearch.search(term) : data
	}, [fuzzySearch, data, deferredSearchTerm])

	const deferredSearchResult = useDeferredValue(searchResult)

	return {
		searchResult: deferredSearchResult,
		handleSearch,
	}
}

export { useSearch, type UseSearchOptions, type UseSearchReturn }
