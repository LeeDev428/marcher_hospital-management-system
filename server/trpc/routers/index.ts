import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "../init"

// Health check router
const healthRouter = createTRPCRouter({
  check: publicProcedure.query(() => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      message: "Marcher HIS tRPC API is running"
    }
  })
})

// Basic auth router for testing
const authRouter = createTRPCRouter({
  test: publicProcedure
    .input(z.object({ message: z.string().optional() }))
    .query(({ input }) => {
      return {
        success: true,
        message: `Auth endpoint working! Input: ${input.message || "none"}`,
        timestamp: new Date().toISOString()
      }
    })
})

// Main application router - simplified to prevent circular dependencies
export const appRouter = createTRPCRouter({
  health: healthRouter,
  auth: authRouter
})

export type AppRouter = typeof appRouter