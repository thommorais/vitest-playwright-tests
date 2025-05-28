import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { PostContext } from '_/components/ui/posts-context'
import { useContext } from 'react'

const TableWrapper = () => {
	const { posts, isLoading, error } = useContext(PostContext)

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-zinc-500'>Loading posts...</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-red-500'>Error: {error}</div>
			</div>
		)
	}

	return (
		<TableContainer className='inline-block min-w-full align-middle sm:px-(--gutter)'>
			<Table>
				<TableHead className='text-zinc-500 dark:text-zinc-400'>
					<TableRow className='uppercase [&_th]:text-xs [&_th]:tracking-widest'>
						<TableCell className='hidden border-b border-b-zinc-950/10 px-4 py-2 font-bold text-zinc-950 sm:first:pl-1 md:table-cell dark:border-b-white/10 dark:text-zinc-100'>
							user
						</TableCell>
						<TableCell className='hidden border-b border-b-zinc-950/10 px-4 py-2 font-bold text-zinc-950 md:table-cell md:w-4/12 dark:border-b-white/10 dark:text-zinc-100'>
							title
						</TableCell>
						<TableCell className='hidden border-b border-b-zinc-950/10 px-4 py-2 font-bold text-zinc-950 sm:last:pr-1 md:table-cell dark:border-b-white/10 dark:text-zinc-100'>
							content
						</TableCell>
						<TableCell className='tabel-cell border-b border-b-zinc-950/10 px-4 py-2 font-bold text-zinc-950 sm:first:pl-1 md:hidden dark:border-b-white/10 dark:text-zinc-100'>
							posts
						</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{posts.map(post => (
						<TableRow
							key={post.id}
							className='hover:bg-zinc-950/2.5 dark:hover:bg-white/2.5 dark:focus-within:bg-white/2.5'
						>
							<TableCell className='relative hidden border-zinc-950/5 border-b px-4 py-4 text-center font-mono text-zinc-950 tabular-nums sm:first:pl-1 md:table-cell dark:border-white/5 dark:text-zinc-400'>
								{`${post.userId}`.padStart(2, '0')}
							</TableCell>
							<TableCell className='relative text-balance border-zinc-950/5 px-4 py-4 font-medium text-zinc-950 capitalize max-md:block md:border-b dark:text-zinc-100/75 md:dark:border-white/5'>
								{post.title}
							</TableCell>
							<TableCell className='relative text-pretty border-zinc-950/5 border-b px-4 py-4 text-zinc-950 max-md:block sm:last:pr-1 dark:border-white/5 dark:text-zinc-400'>
								{post.body}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export { TableWrapper }
