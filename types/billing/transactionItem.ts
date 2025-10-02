import { z } from "zod"

export const transactionItemSchema = z.object({
  transactionId: z.string().uuid("Invalid transaction ID."),
  name: z.string().min(1, "Item name is required.").max(255, "Item name must be less than 255 characters."),
  description: z.string().max(500, "Description must be less than 500 characters.").optional().nullable(),
  amount: z.number().min(0, "Amount must be greater than or equal to 0.").max(1000000000, "Amount must be less than 1 billion."),
})

export const getTransactionItemSchema = z.object({
  id: z.string().uuid("Invalid transaction item ID."),
})

export const tableTransactionItemSchema = transactionItemSchema.extend({
  id: z.string().uuid("Invalid transaction item ID."),
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
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createTransactionItemSchema = transactionItemSchema
export const updateTransactionItemSchema = transactionItemSchema.extend({
  id: z.string().uuid("Invalid transaction item ID."),
})
export const deleteTransactionItemSchema = z.object({
  id: z.string().uuid("Invalid transaction item ID."),
})

export type TransactionItem = z.infer<typeof transactionItemSchema>
export type GetTransactionItem = z.infer<typeof getTransactionItemSchema>
export type TableTransactionItem = z.infer<typeof tableTransactionItemSchema>
export type CreateTransactionItem = z.infer<typeof createTransactionItemSchema>
export type UpdateTransactionItem = z.infer<typeof updateTransactionItemSchema>
export type DeleteTransactionItem = z.infer<typeof deleteTransactionItemSchema>