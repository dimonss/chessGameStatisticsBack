import { Router } from 'express';
import {
  getAllGames,
  getGameById,
  getPlayerGames,
  getPlayerStatistics,
  createGame,
  updateGame,
  deleteGame
} from '../controllers/gameController';
import { basicAuth } from '../middleware/auth';

const router = Router();

router.get('/', getAllGames);
router.get('/:id', getGameById);
router.get('/player/:playerId', getPlayerGames);
router.get('/player/:playerId/statistics', getPlayerStatistics);
router.post('/', basicAuth, createGame);
router.put('/:id', basicAuth, updateGame);
router.delete('/:id', basicAuth, deleteGame);

export default router;

