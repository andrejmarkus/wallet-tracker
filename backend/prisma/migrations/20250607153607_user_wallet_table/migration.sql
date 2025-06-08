/*
  Warnings:

  - You are about to drop the `_UserWallets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserWallets" DROP CONSTRAINT "_UserWallets_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserWallets" DROP CONSTRAINT "_UserWallets_B_fkey";

-- DropTable
DROP TABLE "_UserWallets";

-- CreateTable
CREATE TABLE "UserWallet" (
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserWallet_pkey" PRIMARY KEY ("userId","walletId")
);

-- CreateIndex
CREATE INDEX "UserWallet_walletId_idx" ON "UserWallet"("walletId");

-- AddForeignKey
ALTER TABLE "UserWallet" ADD CONSTRAINT "UserWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWallet" ADD CONSTRAINT "UserWallet_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("address") ON DELETE CASCADE ON UPDATE CASCADE;
