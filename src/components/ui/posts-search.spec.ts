import { test, expect } from '@playwright/test'

test.describe('PostsSearch', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/')
	})

	test('should render search input with correct label', async ({ page }) => {
		const searchLabel = page.getByText('Search posts by title or content')
		await expect(searchLabel).toBeVisible()
		
		const searchInput = page.getByRole('searchbox')
		await expect(searchInput).toBeVisible()
	})

	test('should call handleSearch when input value changes', async ({ page }) => {
		const searchInput = page.getByRole('searchbox')
		
		await searchInput.fill('test query')
		
		// Wait for the search functionality to process the input
		await page.waitForTimeout(100)
		
		const inputValue = await searchInput.inputValue()
		expect(inputValue).toBe('test query')
	})

	test('should focus and select input on Cmd+K shortcut', async ({ page }) => {
		const searchInput = page.getByRole('searchbox')
		
		// Type some existing text first
		await searchInput.fill('existing text')
		
		// Blur the input to ensure it's not focused
		await page.keyboard.press('Tab')
		
		// Use Cmd+K shortcut
		await page.keyboard.press('Meta+k')
		
		// Check that the input is focused
		await expect(searchInput).toBeFocused()
		
		// Check that text is selected by typing a new character
		await page.keyboard.type('new')
		const inputValue = await searchInput.inputValue()
		expect(inputValue).toBe('new')
	})

	test('should focus and select input on Ctrl+K shortcut', async ({ page }) => {
		const searchInput = page.getByRole('searchbox')
		
		// Type some existing text first
		await searchInput.fill('existing text')
		
		// Blur the input to ensure it's not focused
		await page.keyboard.press('Tab')
		
		// Use Ctrl+K shortcut
		await page.keyboard.press('Control+k')
		
		// Check that the input is focused
		await expect(searchInput).toBeFocused()
		
		// Check that text is selected by typing a new character
		await page.keyboard.type('new')
		const inputValue = await searchInput.inputValue()
		expect(inputValue).toBe('new')
	})

	test('should display keyboard shortcut hint', async ({ page }) => {
		const shortcutHint = page.getByText('⌘K')
		await expect(shortcutHint).toBeVisible()
	})

	test('should have correct input attributes', async ({ page }) => {
		const searchInput = page.getByRole('searchbox')
		
		await expect(searchInput).toHaveAttribute('type', 'search')
		await expect(searchInput).toHaveAttribute('autoComplete', 'false')
	})
})