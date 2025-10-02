import { z } from "zod"
import { tableInsuranceProviderSchema } from "./insuranceProvider"

export const insuranceClaimItemSchema = z.object({
	claimId: z.string().uuid("Invalid claim ID."),
	name: z.string().min(1, "Item name is required.").max(255, "Item name must be less than 255 characters."),
	description: z.string().max(500, "Description must be less than 500 characters.").optional().nullable(),
	amount: z.number().min(0, "Amount must be greater than or equal to 0.").max(1000000000, "Amount must be less than 1 billion."),
})

export const getInsuranceClaimItemSchema = z.object({
	id: z.string().uuid("Invalid claim item ID."),
})

export const tableInsuranceClaimItemSchema = insuranceClaimItemSchema
	.extend({
		id: z.string().uuid("Invalid claim item ID."),
		claim: z.object({
			id: z.string().uuid(),
			status: z.string(),
			message: z.string().nullable().optional(),
			amount: z.number(),
			provider: tableInsuranceProviderSchema.omit({ _count: true }),
			createdAt: z.string().datetime(),
			updatedAt: z.string().datetime(),
		}),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})

export const createInsuranceClaimItemSchema = insuranceClaimItemSchema

export const updateInsuranceClaimItemSchema = insuranceClaimItemSchema.extend({
	id: z.string().uuid("Invalid claim item ID."),
})

export const deleteInsuranceClaimItemSchema = z.object({
	id: z.string().uuid("Invalid claim item ID."),
})

export type InsuranceClaimItem = z.infer<typeof insuranceClaimItemSchema>
export type GetInsuranceClaimItem = z.infer<typeof getInsuranceClaimItemSchema>
export type TableInsuranceClaimItem = z.infer<typeof tableInsuranceClaimItemSchema>
export type CreateInsuranceClaimItem = z.infer<typeof createInsuranceClaimItemSchema>
export type UpdateInsuranceClaimItem = z.infer<typeof updateInsuranceClaimItemSchema>
export type DeleteInsuranceClaimItem = z.infer<typeof deleteInsuranceClaimItemSchema>
