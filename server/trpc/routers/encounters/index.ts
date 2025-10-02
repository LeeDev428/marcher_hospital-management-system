import { createTRPCRouter } from "../../init"
import { inpatientEncountersRouter } from "./inpatientEncounters"
import { outpatientEncountersRouter } from "./outpatientEncounters"

export const encountersRouter = createTRPCRouter({
	inpatient: inpatientEncountersRouter,
	outpatient: outpatientEncountersRouter,
})
