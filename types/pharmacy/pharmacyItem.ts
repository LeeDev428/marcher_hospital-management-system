import { z } from "zod"
import { tablePharmacyBrandSchema } from "./pharmacyBrand"
import { tablePharmacyCategorySchema } from "."

export const pharmacyItemFormSchema = z.enum([
	"TABLET",
	"CAPSULE",
	"SYRUP",
	"OINTMENT",
	"CREAM",
	"INJECTION",
	"DROPS",
	"INHALER",
	"MEDICAL_DEVICE",
	"SUPPLEMENTS",
	"COSMETICS",
	"MISCELLANEOUS",
])

export const pharmacyItemRouteSchema = z.enum([
	"INJECTION",
	"TOPICAL",
	"TRANSDERMAL",
	"OCULAR",
	"OTIC",
	"NASAL",
	"ORAL",
	"INHALATIONAL",
	"RECTAL",
	"VAGINAL",
])

export const pharmacyItemFormOptions = pharmacyItemFormSchema.options.map((option) => ({
	label: option,
	value: option,
}))

export const pharmacyItemRouteOptions = pharmacyItemRouteSchema.options.map((option) => ({
	label: option,
	value: option,
}))

export const pharmacyItemSchema = z.object({
	brandId: z.string().uuid("Invalid pharmacy brand ID."),
	categoryId: z.string().uuid("Invalid pharmacy category ID."),
	name: z.string().min(1, "Pharmacy item name is required.").max(255, "Pharmacy item name must be less than 255 characters."),
	form: pharmacyItemFormSchema,
	route: pharmacyItemRouteSchema,
	strength: z.string().min(1, "Pharmacy item strength is required.").max(255, "Pharmacy item strength must be less than 255 characters."),
	stock: z.number().min(0, "Pharmacy item stock must be greater than 0.").max(1000000, "Pharmacy item stock must be less than 1000000."),
	unit: z.string().min(1, "Pharmacy item unit is required.").max(255, "Pharmacy item unit must be less than 255 characters."),
	sku: z.string().min(1, "Pharmacy item SKU is required.").max(255, "Pharmacy item SKU must be less than 255 characters.").optional().nullable(),
})

export const getPharmacyItemSchema = z.object({
	id: z.string().uuid("Invalid pharmacy item ID."),
})

export const tablePharmacyItemSchema = pharmacyItemSchema
	.extend({
		id: z.string().uuid("Invalid pharmacy item ID."),
		brand: tablePharmacyBrandSchema,
		category: tablePharmacyCategorySchema,
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.pick({
		id: true,
		name: true,
		brand: true,
		category: true,
		form: true,
		route: true,
		strength: true,
		stock: true,
		unit: true,
		sku: true,
		createdAt: true,
		updatedAt: true,
	})

export const createPharmacyItemSchema = pharmacyItemSchema

export const updatePharmacyItemSchema = pharmacyItemSchema.extend({
	id: z.string().uuid("Invalid pharmacy item ID."),
})

export const deletePharmacyItemSchema = z.object({
	id: z.string().uuid("Invalid pharmacy item ID."),
})

export type PharmacyItem = z.infer<typeof pharmacyItemSchema>
export type GetPharmacyItem = z.infer<typeof getPharmacyItemSchema>
export type TablePharmacyItem = z.infer<typeof tablePharmacyItemSchema>
export type CreatePharmacyItem = z.infer<typeof createPharmacyItemSchema>
export type UpdatePharmacyItem = z.infer<typeof updatePharmacyItemSchema>
export type DeletePharmacyItem = z.infer<typeof deletePharmacyItemSchema>
