import {
	createInpatientEncounterSchema,
	deleteInpatientEncounterSchema,
	getInpatientEncounterSchema,
	updateInpatientEncounterSchema,
	checkActiveEncounterSchema,
	getInpatientEncountersByPatientSchema,
	createInpatientChartSchema,
	getInpatientChartsSchema,
	deleteInpatientChartSchema,
	createInpatientOrderSchema,
	updateInpatientOrderSchema,
	getInpatientOrdersSchema,
	deleteInpatientOrderSchema,
} from "@/types/encounters"
import { createTRPCRouter, protectedProcedure } from "../../init"
import { TRPCError } from "@trpc/server"

// ==================== INPATIENT ENCOUNTERS ====================

// Get all inpatient encounters for a patient
const getInpatientEncounters = protectedProcedure
	.input(getInpatientEncountersByPatientSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { patientId } = input

		try {
			const encounters = await instancePrisma.inpatientEncounter.findMany({
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
					charts: {
						orderBy: { createdAt: 'desc' },
						take: 5, // Latest 5 charts
					},
					orders: {
						include: {
							catalogueItem: true,
						},
					},
				},
				orderBy: { createdAt: 'desc' },
			})

			return {
				success: true,
				message: "Inpatient encounters fetched successfully.",
				data: encounters,
			}
		} catch (error) {
			console.error("Get inpatient encounters error:", error)
			return {
				success: false,
				message: "Failed to fetch inpatient encounters.",
				data: null,
			}
		}
	})

// Get single inpatient encounter with full details
const getInpatientEncounter = protectedProcedure
	.input(getInpatientEncounterSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			const encounter = await instancePrisma.inpatientEncounter.findUnique({
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
					charts: {
						orderBy: { createdAt: 'desc' },
					},
					orders: {
						include: {
							catalogueItem: true,
						},
						orderBy: { createdAt: 'desc' },
					},
				},
			})

			if (!encounter) {
				return {
					success: false,
					message: "Inpatient encounter not found.",
					data: null,
				}
			}

			return {
				success: true,
				message: "Inpatient encounter fetched successfully.",
				data: encounter,
			}
		} catch (error) {
			console.error("Get inpatient encounter error:", error)
			return {
				success: false,
				message: "Failed to fetch inpatient encounter.",
				data: null,
			}
		}
	})

// Check if patient has active (non-discharged) encounter
const checkActiveEncounter = protectedProcedure
	.input(checkActiveEncounterSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { patientId } = input

		try {
			const activeEncounter = await instancePrisma.inpatientEncounter.findFirst({
				where: {
					patientId,
					disposition: 'ADMITTED', // Only ADMITTED status means active
				},
			})

			return {
				success: true,
				hasActiveEncounter: !!activeEncounter,
				activeEncounter,
			}
		} catch (error) {
			console.error("Check active encounter error:", error)
			return {
				success: false,
				hasActiveEncounter: false,
				activeEncounter: null,
			}
		}
	})

// Create new inpatient encounter (ADMISSIONS_STAFF only)
const createInpatientEncounter = protectedProcedure
	.input(createInpatientEncounterSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma, user } = ctx
		
		// Check user role - only admissions staff can create
		if (!user || user.role !== 'STAFF') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Only admissions staff can create inpatient encounters',
			})
		}

		// Check staff type
		const staffUser = await instancePrisma.user.findUnique({
			where: { id: user.userId },
			include: { staffCredentials: true },
		})

		if (!staffUser?.staffCredentials || staffUser.staffCredentials.staffType !== 'ADMISSIONS_STAFF') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Only admissions staff can create inpatient encounters',
			})
		}

		const { patientId, doctorId, date, time, chiefComplaint, triage } = input

		try {
			// Check if patient has active encounter
			const activeCheck = await instancePrisma.inpatientEncounter.findFirst({
				where: {
					patientId,
					disposition: 'ADMITTED',
				},
			})

			if (activeCheck) {
				return {
					success: false,
					message: "Patient has an active encounter. Please discharge the current encounter first.",
					data: null,
				}
			}

			// Verify doctor exists and is a doctor
			const doctor = await instancePrisma.user.findUnique({
				where: { id: doctorId },
				include: { staffCredentials: true },
			})

			if (!doctor || doctor.role !== 'STAFF' || doctor.staffCredentials?.staffType !== 'DOCTOR') {
				return {
					success: false,
					message: "Invalid doctor assignment. Please select a valid doctor.",
					data: null,
				}
			}

			// Create encounter
			const encounter = await instancePrisma.inpatientEncounter.create({
				data: {
					patientId,
					doctorId,
					admittedBy: user.userId,
					date,
					time,
					chiefComplaint,
					triage,
					disposition: 'ADMITTED',
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
				message: "Inpatient encounter created successfully.",
				data: encounter,
			}
		} catch (error) {
			console.error("Create inpatient encounter error:", error)
			return {
				success: false,
				message: "Failed to create inpatient encounter.",
				data: null,
			}
		}
	})

// Update inpatient encounter (DOCTOR only - for disposition)
const updateInpatientEncounter = protectedProcedure
	.input(updateInpatientEncounterSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma, user } = ctx

		// Check user role - only doctors can update
		if (!user || user.role !== 'STAFF') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Only doctors can update inpatient encounters',
			})
		}

		const staffUser = await instancePrisma.user.findUnique({
			where: { id: user.userId },
			include: { staffCredentials: true },
		})

		if (!staffUser?.staffCredentials || staffUser.staffCredentials.staffType !== 'DOCTOR') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Only doctors can update inpatient encounters',
			})
		}

		const { id, doctorDiagnosis, disposition, dispositionDate, dispositionTime, dispositionNote } = input

		try {
			// Get current encounter
			const currentEncounter = await instancePrisma.inpatientEncounter.findUnique({
				where: { id },
			})

			if (!currentEncounter) {
				return {
					success: false,
					message: "Encounter not found.",
					data: null,
				}
			}

			// Check if doctor is assigned to this encounter
			if (currentEncounter.doctorId !== user.userId) {
				return {
					success: false,
					message: "You can only update encounters assigned to you.",
					data: null,
				}
			}

			// Update encounter
			const encounter = await instancePrisma.inpatientEncounter.update({
				where: { id },
				data: {
					...(doctorDiagnosis !== undefined && { doctorDiagnosis }),
					...(disposition !== undefined && { disposition }),
					...(dispositionDate !== undefined && { dispositionDate }),
					...(dispositionTime !== undefined && { dispositionTime }),
					...(dispositionNote !== undefined && { dispositionNote }),
				},
				include: {
					patient: {
						include: {
							user: true,
						},
					},
					charts: true,
					orders: {
						include: {
							catalogueItem: true,
						},
					},
				},
			})

			return {
				success: true,
				message: "Inpatient encounter updated successfully.",
				data: encounter,
			}
		} catch (error) {
			console.error("Update inpatient encounter error:", error)
			return {
				success: false,
				message: "Failed to update inpatient encounter.",
				data: null,
			}
		}
	})
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
