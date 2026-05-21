# Architecture Decision Records

## ADR-001: In-Memory Storage
**Date:** 2026-05-21  
**Status:** Accepted

### Context
The project is a demo of SDD methodology, not a production system. A database would add
infrastructure complexity without advancing the SDD demonstration goal.

### Decision
Use an in-memory `Map<string, Task>` for task storage with synchronous CRUD operations.

### Consequences
- **Positive**: Zero setup, instant tests, no external dependencies
- **Negative**: Data lost on restart; not suitable for real usage
- **Mitigation**: Documented as out-of-scope; the storage layer is abstracted so it can be
  replaced with a real database by swapping the store implementation

## ADR-002: Express over Fastify/Koa
**Date:** 2026-05-21  
**Status:** Accepted

### Context
Need a minimal HTTP framework. Express has the largest ecosystem and most developers are
familiar with its patterns.

### Decision
Use Express 4.x with built-in JSON body parser.

### Consequences
- **Positive**: Familiar patterns, huge middleware ecosystem
- **Negative**: Slower than Fastify; callback-based middleware
- **Mitigation**: Performance is not a concern for this demo

## ADR-003: Specs-First Development
**Date:** 2026-05-21  
**Status:** Accepted

### Context
The project must demonstrate SDD as described in the requirements document.

### Decision
All API contracts and feature specs are written, reviewed, and committed before any
implementation code is written.

### Consequences
- **Positive**: Clear contract, prevents scope creep, enables test-driven development
- **Negative**: Upfront investment in spec writing
- **Mitigation**: Specs are intentionally lean (not exhaustive) to match demo scope
