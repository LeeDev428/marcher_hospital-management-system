import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../init'
import { TRPCError } from '@trpc/server'
import { 
  createInsuranceClaimSchema,
  uploadInsuranceDocumentSchema,
  submitInsuranceClaimSchema,
  reviewInsuranceClaimSchema,
  getInsuranceClaimsSchema,
  getInsuranceClaimSchema,
  verifyInsuranceTokenSchema,
  cancelInsuranceClaimSchema,
  deleteInsuranceDocumentSchema,
} from '~/types/insurance/claim'
import { generateSecureToken } from '~/util/token/generateToken'
import { sendInsuranceTokenEmail } from '~/util/email/sendInsuranceToken'

export const insuranceRouter = createTRPCRouter({
  // Create a new insurance claim
  createClaim: publicProcedure
    .input(createInsuranceClaimSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { instancePrisma } = ctx

        // Check if a claim already exists for this encounter
        const existingClaim = await instancePrisma.insuranceClaim.findFirst({
          where: input.encounterType === 'inpatient'
            ? { inpatientEncounterId: input.encounterId }
            : { outpatientEncounterId: input.encounterId }
        })

        if (existingClaim) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'An insurance claim already exists for this encounter. Please edit the existing claim instead.',
          })
        }

        // Get current date for claim number generation
        const now = new Date()
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
        
        // Count claims today to generate unique number
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const claimsToday = await instancePrisma.insuranceClaim.count({
          where: {
            createdAt: {
              gte: todayStart,
            },
          },
        })

        const claimNumber = `INS-${dateStr}-${String(claimsToday + 1).padStart(4, '0')}`

        // Create the insurance claim
        const claim = await instancePrisma.insuranceClaim.create({
          data: {
            claimNumber,
            patientId: input.patientId,
            ...(input.encounterType === 'inpatient' 
              ? { inpatientEncounterId: input.encounterId }
              : { outpatientEncounterId: input.encounterId }
            ),
            insuranceProvider: input.insuranceProvider,
            insuranceNumber: input.insuranceNumber,
            policyNumber: input.policyNumber,
            claimAmount: input.claimAmount,
            billingStaffNotes: input.billingStaffNotes,
            createdBy: input.createdBy,
            status: 'PENDING',
          },
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

        return {
          success: true,
          message: 'Insurance claim created successfully',
          data: claim,
        }
      } catch (error: any) {
        console.error('Error creating insurance claim:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to create insurance claim',
        })
      }
    }),

  // Upload document to a claim
  uploadDocument: publicProcedure
    .input(uploadInsuranceDocumentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { instancePrisma } = ctx

        // Verify claim exists
        const claim = await instancePrisma.insuranceClaim.findUnique({
          where: { id: input.claimId },
        })

        if (!claim) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Insurance claim not found',
          })
        }

        if (claim.status !== 'PENDING') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cannot upload documents to a claim that has been submitted',
          })
        }

        // Create document record
        const document = await instancePrisma.insuranceDocument.create({
          data: {
            claimId: input.claimId,
            documentType: input.documentType,
            fileName: input.fileName,
            fileUrl: input.fileUrl,
            fileSize: input.fileSize,
            mimeType: input.mimeType,
            description: input.description,
            uploadedBy: input.uploadedBy,
          },
        })

        return {
          success: true,
          message: 'Document uploaded successfully',
          data: document,
        }
      } catch (error: any) {
        console.error('Error uploading document:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to upload document',
        })
      }
    }),

  // Submit claim to insurance company (generates token and sends email)
  submitClaim: publicProcedure
    .input(submitInsuranceClaimSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { instancePrisma } = ctx

        // Verify claim exists and has documents
        const claim = await instancePrisma.insuranceClaim.findUnique({
          where: { id: input.claimId },
          include: {
            documents: true,
            patient: {
              include: {
                user: true,
              },
            },
            inpatientEncounter: true,
            outpatientEncounter: true,
          },
        })

        if (!claim) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Insurance claim not found',
          })
        }

        if (claim.documents.length === 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cannot submit claim without documents',
          })
        }

        if (claim.status !== 'PENDING') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Claim has already been submitted',
          })
        }

        // Generate secure token
        const token = generateSecureToken()
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + input.expirationDays)

        // Create access token
        const accessToken = await instancePrisma.insuranceAccessToken.create({
          data: {
            claimId: input.claimId,
            token,
            recipientEmail: input.recipientEmail,
            expiresAt,
          },
        })

        // Update claim status
        await instancePrisma.insuranceClaim.update({
          where: { id: input.claimId },
          data: {
            status: 'SUBMITTED',
            submittedAt: new Date(),
          },
        })

        // Send email with token link
        const accessLink = `${process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/insurance-guess?token=${token}`
        
        await sendInsuranceTokenEmail({
          to: input.recipientEmail,
          claimNumber: claim.claimNumber,
          patientName: `${claim.patient.user.firstName} ${claim.patient.user.lastName}`,
          accessLink,
          expiresAt,
        })

        return {
          success: true,
          message: 'Claim submitted and email sent to insurance company',
          data: {
            token: accessToken.token,
            expiresAt: accessToken.expiresAt,
          },
        }
      } catch (error: any) {
        console.error('Error submitting claim:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to submit claim',
        })
      }
    }),

  // Verify insurance access token
  verifyToken: publicProcedure
    .input(verifyInsuranceTokenSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { instancePrisma } = ctx

        const accessToken = await instancePrisma.insuranceAccessToken.findUnique({
          where: { token: input.token },
          include: {
            claim: {
              include: {
                patient: {
                  include: {
                    user: true,
                  },
                },
                documents: true,
                inpatientEncounter: {
                  include: {
                    charts: true,
                    orders: {
                      include: {
                        catalogueItem: true,
                      },
                    },
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
            message: 'Invalid access token',
          })
        }

        if (accessToken.isRevoked) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access token has been revoked',
          })
        }

        if (new Date() > accessToken.expiresAt) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access token has expired',
          })
        }

        // Update usedAt on first use
        if (!accessToken.usedAt) {
          await instancePrisma.insuranceAccessToken.update({
            where: { id: accessToken.id },
            data: { usedAt: new Date() },
          })

          // Update claim status to UNDER_REVIEW
          await instancePrisma.insuranceClaim.update({
            where: { id: accessToken.claimId },
            data: { status: 'UNDER_REVIEW' },
          })
        }

        return {
          success: true,
          message: 'Token verified successfully',
          data: accessToken.claim,
        }
      } catch (error: any) {
        console.error('Error verifying token:', error)
        throw new TRPCError({
          code: error.code || 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to verify token',
        })
      }
    }),

  // Review claim (approve/deny) by insurance company
  reviewClaim: publicProcedure
    .input(reviewInsuranceClaimSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { instancePrisma } = ctx

        // Verify token
        const accessToken = await instancePrisma.insuranceAccessToken.findUnique({
          where: { token: input.token },
          include: {
            claim: true,
          },
        })

        if (!accessToken) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Invalid access token',
          })
        }

        if (accessToken.isRevoked || new Date() > accessToken.expiresAt) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access token is invalid or expired',
          })
        }

        // Update claim with review decision
        const claim = await instancePrisma.insuranceClaim.update({
          where: { id: accessToken.claimId },
          data: {
            status: input.decision,
            approvedAmount: input.approvedAmount,
            denialReason: input.denialReason,
            insuranceNotes: input.insuranceNotes,
            reviewedAt: new Date(),
            reviewedBy: input.reviewerEmail,
          },
          include: {
            patient: {
              include: {
                user: true,
              },
            },
            documents: true,
          },
        })

        // Revoke the token after review
        await instancePrisma.insuranceAccessToken.update({
          where: { id: accessToken.id },
          data: { isRevoked: true },
        })

        return {
          success: true,
          message: `Claim ${input.decision === 'APPROVED' ? 'approved' : 'denied'} successfully`,
          data: claim,
        }
      } catch (error: any) {
        console.error('Error reviewing claim:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to review claim',
        })
      }
    }),

  // Get all claims (for billing staff)
  getClaims: publicProcedure
    .input(getInsuranceClaimsSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { instancePrisma } = ctx

        const skip = (input.page - 1) * input.limit

        const where: any = {}
        if (input.patientId) {
          where.patientId = input.patientId
        }
        if (input.status) {
          where.status = input.status
        }

        const [claims, total] = await Promise.all([
          instancePrisma.insuranceClaim.findMany({
            where,
            skip,
            take: input.limit,
            include: {
              patient: {
                include: {
                  user: true,
                },
              },
              documents: true,
              inpatientEncounter: true,
              outpatientEncounter: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          }),
          instancePrisma.insuranceClaim.count({ where }),
        ])

        return {
          success: true,
          data: claims,
          pagination: {
            total,
            page: input.page,
            limit: input.limit,
            totalPages: Math.ceil(total / input.limit),
          },
        }
      } catch (error: any) {
        console.error('Error getting claims:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to get claims',
        })
      }
    }),

  // Get single claim by ID
  getClaimById: publicProcedure
    .input(getInsuranceClaimSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { instancePrisma } = ctx

        const claim = await instancePrisma.insuranceClaim.findUnique({
          where: { id: input.claimId },
          include: {
            patient: {
              include: {
                user: true,
              },
            },
            documents: true,
            accessTokens: true,
            inpatientEncounter: {
              include: {
                charts: true,
                orders: {
                  include: {
                    catalogueItem: true,
                  },
                },
              },
            },
            outpatientEncounter: true,
          },
        })

        if (!claim) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Insurance claim not found',
          })
        }

        return {
          success: true,
          data: claim,
        }
      } catch (error: any) {
        console.error('Error getting claim:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to get claim',
        })
      }
    }),

  // Cancel claim
  cancelClaim: publicProcedure
    .input(cancelInsuranceClaimSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { instancePrisma } = ctx

        const claim = await instancePrisma.insuranceClaim.findUnique({
          where: { id: input.claimId },
        })

        if (!claim) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Insurance claim not found',
          })
        }

        if (['APPROVED', 'DENIED'].includes(claim.status)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cannot cancel a claim that has been reviewed',
          })
        }

        // Revoke all access tokens
        await instancePrisma.insuranceAccessToken.updateMany({
          where: { claimId: input.claimId },
          data: { isRevoked: true },
        })

        // Update claim status
        const updatedClaim = await instancePrisma.insuranceClaim.update({
          where: { id: input.claimId },
          data: { status: 'CANCELLED' },
        })

        return {
          success: true,
          message: 'Claim cancelled successfully',
          data: updatedClaim,
        }
      } catch (error: any) {
        console.error('Error cancelling claim:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to cancel claim',
        })
      }
    }),

  // Delete document
  deleteDocument: publicProcedure
    .input(deleteInsuranceDocumentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { instancePrisma } = ctx

        const document = await instancePrisma.insuranceDocument.findUnique({
          where: { id: input.documentId },
          include: {
            claim: true,
          },
        })

        if (!document) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Document not found',
          })
        }

        if (document.claim.status !== 'PENDING') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cannot delete documents from a submitted claim',
          })
        }

        await instancePrisma.insuranceDocument.delete({
          where: { id: input.documentId },
        })

        return {
          success: true,
          message: 'Document deleted successfully',
        }
      } catch (error: any) {
        console.error('Error deleting document:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to delete document',
        })
      }
    }),
})

