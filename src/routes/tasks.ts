import { Router, Request, Response, NextFunction } from 'express';
import { TaskStore, CreateTaskInput, UpdateTaskInput, TaskStatus } from '../models/task';
import { ValidationError, NotFoundError } from '../middleware/error-handler';

const VALID_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done'];

function toString(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

function parseId(id: string | string[]): number {
  const str = toString(id);
  const num = Number(str);
  if (!Number.isInteger(num) || num < 1) {
    throw new ValidationError('id must be a positive integer');
  }
  return num;
}

function validateCreate(input: unknown): CreateTaskInput {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('Request body must be a JSON object');
  }
  const { title, description, status } = input as Record<string, unknown>;

  if (typeof title !== 'string' || title.trim().length === 0) {
    throw new ValidationError('title is required and must be a non-empty string');
  }
  if (title.length > 200) {
    throw new ValidationError('title must not exceed 200 characters');
  }
  if (description !== undefined && typeof description !== 'string') {
    throw new ValidationError('description must be a string');
  }
  if (description !== undefined && (description as string).length > 2000) {
    throw new ValidationError('description must not exceed 2000 characters');
  }
  if (status !== undefined && !VALID_STATUSES.includes(status as TaskStatus)) {
    throw new ValidationError(
      `status must be one of: ${VALID_STATUSES.join(', ')}`,
    );
  }

  return {
    title: (title as string).trim(),
    ...(description !== undefined && { description: description as string }),
    ...(status !== undefined && { status: status as TaskStatus }),
  };
}

function validateUpdate(input: unknown): UpdateTaskInput {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('Request body must be a JSON object');
  }
  const { title, description, status } = input as Record<string, unknown>;

  if (Object.keys(input as object).length === 0) {
    throw new ValidationError('Request body must contain at least one field to update');
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      throw new ValidationError('title must be a non-empty string');
    }
    if (title.length > 200) {
      throw new ValidationError('title must not exceed 200 characters');
    }
  }
  if (description !== undefined && typeof description !== 'string') {
    throw new ValidationError('description must be a string');
  }
  if (description !== undefined && (description as string).length > 2000) {
    throw new ValidationError('description must not exceed 2000 characters');
  }
  if (status !== undefined && !VALID_STATUSES.includes(status as TaskStatus)) {
    throw new ValidationError(
      `status must be one of: ${VALID_STATUSES.join(', ')}`,
    );
  }

  const result: UpdateTaskInput = {};
  if (title !== undefined) result.title = (title as string).trim();
  if (description !== undefined) result.description = description as string;
  if (status !== undefined) result.status = status as TaskStatus;
  return result;
}

export function createTaskRoutes(store: TaskStore): Router {
  const router = Router();

  // POST /api/tasks
  router.post('/', (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = validateCreate(req.body);
      const task = store.create(input);
      res.status(201).json({ data: task });
    } catch (err) {
      next(err);
    }
  });

  // GET /api/tasks
  router.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawStatus = req.query.status;
      const statusParam = rawStatus ? toString(rawStatus as string | string[]) : undefined;

      if (statusParam && !VALID_STATUSES.includes(statusParam as TaskStatus)) {
        throw new ValidationError(
          `status filter must be one of: ${VALID_STATUSES.join(', ')}`,
        );
      }

      const tasks = store.findAll(statusParam as TaskStatus | undefined);
      res.json({ data: tasks });
    } catch (err) {
      next(err);
    }
  });

  // GET /api/tasks/:id
  router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseId(req.params.id);
      const task = store.findById(id);
      if (!task) {
        throw new NotFoundError('Task');
      }
      res.json({ data: task });
    } catch (err) {
      next(err);
    }
  });

  // PUT /api/tasks/:id
  router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseId(req.params.id);
      const input = validateUpdate(req.body);
      const task = store.update(id, input);
      if (!task) {
        throw new NotFoundError('Task');
      }
      res.json({ data: task });
    } catch (err) {
      next(err);
    }
  });

  // DELETE /api/tasks/:id
  router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseId(req.params.id);
      const found = store.findById(id);
      if (!found) {
        throw new NotFoundError('Task');
      }
      store.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
}
