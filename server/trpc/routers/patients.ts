import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from "../init"

export const patientsRouter = createTRPCRouter({
	// Stub - will implement later to call Express backend
	getPatients: publicProcedure.query(() => ({ success: true, data: [] })),
	
	// Search patients by name
	searchPatients: publicProcedure
		.input(z.object({ 
			query: z.string(),
			limit: z.number().optional().default(10)
		}))
		.query(async ({ ctx, input }) => {
			try {
				const { instancePrisma } = ctx
				
				const patients = await instancePrisma.patient.findMany({
					where: {
						user: {
							OR: [
								{
									firstName: {
										contains: input.query,
										mode: 'insensitive'
									}
								},
								{
									lastName: {
										contains: input.query,
										mode: 'insensitive'
									}
								},
								{
									email: {
										contains: input.query,
										mode: 'insensitive'
									}
								}
							]
						}
					},
					take: input.limit,
					include: {
						user: {
							select: {
								firstName: true,
								lastName: true,
								email: true,
								phone: true
							}
						}
					}
				})
				
				// Transform to include user fields at top level
				const transformedPatients = patients.map(p => ({
					patientId: p.id,
					firstName: p.user.firstName,
					lastName: p.user.lastName,
					email: p.user.email,
					phone: p.user.phone,
					patientNumber: p.patientNumber
				}))
				
				return {
					success: true,
					data: transformedPatients
				}
			} catch (error: any) {
				console.error('Error searching patients:', error)
				return {
					success: false,
					message: error.message || 'Failed to search patients',
					data: []
				}
			}
		}),
	
	// Get patient by user ID
	getPatientByUserId: publicProcedure
		.input(z.object({ userId: z.string() }))
		.query(async ({ ctx, input }) => {
			try {
				const { instancePrisma } = ctx
				
				const patient = await instancePrisma.patient.findFirst({
					where: { userId: input.userId },
					include: {
						user: {
							select: {
								firstName: true,
								lastName: true,
								email: true,
								phone: true,
							}
						}
					}
				})
				
				if (!patient) {
					return {
						success: false,
						message: 'Patient not found',
						data: null
					}
				}
				
				return {
					success: true,
					message: 'Patient found',
					data: patient
				}
			} catch (error: any) {
				console.error('Error getting patient by user ID:', error)
				return {
					success: false,
					message: error.message || 'Failed to get patient',
					data: null
				}
			}
		})
})