import { Router } from 'express';
import { users, userById, user } from '../controllers/user.controller';
import passport from 'passport';

const userRouter: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users/authorized:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 */
userRouter.get('/authorized', passport.authenticate('jwt', { session: false }), user);

userRouter.get('/', passport.authenticate('jwt', { session: false }), users);
userRouter.get('/:id', passport.authenticate('jwt', { session: false }), userById);

export default userRouter;

