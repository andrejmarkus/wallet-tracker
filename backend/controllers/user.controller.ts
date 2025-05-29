import { Request, Response, NextFunction } from 'express';
import { getUserById, getUsers } from '../services/user.service';
import { UserNotFoundError } from '../errors';

export const users = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await getUsers();

    res.status(200).json({
      status: 'success',
      message: 'Users retrieved successfully',
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

export const userById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    res.status(200).json({
      status: 'success',
      message: 'User retrieved successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const user = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;

    if (!user) throw new UserNotFoundError();

    res.status(200).json({
      status: 'success',
      message: 'User retrieved successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}
