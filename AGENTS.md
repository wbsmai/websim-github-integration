# AGENTS.md

This file contains guidelines and commands for agentic coding agents working in this repository.

## Project Overview

This is a **Websim GitHub Integration** project that creates a GitHub app for bidirectional synchronization between Websim projects and GitHub repositories. The backend logic is deployed to Cloudflare Workers. The project uses:

- **Runtime**: Bun
- **Framework**: Astro 6.0.0-alpha.4 (static site generator)
- **Language**: TypeScript with React JSX (`.tsx` files)
- **UI Library**: Solid.js v1.9.10
- **API Client**: Octokit v5.0.5 (GitHub API client)
- **Build Tool**: USTS (UserScript TypeScript compiler)
- **Deployment**: Wrangler (Cloudflare Workers)

## Development Commands

### Code Quality

```bash
# Run linting
bun run lint

# Format code
bun run format
```

### Building

```bash
# Build userscript (no package script defined, use USTS directly)
bunx usts build

# Build with Wrangler for deployment
bunx wrangler deploy
```

### Testing

**Note**: No test framework is currently configured. When adding tests, set up appropriate test commands in package.json.

## Code Style Guidelines

### TypeScript Configuration

- Extends Astro's "strictest" configuration
- All source files included except `dist` directory
- Strict typing enforced

### Linting Rules (OXLint)

All rules are configured as "warn" level:

#### Safety & Security

- No `eval`, `with`, or unsafe practices allowed
- No debugger statements in production code
- Proper async/await usage enforced
- No floating promises (`typescript/no-floating-promises`)

#### Code Quality

- No unused variables, imports, or expressions
- Proper array method usage with comparison functions
- String methods: prefer `startsWith()`/`endsWith()` over regex
- No duplicate enum values or type constituents
- Proper error handling and throwing

#### TypeScript Specific

- Strict null checking and optional chaining
- No non-null assertions unless absolutely necessary
- Proper async/await for thenable objects
- Array sorting requires comparison function
- Template expressions restricted to safe types

#### Import Organization

- Experimental import sorting enabled (OXFMT)
- Imports will be auto-formatted and organized

### Naming Conventions

- Use **camelCase** for variables and functions
- Use **PascalCase** for classes, components, and types
- Use **UPPER_SNAKE_CASE** for constants
- File names: **kebab-case** for directories, **camelCase** for TypeScript files

### Import Patterns

```typescript
// External libraries first
import { Octokit } from "octokit";
import { createSignal } from "solid-js";

// Internal imports next
import { GitHubService } from "./services/github";
import { WebsimAsset } from "./types/websim";
```

### Error Handling

- Always handle async errors with try/catch or .catch()
- Use proper TypeScript error types
- Never throw non-Error objects
- Use descriptive error messages

### Component Patterns (Solid.js)

```typescript
// Use signals for state management
const [isLoading, setIsLoading] = createSignal(false);

// Component function names should be PascalCase
function GitHubIntegration() {
  // Implementation
}

// Export components individually
export { GitHubIntegration };
```

### GitHub App Architecture

- Entry point: `src/userscript/index.tsx`
- Build output: `dist/userscript/index.user.js`
- Use USTS configuration for metadata (name, namespace, description, match patterns)
- Backend deployed to Cloudflare Workers via Wrangler
- Handles bidirectional sync: Websim ↔ GitHub

### API Integration Patterns

#### GitHub API (Octokit)

```typescript
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Proper error handling
try {
  const repo = await octokit.repos.get({ owner, repo });
} catch (error) {
  console.error("Failed to fetch repository:", error);
}
```

#### Websim API

```typescript
// Asset fetching pattern
const response = await fetch(
  `https://websim.com/api/v1/projects/${projectId}/revisions/${revisionId}/assets`,
);
const assets = await response.json();

// Individual asset access
const assetUrl = `https://${projectId}.c.websim.com/${asset.path}?v=${revisionId}`;
```

## File Organization

```
src/
├── userscript/
│   ├── index.tsx           # Main userscript entry
│   ├── components/         # Solid.js components
│   ├── services/          # API services (GitHub, Websim)
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
└── pages/
    └── index.astro        # Astro pages (if needed)
```

## Environment Variables

- `GITHUB_TOKEN`: For GitHub API authentication
- Set in Wrangler configuration for deployment

## Development Workflow

1. Write code following TypeScript strict mode
2. Run `bun run lint` to check for issues
3. Run `bun run format` to organize imports and format code
4. Test functionality manually (no automated tests yet)
5. Build userscript with `bunx usts build`
6. Deploy with `bunx wrangler deploy` when ready

## Important Notes

- All linting rules are warnings, not blocking errors
- Focus on code quality and safety
- Use Solid.js patterns for reactive UI components
- Follow Websim API integration plan in TODO.md for asset fetching
- This is a GitHub app - implement proper webhook handling for bidirectional sync
- Ensure proper GitHub app permissions and authentication flows
