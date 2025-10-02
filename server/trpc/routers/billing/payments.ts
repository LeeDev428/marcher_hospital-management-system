import { 
  createPaymentSchema, 
  deletePaymentSchema,
  getPaymentSchema, 
  updatePaymentSchema 
} from "~/types/billing"
import { createTRPCRouter, protectedProcedure } from "../../init"

const getPayments = protectedProcedure.query(async ({ ctx }) => {
  const { instancePrisma } = ctx

  try {
    const payments = await instancePrisma.transaction.findMany({
      include: {
        encounter: true,
        items: true,
      },
    })

    return {
      success: true,
      message: "Payments fetched successfully",
      data: payments,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: "Failed to fetch payments",
      data: null,
    }
  }
})

const getPayment = protectedProcedure
  .input(getPaymentSchema)
  .query(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id } = input

    try {
      const payment = await instancePrisma.payment.findUnique({
        where: { id },
        include: {
          transaction: {
            include: {
              encounter: true,
            },
          },
          instalments: {
            include: {
              plan: true,
            },
          },
        },
      })

      return {
        success: true,
        message: "Payment fetched successfully",
        data: payment,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to fetch payment",
        data: null,
      }
    }
  })

const createPayment = protectedProcedure
  .input(createPaymentSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { transactionId, amount } = input

    try {
      const payment = await instancePrisma.payment.create({
        data: {
          transactionId,
          amount,
        },
        include: {
          transaction: {
            include: {
              encounter: true,
            },
          },
          instalments: true,
        },
      })

      return {
        success: true,
        message: "Payment created successfully",
        data: payment,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to create payment",
        data: null,
      }
    }
  })

const updatePayment = protectedProcedure
  .input(updatePaymentSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id, transactionId, amount } = input

    try {
      const payment = await instancePrisma.payment.update({
        where: { id },
        data: {
          transactionId,
          amount,
        },
        include: {
          transaction: {
            include: {
              encounter: true,
            },
          },
          instalments: true,
        },
      })

      return {
        success: true,
        message: "Payment updated successfully",
        data: payment,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to update payment",
        data: null,
      }
    }
  })

const deletePayment = protectedProcedure
  .input(deletePaymentSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id } = input

    try {
      const payment = await instancePrisma.payment.delete({
        where: { id },
      })

      return {
        success: true,
        message: "Payment deleted successfully",
        data: payment,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to delete payment",
        data: null,
      }
    }
  })

export const paymentsRouter = createTRPCRouter({
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
})