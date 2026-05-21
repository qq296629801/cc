# Project Specification — SDD Task Manager

## Purpose
A Spec-Driven Development (SDD) demonstration project that implements a Task Management API.
This project serves as a reference implementation of the SDD methodology described in
"大模型写大型项目落地方案", where specifications are written and version-controlled before any code.

## Constraints
- **Runtime**: Node.js 22+, Express 4.x
- **Language**: TypeScript 5.x with strict mode
- **Storage**: In-memory (no database dependency for demo purposes)
- **API Style**: RESTful JSON API
- **No authentication**: This is a demo; auth is explicitly out of scope

## Key Design Decisions
1. Specs-first: `specs/api/` and `specs/features/` are the source of truth
2. Contract-driven: API behavior is defined in OpenAPI 3.0 before implementation
3. Modular: Each module is independently testable
4. Test coverage: Unit tests for models, integration tests for API endpoints

## Conventions
- All code must pass `tsc --noEmit` without errors
- All code must pass Jest tests
- API responses follow JSON:API-inspired format: `{ data, error }`
- Errors use consistent shape: `{ error: { code: string, message: string } }`
