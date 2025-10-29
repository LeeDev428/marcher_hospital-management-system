import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../init'
import { TRPCError } from '@trpc/server'
import { getCookie } from 'h3'
import { verifyAccessToken, verifyRefreshToken } from '~/util/token'
import {
  createDataShareRequestSchema,
  getDataShareRequestsSchema,
  getDataShareRequestByIdSchema,
  submitDataShareRequestSchema,
  approveDataShareRequestSchema,
  denyDataShareRequestSchema,
  verifyDataShareTokenSchema,
} from '~/types/datashare'
import {
  sendDataShareRequestEmail,
  sendDataShareApprovedEmail,
  sendDataShareDeniedEmail,
  sendPatientDataShareNotification,
} from '~/util/email/sendDataShareEmails'
import { generateSecureToken } from '~/util/token/generateToken'

// Helper to get user from cookies
function getUserFromContext(ctx: any): { id: string; email: string; role: string } | null {
  try {
    const refreshToken = getCookie(ctx.event, 'refreshToken')
    if (!refreshToken) return null
    
    const decoded = verifyRefreshToken(refreshToken)
    return decoded as { id: string; email: string; role: string } | null
  } catch {
    return null
  }
}

export const dataShareRouter = createTRPCRouter({
  // Create new data share request (Doctor/Nurse)
  createRequest: publicProcedure
    .input(createDataShareRequestSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { instancePrisma } = ctx
        
        // Get user from cookies
        const user = getUserFromContext(ctx)
        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to create a data share request',
          })
        }

        // Generate request number: DSR-YYYYMMDD-XXXX
        const now = new Date()
        const dateStr = now.toISOString().split('T')[0].replace(/-/g, '')
        const randomNum = Math.floor(1000 + Math.random() * 9000)
        const requestNumber = `DSR-${dateStr}-${randomNum}`

        // Create the request
        const request = await instancePrisma.dataShareRequest.create({
          data: {
            requestNumber,
            patientId: input.patientId,
            inpatientEncounterId: input.encounterType === 'inpatient' ? input.encounterId : null,
            outpatientEncounterId: input.encounterType === 'outpatient' ? input.encounterId : null,
            hospitalIdentifier: input.hospitalIdentifier,
            hospitalName: input.hospitalName,
            hospitalEmail: input.hospitalEmail,
            reason: input.reason,
            requestNotes: input.requestNotes || null,
            requestedBy: user.id,
            status: 'SUBMITTED', // Automatically submit for review
            selectedData: {}, // Empty for now, will be filled on approval
            submittedAt: now,
          },
          include: {
            patient: {
              include: {
                user: true,
              },
            },
          },
        })

        // Send email to hospital
        await sendDataShareRequestEmail({
          to: input.hospitalEmail,
          requestNumber,
          patientName: `${request.patient.user.firstName} ${request.patient.user.lastName}`,
          hospitalName: input.hospitalName,
          reason: input.reason,
        })

        return {
          success: true,
          message: 'Data share request created and submitted for review',
          data: request,
        }
      } catch (error: any) {
        console.error('Error creating data share request:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to create data share request',
        })
      }
    }),

  // Get all requests (for staff review dashboard)
  getRequests: publicProcedure
    .input(getDataShareRequestsSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { instancePrisma } = ctx

        const where: any = {}
        if (input.status) {
          where.status = input.status
        }

        const [requests, total] = await Promise.all([
          instancePrisma.dataShareRequest.findMany({
            where,
            include: {
              patient: {
                include: {
                  user: true,
                },
              },
              inpatientEncounter: true,
              outpatientEncounter: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
            skip: (input.page - 1) * input.limit,
            take: input.limit,
          }),
          instancePrisma.dataShareRequest.count({ where }),
        ])

        return {
          success: true,
          data: requests,
          pagination: {
            page: input.page,
            limit: input.limit,
            total,
            pages: Math.ceil(total / input.limit),
          },
        }
      } catch (error: any) {
        console.error('Error fetching data share requests:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to fetch data share requests',
        })
      }
    }),

  // Get single request by ID
  getRequestById: publicProcedure
    .input(getDataShareRequestByIdSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { instancePrisma } = ctx

        const request = await instancePrisma.dataShareRequest.findUnique({
          where: { id: input.id },
          include: {
            patient: {
              include: {
                user: true,
              },
            },
            inpatientEncounter: {
              include: {
                charts: true,
                orders: true,
              },
            },
            outpatientEncounter: true,
            documents: true,
            accessTokens: true,
          },
        })

        if (!request) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Data share request not found',
          })
        }

        return {
          success: true,
          data: request,
        }
      } catch (error: any) {
        console.error('Error fetching data share request:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to fetch data share request',
        })
      }
    }),

  // Approve request (Staff)
  approveRequest: publicProcedure
    .input(approveDataShareRequestSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { instancePrisma } = ctx
        
        // Get user from cookies
        const user = getUserFromContext(ctx)
        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to approve requests',
          })
        }

        // Get the request
        const request = await instancePrisma.dataShareRequest.findUnique({
          where: { id: input.id },
          include: {
            patient: {
              include: {
                user: true,
              },
            },
          },
        })

        if (!request) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Request not found',
          })
        }

        if (request.status !== 'SUBMITTED') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Only submitted requests can be approved',
          })
        }

        // Generate access token
        const token = generateSecureToken()
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

        // Update request and create access token
        const [updatedRequest, accessToken] = await Promise.all([
          instancePrisma.dataShareRequest.update({
            where: { id: input.id },
            data: {
              status: 'APPROVED',
              reviewedBy: user.id,
              reviewedAt: new Date(),
              selectedData: input.selectedData,
              reviewNotes: input.staffNotes,
            },
          }),
          instancePrisma.dataShareAccessToken.create({
            data: {
              requestId: input.id,
              token,
              recipientEmail: request.hospitalEmail,
              expiresAt,
            },
          }),
        ])

        // Create access link
        const accessLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/data-share-guest?token=${token}`

        // Send approval email to hospital
        await sendDataShareApprovedEmail({
          to: request.hospitalEmail,
          requestNumber: request.requestNumber,
          patientName: `${request.patient.user.firstName} ${request.patient.user.lastName}`,
          accessLink,
          expiresAt,
        })

        // Send notification to patient
        if (request.patient.user.email) {
          await sendPatientDataShareNotification({
            to: request.patient.user.email,
            patientName: `${request.patient.user.firstName} ${request.patient.user.lastName}`,
            hospitalName: request.hospitalName,
            requestNumber: request.requestNumber,
          })
        }

        return {
          success: true,
          message: 'Request approved and emails sent',
          data: { request: updatedRequest, accessToken },
        }
      } catch (error: any) {
        console.error('Error approving request:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to approve request',
        })
      }
    }),

  // Deny request (Staff)
  denyRequest: publicProcedure
    .input(denyDataShareRequestSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { instancePrisma } = ctx
        
        // Get user from cookies
        const user = getUserFromContext(ctx)
        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in',
          })
        }

        // Get the request
        const request = await instancePrisma.dataShareRequest.findUnique({
          where: { id: input.id },
          include: {
            patient: {
              include: {
                user: true,
              },
            },
          },
        })

        if (!request) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Request not found',
          })
        }

        if (request.status !== 'SUBMITTED') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Only submitted requests can be denied',
          })
        }

        // Update request
        const updatedRequest = await instancePrisma.dataShareRequest.update({
          where: { id: input.id },
          data: {
            status: 'DENIED',
            reviewedBy: user.id,
            reviewedAt: new Date(),
            denialReason: input.denialReason,
          },
        })

        // Send denial email to hospital
        await sendDataShareDeniedEmail({
          to: request.hospitalEmail,
          requestNumber: request.requestNumber,
          patientName: `${request.patient.user.firstName} ${request.patient.user.lastName}`,
          denialReason: input.denialReason,
        })

        return {
          success: true,
          message: 'Request denied and email sent',
          data: updatedRequest,
        }
      } catch (error: any) {
        console.error('Error denying request:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to deny request',
        })
      }
    }),

  // Verify access token (Public - for hospital access)
  verifyToken: publicProcedure
    .input(verifyDataShareTokenSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { instancePrisma } = ctx

        const accessToken = await instancePrisma.dataShareAccessToken.findUnique({
          where: { token: input.token },
          include: {
            request: {
              include: {
                patient: {
                  include: {
                    user: true,
                  },
                },
                inpatientEncounter: {
                  include: {
                    charts: true,
                    orders: true,
                  },
                },
                outpatientEncounter: true,
              },
            },
          },
        })

        if (!accessToken) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Invalid or expired access token',
          })
        }

        if (accessToken.usedAt) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'This access token has already been used',
          })
        }

        if (new Date() > accessToken.expiresAt) {
          // Update request status to expired
          await instancePrisma.dataShareRequest.update({
            where: { id: accessToken.requestId },
            data: { status: 'EXPIRED' },
          })

          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'This access token has expired',
          })
        }

        if (accessToken.request.status !== 'APPROVED') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'This request has not been approved',
          })
        }

        // Mark token as used and update request status
        await Promise.all([
          instancePrisma.dataShareAccessToken.update({
            where: { id: accessToken.id },
            data: { usedAt: new Date() },
          }),
          instancePrisma.dataShareRequest.update({
            where: { id: accessToken.requestId },
            data: { 
              status: 'ACCESSED',
              accessedAt: new Date(),
            },
          }),
        ])

        return {
          success: true,
          data: accessToken.request,
        }
      } catch (error: any) {
        console.error('Error verifying token:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to verify access token',
        })
      }
    }),
})
