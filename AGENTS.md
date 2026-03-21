# AGENTS.md

## Project Overview

Websim GitHub Integration - export from Websim projects to GitHub repositories.

## Development Commands

```bash
# Code quality
bun run lint       # Run linting
bun run format     # Format code

# Building
bun run build      # Build Astro site + userscript
```

## Architecture

- Entry: `src/userscript/index.tsx`
- Build output: `dist/userscript/index.user.js`
- Userscript config: `userscript.config.ts` (metadata, match patterns)

## File Organization

```text
src/
├── userscript/
│   ├── index.tsx          # Main entry
│   ├── components/        # Solid.js components
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
