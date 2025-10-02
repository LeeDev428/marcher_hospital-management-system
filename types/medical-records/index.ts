import { z } from "zod"

export const medicalRecordStatusSchema = z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"])

export const medicalRecordStatusOptions = medicalRecordStatusSchema.options.map((status) => ({
  label: status.charAt(0) + status.slice(1).toLowerCase(),
  value: status,
}))

export const medicalRecordTypeOptions = [
  { label: "Discharge Summary", value: "DISCHARGE_SUMMARY" },
  { label: "Laboratory Results", value: "LABORATORY_RESULTS" },
  { label: "Radiology Report", value: "RADIOLOGY_REPORT" },
  { label: "Pathology Report", value: "PATHOLOGY_REPORT" },
  { label: "Operative Notes", value: "OPERATIVE_NOTES" },
  { label: "Progress Notes", value: "PROGRESS_NOTES" },
  { label: "Consultation Report", value: "CONSULTATION_REPORT" },
  { label: "Emergency Record", value: "EMERGENCY_RECORD" },
  { label: "Complete Medical Record", value: "COMPLETE_MEDICAL_RECORD" },
]

export const medicalRecordRequestSchema = z.object({
  patientProfileId: z.string().uuid("Invalid patient ID."),
  inpatientEncounterId: z.string().uuid("Invalid encounter ID."),
  type: z.string().min(1, "Record type is required."),
  status: medicalRecordStatusSchema,
  fileUrl: z.string().optional(),
})

export const getMedicalRecordRequestSchema = z.object({
  id: z.string().uuid("Invalid medical record request ID."),
})

export const tableMedicalRecordRequestSchema = medicalRecordRequestSchema
  .extend({
    id: z.string().uuid("Invalid medical record request ID."),
    patientProfile: z.object({
      id: z.string().uuid(),
      firstName: z.string(),
      lastName: z.string(),
      middleName: z.string().nullable(),
      suffix: z.string().nullable(),
    }),
    inpatientEncounter: z.object({
      id: z.string().uuid(),
      date: z.string(),
      chiefComplaint: z.string(),
    }),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })

// For creation, status defaults to PENDING, so we omit it from the form
export const createMedicalRecordRequestSchema = medicalRecordRequestSchema
  .omit({ fileUrl: true, status: true })

// For updates, status can be changed by staff, so we include it
export const updateMedicalRecordRequestSchema = medicalRecordRequestSchema
  .extend({
    id: z.string().uuid("Invalid medical record request ID."),
  })

export const deleteMedicalRecordRequestSchema = z.object({
  id: z.string().uuid("Invalid medical record request ID."),
})

export const patientProfileOptionSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().nullable(),
  suffix: z.string().nullable(),
})

export const inpatientEncounterOptionSchema = z.object({
  id: z.string().uuid(),
  date: z.string(),
  chiefComplaint: z.string(),
  patientProfile: z.object({
    firstName: z.string(),
    lastName: z.string(),
    middleName: z.string().nullable(),
    suffix: z.string().nullable(),
  }),
})

export type MedicalRecordStatus = z.infer<typeof medicalRecordStatusSchema>
export type MedicalRecordRequest = z.infer<typeof medicalRecordRequestSchema>
export type GetMedicalRecordRequest = z.infer<typeof getMedicalRecordRequestSchema>
export type TableMedicalRecordRequest = z.infer<typeof tableMedicalRecordRequestSchema>
export type CreateMedicalRecordRequest = z.infer<typeof createMedicalRecordRequestSchema>
export type UpdateMedicalRecordRequest = z.infer<typeof updateMedicalRecordRequestSchema>
export type DeleteMedicalRecordRequest = z.infer<typeof deleteMedicalRecordRequestSchema>
export type PatientProfileOption = z.infer<typeof patientProfileOptionSchema>
export type InpatientEncounterOption = z.infer<typeof inpatientEncounterOptionSchema>