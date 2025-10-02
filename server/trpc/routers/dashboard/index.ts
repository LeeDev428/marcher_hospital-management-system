// server/trpc/routers/dashboard/index.ts
import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../../init"

const getDashboardStats = protectedProcedure
  .input(z.object({
    doctorId: z.string().uuid().optional(),
    facilityId: z.string().uuid().optional(),
    dateFrom: z.string().date().optional(),
    dateTo: z.string().date().optional(),
  }))
  .query(async ({ ctx, input }) => {
    const { instancePrisma, globalPrisma } = ctx
    const { doctorId, facilityId, dateFrom, dateTo } = input

    try {
      const today = new Date().toISOString().split('T')[0]
      const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
      
      // Build where clause for appointments
      const whereClause: any = {}
      if (doctorId) whereClause.doctorId = doctorId
      if (facilityId) whereClause.facilityId = facilityId
      if (dateFrom && dateTo) {
        whereClause.date = {
          gte: dateFrom,
          lte: dateTo,
        }
      }

      // Today's appointments
      const todayAppointments = await instancePrisma.appointment.count({
        where: {
          ...whereClause,
          date: today,
        },
      })

      // Fixed: Today's pending appointments specifically
      const todayPendingAppointments = await instancePrisma.appointment.count({
        where: {
          ...whereClause,
          date: today,
          status: 'PENDING',
        },
      })

      // Today's appointments by status
      const todayByStatus = await instancePrisma.appointment.groupBy({
        by: ['status'],
        where: {
          ...whereClause,
          date: today,
        },
        _count: {
          status: true,
        },
      })

      // This month's appointments
      const thisMonthAppointments = await instancePrisma.appointment.count({
        where: {
          ...whereClause,
          date: {
            gte: thisMonth,
          },
        },
      })

      // Total patients
      const totalPatients = await instancePrisma.patientProfile.count({
        where: {},
      })

      return {
        success: true,
        message: "Dashboard statistics fetched successfully.",
        data: {
          summary: {
            todayAppointments,
            todayPendingAppointments, // Fixed: Added this field
            thisMonthAppointments,
            totalPatients,
            todayByStatus: todayByStatus.reduce((acc, curr) => {
              acc[curr.status] = curr._count.status
              return acc
            }, {} as Record<string, number>),
          },
        },
      }
    } catch (error) {
      console.error("Dashboard stats error:", error)
      return {
        success: false,
        message: "Failed to fetch dashboard statistics.",
        data: null,
      }
    }
  })

// Fixed: New procedure for appointments list with comprehensive filtering
const getAppointmentsList = protectedProcedure
  .input(z.object({
    doctorId: z.string().uuid().optional(),
    facilityId: z.string().uuid().optional(),
    dateFrom: z.string().date().optional(),
    dateTo: z.string().date().optional(),
    status: z.enum(["PENDING", "SCHEDULED", "COMPLETED", "CANCELLED"]).optional(),
  }))
  .query(async ({ ctx, input }) => {
    const { instancePrisma, globalPrisma } = ctx
    const { doctorId, facilityId, dateFrom, dateTo, status } = input

    try {
      // Build where clause with all filters
      const whereClause: any = {}
      
      if (doctorId) whereClause.doctorId = doctorId
      if (facilityId) whereClause.facilityId = facilityId
      if (status) whereClause.status = status
      
      // Date filtering
      if (dateFrom && dateTo) {
        whereClause.date = {
          gte: dateFrom,
          lte: dateTo,
        }
      } else if (dateFrom) {
        whereClause.date = {
          gte: dateFrom,
        }
      } else if (dateTo) {
        whereClause.date = {
          lte: dateTo,
        }
      }

      const appointments = await instancePrisma.appointment.findMany({
        where: whereClause,
        include: {
          patient: true,
          facility: {
            include: {
              building: true,
            },
          },
        },
        orderBy: [
          { date: 'asc' },
          { time: 'asc' },
        ],
      })

      // Get doctor profiles
      const doctorIds = [...new Set(appointments.map(apt => apt.doctorId))]
      const doctors = await globalPrisma.staffProfile.findMany({
        where: {
          id: { in: doctorIds },
          role: 'DOCTOR',
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          middleName: true,
          suffix: true,
        },
      })

      const appointmentsWithDoctors = appointments.map(appointment => {
        const doctor = doctors.find(d => d.id === appointment.doctorId)
        return {
          ...appointment,
          doctor: {
            firstName: doctor?.firstName || "",
            lastName: doctor?.lastName || "",
            middleName: doctor?.middleName || "",
            suffix: doctor?.suffix || "",
          },
        }
      })

      return {
        success: true,
        message: "Appointments list fetched successfully.",
        data: appointmentsWithDoctors,
      }
    } catch (error) {
      console.error("Appointments list error:", error)
      return {
        success: false,
        message: "Failed to fetch appointments list.",
        data: null,
      }
    }
  })

export const dashboardRouter = createTRPCRouter({
  getDashboardStats,
  getAppointmentsList, // Fixed: Added the new appointments list endpoint
})