import { NextFunction, Request, Response } from "express";
import { getWallets, deleteWalletForUser, getWalletsOfUser, createWalletForUser, updateWalletNameForUser, getWalletOfUserByAddress } from "../services/wallet.service";
import { InvalidRequestError, UserNotFoundError, WalletNotFoundError } from "../errors";
import { walletSchema, walletUpdateSchema } from "../schemas";

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

export const userWallets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

export const userWalletByAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const address = req.params.address;

        if (!userId) throw new UserNotFoundError();

        const wallet = await getWalletOfUserByAddress(address, userId);

        if (!wallet) throw new WalletNotFoundError();

        res.status(200).json({
            status: "success",
            message: "Authorized user's wallet retrieved successfully",
            data: { wallet },
        });
    } catch (error) {
        next(error);
    }
}

export const createUserWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) throw new UserNotFoundError();

        const walletData = walletSchema.safeParse(req.body);

        if (!walletData.success) throw new InvalidRequestError();

        const { address, name } = walletData.data;
        const wallet = await createWalletForUser(address, userId, name);

        res.status(201).json({
            status: "success",
            message: "Wallet created successfully",
            data: { wallet },
        });
    } catch (error) {
        next(error);
    }
}

export const updateUserWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const address = req.params.address;

        if (!userId) throw new UserNotFoundError();

        const walletData = walletUpdateSchema.safeParse(req.body);

        if (!walletData.success) throw new InvalidRequestError();

        const { name } = walletData.data;
        await updateWalletNameForUser(address, userId, name);

        res.status(200).json({
            status: "success",
            message: "Wallet updated successfully"
        });
    } catch (error) {
        next(error);
    }
}

export const deleteUserWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const address = req.params.address;

        if (!userId) throw new UserNotFoundError();
        
        await deleteWalletForUser(address, userId);

        res.status(200).json({
            status: "success",
            message: "Wallet deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}