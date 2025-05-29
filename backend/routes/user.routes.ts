import { Router } from 'express';
import { users, userById, user } from '../controllers/user.controller';
import passport from 'passport';

const userRouter: Router = Router();

userRouter.get('/', passport.authenticate('jwt', { session: false }), users);
userRouter.get('/authorized', passport.authenticate('jwt', { session: false }), user);
userRouter.get('/:id', passport.authenticate('jwt', { session: false }), userById);

export default userRouter;
