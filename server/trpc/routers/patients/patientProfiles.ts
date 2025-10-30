import { TRPCError } from "@trpc/server"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/trpc/init"
import { getPatientProfileSchema } from "@/types/patients/patientProfile"
import { querySchema } from "@/types/app/query"

const getPatientProfile = protectedProcedure
	.input(getPatientProfileSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			const patientProfile = await instancePrisma.patient.findUnique({
				where: { id },
				include: {
					user: true,
				},
			})

			if (!patientProfile) {
				return {
					success: false,
					message: "Patient profile not found",
					data: null,
				}
			}
	
			return {
				success: true,
				message: "Patient profile fetched successfully",
				data: patientProfile,
			}
		} catch (error) {
			console.error(error)
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to get patient profile",
			})
		}
	})

const getActivePatientProfiles = publicProcedure
	.input(querySchema)
	.query(async ({ ctx, input }) => {
		const { search, page, limit } = input
		const { instancePrisma } = ctx
		try {
			let whereClause: any = {
				user: {
					status: 'ACTIVE'
				}
			}

			// Add search filter if provided
			if (search && search.trim().length > 0) {
				whereClause = {
					AND: [
						{ user: { status: 'ACTIVE' } },
						{
							OR: [
								{ user: { firstName: { contains: search, mode: 'insensitive' } } },
								{ user: { lastName: { contains: search, mode: 'insensitive' } } },
								{ user: { middleName: { contains: search, mode: 'insensitive' } } },
							]
						}
					]
				}
			}

			const patientProfiles = await instancePrisma.patient.findMany({
				where: whereClause,
				skip: (page - 1) * limit,
				take: limit,
				include: {
					user: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							middleName: true,
							email: true,
							phone: true,
							gender: true,
							dateOfBirth: true,
							status: true,
						}
					},
					inpatientEncounters: {
						orderBy: {
							createdAt: 'desc'
						},
						take: 1,
						select: {
							id: true,
							disposition: true,
							createdAt: true,
						}
					},
					dataShareRequests: {
						orderBy: {
							createdAt: 'desc'
						},
						take: 1,
						select: {
							status: true,
							requestNumber: true,
						}
					}
				},
				orderBy: {
					createdAt: "desc",
				},
			})

			// Map to include computed fields
			const patientsWithStatus = patientProfiles.map(patient => ({
				...patient,
				latestEncounter: patient.inpatientEncounters[0] || null,
				dataShareStatus: patient.dataShareRequests[0]?.status || null,
				dataShareRequestNumber: patient.dataShareRequests[0]?.requestNumber || null,
			}))

			return {
				success: true,
				message: "Patient profiles fetched successfully",
				data: patientsWithStatus,
			}

		} catch (error) {
			console.error(error)
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to get patient profiles",
			})
		}
	})

const getArchivedPatientProfiles = publicProcedure
	.input(querySchema)
	.query(async ({ ctx, input }) => {
		const { search, page, limit } = input
		const { instancePrisma } = ctx
		try {
			let whereClause: any = {
				user: {
					status: 'INACTIVE'
				}
			}

			// Add search filter if provided
			if (search && search.trim().length > 0) {
				whereClause = {
					AND: [
						{ user: { status: 'INACTIVE' } },
						{
							OR: [
								{ user: { firstName: { contains: search, mode: 'insensitive' } } },
								{ user: { lastName: { contains: search, mode: 'insensitive' } } },
								{ user: { middleName: { contains: search, mode: 'insensitive' } } },
							]
						}
					]
				}
			}

			const patientProfiles = await instancePrisma.patient.findMany({
				where: whereClause,
				skip: (page - 1) * limit,
				take: limit,
				include: {
					user: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							middleName: true,
							email: true,
							phone: true,
							gender: true,
							dateOfBirth: true,
							status: true,
						}
					}
				},
				orderBy: {
					createdAt: "desc",
				},
			})

			return {
				success: true,
				message: "Archived patient profiles fetched successfully",
				data: patientProfiles,
			}

		} catch (error) {
			console.error(error)
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to get archived patient profiles",
			})
		}
	})

const updatePatientProfile = publicProcedure
	.input(getPatientProfileSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			// Check if patient exists
			const patient = await instancePrisma.patient.findUnique({
				where: { id }
			})

			if (!patient) {
				return {
					success: false,
					message: "Patient not found",
				}
			}

			// Update patient - for now just return success as we don't have update fields
			// This can be expanded when you need to update patient fields
			return {
				success: true,
				message: "Patient updated successfully",
			}
		} catch (error) {
			console.error(error)
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to update patient",
			})
		}
	})

const archivePatientProfile = publicProcedure
	.input(getPatientProfileSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			// Update user status to INACTIVE
			const patient = await instancePrisma.patient.findUnique({
				where: { id }
			})

			if (!patient) {
				return {
					success: false,
					message: "Patient not found",
				}
			}

			await instancePrisma.user.update({
				where: { id: patient.userId },
				data: { status: 'INACTIVE' }
			})

			return {
				success: true,
				message: "Patient archived successfully",
			}
		} catch (error) {
			console.error(error)
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to archive patient",
			})
		}
	})

const unarchivePatientProfile = publicProcedure
	.input(getPatientProfileSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			// Update user status to ACTIVE
			const patient = await instancePrisma.patient.findUnique({
				where: { id }
			})

			if (!patient) {
				return {
					success: false,
					message: "Patient not found",
				}
			}

			await instancePrisma.user.update({
				where: { id: patient.userId },
				data: { status: 'ACTIVE' }
			})

			return {
				success: true,
				message: "Patient unarchived successfully",
			}
		} catch (error) {
			console.error(error)
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to unarchive patient",
			})
		}
	})

export const patientProfilesRouter = createTRPCRouter({
	getPatientProfile,
	getActivePatientProfiles,
	getArchivedPatientProfiles,
	updatePatientProfile,
	archivePatientProfile,
	unarchivePatientProfile,
})