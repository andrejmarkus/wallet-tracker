import { NextFunction, Request, Response } from "express";
import { getWallets, deleteWalletByAddress, getWalletsOfUser, createWallet } from "../services/wallet.service";
import { InvalidRequestError, UserNotFoundError } from "../errors";
import { walletSchema } from "../schemas";

export const wallets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const wallets = await getWallets();

        res.status(200).json({
            status: "success",
            message: "Wallets retrieved successfully",
            data: { wallets },
        });
    } catch (error) {
        next(error);
    }
}

export const walletsOfAuthorizedUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) throw new UserNotFoundError();

        const wallets = await getWalletsOfUser(userId);

        res.status(200).json({
            status: "success",
            message: "Authorized user's wallets retrieved successfully",
            data: { wallets },
        });
    } catch (error) {
        next(error);
    }
}

export const createNewWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const walletData = walletSchema.safeParse(req.body);

        if (!walletData.success) throw new InvalidRequestError();

        const wallet = await createWallet(walletData.data.address);

        res.status(201).json({
            status: "success",
            message: "Wallet created successfully",
            data: { wallet },
        });
    } catch (error) {
        next(error);
    }
}

export const deleteWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { address } = req.params;

        await deleteWalletByAddress(address);

        res.status(200).json({
            status: "success",
            message: "Wallet deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}