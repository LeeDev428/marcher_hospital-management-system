import { createTRPCRouter, protectedProcedure } from "@/server/trpc/init"
import { z } from "zod"

// Validation schemas for audit trail
const getLogsSchema = z.object({}) // no input for now
const addLogSchema = z.object({
  user: z.string(),
  role: z.string(),
  action: z.string(),
  roomIdentifier: z.string(),
  type: z.string(),
  oldStatus: z.string().optional(),
  newStatus: z.string().optional(),
})

/**
 * GET: Fetch all facility logs (Audit Trail)
 */
const getFacilityLogs = protectedProcedure
  .input(getLogsSchema.optional())
  .query(async ({ ctx }) => {
    const { instancePrisma } = ctx

    try {
      const logs = await instancePrisma.facilityLog.findMany({
        orderBy: { timestamp: "desc" },
      })

      return {
        success: true,
        message: "Facility logs fetched successfully.",
        data: logs,
      }
    } catch (error) {
      console.log(error)
      return {
        success: false,
        message: "Failed to fetch facility logs.",
        data: null,
      }
    }
  })

/**
 * POST: Add a new log entry (used by Facilities & Appointments)
 */
const addFacilityLog = protectedProcedure
  .input(addLogSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx

    try {
      const newLog = await instancePrisma.facilityLog.create({
        data: {
          ...input,
          timestamp: new Date(), // auto set timestamp
        },
      })

      return {
        success: true,
        message: "Facility log added successfully.",
        data: newLog,
      }
    } catch (error) {
      console.log(error)
      return {
        success: false,
        message: "Failed to add facility log.",
        data: null,
      }
    }
  })

// Export router
export const facilityLogRouter = createTRPCRouter({
  getFacilityLogs,
  addFacilityLog,
})
