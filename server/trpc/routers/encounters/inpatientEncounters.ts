import {
	createInpatientEncounterSchema,
	deleteInpatientEncounterSchema,
	getInpatientEncounterSchema,
	updateInpatientEncounterSchema,
	getInpatientEncountersSchema,
} from "@/types/encounters"
import { createTRPCRouter, protectedProcedure } from "../../init"

const getInpatientEncounters = protectedProcedure
	.input(getInpatientEncountersSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { patientProfileId } = input

		try {
			const inpatientEncounters =
				await instancePrisma.inpatientEncounter.findMany({
					where: { patientProfileId },
					include: {
						patientProfile: true,
					},
				})

			return {
				success: true,
				message: "Inpatient encounters fetched successfully.",
				data: inpatientEncounters,
			}
		} catch {
			return {
				success: false,
				message: "Failed to fetch inpatient encounters.",
				data: null,
			}
		}
	})

const getInpatientEncounter = protectedProcedure
	.input(getInpatientEncounterSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			const inpatientEncounter =
				await instancePrisma.inpatientEncounter.findUnique({
					where: { id },
				})

			return {
				success: true,
				message: "Inpatient encounter fetched successfully.",
				data: inpatientEncounter,
			}
		} catch {
			return {
				success: false,
				message: "Failed to fetch inpatient encounter.",
				data: null,
			}
		}
	})

const createInpatientEncounter = protectedProcedure
	.input(createInpatientEncounterSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const {
			patientProfileId,
			date,
			time,
			chiefComplaint,
			doctorDiagnosis,
			triage,
			disposition,
			dispositionDate,
			dispositionTime,
			dispositionNote,
		} = input

		try {
			const inpatientEncounter = await instancePrisma.inpatientEncounter.create(
				{
					data: {
						patientProfileId,
						date,
						time,
						chiefComplaint,
						doctorDiagnosis,
						triage,
						disposition,
						dispositionDate,
						dispositionTime,
						dispositionNote,
					},
				}
			)

			return {
				success: true,
				message: "Inpatient encounter created successfully.",
				data: inpatientEncounter,
			}
		} catch {
			return {
				success: false,
				message: "Failed to create inpatient encounter.",
				data: null,
			}
		}
	})

const updateInpatientEncounter = protectedProcedure
	.input(updateInpatientEncounterSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const {
			id,
			date,
			time,
			chiefComplaint,
			doctorDiagnosis,
			triage,
			disposition,
			dispositionDate,
			dispositionTime,
			dispositionNote,
		} = input

		try {
			const inpatientEncounter = await instancePrisma.inpatientEncounter.update(
				{
					where: { id },
					data: {
						date,
						time,
						chiefComplaint,
						doctorDiagnosis,
						triage,
						disposition,
						dispositionDate,
						dispositionTime,
						dispositionNote,
					},
				}
			)

			return {
				success: true,
				message: "Inpatient encounter updated successfully.",
				data: inpatientEncounter,
			}
		} catch {
			return {
				success: false,
				message: "Failed to update inpatient encounter.",
				data: null,
			}
		}
	})

const deleteInpatientEncounter = protectedProcedure
	.input(deleteInpatientEncounterSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			await instancePrisma.inpatientEncounter.delete({
				where: { id },
			})

			return {
				success: true,
				message: "Inpatient encounter deleted successfully.",
				data: null,
			}
		} catch {
			return {
				success: false,
				message: "Failed to delete inpatient encounter.",
				data: null,
			}
		}
	})

export const inpatientEncountersRouter = createTRPCRouter({
	getInpatientEncounters,
	getInpatientEncounter,
	createInpatientEncounter,
	updateInpatientEncounter,
	deleteInpatientEncounter,
})
