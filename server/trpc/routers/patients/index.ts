import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/trpc/init"
import { patientProfilesRouter } from "@/server/trpc/routers/patients/patientProfiles"

export const patientsRouter = createTRPCRouter({
	profiles: patientProfilesRouter,
	
	// Get patient dashboard data
	getDashboardData: protectedProcedure
		.query(async ({ ctx }) => {
			try {
				const { instancePrisma, user } = ctx
				const userId = user.id

				// Get current date info
				const now = new Date()
				const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
				const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

				// Fetch all appointments for the patient
				const appointments = await instancePrisma.appointment.findMany({
					where: { userId },
					include: {
						user: {
							select: {
								firstName: true,
								lastName: true
							}
						},
						medicalService: true
					},
					orderBy: { date: 'desc' }
				})

				// Get doctor staff records for appointment doctors
				const doctorIds = [...new Set(appointments.map(a => a.doctorId))]
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

				// Create a map of doctor info
				const doctorMap = new Map(
					doctorCredentials.map((staff) => [
						staff.userId,
						{
							name: `Dr. ${staff.user.firstName} ${staff.user.lastName}`,
							specialty: staff.specialization || 'General Medicine'
						}
					])
				)

				// Get next upcoming appointment
				const upcomingAppointments = appointments.filter(a => {
					const aptDate = new Date(a.date)
					return aptDate >= now && a.status !== 'CANCELLED'
				}).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

				const nextAppointment = upcomingAppointments[0]

				// Get last completed appointment
				const completedAppointments = appointments.filter(a => {
					const aptDate = new Date(a.date)
					return aptDate < now || a.status === 'COMPLETED'
				}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

				const lastVisit = completedAppointments[0]

				// Monthly statistics
				const monthlyAppointments = appointments.filter(a => {
					const aptDate = new Date(a.date)
					return aptDate >= firstDayOfMonth && aptDate <= lastDayOfMonth
				})

				const monthlyCompleted = monthlyAppointments.filter(a => 
					a.status === 'COMPLETED'
				).length

				const monthlyUpcoming = monthlyAppointments.filter(a => 
					a.status === 'SCHEDULED' || a.status === 'CONFIRMED'
				).length

				// Get recent 3 appointments
				const recentAppointments = appointments.slice(0, 3).map(apt => {
					const doctor = doctorMap.get(apt.doctorId)
					return {
						id: apt.id,
						doctor: doctor?.name || 'Unknown Doctor',
						specialty: doctor?.specialty || 'General Medicine',
						date: apt.date,
						time: apt.time,
						status: apt.status.toLowerCase(),
						type: apt.type || 'Consultation'
					}
				})

				// Weekly breakdown for chart
				const getWeekOfMonth = (date: Date) => {
					const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
					const dayOfMonth = date.getDate()
					const dayOfWeek = firstDay.getDay()
					return Math.ceil((dayOfMonth + dayOfWeek) / 7)
				}

				const weeklyData = [0, 0, 0, 0]
				monthlyAppointments.forEach(apt => {
					const aptDate = new Date(apt.date)
					const week = getWeekOfMonth(aptDate)
					if (week >= 1 && week <= 4) {
						weeklyData[week - 1]++
					}
				})

				return {
					success: true,
					data: {
						patientStats: {
							nextAppointment: nextAppointment ? {
								date: new Date(nextAppointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
								doctor: doctorMap.get(nextAppointment.doctorId)?.name || 'Unknown',
								specialty: doctorMap.get(nextAppointment.doctorId)?.specialty || 'General Medicine'
							} : null,
							lastVisit: lastVisit ? {
								date: new Date(lastVisit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
								type: lastVisit.type || 'Consultation'
							} : null,
							prescriptionsCount: 0, // TODO: Implement when prescriptions table exists
							testResultsCount: 0 // TODO: Implement when test results table exists
						},
						monthlyData: {
							currentMonth: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
							totalAppointments: monthlyAppointments.length,
							completedAppointments: monthlyCompleted,
							upcomingAppointments: monthlyUpcoming,
							prescriptions: 0, // TODO: Implement
							weeklyData
						},
						recentAppointments
					}
				}
			} catch (error) {
				console.error('Error fetching patient dashboard data:', error)
				return {
					success: false,
					message: 'Failed to fetch dashboard data',
					data: null
				}
			}
		}),
	
	// Search patients by name
	searchPatients: publicProcedure
		.input(z.object({ 
			query: z.string(),
			limit: z.number().optional().default(10)
		}))
		.query(async ({ ctx, input }) => {
			try {
				const { instancePrisma } = ctx
				
				const patients = await instancePrisma.patient.findMany({
					where: {
						user: {
							OR: [
								{
									firstName: {
										contains: input.query,
										mode: 'insensitive'
									}
								},
								{
									lastName: {
										contains: input.query,
										mode: 'insensitive'
									}
								},
								{
									email: {
										contains: input.query,
										mode: 'insensitive'
									}
								}
							]
						}
					},
					take: input.limit,
					include: {
						user: {
							select: {
								firstName: true,
								lastName: true,
								email: true,
								phone: true
							}
						}
					}
				})
				
				// Transform to include user fields at top level
				const transformedPatients = patients.map(p => ({
					patientId: p.id,
					firstName: p.user.firstName,
					lastName: p.user.lastName,
					email: p.user.email,
					phone: p.user.phone,
					patientNumber: p.patientNumber
				}))
				
				return {
					success: true,
					data: transformedPatients
				}
			} catch (error: any) {
				console.error('Error searching patients:', error)
				return {
					success: false,
					message: error.message || 'Failed to search patients',
					data: []
				}
			}
		}),
	
	// Get patient by user ID
	getPatientByUserId: publicProcedure
		.input(z.object({ userId: z.string() }))
		.query(async ({ ctx, input }) => {
			try {
				const { instancePrisma } = ctx
				
				const patient = await instancePrisma.patient.findFirst({
					where: { userId: input.userId },
					include: {
						user: {
							select: {
								firstName: true,
								lastName: true,
								email: true,
								phone: true,
							}
						}
					}
				})
				
				if (!patient) {
					return {
						success: false,
						message: 'Patient not found',
						data: null
					}
				}
				
				return {
					success: true,
					message: 'Patient found',
					data: patient
				}
			} catch (error: any) {
				console.error('Error getting patient by user ID:', error)
				return {
					success: false,
					message: error.message || 'Failed to get patient',
					data: null
				}
			}
		})
})