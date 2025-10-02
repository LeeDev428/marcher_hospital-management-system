import { 
  createPaymentInstalmentSchema, 
  deletePaymentInstalmentSchema,
  getPaymentInstalmentSchema, 
  updatePaymentInstalmentSchema 
} from "~/types/billing"
import { createTRPCRouter, protectedProcedure } from "../../init"

const getPaymentInstalments = protectedProcedure.query(async ({ ctx }) => {
  const { instancePrisma } = ctx

  try {
    const paymentInstalments = await instancePrisma.paymentInstalment.findMany({
      include: {
        payment: {
          include: {
            transaction: {
              include: {
                encounter: true,
              },
            },
          },
        },
        plan: true,
      },
    })

    return {
      success: true,
      message: "Payment instalments fetched successfully",
      data: paymentInstalments,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: "Failed to fetch payment instalments",
      data: null,
    }
  }
})

const getPaymentInstalment = protectedProcedure
  .input(getPaymentInstalmentSchema)
  .query(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id } = input

    try {
      const paymentInstalment = await instancePrisma.paymentInstalment.findUnique({
        where: { id },
        include: {
          payment: {
            include: {
              transaction: {
                include: {
                  encounter: true,
                },
              },
            },
          },
          plan: true,
        },
      })

      return {
        success: true,
        message: "Payment instalment fetched successfully",
        data: paymentInstalment,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to fetch payment instalment",
        data: null,
      }
    }
  })

const createPaymentInstalment = protectedProcedure
  .input(createPaymentInstalmentSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { paymentId, planId, instalmentNumber, amountDue, amountPaid } = input

    try {
      const paymentInstalment = await instancePrisma.paymentInstalment.create({
        data: {
          paymentId,
          planId,
          instalmentNumber,
          amountDue,
          amountPaid,
        },
        include: {
          payment: {
            include: {
              transaction: {
                include: {
                  encounter: true,
                },
              },
            },
          },
          plan: true,
        },
      })

      return {
        success: true,
        message: "Payment instalment created successfully",
        data: paymentInstalment,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to create payment instalment",
        data: null,
      }
    }
  })

const updatePaymentInstalment = protectedProcedure
  .input(updatePaymentInstalmentSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id, paymentId, planId, instalmentNumber, amountDue, amountPaid } = input

    try {
      const paymentInstalment = await instancePrisma.paymentInstalment.update({
        where: { id },
        data: {
          paymentId,
          planId,
          instalmentNumber,
          amountDue,
          amountPaid,
        },
        include: {
          payment: {
            include: {
              transaction: {
                include: {
                  encounter: true,
                },
              },
            },
          },
          plan: true,
        },
      })

      return {
        success: true,
        message: "Payment instalment updated successfully",
        data: paymentInstalment,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to update payment instalment",
        data: null,
      }
    }
  })

const deletePaymentInstalment = protectedProcedure
  .input(deletePaymentInstalmentSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id } = input

    try {
      const paymentInstalment = await instancePrisma.paymentInstalment.delete({
        where: { id },
      })

      return {
        success: true,
        message: "Payment instalment deleted successfully",
        data: paymentInstalment,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to delete payment instalment",
        data: null,
      }
    }
  })

export const paymentInstalmentsRouter = createTRPCRouter({
  getPaymentInstalments,
  getPaymentInstalment,
  createPaymentInstalment,
  updatePaymentInstalment,
  deletePaymentInstalment,
})