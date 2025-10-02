import { createTRPCRouter, protectedProcedure } from "../../init"
import { 
  medicalRecordStatusSchema,
  getMedicalRecordRequestSchema,
  createMedicalRecordRequestSchema,
  updateMedicalRecordRequestSchema,
  deleteMedicalRecordRequestSchema
} from "@/types/medical-records"

const getMedicalRecordRequests = protectedProcedure
  .input(medicalRecordStatusSchema.optional())
  .query(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const status = input ?? undefined

    try {
      const requests = await instancePrisma.medicalRecordRequest.findMany({
        where: {
          status,
        },
        include: {
          patientProfile: true,
          inpatientEncounter: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return {
        success: true,
        message: "Medical record requests fetched successfully.",
        data: requests,
      }
    } catch(error) {
      console.log(error)
      return {
        success: false,
        message: "Failed to fetch medical record requests.",
        data: null,
      }
    }
  })

const getMedicalRecordRequest = protectedProcedure
  .input(getMedicalRecordRequestSchema)
  .query(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id } = input

    try {
      const request = await instancePrisma.medicalRecordRequest.findUnique({
        where: {
          id,
        },
        include: {
          patientProfile: true,
          inpatientEncounter: true,
        }
      })

      return {
        success: true,
        message: "Medical record request fetched successfully.",
        data: request,
      }
    } catch(error) {
      console.log(error)
      return {
        success: false,
        message: "Failed to fetch medical record request.",
        data: null,
      }
    }
  })

const createMedicalRecordRequest = protectedProcedure
  .input(createMedicalRecordRequestSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { patientProfileId, inpatientEncounterId, type } = input

    try {
      const request = await instancePrisma.medicalRecordRequest.create({
        data: {
          patientProfileId,
          inpatientEncounterId,
          type,
          status: "PENDING", // Always set to PENDING for new requests
          fileUrl: "", // Will be updated later when file is uploaded
        },
        include: {
          patientProfile: true,
          inpatientEncounter: true,
        }
      })

      return {
        success: true,
        message: "Medical record request created successfully.",
        data: request,
      }
    } catch(error) {
      console.log(error)
      return {
        success: false,
        message: "Failed to create medical record request.",
        data: null,
      }
    }
  })

const updateMedicalRecordRequest = protectedProcedure
  .input(updateMedicalRecordRequestSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id, patientProfileId, inpatientEncounterId, type, status, fileUrl } = input

    try {
      const updateData: any = {
        patientProfileId,
        inpatientEncounterId,
        type,
        status,
      }

      // Only update fileUrl if it's provided
      if (fileUrl !== undefined) {
        updateData.fileUrl = fileUrl
      }

      const request = await instancePrisma.medicalRecordRequest.update({
        where: {
          id,
        },
        data: updateData,
        include: {
          patientProfile: true,
          inpatientEncounter: true,
        }
      })

      return {
        success: true,
        message: "Medical record request updated successfully.",
        data: request,
      }
    } catch(error) {
      console.log(error)
      return {
        success: false,
        message: "Failed to update medical record request.",
        data: null,
      }
    }
  })

const deleteMedicalRecordRequest = protectedProcedure
  .input(deleteMedicalRecordRequestSchema)
  .mutation(async ({ ctx, input }) => {
    const { instancePrisma } = ctx
    const { id } = input

    try {
      const request = await instancePrisma.medicalRecordRequest.delete({
        where: {
          id,
        }
      })

      return {
        success: true,
        message: "Medical record request deleted successfully.",
        data: request,
      }
    } catch(error) {
      console.log(error)
      return {
        success: false,
        message: "Failed to delete medical record request.",
        data: null,
      }
    }
  })

// Helper procedures for dropdowns
const getPatientProfiles = protectedProcedure
  .query(async ({ ctx }) => {
    const { instancePrisma } = ctx

    try {
      const patients = await instancePrisma.patientProfile.findMany({
        where: {
          archived: false
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          middleName: true,
          suffix: true,
        },
        orderBy: {
          lastName: 'asc'
        }
      })

      return {
        success: true,
        message: "Patients fetched successfully.",
        data: patients,
      }
    } catch(error) {
      console.log(error)
      return {
        success: false,
        message: "Failed to fetch patients.",
        data: null,
      }
    }
  })

const getInpatientEncounters = protectedProcedure
  .query(async ({ ctx }) => {
    const { instancePrisma } = ctx

    try {
      const encounters = await instancePrisma.inpatientEncounter.findMany({
        include: {
          patientProfile: {
            select: {
              firstName: true,
              lastName: true,
              middleName: true,
              suffix: true,
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      })

      return {
        success: true,
        message: "Inpatient encounters fetched successfully.",
        data: encounters,
      }
    } catch(error) {
      console.log(error)
      return {
        success: false,
        message: "Failed to fetch inpatient encounters.",
        data: null,
      }
    }
  })

export const medicalRecordRequestsRouter = createTRPCRouter({
  getMedicalRecordRequests,
  getMedicalRecordRequest,
  createMedicalRecordRequest,
  updateMedicalRecordRequest,
  deleteMedicalRecordRequest,
  getPatientProfiles,
  getInpatientEncounters,
})