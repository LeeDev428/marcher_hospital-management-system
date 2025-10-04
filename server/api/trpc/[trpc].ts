import { createTRPCNuxtHandler } from "trpc-nuxt/server"
import { appRouter } from "../../trpc/routers/index"
import { createTRPCContext } from "../../trpc/init"

export default createTRPCNuxtHandler({
	endpoint: "/api/trpc",
	router: appRouter,
	createContext: createTRPCContext,
})
