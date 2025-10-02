import { defineStore } from "pinia"
import type { 
  CreateMedicalRecordRequest, 
  UpdateMedicalRecordRequest,
  GetMedicalRecordRequest, 
  DeleteMedicalRecordRequest,
  PatientProfileOption,
  InpatientEncounterOption,
  MedicalRecordStatus
} from "@/types/medical-records"

export const useMedicalRecordsStore = defineStore("medicalRecords", {
  state: () => ({
    loading: true,
    medicalRecordRequest: null as any,
    medicalRecordRequests: [] as any[],
    patientProfiles: [] as PatientProfileOption[],
    inpatientEncounters: [] as InpatientEncounterOption[],
  }),

  getters: {
    patientProfileOptions: (state) => 
      state.patientProfiles.map(patient => ({
        label: `${patient.lastName}, ${patient.firstName} ${patient.middleName || ''} ${patient.suffix || ''}`.trim(),
        value: patient.id,
      })),
    
    inpatientEncounterOptions: (state) =>
      state.inpatientEncounters.map(encounter => ({
        label: `${encounter.date} - ${encounter.patientProfile.lastName}, ${encounter.patientProfile.firstName} (${encounter.chiefComplaint})`,
        value: encounter.id,
      })),
  },

  actions: {
    async getMedicalRecordRequests(input?: MedicalRecordStatus) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        
        const { success, message, data } = input 
          ? await $trpc.medicalRecords.requests.getMedicalRecordRequests.query(input)
          : await $trpc.medicalRecords.requests.getMedicalRecordRequests.query()

        if (success && data) {
          this.medicalRecordRequests = data
          this.loading = false
          return {
            success,
            message,
            data,
          }
        }

        this.loading = false
        return {
          success,
          message,
          data,
        }
      } catch(error) {
        console.log(error)
        this.loading = false
        return {
          success: false,
          message: "Failed to fetch medical record requests.",
          data: null,
        }
      }
    },

    async getMedicalRecordRequest(input: GetMedicalRecordRequest) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.medicalRecords.requests.getMedicalRecordRequest.query(input)

        if (success && data) {
          this.medicalRecordRequest = data
          this.loading = false
          return {
            success,
            message,
            data,
          }
        }

        this.loading = false
        return {
          success,
          message,
          data,
        }
      } catch(error) {
        console.log(error)
        this.loading = false
        return {
          success: false,
          message: "Failed to fetch medical record request.",
          data: null,
        }
      }
    },

    async createMedicalRecordRequest(input: CreateMedicalRecordRequest) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.medicalRecords.requests.createMedicalRecordRequest.mutate(input)

        if (success && data) {
          this.medicalRecordRequest = data
          this.loading = false
          useToast(
            "success",
            "Medical Records",
            "Request created successfully.",
          )
          await navigateTo("/patient/medical-records")
        }

        this.loading = false
        return {
          success,
          message,
          data,
        }
      } catch(error) {
        console.log(error)
        this.loading = false
        useToast(
          "error",
          "Medical Records",
          "Failed to create request.",
        )
      }
    },

    async updateMedicalRecordRequest(input: UpdateMedicalRecordRequest) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.medicalRecords.requests.updateMedicalRecordRequest.mutate(input)

        if (success && data) {
          this.medicalRecordRequest = data
          this.loading = false
          useToast(
            "success",
            "Medical Records",
            "Request updated successfully.",
          )
          await navigateTo("/patient/medical-records")
        }

        this.loading = false
        return {
          success,
          message,
          data,
        }
      } catch(error) {
        console.log(error)
        this.loading = false
        useToast(
          "error",
          "Medical Records",
          "Failed to update request.",
        )
      }
    },

    async deleteMedicalRecordRequest(input: DeleteMedicalRecordRequest) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.medicalRecords.requests.deleteMedicalRecordRequest.mutate(input)

        if (success && data) {
          this.medicalRecordRequests = this.medicalRecordRequests.filter((request) => request.id !== input.id)
          this.loading = false
          useToast(
            "success",
            "Medical Records",
            "Request deleted successfully.",
          )
        }

        this.loading = false
        return {
          success,
          message,
          data,
        }
      } catch(error) {
        console.log(error)
        this.loading = false
        useToast(
          "error",
          "Medical Records",
          "Failed to delete request.",
        )
      }
    },

    async getPatientProfiles() {
      const { $trpc } = useNuxtApp()

      try {
        const { success, message, data } = await $trpc.medicalRecords.requests.getPatientProfiles.query()

        if (success && data) {
          this.patientProfiles = data
          return {
            success,
            message,
            data,
          }
        }

        return {
          success,
          message,
          data,
        }
      } catch(error) {
        console.log(error)
        return {
          success: false,
          message: "Failed to fetch patients.",
          data: null,
        }
      }
    },

    async getInpatientEncounters() {
      const { $trpc } = useNuxtApp()

      try {
        const { success, message, data } = await $trpc.medicalRecords.requests.getInpatientEncounters.query()

        if (success && data) {
          this.inpatientEncounters = data
          console.log('Inpatient encounters loaded:', data) // Debug log
          return {
            success,
            message,
            data,
          }
        }

        console.log('No inpatient encounters data received') // Debug log
        return {
          success,
          message,
          data,
        }
      } catch(error) {
        console.log('Error fetching inpatient encounters:', error)
        return {
          success: false,
          message: "Failed to fetch encounters.",
          data: null,
        }
      }
    },
  },
})