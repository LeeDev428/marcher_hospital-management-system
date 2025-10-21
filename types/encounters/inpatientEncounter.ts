import { z } from "zod"
import { tablePatientProfileSchema } from "../patients"
import { formatEnumLabel } from "../../lib/utils"

export const inpatientTriageSchema = z.enum([
	"HIGH_PRIORITY",
	"MEDIUM_PRIORITY",
	"LOW_PRIORITY",
	"NON_URGENT",
])

export const inpatientTriageOptions = inpatientTriageSchema.options.map(
	(triage) => ({
		label: formatEnumLabel(triage),
		value: triage,
	})
)

export const inpatientDispositionSchema = z.enum([
	"ADMITTED",
	"DISCHARGED",
	"DISCONTINUED",
	"TRANSFERRED",
	"DECEASED",
	"OTHER",
])

export const inpatientDispositionOptions =
	inpatientDispositionSchema.options.map((disposition) => ({
		label: formatEnumLabel(disposition),
		value: disposition,
	}))

const inpatientEncounterBaseSchema = z.object({
    patientId: z.string().min(1, "Patient ID is required."),
    doctorId: z.string().min(1, "Doctor ID is required."),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format."),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format."),
    chiefComplaint: z.string().min(1, "Chief complaint is required."),
    doctorDiagnosis: z.string().optional(),
    triage: inpatientTriageSchema,
    disposition: inpatientDispositionSchema.default("ADMITTED"),
    dispositionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
    dispositionTime: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
    dispositionNote: z.string().optional().nullable(),
})

export const inpatientEncounterSchema = inpatientEncounterBaseSchema

export const getInpatientEncounterSchema = z.object({
	id: z.string().uuid("Invalid encounter ID."),
})

export const getInpatientEncountersSchema = z.object({
	patientProfileId: z.string().uuid("Invalid patient profile ID."),
})

export const tableInpatientEncounterSchema = inpatientEncounterSchema
	.extend({
		id: z.string().uuid("Invalid encounter ID."),
		patientProfile: tablePatientProfileSchema,
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.omit({
		chiefComplaint: true,
		doctorDiagnosis: true,
		dispositionDate: true,
		dispositionTime: true,
		dispositionNote: true,
	})

// TRPC input schemas
export const createInpatientEncounterSchema = z.object({
    patientId: z.string().min(1, "Patient ID is required."),
    doctorId: z.string().min(1, "Doctor ID is required."),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format."),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format."),
    chiefComplaint: z.string().min(1, "Chief complaint is required."),
    triage: inpatientTriageSchema,
})

export const updateInpatientEncounterSchema = z.object({
    id: z.string().uuid("Invalid encounter ID."),
    doctorDiagnosis: z.string().optional(),
    disposition: inpatientDispositionSchema.optional(),
    dispositionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    dispositionTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    dispositionNote: z.string().optional(),
})

// Check if patient has active encounter
export const checkActiveEncounterSchema = z.object({
	patientId: z.string().min(1),
})

// Form schemas (omit patientProfileId; it is injected from route)
export const createInpatientEncounterFormSchema = inpatientEncounterBaseSchema

export const updateInpatientEncounterFormSchema = inpatientEncounterBaseSchema

export const deleteInpatientEncounterSchema = z.object({
	id: z.string().uuid("Invalid encounter ID."),
})

export type InpatientTriage = z.infer<typeof inpatientTriageSchema>
export type InpatientDisposition = z.infer<typeof inpatientDispositionSchema>
export type InpatientEncounter = z.infer<typeof inpatientEncounterSchema>
export type GetInpatientEncounter = z.infer<typeof getInpatientEncounterSchema>
export type GetInpatientEncounters = z.infer<
	typeof getInpatientEncountersSchema
>
export type TableInpatientEncounter = z.infer<
	typeof tableInpatientEncounterSchema
>
export type CreateInpatientEncounter = z.infer<
	typeof createInpatientEncounterSchema
>
export type UpdateInpatientEncounter = z.infer<
	typeof updateInpatientEncounterSchema
>
export type CreateInpatientEncounterForm = z.infer<
    typeof createInpatientEncounterFormSchema
>
export type UpdateInpatientEncounterForm = z.infer<
    typeof updateInpatientEncounterFormSchema
>
export type DeleteInpatientEncounter = z.infer<
	typeof deleteInpatientEncounterSchema
>
