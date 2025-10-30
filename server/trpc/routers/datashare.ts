import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../init'
import { TRPCError } from '@trpc/server'
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

// Helper to get user from auth store (via request context)
function getUserFromAuthStore() {
  // In browser context, the user should be in the auth store
  // Since this is server-side, we'll rely on the client sending user ID in the request
  // This is a temporary solution - ideally authentication should be handled properly
  return null
}

export const dataShareRouter = createTRPCRouter({
  // Create new data share request (Doctor/Nurse)
  createRequest: publicProcedure
    .input(createDataShareRequestSchema.extend({
      requestedBy: z.string().optional(), // Add requestedBy to input since we can't get it from cookies
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { instancePrisma } = ctx

        // For now, we'll need the client to send the user ID
        // This is not ideal but will work until cookies are properly configured
        const requestedBy = input.requestedBy || 'SYSTEM'

        // Validate encounter exists and meets requirements
        if (input.encounterType === 'inpatient') {
          const encounter = await instancePrisma.inpatientEncounter.findUnique({
            where: { id: input.encounterId },
            select: { disposition: true, patientId: true }
          })

          if (!encounter) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Encounter not found',
            })
          }

          // Check if patient is DISCHARGED
          if (encounter.disposition !== 'DISCHARGED') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `Data sharing is only available for DISCHARGED patients. Current status: ${encounter.disposition}`,
            })
          }
        } else if (input.encounterType === 'outpatient') {
          const encounter = await instancePrisma.outpatientEncounter.findUnique({
            where: { id: input.encounterId },
            select: { patientId: true }
          })

          if (!encounter) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Encounter not found',
            })
          }
        }

        // Generate request number: DSR-YYYYMMDD-XXXX
        const now = new Date()
        const dateStr = now.toISOString().split('T')[0].replace(/-/g, '')
        const randomNum = Math.floor(1000 + Math.random() * 9000)
        const requestNumber = `DSR-${dateStr}-${randomNum}`

        // Create the request with patientConsent from input
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
            requestedBy: requestedBy,
            status: 'SUBMITTED', // Automatically submit for review
            selectedData: {}, // Empty for now, will be filled on approval by staff
            patientConsent: input.patientConsent || false, // Use consent from input
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

  // Get single request by ID (alias with different includes for staff review)
  getRequest: publicProcedure
    .input(z.object({ id: z.string() }))
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
            inpatientEncounter: true,
            outpatientEncounter: true,
          },
        })

        if (!request) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Data share request not found',
          })
        }

        // Transform encounters to match expected structure
        const encounters = []
        if (request.inpatientEncounter) {
          encounters.push(request.inpatientEncounter)
        }
        if (request.outpatientEncounter) {
          encounters.push(request.outpatientEncounter)
        }

        // Create simplified staff objects with just ID and name
        const requestedByStaff = request.requestedBy && request.requestedBy !== 'SYSTEM' 
          ? { user: { firstName: 'Staff', lastName: 'Member' } } 
          : null

        const reviewedByStaff = request.reviewedBy && request.reviewedBy !== 'SYSTEM'
          ? { user: { firstName: 'Staff', lastName: 'Reviewer' } }
          : null

        return {
          success: true,
          data: {
            ...request,
            encounters,
            requestedByStaff,
            reviewedByStaff,
          },
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
    .input(approveDataShareRequestSchema.extend({
      reviewedBy: z.string().optional(), // Add reviewedBy to input
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { instancePrisma } = ctx
        const reviewedBy = input.reviewedBy || 'SYSTEM'

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
              reviewedBy: reviewedBy,
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
    .input(denyDataShareRequestSchema.extend({
      reviewedBy: z.string().optional(), // Add reviewedBy to input
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { instancePrisma } = ctx
        const reviewedBy = input.reviewedBy || 'SYSTEM'

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
            reviewedBy: reviewedBy,
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
