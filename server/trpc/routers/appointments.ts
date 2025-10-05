import { createTRPCRouter, publicProcedure } from "../init"
import { z } from "zod"
import { checkAvailabilitySchema, getAvailableTimeSlotsSchema } from "@/types/appointments"

export const appointmentsRouter = createTRPCRouter({
	// Stub - will implement later to call Express backend
	getAppointments: publicProcedure.query(() => ({ success: true, data: [] })),

	// Check if a specific time slot is available
	checkAvailability: publicProcedure
		.input(checkAvailabilitySchema)
		.query(async ({ input, ctx }) => {
			try {
				const { doctorId, date, time, excludeAppointmentId } = input
				const { instancePrisma } = ctx

				// Check if doctor has schedule for this day
				const appointmentDate = new Date(date)
				const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()

				const doctorSchedule = await instancePrisma.staffSchedule.findFirst({
					where: {
						staffId: doctorId,
						day: dayOfWeek as any,
						isAvailable: true,
					},
				})

				if (!doctorSchedule) {
					return {
						success: true,
						data: {
							available: false,
							reason: "Doctor is not available on this day",
						},
					}
				}

				// Check if time is within doctor's schedule
				const [scheduleStartH, scheduleStartM] = doctorSchedule.startTime!.split(':').map(Number)
				const [scheduleEndH, scheduleEndM] = doctorSchedule.endTime!.split(':').map(Number)
				const [appointmentH, appointmentM] = time.split(':').map(Number)

				const scheduleStartMinutes = scheduleStartH * 60 + scheduleStartM
				const scheduleEndMinutes = scheduleEndH * 60 + scheduleEndM
				const appointmentMinutes = appointmentH * 60 + appointmentM

				if (appointmentMinutes < scheduleStartMinutes || appointmentMinutes >= scheduleEndMinutes) {
					return {
						success: true,
						data: {
							available: false,
							reason: `Doctor is only available between ${doctorSchedule.startTime} and ${doctorSchedule.endTime}`,
						},
					}
				}

				// Check for conflicting appointments
				const whereClause: any = {
					doctorId,
					date,
					time,
					status: {
						in: ['PENDING', 'SCHEDULED'], // Don't count cancelled/completed
					},
				}

				if (excludeAppointmentId) {
					whereClause.id = { not: excludeAppointmentId }
				}

				const existingAppointment = await instancePrisma.appointment.findFirst({
					where: whereClause,
				})

				if (existingAppointment) {
					return {
						success: true,
						data: {
							available: false,
							reason: "This time slot is already booked",
						},
					}
				}

				return {
					success: true,
					data: {
						available: true,
						reason: "Time slot is available",
					},
				}
			} catch (error) {
				console.error("❌ Error checking availability:", error)
				return {
					success: false,
					message: "Failed to check availability",
					data: null,
				}
			}
		}),

	// Get available time slots for a specific date
	getAvailableTimeSlots: publicProcedure
		.input(getAvailableTimeSlotsSchema)
		.query(async ({ input, ctx }) => {
			try {
				const { doctorId, date } = input
				const { instancePrisma } = ctx

				// Get doctor's schedule for this day
				const appointmentDate = new Date(date)
				const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()

				const doctorSchedule = await instancePrisma.staffSchedule.findFirst({
					where: {
						staffId: doctorId,
						day: dayOfWeek as any,
						isAvailable: true,
					},
				})

				if (!doctorSchedule) {
					return {
						success: true,
						data: {
							date,
							timeSlots: [],
							isFullyBooked: true,
						},
					}
				}

				// Generate 20-minute interval slots
				const generateTimeSlots = (startTime: string, endTime: string): string[] => {
					const slots: string[] = []
					const [startH, startM] = startTime.split(':').map(Number)
					const [endH, endM] = endTime.split(':').map(Number)

					let currentMinutes = startH * 60 + startM
					const endMinutes = endH * 60 + endM

					while (currentMinutes < endMinutes) {
						const hours = Math.floor(currentMinutes / 60)
						const minutes = currentMinutes % 60
						slots.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`)
						currentMinutes += 20
					}

					return slots
				}

				const allSlots = generateTimeSlots(doctorSchedule.startTime!, doctorSchedule.endTime!)

				// Get booked appointments for this date
				const bookedAppointments = await instancePrisma.appointment.findMany({
					where: {
						doctorId,
						date,
						status: {
							in: ['PENDING', 'SCHEDULED'],
						},
					},
					select: {
						time: true,
					},
				})

				const bookedTimes = new Set(bookedAppointments.map(a => a.time))

				// Mark slots as available/unavailable
				const timeSlots = allSlots.map(time => ({
					time,
					available: !bookedTimes.has(time),
					reason: bookedTimes.has(time) ? 'Already booked' : undefined,
				}))

				return {
					success: true,
					data: {
						date,
						timeSlots,
						isFullyBooked: timeSlots.every(slot => !slot.available),
					},
				}
			} catch (error) {
				console.error("❌ Error getting available time slots:", error)
				return {
					success: false,
					message: "Failed to get available time slots",
					data: null,
				}
			}
		}),
})