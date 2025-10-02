import { z } from "zod"

export const pharmacySupplierSchema = z.object({
	name: z.string().min(1, "Supplier name is required.").max(255, "Supplier name must be less than 255 characters."),
	email: z.string().email("Invalid email address.").optional().nullable(),
	contact: z.string().min(1, "Supplier contact is required.").max(255, "Supplier contact must be less than 255 characters.").optional().nullable(),
	address: z.string().min(1, "Supplier address is required.").max(255, "Supplier address must be less than 255 characters.").optional().nullable(),
	notes: z.string().min(1, "Supplier notes are required.").max(255, "Supplier notes must be less than 255 characters.").optional().nullable(),
})

export const getPharmacySupplierSchema = z.object({
	id: z.string().uuid("Invalid supplier ID."),
})

export const tablePharmacySupplierSchema = pharmacySupplierSchema
	.extend({
		id: z.string().uuid("Invalid supplier ID."),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.omit({
		notes: true,
	})

export const createPharmacySupplierSchema = pharmacySupplierSchema

export const updatePharmacySupplierSchema = pharmacySupplierSchema.extend({
	id: z.string().uuid("Invalid supplier ID."),
})

export const deletePharmacySupplierSchema = z.object({
	id: z.string().uuid("Invalid supplier ID."),
})

export type PharmacySupplier = z.infer<typeof pharmacySupplierSchema>
export type GetPharmacySupplier = z.infer<typeof getPharmacySupplierSchema>
export type TablePharmacySupplier = z.infer<typeof tablePharmacySupplierSchema>
export type CreatePharmacySupplier = z.infer<typeof createPharmacySupplierSchema>
export type UpdatePharmacySupplier = z.infer<typeof updatePharmacySupplierSchema>
export type DeletePharmacySupplier = z.infer<typeof deletePharmacySupplierSchema>