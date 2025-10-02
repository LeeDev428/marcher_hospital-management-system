import {
	createOutpatientEncounterSchema,
	updateOutpatientEncounterSchema,
	deleteOutpatientEncounterSchema,
	getOutpatientEncounterSchema,
	getOutpatientEncountersSchema,
} from "@/types/encounters"
import { createTRPCRouter, protectedProcedure } from "../../init"

const getOutpatientEncounters = protectedProcedure
	.input(getOutpatientEncountersSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { patientProfileId } = input

		try {
			const outpatientEncounters =
				await instancePrisma.outpatientEncounter.findMany({
					where: { patientProfileId },
					include: {
						patientProfile: true,
					},
				})

			return {
				success: true,
				message: "Outpatient encounters fetched successfully.",
				data: outpatientEncounters,
			}
		} catch {
			return {
				success: false,
				message: "Failed to fetch outpatient encounters.",
				data: null,
			}
		}
	})

const getOutpatientEncounter = protectedProcedure
	.input(getOutpatientEncounterSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			const outpatientEncounter =
				await instancePrisma.outpatientEncounter.findUnique({
					where: { id },
				})

			return {
				success: true,
				message: "Outpatient encounter fetched successfully.",
				data: outpatientEncounter,
			}
		} catch {
			return {
				success: false,
				message: "Failed to fetch outpatient encounter.",
				data: null,
			}
		}
	})

const createOutpatientEncounter = protectedProcedure
	.input(createOutpatientEncounterSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const {
			patientProfileId,
			date,
			time,
			chiefComplaint,
			doctorDiagnosis,
			type,
		} = input

		try {
			const outpatientEncounter =
				await instancePrisma.outpatientEncounter.create({
					data: {
						patientProfileId,
						date,
						time,
						chiefComplaint,
						doctorDiagnosis,
						type,
					},
				})

			return {
				success: true,
				message: "Outpatient encounter created successfully.",
				data: outpatientEncounter,
			}
		} catch {
			return {
				success: false,
				message: "Failed to create outpatient encounter.",
				data: null,
			}
		}
	})

const updateOutpatientEncounter = protectedProcedure
	.input(
		updateOutpatientEncounterSchema.extend({
			id: getOutpatientEncounterSchema.shape.id,
		})
	)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id, date, time, chiefComplaint, doctorDiagnosis, type } = input

		try {
			const outpatientEncounter =
				await instancePrisma.outpatientEncounter.update({
					where: { id },
					data: { date, time, chiefComplaint, doctorDiagnosis, type },
				})

			return {
				success: true,
				message: "Outpatient encounter updated successfully.",
				data: outpatientEncounter,
			}
		} catch {
			return {
				success: false,
				message: "Failed to update outpatient encounter.",
				data: null,
			}
		}
	})

const deleteOutpatientEncounter = protectedProcedure
	.input(deleteOutpatientEncounterSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			await instancePrisma.outpatientEncounter.delete({
				where: { id },
			})

			return {
				success: true,
				message: "Outpatient encounter deleted successfully.",
				data: null,
			}
		} catch {
			return {
				success: false,
				message: "Failed to delete outpatient encounter.",
				data: null,
			}
		}
	})

export const outpatientEncountersRouter = createTRPCRouter({
	getOutpatientEncounters,
	getOutpatientEncounter,
	createOutpatientEncounter,
	updateOutpatientEncounter,
	deleteOutpatientEncounter,
})
