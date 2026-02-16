import { DatabaseOperationError, WalletNotFoundError } from "../errors";
import { Wallet } from "../types";
import walletRepository from "../repositories/wallet.repository";

export async function getWallets(): Promise<Wallet[]> {
    try {
        const wallets = await walletRepository.findAllWithSubscribers(); 
        return wallets.map(w => ({ address: w.address }));
    } catch {
        throw new DatabaseOperationError();
    }
}

export async function getWalletsOfUser(userId: string): Promise<Wallet[]> {
    try {
        const wallets = await walletRepository.findWalletsByUser(userId);
        return wallets.map(w => ({ address: w.address, name: w.name }));
    } catch {
        throw new DatabaseOperationError();
    }
}

export async function getWalletOfUserByAddress(address: string, userId: string): Promise<Wallet | null> {
    try {
        const uw = await walletRepository.findUserWallet(userId, address);

        if (!uw) {
            return null;
        }

        return {
            address: uw.walletId,
            name: uw.name
        };
    } catch {
        throw new DatabaseOperationError();
    }
}

export async function createWalletForUser(address: string, userId: string, walletName?: string | null): Promise<Wallet> {
    try {
        await walletRepository.upsert(address);
        
        const existingUw = await walletRepository.findUserWallet(userId, address);

        if (!existingUw) {
            await walletRepository.createUserWallet(userId, address, walletName ?? undefined);
        } else {
             await walletRepository.updateUserWallet(userId, address, walletName);
        }

        return { address, name: walletName };
    } catch {
        throw new DatabaseOperationError();
    }
}

export async function updateWalletNameForUser(address: string, userId: string, newName?: string | null): Promise<void> {
    try {
        const uw = await walletRepository.findUserWallet(userId, address);

        if (!uw) {
            throw new WalletNotFoundError();
        }

        await walletRepository.updateUserWallet(userId, address, newName);
    } catch (error) {
        if (error instanceof WalletNotFoundError) throw error;
        throw new DatabaseOperationError();
    }
}

export async function deleteWalletForUser(address: string, userId: string): Promise<void> {
    try {
        const uw = await walletRepository.findUserWallet(userId, address);

        if (!uw) {
            throw new WalletNotFoundError();
        }

        await walletRepository.deleteUserWallet(userId, address);
        await walletRepository.deleteWalletIfNoSubscribers(address);

    } catch (error) {
        if (error instanceof WalletNotFoundError) throw error;
        throw new DatabaseOperationError();
    }
}
