import { defineStore } from "pinia"
import type { 
  CreatePartnerClaimRequest, 
  UpdatePartnerClaimRequest, 
  TablePartnerClaimRequest, 
  GetPartnerClaimRequest, 
  DeletePartnerClaimRequest 
} from "@/types/partner"

export const usePartnerClaimRequestStore = defineStore("partnerClaimRequest", {
  state: () => ({
    loading: true,
    claimRequest: null as CreatePartnerClaimRequest | UpdatePartnerClaimRequest | null,
    claimRequests: [] as TablePartnerClaimRequest[],
  }),

  actions: {
    async getClaimRequests(partnerId?: string) {
      const { $trpc } = useNuxtApp()
      
      try {
        this.loading = true
        const { success, message, data } = await $trpc.partner.claimRequests.getClaimRequests.query(
          partnerId ? { partnerId } : undefined
        )
        
        if (success && data) {
          this.claimRequests = data
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
          message: "Failed to fetch claim requests.",
          data: null,
        }
      }
    },

    async getClaimRequest(input: GetPartnerClaimRequest) {
      const { $trpc } = useNuxtApp()
      
      try {
        this.loading = true
        const { success, message, data } = await $trpc.partner.claimRequests.getClaimRequest.query(input)
        
        if (success && data) {
          this.claimRequest = data
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
          message: "Failed to fetch claim request.",
          data: null,
        }
      }
    },

    async createClaimRequest(input: CreatePartnerClaimRequest) {
      const { $trpc } = useNuxtApp()
      
      try {
        this.loading = true
        const { success, message, data } = await $trpc.partner.claimRequests.createClaimRequest.mutate(input)
        
        if (success && data) {
          this.claimRequest = data
          this.loading = false
          useToast("success", "Claim Request", "Claim request created successfully.")
          await navigateTo("/partner/claim-requests")
        }
        
        this.loading = false
        return { success, message, data }
      } catch(error) {
        console.log(error)
        this.loading = false
        useToast("error", "Claim Request", "Failed to create claim request.")
      }
    },

    async updateClaimRequest(input: UpdatePartnerClaimRequest) {
      const { $trpc } = useNuxtApp()
      
      try {
        this.loading = true
        const { success, message, data } = await $trpc.partner.claimRequests.updateClaimRequest.mutate(input)
        
        if (success && data) {
          this.claimRequest = data
          this.loading = false
          useToast("success", "Claim Request", "Claim request updated successfully.")
          await navigateTo("/partner/claim-requests")
        }
        
        this.loading = false
        return { success, message, data }
      } catch(error) {
        console.log(error)
        this.loading = false
        useToast("error", "Claim Request", "Failed to update claim request.")
      }
    },

    async deleteClaimRequest(input: DeletePartnerClaimRequest) {
      const { $trpc } = useNuxtApp()
      
      try {
        this.loading = true
        const { success, message, data } = await $trpc.partner.claimRequests.deleteClaimRequest.mutate(input)
        
        if (success && data) {
          this.claimRequests = this.claimRequests.filter((request) => request.id !== input.id)
          this.loading = false
          useToast("success", "Claim Request", "Claim request deleted successfully.")
        }
        
        this.loading = false
        return { success, message, data }
      } catch(error) {
        console.log(error)
        this.loading = false
        useToast("error", "Claim Request", "Failed to delete claim request.")
      }
    },
  },
})