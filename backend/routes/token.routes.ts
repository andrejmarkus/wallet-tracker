import { Router } from 'express';
import { tokenDetails } from '../controllers/token.controller';
import passport from 'passport';

const tokenRouter: Router = Router();

tokenRouter.post('/', passport.authenticate('jwt', { session: false }), tokenDetails);

export default tokenRouter;
