import { z } from "zod"
import { tablePatientProfileSchema } from "../patients"

export const outpatientEncounterTypeSchema = z.enum([
	"CONSULTATION",
	"FOLLOW_UP",
	"LABORATORY",
	"RADIOLOGY",
	"OTHER",
])

export const outpatientEncounterTypeOptions =
	outpatientEncounterTypeSchema.options.map((type) => ({
		label: type.charAt(0).toUpperCase() + type.slice(1),
		value: type,
	}))

const outpatientEncounterBaseSchema = z.object({
    date: z.string().date("Invalid date."),
    time: z.string().time("Invalid time."),
    chiefComplaint: z.string().min(1, "Chief complaint is required."),
    doctorDiagnosis: z.string().min(1, "Doctor diagnosis is required."),
    type: outpatientEncounterTypeSchema,
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

// TRPC input schemas (include patientProfileId for both create and update)
export const createOutpatientEncounterSchema = outpatientEncounterBaseSchema.extend({
    patientProfileId: z.string().uuid("Invalid patient profile ID."),
})

export const updateOutpatientEncounterSchema = outpatientEncounterBaseSchema.extend({
    id: z.string().uuid("Invalid encounter ID."),
    patientProfileId: z.string().uuid("Invalid patient profile ID."),
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
