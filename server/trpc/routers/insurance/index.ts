import { createTRPCRouter } from "../../init"
import { insuranceProvidersRouter } from "./insuranceProviders"
import { insuranceClaimsRouter } from "./insuranceClaims"
import { insuranceClaimItemsRouter } from "./insuranceClaimItems"

export const insuranceRouter = createTRPCRouter({
	providers: insuranceProvidersRouter,
	claims: insuranceClaimsRouter,
	claimItems: insuranceClaimItemsRouter,
})