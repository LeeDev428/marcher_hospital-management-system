import { z } from "zod"

export const StaffModuleSchema = z.enum([
	"appointments",
	"billing",
	"cases",
	"facilities",
	"insurance",
	"patients",
	"pharmacy",
	"reports",
	"staff",
])

export const AdminModuleSchema = z.enum([
	"users",
	"logs",
	"settings",
])

export const UserActionSchema = z.enum([
	"create",
	"read",
	"update",
	"archive",
	"delete",
])

export type StaffModule = z.infer<typeof StaffModuleSchema>
export type AdminModule = z.infer<typeof AdminModuleSchema>
export type UserAction = z.infer<typeof UserActionSchema>
export type ModulePermission =
 | `staff.${StaffModule}.${UserAction}`
 | `admin.${AdminModule}.${UserAction}`
