import { createTRPCRouter } from "../init"

// Simple health check router to start with
export const tempRouter = createTRPCRouter({
  health: createTRPCRouter({
    check: protectedProcedure.query(() => {
      return { status: "ok", timestamp: new Date().toISOString() }
    })
  })
})

// Basic auth router
const authRouter = createTRPCRouter({
  login: protectedProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(() => {
      return { success: true, message: "Login endpoint" }
    })
})

// Export minimal router to prevent circular dependency
export const appRouter = createTRPCRouter({
  auth: authRouter,
  health: tempRouter
})

export type AppRouter = typeof appRouter