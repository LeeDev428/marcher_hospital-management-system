import { createTRPCRouter, publicProcedure } from "../init"

export const appointmentsRouter = createTRPCRouter({
	// Stub - will implement later to call Express backend
	getAppointments: publicProcedure.query(() => ({ success: true, data: [] }))
})