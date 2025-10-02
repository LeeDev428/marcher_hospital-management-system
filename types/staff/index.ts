import { z } from "zod"

export const staffRoleSchema = z.enum(["ADMIN", "DOCTOR", "NURSE", "SECRETARY", "STAFF"])

export const staffRoleOptions = staffRoleSchema.options.map((role) => ({
	label: role.charAt(0) + role.slice(1).toLowerCase(),
	value: role,
}))

export const staffProfileSchema = z.object({
	lastName: z.string().min(1, "Last name is required.").max(255, "Last name must be less than 255 characters."),
	firstName: z.string().min(1, "First name is required.").max(255, "First name must be less than 255 characters."),
	middleName: z.string().max(255, "Middle name must be less than 255 characters.").optional().nullable(),
	suffix: z.string().max(255, "Suffix must be less than 255 characters.").optional().nullable(),
	role: staffRoleSchema,
	profession: z.string().max(255, "Profession must be less than 255 characters.").optional().nullable(),
})

export const getStaffProfileSchema = z.object({
	id: z.string().uuid("Invalid staff profile ID."),
})

export const tableStaffProfileSchema = staffProfileSchema
	.extend({
		id: z.string().uuid("Invalid staff profile ID."),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})

export const createStaffProfileSchema = staffProfileSchema

export const updateStaffProfileSchema = staffProfileSchema
	.extend({
		id: z.string().uuid("Invalid staff profile ID."),
	})

export const deleteStaffProfileSchema = z.object({
	id: z.string().uuid("Invalid staff profile ID."),
})

export type StaffRole = z.infer<typeof staffRoleSchema>
export type StaffProfile = z.infer<typeof staffProfileSchema>
export type GetStaffProfile = z.infer<typeof getStaffProfileSchema>
export type TableStaffProfile = z.infer<typeof tableStaffProfileSchema>
export type CreateStaffProfile = z.infer<typeof createStaffProfileSchema>
export type UpdateStaffProfile = z.infer<typeof updateStaffProfileSchema>
export type DeleteStaffProfile = z.infer<typeof deleteStaffProfileSchema>