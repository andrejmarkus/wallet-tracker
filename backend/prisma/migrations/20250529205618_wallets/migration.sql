-- CreateTable
CREATE TABLE "Wallet" (
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "_UserWallets" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserWallets_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserWallets_B_index" ON "_UserWallets"("B");

-- AddForeignKey
ALTER TABLE "_UserWallets" ADD CONSTRAINT "_UserWallets_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserWallets" ADD CONSTRAINT "_UserWallets_B_fkey" FOREIGN KEY ("B") REFERENCES "Wallet"("address") ON DELETE CASCADE ON UPDATE CASCADE;
