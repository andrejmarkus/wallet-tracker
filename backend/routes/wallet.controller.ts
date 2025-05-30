import { Router } from "express";
import { wallets, deleteUserWallet, userWallets, createUserWallet } from "../controllers/wallet.controller";
import passport from "passport";

const walletRouter = Router();

walletRouter.get("/", passport.authenticate("jwt", { session: false }), wallets);
walletRouter.post("/", passport.authenticate("jwt", { session: false }), createUserWallet);
walletRouter.get("/authorized", passport.authenticate("jwt", { session: false }), userWallets);
walletRouter.delete("/:address", passport.authenticate("jwt", { session: false }), deleteUserWallet);

export default walletRouter;