import { createTRPCRouter, publicProcedure } from "../../init"
import { insuranceProvidersRouter } from "./insuranceProviders"
import { insuranceClaimsRouter } from "./insuranceClaims"
import { insuranceClaimItemsRouter } from "./insuranceClaimItems"
import { getInsuranceClaimsSchema } from "~/types/insurance/claim"
import { TRPCError } from "@trpc/server"

// Legacy getClaims procedure for backward compatibility with billing_staff and patient pages
const getClaims = publicProcedure
	.input(getInsuranceClaimsSchema)
	.query(async ({ ctx, input }) => {
		try {
			const { instancePrisma } = ctx

			const skip = (input.page - 1) * input.limit

			const where: any = {}
			if (input.patientId) {
				where.patientId = input.patientId
			}
			if (input.status) {
				where.status = input.status
			}

			const [claims, total] = await Promise.all([
				instancePrisma.insuranceClaim.findMany({
					where,
					skip,
					take: input.limit,
					include: {
						patient: {
							include: {
								user: true,
							},
						},
						documents: true,
						inpatientEncounter: true,
						outpatientEncounter: true,
					},
					orderBy: {
						createdAt: 'desc',
					},
				}),
				instancePrisma.insuranceClaim.count({ where }),
			])

			return {
				success: true,
				data: claims,
				pagination: {
					total,
					page: input.page,
					limit: input.limit,
					totalPages: Math.ceil(total / input.limit),
				},
			}
		} catch (error: any) {
			console.error('Error getting claims:', error)
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: error.message || 'Failed to get claims',
			})
		}
	})

export const insuranceRouter = createTRPCRouter({
	providers: insuranceProvidersRouter,
	claims: insuranceClaimsRouter,
	claimItems: insuranceClaimItemsRouter,
	getClaims, // Legacy endpoint for backward compatibility
})