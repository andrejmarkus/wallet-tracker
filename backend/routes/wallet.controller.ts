import { Router } from "express";
import { wallets, deleteWallet, walletsOfAuthorizedUser, createNewWallet } from "../controllers/wallet.controller";
import passport from "passport";

const walletRouter = Router();

walletRouter.get("/", passport.authenticate("jwt", { session: false }), wallets);
walletRouter.post("/", passport.authenticate("jwt", { session: false }), createNewWallet);
walletRouter.get("/authorized", passport.authenticate("jwt", { session: false }), walletsOfAuthorizedUser);
walletRouter.delete("/:address", passport.authenticate("jwt", { session: false }), deleteWallet);

export default walletRouter;