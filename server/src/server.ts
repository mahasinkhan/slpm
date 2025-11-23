// src/server.ts or src/index.ts
import dotenv from 'dotenv';

// CRITICAL: Load environment variables FIRST, before any other imports
const result = dotenv.config();

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
  process.exit(1);
}

console.log('='.repeat(50));
console.log('✅ .env file loaded successfully');
console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL ? '✓ Set (' + process.env.DATABASE_URL.substring(0, 30) + '...)' : '✗ Missing');
console.log('🔍 JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ Missing');
console.log('='.repeat(50));

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes/index';
import { errorMiddleware } from './middleware/error.middleware';
import { loggerMiddleware } from './middleware/logger.middleware';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://slbnm.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({limit: '50mb', extended: true }));
app.use(loggerMiddleware);

// Health check endpoints (BEFORE other routes)
// Railway default health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    message: 'SL Brothers Ltd API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    message: 'SL Brothers Ltd API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to SL Brothers Ltd API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      employees: '/api/employees',
      interviews: '/api/interviews',
      content: '/api/content',
      contact: '/api/contact',
      terminations: '/api/terminations'
    }
  });
});

// API Routes - Mount all routes under /api
app.use('/api', routes);

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 SL Brothers Backend running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
  console.log('='.repeat(50));
  console.log('\n📝 Available Routes:');
  console.log('  - GET    /health (Railway health check)');
  console.log('  - GET    /api/health');
  console.log('  - POST   /api/auth/register');
  console.log('  - POST   /api/auth/login');
  console.log('  - GET    /api/auth/profile');
  console.log('  - GET    /api/users');
  console.log('  - GET    /api/employees');
  console.log('  - GET    /api/interviews');
  console.log('  - GET    /api/content');
  console.log('  - POST   /api/contact');
  console.log('  - GET    /api/terminations');
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;