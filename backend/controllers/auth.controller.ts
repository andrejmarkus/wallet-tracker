import { NextFunction, Request, Response } from 'express';
import { userLoginSchema, userRegisterSchema } from '../schemas';
import { InvalidRequestError, UserNotLoggedInError } from '../errors';
import { generateJwtRefreshToken, generateJwtToken, loginUser, registerUser } from '../services/auth.service';
import { JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, JWT_REFRESH_SECRET, NODE_ENV } from '../config/env';
import { JwtPayload, verify } from 'jsonwebtoken';
import ms from 'ms';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const login = userLoginSchema.safeParse(req.body);

    if (!login.success) throw new InvalidRequestError();

    const user = await loginUser(login.data);
    const refreshToken = generateJwtRefreshToken(user.id);
    const token = generateJwtToken(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ms(JWT_REFRESH_EXPIRES_IN)
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ms(JWT_EXPIRES_IN)
    });
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user
      },
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const registration = userRegisterSchema.safeParse(req.body);

    if (!registration.success) throw new InvalidRequestError();

    const user = await registerUser(registration.data);
    const refreshToken = generateJwtRefreshToken(user.id);
    const token = generateJwtToken(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ms(JWT_REFRESH_EXPIRES_IN)
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ms(JWT_EXPIRES_IN)
    });
    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: { 
        user
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.cookies['token'] || !req.cookies['refreshToken']) throw new UserNotLoggedInError();

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ms(JWT_REFRESH_EXPIRES_IN)
    });
    res.clearCookie('token', {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ms(JWT_EXPIRES_IN)
    });
    res.status(200).json({ message: 'User signed out successfully' });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) throw new UserNotLoggedInError();

    const decoded = verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayload;
    const token = generateJwtToken(decoded.userId);

    res.cookie('token', token, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ms(JWT_EXPIRES_IN)
    });
    
    res.status(200).json({ message: 'Token refreshed successfully' });
  } catch (error) {
    next(error);
  }
}
