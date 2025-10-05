import { z } from "zod"

/* ---------- Normalizers ---------- */

// Accept "YYYY-MM-DD" or "DD/MM/YYYY" (or "DD-MM-YYYY"), output "YYYY-MM-DD"
const normalizeDate = (input: unknown) => {
  if (typeof input !== "string") return input
  const s = input.trim()

  // already ISO "YYYY-MM-DD"
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s

  // "DD/MM/YYYY" or "DD-MM-YYYY"
  const m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/)
  if (m) {
    const d = m[1].padStart(2, "0")
    const mo = m[2].padStart(2, "0")
    const y = m[3]
    return `${y}-${mo}-${d}`
  }

  return s
}

// Accept "HH:mm", "H:mm", or "hh:mm am/pm", output "HH:mm" (24h)
const normalizeTime = (input: unknown) => {
  if (typeof input !== "string") return input
  let s = input.trim()

  // "hh:mm am/pm"
  const ampm = s.match(/^(\d{1,2}):(\d{2})\s*([ap]m)$/i)
  if (ampm) {
    let h = parseInt(ampm[1], 10)
    const m = ampm[2]
    const ap = ampm[3].toLowerCase()
    if (ap === "pm" && h < 12) h += 12
    if (ap === "am" && h === 12) h = 0
    return `${String(h).padStart(2, "0")}:${m}`
  }

  // "H:mm" or "HH:mm"
  const hm = s.match(/^(\d{1,2}):(\d{2})$/)
  if (hm) return `${hm[1].padStart(2, "0")}:${hm[2]}`

  return s
}

const dateString = z.preprocess(
  normalizeDate,
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD.")
)

const timeString = z.preprocess(
  normalizeTime,
  z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format. Use HH:mm.")
)

/* ---------- Status ---------- */

export const appointmentStatusSchema = z.enum([
  "PENDING",
  "SCHEDULED",
  "CANCELLED",
  "COMPLETED",
])

export const appointmentStatusOptions = appointmentStatusSchema.options.map((status) => ({
  label: status.charAt(0).toUpperCase() + status.slice(1),
  value: status,
}))

/* ---------- ID Validation ---------- */

// CUID validation schema (for Prisma default IDs)
const cuidSchema = z.string().regex(/^c[a-z0-9]{24}$/, "Invalid ID format.")

/* ---------- Core Schemas ---------- */

// Base appointment schema
export const appointmentSchema = z.object({
  patientId: cuidSchema,
  doctorId: cuidSchema,
  facilityId: z.string().uuid("Invalid facility ID.").optional(), // Optional for patients initially
  date: dateString,
  time: timeString,
  status: appointmentStatusSchema,
})

export const getAppointmentSchema = z.object({
  id: z.string().uuid("Invalid appointment ID."),
})

// Staff get appointments schema (full access)
export const getAppointmentsSchema = z.object({
  doctorId: cuidSchema.optional(),
  facilityId: z.string().uuid("Invalid facility ID.").optional(),
  date: dateString.optional(),
  status: appointmentStatusSchema.optional(),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
})

// Patient get appointments schema (filtered by current patient)
export const getPatientAppointmentsSchema = z.object({
  doctorId: cuidSchema.optional(),
  date: dateString.optional(),
  status: appointmentStatusSchema.optional(),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
})

export const appointmentFiltersSchema = z.object({
  doctorId: cuidSchema.optional(),
  facilityId: z.string().uuid("Invalid facility ID.").optional(),
  date: dateString.optional(),
  status: appointmentStatusSchema.optional(),
})

// Patient appointment filters (no facility filter)
export const patientAppointmentFiltersSchema = z.object({
  doctorId: cuidSchema.optional(),
  date: dateString.optional(),
  status: appointmentStatusSchema.optional(),
})

// Availability check supports excluding current appointment while editing
export const checkAvailabilitySchema = z.object({
  doctorId: cuidSchema,
  date: dateString,
  time: timeString,
  excludeAppointmentId: z.string().uuid().optional(),
})

export const getAvailableTimeSlotsSchema = z.object({
  doctorId: cuidSchema,
  date: dateString,
})

export const timeSlotSchema = z.object({
  time: timeString,
  available: z.boolean(),
  reason: z.string().optional(),
})

export const availabilityResponseSchema = z.object({
  date: dateString,
  timeSlots: z.array(timeSlotSchema),
  isFullyBooked: z.boolean(),
})

export const tableAppointmentSchema = appointmentSchema.extend({
  id: z.string().uuid("Invalid appointment ID."),
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
  facility: z
    .object({
      id: z.string(),
      identifier: z.string(),
      type: z.string(),
      building: z.object({ name: z.string() }),
    })
    .optional()
    .nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// Staff create/update
export const createAppointmentSchema = appointmentSchema
export const updateAppointmentSchema = appointmentSchema.extend({
  id: z.string().uuid("Invalid appointment ID."),
})

// Patient create/cancel
export const createPatientAppointmentSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  doctorId: cuidSchema,
  date: dateString,
  time: timeString,
})

export const updatePatientAppointmentSchema = z.object({
  id: z.string().uuid("Invalid appointment ID."),
  status: z.literal("CANCELLED"),
})

// Assign & status
export const assignRoomSchema = z.object({
  id: z.string().uuid("Invalid appointment ID."),
  facilityId: z.string().uuid("Invalid facility ID."),
})

export const updateAppointmentStatusSchema = z.object({
  id: z.string().uuid("Invalid appointment ID."),
  status: appointmentStatusSchema,
})

export const deleteAppointmentSchema = z.object({
  id: z.string().uuid("Invalid appointment ID."),
})

/* ---------- Types ---------- */
export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>
export type Appointment = z.infer<typeof appointmentSchema>
export type GetAppointment = z.infer<typeof getAppointmentSchema>
export type TableAppointment = z.infer<typeof tableAppointmentSchema>
export type CreateAppointment = z.infer<typeof createAppointmentSchema>
export type UpdateAppointment = z.infer<typeof updateAppointmentSchema>
export type CreatePatientAppointment = z.infer<typeof createPatientAppointmentSchema>
export type UpdatePatientAppointment = z.infer<typeof updatePatientAppointmentSchema>
export type DeleteAppointment = z.infer<typeof deleteAppointmentSchema>
export type GetAppointments = z.infer<typeof getAppointmentsSchema>
export type GetPatientAppointments = z.infer<typeof getPatientAppointmentsSchema>
export type AppointmentFilters = z.infer<typeof appointmentFiltersSchema>
export type PatientAppointmentFilters = z.infer<typeof patientAppointmentFiltersSchema>
export type CheckAvailability = z.infer<typeof checkAvailabilitySchema>
export type GetAvailableTimeSlots = z.infer<typeof getAvailableTimeSlotsSchema>
export type TimeSlot = z.infer<typeof timeSlotSchema>
export type AvailabilityResponse = z.infer<typeof availabilityResponseSchema>
export type AssignRoom = z.infer<typeof assignRoomSchema>
export type UpdateAppointmentStatus = z.infer<typeof updateAppointmentStatusSchema>
