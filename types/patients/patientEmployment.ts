import { z } from "zod"

export const patientEmploymentSchema = z.object({
	patientProfileId: z.string().uuid("Invalid patient profile ID."),
	employer: z.string().max(255, "Employer must be less than 255 characters."),
	contactPerson: z.string().max(255, "Contact person must be less than 255 characters.").optional().nullable(),
	address: z.string().max(255, "Address must be less than 255 characters.").optional().nullable(),
	phone: z.string().max(255, "Phone must be less than 255 characters.").optional().nullable(),
	email: z.string().email("Invalid email address.").optional().nullable(),
	website: z.string().url("Invalid website URL.").max(255, "Website must be less than 255 characters.").optional().nullable(),
})

export const getPatientEmploymentSchema = z.object({
	id: z.string().uuid("Invalid patient employment ID."),
})
export const formPatientEmploymentSchema = patientEmploymentSchema
export const createPatientEmploymentSchema = patientEmploymentSchema
	.omit({
		patientProfileId: true,
	})
export const updatePatientEmploymentSchema = patientEmploymentSchema
	.partial()
	.omit({
		patientProfileId: true,
	})

export type PatientEmployment = z.infer<typeof patientEmploymentSchema>
export type GetPatientEmployment = z.infer<typeof getPatientEmploymentSchema>
export type FormPatientEmployment = z.infer<typeof formPatientEmploymentSchema>
export type CreatePatientEmployment = z.infer<typeof createPatientEmploymentSchema>
export type UpdatePatientEmployment = z.infer<typeof updatePatientEmploymentSchema>
