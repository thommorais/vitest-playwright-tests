const API = 'https://jsonplaceholder.typicode.com' as const

const ENDPOINTS = {
	POSTS: 'posts',
} as const

type ApiResponse<T> =
	| {
			success: true
			data: T
	  }
	| {
			success: false
			error: string
	  }

type EndpointValues = (typeof ENDPOINTS)[keyof typeof ENDPOINTS]

const getter = async <T = unknown>(url: EndpointValues): Promise<ApiResponse<T>> => {
	try {
		const endpoint = `${API}/${url}` as const

		const response = await fetch(endpoint)

		if (!response.ok) {
			return {
				success: false,
				error: `HTTP ${response.status}: ${response.statusText}`,
			}
		}

		const data: T = await response.json()

		return {
			success: true,
			data,
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknwon error',
		}
	}
}

type Post = {
	userId: number
	id: number
	title: string
	body: string
}

const getPosts = async (): Promise<ApiResponse<Post[]>> => {
	return getter<Post[]>(ENDPOINTS.POSTS)
}

export { ENDPOINTS, getPosts, getter, type ApiResponse, type Post }
