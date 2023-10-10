import {z} from 'zod'

export const UserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  id: z.number().optional(),
  followers: z.number().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
})

export type User = z.infer<typeof UserSchema>
