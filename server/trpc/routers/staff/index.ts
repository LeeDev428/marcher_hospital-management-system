import { createTRPCRouter } from "../../init"
import { staffProfilesRouter } from "./staffProfiles"

export const staffRouter = createTRPCRouter({
	profiles: staffProfilesRouter,
})