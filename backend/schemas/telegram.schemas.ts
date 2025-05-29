import { z } from 'zod'

export const telegramTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  expiresAt: z.string().datetime('Invalid expiration date format')
})
