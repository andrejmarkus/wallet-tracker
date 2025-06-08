import { z } from 'zod'

export { userLoginSchema, userRegisterSchema } from './auth.schemas'
export { tokenRequestSchema, tokenDetailsSchema } from './token.schemas'
export { telegramTokenSchema } from './telegram.schemas'
export { walletSchema, walletUpdateSchema } from './wallet.schemas'

export const userSchema = z.object({
  id: z.string().cuid('Invalid user ID format'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(1, 'Username is required'),
  telegramChatId: z.string().optional().nullable()
})
