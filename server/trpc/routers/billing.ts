import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "../init"

// Schema for getting patient bills
const getPatientBillsSchema = z.object({
  patientId: z.string(),
})

// Schema for processing payment
const processPaymentSchema = z.object({
  billId: z.string(),
  paymentMethod: z.enum(["paymaya", "maya"]),
  amount: z.number(),
})

export const billingRouter = createTRPCRouter({
  // Get all bills for a patient (based on appointments and medical services)
  getPatientBills: publicProcedure
    .input(getPatientBillsSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { patientId } = input

        // Get patient's appointments with medical services
        const appointments = await ctx.instancePrisma.appointment.findMany({
          where: {
            userId: patientId,
            status: {
              in: ["COMPLETED", "SCHEDULED", "PENDING"],
            },
          },
          include: {
            medicalService: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        })

        // Transform appointments into bills
        const bills = appointments.map((apt) => ({
          id: apt.id,
          transactionId: `APT-${apt.id.slice(-8).toUpperCase()}`,
          date: new Date(apt.date).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          }),
          items: apt.medicalService?.name || "Consultation",
          cost: apt.medicalService?.price ? Number(apt.medicalService.price) : 0,
          status: apt.status === "COMPLETED" ? "completed" : "unsettled",
          settledAtISO: apt.status === "COMPLETED" ? apt.updatedAt.toISOString() : null,
          appointmentId: apt.id,
          createdAt: apt.createdAt,
        }))

        return {
          success: true,
          message: "Patient bills fetched successfully",
          data: bills,
        }
      } catch (error) {
        console.error("Error fetching patient bills:", error)
        return {
          success: false,
          message: "Failed to fetch patient bills",
          data: [],
        }
      }
    }),

  // Process payment
  processPayment: publicProcedure
    .input(processPaymentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { billId, paymentMethod, amount } = input

        // Update appointment status to COMPLETED (simulating payment)
        const appointment = await ctx.instancePrisma.appointment.update({
          where: {
            id: billId,
          },
          data: {
            status: "COMPLETED",
            notes: `Paid via ${paymentMethod} on ${new Date().toISOString()}`,
          },
        })

        return {
          success: true,
          message: "Payment processed successfully",
          data: {
            billId,
            paymentMethod,
            amount,
            paidAt: new Date().toISOString(),
          },
        }
      } catch (error) {
        console.error("Error processing payment:", error)
        return {
          success: false,
          message: "Failed to process payment",
          data: null,
        }
      }
    }),
  
  // Legacy endpoint - kept for compatibility
  getBilling: publicProcedure.query(() => ({ success: true, data: [] }))
})