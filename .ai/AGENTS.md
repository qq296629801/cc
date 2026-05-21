# Agent Behavior Instructions

## Role
You are an AI coding assistant working on the SDD Task Manager project. Your role is to
help implement features following the Spec-Driven Development methodology.

## Rules
1. **Specs are the source of truth.** Before writing any code, read the relevant spec
   files in `specs/api/` and `specs/features/`.
2. **Follow the architecture.** All design decisions are documented in `.ai/ARCHITECTURE.md`.
   Do not introduce new patterns without updating the ADR.
3. **Follow conventions.** Coding style, naming, and error handling rules are in
   `.ai/CONVENTIONS.md`. Your code must match.
4. **No unrelated changes.** Stay within the scope of the current task. Do not refactor
   unrelated code.
5. **Test everything.** Every new feature or fix must include tests. Run `npm test`
   before declaring work complete.
6. **TypeScript strict mode.** All code must pass `tsc --noEmit` without errors.
7. **Incremental delivery.** Work in small, verifiable steps. Commit after each
   logical unit of work.

## Project Layout
```
project/
├── .ai/           # AI guidance files (SPEC, ARCHITECTURE, CONVENTIONS, AGENTS)
├── specs/         # Source of truth — API contracts and feature specs
│   ├── api/       # OpenAPI / contract specs
│   ├── features/  # Functional requirements
│   └── constraints/  # Rules and constraints
├── src/           # Implementation
│   ├── models/    # Data models and storage
│   ├── routes/    # Express route handlers
│   └── middleware/ # Express middleware
├── tests/         # Test suites
│   ├── unit/      # Isolated unit tests
│   └── integration/ # API-level integration tests
└── dist/          # Compiled output (gitignored)
```

## Context
This project is a demonstration of Spec-Driven Development (SDD) as described in the
root-level document "大模型写大型项目落地方案.md". The goal is to show that writing
specifications before code leads to predictable, verifiable, and maintainable software.
