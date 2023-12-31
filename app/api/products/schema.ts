import {z} from 'zod'

export const ProductSchema = z.object({
  name: z.string().min(2),
  price: z.number(),
  id: z.number().optional(),
  createdAt: z.date().optional(),
})

export type Product = z.infer<typeof ProductSchema>
