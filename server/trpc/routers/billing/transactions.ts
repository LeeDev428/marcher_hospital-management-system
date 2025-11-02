import { 
  createTransactionSchema, 
  deleteTransactionSchema,
  getTransactionSchema, 
  updateTransactionSchema 
} from "~/types/billing"
import { z } from "zod"
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

// Get all bills (for admin/staff)
const getAllBills = publicProcedure
  .query(async ({ ctx }) => {
    const { instancePrisma } = ctx

    try {
      const bills = await instancePrisma.billingTransaction.findMany({
        include: {
          lineItems: true,
          payments: true,
          patient: {
            include: {
              user: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      return {
        success: true,
        message: "Bills fetched successfully",
        data: bills,
      }
    } catch (error) {
      console.error("Error fetching bills:", error)
      return {
        success: false,
        message: "Failed to fetch bills",
        data: [],
      }
    }
  })

// Create new bill
const createBill = publicProcedure
  .input(z.object({
    patientId: z.string(),
    encounterId: z.string().optional(),
    items: z.array(z.object({
      itemType: z.enum(['ROOM_CHARGE', 'CONSULTATION', 'LABORATORY', 'RADIOLOGY', 'MEDICATION', 'PROCEDURE', 'SURGERY', 'SUPPLIES', 'OTHER']),
      description: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      requiresPreAuth: z.boolean().optional()
    }))
  }))
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx

    try {
      // Calculate total
      const totalAmount = input.items.reduce(
        (sum, item) => sum + (item.quantity * item.unitPrice), 
        0
      )
      
      // Generate transaction number
      const transactionNumber = `TXN-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
      
      // Create billing transaction with line items
      const transaction = await instancePrisma.billingTransaction.create({
        data: {
          patientId: input.patientId,
          encounterId: input.encounterId && input.encounterId !== 'no-encounter' ? input.encounterId : undefined,
          transactionNumber,
          totalAmount,
          insuranceDiscount: 0,
          finalAmount: totalAmount,
          paidAmount: 0,
          balanceAmount: totalAmount,
          status: 'PENDING',
          hasPreAuth: input.items.some(item => item.requiresPreAuth),
          preAuthSettled: false,
          hasPaymentPlan: false,
          lineItems: {
            create: input.items.map(item => {
              const itemTotal = item.quantity * item.unitPrice
              return {
                itemType: item.itemType,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: itemTotal,
                finalPrice: itemTotal, // No insurance discount yet
                requiresPreAuth: item.requiresPreAuth ?? false,
                insuranceCoverable: false,
                insuranceDiscount: 0
              }
            })
          }
        },
        include: {
          lineItems: true,
          patient: {
            include: {
              user: true
            }
          }
        }
      })
      
      return {
        success: true,
        message: `Bill created successfully: ${transactionNumber}`,
        data: transaction
      }
    } catch (error: any) {
      console.error("Error creating bill:", error)
      return {
        success: false,
        message: error.message || "Failed to create bill",
        data: null
      }
    }
  })

// Get patient bills (for patient billing page)
const getPatientBills = publicProcedure
  .input(z.object({ patientId: z.string() })) // Actually accepts userId
  .query(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { patientId: userId } = input

    try {
      // First, find the patient by userId
      const patient = await instancePrisma.patient.findFirst({
        where: { userId }
      })
      
      if (!patient) {
        return {
          success: false,
          message: "Patient not found",
          data: [],
        }
      }
      
      // Then get bills for this patient
      const bills = await instancePrisma.billingTransaction.findMany({
        where: { patientId: patient.id },
        include: {
          lineItems: true,
          payments: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      // Transform to match frontend format
      const transformedBills = bills.map(bill => ({
        id: bill.id, // Use actual UUID for API calls
        transactionId: bill.transactionNumber, // Display this to users
        items: bill.lineItems.map(item => item.description).join(', '),
        cost: Number(bill.balanceAmount),
        date: bill.createdAt.toLocaleDateString('en-PH'),
        status: bill.status === 'PAID' ? 'completed' : 'unsettled',
        settledAtISO: bill.status === 'PAID' ? bill.updatedAt.toISOString() : null
      }))
      
      return {
        success: true,
        message: "Patient bills fetched successfully",
        data: transformedBills,
      }
    } catch (error) {
      console.error("Error fetching patient bills:", error)
      return {
        success: false,
        message: "Failed to fetch patient bills",
        data: [],
      }
    }
  })

// Process Payment - Create Maya checkout session
const processPayment = publicProcedure
  .input(
    z.object({
      billId: z.string(),
      paymentMethod: z.string(),
      amount: z.number(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { billId, paymentMethod, amount } = input

    try {
      // Get bill details
      const bill = await instancePrisma.billingTransaction.findUnique({
        where: { id: billId },
        include: {
          patient: {
            include: {
              user: true,
            },
          },
          lineItems: true,
        },
      })

      if (!bill) {
        return {
          success: false,
          message: "Bill not found",
        }
      }

      // Import Maya service
      const { mayaService } = await import("~/server/services/maya-payment.service")

      // Create checkout session
      const result = await mayaService.createOneTimePayment({
        amount: amount,
        currency: "PHP",
        description: `Hospital Bill Payment - ${bill.transactionNumber}`,
        buyerName: `${bill.patient.user.firstName} ${bill.patient.user.lastName}`,
        buyerEmail: bill.patient.user.email,
        buyerPhone: bill.patient.user.phone || "",
        referenceNumber: bill.transactionNumber,
      })

      if (!result.success) {
        return {
          success: false,
          message: result.error || "Failed to create payment session",
        }
      }

      // Generate unique payment number
      const now = new Date()
      const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
      const timestamp = Date.now().toString().slice(-6)
      const paymentNumber = `PAY-${yearMonth}-${timestamp}`

      // Create payment record with PENDING status
      await instancePrisma.billingPayment.create({
        data: {
          paymentNumber: paymentNumber,
          transactionId: billId,
          amount: amount.toString(),
          paymentMethod: "MAYA",
          paymentType: "ONE_TIME",
          mayaPaymentId: result.checkoutId || "",
          mayaPaymentStatus: "PENDING",
          status: "PENDING",
          isPreAuthPayment: false,
        },
      })

      return {
        success: true,
        message: "Payment session created",
        checkoutUrl: result.checkoutUrl,
        checkoutId: result.checkoutId,
      }
    } catch (error) {
      console.error("Process payment error:", error)
      return {
        success: false,
        message: "Failed to process payment",
      }
    }
  })

export const transactionsRouter = createTRPCRouter({
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getAllBills,     // NEW: Get all bills
  createBill,      // NEW: Create bill endpoint
  getPatientBills,
  processPayment,  // NEW: Process Maya payment
})
