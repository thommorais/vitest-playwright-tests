import { PaginationWrapper } from '_/components/ui/posts-pagination'
import { PostsSearch } from '_/components/ui/posts-search'
import { TableWrapper } from '_/components/ui/posts-table'
import { Suspense } from 'react'

const Posts = () => {
	return (
		<section className='mx-auto my-12 flex w-screen max-w-6xl grow flex-col p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10'>
			<header className='mb-10'>
				<Suspense>
					<PostsSearch />
				</Suspense>
			</header>
			<Suspense>
				<TableWrapper />
			</Suspense>
			<Suspense>
				<PaginationWrapper />
			</Suspense>
		</section>
	)
}

export { Posts }
