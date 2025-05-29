import type { Post } from '_/services/services'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface PostsState {
	posts: Post[]
	filteredPosts: Post[]
	totalPosts: number
	isLoading: boolean
	error: string | undefined
}

interface PostsActions {
	setPosts: (posts: Post[]) => void
	setFilteredPosts: (posts: Post[]) => void
	setTotalPosts: (total: number) => void
	setLoading: (loading: boolean) => void
	setError: (error: string | undefined) => void
}

export const usePostsStore = create<PostsState & PostsActions>()(
	subscribeWithSelector(set => ({
		posts: [],
		filteredPosts: [],
		totalPosts: 0,
		isLoading: false,
		error: undefined,
		setPosts: posts => set(state => (state.posts === posts ? state : { posts })),
		setFilteredPosts: filteredPosts =>
			set(state => (state.filteredPosts === filteredPosts ? state : { filteredPosts })),
		setTotalPosts: totalPosts => set(state => (state.totalPosts === totalPosts ? state : { totalPosts })),
		setLoading: isLoading => set(state => (state.isLoading === isLoading ? state : { isLoading })),
		setError: error => set(state => (state.error === error ? state : { error })),
	})),
)

export const usePosts = () => usePostsStore(state => state.posts)
export const useFilteredPosts = () => usePostsStore(state => state.filteredPosts)
export const useTotalPosts = () => usePostsStore(state => state.totalPosts)
export const useIsLoading = () => usePostsStore(state => state.isLoading)
export const useError = () => usePostsStore(state => state.error)

export const usePostsActions = () =>
	usePostsStore(state => ({
		setPosts: state.setPosts,
		setFilteredPosts: state.setFilteredPosts,
		setTotalPosts: state.setTotalPosts,
		setLoading: state.setLoading,
		setError: state.setError,
	}))
