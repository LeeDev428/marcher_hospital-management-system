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
      // Get total patients from instance database
      const totalPatients = await instancePrisma.patient.count()

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
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: [
          { date: 'asc' },
          { time: 'asc' },
        ],
      })

      // Get doctor credentials from instance database
      const doctorIds = [...new Set(appointments.map(apt => apt.doctorId))]
      const doctorCredentials = await instancePrisma.staffCredentials.findMany({
        where: {
          userId: { in: doctorIds }
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      })

      const appointmentsWithDoctors = appointments.map(appointment => {
        const doctorCred = doctorCredentials.find((d: any) => d.userId === appointment.doctorId)
        const doctorUser = doctorCred?.user
        return {
          ...appointment,
          doctorInfo: {
            firstName: doctorUser?.firstName || "",
            lastName: doctorUser?.lastName || ""
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

// Staff dashboard endpoint with all necessary data
const getStaffDashboardData = protectedProcedure
  .query(async ({ ctx }) => {
    const { instancePrisma } = ctx

    try {
      const now = new Date()
      const today = now.toISOString().split('T')[0]
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

      // Total Patients
      const totalPatients = await instancePrisma.patient.count()

      // Appointments Today
      const appointmentsToday = await instancePrisma.appointment.count({
        where: { date: today }
      })

      // Total Revenue (placeholder - using billing transactions)
      const totalBillings = await instancePrisma.billingTransaction.count({
        where: {
          createdAt: {
            gte: new Date(firstDayOfMonth),
            lte: new Date(lastDayOfMonth)
          },
          status: 'PAID'
        }
      })

      // Active Staff Count (users with role STAFF and status ACTIVE)
      const activeStaff = await instancePrisma.user.count({
        where: {
          role: 'STAFF',
          status: 'ACTIVE'
        }
      })

      // Today's Appointments with details
      const todayAppointments = await instancePrisma.appointment.findMany({
        where: { date: today },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          medicalService: true
        },
        orderBy: { time: 'asc' },
        take: 10
      })

      // Get doctor info for appointments
      const doctorIds = [...new Set(todayAppointments.map(a => a.doctorId))]
      const doctorCredentials = await instancePrisma.staffCredentials.findMany({
        where: { userId: { in: doctorIds } },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      })

      const doctorMap = new Map(
        doctorCredentials.map(cred => [
          cred.userId,
          `Dr. ${cred.user.firstName} ${cred.user.lastName}`
        ])
      )

      // Format today's appointments
      const formattedTodayAppointments = todayAppointments.map(apt => ({
        id: apt.id,
        time: apt.time,
        patient: `${apt.user.firstName} ${apt.user.lastName}`,
        doctor: doctorMap.get(apt.doctorId) || 'Unknown',
        type: apt.type || 'Consultation',
        status: apt.status.toLowerCase()
      }))

      // Weekly activity data
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const weeklyActivity = []
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        const dayName = daysOfWeek[date.getDay()]

        const [patients, appointments, billingCount] = await Promise.all([
          instancePrisma.patient.count({
            where: {
              createdAt: {
                gte: new Date(dateStr + 'T00:00:00'),
                lt: new Date(dateStr + 'T23:59:59')
              }
            }
          }),
          instancePrisma.appointment.count({
            where: { date: dateStr }
          }),
          instancePrisma.billingTransaction.count({
            where: {
              createdAt: {
                gte: new Date(dateStr + 'T00:00:00'),
                lt: new Date(dateStr + 'T23:59:59')
              },
              status: 'PAID'
            }
          })
        ])

        weeklyActivity.push({
          day: dayName,
          patients,
          appointments,
          revenue: billingCount * 1000 // Placeholder calculation
        })
      }

      // Recent activities (appointments and billing)
      const recentAppointments = await instancePrisma.appointment.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 2 * 60 * 60 * 1000) // Last 2 hours
          }
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })

      const recentActivities = recentAppointments.map(apt => {
        const timeDiff = Math.floor((Date.now() - new Date(apt.createdAt).getTime()) / 60000)
        return {
          id: apt.id,
          type: 'appointment',
          title: 'New Appointment',
          description: `${apt.user.firstName} ${apt.user.lastName} scheduled`,
          time: timeDiff < 60 ? `${timeDiff} min ago` : `${Math.floor(timeDiff / 60)} hr ago`,
          status: 'new'
        }
      })

      return {
        success: true,
        data: {
          stats: {
            totalPatients,
            appointmentsToday,
            totalRevenue: totalBillings * 1000, // Placeholder calculation
            activeStaff
          },
          todayAppointments: formattedTodayAppointments,
          weeklyActivity,
          recentActivities
        }
      }
    } catch (error) {
      console.error('Staff dashboard error:', error)
      return {
        success: false,
        message: 'Failed to fetch staff dashboard data',
        data: null
      }
    }
  })

export const dashboardRouter = createTRPCRouter({
  getDashboardStats,
  getAppointmentsList, // Fixed: Added the new appointments list endpoint
  getStaffDashboardData,
})
