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

	const deferredSearchTerm = useDeferredValue(searchTerm)

	const searchResult = useMemo(() => {
		if (!data.length) {
			return []
		}

		const searcjTerm = deferredSearchTerm.toLowerCase().trim()

		if (!searcjTerm) {
			return data
		}

		return data.filter(item =>
			options.searchFields.some(field => {
				if (typeof item[field] !== 'string') {
					return false
				}
				return item[field].toLowerCase().includes(searcjTerm)
			}),
		)
	}, [data, deferredSearchTerm, options.searchFields])

	return {
		searchTerm,
		searchResult,
		handleSearch,
	}
}

export { useSearch, type UseSearchOptions, type UseSearchReturn }
