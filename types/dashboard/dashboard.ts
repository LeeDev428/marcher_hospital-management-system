import { z } from "zod"

export const dashboardStatsSchema = z.object({
  doctorId: z.string().uuid().optional(),
  facilityId: z.string().uuid().optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
})

export const appointmentsListSchema = z.object({
  doctorId: z.string().uuid().optional(),
  facilityId: z.string().uuid().optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
  status: z.enum(["PENDING", "SCHEDULED", "COMPLETED", "CANCELLED"]).optional(),
})

export const dashboardSummarySchema = z.object({
  todayAppointments: z.number(),
  todayPendingAppointments: z.number(), // Fixed: Added specific pending count for today
  thisMonthAppointments: z.number(),
  totalPatients: z.number(),
  todayByStatus: z.record(z.string(), z.number()),
})

export const appointmentByDateSchema = z.object({
  date: z.string().date(),
  count: z.number(),
})

export const dashboardDataSchema = z.object({
  summary: dashboardSummarySchema,
})

// Table appointment type for dashboard display
export const dashboardAppointmentSchema = z.object({
  id: z.string().uuid(),
  patientName: z.string(),
  doctorName: z.string(),
  status: z.enum(["PENDING", "SCHEDULED", "COMPLETED", "CANCELLED"]),
  date: z.string().date(),
  time: z.string(),
  patient: z.object({
    firstName: z.string(),
    lastName: z.string(),
    middleName: z.string().optional().nullable(),
    suffix: z.string().optional().nullable(),
  }),
  doctor: z.object({
    firstName: z.string(),
    lastName: z.string(),
    middleName: z.string().optional().nullable(),
    suffix: z.string().optional().nullable(),
  }),
  facility: z.object({
    id: z.string(),
    identifier: z.string(),
    building: z.object({
      name: z.string(),
    }),
  }),
})

// Export types
export type DashboardStats = z.infer<typeof dashboardStatsSchema>
export type AppointmentsList = z.infer<typeof appointmentsListSchema>
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>
export type AppointmentByDate = z.infer<typeof appointmentByDateSchema>
export type DashboardData = z.infer<typeof dashboardDataSchema>
export type DashboardAppointment = z.infer<typeof dashboardAppointmentSchema>