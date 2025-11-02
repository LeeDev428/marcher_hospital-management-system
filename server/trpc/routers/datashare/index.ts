import { createTRPCRouter, publicProcedure } from "../../init"

const getRequests = publicProcedure.query(async ({ ctx }) => {
  const { instancePrisma } = ctx

  try {
    const requests = await instancePrisma.dataShareRequest.findMany({
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
    })

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
    }
  } catch (error) {
    console.error("Error fetching data share requests:", error)
    return {
      success: false,
      message: "Failed to fetch data share requests",
      data: [],
    }
  }
})

export const datashareRouter = createTRPCRouter({
  getRequests,
})
