import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from "../init"

export const patientsRouter = createTRPCRouter({
	// Stub - will implement later to call Express backend
	getPatients: publicProcedure.query(() => ({ success: true, data: [] })),
	
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