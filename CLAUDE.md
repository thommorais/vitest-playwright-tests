# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production (includes TypeScript compilation)
- `pnpm test` - Run unit tests with Vitest
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:ui` - Run tests with Vitest UI
- `pnpm test:e2e` - Run Playwright end-to-end tests
- `pnpm test:e2e:ui` - Run Playwright tests with UI
- `pnpm test:e2e:headed` - Run Playwright tests in headed mode
- `pnpm lint` - Run Biome linter on src directory
- `pnpm format` - Format code with Biome

## Architecture Overview

This is a React 19 + TypeScript application displaying posts data with search and pagination functionality.

### Core Architecture
- **App.tsx**: Main app component with Material-UI theme provider and global styles
- **Posts component**: Central orchestrator using React Context pattern to manage state
- **Custom hooks pattern**: Business logic separated into reusable hooks (`use-get-posts`, `use-pagination`, `use-search`)
- **Context-based state management**: PostContext provides shared state to child components
- **Service layer**: API abstraction with typed responses and error handling

### Data Flow
1. Posts component fetches data via `usePosts` hook (using SWR)
2. Search functionality filters posts via `useSearch` hook with configurable fields
3. Pagination operates on filtered results via `usePagination` hook
4. All state flows through PostContext to child components (table, search, pagination)

### Key Patterns
- Path aliasing: `_/` maps to `src/` directory
- Custom hooks for state management and side effects
- Service layer returns discriminated union types for success/error handling
- Material-UI components styled with Tailwind CSS using CSS layers
- Comprehensive testing with Vitest (unit) and Playwright (e2e)

### Testing Strategy
- Unit tests: Located alongside components/hooks with `.test.ts` extension
- E2E tests: Use `.spec.ts` extension and run against local dev server
- Test data: Generated with Faker.js and validated with Zod schemas
- Coverage reporting excludes setup files, types, and config files

### Code Style (Biome)
- Tabs for indentation, 120 character line width
- Single quotes, trailing commas, semicolons as needed
- Arrow function parentheses as needed
- Tailwind class sorting enforced via `useSortedClasses` rule