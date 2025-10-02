import { z } from "zod"

export const pharmacyBrandSchema = z.object({
	name: z.string().min(1, "Brand name is required.").max(255, "Brand name must be less than 255 characters."),
})

export const getPharmacyBrandSchema = z.object({
	id: z.string().uuid("Invalid brand ID."),
})

export const tablePharmacyBrandSchema = pharmacyBrandSchema.extend({
	id: z.string().uuid("Invalid brand ID."),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
})

export const createPharmacyBrandSchema = pharmacyBrandSchema

export const updatePharmacyBrandSchema = pharmacyBrandSchema.extend({
	id: z.string().uuid("Invalid brand ID."),
})

export const deletePharmacyBrandSchema = z.object({
	id: z.string().uuid("Invalid brand ID."),
})

export type PharmacyBrand = z.infer<typeof pharmacyBrandSchema>
export type GetPharmacyBrand = z.infer<typeof getPharmacyBrandSchema>
export type TablePharmacyBrand = z.infer<typeof tablePharmacyBrandSchema>
export type CreatePharmacyBrand = z.infer<typeof createPharmacyBrandSchema>
export type UpdatePharmacyBrand = z.infer<typeof updatePharmacyBrandSchema>
export type DeletePharmacyBrand = z.infer<typeof deletePharmacyBrandSchema>