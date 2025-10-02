import { z } from "zod"

export const paymentSchema = z.object({
  transactionId: z.string().uuid("Invalid transaction ID."),
  amount: z.number().min(0, "Amount must be greater than or equal to 0.").max(1000000000, "Amount must be less than 1 billion."),
})

export const getPaymentSchema = z.object({
  id: z.string().uuid("Invalid payment ID."),
})

export const tablePaymentSchema = paymentSchema.extend({
  id: z.string().uuid("Invalid payment ID."),
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
  instalments: z.array(z.object({
    id: z.string().uuid(),
    instalmentNumber: z.number(),
    amountDue: z.number(),
    amountPaid: z.number(),
    plan: z.object({
      id: z.string().uuid(),
      name: z.string(),
      cycle: z.string(),
      numberOfPayments: z.number(),
    }),
  })).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createPaymentSchema = paymentSchema
export const updatePaymentSchema = paymentSchema.extend({
  id: z.string().uuid("Invalid payment ID."),
})
export const deletePaymentSchema = z.object({
  id: z.string().uuid("Invalid payment ID."),
})

export type Payment = z.infer<typeof paymentSchema>
export type GetPayment = z.infer<typeof getPaymentSchema>
export type TablePayment = z.infer<typeof tablePaymentSchema>
export type CreatePayment = z.infer<typeof createPaymentSchema>
export type UpdatePayment = z.infer<typeof updatePaymentSchema>
export type DeletePayment = z.infer<typeof deletePaymentSchema>