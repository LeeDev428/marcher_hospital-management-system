import { createTRPCRouter, publicProcedure } from "../init"

export const staffRouter = createTRPCRouter({
	// Stub - will implement later to call Express backend
	getStaff: publicProcedure.query(() => ({ success: true, data: [] }))
})