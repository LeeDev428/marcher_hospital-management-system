import { z } from "zod"

// Day of week enum
export const dayOfWeekSchema = z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"])

// Time validation (HH:mm format)
const timeSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format. Use HH:mm")

// Staff schedule for a single day
export const dayScheduleSchema = z.object({
  day: dayOfWeekSchema,
  isAvailable: z.boolean().default(false),
  startTime: timeSchema.nullable(),
  endTime: timeSchema.nullable(),
})

// Full weekly schedule
export const weeklyScheduleSchema = z.object({
  staffId: z.string(), // CUID of the staff member
  schedules: z.array(dayScheduleSchema),
})

// Create schedule input (for initial setup)
export const createScheduleSchema = z.object({
  staffId: z.string(),
  day: dayOfWeekSchema,
  isAvailable: z.boolean(),
  startTime: timeSchema.nullable(),
  endTime: timeSchema.nullable(),
})

// Update schedule input
export const updateScheduleSchema = createScheduleSchema.extend({
  id: z.string(), // Schedule record ID
})

// Get schedule input
export const getScheduleSchema = z.object({
  staffId: z.string().optional(),
  day: dayOfWeekSchema.optional(),
})

// Bulk update for entire week
export const bulkUpdateScheduleSchema = z.object({
  staffId: z.string(),
  schedules: z.array(z.object({
    day: dayOfWeekSchema,
    isAvailable: z.boolean(),
    startTime: timeSchema.nullable(),
    endTime: timeSchema.nullable(),
  })),
})

// Day options for UI
export const dayOptions = [
  { label: "Monday", value: "MONDAY" },
  { label: "Tuesday", value: "TUESDAY" },
  { label: "Wednesday", value: "WEDNESDAY" },
  { label: "Thursday", value: "THURSDAY" },
  { label: "Friday", value: "FRIDAY" },
  { label: "Saturday", value: "SATURDAY" },
  { label: "Sunday", value: "SUNDAY" },
]

// TypeScript types
export type DayOfWeek = z.infer<typeof dayOfWeekSchema>
export type DaySchedule = z.infer<typeof dayScheduleSchema>
export type WeeklySchedule = z.infer<typeof weeklyScheduleSchema>
export type CreateSchedule = z.infer<typeof createScheduleSchema>
export type UpdateSchedule = z.infer<typeof updateScheduleSchema>
export type GetSchedule = z.infer<typeof getScheduleSchema>
export type BulkUpdateSchedule = z.infer<typeof bulkUpdateScheduleSchema>
