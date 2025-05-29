import { usePosts } from '_/components/hooks/use-get-posts'
import { useSearch } from '_/components/hooks/use-search'
import type { EventFor } from '_/lib/event-for'
import type { Post } from '_/services/services'
import { usePostsStore } from '_/stores/posts-store'
import { useEffect, useRef } from 'react'

const SEARCH_FIELDS = {
	TITLE: 'title',
	BODY: 'body',
} as const

const setFilteredPosts = usePostsStore.getState().setFilteredPosts

const InputWrapper = () => {
	const inputRef = useRef<HTMLInputElement>(null)
	const { data: posts } = usePosts()

	const { searchResult: filteredPosts, handleSearch } = useSearch<Post>(posts || [], {
		searchFields: [SEARCH_FIELDS.TITLE, SEARCH_FIELDS.BODY],
	})

	useEffect(() => {
		setFilteredPosts(filteredPosts)
	}, [filteredPosts])

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
				event.preventDefault()
				inputRef.current?.focus()
				inputRef.current?.select()
			}
		}
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [])

	const onChange = (event: EventFor<'input', 'onChange'>) => handleSearch(event.target.value)

	return (
		<input
			ref={inputRef}
			onChange={onChange}
			type='search'
			autoComplete='false'
			className='relative block w-full appearance-none bg-transparent focus:outline-hidden sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] '
		/>
	)
}

const PostsSearch = () => {
	return (
		<div className='mt-4 sm:max-w-6/12'>
			<label htmlFor='query' className='block font-medium text-sm/6'>
				Search posts by title or content
			</label>
			<div className='mt-2'>
				<div className='dark:scheme-dark relative flex w-full rounded-lg border border-zinc-950/10 bg-transparent px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] text-base/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] sm:text-sm/6 dark:border-white/10 dark:text-white dark:data-disabled:border-white/15 dark:hover:border-white/20'>
					<InputWrapper />
					<div className='flex py-1.5 pr-1.5'>
						<kbd className='inline-flex items-center rounded-sm px-1 font-sans text-xs'>⌘K</kbd>
					</div>
				</div>
			</div>
		</div>
	)
}

export { PostsSearch }
