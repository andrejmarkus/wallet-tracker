import prisma from "../database/prisma";
import { DatabaseOperationError, WalletNotFoundError } from "../errors";
import { Wallet } from "../types";

export async function getWallets(): Promise<Wallet[]> {
    try {
        const wallets = await prisma.wallet.findMany({
            select: {
                address: true,
            }
        });

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
                    some: {
                        userId
                    }
                }
            },
            select: {
                address: true,
                users: {
                    where: {
                        userId
                    },
                    select: {
                        name: true
                    }
                }
            }
        });

        return wallets.map(wallet => ({
            address: wallet.address,
            name: wallet.users[0]?.name
        }));
    } catch {
        throw new DatabaseOperationError();
    }
}

export async function getWalletOfUserByAddress(address: string, userId: string): Promise<Wallet | null> {
    try {
        const wallet = await prisma.wallet.findUnique({
            where: { address },
            include: {
                users: {
                    where: {
                        userId
                    }
                }
            }
        });

        if (!wallet || wallet.users.length === 0) {
            return null;
        }

        return {
            address: wallet.address,
            name: wallet.users[0].name
        };
    } catch {
        throw new DatabaseOperationError();
    }
}

export async function createWalletForUser(address: string, userId: string, walletName?: string | null): Promise<Wallet> {
    try {
        const existingWallet = await prisma.wallet.findUnique({
            where: { address },
            include: {
                users: {
                    where: {
                        userId
                    }
                }
            }
        });

        if (existingWallet) {
            if (existingWallet.users.length === 0) {
                await prisma.userWallet.create({
                    data: {
                        userId,
                        walletId: address,
                        name: walletName
                    }
                });
            } else {
                await prisma.userWallet.update({
                    where: {
                        userId_walletId: {
                            userId,
                            walletId: address
                        }
                    },
                    data: {
                        name: walletName
                    }
                });
            }

            return {
                address: existingWallet.address,
                name: walletName
            };
        }

        await prisma.wallet.create({
            data: {
                address,
                users: {
                    create: {
                        userId,
                        name: walletName
                    }
                }
            }
        });

        return {
            address,
            name: walletName
        };
    } catch {
        throw new DatabaseOperationError();
    }
}

export async function updateWalletNameForUser(address: string, userId: string, newName?: string | null): Promise<void> {
    try {
        const wallet = await prisma.wallet.findUnique({
            where: { address },
            include: {
                users: true
            }
        });

        if (!wallet) {
            throw new WalletNotFoundError();
        }

        const userWallet = wallet.users.find(user => user.userId === userId);
        if (!userWallet) {
            throw new WalletNotFoundError();
        }

        await prisma.userWallet.update({
            where: {
                userId_walletId: {
                    userId,
                    walletId: address
                }
            },
            data: {
                name: newName
            }
        });
    } catch (error) {
        if (error instanceof WalletNotFoundError) {
            throw error;
        }
        throw new DatabaseOperationError();
    }
}

export async function deleteWalletForUser(address: string, userId: string): Promise<void> {
    try {
        const wallet = await prisma.wallet.findUnique({
            where: { address },
            include: {
                users: true
            }
        });

        if (!wallet) {
            throw new WalletNotFoundError();
        }

        if (wallet.users.length === 1 && wallet.users[0].userId === userId) {
            await prisma.wallet.delete({
                where: { address }
            });
        } else {
            await prisma.userWallet.delete({
                where: {
                    userId_walletId: {
                        userId,
                        walletId: address
                    }
                }
            });
        }
    } catch (error) {
        if (error instanceof WalletNotFoundError) {
            throw error;
        }
        throw new DatabaseOperationError();
    }
}