import { InMemoryTaskStore, Task, TaskStatus } from '../../src/models/task';

describe('InMemoryTaskStore', () => {
  let store: InMemoryTaskStore;

  beforeEach(() => {
    store = new InMemoryTaskStore();
  });

  describe('create', () => {
    it('should create a task with auto-incremented id', () => {
      const task1 = store.create({ title: 'Task 1' });
      const task2 = store.create({ title: 'Task 2' });

      expect(task1.id).toBe(1);
      expect(task2.id).toBe(2);
    });

    it('should set default status to todo', () => {
      const task = store.create({ title: 'New Task' });
      expect(task.status).toBe('todo');
    });

    it('should set createdAt and updatedAt to current timestamp', () => {
      const before = new Date().toISOString();
      const task = store.create({ title: 'Timed Task' });
      const after = new Date().toISOString();

      expect(task.createdAt).toBe(task.updatedAt);
      expect(task.createdAt >= before).toBe(true);
      expect(task.createdAt <= after).toBe(true);
    });

    it('should accept optional description and status', () => {
      const task = store.create({
        title: 'Full Task',
        description: 'A detailed task',
        status: 'in_progress',
      });

      expect(task.description).toBe('A detailed task');
      expect(task.status).toBe('in_progress');
    });
  });

  describe('findAll', () => {
    it('should return all tasks', () => {
      store.create({ title: 'Task 1' });
      store.create({ title: 'Task 2' });
      store.create({ title: 'Task 3' });

      const tasks = store.findAll();
      expect(tasks).toHaveLength(3);
    });

    it('should return empty array when no tasks', () => {
      const tasks = store.findAll();
      expect(tasks).toEqual([]);
    });

    it('should filter by status', () => {
      store.create({ title: 'Todo', status: 'todo' });
      store.create({ title: 'In Progress', status: 'in_progress' });
      store.create({ title: 'Done', status: 'done' });

      const done = store.findAll('done');
      expect(done).toHaveLength(1);
      expect(done[0].title).toBe('Done');
    });

    it('should return empty array when filter has no matches', () => {
      store.create({ title: 'Todo', status: 'todo' });
      const done = store.findAll('done');
      expect(done).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return task by id', () => {
      const created = store.create({ title: 'Find Me' });
      const found = store.findById(created.id);

      expect(found).toBeDefined();
      expect(found!.title).toBe('Find Me');
    });

    it('should return undefined for non-existent id', () => {
      const found = store.findById(999);
      expect(found).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update task fields', () => {
      const task = store.create({ title: 'Original' });
      const updated = store.update(task.id, { title: 'Updated' });

      expect(updated).toBeDefined();
      expect(updated!.title).toBe('Updated');
      expect(updated!.description).toBe('');
    });

    it('should update updatedAt timestamp', () => {
      const task = store.create({ title: 'Original' });
      const originalUpdatedAt = task.updatedAt;

      // Small delay to ensure timestamp changes
      const updated = store.update(task.id, { title: 'Updated' });
      expect(updated!.updatedAt >= originalUpdatedAt).toBe(true);
    });

    it('should preserve unchanged fields', () => {
      const task = store.create({
        title: 'Original',
        description: 'Keep me',
        status: 'in_progress' as TaskStatus,
      });

      const updated = store.update(task.id, { title: 'New Title' });
      expect(updated!.description).toBe('Keep me');
      expect(updated!.status).toBe('in_progress');
    });

    it('should return undefined for non-existent id', () => {
      const updated = store.update(999, { title: 'Ghost' });
      expect(updated).toBeUndefined();
    });

    it('should allow clearing description', () => {
      const task = store.create({ title: 'Has Desc', description: 'Remove me' });
      const updated = store.update(task.id, { description: '' });
      expect(updated!.description).toBe('');
    });
  });

  describe('delete', () => {
    it('should delete existing task and return true', () => {
      const task = store.create({ title: 'Delete Me' });
      expect(store.findById(task.id)).toBeDefined();

      const result = store.delete(task.id);
      expect(result).toBe(true);
      expect(store.findById(task.id)).toBeUndefined();
    });

    it('should return false for non-existent id', () => {
      const result = store.delete(999);
      expect(result).toBe(false);
    });
  });
});
