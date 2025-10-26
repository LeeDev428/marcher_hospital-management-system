import { z } from 'zod'

// Insurance Claim Status Enum
export const insuranceClaimStatusSchema = z.enum([
  'PENDING',
  'SUBMITTED',
  'UNDER_REVIEW',
  'APPROVED',
  'DENIED',
  'CANCELLED',
])

export type InsuranceClaimStatus = z.infer<typeof insuranceClaimStatusSchema>

// Create Insurance Claim Schema
export const createInsuranceClaimSchema = z.object({
  patientId: z.string().cuid('Invalid patient ID'),
  encounterId: z.string().uuid('Invalid encounter ID'),
  encounterType: z.enum(['inpatient', 'outpatient']),
  
  insuranceProvider: z.string().min(1, 'Insurance provider is required'),
  insuranceNumber: z.string().optional(),
  policyNumber: z.string().optional(),
  
  claimAmount: z.number().positive('Claim amount must be positive'),
  billingStaffNotes: z.string().optional(),
  
  createdBy: z.string().cuid('Invalid user ID'), // Billing staff user ID
})

export type CreateInsuranceClaimInput = z.infer<typeof createInsuranceClaimSchema>

// Upload Document Schema
export const uploadInsuranceDocumentSchema = z.object({
  claimId: z.string().uuid('Invalid claim ID'),
  documentType: z.string().min(1, 'Document type is required'),
  fileName: z.string().min(1, 'File name is required'),
  fileUrl: z.string().url('Invalid file URL'),
  fileSize: z.number().int().positive('File size must be positive'),
  mimeType: z.string().min(1, 'MIME type is required'),
  description: z.string().optional(),
  uploadedBy: z.string().cuid('Invalid user ID'),
})

export type UploadInsuranceDocumentInput = z.infer<typeof uploadInsuranceDocumentSchema>

// Submit Claim (send to insurance) Schema
export const submitInsuranceClaimSchema = z.object({
  claimId: z.string().uuid('Invalid claim ID'),
  recipientEmail: z.string().email('Invalid insurance company email'),
  expirationDays: z.number().int().positive().default(7), // Token valid for 7 days
})

export type SubmitInsuranceClaimInput = z.infer<typeof submitInsuranceClaimSchema>

// Review Claim (insurance company) Schema
export const reviewInsuranceClaimSchema = z.object({
  token: z.string().min(1, 'Access token is required'),
  approved: z.boolean(),
  approvedAmount: z.number().positive().optional(),
  denialReason: z.string().optional(),
  insuranceNotes: z.string().optional(),
  reviewedBy: z.string().email('Invalid reviewer email'),
})

export type ReviewInsuranceClaimInput = z.infer<typeof reviewInsuranceClaimSchema>

// Get Claims Schema
export const getInsuranceClaimsSchema = z.object({
  patientId: z.string().cuid().optional(),
  status: insuranceClaimStatusSchema.optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(20),
})

export type GetInsuranceClaimsInput = z.infer<typeof getInsuranceClaimsSchema>

// Get Claim by ID Schema
export const getInsuranceClaimSchema = z.object({
  claimId: z.string().uuid('Invalid claim ID'),
})

export type GetInsuranceClaimInput = z.infer<typeof getInsuranceClaimSchema>

// Verify Token Schema
export const verifyInsuranceTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
})

export type VerifyInsuranceTokenInput = z.infer<typeof verifyInsuranceTokenSchema>

// Cancel Claim Schema
export const cancelInsuranceClaimSchema = z.object({
  claimId: z.string().uuid('Invalid claim ID'),
})

export type CancelInsuranceClaimInput = z.infer<typeof cancelInsuranceClaimSchema>

// Delete Document Schema
export const deleteInsuranceDocumentSchema = z.object({
  documentId: z.string().uuid('Invalid document ID'),
})

export type DeleteInsuranceDocumentInput = z.infer<typeof deleteInsuranceDocumentSchema>
