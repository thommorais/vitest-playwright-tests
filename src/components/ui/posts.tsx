import { usePosts } from '_/components/hooks/use-get-posts'
import { usePagination } from '_/components/hooks/use-pagination'
import { useSearch } from '_/components/hooks/use-search'
import { PostContext } from '_/components/ui/posts-context'
import { PaginationWrapper } from '_/components/ui/posts-pagination'
import { PostsSearch } from '_/components/ui/posts-search'
import { TableWrapper } from '_/components/ui/posts-table'
import type { Post } from '_/services/services'
import { useCallback, useMemo } from 'react'

const SEARCH_FIELDS = {
	TITLE: 'title',
	BODY: 'body',
} as const

const Posts = () => {
	const { data: posts, error, isLoading } = usePosts()

	const { searchResult: filteredPosts, handleSearch } = useSearch<Post>(posts || [], {
		searchFields: [SEARCH_FIELDS.TITLE, SEARCH_FIELDS.BODY],
	})

	const {
		pagination,
		paginatedData: postsPaginated,
		totalItems: totalPosts,
		handlePagination,
		resetToFirstPage,
	} = usePagination(filteredPosts)

	const onSearch = useCallback(
		(searchString: string) => {
			handleSearch(searchString)
			resetToFirstPage()
		},
		[handleSearch, resetToFirstPage],
	)

	const contextValue = useMemo(
		() => ({
			posts: postsPaginated,
			totalPosts,
			isLoading,
			error,
			...pagination,
		}),
		[postsPaginated, totalPosts, isLoading, error, pagination],
	)

	return (
		<PostContext.Provider value={contextValue}>
			<section className='mx-auto my-12 flex w-screen max-w-6xl grow flex-col p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10'>
				<header className='mb-10'>
					<PostsSearch handleSearch={onSearch} />
				</header>
				<TableWrapper />
				<PaginationWrapper handlePagination={handlePagination} />
			</section>
		</PostContext.Provider>
	)
}

export { Posts }
