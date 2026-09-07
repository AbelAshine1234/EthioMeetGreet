import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db/init';
import talentsRouter from './routes/talents';
import categoriesRouter from './routes/categories';
import bookingsRouter from './routes/bookings';
import reviewsRouter from './routes/reviews';
import adminRouter from './routes/admin';
import webrtcRouter from './routes/webrtc';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/talents', talentsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/webrtc', webrtcRouter);

// Health check route
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'Meet and Greet Backend API',
    time: new Date().toISOString()
  });
});

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Meet and Greet API - Cameo-style Meet and Greet Platform',
    endpoints: {
      health: '/api/health',
      talents: '/api/talents',
      categories: '/api/categories',
      occasions: '/api/categories/occasions',
      bookings: '/api/bookings',
      reviews: '/api/reviews',
      adminStats: '/api/admin/stats'
    }
  });
});

// Start server after DB initialization
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Meet and Greet Backend running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('Fatal: Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
