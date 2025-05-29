import { Router } from 'express';

import { login, register, logout, refresh } from '../controllers/auth.controller';

const authRouter: Router = Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/logout', logout);
authRouter.post('/refresh', refresh);

export default authRouter;
