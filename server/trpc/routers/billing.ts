import { createTRPCRouter, publicProcedure } from "../init"

export const billingRouter = createTRPCRouter({
	// Stub - will implement later to call Express backend
	getBilling: publicProcedure.query(() => ({ success: true, data: [] }))
})