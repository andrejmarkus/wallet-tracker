import { z } from 'zod'

export const tokenRequestSchema = z.object({
  tokenAddress: z
    .string()
    .min(32, 'Token address must be between 32 and 44 characters long')
    .max(44, 'Token address must be between 32 and 44 characters long'),
  solanaAmount: z.number().positive('Amount must be a positive number'),
  tokenMarketCapInSolana: z
    .number()
    .positive('Market cap must be a positive number'),
  tokenAmount: z.number().positive('Amount must be a positive number'),
  currencySymbol: z
    .string()
    .length(3, 'Currency symbol must be exactly 3 characters long')
})

export const tokenDetailsSchema = z.object({
  tokenAddress: z
    .string()
    .min(32, 'Token address must be between 32 and 44 characters long')
    .max(44, 'Token address must be between 32 and 44 characters long'),
  tokenName: z.string().min(1, 'Token name cannot be empty'),
  tokenSymbol: z.string().min(1, 'Token symbol cannot be empty'),
  currencyName: z.string().min(1, 'Currency name cannot be empty'),
  currencySymbol: z
    .string()
    .length(3, 'Currency symbol must be exactly 3 characters long'),
  solanaPrice: z.number().positive('Solana price must be a positive number'),
  solanaAmount: z.number().positive('Solana amount must be a positive number'),
  tokenMarketCapInSolana: z
    .number()
    .positive('Token market cap in Solana must be a positive number'),
  tokenAmount: z.number().positive('Token amount must be a positive number'),
  tokenUnitPrice: z
    .number()
    .positive('Token unit price must be a positive number'),
  tokenTotalValue: z
    .number()
    .positive('Token total value must be a positive number'),
  tokenMarketCap: z
    .number()
    .positive('Token market cap must be a positive number')
})
