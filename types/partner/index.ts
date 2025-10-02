import { z } from "zod"

// Partner Types
export const partnerTypeSchema = z.enum(["INSURANCE_COMPANY", "HOSPITAL", "CLINIC"])

export const partnerTypeOptions = partnerTypeSchema.options.map((type) => ({
  label: type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
  value: type,
}))

export const partnerSchema = z.object({
  type: partnerTypeSchema,
  organizationName: z.string().min(1, "Organization name is required.").max(255, "Organization name must be less than 255 characters."),
  organizationAddress: z.string().min(1, "Organization address is required.").max(500, "Organization address must be less than 500 characters."),
  representativeName: z.string().min(1, "Representative name is required.").max(255, "Representative name must be less than 255 characters."),
  representativeEmail: z.string().email("Invalid email address."),
  representativePhone: z.string().min(1, "Representative phone is required.").max(20, "Phone must be less than 20 characters."),
})

export const getPartnerSchema = z.object({
  id: z.string().uuid("Invalid partner ID."),
})

export const tablePartnerSchema = partnerSchema.extend({
  id: z.string().uuid("Invalid partner ID."),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createPartnerSchema = partnerSchema
export const updatePartnerSchema = partnerSchema.extend({
  id: z.string().uuid("Invalid partner ID."),
})
export const deletePartnerSchema = z.object({
  id: z.string().uuid("Invalid partner ID."),
})

// Partner Claim Request Types
export const partnerClaimRequestSchema = z.object({
  partnerId: z.string().uuid("Invalid partner ID."),
  status: z.string().min(1, "Status is required."),
  message: z.string().optional().nullable(),
  amount: z.number().min(0, "Amount must be positive."),
})

export const getPartnerClaimRequestSchema = z.object({
  id: z.string().uuid("Invalid claim request ID."),
})

export const tablePartnerClaimRequestSchema = partnerClaimRequestSchema.extend({
  id: z.string().uuid("Invalid claim request ID."),
  partner: z.object({
    organizationName: z.string(),
    type: partnerTypeSchema,
  }),
  items: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    amount: z.number(),
  })).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createPartnerClaimRequestSchema = partnerClaimRequestSchema
export const updatePartnerClaimRequestSchema = partnerClaimRequestSchema.extend({
  id: z.string().uuid("Invalid claim request ID."),
})
export const deletePartnerClaimRequestSchema = z.object({
  id: z.string().uuid("Invalid claim request ID."),
})

// Partner Claim Request Item Types
export const partnerClaimRequestItemSchema = z.object({
  claimRequestId: z.string().uuid("Invalid claim request ID."),
  name: z.string().min(1, "Item name is required.").max(255, "Item name must be less than 255 characters."),
  description: z.string().max(500, "Description must be less than 500 characters.").optional().nullable(),
  amount: z.number().min(0, "Amount must be positive."),
})

export const getPartnerClaimRequestItemSchema = z.object({
  id: z.string().uuid("Invalid item ID."),
})

export const tablePartnerClaimRequestItemSchema = partnerClaimRequestItemSchema.extend({
  id: z.string().uuid("Invalid item ID."),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createPartnerClaimRequestItemSchema = partnerClaimRequestItemSchema
export const updatePartnerClaimRequestItemSchema = partnerClaimRequestItemSchema.extend({
  id: z.string().uuid("Invalid item ID."),
})
export const deletePartnerClaimRequestItemSchema = z.object({
  id: z.string().uuid("Invalid item ID."),
})

// Partner Data Request Types
export const partnerDataRequestSchema = z.object({
  partnerId: z.string().uuid("Invalid partner ID."),
  branchId: z.string().min(1, "Branch ID is required."),
  encounterId: z.string().min(1, "Encounter ID is required."),
  status: z.string().min(1, "Status is required."),
  message: z.string().optional().nullable(),
})

export const getPartnerDataRequestSchema = z.object({
  id: z.string().uuid("Invalid data request ID."),
})

export const tablePartnerDataRequestSchema = partnerDataRequestSchema.extend({
  id: z.string().uuid("Invalid data request ID."),
  partner: z.object({
    organizationName: z.string(),
    type: partnerTypeSchema,
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createPartnerDataRequestSchema = partnerDataRequestSchema
export const updatePartnerDataRequestSchema = partnerDataRequestSchema.extend({
  id: z.string().uuid("Invalid data request ID."),
})
export const deletePartnerDataRequestSchema = z.object({
  id: z.string().uuid("Invalid data request ID."),
})

// Type exports
export type PartnerType = z.infer<typeof partnerTypeSchema>
export type Partner = z.infer<typeof partnerSchema>
export type GetPartner = z.infer<typeof getPartnerSchema>
export type TablePartner = z.infer<typeof tablePartnerSchema>
export type CreatePartner = z.infer<typeof createPartnerSchema>
export type UpdatePartner = z.infer<typeof updatePartnerSchema>
export type DeletePartner = z.infer<typeof deletePartnerSchema>

export type PartnerClaimRequest = z.infer<typeof partnerClaimRequestSchema>
export type GetPartnerClaimRequest = z.infer<typeof getPartnerClaimRequestSchema>
export type TablePartnerClaimRequest = z.infer<typeof tablePartnerClaimRequestSchema>
export type CreatePartnerClaimRequest = z.infer<typeof createPartnerClaimRequestSchema>
export type UpdatePartnerClaimRequest = z.infer<typeof updatePartnerClaimRequestSchema>
export type DeletePartnerClaimRequest = z.infer<typeof deletePartnerClaimRequestSchema>

export type PartnerClaimRequestItem = z.infer<typeof partnerClaimRequestItemSchema>
export type GetPartnerClaimRequestItem = z.infer<typeof getPartnerClaimRequestItemSchema>
export type TablePartnerClaimRequestItem = z.infer<typeof tablePartnerClaimRequestItemSchema>
export type CreatePartnerClaimRequestItem = z.infer<typeof createPartnerClaimRequestItemSchema>
export type UpdatePartnerClaimRequestItem = z.infer<typeof updatePartnerClaimRequestItemSchema>
export type DeletePartnerClaimRequestItem = z.infer<typeof deletePartnerClaimRequestItemSchema>

export type PartnerDataRequest = z.infer<typeof partnerDataRequestSchema>
export type GetPartnerDataRequest = z.infer<typeof getPartnerDataRequestSchema>
export type TablePartnerDataRequest = z.infer<typeof tablePartnerDataRequestSchema>
export type CreatePartnerDataRequest = z.infer<typeof createPartnerDataRequestSchema>
export type UpdatePartnerDataRequest = z.infer<typeof updatePartnerDataRequestSchema>
export type DeletePartnerDataRequest = z.infer<typeof deletePartnerDataRequestSchema>