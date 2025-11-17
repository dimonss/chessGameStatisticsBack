import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { runMigrations } from './database/migrations';
import playerRoutes from './routes/playerRoutes';
import gameRoutes from './routes/gameRoutes';

config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
runMigrations();

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/games', gameRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chess Statistics API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});

