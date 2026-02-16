import { Router } from "express";
import { wallets, deleteUserWallet, userWallets, createUserWallet, updateUserWallet, userWalletByAddress } from "../controllers/wallet.controller";
import passport from "passport";

const walletRouter = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Wallets
 *   description: Wallet management
 */

/**
 * @swagger
 * /wallets/authorized:
 *   get:
 *     summary: Get all wallets for the authenticated user
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user wallets
 */
walletRouter.get("/authorized", passport.authenticate("jwt", { session: false }), userWallets);

/**
 * @swagger
 * /wallets:
 *   post:
 *     summary: Add a new wallet to track
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *             properties:
 *               address:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Wallet added
 */
walletRouter.post("/", passport.authenticate("jwt", { session: false }), createUserWallet);

walletRouter.get("/", passport.authenticate("jwt", { session: false }), wallets);
walletRouter.get("/authorized/:address", passport.authenticate("jwt", { session: false }), userWalletByAddress);
walletRouter.delete("/:address", passport.authenticate("jwt", { session: false }), deleteUserWallet);
walletRouter.patch("/:address", passport.authenticate("jwt", { session: false }), updateUserWallet);

export default walletRouter;
