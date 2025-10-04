import { createTRPCRouter } from "../init"
import { authRouter } from "./auth"
import { facilitiesRouter } from "./facilities"
import { patientsRouter } from "./patients"
import { appointmentsRouter } from "./appointments"
import { staffRouter } from "./staff"
import { logsRouter } from "./logs"
import { billingRouter } from "./billing"
import { healthRouter } from "./health"

// Main application router that combines all feature routers
export const appRouter = createTRPCRouter({
	health: healthRouter,
	auth: authRouter,
	facilities: facilitiesRouter,
	patients: patientsRouter,
	appointments: appointmentsRouter,
	staff: staffRouter,
	logs: logsRouter,
	billing: billingRouter,
})

export type AppRouter = typeof appRouter