import { z } from "zod"

export const insuranceProviderSchema = z.object({
	name: z.string().min(1, "Provider name is required.").max(255, "Provider name must be less than 255 characters."),
	description: z.string().max(500, "Description must be less than 500 characters.").optional().nullable(),
	email: z.string().email("Invalid email address.").optional().nullable(),
	phone: z.string().max(50, "Phone must be less than 50 characters.").optional().nullable(),
	address: z.string().max(255, "Address must be less than 255 characters.").optional().nullable(),
	city: z.string().max(100, "City must be less than 100 characters.").optional().nullable(),
	state: z.string().max(100, "State must be less than 100 characters.").optional().nullable(),
	zip: z.string().max(20, "ZIP must be less than 20 characters.").optional().nullable(),
	country: z.string().max(100, "Country must be less than 100 characters.").optional().nullable(),
})

export const getInsuranceProviderSchema = z.object({
	id: z.string().uuid("Invalid provider ID."),
})

export const tableInsuranceProviderSchema = insuranceProviderSchema.extend({
	id: z.string().uuid("Invalid provider ID."),
	_count: z.object({
		claims: z.number(),
	}).optional(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
})

export const createInsuranceProviderSchema = insuranceProviderSchema

export const updateInsuranceProviderSchema = insuranceProviderSchema.extend({
	id: z.string().uuid("Invalid provider ID."),
})

export const deleteInsuranceProviderSchema = z.object({
	id: z.string().uuid("Invalid provider ID."),
})

export type InsuranceProvider = z.infer<typeof insuranceProviderSchema>
export type GetInsuranceProvider = z.infer<typeof getInsuranceProviderSchema>
export type TableInsuranceProvider = z.infer<typeof tableInsuranceProviderSchema>
export type CreateInsuranceProvider = z.infer<typeof createInsuranceProviderSchema>
export type UpdateInsuranceProvider = z.infer<typeof updateInsuranceProviderSchema>
export type DeleteInsuranceProvider = z.infer<typeof deleteInsuranceProviderSchema>