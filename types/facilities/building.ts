import { z } from "zod"

export const buildingSchema = z.object({
	name: z.string().min(1, "Building name is required.").max(255, "Building name must be less than 255 characters."),
})

export const getBuildingSchema = z.object({
	id: z.string().uuid("Invalid building ID."),
})

export const tableBuildingSchema = buildingSchema
	.extend({
		id: z.string().uuid("Invalid building ID."),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})

export const createBuildingSchema = buildingSchema

export const updateBuildingSchema = buildingSchema
	.extend({
		id: z.string().uuid("Invalid building ID."),
	})

export const deleteBuildingSchema = z.object({
	id: z.string().uuid("Invalid building ID."),
})

export type Building = z.infer<typeof buildingSchema>
export type GetBuilding = z.infer<typeof getBuildingSchema>
export type TableBuilding = z.infer<typeof tableBuildingSchema>
export type CreateBuilding = z.infer<typeof createBuildingSchema>
export type UpdateBuilding = z.infer<typeof updateBuildingSchema>
export type DeleteBuilding = z.infer<typeof deleteBuildingSchema>