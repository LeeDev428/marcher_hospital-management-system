import { defineStore } from "pinia"
import type { 
  CreatePartnerDataRequest, 
  UpdatePartnerDataRequest, 
  TablePartnerDataRequest, 
  GetPartnerDataRequest, 
  DeletePartnerDataRequest 
} from "@/types/partner"

export const usePartnerDataRequestStore = defineStore("partnerDataRequest", {
  state: () => ({
    loading: true,
    dataRequest: null as CreatePartnerDataRequest | UpdatePartnerDataRequest | null,
    dataRequests: [] as TablePartnerDataRequest[],
  }),

  actions: {
    async getDataRequests(partnerId?: string) {
      const { $trpc } = useNuxtApp()
      
      try {
        this.loading = true
        const { success, message, data } = await $trpc.partner.dataRequests.getDataRequests.query(
          partnerId ? { partnerId } : undefined
        )
        
        if (success && data) {
          this.dataRequests = data
          this.loading = false
          return { success, message, data }
        }
        
        this.loading = false
        return { success, message, data }
      } catch(error) {
        console.log(error)
        this.loading = false
        return {
          success: false,
          message: "Failed to fetch data requests.",
          data: null,
        }
      }
    },

    async getDataRequest(input: GetPartnerDataRequest) {
      const { $trpc } = useNuxtApp()
      
      try {
        this.loading = true
        const { success, message, data } = await $trpc.partner.dataRequests.getDataRequest.query(input)
        
        if (success && data) {
          this.dataRequest = data
          this.loading = false
          return { success, message, data }
        }
        
        this.loading = false
        return { success, message, data }
      } catch(error) {
        console.log(error)
        this.loading = false
        return {
          success: false,
          message: "Failed to fetch data request.",
          data: null,
        }
      }
    },

    async createDataRequest(input: CreatePartnerDataRequest) {
      const { $trpc } = useNuxtApp()
      
      try {
        this.loading = true
        const { success, message, data } = await $trpc.partner.dataRequests.createDataRequest.mutate(input)
        
        if (success && data) {
          this.dataRequest = data
          this.loading = false
          useToast("success", "Data Request", "Data request created successfully.")
          await navigateTo("/partner/data-requests")
        }
        
        this.loading = false
        return { success, message, data }
      } catch(error) {
        console.log(error)
        this.loading = false
        useToast("error", "Data Request", "Failed to create data request.")
      }
    },

    async updateDataRequest(input: UpdatePartnerDataRequest) {
      const { $trpc } = useNuxtApp()
      
      try {
        this.loading = true
        const { success, message, data } = await $trpc.partner.dataRequests.updateDataRequest.mutate(input)
        
        if (success && data) {
          this.dataRequest = data
          this.loading = false
          useToast("success", "Data Request", "Data request updated successfully.")
          await navigateTo("/partner/data-requests")
        }
        
        this.loading = false
        return { success, message, data }
      } catch(error) {
        console.log(error)
        this.loading = false
        useToast("error", "Data Request", "Failed to update data request.")
      }
    },

    async deleteDataRequest(input: DeletePartnerDataRequest) {
      const { $trpc } = useNuxtApp()
      
      try {
        this.loading = true
        const { success, message, data } = await $trpc.partner.dataRequests.deleteDataRequest.mutate(input)
        
        if (success && data) {
          this.dataRequests = this.dataRequests.filter((request) => request.id !== input.id)
          this.loading = false
          useToast("success", "Data Request", "Data request deleted successfully.")
        }
        
        this.loading = false
        return { success, message, data }
      } catch(error) {
        console.log(error)
        this.loading = false
        useToast("error", "Data Request", "Failed to delete data request.")
      }
    },
  },
})