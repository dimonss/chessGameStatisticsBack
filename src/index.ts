import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import path from 'path';
import multer from 'multer';
import { runMigrations } from './database/migrations';
import playerRoutes from './routes/playerRoutes';
import gameRoutes from './routes/gameRoutes';
import authRoutes from './routes/authRoutes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (avatars)
const apiPrefix = process.env.NODE_ENV === 'development' ? '/api' : '';
app.use(`${apiPrefix}/uploads`, express.static(path.join(process.cwd(), 'uploads')));

// Initialize database
runMigrations();

// API docs
app.use(`${apiPrefix}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.get(`${apiPrefix}/docs.json`, (req, res) => {
  res.json(swaggerSpec);
});

// Routes - use /api prefix only in development
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/players`, playerRoutes);
app.use(`${apiPrefix}/games`, gameRoutes);

// Health check
app.get(`${apiPrefix}/health`, (req, res) => {
  res.json({ status: 'ok', message: 'Chess Statistics API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  // Handle multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: err.message });
  }
  
  // Handle other upload errors
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});

