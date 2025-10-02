import { z } from "zod"

export const paymentInstalmentSchema = z.object({
  paymentId: z.string().uuid("Invalid payment ID."),
  planId: z.string().uuid("Invalid payment plan ID."),
  instalmentNumber: z.number().min(1, "Instalment number must be at least 1.").max(120, "Instalment number cannot exceed 120."),
  amountDue: z.number().min(0, "Amount due must be greater than or equal to 0.").max(1000000000, "Amount due must be less than 1 billion."),
  amountPaid: z.number().min(0, "Amount paid must be greater than or equal to 0.").max(1000000000, "Amount paid must be less than 1 billion."),
})

export const getPaymentInstalmentSchema = z.object({
  id: z.string().uuid("Invalid payment instalment ID."),
})

export const tablePaymentInstalmentSchema = paymentInstalmentSchema.extend({
  id: z.string().uuid("Invalid payment instalment ID."),
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
          email: z.string().email().nullable().optional(),
        }),
      }),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    }),
  }),
  plan: z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable().optional(),
    cycle: z.string(),
    numberOfPayments: z.number(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createPaymentInstalmentSchema = paymentInstalmentSchema
export const updatePaymentInstalmentSchema = paymentInstalmentSchema.extend({
  id: z.string().uuid("Invalid payment instalment ID."),
})
export const deletePaymentInstalmentSchema = z.object({
  id: z.string().uuid("Invalid payment instalment ID."),
})

export type PaymentInstalment = z.infer<typeof paymentInstalmentSchema>
export type GetPaymentInstalment = z.infer<typeof getPaymentInstalmentSchema>
export type TablePaymentInstalment = z.infer<typeof tablePaymentInstalmentSchema>
export type CreatePaymentInstalment = z.infer<typeof createPaymentInstalmentSchema>
export type UpdatePaymentInstalment = z.infer<typeof updatePaymentInstalmentSchema>
export type DeletePaymentInstalment = z.infer<typeof deletePaymentInstalmentSchema>