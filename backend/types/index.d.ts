import { z } from 'zod';
import {
  userLoginSchema,
  userRegisterSchema,
  tokenRequestSchema,
  tokenDetailsSchema,
  telegramTokenSchema,
  userSchema,
  walletSchema
} from '../schemas';

declare type UserLogin = z.infer<typeof userLoginSchema>;
declare type UserRegister = z.infer<typeof userRegisterSchema>;

declare type TokenRequest = z.infer<typeof tokenRequestSchema>;
declare type TokenDetails = z.infer<typeof tokenDetailsSchema>;

declare type TelegramToken = z.infer<typeof telegramTokenSchema>;

declare type User = z.infer<typeof userSchema>;

declare type Wallet = z.infer<typeof walletSchema>;

declare interface RawTransaction {
  signature: string;
  mint: string;
  traderPublicKey: string;
  txType: 'buy' | 'sell';
  tokenAmount: number;
  solAmount: number;
  newTokenBalance: number;
  bondingCurveKey: string;
  vTokensInBondingCurve: number;
  vSolInBondingCurve: number;
  marketCapSol: number;
  pool: string;
}

declare interface Transaction {
  signature: string;
  mint: string;
  traderPublicKey: string;
  txType: 'buy' | 'sell';
  tokenAmount: number;
  solAmount: number;
  pool: string;
  marketCapSol: number;
}

declare interface FullTransaction {
    tokenAddress: string;
    tokenName: string;
    tokenSymbol: string;
    currencyName: string;
    currencySymbol: string;
    solanaPrice: number;
    solanaAmount: number;
    tokenMarketCapInSolana: number;
    tokenAmount: number;
    tokenUnitPrice: number;
    tokenTotalValue: number;
    tokenMarketCap: number;
    signature: string;
    traderPublicKey: string;
    txType: "buy" | "sell";
    pool: string;
}
