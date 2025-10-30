import { z } from 'zod'

// Create Data Share Request
export const createDataShareRequestSchema = z.object({
  patientId: z.string(),
  encounterId: z.string(),
  encounterType: z.enum(['inpatient', 'outpatient']),
  hospitalIdentifier: z.string().min(1, 'Hospital identifier is required'),
  hospitalName: z.string().min(1, 'Hospital name is required'),
  hospitalEmail: z.string().email('Valid email is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  requestNotes: z.string().optional(),
  patientConsent: z.boolean().optional(),
})

export type CreateDataShareRequestInput = z.infer<typeof createDataShareRequestSchema>

// Get Data Share Requests
export const getDataShareRequestsSchema = z.object({
  status: z.enum(['PENDING', 'SUBMITTED', 'APPROVED', 'DENIED', 'ACCESSED', 'EXPIRED']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
})

export type GetDataShareRequestsInput = z.infer<typeof getDataShareRequestsSchema>

// Get Data Share Request by ID
export const getDataShareRequestByIdSchema = z.object({
  id: z.string(),
})

export type GetDataShareRequestByIdInput = z.infer<typeof getDataShareRequestByIdSchema>

// Submit Request for Review
export const submitDataShareRequestSchema = z.object({
  id: z.string(),
})

export type SubmitDataShareRequestInput = z.infer<typeof submitDataShareRequestSchema>

// Approve Request
export const approveDataShareRequestSchema = z.object({
  id: z.string(),
  selectedData: z.record(z.boolean()), // Which data fields to share
  staffNotes: z.string().optional(),
})

export type ApproveDataShareRequestInput = z.infer<typeof approveDataShareRequestSchema>

// Deny Request
export const denyDataShareRequestSchema = z.object({
  id: z.string(),
  denialReason: z.string().min(10, 'Denial reason must be at least 10 characters'),
})

export type DenyDataShareRequestInput = z.infer<typeof denyDataShareRequestSchema>

// Verify Access Token
export const verifyDataShareTokenSchema = z.object({
  token: z.string(),
})

export type VerifyDataShareTokenInput = z.infer<typeof verifyDataShareTokenSchema>
