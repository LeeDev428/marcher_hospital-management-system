import {
	createOutpatientEncounterSchema,
	updateOutpatientEncounterSchema,
	deleteOutpatientEncounterSchema,
	getOutpatientEncounterSchema,
	getOutpatientEncountersByPatientSchema,
} from "@/types/encounters"
import { createTRPCRouter, protectedProcedure } from "../../init"
import { TRPCError } from "@trpc/server"

// Get all outpatient encounters for a patient
const getOutpatientEncounters = protectedProcedure
	.input(getOutpatientEncountersByPatientSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { patientId } = input

		try {
			const encounters = await instancePrisma.outpatientEncounter.findMany({
				where: { patientId },
				include: {
					patient: {
						include: {
							user: {
								select: {
									firstName: true,
									lastName: true,
									email: true,
								},
							},
						},
					},
				},
				orderBy: { createdAt: 'desc' },
			})

			return {
				success: true,
				message: "Outpatient encounters fetched successfully.",
				data: encounters,
			}
		} catch (error) {
			console.error("Get outpatient encounters error:", error)
			return {
				success: false,
				message: "Failed to fetch outpatient encounters.",
				data: null,
			}
		}
	})

// Get single outpatient encounter
const getOutpatientEncounter = protectedProcedure
	.input(getOutpatientEncounterSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			const encounter = await instancePrisma.outpatientEncounter.findUnique({
				where: { id },
				include: {
					patient: {
						include: {
							user: {
								select: {
									firstName: true,
									lastName: true,
									email: true,
									phone: true,
								},
							},
						},
					},
				},
			})

			if (!encounter) {
				return {
					success: false,
					message: "Outpatient encounter not found.",
					data: null,
				}
			}

			return {
				success: true,
				message: "Outpatient encounter fetched successfully.",
				data: encounter,
			}
		} catch (error) {
			console.error("Get outpatient encounter error:", error)
			return {
				success: false,
				message: "Failed to fetch outpatient encounter.",
				data: null,
			}
		}
	})

// Create outpatient encounter (DOCTOR only)
const createOutpatientEncounter = protectedProcedure
	.input(createOutpatientEncounterSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma, user } = ctx

		// Check user role - only doctors can create
		if (!user || user.role !== 'STAFF') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Only doctors can create outpatient encounters',
			})
		}

		const staffUser = await instancePrisma.user.findUnique({
			where: { id: user.id },
			include: { staffCredentials: true },
		})

		if (!staffUser?.staffCredentials || staffUser.staffCredentials.staffType !== 'DOCTOR') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Only doctors can create outpatient encounters',
			})
		}

		const {
			patientId,
			date,
			time,
			chiefComplaint,
			doctorDiagnosis,
			type,
			consultationFee,
			paymentStatus,
			notes,
		} = input

		try {
			const encounter = await instancePrisma.outpatientEncounter.create({
				data: {
					patientId,
					doctorId: user.id,
					date,
					time,
					chiefComplaint,
					doctorDiagnosis,
					type: type || 'CONSULTATION',
					consultationFee,
					paymentStatus: paymentStatus || 'UNPAID',
					notes,
				},
				include: {
					patient: {
						include: {
							user: true,
						},
					},
				},
			})

			return {
				success: true,
				message: "Outpatient encounter created successfully.",
				data: encounter,
			}
		} catch (error) {
			console.error("Create outpatient encounter error:", error)
			return {
				success: false,
				message: "Failed to create outpatient encounter.",
				data: null,
			}
		}
	})

// Update outpatient encounter (DOCTOR only - own encounters)
const updateOutpatientEncounter = protectedProcedure
	.input(updateOutpatientEncounterSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma, user } = ctx

		// Check user role - only doctors can update
		if (!user || user.role !== 'STAFF') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Only doctors can update outpatient encounters',
			})
		}

		const staffUser = await instancePrisma.user.findUnique({
			where: { id: user.id },
			include: { staffCredentials: true },
		})

		if (!staffUser?.staffCredentials || staffUser.staffCredentials.staffType !== 'DOCTOR') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Only doctors can update outpatient encounters',
			})
		}

		const {
			id,
			doctorDiagnosis,
			consultationFee,
			paymentStatus,
			notes,
		} = input

		try {
			// Get current encounter
			const currentEncounter = await instancePrisma.outpatientEncounter.findUnique({
				where: { id },
			})

			if (!currentEncounter) {
				return {
					success: false,
					message: "Encounter not found.",
					data: null,
				}
			}

			// Check if doctor created this encounter
			if (currentEncounter.doctorId !== user.id) {
				return {
					success: false,
					message: "You can only update your own consultations.",
					data: null,
				}
			}

			// Update encounter
			const encounter = await instancePrisma.outpatientEncounter.update({
				where: { id },
				data: {
					...(doctorDiagnosis !== undefined && { doctorDiagnosis }),
					...(consultationFee !== undefined && { consultationFee }),
					...(paymentStatus !== undefined && { paymentStatus }),
					...(notes !== undefined && { notes }),
				},
				include: {
					patient: {
						include: {
							user: true,
						},
					},
				},
			})

			return {
				success: true,
				message: "Outpatient encounter updated successfully.",
				data: encounter,
			}
		} catch (error) {
			console.error("Update outpatient encounter error:", error)
			return {
				success: false,
				message: "Failed to update outpatient encounter.",
				data: null,
			}
		}
	})

// Delete outpatient encounter (DOCTOR only - own encounters)
const deleteOutpatientEncounter = protectedProcedure
	.input(deleteOutpatientEncounterSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma, user } = ctx
		const { id } = input

		try {
			// Get current encounter
			const currentEncounter = await instancePrisma.outpatientEncounter.findUnique({
				where: { id },
			})

			if (!currentEncounter) {
				return {
					success: false,
					message: "Encounter not found.",
					data: null,
				}
			}

			// Check if doctor created this encounter
			if (currentEncounter.doctorId !== user?.id) {
				return {
					success: false,
					message: "You can only delete your own consultations.",
					data: null,
				}
			}

			await instancePrisma.outpatientEncounter.delete({
				where: { id },
			})

			return {
				success: true,
				message: "Outpatient encounter deleted successfully.",
				data: null,
			}
		} catch (error) {
			console.error("Delete outpatient encounter error:", error)
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
