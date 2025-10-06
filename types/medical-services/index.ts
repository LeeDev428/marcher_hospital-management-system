import { z } from "zod"

/* ---------- Enums ---------- */

export const serviceTypeSchema = z.enum([
  "CONSULTATION",
  "FOLLOW_UP",
  "MINOR_PROCEDURE",
  "MAJOR_PROCEDURE",
  "DIAGNOSTIC_TEST",
  "VACCINATION",
  "HEALTH_CHECKUP",
  "SPECIALIZED_CONSULTATION",
  "EMERGENCY_CARE",
  "PREVENTIVE_CARE",
  "THERAPY",
  "COUNSELING",
  "OTHER",
])

export const serviceCategorySchema = z.enum([
  "GENERAL_MEDICINE",
  "SURGERY",
  "PEDIATRICS",
  "OBSTETRICS_GYNECOLOGY",
  "ORTHOPEDICS",
  "CARDIOLOGY",
  "NEUROLOGY",
  "DERMATOLOGY",
  "OPHTHALMOLOGY",
  "ENT",
  "PSYCHIATRY",
  "RADIOLOGY",
  "LABORATORY",
  "NURSING",
  "THERAPY",
  "EMERGENCY",
  "OTHER",
])

export type ServiceType = z.infer<typeof serviceTypeSchema>
export type ServiceCategory = z.infer<typeof serviceCategorySchema>

/* ---------- Options for Select Fields ---------- */

export const serviceTypeOptions = [
  { label: "Consultation", value: "CONSULTATION" },
  { label: "Follow-up", value: "FOLLOW_UP" },
  { label: "Minor Procedure", value: "MINOR_PROCEDURE" },
  { label: "Major Procedure", value: "MAJOR_PROCEDURE" },
  { label: "Diagnostic Test", value: "DIAGNOSTIC_TEST" },
  { label: "Vaccination", value: "VACCINATION" },
  { label: "Health Checkup", value: "HEALTH_CHECKUP" },
  { label: "Specialized Consultation", value: "SPECIALIZED_CONSULTATION" },
  { label: "Emergency Care", value: "EMERGENCY_CARE" },
  { label: "Preventive Care", value: "PREVENTIVE_CARE" },
  { label: "Therapy", value: "THERAPY" },
  { label: "Counseling", value: "COUNSELING" },
  { label: "Other", value: "OTHER" },
]

export const serviceCategoryOptions = [
  { label: "General Medicine", value: "GENERAL_MEDICINE" },
  { label: "Surgery", value: "SURGERY" },
  { label: "Pediatrics", value: "PEDIATRICS" },
  { label: "Obstetrics & Gynecology", value: "OBSTETRICS_GYNECOLOGY" },
  { label: "Orthopedics", value: "ORTHOPEDICS" },
  { label: "Cardiology", value: "CARDIOLOGY" },
  { label: "Neurology", value: "NEUROLOGY" },
  { label: "Dermatology", value: "DERMATOLOGY" },
  { label: "Ophthalmology", value: "OPHTHALMOLOGY" },
  { label: "ENT", value: "ENT" },
  { label: "Psychiatry", value: "PSYCHIATRY" },
  { label: "Radiology", value: "RADIOLOGY" },
  { label: "Laboratory", value: "LABORATORY" },
  { label: "Nursing", value: "NURSING" },
  { label: "Therapy", value: "THERAPY" },
  { label: "Emergency", value: "EMERGENCY" },
  { label: "Other", value: "OTHER" },
]

/* ---------- CUID Validation ---------- */

const cuidSchema = z.string().regex(/^c[a-z0-9]{24}$/, "Invalid ID format.")

/* ---------- Core Schemas ---------- */

// Base medical service schema
export const medicalServiceSchema = z.object({
  staffId: cuidSchema,
  name: z.string().min(1, "Service name is required").max(200, "Service name is too long"),
  type: serviceTypeSchema,
  category: serviceCategorySchema.optional(),
  description: z.string().max(1000, "Description is too long").optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  duration: z.coerce.number().int().min(5, "Duration must be at least 5 minutes").max(480, "Duration cannot exceed 8 hours"),
  isActive: z.boolean().default(true),
  requirements: z.string().max(500, "Requirements text is too long").optional(),
  notes: z.string().max(500, "Notes text is too long").optional(),
})

// Create medical service (no ID yet)
export const createMedicalServiceSchema = medicalServiceSchema

// Update medical service (requires ID)
export const updateMedicalServiceSchema = medicalServiceSchema.extend({
  id: cuidSchema,
})

// Get medical service by ID
export const getMedicalServiceSchema = z.object({
  id: cuidSchema,
})

// Get medical services with filters
export const getMedicalServicesSchema = z.object({
  staffId: cuidSchema.optional(),
  type: serviceTypeSchema.optional(),
  category: serviceCategorySchema.optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(), // Search by name or description
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
})

// Delete medical service
export const deleteMedicalServiceSchema = z.object({
  id: cuidSchema,
})

// Filters for frontend
export const medicalServiceFiltersSchema = z.object({
  staffId: cuidSchema.optional(),
  type: serviceTypeSchema.optional(),
  category: serviceCategorySchema.optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(),
})

/* ---------- Table Display Schema ---------- */

export const tableMedicalServiceSchema = z.object({
  id: z.string(),
  staffId: z.string(),
  name: z.string(),
  type: serviceTypeSchema,
  category: serviceCategorySchema.optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.string(), // Decimal as string for display
  duration: z.number(),
  isActive: z.boolean(),
  requirements: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  staff: z.object({
    firstName: z.string(),
    lastName: z.string(),
    middleName: z.string().optional().nullable(),
    email: z.string(),
  }).optional(),
})

/* ---------- TypeScript Types ---------- */

export type MedicalService = z.infer<typeof medicalServiceSchema>
export type CreateMedicalService = z.infer<typeof createMedicalServiceSchema>
export type UpdateMedicalService = z.infer<typeof updateMedicalServiceSchema>
export type GetMedicalService = z.infer<typeof getMedicalServiceSchema>
export type GetMedicalServices = z.infer<typeof getMedicalServicesSchema>
export type DeleteMedicalService = z.infer<typeof deleteMedicalServiceSchema>
export type MedicalServiceFilters = z.infer<typeof medicalServiceFiltersSchema>
export type TableMedicalService = z.infer<typeof tableMedicalServiceSchema>
