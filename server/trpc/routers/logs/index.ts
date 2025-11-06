import { createTRPCRouter, publicProcedure } from "../../init"
import { z } from "zod"

// Facility logs procedure
const getFacilityLogs = publicProcedure
	.input(z.object({
		page: z.number().default(1),
		limit: z.number().default(50),
		action: z.string().optional(),
		user: z.string().optional(),
	}))
	.query(async ({ ctx, input }) => {
		const { instancePrisma } = ctx
		console.log("🔍 LOGS ROUTER CALLED - getFacilityLogs with input:", input)

		try {
			const where: any = {}
			
			if (input.action) {
				where.action = input.action
			}
			
			if (input.user) {
				where.user = { contains: input.user, mode: 'insensitive' }
			}

			const logs = await instancePrisma.facilityLog.findMany({
				where,
				orderBy: { timestamp: 'desc' },
				skip: (input.page - 1) * input.limit,
				take: input.limit,
			})

			const total = await instancePrisma.facilityLog.count({ where })

			console.log("✅ LOGS ROUTER - Found", total, "facility logs")

			return {
				success: true,
				message: "Facility logs fetched successfully",
				data: {
					logs,
					total,
					page: input.page,
					limit: input.limit,
					totalPages: Math.ceil(total / input.limit),
				},
			}
		} catch (error) {
			console.error("❌ LOGS ROUTER ERROR:", error)
			return {
				success: false,
				message: "Failed to fetch facility logs",
				data: null,
			}
		}
	})

console.log("🚀 LOGS ROUTER MODULE LOADED")

export const logsRouter = createTRPCRouter({
	getFacilityLogs,
})