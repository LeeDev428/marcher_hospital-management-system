import { createTRPCRouter } from "../init"
import { authRouter } from "./auth"
import { patientsRouter } from "./patients"
import { facilitiesRouter } from "./facilities"
import { appointmentsRouter } from "./appointments"
import { staffRouter } from "./staff"
import { pharmacyRouter } from "./pharmacy"
import { encountersRouter } from "./encounters"
import { filesRouter } from "./files"
import { insuranceRouter } from "./insurance"
import { billingRouter } from "./billing"
import { dashboardRouter } from "./dashboard"
import { facilityLogRouter } from "./facilities/facilityLogRouter"
import { logsRouter } from "./logs"
import { medicalRecordsRouter } from "./medical-records"


export const appRouter = createTRPCRouter({
	auth: authRouter,
	patients: patientsRouter,
	facilities: facilitiesRouter,
	appointments: appointmentsRouter,
	staff: staffRouter,
	pharmacy: pharmacyRouter,
	encounters: encountersRouter,
	files: filesRouter,
	insurance: insuranceRouter,
	billing: billingRouter,
	dashboard: dashboardRouter,
	facilityLogs: facilityLogRouter, // Add facility log router here
	logs: logsRouter,
	medicalRecords: medicalRecordsRouter, // Add medical records router here
})

export type AppRouter = typeof appRouter