import { 
  createTransactionSchema, 
  deleteTransactionSchema,
  getTransactionSchema, 
  updateTransactionSchema 
} from "~/types/billing"
import { createTRPCRouter, publicProcedure } from "../../init"

const getTransactions = publicProcedure.query(async ({ ctx }) => {
  const { instancePrisma } = ctx

  try {
    const transactions = await instancePrisma.transaction.findMany({
      include: {
        encounter: {
          include: {
            patientProfile: true,
          },
        },
        items: true,
        payments: true,
      },
    })
      

    // Transform the data to match TableTransaction type
    const transformedTransactions = transactions.map(transaction => ({
      ...transaction,
      status: transaction.status as "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "FAILED",
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    }))

    return {
      success: true,
      message: "Transactions fetched successfully",
      data: transformedTransactions,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: "Failed to fetch transactions",
      data: null,
    }
  }
})

const getTransaction = publicProcedure
  .input(getTransactionSchema)
  .query(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id } = input

    try {
      const transaction = await instancePrisma.transaction.findUnique({
        where: { id },
        include: {
          encounter: true,
          items: true,
          payments: {
            include: {
              instalments: {
                include: {
                  plan: true,
                },
              },
            },
          },
        },
      })

      return {
        success: true,
        message: "Transaction fetched successfully",
        data: transaction,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to fetch transaction",
        data: null,
      }
    }
  })

const createTransaction = publicProcedure
  .input(createTransactionSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { encounterId, status } = input

    try {
      const transaction = await instancePrisma.transaction.create({
        data: {
          encounterId,
          status,
        },
        include: {
          encounter: true,
          items: true,
          payments: true,
        },
      })

      return {
        success: true,
        message: "Transaction created successfully",
        data: transaction,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to create transaction",
        data: null,
      }
    }
  })

const updateTransaction = publicProcedure
  .input(updateTransactionSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id, encounterId, status } = input

    try {
      const transaction = await instancePrisma.transaction.update({
        where: { id },
        data: {
          encounterId,
          status,
        },
        include: {
          encounter: true,
          items: true,
          payments: true,
        },
      })

      return {
        success: true,
        message: "Transaction updated successfully",
        data: transaction,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to update transaction",
        data: null,
      }
    }
  })

const deleteTransaction = publicProcedure
  .input(deleteTransactionSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id } = input

    try {
      const transaction = await instancePrisma.transaction.delete({
        where: { id },
      })

      return {
        success: true,
        message: "Transaction deleted successfully",
        data: transaction,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to delete transaction",
        data: null,
      }
    }
  })

export const transactionsRouter = createTRPCRouter({
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
})
