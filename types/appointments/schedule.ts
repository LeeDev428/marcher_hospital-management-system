import { z } from "zod"

export const daysSchema = z.enum([
	"MONDAY",
	"TUESDAY",
	"WEDNESDAY",
	"THURSDAY",
	"FRIDAY",
	"SATURDAY",
	"SUNDAY",
])

export const daysOptions = daysSchema.options.map((day) => ({
	label: day.charAt(0).toUpperCase() + day.slice(1),
	value: day,
}))

export const scheduleSchema = z.object({
	day: daysSchema,
	time: z.string().time(),
})

export const getScheduleSchema = z.object({
	id: z.string().uuid("Invalid schedule ID."),
})

export const tableScheduleSchema = scheduleSchema
	.extend({
		id: z.string().uuid("Invalid schedule ID."),
	})

export const createScheduleSchema = scheduleSchema

export const updateScheduleSchema = scheduleSchema

export const deleteScheduleSchema = z.object({
	id: z.string().uuid("Invalid schedule ID."),
})

export type Days = z.infer<typeof daysSchema>
export type Schedule = z.infer<typeof scheduleSchema>
export type GetSchedule = z.infer<typeof getScheduleSchema>
export type TableSchedule = z.infer<typeof tableScheduleSchema>
export type CreateSchedule = z.infer<typeof createScheduleSchema>
export type UpdateSchedule = z.infer<typeof updateScheduleSchema>
export type DeleteSchedule = z.infer<typeof deleteScheduleSchema>

