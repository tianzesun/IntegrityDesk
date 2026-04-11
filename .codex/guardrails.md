# Project Guardrails

## Core Rules
- Keep changes minimal and localized
- Fix root cause, not just symptoms
- Do not rewrite working code unless explicitly requested
- Do not introduce new dependencies without approval
- Do not invent APIs, files, functions, database columns, or environment variables
- Follow existing patterns already used in the repository

## Safe Change Policy
- Prefer the smallest safe patch
- Preserve public interfaces unless explicitly asked to change them
- Do not rename files, exports, routes, tables, or API fields unless necessary
- Do not change build tooling, linting, CI, or deployment config unless the task requires it

## High-Risk Areas
- Treat authentication, authorization, payments, migrations, and production configs as high risk
- For high-risk areas, explain the risk before changing code
- Never modify secrets, `.env*`, private keys, or credential files

## Validation
- Run `npm run validate` before finalizing changes
- If tests exist, run the smallest relevant test scope first
- State clearly what was validated and what was not validated

## Git Rules
- Never force-push to main
- Never commit secrets
- Use clear, specific commit messages that describe the actual change

## Security
- Sanitize and validate all user inputs
- Avoid logging secrets, tokens, or personal data
- Apply least-privilege thinking to access-related code

## Response Style for Codex
- First explain root cause
- Then list files to change
- Then provide the exact patch
- Then provide verification steps
- State assumptions explicitly
