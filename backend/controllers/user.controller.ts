import { Request, Response, NextFunction } from 'express';
import { getUserById, getUsers } from '../services/user.service';

export const users = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await getUsers();

    res.status(200).json({
      status: 'success',
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
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
