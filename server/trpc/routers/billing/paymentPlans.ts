import { 
  createPaymentPlanSchema, 
  deletePaymentPlanSchema,
  getPaymentPlanSchema, 
  updatePaymentPlanSchema 
} from "~/types/billing"
import { createTRPCRouter, publicProcedure } from "../../init"

const getPaymentPlans = publicProcedure.query(async ({ ctx }) => {
  const { instancePrisma } = ctx

  try {
    const paymentPlans = await instancePrisma.paymentPlan.findMany({
      include: {
        _count: {
          select: {
            instalments: true,
          },
        },
      },
    })

    return {
      success: true,
      message: "Payment plans fetched successfully",
      data: paymentPlans,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: "Failed to fetch payment plans",
      data: null,
    }
  }
})

const getPaymentPlan = publicProcedure
  .input(getPaymentPlanSchema)
  .query(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id } = input

    try {
      const paymentPlan = await instancePrisma.paymentPlan.findUnique({
        where: { id },
        include: {
          instalments: {
            include: {
              payment: {
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
              },
            },
          },
        },
      })

      return {
        success: true,
        message: "Payment plan fetched successfully",
        data: paymentPlan,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to fetch payment plan",
        data: null,
      }
    }
  })

const createPaymentPlan = publicProcedure
  .input(createPaymentPlanSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { name, description, cycle, numberOfPayments } = input

    try {
      const paymentPlan = await instancePrisma.paymentPlan.create({
        data: {
          name,
          description,
          cycle,
          numberOfPayments,
        },
      })

      return {
        success: true,
        message: "Payment plan created successfully",
        data: paymentPlan,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to create payment plan",
        data: null,
      }
    }
  })

const updatePaymentPlan = publicProcedure
  .input(updatePaymentPlanSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id, name, description, cycle, numberOfPayments } = input

    try {
      const paymentPlan = await instancePrisma.paymentPlan.update({
        where: { id },
        data: {
          name,
          description,
          cycle,
          numberOfPayments,
        },
      })

      return {
        success: true,
        message: "Payment plan updated successfully",
        data: paymentPlan,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to update payment plan",
        data: null,
      }
    }
  })

const deletePaymentPlan = publicProcedure
  .input(deletePaymentPlanSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id } = input

    try {
      const paymentPlan = await instancePrisma.paymentPlan.delete({
        where: { id },
      })

      return {
        success: true,
        message: "Payment plan deleted successfully",
        data: paymentPlan,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "Failed to delete payment plan",
        data: null,
      }
    }
  })

export const paymentPlansRouter = createTRPCRouter({
  getPaymentPlans,
  getPaymentPlan,
  createPaymentPlan,
  updatePaymentPlan,
  deletePaymentPlan,
})
