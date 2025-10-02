import { z } from "zod"

export const contactTypeSchema = z.enum([
	"HOME",
	"WORK",
	"MOBILE",
	"EMAIL",
	"FAX",
	"OTHER",
])

export const contactTypeOptions = contactTypeSchema.options.map((option) => ({
	label: option.charAt(0) + option.slice(1).toLowerCase(),
	value: option,
}))

export const patientContactSchema = z.object({
	patientProfileId: z.string().uuid("Invalid patient profile ID."),
	type: contactTypeSchema,
	value: z.string().min(1, "Contact is required.").max(255, "Contact must be less than 255 characters."),
})

export const getPatientContactSchema = z.object({
	id: z.string().uuid("Invalid patient contact ID."),
})
export const formPatientContactSchema = patientContactSchema
export const createPatientContactSchema = patientContactSchema
	.omit({
		patientProfileId: true,
	})
export const updatePatientContactSchema = patientContactSchema
	.partial()
	.omit({
		patientProfileId: true,
	})

export type PatientContact = z.infer<typeof patientContactSchema>
export type GetPatientContact = z.infer<typeof getPatientContactSchema>
export type FormPatientContact = z.infer<typeof formPatientContactSchema>
export type CreatePatientContact = z.infer<typeof createPatientContactSchema>
export type UpdatePatientContact = z.infer<typeof updatePatientContactSchema>
