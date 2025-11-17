import { Router } from 'express';
import {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
} from '../controllers/playerController';
import { basicAuth } from '../middleware/auth';

const router = Router();

router.get('/', getAllPlayers);
router.get('/:id', getPlayerById);
router.post('/', basicAuth, createPlayer);
router.put('/:id', basicAuth, updatePlayer);
router.delete('/:id', basicAuth, deletePlayer);

export default router;

