import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../../init"
import {
  createAppointmentSchema,
  deleteAppointmentSchema,
  getAppointmentSchema,
  updateAppointmentSchema,
  createPatientAppointmentSchema,
  updatePatientAppointmentSchema,
  assignRoomSchema,
  updateAppointmentStatusSchema,
  getAppointmentsSchema,
  getPatientAppointmentsSchema,
  checkAvailabilitySchema,
  getAvailableTimeSlotsSchema,
} from "@/types/appointments"

// --- Helpers ---
const generateTimeSlots = () => {
  const slots: string[] = []
  for (let hour = 8; hour < 12; hour++)
    for (let m = 0; m < 60; m += 20)
      slots.push(`${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
  for (let hour = 13; hour < 18; hour++)
    for (let m = 0; m < 60; m += 20)
      slots.push(`${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
  return slots
}

const isWithinOfficeHours = (time: string): boolean => {
  const [h, m] = time.split(":").map(Number)
  const t = h * 60 + m
  const morning = t >= 480 && t < 720
  const afternoon = t >= 780 && t < 1080
  return morning || afternoon
}

// Helper: safely resolve the current patient's profile
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
async function getCurrentPatientOrNull(instancePrisma: any, user: any) {
  if (!user) return null

  // Prefer explicit mapping when available (set this in your auth if possible)
  if (user.patientProfileId && UUID_RE.test(user.patientProfileId)) {
    return instancePrisma.patientProfile.findUnique({ where: { id: user.patientProfileId } })
  }

  // Fallback: if user.id already equals PatientProfile.id (UUID), use it
  if (typeof user.id === "string" && UUID_RE.test(user.id)) {
    return instancePrisma.patientProfile.findUnique({ where: { id: user.id } })
  }

  // No reliable mapping
  return null
}

// helper (put near the top of the file)
function pickName(user: any) {
  const first = user?.firstName || user?.given_name || user?.name?.split(" ")?.[0] || "Unknown"
  const last  = user?.lastName  || user?.family_name || user?.name?.split(" ")?.slice(1).join(" ") || "User"
  return { firstName: String(first).trim() || "Unknown", lastName: String(last).trim() || "User" }
}

async function ensurePatientProfile(prisma: any, user: any) {
  if (!user?.id) return null
  const { firstName, lastName } = pickName(user)

  // requires PatientProfile.userId @unique
  const profile = await prisma.patientProfile.upsert({
    where: { id: "005f0894-b05f-4c9a-a094-63e0d2fbc439" },
    update: {}, // nothing to update for now
    create: { id: "005f0894-b05f-4c9a-a094-63e0d2fbc439", firstName, lastName },
  })
  return profile
}

// === STAFF ===
const getAppointments = protectedProcedure
  .input(getAppointmentsSchema)
  .query(async ({ ctx, input }) => {
    const { instancePrisma, globalPrisma } = ctx
    const { doctorId, facilityId, date, status, page, limit } = input
    try {
      const where: any = {}
      if (doctorId) where.doctorId = doctorId
      if (facilityId) where.facilityId = facilityId
      if (date) where.date = date
      if (status) where.status = status

      const total = await instancePrisma.appointment.count({ where })
      const appointments = await instancePrisma.appointment.findMany({
        where,
        include: {
          patient: true,
          facility: { include: { building: true } },
        },
        orderBy: [{ date: "desc" }, { time: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      })

      const staffProfiles = await globalPrisma.staffProfile.findMany({
        select: { id: true, firstName: true, lastName: true, middleName: true, suffix: true },
        where: { id: { in: appointments.map((a: any) => a.doctorId) }, role: "DOCTOR" },
      })

      const withDoctors = appointments.map((a: any) => {
        const d = staffProfiles.find((s: any) => s.id === a.doctorId)
        return {
          ...a,
          doctor: {
            firstName: d?.firstName || "",
            lastName: d?.lastName || "",
            middleName: d?.middleName || "",
            suffix: d?.suffix || "",
          },
        }
      })

      return {
        success: true,
        message: "Appointments fetched successfully.",
        data: { appointments: withDoctors, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
      }
    } catch (error) {
      console.log(error)
      return { success: false, message: "Failed to fetch appointments.", data: null }
    }
  })

const getAppointment = protectedProcedure
  .input(getAppointmentSchema)
  .query(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id } = input
    try {
      const appointment = await instancePrisma.appointment.findUnique({
        where: { id },
        include: { patient: true, facility: { include: { building: true } } },
      })
      if (!appointment) return { success: false, message: "Appointment not found.", data: null }
      return { success: true, message: "Appointment fetched successfully.", data: appointment }
    } catch (error) {
      console.log(error)
      return { success: false, message: "Failed to fetch appointment.", data: null }
    }
  })

const createAppointment = protectedProcedure
  .input(createAppointmentSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { patientId, doctorId, facilityId, date, time, status } = input
    try {
      if (!isWithinOfficeHours(time)) {
        return {
          success: false,
          message:
            "Appointment time must be within office hours (8:00 AM - 6:00 PM, excluding lunch 12:00 PM - 1:00 PM).",
          data: null,
        }
      }
      const existing = await instancePrisma.appointment.findFirst({
        where: { doctorId, date, time, status: { in: ["PENDING", "SCHEDULED"] } },
      })
      if (existing) return { success: false, message: "Already booked. This time slot is not available.", data: null }

      // Staff booking: write ONLY to Appointment
      const appointment = await instancePrisma.appointment.create({
        data: { patientId, doctorId, facilityId, date, time, status },
      })
      return { success: true, message: "Appointment created successfully.", data: appointment }
    } catch (error) {
      console.log(error)
      return { success: false, message: "Failed to create appointment.", data: null }
    }
  })

const updateAppointment = protectedProcedure
  .input(updateAppointmentSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id, patientId, doctorId, facilityId, date, time, status } = input
    try {
      if (!isWithinOfficeHours(time)) {
        return {
          success: false,
          message:
            "Appointment time must be within office hours (8:00 AM - 6:00 PM, excluding lunch 12:00 PM - 1:00 PM).",
          data: null,
        }
      }
      const conflict = await instancePrisma.appointment.findFirst({
        where: {
          doctorId,
          date,
          time,
          id: { not: id },
          status: { in: ["PENDING", "SCHEDULED"] },
        },
      })
      if (conflict) {
        return { success: false, message: "Already booked. This time slot is not available.", data: null }
      }

      const appointment = await instancePrisma.appointment.update({
        where: { id },
        data: { patientId, doctorId, facilityId, date, time, status },
      })

      // If there is a linked PatientAppointment, keep its status in sync
      await instancePrisma.patientAppointment.updateMany({
        where: { appointmentId: id },
        data: { status },
      })

      return { success: true, message: "Appointment updated successfully.", data: appointment }
    } catch (error) {
      console.log(error)
      return { success: false, message: "Failed to update appointment.", data: null }
    }
  })

const deleteAppointment = protectedProcedure
  .input(deleteAppointmentSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id } = input
    try {
      const appointment = await instancePrisma.appointment.delete({ where: { id } })
      // If a patient row exists, unlink it (keep history) by clearing the pointer
      await instancePrisma.patientAppointment.updateMany({
        where: { appointmentId: id },
        data: { appointmentId: null },
      })
      return { success: true, message: "Appointment deleted successfully.", data: appointment }
    } catch (error) {
      console.log(error)
      return { success: false, message: "Failed to delete appointment.", data: null }
    }
  })

// Room assignment
const assignRoom = protectedProcedure
  .input(assignRoomSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id, facilityId } = input
    try {
      const base = await instancePrisma.appointment.findUnique({ where: { id } })
      if (!base) return { success: false, message: "Appointment not found.", data: null }

      const conflict = await instancePrisma.appointment.findFirst({
        where: {
          facilityId,
          date: base.date,
          time: base.time,
          id: { not: id },
          status: { in: ["PENDING", "SCHEDULED"] },
        },
      })
      if (conflict) return { success: false, message: "Room is not available at this time slot.", data: null }

      const updated = await instancePrisma.appointment.update({
        where: { id },
        data: { facilityId },
        include: { facility: { include: { building: true } } },
      })
      return { success: true, message: "Room assigned successfully.", data: updated }
    } catch (error) {
      console.log(error)
      return { success: false, message: "Failed to assign room.", data: null }
    }
  })

const updateAppointmentStatus = protectedProcedure
  .input(updateAppointmentStatusSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id, status } = input
    try {
      const appointment = await instancePrisma.appointment.update({ where: { id }, data: { status } })
      await instancePrisma.patientAppointment.updateMany({
        where: { appointmentId: id },
        data: { status },
      })
      return { success: true, message: "Appointment status updated successfully.", data: appointment }
    } catch (error) {
      console.log(error)
      return { success: false, message: "Failed to update appointment status.", data: null }
    }
  })

// === PATIENT ===
const getPatientAppointments = protectedProcedure
  .input(getPatientAppointmentsSchema)
  .query(async ({ ctx, input }) => {
    const { instancePrisma, globalPrisma, user } = ctx
    const { doctorId, date, status, page, limit } = input
    try {
      const currentPatient = await getCurrentPatientOrNull(instancePrisma, user)
      if (!currentPatient) return { success: false, message: "Patient profile not found.", data: null }

      const where: any = { patientId: currentPatient.id }
      if (doctorId) where.doctorId = doctorId
      if (date) where.date = date
      if (status) where.status = status

      const total = await instancePrisma.appointment.count({ where })
      const appointments = await instancePrisma.appointment.findMany({
        where,
        include: { patient: true, facility: { include: { building: true } } },
        orderBy: [{ date: "desc" }, { time: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      })

      const staffProfiles = await globalPrisma.staffProfile.findMany({
        select: { id: true, firstName: true, lastName: true, middleName: true, suffix: true },
        where: { id: { in: appointments.map((a: any) => a.doctorId) }, role: "DOCTOR" },
      })

      const withDoctors = appointments.map((a: any) => {
        const d = staffProfiles.find((s: any) => s.id === a.doctorId)
        return {
          ...a,
          doctor: {
            firstName: d?.firstName || "",
            lastName: d?.lastName || "",
            middleName: d?.middleName || "",
            suffix: d?.suffix || "",
          },
        }
      })

      return {
        success: true,
        message: "Patient appointments fetched successfully.",
        data: { appointments: withDoctors, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
      }
    } catch (error) {
      console.log(error)
      return { success: false, message: "Failed to fetch patient appointments.", data: null }
    }
  })

const getPatientAppointment = protectedProcedure
  .input(getAppointmentSchema)
  .query(async ({ ctx, input }) => {
    const { instancePrisma, user } = ctx
    const { id } = input
    try {
      const currentPatient = await getCurrentPatientOrNull(instancePrisma, user)
      if (!currentPatient) return { success: false, message: "Patient profile not found.", data: null }

      const appointment = await instancePrisma.appointment.findFirst({
        where: { id, patientId: currentPatient.id },
        include: { patient: true, facility: { include: { building: true } } },
      })
      if (!appointment) return { success: false, message: "Appointment not found or access denied.", data: null }
      return { success: true, message: "Patient appointment fetched successfully.", data: appointment }
    } catch (error) {
      console.log(error)
      return { success: false, message: "Failed to fetch patient appointment.", data: null }
    }
  })

const createPatientAppointment = publicProcedure
  .input(createPatientAppointmentSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma, user } = ctx
    const { doctorId, date, time, name } = input

    try {
      // 👇 auto-create profile if missing (returns the profile either way)
      const currentPatient = await ensurePatientProfile(instancePrisma, user)
      if (!currentPatient) {
        return { success: false, message: "Not authenticated.", data: null }
      }

      // office hours + conflict checks (unchanged)
      const [h, m] = time.split(":").map(Number)
      const t = h * 60 + m
      const inHours = (t >= 480 && t < 720) || (t >= 780 && t < 1080)
      if (!inHours) {
        return { success: false, message: "Appointment time must be within office hours (8:00–18:00, excluding 12:00–13:00).", data: null }
      }

      const exists = await instancePrisma.appointment.findFirst({
        where: { doctorId, date, time, status: { in: ["PENDING", "SCHEDULED"] } },
      })
      if (exists) return { success: false, message: "Already booked. This time slot is not available.", data: null }

      // save (atomically create both, if you keep a PatientAppointment mirror)
      const appointment = await instancePrisma.$transaction(async (tx: any) => {
        const apt = await tx.appointment.create({
          data: {
            patientId: currentPatient.id,
            doctorId,
            date,
            time,
            status: "PENDING",
            facilityId: null, // assign later by staff
          },
        })

        // if you have PatientAppointment table, keep this; otherwise remove this block
        if (tx.patientAppointment) {
          await tx.patientAppointment.create({
            data: {
              patientId: currentPatient.id,
              doctorId,
              date,
              time,
              status: "PENDING",
              name: name ?? null,
              appointmentId: apt.id,
            },
          })
        }

        return apt
      })

      return {
        success: true,
        message: "Appointment booked successfully. Status is PENDING until staff confirm.",
        data: appointment,
      }
    } catch (error) {
      console.error(error)
      return { success: false, message: "Failed to book appointment.", data: null }
    }
  })

const cancelPatientAppointment = protectedProcedure
  .input(updatePatientAppointmentSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma, user } = ctx
    const { id } = input
    try {
      const currentPatient = await getCurrentPatientOrNull(instancePrisma, user)
      if (!currentPatient) return { success: false, message: "Patient profile not found.", data: null }

      const existing = await instancePrisma.appointment.findUnique({ where: { id } })
      if (!existing || existing.patientId !== currentPatient.id) {
        return { success: false, message: "Appointment not found or access denied.", data: null }
      }
      if (!["PENDING", "SCHEDULED"].includes(existing.status)) {
        return { success: false, message: "This appointment cannot be cancelled.", data: null }
      }

      const appointment = await instancePrisma.$transaction(async (tx: any) => {
        const apt = await tx.appointment.update({ where: { id }, data: { status: "CANCELLED" } })
        await tx.patientAppointment.updateMany({
          where: { appointmentId: id },
          data: { status: "CANCELLED" },
        })
        return apt
      })

      return { success: true, message: "Appointment cancelled successfully.", data: appointment }
    } catch (error) {
      console.log(error)
      return { success: false, message: "Failed to cancel appointment.", data: null }
    }
  })

// === SHARED ===
const getAvailableRooms = protectedProcedure
  .input(z.object({ timestamp: z.string().datetime(), excludeAppointmentId: z.string().uuid().optional() }))
  .query(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { timestamp, excludeAppointmentId } = input
    const date = timestamp.split("T")[0]
    const time = timestamp.split("T")[1].slice(0, 5)

    try {
      const clinicRooms = await instancePrisma.room.findMany({
        where: { type: "CLINIC", status: "AVAILABLE" },
        include: { building: true },
      })

      const existing = await instancePrisma.appointment.findMany({
        where: { date, time, ...(excludeAppointmentId ? { id: { not: excludeAppointmentId } } : {}) },
        select: { facilityId: true },
      })

      const occupied = existing.map((a: any) => a.facilityId).filter(Boolean) as string[]
      const available = clinicRooms.filter((r: any) => !occupied.includes(r.id))

      return { success: true, message: "Available rooms fetched successfully.", data: available }
    } catch (error) {
      console.log(error)
      return { success: false, message: "Failed to fetch available rooms.", data: null }
    }
  })

const checkAvailability = publicProcedure
  .input(checkAvailabilitySchema)
  .query(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { doctorId, date, time, excludeAppointmentId } = input
    try {
      if (!isWithinOfficeHours(time)) {
        return {
          success: true,
          message: "Time slot checked.",
          data: { available: false, reason: "Outside office hours (8:00 AM - 6:00 PM, excluding lunch 12:00 PM - 1:00 PM)" },
        }
      }
      const existing = await instancePrisma.appointment.findFirst({
        where: {
          doctorId,
          date,
          time,
          ...(excludeAppointmentId ? { id: { not: excludeAppointmentId } } : {}),
          status: { in: ["PENDING", "SCHEDULED"] },
        },
      })
      if (existing) {
        return { success: true, message: "Time slot checked.", data: { available: false, reason: "Already booked" } }
      }
      return { success: true, message: "Time slot checked.", data: { available: true, reason: "Available" } }
    } catch (error) {
      console.log(error)
      return { success: false, message: "Failed to check availability.", data: null }
    }
  })

const getAvailableTimeSlots = publicProcedure
  .input(getAvailableTimeSlotsSchema)
  .query(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { doctorId, date } = input
    try {
      const existing = await instancePrisma.appointment.findMany({
        where: { doctorId, date, status: { in: ["PENDING", "SCHEDULED"] } },
        select: { time: true },
      })
      const booked = new Set(existing.map((a: any) => a.time))
      const all = generateTimeSlots()

      const today = new Date()
      const isToday = today.toISOString().slice(0, 10) === date
      const nowMin = today.getHours() * 60 + today.getMinutes()

      const timeSlots = all.map((t) => {
        const [h, m] = t.split(":").map(Number)
        const mins = h * 60 + m
        let available = !booked.has(t)
        let reason = "Available"
        if (isToday && mins <= nowMin) {
          available = false
          reason = "Time has passed"
        }
        if (booked.has(t)) {
          available = false
          reason = "Already booked"
        }
        return { time: t, available, reason }
      })
      const isFullyBooked = timeSlots.filter((s) => s.available).length === 0
      return { success: true, message: "Available time slots fetched successfully.", data: { date, timeSlots, isFullyBooked } }
    } catch (error) {
      console.log(error)
      return { success: false, message: "Failed to fetch available time slots.", data: null }
    }
  })

export const appointmentsRouter = createTRPCRouter({
  // Staff
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  assignRoom,
  updateAppointmentStatus,

  // Patient
  getPatientAppointments,
  getPatientAppointment,
  createPatientAppointment,
  cancelPatientAppointment,

  // Shared
  getAvailableRooms,
  checkAvailability,
  getAvailableTimeSlots,
})
