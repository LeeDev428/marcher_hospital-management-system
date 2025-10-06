import { createTRPCRouter } from "../init"
import { authRouter } from "./auth"
import { facilitiesRouter } from "./facilities"
import { patientsRouter } from "./patients"
import { appointmentsRouter } from "./appointments"
import { staffRouter } from "./staff/index"
import { logsRouter } from "./logs"
import { billingRouter } from "./billing"
import { healthRouter } from "./health"
import { dashboardRouter } from "./dashboard"
import { usersRouter } from "./users"
import { scheduleRouter } from "./schedule"
import { medicalServicesRouter } from "./medical-services"

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
	dashboard: dashboardRouter,
	users: usersRouter,
	schedule: scheduleRouter,
	medicalServices: medicalServicesRouter,
})

export type AppRouter = typeof appRouter