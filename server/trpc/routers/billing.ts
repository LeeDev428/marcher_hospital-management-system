import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "../init"
import { TRPCError } from "@trpc/server"
import { mayaService } from "~/server/services/maya-payment.service"

// ============================================
// SCHEMAS
// ============================================

const createTransactionSchema = z.object({
  encounterId: z.string().uuid(),
  patientId: z.string(),
})

const addLineItemSchema = z.object({
  transactionId: z.string().uuid(),
  itemType: z.enum(["ROOM_CHARGE", "CONSULTATION", "LABORATORY", "RADIOLOGY", "MEDICATION", "PROCEDURE", "SURGERY", "SUPPLIES", "OTHER"]),
  description: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  requiresPreAuth: z.boolean().default(false),
  insuranceCoverable: z.boolean().default(false),
  encounterOrderId: z.string().uuid().optional(),
})

const processPaymentSchema = z.object({
  transactionId: z.string().uuid(),
  amount: z.number().positive(),
  paymentMethod: z.enum(["CASH", "MAYA", "PAYMAYA", "BANK_TRANSFER", "CHECK", "CREDIT_CARD", "DEBIT_CARD"]),
  isPreAuthPayment: z.boolean().default(false),
  lineItemIds: z.array(z.string().uuid()).optional(), // For pre-auth, specify which items
  mayaPaymentId: z.string().optional(),
})

const setupPaymentPlanSchema = z.object({
  transactionId: z.string().uuid(),
  installmentCount: z.number().int().min(2).max(24),
  frequency: z.enum(["WEEKLY", "BI_WEEKLY", "MONTHLY"]),
  setupBy: z.string(),
})

const getTransactionSchema = z.object({
  transactionId: z.string().uuid().optional(),
  patientId: z.string().optional(),
  encounterId: z.string().uuid().optional(),
})

const checkInsuranceCoverageSchema = z.object({
  lineItemId: z.string().uuid(),
  insuranceProvider: z.string(),
  insuranceNumber: z.string(),
})

// ============================================
// BILLING ROUTER
// ============================================

export const billingRouter = createTRPCRouter({
  // Create billing transaction from inpatient encounter
  createTransaction: publicProcedure
    .input(createTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { encounterId, patientId } = input

        // Check if transaction already exists
        const existing = await ctx.instancePrisma.billingTransaction.findUnique({
          where: { encounterId },
        })

        if (existing) {
          return {
            success: false,
            message: "Billing transaction already exists for this encounter",
            data: existing,
          }
        }

        // Generate transaction number
        const now = new Date()
        const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
        const count = await ctx.instancePrisma.billingTransaction.count({
          where: {
            transactionNumber: {
              contains: `BT-${yearMonth}`,
            },
          },
        })
        const transactionNumber = `BT-${yearMonth}-${String(count + 1).padStart(4, '0')}`

        // Create transaction
        const transaction = await ctx.instancePrisma.billingTransaction.create({
          data: {
            transactionNumber,
            patientId,
            encounterId,
            status: "PENDING",
            totalAmount: 0,
            finalAmount: 0,
            balanceAmount: 0,
          },
        })

        return {
          success: true,
          message: "Billing transaction created successfully",
          data: transaction,
        }
      } catch (error) {
        console.error("Error creating billing transaction:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create billing transaction",
        })
      }
    }),

  // Add line item to transaction
  addLineItem: publicProcedure
    .input(addLineItemSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { transactionId, quantity, unitPrice, requiresPreAuth, ...itemData } = input

        // Get transaction
        const transaction = await ctx.instancePrisma.billingTransaction.findUnique({
          where: { id: transactionId },
          include: {
            lineItems: true,
          },
        })

        if (!transaction) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Transaction not found",
          })
        }

        // Check pre-auth status: If transaction has unsettled pre-auth items, can't add new items
        if (transaction.hasPreAuth && !transaction.preAuthSettled) {
          const unpaidPreAuth = transaction.lineItems.find(
            item => item.requiresPreAuth && !item.preAuthPaid
          )
          if (unpaidPreAuth) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message: "Cannot add new items while pre-authorization charges are pending. Please settle or remove existing pre-auth items first.",
            })
          }
        }

        // Calculate prices
        const totalPrice = quantity * unitPrice
        const finalPrice = totalPrice // Will be updated after insurance

        // Create line item
        const lineItem = await ctx.instancePrisma.billingLineItem.create({
          data: {
            transactionId,
            quantity,
            unitPrice,
            totalPrice,
            finalPrice,
            requiresPreAuth,
            ...itemData,
          },
        })

        // Update transaction totals and pre-auth status
        const hasPreAuth = requiresPreAuth || transaction.hasPreAuth
        await ctx.instancePrisma.billingTransaction.update({
          where: { id: transactionId },
          data: {
            hasPreAuth,
            preAuthSettled: hasPreAuth ? false : transaction.preAuthSettled,
            totalAmount: { increment: totalPrice },
            finalAmount: { increment: finalPrice },
            balanceAmount: { increment: finalPrice },
          },
        })

        return {
          success: true,
          message: "Line item added successfully",
          data: lineItem,
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error("Error adding line item:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add line item",
        })
      }
    }),

  // Check insurance coverage for a line item
  checkInsuranceCoverage: publicProcedure
    .input(checkInsuranceCoverageSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { lineItemId, insuranceProvider, insuranceNumber } = input

        // Get line item
        const lineItem = await ctx.instancePrisma.billingLineItem.findUnique({
          where: { id: lineItemId },
        })

        if (!lineItem) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Line item not found",
          })
        }

        if (!lineItem.insuranceCoverable) {
          return {
            success: false,
            message: "This item is not covered by insurance",
            data: null,
          }
        }

        // TODO: Integrate with actual insurance API to check coverage
        // For now, mock coverage based on item type
        const coverageMap: Record<string, number> = {
          SURGERY: 60,
          PROCEDURE: 50,
          LABORATORY: 40,
          RADIOLOGY: 45,
          MEDICATION: 30,
          CONSULTATION: 20,
          ROOM_CHARGE: 35,
          SUPPLIES: 15,
          OTHER: 10,
        }

        const coveragePercentage = coverageMap[lineItem.itemType] || 0
        const coverageAmount = Number(lineItem.totalPrice) * (coveragePercentage / 100)
        const finalPrice = Number(lineItem.totalPrice) - coverageAmount

        // Create or update insurance coverage
        const coverage = await ctx.instancePrisma.insuranceCoverage.upsert({
          where: { lineItemId },
          create: {
            lineItemId,
            insuranceProvider,
            insuranceNumber,
            coveragePercentage,
            coverageAmount,
            claimStatus: "PENDING",
          },
          update: {
            insuranceProvider,
            insuranceNumber,
            coveragePercentage,
            coverageAmount,
          },
        })

        // Update line item with insurance discount
        await ctx.instancePrisma.billingLineItem.update({
          where: { id: lineItemId },
          data: {
            insuranceDiscount: coverageAmount,
            finalPrice,
          },
        })

        // Update transaction totals
        const transaction = await ctx.instancePrisma.billingTransaction.findUnique({
          where: { id: lineItem.transactionId },
          include: { lineItems: true },
        })

        if (transaction) {
          const totalInsuranceDiscount = transaction.lineItems.reduce(
            (sum, item) => sum + Number(item.insuranceDiscount),
            0
          )
          const finalAmount = Number(transaction.totalAmount) - totalInsuranceDiscount

          await ctx.instancePrisma.billingTransaction.update({
            where: { id: transaction.id },
            data: {
              insuranceDiscount: totalInsuranceDiscount,
              finalAmount,
              balanceAmount: finalAmount - Number(transaction.paidAmount),
            },
          })
        }

        return {
          success: true,
          message: `Insurance will cover ${coveragePercentage}% (${coverageAmount.toFixed(2)})`,
          data: coverage,
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error("Error checking insurance coverage:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to check insurance coverage",
        })
      }
    }),

  // Process payment
  processPayment: publicProcedure
    .input(processPaymentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { transactionId, amount, paymentMethod, isPreAuthPayment, lineItemIds, mayaPaymentId } = input

        // Get transaction
        const transaction = await ctx.instancePrisma.billingTransaction.findUnique({
          where: { id: transactionId },
          include: { lineItems: true },
        })

        if (!transaction) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Transaction not found",
          })
        }

        // Generate payment number
        const now = new Date()
        const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
        const count = await ctx.instancePrisma.billingPayment.count({
          where: {
            paymentNumber: {
              contains: `PAY-${yearMonth}`,
            },
          },
        })
        const paymentNumber = `PAY-${yearMonth}-${String(count + 1).padStart(4, '0')}`

        // If Maya payment method, create checkout and return URL
        if (paymentMethod === "MAYA" && !mayaPaymentId) {
          // Get patient info for Maya checkout
          const patient = await ctx.instancePrisma.patient.findUnique({
            where: { id: transaction.patientId },
            include: { user: true },
          })

          if (!patient) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Patient not found",
            })
          }

          // Create Maya checkout
          const mayaPayment = await mayaService.createOneTimePayment({
            amount,
            description: `Hospital Bill Payment - ${transaction.transactionNumber}`,
            buyerName: `${patient.user.firstName} ${patient.user.lastName}`,
            buyerEmail: patient.user.email || "",
            buyerPhone: patient.user.phone || "",
            referenceNumber: paymentNumber,
          })

          if (!mayaPayment.success) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: mayaPayment.error || "Failed to create Maya checkout",
            })
          }

          // Create pending payment record
          const pendingPayment = await ctx.instancePrisma.billingPayment.create({
            data: {
              paymentNumber,
              transactionId,
              amount,
              paymentMethod,
              paymentType: "ONE_TIME",
              isPreAuthPayment,
              mayaPaymentId: mayaPayment.checkoutId,
              mayaPaymentStatus: "FOR_AUTHENTICATION",
              status: "PENDING",
            },
          })

          return {
            success: true,
            checkoutUrl: mayaPayment.checkoutUrl,
            checkoutId: mayaPayment.checkoutId,
            paymentNumber,
            message: "Redirecting to Maya checkout...",
          }
        }

        // Create payment (for cash, check, bank transfer, or completed Maya payment)
        const payment = await ctx.instancePrisma.billingPayment.create({
          data: {
            paymentNumber,
            transactionId,
            amount,
            paymentMethod,
            paymentType: "ONE_TIME",
            isPreAuthPayment,
            mayaPaymentId,
            mayaPaymentStatus: mayaPaymentId ? "COMPLETED" : undefined,
            status: "COMPLETED",
            paidAt: new Date(),
          },
        })

        // If pre-auth payment, mark specified line items as paid
        if (isPreAuthPayment && lineItemIds && lineItemIds.length > 0) {
          await ctx.instancePrisma.billingLineItem.updateMany({
            where: {
              id: { in: lineItemIds },
              transactionId,
              requiresPreAuth: true,
            },
            data: {
              preAuthPaid: true,
              preAuthPaymentId: payment.id,
            },
          })

          // Check if all pre-auth items are now paid
          const remainingPreAuth = transaction.lineItems.filter(
            item => item.requiresPreAuth && !lineItemIds.includes(item.id) && !item.preAuthPaid
          )

          if (remainingPreAuth.length === 0) {
            await ctx.instancePrisma.billingTransaction.update({
              where: { id: transactionId },
              data: { preAuthSettled: true },
            })
          }
        }

        // Update transaction paid amount and status
        const newPaidAmount = Number(transaction.paidAmount) + amount
        const newBalanceAmount = Number(transaction.finalAmount) - newPaidAmount
        const newStatus = newBalanceAmount <= 0 ? "PAID" : 
                         newPaidAmount > 0 ? "PARTIALLY_PAID" : "PENDING"

        await ctx.instancePrisma.billingTransaction.update({
          where: { id: transactionId },
          data: {
            paidAmount: newPaidAmount,
            balanceAmount: Math.max(0, newBalanceAmount),
            status: newStatus,
          },
        })

        return {
          success: true,
          message: "Payment processed successfully",
          data: payment,
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error("Error processing payment:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process payment",
        })
      }
    }),

  // Setup payment plan
  setupPaymentPlan: publicProcedure
    .input(setupPaymentPlanSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { transactionId, installmentCount, frequency, setupBy } = input

        // Get transaction
        const transaction = await ctx.instancePrisma.billingTransaction.findUnique({
          where: { id: transactionId },
          include: { lineItems: true },
        })

        if (!transaction) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Transaction not found",
          })
        }

        // Payment plans only for non-pre-auth items
        const preAuthAmount = transaction.lineItems
          .filter(item => item.requiresPreAuth)
          .reduce((sum, item) => sum + Number(item.finalPrice), 0)

        const eligibleAmount = Number(transaction.finalAmount) - preAuthAmount

        if (eligibleAmount <= 0) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "No eligible amount for payment plan. Pre-authorization items must be paid upfront.",
          })
        }

        const installmentAmount = eligibleAmount / installmentCount

        // Calculate next due date based on frequency
        const startDate = new Date()
        const nextDueDate = new Date(startDate)
        switch (frequency) {
          case "WEEKLY":
            nextDueDate.setDate(nextDueDate.getDate() + 7)
            break
          case "BI_WEEKLY":
            nextDueDate.setDate(nextDueDate.getDate() + 14)
            break
          case "MONTHLY":
            nextDueDate.setMonth(nextDueDate.getMonth() + 1)
            break
        }

        // Create payment plan
        const paymentPlan = await ctx.instancePrisma.paymentPlan.create({
          data: {
            transactionId,
            totalAmount: eligibleAmount,
            installmentCount,
            installmentAmount,
            frequency,
            remainingAmount: eligibleAmount,
            status: "ACTIVE",
            startDate,
            nextDueDate,
            setupBy,
          },
        })

        // Update transaction
        await ctx.instancePrisma.billingTransaction.update({
          where: { id: transactionId },
          data: { hasPaymentPlan: true },
        })

        return {
          success: true,
          message: "Payment plan created successfully",
          data: paymentPlan,
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error("Error setting up payment plan:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to setup payment plan",
        })
      }
    }),

  // Get transaction details
  getTransaction: publicProcedure
    .input(getTransactionSchema)
    .query(async ({ ctx, input }) => {
      try {
        const whereClause: any = {}
        if (input.transactionId) whereClause.id = input.transactionId
        if (input.patientId) whereClause.patientId = input.patientId
        if (input.encounterId) whereClause.encounterId = input.encounterId

        const transaction = await ctx.instancePrisma.billingTransaction.findFirst({
          where: whereClause,
          include: {
            patient: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
              },
            },
            encounter: {
              select: {
                date: true,
                chiefComplaint: true,
                disposition: true,
              },
            },
            lineItems: {
              include: {
                insuranceCoverage: true,
              },
              orderBy: {
                createdAt: "asc",
              },
            },
            payments: {
              orderBy: {
                createdAt: "desc",
              },
            },
            paymentPlan: true,
          },
        })

        if (!transaction) {
          return {
            success: false,
            message: "Transaction not found",
            data: null,
          }
        }

        return {
          success: true,
          message: "Transaction retrieved successfully",
          data: transaction,
        }
      } catch (error) {
        console.error("Error getting transaction:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get transaction",
        })
      }
    }),

  // Get patient bills (legacy - for compatibility)
  getPatientBills: publicProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const transactions = await ctx.instancePrisma.billingTransaction.findMany({
          where: { patientId: input.patientId },
          include: {
            encounter: true,
            lineItems: true,
          },
          orderBy: { createdAt: "desc" },
        })

        const bills = transactions.map(tx => ({
          id: tx.id,
          transactionId: tx.transactionNumber,
          date: new Date(tx.createdAt).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          }),
          items: `${tx.lineItems.length} item(s)`,
          cost: Number(tx.finalAmount),
          status: tx.status === "PAID" ? "completed" : "unsettled",
          settledAtISO: tx.status === "PAID" ? tx.updatedAt.toISOString() : null,
          createdAt: tx.createdAt,
        }))

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
    }),

  // Legacy endpoint
  getBilling: publicProcedure.query(() => ({ success: true, data: [] }))
})