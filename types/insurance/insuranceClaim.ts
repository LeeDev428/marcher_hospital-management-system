import { z } from "zod"
import { tableInsuranceProviderSchema } from "./insuranceProvider"

export const insuranceClaimStatusSchema = z.enum([
	"PENDING",
	"APPROVED",
	"REJECTED",
	"PROCESSING",
	"COMPLETED",
	"CANCELLED",
])

export const insuranceClaimStatusOptions = insuranceClaimStatusSchema.options.map((option) => ({
	label: option.charAt(0).toUpperCase() + option.slice(1).toLowerCase(),
	value: option,
}))

export const insuranceClaimSchema = z.object({
	providerId: z.string().uuid("Invalid provider ID."),
	status: insuranceClaimStatusSchema,
	message: z.string().max(1000, "Message must be less than 1000 characters.").optional().nullable(),
	amount: z.number().min(0, "Amount must be greater than or equal to 0.").max(1000000000, "Amount must be less than 1 billion."),
})

export const getInsuranceClaimSchema = z.object({
	id: z.string().uuid("Invalid claim ID."),
})

export const tableInsuranceClaimSchema = insuranceClaimSchema
	.extend({
		id: z.string().uuid("Invalid claim ID."),
		provider: tableInsuranceProviderSchema.omit({ _count: true }),
		items: z.array(z.object({
			id: z.string().uuid(),
			name: z.string(),
			description: z.string().nullable().optional(),
			amount: z.number(),
		})).optional(),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})

export const createInsuranceClaimSchema = insuranceClaimSchema

export const updateInsuranceClaimSchema = insuranceClaimSchema.extend({
	id: z.string().uuid("Invalid claim ID."),
})

export const deleteInsuranceClaimSchema = z.object({
	id: z.string().uuid("Invalid claim ID."),
})

export type InsuranceClaim = z.infer<typeof insuranceClaimSchema>
export type GetInsuranceClaim = z.infer<typeof getInsuranceClaimSchema>
export type TableInsuranceClaim = z.infer<typeof tableInsuranceClaimSchema>
export type CreateInsuranceClaim = z.infer<typeof createInsuranceClaimSchema>
export type UpdateInsuranceClaim = z.infer<typeof updateInsuranceClaimSchema>
export type DeleteInsuranceClaim = z.infer<typeof deleteInsuranceClaimSchema>