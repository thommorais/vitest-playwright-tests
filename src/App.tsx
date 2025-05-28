import GlobalStyles from '@mui/material/GlobalStyles'
import { StyledEngineProvider } from '@mui/material/styles'
import { Posts } from '_/components/ui/posts'

function App() {
	return (
		<StyledEngineProvider enableCssLayer>
			<GlobalStyles styles='@layer theme, base, mui, components, utilities;' />
			<main className='relative isolate flex min-h-svh w-full bg-white max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950'>
				<Posts />
			</main>
		</StyledEngineProvider>
	)
}

export default App
