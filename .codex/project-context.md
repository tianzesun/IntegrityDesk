# Project Context

## Project
IntegrityDesk is a Next.js 16 educational platform.

## Primary Goal
Deliver a modern, responsive educational web experience while preserving build stability, type safety, and maintainability.

## Priority Order
1. Correctness
2. Build stability
3. Backward compatibility
4. Performance
5. UI polish and animation quality

## Architecture
- Next.js 16 App Router
- React 19
- Server Components by default
- Client Components only where interactivity is required
- Prisma for database access
- Tailwind CSS v4 for styling
- TypeScript across application code
- Deployed on Vercel

## Important UI Characteristics
- Responsive layout
- Scroll-based interactions
- Framer Motion animations
- 3D tilt and magnetic button effects
- Progressive enhancement preferred over fragile visual effects

## Change Philosophy
- Prefer minimal, localized fixes
- Preserve existing architecture and routing structure
- Do not refactor broadly unless explicitly requested
- Do not degrade mobile responsiveness
- Avoid introducing client-side logic where a server-side solution is more appropriate

## High-Risk Areas
- `prisma/` schema and migrations
- Authentication and authorization logic
- App Router boundaries between Server and Client Components
- Hooks affecting layout, scroll, or pointer interactions
- Build configuration, environment handling, and Vercel deployment settings

## File Responsibilities
- `src/app/` - routes, layouts, server/client page composition
- `src/components/` - reusable UI components
- `src/hooks/` - custom hooks for interaction and behavior
- `prisma/` - schema, migrations, and database-related changes
- `public/` - static assets only

## Expectations for Changes
- Explain root cause before proposing a fix
- State assumptions clearly
- Keep diffs small
- Validate with the smallest relevant command set before finalizing
