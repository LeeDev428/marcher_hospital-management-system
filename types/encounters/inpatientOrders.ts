import { z } from "zod"

// ==================== INPATIENT ENCOUNTER CHARTS ====================

export const createInpatientChartSchema = z.object({
	encounterId: z.string().uuid(),
	chart: z.string().min(1, "Chart content is required"),
})

export type CreateInpatientChartSchema = z.infer<
	typeof createInpatientChartSchema
>

export const getInpatientChartsSchema = z.object({
	encounterId: z.string().uuid(),
})

export type GetInpatientChartsSchema = z.infer<typeof getInpatientChartsSchema>

export const deleteInpatientChartSchema = z.object({
	id: z.string().uuid(),
})

export type DeleteInpatientChartSchema = z.infer<
	typeof deleteInpatientChartSchema
>

// ==================== INPATIENT ENCOUNTER ORDERS ====================

export const inpatientEncounterOrderTypeEnum = z.enum([
	"PRESCRIPTION",
	"LABORATORY",
	"RADIOLOGY",
	"OPERATION",
	"PROCEDURE",
	"OTHER",
])

export const inpatientEncounterOrderStatusEnum = z.enum([
	"PENDING",
	"COMPLETED",
	"CANCELLED",
])

// Add Order/Particular to Encounter (Doctor only)
export const createInpatientOrderSchema = z.object({
	encounterId: z.string().uuid(),
	catalogueItemId: z.string().uuid().optional(), // If using catalogue
	type: inpatientEncounterOrderTypeEnum,
	description: z.string().min(1, "Description is required"),
	cost: z.number().min(0, "Cost must be non-negative"),
	notes: z.string().optional(),
})

export type CreateInpatientOrderSchema = z.infer<
	typeof createInpatientOrderSchema
>

// Update Order Status
export const updateInpatientOrderSchema = z.object({
	id: z.string().uuid(),
	status: inpatientEncounterOrderStatusEnum,
	notes: z.string().optional(),
})

export type UpdateInpatientOrderSchema = z.infer<
	typeof updateInpatientOrderSchema
>

// Get Orders for Encounter
export const getInpatientOrdersSchema = z.object({
	encounterId: z.string().uuid(),
})

export type GetInpatientOrdersSchema = z.infer<typeof getInpatientOrdersSchema>

// Delete Order
export const deleteInpatientOrderSchema = z.object({
	id: z.string().uuid(),
})

export type DeleteInpatientOrderSchema = z.infer<
	typeof deleteInpatientOrderSchema
>

export type InpatientOrderType = z.infer<typeof inpatientEncounterOrderTypeEnum>
export type InpatientOrderStatus = z.infer<typeof inpatientEncounterOrderStatusEnum>
