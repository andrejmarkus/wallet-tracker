import prisma from "../database/prisma";
import { DatabaseOperationError, WalletNotFoundError } from "../errors";
import { Wallet } from "../types";

export async function getWallets(): Promise<Wallet[]> {
    try {
        const wallets = await prisma.wallet.findMany({
            select: {
                address: true,
            }
        })

        return wallets;
    } catch {
        throw new DatabaseOperationError();
    }
}

export async function getWalletsOfUser(userId: string): Promise<Wallet[]> {
    try {
        const wallets = await prisma.wallet.findMany({
            where: {
                users: {
                    some: { id: userId }
                }
            },
            select: {
                address: true,
            }
        });

        return wallets;
    } catch {
        throw new DatabaseOperationError();
    }
}

export async function createWalletForUser(address: string, userId: string): Promise<Wallet> {
    try {
        const existingWallet = await prisma.wallet.findUnique({
            where: { address }
        });

        if (existingWallet) {
            await prisma.wallet.update({
                where: { address },
                data: {
                    users: {
                        connect: { id: userId }
                    }
                }
            });

            return existingWallet;
        }

        const wallet = await prisma.wallet.create({
            data: {
                address,
                users: {
                    connect: { id: userId }
                }
            },
            select: {
                address: true,
            }
        });

        return wallet;
    } catch {
        throw new DatabaseOperationError();
    }
}

export async function deleteWalletForUser(address: string, userId: string): Promise<void> {
    let wallet;

    try {
        wallet = await prisma.wallet.findUnique({
            where: { address },
            select: {
                users: {
                    select: { id: true }
                }
            }
        });
    } catch {
        throw new DatabaseOperationError();
    }

    if (!wallet) {
        throw new WalletNotFoundError();
    }

    try {
        if (wallet.users.length === 1 && wallet.users[0].id === userId) {
            await prisma.wallet.delete({
                where: { address }
            });
        } else {
            await prisma.wallet.update({
                where: { address },
                data: {
                    users: {
                        disconnect: { id: userId }
                    }
                }
            });
        }
    } catch {
        throw new DatabaseOperationError();
    }
}