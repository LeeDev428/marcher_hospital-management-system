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
		} catch (error) {
			console.error("Delete inpatient encounter error:", error)
			return {
				success: false,
				message: "Failed to delete inpatient encounter.",
				data: null,
			}
		}
	})

// ==================== INPATIENT ENCOUNTER CHARTS ====================

// Add chart/progress note (DOCTOR only)
const createInpatientChart = protectedProcedure
	.input(createInpatientChartSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma, user } = ctx

		if (!user || user.role !== 'STAFF') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Only doctors can add charts',
			})
		}

		const staffUser = await instancePrisma.user.findUnique({
			where: { id: user.id },
			include: { staffCredentials: true },
		})

		if (!staffUser?.staffCredentials || staffUser.staffCredentials.staffType !== 'DOCTOR') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Only doctors can add charts',
			})
		}

		const { encounterId, chart } = input

		try {
			const newChart = await instancePrisma.inpatientEncounterChart.create({
				data: {
					encounterId,
					staffId: user.id,
					chart,
				},
			})

			return {
				success: true,
				message: "Chart added successfully.",
				data: newChart,
			}
		} catch (error) {
			console.error("Create chart error:", error)
			return {
				success: false,
				message: "Failed to add chart.",
				data: null,
			}
		}
	})

// Get charts for encounter
const getInpatientCharts = protectedProcedure
	.input(getInpatientChartsSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { encounterId } = input

		try {
			const charts = await instancePrisma.inpatientEncounterChart.findMany({
				where: { encounterId },
				orderBy: { createdAt: 'desc' },
			})

			return {
				success: true,
				message: "Charts fetched successfully.",
				data: charts,
			}
		} catch (error) {
			console.error("Get charts error:", error)
			return {
				success: false,
				message: "Failed to fetch charts.",
				data: null,
			}
		}
	})

// Delete chart
const deleteInpatientChart = protectedProcedure
	.input(deleteInpatientChartSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma, user } = ctx
		const { id } = input

		try {
			// Check if chart belongs to current user
			const chart = await instancePrisma.inpatientEncounterChart.findUnique({
				where: { id },
			})

			if (!chart || chart.staffId !== user?.id) {
				return {
					success: false,
					message: "You can only delete your own charts.",
					data: null,
				}
			}

			await instancePrisma.inpatientEncounterChart.delete({
				where: { id },
			})

			return {
				success: true,
				message: "Chart deleted successfully.",
				data: null,
			}
		} catch (error) {
			console.error("Delete chart error:", error)
			return {
				success: false,
				message: "Failed to delete chart.",
				data: null,
			}
		}
	})

// ==================== INPATIENT ENCOUNTER ORDERS ====================

// Add order/particular (DOCTOR only)
const createInpatientOrder = protectedProcedure
	.input(createInpatientOrderSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma, user } = ctx

		if (!user || user.role !== 'STAFF') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Only doctors can add orders',
			})
		}

		const staffUser = await instancePrisma.user.findUnique({
			where: { id: user.id },
			include: { staffCredentials: true },
		})

		if (!staffUser?.staffCredentials || staffUser.staffCredentials.staffType !== 'DOCTOR') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Only doctors can add orders',
			})
		}

		const { encounterId, catalogueItemId, type, description, cost, notes } = input

		try {
			const order = await instancePrisma.inpatientEncounterOrder.create({
				data: {
					encounterId,
					catalogueItemId,
					type,
					description,
					cost,
					notes,
					orderedBy: user.id,
					status: 'PENDING',
				},
				include: {
					catalogueItem: true,
				},
			})

			return {
				success: true,
				message: "Order added successfully.",
				data: order,
			}
		} catch (error) {
			console.error("Create order error:", error)
			return {
				success: false,
				message: "Failed to add order.",
				data: null,
			}
		}
	})

// Update order status
const updateInpatientOrder = protectedProcedure
	.input(updateInpatientOrderSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id, status, notes } = input

		try {
			const order = await instancePrisma.inpatientEncounterOrder.update({
				where: { id },
				data: {
					status,
					...(notes !== undefined && { notes }),
				},
				include: {
					catalogueItem: true,
				},
			})

			return {
				success: true,
				message: "Order updated successfully.",
				data: order,
			}
		} catch (error) {
			console.error("Update order error:", error)
			return {
				success: false,
				message: "Failed to update order.",
				data: null,
			}
		}
	})

// Get orders for encounter
const getInpatientOrders = protectedProcedure
	.input(getInpatientOrdersSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { encounterId } = input

		try {
			const orders = await instancePrisma.inpatientEncounterOrder.findMany({
				where: { encounterId },
				include: {
					catalogueItem: true,
				},
				orderBy: { createdAt: 'desc' },
			})

			return {
				success: true,
				message: "Orders fetched successfully.",
				data: orders,
			}
		} catch (error) {
			console.error("Get orders error:", error)
			return {
				success: false,
				message: "Failed to fetch orders.",
				data: null,
			}
		}
	})

// Delete order
const deleteInpatientOrder = protectedProcedure
	.input(deleteInpatientOrderSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma, user } = ctx
		const { id } = input

		try {
			// Check if order belongs to current doctor
			const order = await instancePrisma.inpatientEncounterOrder.findUnique({
				where: { id },
			})

			if (!order || order.orderedBy !== user?.id) {
				return {
					success: false,
					message: "You can only delete your own orders.",
					data: null,
				}
			}

			await instancePrisma.inpatientEncounterOrder.delete({
				where: { id },
			})

			return {
				success: true,
				message: "Order deleted successfully.",
				data: null,
			}
		} catch (error) {
			console.error("Delete order error:", error)
			return {
				success: false,
				message: "Failed to delete order.",
				data: null,
			}
		}
	})

export const inpatientEncountersRouter = createTRPCRouter({
	// Encounters
	getInpatientEncounters,
	getInpatientEncounter,
	checkActiveEncounter,
	createInpatientEncounter,
	updateInpatientEncounter,
	deleteInpatientEncounter,
	// Charts
	createInpatientChart,
	getInpatientCharts,
	deleteInpatientChart,
	// Orders
	createInpatientOrder,
	updateInpatientOrder,
	getInpatientOrders,
	deleteInpatientOrder,
})
