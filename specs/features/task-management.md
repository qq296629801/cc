# Feature Specification: Task Management

**Version:** 1.0.0  
**Status:** Draft  
**Source of truth:** This document defines what the system must do. Implementation must conform to this spec.

---

## Overview

Task Management provides basic CRUD operations for tasks. A task represents a unit of work
with a title, optional description, and status.

## Data Model

### Task Entity

| Field       | Type     | Required | Constraints                          |
|------------|----------|----------|--------------------------------------|
| id         | number   | yes      | Auto-increment, read-only            |
| title      | string   | yes      | 1–200 characters, non-empty         |
| description| string   | no       | 0–2000 characters                   |
| status     | string   | yes      | One of: `todo`, `in_progress`, `done` |
| createdAt  | ISO 8601 | yes      | Set on creation, read-only           |
| updatedAt  | ISO 8601 | yes      | Set on creation and update, read-only|

### Status Lifecycle

```
todo → in_progress → done
  └─────────────────────┘ (can skip in_progress)
```

Any status can transition to any other status (no workflow enforcement in v1.0).

## Functional Requirements

### FR-1: Create Task
- **Endpoint:** `POST /api/tasks`
- **Input:** JSON body with `title` (required), `description` (optional), `status` (optional, default `todo`)
- **Output:** 201 with created task object in `data` field
- **Errors:** 400 if `title` is missing, empty, or exceeds 200 characters

### FR-2: List Tasks
- **Endpoint:** `GET /api/tasks`
- **Input:** Optional query parameter `status` to filter by status
- **Output:** 200 with array of task objects in `data` field
- **Behavior:** Returns all tasks if no filter; returns empty array if no matches

### FR-3: Get Task
- **Endpoint:** `GET /api/tasks/:id`
- **Input:** Task ID as path parameter (positive integer)
- **Output:** 200 with task object in `data` field
- **Errors:** 404 if task does not exist

### FR-4: Update Task
- **Endpoint:** `PUT /api/tasks/:id`
- **Input:** JSON body with any combination of `title`, `description`, `status`
- **Output:** 200 with updated task object in `data` field
- **Behavior:** Partial update — only provided fields are changed; `updatedAt` is refreshed
- **Errors:** 404 if task does not exist; 400 if title validation fails

### FR-5: Delete Task
- **Endpoint:** `DELETE /api/tasks/:id`
- **Input:** Task ID as path parameter
- **Output:** 204 No Content
- **Errors:** None (idempotent — deleting a non-existent task is a no-op, but 404 is returned for clarity)

### FR-6: Error Response Format
All error responses use the shape:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description"
  }
}
```

## Non-Functional Requirements

- **NFR-1:** API response time < 500ms for any endpoint under normal load
- **NFR-2:** No external dependencies (database, cache) required to run
- **NFR-3:** All code passes TypeScript strict mode compilation
