import { z } from "zod"

// ==================== PARTICULARS CATALOGUE ====================

export const particularTypeEnum = z.enum([
	"PRESCRIPTION",
	"LABORATORY",
	"RADIOLOGY",
	"OPERATION",
	"PROCEDURE",
	"OTHER",
])

// Create Catalogue Item (Billing staff only)
export const createParticularCatalogueSchema = z.object({
	type: particularTypeEnum,
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	cost: z.number().min(0, "Cost must be non-negative"),
	isActive: z.boolean().default(true),
})

export type CreateParticularCatalogueSchema = z.infer<
	typeof createParticularCatalogueSchema
>

// Update Catalogue Item
export const updateParticularCatalogueSchema = z.object({
	id: z.string().uuid(),
	type: particularTypeEnum.optional(),
	name: z.string().min(1).optional(),
	description: z.string().optional(),
	cost: z.number().min(0).optional(),
	isActive: z.boolean().optional(),
})

export type UpdateParticularCatalogueSchema = z.infer<
	typeof updateParticularCatalogueSchema
>

// Get Catalogue Item
export const getParticularCatalogueSchema = z.object({
	id: z.string().uuid(),
})

export type GetParticularCatalogueSchema = z.infer<
	typeof getParticularCatalogueSchema
>

// Get Catalogue Items with filters
export const getParticularCataloguesSchema = z.object({
	type: particularTypeEnum.optional(),
	isActive: z.boolean().optional(),
	search: z.string().optional(),
})

export type GetParticularCataloguesSchema = z.infer<
	typeof getParticularCataloguesSchema
>

// Delete Catalogue Item
export const deleteParticularCatalogueSchema = z.object({
	id: z.string().uuid(),
})

export type DeleteParticularCatalogueSchema = z.infer<
	typeof deleteParticularCatalogueSchema
>

export type ParticularType = z.infer<typeof particularTypeEnum>
