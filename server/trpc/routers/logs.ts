import { createTRPCRouter, publicProcedure } from "../init"

export const logsRouter = createTRPCRouter({
	// Stub - will implement later to call Express backend
	getLogs: publicProcedure.query(() => ({ success: true, data: [] }))
})