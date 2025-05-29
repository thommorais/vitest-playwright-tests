interface SearchOptions<T> {
	readonly threshold?: number
	readonly limit?: number
	readonly getValue?: (item: T) => string
}

interface SearchResult<T> {
	readonly item: T
	readonly score: number
}

const DEFAULT_THRESHOLD = 0.3

const getEditDistance = (source: string, target: string): number => {
	const sourceLength = source.length
	const targetLength = target.length

	const matrix = Array.from({ length: targetLength + 1 }, (_, i) =>
		Array.from({ length: sourceLength + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
	)

	for (let i = 1; i <= targetLength; i++) {
		for (let j = 1; j <= sourceLength; j++) {
			const cost = source[j - 1] === target[i - 1] ? 0 : 1

			matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost)
		}
	}

	return matrix[targetLength][sourceLength]
}

const getSimilarity = (query: string, text: string): number => {
	const maxLength = Math.max(query.length, text.length)
	if (maxLength === 0) return 1

	const distance = getEditDistance(query.toLowerCase(), text.toLowerCase())
	return (maxLength - distance) / maxLength
}

const extractText = <T>(item: T, extractor?: (item: T) => string): string => {
	if (extractor) return extractor(item)
	if (typeof item === 'string') return item
	return String(item)
}

const calculateMatchScore = (query: string, text: string): number => {
	const normalizedQuery = query.toLowerCase().trim()
	const normalizedText = text.toLowerCase().trim()

	if (!normalizedQuery) return 0

	if (normalizedQuery === normalizedText) return 1

	if (normalizedText.includes(normalizedQuery)) {
		const lengthRatio = normalizedQuery.length / normalizedText.length
		return 0.8 + lengthRatio * 0.2
	}

	const queryWords = normalizedQuery.split(/\s+/)
	const textWords = normalizedText.split(/\s+/)

	const wordMatches = queryWords.filter(queryWord =>
		textWords.some(textWord => textWord.startsWith(queryWord) || getSimilarity(queryWord, textWord) > 0.7),
	).length

	if (wordMatches > 0) {
		const wordScore = wordMatches / queryWords.length
		const fuzzyScore = getSimilarity(normalizedQuery, normalizedText)
		return Math.max(wordScore * 0.6, fuzzyScore)
	}

	return getSimilarity(normalizedQuery, normalizedText)
}

const search = <T>(query: string, items: readonly T[], options: SearchOptions<T> = {}): T[] => {
	const { threshold = DEFAULT_THRESHOLD, limit, getValue } = options

	if (!query?.trim()) return []

	const results = items
		.map(
			(item): SearchResult<T> => ({
				item,
				score: calculateMatchScore(query, extractText(item, getValue)),
			}),
		)
		.filter(({ score }) => score >= threshold)
		.sort((a, b) => b.score - a.score)

	return (limit ? results.slice(0, limit) : results).map(({ item }) => item)
}

const searchWithScores = <T>(
	query: string,
	items: readonly T[],
	options: SearchOptions<T> = {},
): readonly SearchResult<T>[] => {
	const { threshold = DEFAULT_THRESHOLD, limit, getValue } = options

	if (!query?.trim()) return []

	const results = items
		.map(
			(item): SearchResult<T> => ({
				item,
				score: calculateMatchScore(query, extractText(item, getValue)),
			}),
		)
		.filter(({ score }) => score >= threshold)
		.sort((a, b) => b.score - a.score)

	return limit ? results.slice(0, limit) : results
}

const createSearcher = <T>(items: T[], options: SearchOptions<T> = {}) => ({
	search: (query: string) => search(query, items, options),
	searchWithScores: (query: string) => searchWithScores(query, items, options),
})

export { createSearcher }
