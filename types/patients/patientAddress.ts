import { z } from "zod"

export const patientAddressSchema = z.object({
	label: z.string().min(1, "Address label is required.").max(255, "Address label must be less than 255 characters."),
	country: z.string().min(1, "Country is required.").max(255, "Country must be less than 255 characters."),
	state: z.string().min(1, "State is required.").max(255, "State must be less than 255 characters."),
	zipCode: z.string().min(1, "Zip code is required.").max(255, "Zip code must be less than 255 characters."),
	city: z.string().min(1, "City is required.").max(255, "City must be less than 255 characters."),
	address: z.string().min(1, "Address is required.").max(255, "Address must be less than 255 characters."),
})

export const getPatientAddressSchema = z.object({
	patientProfileId: z.string().uuid("Invalid patient profile ID."),
})
export const formPatientAddressSchema = patientAddressSchema
	.extend({
		id: z.string().uuid("Invalid patient address ID."),
	})
export const createPatientAddressSchema = patientAddressSchema
export const updatePatientAddressSchema = patientAddressSchema
export const deletePatientAddressSchema = z.object({
	id: z.string().uuid("Invalid patient address ID."),
})

export type PatientAddress = z.infer<typeof patientAddressSchema>
export type GetPatientAddress = z.infer<typeof getPatientAddressSchema>
export type FormPatientAddress = z.infer<typeof formPatientAddressSchema>
export type CreatePatientAddress = z.infer<typeof createPatientAddressSchema>
export type UpdatePatientAddress = z.infer<typeof updatePatientAddressSchema>
export type DeletePatientAddress = z.infer<typeof deletePatientAddressSchema>
