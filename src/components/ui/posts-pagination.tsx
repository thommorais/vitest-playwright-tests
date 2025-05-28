import TablePagination from '@mui/material/TablePagination'
import { DEFAULT_PAGINATION } from '_/components/hooks/use-pagination'
import { PostContext } from '_/components/ui/posts-context'
import { useContext } from 'react'

type PaginationProps = {
	handlePagination: (page: number, perPage: number) => void
}

const PaginationWrapper = ({ handlePagination }: PaginationProps) => {
	const { page, perPage, totalPosts } = useContext(PostContext)

	return (
		<TablePagination
			rowsPerPageOptions={[
				DEFAULT_PAGINATION.perPage,
				DEFAULT_PAGINATION.perPage * 2,
				DEFAULT_PAGINATION.perPage * 3,
				DEFAULT_PAGINATION.perPage * 4,
				DEFAULT_PAGINATION.perPage * 10,
			]}
			component='footer'
			count={totalPosts}
			rowsPerPage={perPage}
			page={page - 1}
			onPageChange={(_, clickedPage) => handlePagination(clickedPage + 1, perPage)}
			onRowsPerPageChange={event => handlePagination(page, Number(event.target.value))}
			className='mt-auto font-sans text-xs text-zinc-950 uppercase tracking-widest dark:text-zinc-400/75 [&_button:disabled_svg_path]:opacity-30 [&_svg_path]:text-zinc-950 dark:[&_svg_path]:text-zinc-500'
		/>
	)
}

export { PaginationWrapper }
