import { createTRPCNuxtHandler } from "trpc-nuxt/server"
import { z } from "zod"
import { initTRPC } from "@trpc/server"

// Simple TRPC setup without complex dependencies
const t = initTRPC.create()

const simpleRouter = t.router({
	health: t.procedure.query(() => {
		return { status: "ok", timestamp: new Date().toISOString() }
	}),
	echo: t.procedure
		.input(z.object({ message: z.string() }))
		.query(({ input }) => {
			return { echo: input.message }
		}),
})

export default createTRPCNuxtHandler({
	endpoint: "/api/trpc",
	router: simpleRouter,
	createContext: () => ({}),
})
