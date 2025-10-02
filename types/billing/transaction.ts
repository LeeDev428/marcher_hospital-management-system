import { z } from "zod"

export const transactionStatusSchema = z.enum([
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
  "FAILED",
])

export const transactionStatusOptions = transactionStatusSchema.options.map((option) => ({
  label: option.charAt(0).toUpperCase() + option.slice(1).toLowerCase(),
  value: option,
}))

export const transactionStatus = z.string().pipe(transactionStatusSchema)

export const transactionSchema = z.object({
  encounterId: z.string().uuid("Invalid encounter ID."),
  status: transactionStatus,
})

export const getTransactionSchema = z.object({
  id: z.string().uuid("Invalid transaction ID."),
})

export const tableTransactionSchema = transactionSchema.extend({
  id: z.string().uuid("Invalid transaction ID."),
  encounter: z.object({
    id: z.string().uuid(),
    patient: z.object({
      id: z.string().uuid(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email().nullable().optional(),
    }),
  }),
  items: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable().optional(),
    amount: z.number(),
  })).optional(),
  payments: z.array(z.object({
    id: z.string().uuid(),
    amount: z.number(),
    instalments: z.array(z.object({
      id: z.string().uuid(),
      instalmentNumber: z.number(),
      amountDue: z.number(),
      amountPaid: z.number(),
      plan: z.object({
        id: z.string().uuid(),
        name: z.string(),
        cycle: z.string(),
      }),
    })).optional(),
  })).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createTransactionSchema = transactionSchema
export const updateTransactionSchema = transactionSchema.extend({
  id: z.string().uuid("Invalid transaction ID."),
})
export const deleteTransactionSchema = z.object({
  id: z.string().uuid("Invalid transaction ID."),
})

export type Transaction = z.infer<typeof transactionSchema>
export type GetTransaction = z.infer<typeof getTransactionSchema>
export type TableTransaction = z.infer<typeof tableTransactionSchema>
export type CreateTransaction = z.infer<typeof createTransactionSchema>
export type UpdateTransaction = z.infer<typeof updateTransactionSchema>
export type DeleteTransaction = z.infer<typeof deleteTransactionSchema>
