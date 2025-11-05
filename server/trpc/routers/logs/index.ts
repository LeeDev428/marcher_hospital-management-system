import { createTRPCRouter, protectedProcedure } from "../../init"
import { facilityLogsRouter } from "./facilityLogs"

const getLogs = protectedProcedure
	.query(async ({ ctx }) => {
		const { instancePrisma } = ctx
		try {
			const logs = await instancePrisma.log.findMany({
				orderBy: {
					timestamp: "desc",
				}
			})

			return {
				success: true,
				message: "Logs fetched successfully",
				data: logs,
			}
		} catch (error) {
			console.log(error)
			return {
				success: false,
				message: "Failed to fetch logs",
				data: null,
			}
		}
	})

export const logsRouter = createTRPCRouter({
	getLogs,
	facility: facilityLogsRouter,
})