# Instructions

Welcome to IntegrityDesk, a Next.js 16 application.

## Technology Stack
- Next.js 16.2.2 with App Router and Turbopack
- React 19.2.0
- Tailwind CSS v4
- Prisma ORM
- TypeScript
- Vercel Speed Insights

## Working Principles
- Keep changes minimal and localized
- Follow existing patterns already used in the codebase
- Prefer root-cause fixes over broad refactors
- Do not introduce new dependencies without review
- Do not invent files, APIs, components, hooks, database fields, or environment variables
- Preserve existing routing, public interfaces, and component behavior unless the task explicitly requires change

## Workflow
1. Read the relevant files before making changes
2. Identify the root cause before proposing a fix
3. Prefer the smallest safe patch
4. Run the smallest relevant validation command first
5. Run `npm run validate` before finalizing changes
6. Use `npm run push` only when explicitly requested

## Next.js / React Guidance
- Prefer Server Components by default
- Use Client Components only when browser-only interactivity is required
- Do not add `"use client"` unless necessary
- Preserve the App Router structure
- Avoid moving logic to the client if it can remain on the server
- Be careful with hydration-sensitive code, browser APIs, and animation hooks

## UI and Component Style
- Use existing UI components and patterns
- Maintain mobile responsiveness
- Keep components small, focused, and reusable
- Follow existing animation patterns with `framer-motion`
- Prefer stable, maintainable UI over unnecessary visual complexity
- Do not degrade accessibility, responsiveness, or performance for animation effects

## Data and Database
- Use Prisma patterns already established in the codebase
- Do not modify Prisma schema or migrations unless the task explicitly requires database changes
- Treat authentication, authorization, and database-related changes as high risk
- State assumptions clearly before changing data models or data access code

## Validation Expectations
- Use only commands defined in `package.json`
- For small changes, prefer targeted validation before full validation
- For changes affecting routing, rendering boundaries, or production behavior, also consider `npm run build`
- Clearly state what was validated and what was not validated

## Response Expectations
When completing a coding task, structure the output as:
1. Root cause
2. Files changed
3. Exact fix
4. Risks or assumptions
5. Verification steps
