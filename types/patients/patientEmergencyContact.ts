import { z } from "zod"

export const relationshipSchema = z.enum([
	"FATHER",
	"MOTHER",
	"SPOUSE",
	"SON",
	"DAUGHTER",
	"SIBLING",
	"GRANDMOTHER",
	"GRANDFATHER",
	"GRANDCHILD",
	"COUSIN",
	"UNCLE",
	"GUARDIAN",
	"AUXILIARY",
	"OTHER",
])

export const relationshipOptions = relationshipSchema.options.map((option) => ({
	label: option.charAt(0) + option.slice(1).toLowerCase(),
	value: option,
}))

export const patientEmergencyContactSchema = z.object({
	patientProfileId: z.string().uuid("Invalid patient profile ID."),
	lastName: z.string().min(1, "Last name is required.").max(255, "Last name must be less than 255 characters."),
	firstName: z.string().min(1, "First name is required.").max(255, "First name must be less than 255 characters."),
	middleName: z.string().max(255, "Middle name must be less than 255 characters.").optional().nullable(),
	suffix: z.string().max(255, "Suffix must be less than 255 characters.").optional().nullable(),
	relationship: relationshipSchema,
	phone: z.string().max(255, "Phone must be less than 255 characters.").optional().nullable(),
	email: z.string().email("Invalid email address.").max(255, "Email must be less than 255 characters.").optional().nullable(),
	address: z.string().max(255, "Address must be less than 255 characters.").optional().nullable(),
})

export const getPatientEmergencyContactSchema = z.object({
	id: z.string().uuid("Invalid patient emergency contact ID."),
})
export const formPatientEmergencyContactSchema = patientEmergencyContactSchema
export const createPatientEmergencyContactSchema = patientEmergencyContactSchema
	.omit({
		patientProfileId: true,
	})
export const updatePatientEmergencyContactSchema = patientEmergencyContactSchema
	.partial()
	.omit({
		patientProfileId: true,
	})

export type PatientEmergencyContact = z.infer<typeof patientEmergencyContactSchema>
export type GetPatientEmergencyContact = z.infer<typeof getPatientEmergencyContactSchema>
export type FormPatientEmergencyContact = z.infer<typeof formPatientEmergencyContactSchema>
export type CreatePatientEmergencyContact = z.infer<typeof createPatientEmergencyContactSchema>
export type UpdatePatientEmergencyContact = z.infer<typeof updatePatientEmergencyContactSchema>
