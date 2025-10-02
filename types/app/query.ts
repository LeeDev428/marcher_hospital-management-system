import { z } from "zod"

export const querySchema = z.object({
	search: z.string().optional(),
	page: z.number().min(1).default(1),
	limit: z.number().min(5).max(20).default(10),
})

export type Query = z.infer<typeof querySchema>