import { z } from "zod"

export const pharmacyCategorySchema = z.object({
	name: z.string().min(1, "Category name is required.").max(255, "Category name must be less than 255 characters."),
})

export const getPharmacyCategorySchema = z.object({
	id: z.string().uuid("Invalid category ID."),
})

export const tablePharmacyCategorySchema = pharmacyCategorySchema.extend({
	id: z.string().uuid("Invalid category ID."),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
})

export const createPharmacyCategorySchema = pharmacyCategorySchema

export const updatePharmacyCategorySchema = pharmacyCategorySchema.extend({
	id: z.string().uuid("Invalid category ID."),
})

export const deletePharmacyCategorySchema = z.object({
	id: z.string().uuid("Invalid category ID."),
})

export type PharmacyCategory = z.infer<typeof pharmacyCategorySchema>
export type GetPharmacyCategory = z.infer<typeof getPharmacyCategorySchema>
export type TablePharmacyCategory = z.infer<typeof tablePharmacyCategorySchema>
export type CreatePharmacyCategory = z.infer<typeof createPharmacyCategorySchema>
export type UpdatePharmacyCategory = z.infer<typeof updatePharmacyCategorySchema>
export type DeletePharmacyCategory = z.infer<typeof deletePharmacyCategorySchema>