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
			const whereClause: any = {}

			// Add search filter if provided
			if (search && search.trim().length > 0) {
				whereClause.user = {
					OR: [
						{ firstName: { contains: search, mode: 'insensitive' } },
						{ lastName: { contains: search, mode: 'insensitive' } },
						{ middleName: { contains: search, mode: 'insensitive' } },
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
						}
					}
				},
				orderBy: {
					createdAt: "desc",
				},
			})

			return {
				success: true,
				message: "Patient profiles fetched successfully",
				data: patientProfiles,
			}

		} catch (error) {
			console.error(error)
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to get patient profiles",
			})
		}
	})

// Temporarily disabled - needs schema fixes
// const getArchivedPatientProfiles = protectedProcedure
// const createPatientProfile = protectedProcedure  
// const updatePatientProfile = protectedProcedure
// const archivePatientProfile = protectedProcedure
// const unarchivePatientProfile = protectedProcedure

export const patientProfilesRouter = createTRPCRouter({
	getPatientProfile,
	getActivePatientProfiles,
	// getArchivedPatientProfiles,
	// createPatientProfile,
	// updatePatientProfile,
	// archivePatientProfile,
	// unarchivePatientProfile,
})