import { DEFAULT_PAGINATION, type Pagination } from '_/components/hooks/use-pagination'
import type { Post } from '_/services/services'
import { createContext } from 'react'

const PostContext = createContext<
	{
		posts: Post[]
		totalPosts: number
		isLoading: boolean
		error: string | undefined
	} & Pagination
>({
	page: DEFAULT_PAGINATION.page,
	perPage: DEFAULT_PAGINATION.perPage,
	posts: [],
	totalPosts: 0,
	isLoading: false,
	error: undefined,
})

export { PostContext }
