import { createTRPCRouter } from "@/server/trpc/init"
import { patientProfilesRouter } from "@/server/trpc/routers/patients/patientProfiles"

export const patientsRouter = createTRPCRouter({
	profiles: patientProfilesRouter,
})