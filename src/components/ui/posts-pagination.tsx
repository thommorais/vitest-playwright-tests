import TablePagination from '@mui/material/TablePagination'
import { DEFAULT_PAGINATION, usePagination } from '_/components/hooks/use-pagination'
import { useFilteredPosts, usePostsStore } from '_/stores/posts-store'
import { useEffect } from 'react'

const setPosts = usePostsStore.getState().setPosts

const rowsPerPageOptions = [
	DEFAULT_PAGINATION.perPage,
	DEFAULT_PAGINATION.perPage * 2,
	DEFAULT_PAGINATION.perPage * 3,
	DEFAULT_PAGINATION.perPage * 4,
	DEFAULT_PAGINATION.perPage * 10,
]

const PaginationWrapper = () => {
	const filteredPosts = useFilteredPosts()
	const { pagination, paginatedData, totalItems, handlePagination } = usePagination(filteredPosts)

	useEffect(() => {
		setPosts(paginatedData)
	}, [paginatedData])

	return (
		<TablePagination
			rowsPerPageOptions={rowsPerPageOptions}
			component='footer'
			count={totalItems}
			rowsPerPage={pagination.perPage}
			page={pagination.page - 1}
			onPageChange={(_, clickedPage) => handlePagination(clickedPage + 1, pagination.perPage)}
			onRowsPerPageChange={event => handlePagination(pagination.page, Number(event.target.value))}
			className='mt-auto font-sans text-xs text-zinc-950 uppercase tracking-widest dark:text-zinc-400/75 [&_button:disabled_svg_path]:opacity-30 [&_svg_path]:text-zinc-950 dark:[&_svg_path]:text-zinc-500'
		/>
	)
}

export { PaginationWrapper }
