# Coding Conventions — SDD Task Manager

## TypeScript
- Strict mode enabled (`tsconfig.json`: `"strict": true`)
- Prefer `interface` for object shapes, `type` for unions/aliases
- Use explicit return types on exported functions
- No `any` — use `unknown` and narrow with type guards

## Naming
- **Files**: kebab-case (`error-handler.ts`, `task-model.test.ts`)
- **Interfaces**: PascalCase, no `I` prefix (`Task`, `TaskStore`)
- **Functions**: camelCase (`createTask`, `getTaskById`)
- **Constants**: UPPER_SNAKE_CASE for true constants (`MAX_TITLE_LENGTH`)

## Error Handling
- All errors flow through the centralized error middleware
- Throw `AppError` subclasses, never raw `Error` in route handlers
- Validation errors return 400, not-found returns 404, server errors return 500

## API Design
- All responses use `Content-Type: application/json`
- Success shape: `{ data: <payload> }`
- Error shape: `{ error: { code: string, message: string } }`
- Empty responses (204) have no body

## Testing
- Unit tests: `tests/unit/` — test models and pure logic in isolation
- Integration tests: `tests/integration/` — test API endpoints via supertest
- Test file naming: `<module>.test.ts`
- Use descriptive test names: `should return 404 when task does not exist`

## Git
- Conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`
- No committing `node_modules/`, `dist/`, or `.env`
