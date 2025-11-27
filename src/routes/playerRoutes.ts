import { Router } from 'express';
import {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  uploadAvatar
} from '../controllers/playerController';
import { basicAuth } from '../middleware/auth';
import { uploadAvatar as uploadAvatarMiddleware } from '../middleware/upload';

const router = Router();

router.get('/', getAllPlayers);
router.get('/:id', getPlayerById);
router.post('/', basicAuth, createPlayer);
router.put('/:id', basicAuth, updatePlayer);
router.delete('/:id', basicAuth, deletePlayer);
router.post('/upload-avatar', basicAuth, uploadAvatarMiddleware.single('avatar'), uploadAvatar);

export default router;

