import { z } from "zod"

export const logSchema = z.object({
	user: z.string(),
	action: z.string(),
	entity: z.string(),
	ipAddress: z.string(),
})

export const tableLogSchema = logSchema
	.extend({
		id: z.string().uuid(),
		timestamp: z.string().datetime(),
	})

export const createLogSchema = logSchema

export type Log = z.infer<typeof logSchema>
export type TableLog = z.infer<typeof tableLogSchema>
export type CreateLog = z.infer<typeof createLogSchema>
