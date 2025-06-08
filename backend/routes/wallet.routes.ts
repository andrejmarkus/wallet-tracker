import { Router } from "express";
import { wallets, deleteUserWallet, userWallets, createUserWallet, updateUserWallet, userWalletByAddress } from "../controllers/wallet.controller";
import passport from "passport";

const walletRouter = Router();

walletRouter.get("/", passport.authenticate("jwt", { session: false }), wallets);
walletRouter.post("/", passport.authenticate("jwt", { session: false }), createUserWallet);
walletRouter.get("/authorized", passport.authenticate("jwt", { session: false }), userWallets);
walletRouter.get("/authorized/:address", passport.authenticate("jwt", { session: false }), userWalletByAddress);
walletRouter.delete("/:address", passport.authenticate("jwt", { session: false }), deleteUserWallet);
walletRouter.patch("/:address", passport.authenticate("jwt", { session: false }), updateUserWallet);

export default walletRouter;