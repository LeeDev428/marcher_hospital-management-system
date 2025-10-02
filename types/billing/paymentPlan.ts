import { z } from "zod"

export const paymentPlanCycleSchema = z.enum([
  "WEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
])

export const paymentPlanCycleOptions = paymentPlanCycleSchema.options.map((option) => ({
  label: option.charAt(0).toUpperCase() + option.slice(1).toLowerCase(),
  value: option,
}))

export const paymentPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required.").max(255, "Plan name must be less than 255 characters."),
  description: z.string().max(500, "Description must be less than 500 characters.").optional().nullable(),
  cycle: paymentPlanCycleSchema,
  numberOfPayments: z.number().min(1, "Number of payments must be at least 1.").max(120, "Number of payments cannot exceed 120."),
})

export const getPaymentPlanSchema = z.object({
  id: z.string().uuid("Invalid payment plan ID."),
})

export const tablePaymentPlanSchema = paymentPlanSchema.extend({
  id: z.string().uuid("Invalid payment plan ID."),
  _count: z.object({
    instalments: z.number(),
  }).optional(),
  instalments: z.array(z.object({
    id: z.string().uuid(),
    instalmentNumber: z.number(),
    amountDue: z.number(),
    amountPaid: z.number(),
    payment: z.object({
      id: z.string().uuid(),
      amount: z.number(),
      transaction: z.object({
        id: z.string().uuid(),
        status: z.string(),
        encounter: z.object({
          id: z.string().uuid(),
          patient: z.object({
            id: z.string().uuid(),
            firstName: z.string(),
            lastName: z.string(),
          }),
        }),
      }),
    }),
  })).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createPaymentPlanSchema = paymentPlanSchema
export const updatePaymentPlanSchema = paymentPlanSchema.extend({
  id: z.string().uuid("Invalid payment plan ID."),
})
export const deletePaymentPlanSchema = z.object({
  id: z.string().uuid("Invalid payment plan ID."),
})

export type PaymentPlan = z.infer<typeof paymentPlanSchema>
export type GetPaymentPlan = z.infer<typeof getPaymentPlanSchema>
export type TablePaymentPlan = z.infer<typeof tablePaymentPlanSchema>
export type CreatePaymentPlan = z.infer<typeof createPaymentPlanSchema>
export type UpdatePaymentPlan = z.infer<typeof updatePaymentPlanSchema>
export type DeletePaymentPlan = z.infer<typeof deletePaymentPlanSchema>
