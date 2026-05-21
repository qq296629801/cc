import express, { Request, Response, NextFunction } from 'express';
import { InMemoryTaskStore } from './models/task';
import { createTaskRoutes } from './routes/tasks';
import { AppError } from './middleware/error-handler';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware
app.use(express.json());

// Routes
const store = new InMemoryTaskStore();
app.use('/api/tasks', createTaskRoutes(store));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SDD Task Manager running on http://localhost:${PORT}`);
  });
}

export { app, store };
