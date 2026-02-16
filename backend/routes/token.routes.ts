import { Router } from 'express';
import { tokenDetails } from '../controllers/token.controller';
import passport from 'passport';

const tokenRouter: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Tokens
 *   description: Token metadata and details
 */

/**
 * @swagger
 * /tokens:
 *   post:
 *     summary: Get metadata for a specific token
 *     tags: [Tokens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mint
 *             properties:
 *               mint:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token details
 */
tokenRouter.post('/', passport.authenticate('jwt', { session: false }), tokenDetails);

export default tokenRouter;

