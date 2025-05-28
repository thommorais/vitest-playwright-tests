# React Posts Application

[![CI](https://github.com/USER/REPO/workflows/CI/badge.svg)](https://github.com/USER/REPO/actions)
[![codecov](https://codecov.io/gh/USER/REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/USER/REPO)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)

A React application displaying posts data with search and pagination functionality.

## Features

- Data fetching from JSONPlaceholder API
- Real-time search with debounced input
- Configurable pagination
- Material-UI components with Tailwind CSS
- Comprehensive test suite with Vitest, Zod, and Faker
- Full TypeScript support
- Code coverage reporting

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests with coverage
pnpm test:coverage

# Build for production
pnpm build
```

## Scripts

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm test         # Run tests
pnpm test:coverage # Run tests with coverage
pnpm lint         # Run linter
pnpm format       # Format code
```

## Tech Stack

- React 19 with TypeScript
- Material-UI and Tailwind CSS
- SWR for data fetching
- Vite build tool
- Vitest testing framework
- Biome for linting and formatting

## Testing

The application includes comprehensive tests using:

- Vitest for unit testing
- Testing Library for component testing
- Zod schemas for type validation
- Faker.js for realistic test data generation
- Automated coverage reporting