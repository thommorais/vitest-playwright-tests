import { createSearcher } from '_/lib/fuzzy-search'
import { useCallback, useDeferredValue, useMemo, useState } from 'react'

type SearchableItem = {
	[key: string]: unknown
}

type UseSearchOptions<T> = {
	searchFields: (keyof T)[]
}

type UseSearchReturn<T> = {
	searchTerm: string
	searchResult: T[]
	handleSearch: (term: string) => void
}

const useSearch = <T extends SearchableItem>(data: T[], options: UseSearchOptions<T>): UseSearchReturn<T> => {
	const [searchTerm, setSearchTerm] = useState('')

	const handleSearch = useCallback((term: string) => {
		setSearchTerm(term)
	}, [])

	const fuzySearch = useMemo(() => {
		return createSearcher<T>(data, {
			getValue: post => {
				const str = options.searchFields
					.map(field => post[field])
					.join(' ')
					.toLowerCase()
					.trim()
				return str
			},
			threshold: 0.6,
		})
	}, [data, options.searchFields])

	const searchResult = useMemo(() => {
		if (!data.length) {
			return []
		}
		const searcjTerm = searchTerm.toLowerCase().trim()

		if (!searcjTerm) {
			return data
		}

		return fuzySearch.search(searcjTerm)
	}, [fuzySearch, data, searchTerm])

	const deferredSearchResults = useDeferredValue(searchResult) as T[]

	return {
		searchTerm,
		searchResult: deferredSearchResults,
		handleSearch,
	}
}

export { useSearch, type UseSearchOptions, type UseSearchReturn }
