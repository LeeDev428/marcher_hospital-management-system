import { createTRPCRouter, publicProcedure, protectedProcedure } from "../init"
import {
  createScheduleSchema,
  updateScheduleSchema,
  getScheduleSchema,
  bulkUpdateScheduleSchema,
  dayOfWeekSchema,
} from "@/types/schedule"

// Get staff schedule (weekly)
const getSchedule = publicProcedure
  .input(getScheduleSchema)
  .query(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { staffId, day } = input

    try {
      const where: any = {}
      if (staffId) where.staffId = staffId
      if (day) where.day = day

      const schedules = await instancePrisma.staffSchedule.findMany({
        where,
        orderBy: {
          day: 'asc'
        }
      })

      return {
        success: true,
        message: "Schedule retrieved successfully.",
        data: schedules,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to fetch schedule.",
        data: null,
      }
    }
  })

// Create single day schedule
const createSchedule = publicProcedure
  .input(createScheduleSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { staffId, day, isAvailable, startTime, endTime } = input

    try {
      // Check if schedule already exists
      const existing = await instancePrisma.staffSchedule.findFirst({
        where: { staffId, day }
      })

      if (existing) {
        return {
          success: false,
          message: "Schedule for this day already exists. Use update instead.",
          data: null,
        }
      }

      const schedule = await instancePrisma.staffSchedule.create({
        data: {
          staffId,
          day,
          isAvailable,
          startTime,
          endTime,
        }
      })

      return {
        success: true,
        message: "Schedule created successfully.",
        data: schedule,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to create schedule.",
        data: null,
      }
    }
  })

// Update single day schedule
const updateSchedule = publicProcedure
  .input(updateScheduleSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id, day, isAvailable, startTime, endTime } = input

    try {
      const schedule = await instancePrisma.staffSchedule.update({
        where: { id },
        data: {
          day,
          isAvailable,
          startTime,
          endTime,
        }
      })

      return {
        success: true,
        message: "Schedule updated successfully.",
        data: schedule,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to update schedule.",
        data: null,
      }
    }
  })

// Bulk update/create entire week schedule
const bulkUpdateSchedule = publicProcedure
  .input(bulkUpdateScheduleSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { staffId, schedules } = input

    try {
      console.log('=== BULK UPDATE SCHEDULE ===')
      console.log('Staff ID:', staffId)
      console.log('Schedules received:', JSON.stringify(schedules, null, 2))
      
      // Delete existing schedules for this staff member
      await instancePrisma.staffSchedule.deleteMany({
        where: { staffId }
      })

      // Create all new schedules
      const createdSchedules = await Promise.all(
        schedules.map(schedule => {
          console.log(`Creating schedule for ${schedule.day}: isAvailable=${schedule.isAvailable}`)
          return instancePrisma.staffSchedule.create({
            data: {
              staffId,
              day: schedule.day,
              isAvailable: schedule.isAvailable,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
            }
          })
        })
      )
      
      console.log('Created schedules:', createdSchedules.length)

      return {
        success: true,
        message: "Weekly schedule updated successfully.",
        data: createdSchedules,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to update weekly schedule.",
        data: null,
      }
    }
  })

// Delete schedule
const deleteSchedule = publicProcedure
  .input(getScheduleSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { staffId, day } = input

    try {
      if (!staffId || !day) {
        return {
          success: false,
          message: "Staff ID and day are required.",
          data: null,
        }
      }

      await instancePrisma.staffSchedule.deleteMany({
        where: { staffId, day }
      })

      return {
        success: true,
        message: "Schedule deleted successfully.",
        data: null,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to delete schedule.",
        data: null,
      }
    }
  })

// Check staff availability for a specific day and time
const checkStaffAvailability = publicProcedure
  .input(getScheduleSchema.extend({
    time: createScheduleSchema.shape.startTime,
  }))
  .query(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { staffId, day, time } = input

    if (!staffId || !day || !time) {
      return {
        success: false,
        message: "Staff ID, day, and time are required.",
        data: { available: false, reason: "Missing parameters" },
      }
    }

    try {
      const schedule = await instancePrisma.staffSchedule.findFirst({
        where: { staffId, day }
      })

      if (!schedule || !schedule.isAvailable) {
        return {
          success: true,
          message: "Staff is not available on this day.",
          data: { available: false, reason: "Not scheduled for this day" },
        }
      }

      // Check if time falls within schedule
      if (schedule.startTime && schedule.endTime && time) {
        const [reqHour, reqMin] = time.split(':').map(Number)
        const [startHour, startMin] = schedule.startTime.split(':').map(Number)
        const [endHour, endMin] = schedule.endTime.split(':').map(Number)

        const reqMinutes = reqHour * 60 + reqMin
        const startMinutes = startHour * 60 + startMin
        const endMinutes = endHour * 60 + endMin

        if (reqMinutes >= startMinutes && reqMinutes < endMinutes) {
          return {
            success: true,
            message: "Staff is available.",
            data: { available: true, schedule },
          }
        } else {
          return {
            success: true,
            message: "Time is outside of scheduled hours.",
            data: { 
              available: false, 
              reason: `Staff hours: ${schedule.startTime} - ${schedule.endTime}` 
            },
          }
        }
      }

      return {
        success: true,
        message: "Staff availability confirmed.",
        data: { available: true, schedule },
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to check availability.",
        data: { available: false, reason: "Error checking schedule" },
      }
    }
  })

export const scheduleRouter = createTRPCRouter({
  getSchedule,
  createSchedule,
  updateSchedule,
  bulkUpdateSchedule,
  deleteSchedule,
  checkStaffAvailability,
})
