import { ENDPOINTS, type Post, getPosts } from '_/services/services'
import useSWR from 'swr'

type SwrResult<T> = {
	data: T | undefined
	error: string | undefined
	isLoading: boolean
}

const usePosts = (): SwrResult<Post[]> => {
	const { data, error, isLoading } = useSWR(
		ENDPOINTS.POSTS,
		async () => {
			const result = await getPosts()
			if (!result.success) {
				throw new Error(result.error)
			}
			return result.data
		},
		{
			revalidateOnReconnect: true,
			revalidateOnFocus: true,
			refreshInterval: 5000,
		},
	)

	return {
		data,
		error: error?.message,
		isLoading,
	}
}

export { usePosts }
