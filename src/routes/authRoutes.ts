import { Router } from 'express';
import { basicAuth, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Verify authentication credentials
 *     tags: [Auth]
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 username:
 *                   type: string
 *       401:
 *         description: Authentication failed
 */
router.post('/verify', basicAuth, (req: AuthRequest, res) => {
    res.json({
        success: true,
        username: req.user
    });
});

export default router;
