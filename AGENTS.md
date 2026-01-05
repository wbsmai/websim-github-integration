# AGENTS.md

This file contains guidelines and commands for agentic coding agents working in this repository.

## Project Overview

Websim GitHub Integration - bidirectional sync between Websim projects and GitHub repositories.

## Development Commands

```bash
# Code quality
bun run lint       # Run linting
bun run format     # Format code

# Building
bun run build      # Build Astro site + userscript
bun run deploy     # Deploy to Cloudflare Workers
```

## Code Style Guidelines

### TypeScript Configuration

- Extends Astro's "strictest" configuration
- Strict typing enforced, all files included except `dist/`

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
const [isLoading, setIsLoading] = createSignal(false);

function GitHubIntegration() {
  // Implementation
}

export { GitHubIntegration };
```

### API Integration Patterns

**GitHub API (Octokit):**

```typescript
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
try {
  const repo = await octokit.repos.get({ owner, repo });
} catch (error) {
  console.error("Failed to fetch repository:", error);
}
```

**Websim API:**

```typescript
const response = await fetch(
  `https://websim.com/api/v1/projects/${projectId}/revisions/${revisionId}/assets`,
);
const assets = await response.json();
const assetUrl = `https://${projectId}.c.websim.com/${asset.path}?v=${revisionId}`;
```

## Architecture

- Entry: `src/userscript/index.tsx`
- Build output: `dist/userscript/index.user.js`
- Userscript config: `userscript.config.ts` (metadata, match patterns)
- Backend: Cloudflare Workers (wrangler deploy)
- Sync direction: Websim ↔ GitHub

## File Organization

```text
src/
├── userscript/
│   ├── index.tsx           # Main entry
│   ├── components/         # Solid.js components
│   ├── services/          # API services
│   ├── types/             # TypeScript types
│   └── utils/             # Utilities
└── pages/
    └── index.astro        # Astro pages
```

## Environment Variables

- `GITHUB_TOKEN`: GitHub API authentication
- Configure in Wrangler for deployment

## Development Workflow

1. Write TypeScript code in strict mode
2. Run `bun run lint` to check issues
3. Run `bun run format` to organize imports/format
4. Test manually (no automated tests yet)
5. Build with `bun run build`
6. Deploy with `bun run deploy`

## Key Notes

- Focus on code quality and safety
- Use Solid.js reactive patterns
- Implement proper GitHub app webhook handling
- Ensure correct GitHub app permissions/auth flows
