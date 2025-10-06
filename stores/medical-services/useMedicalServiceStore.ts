import { defineStore } from "pinia"
import { useToast } from "@/composables/useToast"
import type {
  TableMedicalService,
  CreateMedicalService,
  UpdateMedicalService,
  GetMedicalServices,
  MedicalServiceFilters,
} from "@/types/medical-services"

export const useMedicalServiceStore = defineStore("medicalService", {
  state: () => ({
    loading: true,
    medicalService: null as CreateMedicalService | UpdateMedicalService | null,
    medicalServices: [] as TableMedicalService[],

    filters: {
      staffId: undefined,
      type: undefined,
      category: undefined,
      isActive: undefined,
      search: undefined,
    } as MedicalServiceFilters,

    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  }),

  getters: {
    // Get active services only
    activeServices: (state) =>
      state.medicalServices.filter((service) => service.isActive),

    // Get services by type
    getServicesByType: (state) => (type: string) =>
      state.medicalServices.filter((service) => service.type === type),

    // Get services by staff
    getServicesByStaff: (state) => (staffId: string) =>
      state.medicalServices.filter((service) => service.staffId === staffId),
  },

  actions: {
    // === GET ALL ===
    async getMedicalServices(params?: GetMedicalServices) {
      const { $trpc } = useNuxtApp()
      try {
        this.loading = true

        const queryParams: GetMedicalServices = {
          page: params?.page ?? this.pagination.page,
          limit: params?.limit ?? this.pagination.limit,
          staffId: params?.staffId ?? this.filters.staffId,
          type: params?.type ?? this.filters.type,
          category: params?.category ?? this.filters.category,
          isActive: params?.isActive ?? this.filters.isActive,
          search: params?.search ?? this.filters.search,
        }

        const { success, message, data, pagination } =
          await $trpc.medicalServices.getMedicalServices.query(queryParams)

        if (success && data) {
          this.medicalServices = data
          this.pagination = pagination
        } else {
          useToast("error", "Medical Services", message || "Failed to fetch medical services")
        }

        this.loading = false
        return { success, message, data }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast("error", "Medical Services", "Failed to fetch medical services")
        return { success: false, message: "Failed to fetch medical services", data: [] }
      }
    },

    // === GET ONE ===
    async getMedicalService(id: string) {
      const { $trpc } = useNuxtApp()
      try {
        this.loading = true

        const { success, message, data } =
          await $trpc.medicalServices.getMedicalService.query({ id })

        if (success && data) {
          this.medicalService = data
        } else {
          useToast("error", "Medical Services", message || "Failed to fetch medical service")
        }

        this.loading = false
        return { success, message, data }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast("error", "Medical Services", "Failed to fetch medical service")
        return { success: false, message: "Failed to fetch medical service", data: null }
      }
    },

    // === CREATE ===
    async createMedicalService(data: CreateMedicalService) {
      const { $trpc } = useNuxtApp()
      try {
        this.loading = true

        console.log("📝 Creating medical service:", data)

        const { success, message, data: serviceData } =
          await $trpc.medicalServices.createMedicalService.mutate(data)

        if (success) {
          useToast("success", "Medical Services", message || "Medical service created successfully")
          // Refresh the list
          await this.getMedicalServices()
        } else {
          useToast("error", "Medical Services", message || "Failed to create medical service")
        }

        this.loading = false
        return { success, message, data: serviceData }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast("error", "Medical Services", "Failed to create medical service")
        return { success: false, message: "Failed to create medical service", data: null }
      }
    },

    // === UPDATE ===
    async updateMedicalService(data: UpdateMedicalService) {
      const { $trpc } = useNuxtApp()
      try {
        this.loading = true

        console.log("📝 Updating medical service:", data.id)

        const { success, message, data: serviceData } =
          await $trpc.medicalServices.updateMedicalService.mutate(data)

        if (success) {
          useToast("success", "Medical Services", message || "Medical service updated successfully")
          // Refresh the list
          await this.getMedicalServices()
        } else {
          useToast("error", "Medical Services", message || "Failed to update medical service")
        }

        this.loading = false
        return { success, message, data: serviceData }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast("error", "Medical Services", "Failed to update medical service")
        return { success: false, message: "Failed to update medical service", data: null }
      }
    },

    // === DELETE ===
    async deleteMedicalService(id: string) {
      const { $trpc } = useNuxtApp()
      try {
        this.loading = true

        console.log("🗑️ Deleting medical service:", id)

        const { success, message } =
          await $trpc.medicalServices.deleteMedicalService.mutate({ id })

        if (success) {
          useToast("success", "Medical Services", message || "Medical service deleted successfully")
          // Refresh the list
          await this.getMedicalServices()
        } else {
          useToast("error", "Medical Services", message || "Failed to delete medical service")
        }

        this.loading = false
        return { success, message }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast("error", "Medical Services", "Failed to delete medical service")
        return { success: false, message: "Failed to delete medical service" }
      }
    },

    // === FILTERS ===
    setFilters(filters: Partial<MedicalServiceFilters>) {
      this.filters = { ...this.filters, ...filters }
      this.pagination.page = 1 // Reset to first page
      this.getMedicalServices()
    },

    clearFilters() {
      this.filters = {
        staffId: undefined,
        type: undefined,
        category: undefined,
        isActive: undefined,
        search: undefined,
      }
      this.pagination.page = 1
      this.getMedicalServices()
    },

    // === PAGINATION ===
    async changePage(page: number) {
      this.pagination.page = page
      await this.getMedicalServices()
    },

    // === RESET ===
    resetState() {
      this.medicalService = null
      this.medicalServices = []
      this.filters = {
        staffId: undefined,
        type: undefined,
        category: undefined,
        isActive: undefined,
        search: undefined,
      }
      this.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      }
    },
  },
})
