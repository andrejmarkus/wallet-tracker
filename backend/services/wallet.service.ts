import prisma from "../database/prisma";
import { DatabaseOperationError } from "../errors";
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

export async function createWallet(address: string): Promise<Wallet> {
    try {
        const wallet = await prisma.wallet.create({
            data: { address }
        });

        return { address: wallet.address };
    } catch {
        throw new DatabaseOperationError();
    }
}

export async function deleteWalletByAddress(address: string): Promise<void> {
    try {
        await prisma.wallet.delete({
            where: { address }
        });
    } catch {
        throw new DatabaseOperationError();
    }
}