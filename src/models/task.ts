export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface TaskStore {
  findAll(status?: TaskStatus): Task[];
  findById(id: number): Task | undefined;
  create(input: CreateTaskInput): Task;
  update(id: number, input: UpdateTaskInput): Task | undefined;
  delete(id: number): boolean;
  clear(): void;
}

export class InMemoryTaskStore implements TaskStore {
  private tasks: Map<number, Task> = new Map();
  private nextId = 1;

  clear(): void {
    this.tasks.clear();
    this.nextId = 1;
  }

  findAll(status?: TaskStatus): Task[] {
    const all = Array.from(this.tasks.values());
    if (status) {
      return all.filter((t) => t.status === status);
    }
    return all;
  }

  findById(id: number): Task | undefined {
    return this.tasks.get(id);
  }

  create(input: CreateTaskInput): Task {
    const now = new Date().toISOString();
    const task: Task = {
      id: this.nextId++,
      title: input.title,
      description: input.description ?? '',
      status: input.status ?? 'todo',
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.set(task.id, task);
    return task;
  }

  update(id: number, input: UpdateTaskInput): Task | undefined {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;

    const updated: Task = {
      ...existing,
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.status !== undefined && { status: input.status }),
      updatedAt: new Date().toISOString(),
    };
    this.tasks.set(id, updated);
    return updated;
  }

  delete(id: number): boolean {
    return this.tasks.delete(id);
  }
}
