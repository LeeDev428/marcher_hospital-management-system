import { z } from "zod"
import { tablePatientProfileSchema } from "../patients"

export const outpatientEncounterTypeSchema = z.enum([
	"CONSULTATION",
	"FOLLOW_UP",
	"LABORATORY",
	"RADIOLOGY",
	"OTHER",
])

export const outpatientPaymentStatusEnum = z.enum(["PAID", "UNPAID"])

export const outpatientEncounterTypeOptions =
	outpatientEncounterTypeSchema.options.map((type) => ({
		label: type.charAt(0).toUpperCase() + type.slice(1),
		value: type,
	}))

const outpatientEncounterBaseSchema = z.object({
    patientId: z.string().min(1, "Patient ID is required."),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format."),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format."),
    chiefComplaint: z.string().min(1, "Chief complaint is required."),
    doctorDiagnosis: z.string().optional(),
    type: outpatientEncounterTypeSchema.default("CONSULTATION"),
    consultationFee: z.number().min(0).optional(),
    paymentStatus: outpatientPaymentStatusEnum.default("UNPAID"),
    notes: z.string().optional(),
})

export const outpatientEncounterSchema = outpatientEncounterBaseSchema

export const getOutpatientEncounterSchema = z.object({
	id: z.string().uuid("Invalid encounter ID."),
})

export const getOutpatientEncountersSchema = z.object({
	patientProfileId: z.string().uuid("Invalid patient profile ID."),
})

export const tableOutpatientEncounterSchema = outpatientEncounterSchema
	.extend({
		id: z.string().uuid("Invalid encounter ID."),
		patientProfile: tablePatientProfileSchema,
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.omit({
		chiefComplaint: true,
		doctorDiagnosis: true,
	})

// TRPC input schemas
export const createOutpatientEncounterSchema = z.object({
    patientId: z.string().min(1, "Patient ID is required."),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format."),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format."),
    chiefComplaint: z.string().min(1, "Chief complaint is required."),
    doctorDiagnosis: z.string().optional(),
    type: outpatientEncounterTypeSchema.default("CONSULTATION"),
    consultationFee: z.number().min(0).optional(),
    paymentStatus: outpatientPaymentStatusEnum.default("UNPAID"),
    notes: z.string().optional(),
})

export const updateOutpatientEncounterSchema = z.object({
    id: z.string().uuid("Invalid encounter ID."),
    doctorDiagnosis: z.string().optional(),
    consultationFee: z.number().min(0).optional(),
    paymentStatus: outpatientPaymentStatusEnum.optional(),
    notes: z.string().optional(),
})

// Get by patient
export const getOutpatientEncountersByPatientSchema = z.object({
	patientId: z.string().min(1),
})

// Form schemas (omit patientProfileId; it is injected from route)
export const createOutpatientEncounterFormSchema = outpatientEncounterBaseSchema

export const updateOutpatientEncounterFormSchema = outpatientEncounterBaseSchema

export const deleteOutpatientEncounterSchema = z.object({
	id: z.string().uuid("Invalid encounter ID."),
})

export type OutpatientEncounterType = z.infer<
	typeof outpatientEncounterTypeSchema
>
export type OutpatientEncounter = z.infer<typeof outpatientEncounterSchema>
export type GetOutpatientEncounter = z.infer<
	typeof getOutpatientEncounterSchema
>
export type GetOutpatientEncounters = z.infer<
	typeof getOutpatientEncountersSchema
>
export type TableOutpatientEncounter = z.infer<
	typeof tableOutpatientEncounterSchema
>
export type CreateOutpatientEncounter = z.infer<
	typeof createOutpatientEncounterSchema
>
export type UpdateOutpatientEncounter = z.infer<
	typeof updateOutpatientEncounterSchema
>
export type CreateOutpatientEncounterForm = z.infer<
    typeof createOutpatientEncounterFormSchema
>
export type UpdateOutpatientEncounterForm = z.infer<
    typeof updateOutpatientEncounterFormSchema
>
export type DeleteOutpatientEncounter = z.infer<
	typeof deleteOutpatientEncounterSchema
>
