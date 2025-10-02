import { z } from "zod"

export const patientConsentSchema = z.object({
	patientProfileId: z.string().uuid("Invalid patient profile ID."),
	documentUrl: z.string().url("Invalid document URL."),
	signature: z.string().max(255, "Signature must be less than 255 characters."),
})

export const getPatientConsentSchema = z.object({
	id: z.string().uuid("Invalid patient consent ID."),
})
export const formPatientConsentSchema = patientConsentSchema
export const createPatientConsentSchema = patientConsentSchema
	.omit({
		patientProfileId: true,
	})
export const updatePatientConsentSchema = patientConsentSchema
	.partial()
	.omit({
		patientProfileId: true,
	})

export type PatientConsent = z.infer<typeof patientConsentSchema>
export type GetPatientConsent = z.infer<typeof getPatientConsentSchema>
export type FormPatientConsent = z.infer<typeof formPatientConsentSchema>
export type CreatePatientConsent = z.infer<typeof createPatientConsentSchema>
export type UpdatePatientConsent = z.infer<typeof updatePatientConsentSchema>