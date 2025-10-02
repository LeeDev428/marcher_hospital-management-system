import { z } from "zod"
import { createPatientAddressSchema } from "./patientAddress"
import { createPatientContactSchema } from "./patientContact"
import { createPatientEmploymentSchema } from "./patientEmployment"
import { createPatientEmergencyContactSchema } from "./patientEmergencyContact"
import { createPatientConsentSchema } from "./patientConsent"

export const sexSchema = z.enum([
	"MALE",
	"FEMALE",
])

export const maritalStatusSchema = z.enum([
	"SINGLE",
	"MARRIED",
	"DIVORCED",
	"WIDOWED",
	"SEPARATED",
])

export const bloodTypeSchema = z.enum([
	"A_POSITIVE",
	"A_NEGATIVE",
	"B_POSITIVE",
	"B_NEGATIVE",
	"AB_POSITIVE",
	"AB_NEGATIVE",
	"O_POSITIVE",
	"O_NEGATIVE",
])

export const sexOptions = sexSchema.options.map((option) => ({
	label: option.charAt(0) + option.slice(1).toLowerCase(),
	value: option,
}))

export const maritalStatusOptions = maritalStatusSchema.options.map((option) => ({
	label: option.charAt(0) + option.slice(1).toLowerCase(),
	value: option,
}))

export const bloodTypeOptions = bloodTypeSchema.options.map((option) => ({
	label: option.replace("_", " "),
	value: option,
}))

export const patientProfileSchema = z.object({
	lastName: z.string().min(1, "Last name is required.").max(255, "Last name must be less than 255 characters."),
	firstName: z.string().min(1, "First name is required.").max(255, "First name must be less than 255 characters."),
	middleName: z.string().max(255, "Middle name must be less than 255 characters.").optional().nullable(),
	suffix: z.string().max(255, "Suffix must be less than 255 characters.").optional().nullable(),
	birthdate: z.string().date("Invalid birthdate.").optional().nullable(),
	birthplace: z.string().max(255, "Birthplace must be less than 255 characters.").optional().nullable(),
	sex: sexSchema.optional().nullable(),
	maritalStatus: maritalStatusSchema.optional().nullable(),
	nationality: z.string().max(255, "Nationality must be less than 255 characters.").optional().nullable(),
	religion: z.string().max(255, "Religion must be less than 255 characters.").optional().nullable(),
	bloodType: bloodTypeSchema.optional().nullable(),
})

/* For Get & Delete */
export const getPatientProfileSchema = z.object({
	id: z.string().uuid("Invalid patient profile ID."),
})

/* For Table */
export const tablePatientProfileSchema = patientProfileSchema
	.extend({
		id: z.string().uuid("Invalid patient profile ID."),
		archived: z.boolean(),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.omit({
		birthplace: true,
		nationality: true,
		religion: true,
		bloodType: true,
	})

/* For Create */
export const createPatientProfileSchema = patientProfileSchema
	.extend({
		addresses: z.array(createPatientAddressSchema).optional().nullable(),
		contacts: z.array(createPatientContactSchema).optional().nullable(),
		employments: z.array(createPatientEmploymentSchema).optional().nullable(),
		emergencyContacts: z.array(createPatientEmergencyContactSchema).optional().nullable(),
		consent: createPatientConsentSchema.optional().nullable(),
	})

/* For Update */
export const updatePatientProfileSchema = patientProfileSchema
	.partial()
	.extend({
		id: z.string().uuid("Invalid patient profile ID."),
		addresses: z.array(createPatientAddressSchema).optional().nullable(),
		contacts: z.array(createPatientContactSchema).optional().nullable(),
		employments: z.array(createPatientEmploymentSchema).optional().nullable(),
		emergencyContacts: z.array(createPatientEmergencyContactSchema).optional().nullable(),
		consent: createPatientConsentSchema.optional().nullable(),
	})

export type Sex = z.infer<typeof sexSchema>
export type MaritalStatus = z.infer<typeof maritalStatusSchema>
export type BloodType = z.infer<typeof bloodTypeSchema>

export type PatientProfile = z.infer<typeof patientProfileSchema>
export type GetPatientProfile = z.infer<typeof getPatientProfileSchema>
export type TablePatientProfile = z.infer<typeof tablePatientProfileSchema>
export type CreatePatientProfile = z.infer<typeof createPatientProfileSchema>
export type UpdatePatientProfile = z.infer<typeof updatePatientProfileSchema>
