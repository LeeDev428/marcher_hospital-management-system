import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../../init"
import { AppointmentStatus } from "@/prisma/generated/instance/client"
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
import { getCookie } from "h3"
import { verifyRefreshToken } from "@/util/token"

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

  // Look up patient by userId
  if (user.id) {
    const patient = await instancePrisma.patient.findUnique({ 
      where: { userId: user.id } 
    })
    if (patient) {
      console.log('✅ Found patient for user:', user.id, '-> patient:', patient.id)
      return patient
    }
  }

  console.log('❌ No patient found for user:', user.id)
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

  // Find or create patient profile based on userId
  let patient = await prisma.patient.findUnique({
    where: { userId: user.id },
  })
  
  // Auto-create patient profile if it doesn't exist
  if (!patient) {
    // Generate unique patient number (format: P + timestamp + random)
    const patientNumber = `P${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    
    patient = await prisma.patient.create({
      data: {
        userId: user.id,
        patientNumber,
      },
    })
    
    console.log('✅ Auto-created patient profile:', patientNumber)
  }
  
  return patient
}

// === STAFF ===
const getAppointments = publicProcedure
  .input(getAppointmentsSchema)
  .query(async ({ ctx, input }) => {
    const { instancePrisma, event } = ctx
    const { doctorId, facilityId, date, status, page, limit } = input
    try {
      console.log('🔍 getAppointments called (STAFF)')
      
      // Manual authentication check for staff
      const refreshToken = getCookie(event, "refreshToken")
      console.log('🍪 Staff refresh token present:', !!refreshToken)
      
      if (!refreshToken) {
        console.log('❌ No refresh token found')
        return { success: false, message: "Please login to view appointments.", data: null }
      }
      
      // Decode token (not strict verification)
      let decoded: any = null
      try {
        const jwt = await import('jsonwebtoken')
        decoded = jwt.default.decode(refreshToken)
        console.log('👤 Decoded staff token:', decoded?.role)
      } catch (err) {
        console.log('❌ Error decoding token:', err)
        return { success: false, message: "Invalid session. Please login again.", data: null }
      }
      
      if (!decoded?.id) {
        console.log('❌ No user ID in token')
        return { success: false, message: "Invalid session. Please login again.", data: null }
      }

      const where: any = {}
      if (doctorId) where.doctorId = doctorId
      if (facilityId) where.facilityId = facilityId
      if (date) where.date = date
      if (status) where.status = status

      console.log('🔎 Querying appointments with filter:', where)

      const total = await instancePrisma.appointment.count({ where })
      console.log('📊 Total appointments found:', total)
      
      const appointments = await instancePrisma.appointment.findMany({
        where,
        // No include - fetch relations separately
        orderBy: [{ date: "desc" }, { time: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      })

      console.log('📋 Fetched appointments:', appointments.length)

      // Fetch patient users
      const patientIds = [...new Set(appointments.map((a: any) => a.userId))]
      const patients = await instancePrisma.user.findMany({
        where: { id: { in: patientIds } },
        select: { id: true, firstName: true, lastName: true, middleName: true }
      })

      // Fetch doctor users
      const doctorIds = [...new Set(appointments.map((a: any) => a.doctorId))]
      const doctors = await instancePrisma.user.findMany({
        where: { id: { in: doctorIds } },
        select: { id: true, firstName: true, lastName: true, middleName: true }
      })

      // Fetch medical services
      const serviceIds = [...new Set(appointments.map((a: any) => a.medicalServiceId).filter(Boolean))]
      const medicalServices = await instancePrisma.medicalService.findMany({
        where: { id: { in: serviceIds } },
        select: { 
          id: true, 
          name: true, 
          type: true, 
          category: true, 
          price: true, 
          duration: true 
        }
      })

      const withPatientAndDoctor = appointments.map((a: any) => {
        const patient = patients.find((p: any) => p.id === a.userId)
        const doctor = doctors.find((d: any) => d.id === a.doctorId)
        const medicalService = medicalServices.find((s: any) => s.id === a.medicalServiceId)
        return {
          ...a,
          patient: {
            firstName: patient?.firstName || "",
            lastName: patient?.lastName || "",
            middleName: patient?.middleName || "",
            suffix: ""
          },
          doctor: {
            firstName: doctor?.firstName || "",
            lastName: doctor?.lastName || "",
            middleName: doctor?.middleName || "",
            suffix: "",
          },
          medicalService: medicalService || null,  // Include medical service
          facility: null  // No facility relation
        }
      })

      return {
        success: true,
        message: "Appointments fetched successfully.",
        data: { appointments: withPatientAndDoctor, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
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
        where: { doctorId, date, time, status: { in: ["SCHEDULED", "CONFIRMED"] } },
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
          status: { in: ["SCHEDULED", "CONFIRMED"] },
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
          status: { in: ["SCHEDULED", "CONFIRMED"] },
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

const updateAppointmentStatus = publicProcedure
  .input(updateAppointmentStatusSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma, event } = ctx
    const { id, status } = input
    try {
      // Manual authentication check for staff
      const refreshToken = getCookie(event, "refreshToken")
      
      if (!refreshToken) {
        console.log('❌ No refresh token found for updateAppointmentStatus')
        return { success: false, message: "Please login to update appointment status.", data: null }
      }
      
      // Decode token
      let decoded: any = null
      try {
        const jwt = await import('jsonwebtoken')
        decoded = jwt.default.decode(refreshToken)
      } catch (err) {
        console.log('❌ Error decoding token:', err)
        return { success: false, message: "Invalid session. Please login again.", data: null }
      }
      
      if (!decoded?.id) {
        console.log('❌ No user ID in token')
        return { success: false, message: "Invalid session. Please login again.", data: null }
      }

      console.log('✅ Updating appointment status:', { id, status, userId: decoded.id })

      const appointment = await instancePrisma.appointment.update({ where: { id }, data: { status } })
      
      // Try to update patientAppointment if it exists (may not exist in new schema)
      try {
        await instancePrisma.patientAppointment.updateMany({
          where: { appointmentId: id },
          data: { status },
        })
      } catch (err) {
        // PatientAppointment table might not exist, that's okay
        console.log('Note: patientAppointment table not updated (may not exist)')
      }

      return { success: true, message: "Appointment status updated successfully.", data: appointment }
    } catch (error) {
      console.log(error)
      return { success: false, message: "Failed to update appointment status.", data: null }
    }
  })

// === PATIENT ===
const getPatientAppointments = publicProcedure
  .input(getPatientAppointmentsSchema)
  .query(async ({ ctx, input }) => {
    const { instancePrisma, globalPrisma, event } = ctx
    const { doctorId, date, status, page, limit } = input
    try {
      console.log('🔍 getPatientAppointments called')
      
      // Manual authentication - get user from cookies
      const refreshToken = getCookie(event, "refreshToken")
      console.log('🍪 Refresh token present:', !!refreshToken)
      
      if (!refreshToken) {
        console.log('❌ No refresh token found')
        return { success: false, message: "Please login to view your appointments.", data: null }
      }
      
      // Decode the token directly without strict verification
      let decoded: any = null
      try {
        const jwt = await import('jsonwebtoken')
        decoded = jwt.default.decode(refreshToken)
        console.log('👤 Decoded token:', decoded)
      } catch (err) {
        console.log('❌ Error decoding token:', err)
        return { success: false, message: "Invalid session. Please login again.", data: null }
      }
      
      if (!decoded?.id) {
        console.log('❌ No user ID in token')
        return { success: false, message: "Invalid session. Please login again.", data: null }
      }

      const userId = decoded.id
      console.log('✅ User ID from token:', userId)

      // Query appointments directly by userId (simpler!)
      const where: any = { userId: userId }
      if (doctorId) where.doctorId = doctorId
      if (date) where.date = date
      if (status) where.status = status

      console.log('🔎 Querying appointments with filter:', where)
      console.log('🔎 Looking for userId:', userId)

      const total = await instancePrisma.appointment.count({ where })
      console.log('📊 Total appointments found:', total)
      
      const appointments = await instancePrisma.appointment.findMany({
        where,
        // Don't include patient - no relation defined in schema!
        orderBy: [{ date: "desc" }, { time: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      })
      
      console.log('📋 Fetched appointments:', appointments.length, 'records')
      console.log('Appointment userIds:', appointments.map((a: any) => a.userId))
      
      // Fetch user/patient data directly from instancePrisma.user
      const user = await instancePrisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          middleName: true,
          email: true
        }
      })
      
      console.log('📋 User data:', user)

      // Fetch doctors from instancePrisma.user (doctors are users with role STAFF)
      const doctors = await instancePrisma.user.findMany({
        select: { id: true, firstName: true, lastName: true, middleName: true },
        where: { id: { in: appointments.map((a: any) => a.doctorId) } },
      })

      const withDoctorsAndPatient = appointments.map((a: any) => {
        const d = doctors.find((doc: any) => doc.id === a.doctorId)
        return {
          ...a,
          patient: {
            id: user?.id || "",
            patientNumber: "",  // Not needed anymore
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            middleName: user?.middleName || "",
            suffix: ""
          },
          doctor: {
            firstName: d?.firstName || "",
            lastName: d?.lastName || "",
            middleName: d?.middleName || "",
            suffix: "",
          },
          facility: null  // No facility relation either
        }
      })

      return {
        success: true,
        message: "Patient appointments fetched successfully.",
        data: { appointments: withDoctorsAndPatient, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
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
    const { instancePrisma, event } = ctx
    const { doctorId, date, time, name, userId: userIdFromPayload, medicalServiceId } = input

    try {
      console.log('Creating appointment:', { doctorId, date, time, name, medicalServiceId })

      // Validate input
      if (!doctorId || !date || !time || !name) {
        return { success: false, message: "Missing required fields.", data: null }
      }

      // Get user from cookies (optional - won't throw 401)
      const { getCookie } = await import('h3')
      const { verifyRefreshToken } = await import('@/util/token')
      
      // Log all cookies for debugging
      const allCookies = event.node.req.headers.cookie
      console.log('📋 All cookies from request:', allCookies)
      
      const refreshToken = getCookie(event, "refreshToken")
      const accessToken = getCookie(event, "accessToken")
      let userId = null
      
      console.log('🔍 Checking for user cookies...', { 
        hasRefreshToken: !!refreshToken, 
        hasAccessToken: !!accessToken,
        refreshTokenValue: refreshToken ? refreshToken.substring(0, 20) + '...' : 'none'
      })
      
      if (refreshToken) {
        try {
          const decoded = verifyRefreshToken(refreshToken) as any
          console.log('🔓 Decoded token:', decoded)
          if (decoded && decoded.id) {
            userId = decoded.id
            console.log('✅ Found logged in user from cookies:', userId)
          } else {
            console.log('❌ Token decoded but no ID found')
          }
        } catch (err) {
          console.log('❌ Error decoding token:', err)
        }
      } else {
        console.log('❌ No refresh token found in cookies')
      }
      
      // Fallback: use userId from payload if cookies didn't work
      if (!userId && userIdFromPayload) {
        userId = userIdFromPayload
        console.log('✅ Using user ID from payload:', userId)
      }

      // Check if time slot is already booked
      const exists = await instancePrisma.appointment.findFirst({
        where: { 
          doctorId, 
          date, 
          time, 
          status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] } 
        },
      })
      
      if (exists) {
        return { success: false, message: "This time slot is already booked.", data: null }
      }

      // Use userId directly - no need for patient profile!
      if (!userId) {
        return { success: false, message: "You must be logged in to book an appointment.", data: null }
      }
      
      console.log('✅ Creating appointment for user:', userId)
      console.log('📝 medicalServiceId received:', medicalServiceId)
      console.log('📝 Full input data:', input)

      const appointmentData = {
        userId: userId,  // Direct userId reference!
        doctorId,
        medicalServiceId, // Medical service being booked
        date,
        time,
        status: AppointmentStatus.SCHEDULED,
      }

      console.log('📝 Appointment data to be saved:', appointmentData)

      const appointment = await instancePrisma.appointment.create({
        data: appointmentData,
      })

      console.log('✅ Appointment created:', appointment.id)
      console.log('✅ Saved medicalServiceId:', appointment.medicalServiceId)
      console.log('✅ Full appointment:', appointment)

      return {
        success: true,
        message: "Appointment booked successfully! Your appointment has been SCHEDULED.",
        data: appointment,
      }
    } catch (error) {
      console.error('❌ Error creating appointment:', error)
      return { success: false, message: "Failed to book appointment. Please try again.", data: null }
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
      if (!["SCHEDULED", "CONFIRMED"].includes(existing.status)) {
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
          status: { in: ["SCHEDULED", "CONFIRMED"] },
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
        where: { doctorId, date, status: { in: ["SCHEDULED", "CONFIRMED"] } },
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
