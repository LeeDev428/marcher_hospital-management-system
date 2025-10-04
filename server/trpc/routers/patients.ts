import { createTRPCRouter, publicProcedure } from "../init"

export const patientsRouter = createTRPCRouter({
	// Stub - will implement later to call Express backend
	getPatients: publicProcedure.query(() => ({ success: true, data: [] }))
})