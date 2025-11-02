import { createTRPCRouter, publicProcedure } from "../../init"
import { z } from "zod"

// Input schema for getRequests
const getRequestsSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'DENIED', 'EXPIRED']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

const getRequests = publicProcedure
  .input(getRequestsSchema)
  .query(async ({ ctx, input }) => {
    const { instancePrisma } = ctx

    try {
      const skip = (input.page - 1) * input.limit

      const where: any = {}
      if (input.status) {
        where.status = input.status
      }

      const [requests, total] = await Promise.all([
        instancePrisma.dataShareRequest.findMany({
          where,
          skip,
          take: input.limit,
          include: {
            patient: {
              include: {
                user: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }),
        instancePrisma.dataShareRequest.count({ where }),
      ])

      const transformedRequests = requests.map(request => ({
        id: request.id,
        requestNumber: request.requestNumber,
        patientName: `${request.patient.user.firstName} ${request.patient.user.lastName}`,
        patientId: request.patientId,
        hospitalName: request.hospitalName,
        hospitalEmail: request.hospitalEmail,
        hospitalIdentifier: request.hospitalIdentifier,
        reason: request.reason,
        patientConsent: request.patientConsent,
        status: request.status,
        submittedAt: request.submittedAt?.toISOString() || null,
        reviewedAt: request.reviewedAt?.toISOString() || null,
        accessedAt: request.accessedAt?.toISOString() || null,
        createdAt: request.createdAt.toISOString(),
      }))

      return {
        success: true,
        message: "Data share requests fetched successfully",
        data: transformedRequests,
        pagination: {
          total,
          page: input.page,
          limit: input.limit,
          totalPages: Math.ceil(total / input.limit),
        },
      }
    } catch (error) {
      console.error("Error fetching data share requests:", error)
      return {
        success: false,
        message: "Failed to fetch data share requests",
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      }
    }
  })

export const datashareRouter = createTRPCRouter({
  getRequests,
})
