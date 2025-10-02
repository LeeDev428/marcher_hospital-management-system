import { z } from "zod"
import { tableBuildingSchema } from "./building"

export const roomTypeSchema = z.enum([
	"WARD",
	"CLINIC",
	"LABORATORY",
	"PHARMACY",
	"OFFICE",
])

export const roomTypeOptions = roomTypeSchema.options.map((option) => ({
	label: option.charAt(0) + option.slice(1).toLowerCase(),
	value: option,
}))

export const roomStatusSchema = z.enum([
	"AVAILABLE",
	"OCCUPIED",
	"PREPARING",
])

export const roomStatusOptions = roomStatusSchema.options.map((option) => ({
	label: option.charAt(0) + option.slice(1).toLowerCase(),
	value: option,
}))

export const roomSchema = z.object({
	buildingId: z.string().uuid("Invalid building ID."),
	type: roomTypeSchema,
	identifier: z.string().min(1, "Identifier is required.").max(255, "Identifier must be less than 255 characters."),
	description: z.string().optional().nullable(),
	capacity: z.number().min(1, "Capacity must be greater than 0.").max(100, "Capacity must be less than 100.").optional().nullable(),
	status: roomStatusSchema,
})

export const getRoomSchema = z.object({
	id: z.string().uuid("Invalid room ID."),
})

export const tableRoomSchema = roomSchema
	.extend({
		id: z.string().uuid("Invalid room ID."),
		building: tableBuildingSchema,
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})

export const createRoomSchema = roomSchema

export const updateRoomSchema = roomSchema
	.extend({
		id: z.string().uuid("Invalid room ID."),
	})

export const deleteRoomSchema = z.object({
	id: z.string().uuid("Invalid room ID."),
})

export type RoomType = z.infer<typeof roomTypeSchema>
export type RoomStatus = z.infer<typeof roomStatusSchema>
export type Room = z.infer<typeof roomSchema>
export type GetRoom = z.infer<typeof getRoomSchema>
export type TableRoom = z.infer<typeof tableRoomSchema>
export type CreateRoom = z.infer<typeof createRoomSchema>
export type UpdateRoom = z.infer<typeof updateRoomSchema>
export type DeleteRoom = z.infer<typeof deleteRoomSchema>