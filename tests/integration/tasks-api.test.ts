import request from 'supertest';
import { app, store } from '../../src/index';

describe('Tasks API', () => {
  beforeEach(() => {
    store.clear();
  });
  describe('POST /api/tasks', () => {
    it('should create a task and return 201', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'New Task' });

      expect(res.status).toBe(201);
      expect(res.body.data).toMatchObject({
        id: expect.any(Number),
        title: 'New Task',
        status: 'todo',
      });
      expect(res.body.data.createdAt).toBeDefined();
      expect(res.body.data.updatedAt).toBeDefined();
    });

    it('should return 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 when title is empty', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: '' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 when title exceeds 200 characters', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'x'.repeat(201) });

      expect(res.status).toBe(400);
    });

    it('should accept optional description and status', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task', description: 'Details', status: 'in_progress' });

      expect(res.status).toBe(201);
      expect(res.body.data.description).toBe('Details');
      expect(res.body.data.status).toBe('in_progress');
    });
  });

  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      await request(app).post('/api/tasks').send({ title: 'Task 1' });
      await request(app).post('/api/tasks').send({ title: 'Task 2' });

      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });

    it('should return empty array when no tasks exist', async () => {
      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it('should filter by status', async () => {
      await request(app).post('/api/tasks').send({ title: 'Todo', status: 'todo' });
      await request(app).post('/api/tasks').send({ title: 'Done', status: 'done' });

      const res = await request(app).get('/api/tasks?status=done');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe('Done');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a task by id', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Find Me' });

      const taskId = createRes.body.data.id;

      const res = await request(app).get(`/api/tasks/${taskId}`);

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Find Me');
    });

    it('should return 404 when task does not exist', async () => {
      const res = await request(app).get('/api/tasks/999');

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Original' });

      const taskId = createRes.body.data.id;

      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ title: 'Updated' });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Updated');
    });

    it('should return 404 when task does not exist', async () => {
      const res = await request(app)
        .put('/api/tasks/999')
        .send({ title: 'Ghost' });

      expect(res.status).toBe(404);
    });

    it('should return 400 when no fields provided', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task' });

      const taskId = createRes.body.data.id;

      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task and return 204', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Delete Me' });

      const taskId = createRes.body.data.id;

      const res = await request(app).delete(`/api/tasks/${taskId}`);

      expect(res.status).toBe(204);
      expect(res.body).toEqual({});

      // Verify deleted
      const getRes = await request(app).get(`/api/tasks/${taskId}`);
      expect(getRes.status).toBe(404);
    });

    it('should return 404 when task does not exist', async () => {
      const res = await request(app).delete('/api/tasks/999');

      expect(res.status).toBe(404);
    });
  });
});
