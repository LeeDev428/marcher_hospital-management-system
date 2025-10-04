import { createTRPCRouter, publicProcedure } from "../init"

export const healthRouter = createTRPCRouter({
	check: publicProcedure.query(() => {
		return {
			status: "ok",
			timestamp: new Date().toISOString(),
			message: "Marcher HIS tRPC API is running"
		}
	})
})