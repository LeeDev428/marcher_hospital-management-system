import { TRPCError } from "@trpc/server"
import { createTRPCRouter, protectedProcedure } from "@/server/trpc/init"
import { getPatientProfileSchema, createPatientProfileSchema, updatePatientProfileSchema } from "@/types/patients/patientProfile"
import { querySchema } from "@/types/app/query"

const getPatientProfile = protectedProcedure
	.input(getPatientProfileSchema)
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			const patientProfile = await instancePrisma.patientProfile.findUnique({
				where: { id },
				include: {
					addresses: true,
					contacts: true,
					employments: true,
					emergencyContacts: true,
					consent: true,
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

const getActivePatientProfiles = protectedProcedure
	.input(querySchema)
	.query(async ({ ctx, input }) => {
		const { search, page, limit } = input
		const { instancePrisma } = ctx
		try {
			const patientProfiles = await instancePrisma.patientProfile.findMany({
				where: {
					archived: false,
				},
				skip: (page - 1) * limit,
				take: limit,
				orderBy: {
					createdAt: "desc",
				},
				omit: {
					birthplace: true,
					nationality: true,
					religion: true,
					bloodType: true,
				}
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

const getArchivedPatientProfiles = protectedProcedure
	.input(querySchema)
	.query(async ({ ctx, input }) => {
		const { search, page, limit } = input
		const { instancePrisma } = ctx

		try {
			const patientProfiles = await instancePrisma.patientProfile.findMany({
				where: {
					archived: true,
				},
				skip: (page - 1) * limit,
				take: limit,
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

const createPatientProfile = protectedProcedure
	.input(createPatientProfileSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx

		const { addresses, contacts, employments, emergencyContacts, consent, ...profile } = input

		try {
			const patientProfile = await instancePrisma.patientProfile.create({
				data: {
					...profile,
					addresses: {
						create: input.addresses ?? undefined,
					},
					contacts: {
						create: input.contacts ?? undefined,
					},
					employments: {
						create: input.employments ?? undefined,
					},
					emergencyContacts: {
						create: input.emergencyContacts ?? undefined,
					},
					consent: {
						create: input.consent ?? undefined,
					},
				},
			})
	
			return {
				success: true,
				message: "Patient profile created successfully",
				id: patientProfile.id,
			}
		} catch (error) {
			console.error(error)
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to create patient profile",
			})
		}
	})

const updatePatientProfile = protectedProcedure
	.input(updatePatientProfileSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id, addresses, contacts, employments, emergencyContacts, consent, ...profile } = input

		try {
			const patientProfile = await instancePrisma.patientProfile.update({
				where: { id },
				data: {
					...profile,
					addresses: {
						deleteMany: {},
						create: addresses ?? undefined,
					},
					contacts: {
						deleteMany: {},
						create: contacts ?? undefined,
					},
					employments: {
						deleteMany: {},
						create: employments ?? undefined,
					},
					emergencyContacts: {
						deleteMany: {},
						create: emergencyContacts ?? undefined,
					},
					consent: {
						upsert: consent ? {
							create: consent,
							update: consent,
						} : undefined,
					},
				},
			})

			return {
				success: true,
				message: "Patient profile updated successfully",
				id: patientProfile.id,
			}
		} catch (error) {
			console.error(error)
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to update patient profile",
			})
		}
	})

const archivePatientProfile = protectedProcedure
	.input(getPatientProfileSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input
		
		try {
			await instancePrisma.patientProfile.update({
				where: { id },
				data: {
					archived: true,
				}
			})

			return {
				success: true,
				message: "Patient profile archived successfully",
				id: id,
			}
		} catch (error) {
			console.error(error)
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to archive patient profile",
			})
		}
	})

const unarchivePatientProfile = protectedProcedure
	.input(getPatientProfileSchema)
	.mutation(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		const { id } = input

		try {
			await instancePrisma.patientProfile.update({
				where: { id },
				data: {
					archived: false,
				}
			})

			return {
				success: true,
				message: "Patient profile unarchived successfully",
				id: id,
			}
		} catch (error) {
			console.error(error)
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to unarchive patient profile",
			})
		}
	})

export const patientProfilesRouter = createTRPCRouter({
	getPatientProfile,
	getActivePatientProfiles,
	getArchivedPatientProfiles,
	createPatientProfile,
	updatePatientProfile,
	archivePatientProfile,
	unarchivePatientProfile,
})