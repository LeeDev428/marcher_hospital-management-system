import { z } from "zod"

export const userRoleSchema = z.enum([
	"PATIENT",
	"PARTNER",
	"STAFF",
	"ADMIN",
])

export const userRoleOptions = userRoleSchema.options.map((option) => ({
	label: option.charAt(0) + option.slice(1).toLowerCase(),
	value: option,
}))

export const userStatusSchema = z.enum([
	"ENABLED",
	"DISABLED",
])

export const userStatusOptions = userStatusSchema.options.map((option) => ({
	label: option.charAt(0) + option.slice(1).toLowerCase(),
	value: option,
}))

export const userProfileSchema = z.object({
	lastName: z.string().min(1, "Last name is required.").max(255, "Last name must be less than 255 characters."),
	firstName: z.string().min(1, "First name is required.").max(255, "First name must be less than 255 characters."),
	middleName: z.string().max(255, "Middle name must be less than 255 characters.").optional().nullable(),
	suffix: z.string().max(255, "Suffix must be less than 255 characters.").optional().nullable(),
	
})
