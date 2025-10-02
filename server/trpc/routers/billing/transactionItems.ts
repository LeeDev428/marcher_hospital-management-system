import { 
  createTransactionItemSchema, 
  deleteTransactionItemSchema,
  getTransactionItemSchema, 
  updateTransactionItemSchema 
} from "~/types/billing"
import { createTRPCRouter, protectedProcedure } from "../../init"

const getTransactionItems = protectedProcedure.query(async ({ ctx }) => {
  const { instancePrisma } = ctx

  try {
    const transactionItems = await instancePrisma.transactionItem.findMany({
      include: {
        transaction: {
          include: {
            encounter: true,
          },
        },
      },
    })

    return {
      success: true,
      message: "Transaction items fetched successfully",
      data: transactionItems,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: "Failed to fetch transaction items",
      data: null,
    }
  }
})

const getTransactionItem = protectedProcedure
  .input(getTransactionItemSchema)
  .query(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id } = input

    try {
      const transactionItem = await instancePrisma.transactionItem.findUnique({
        where: { id },
        include: {
          transaction: {
            include: {
              encounter: {
                include: {
                },
              },
            },
          },
        },
      })

      return {
        success: true,
        message: "Transaction item fetched successfully",
        data: transactionItem,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to fetch transaction item",
        data: null,
      }
    }
  })

const createTransactionItem = protectedProcedure
  .input(createTransactionItemSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { transactionId, name, description, amount } = input

    try {
      const transactionItem = await instancePrisma.transactionItem.create({
        data: {
          transactionId,
          name,
          description,
          amount,
        },
        include: {
          transaction: {
            include: {
              encounter: true,
            },
          },
        },
      })

      return {
        success: true,
        message: "Transaction item created successfully",
        data: transactionItem,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to create transaction item",
        data: null,
      }
    }
  })

const updateTransactionItem = protectedProcedure
  .input(updateTransactionItemSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id, transactionId, name, description, amount } = input

    try {
      const transactionItem = await instancePrisma.transactionItem.update({
        where: { id },
        data: {
          transactionId,
          name,
          description,
          amount,
        },
        include: {
          transaction: {
            include: {
              encounter: true,
            },
          },
        },
      })

      return {
        success: true,
        message: "Transaction item updated successfully",
        data: transactionItem,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to update transaction item",
        data: null,
      }
    }
  })

const deleteTransactionItem = protectedProcedure
  .input(deleteTransactionItemSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id } = input

    try {
      const transactionItem = await instancePrisma.transactionItem.delete({
        where: { id },
      })

      return {
        success: true,
        message: "Transaction item deleted successfully",
        data: transactionItem,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to delete transaction item",
        data: null,
      }
    }
  })

export const transactionItemsRouter = createTRPCRouter({
  getTransactionItems,
  getTransactionItem,
  createTransactionItem,
  updateTransactionItem,
  deleteTransactionItem,
})