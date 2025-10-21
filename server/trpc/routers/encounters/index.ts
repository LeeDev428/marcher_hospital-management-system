import { createTRPCRouter } from "../../init"
import { inpatientEncountersRouter } from "./inpatientEncounters"
import { outpatientEncountersRouter } from "./outpatientEncounters"
import { particularCatalogueRouter } from "./particularCatalogue"

export const encountersRouter = createTRPCRouter({
	inpatient: inpatientEncountersRouter,
	outpatient: outpatientEncountersRouter,
	particulars: particularCatalogueRouter,
})
