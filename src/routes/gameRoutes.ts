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

const router = Router();

router.get('/', getAllGames);
router.get('/:id', getGameById);
router.get('/player/:playerId', getPlayerGames);
router.get('/player/:playerId/statistics', getPlayerStatistics);
router.post('/', createGame);
router.put('/:id', updateGame);
router.delete('/:id', deleteGame);

export default router;

