import { defineStore } from "pinia"
import type { 
  CreatePartner, 
  UpdatePartner, 
  TablePartner, 
  GetPartner, 
  DeletePartner, 
  PartnerType 
} from "@/types/partner"

export const usePartnerStore = defineStore("partner", {
  state: () => ({
    loading: true,
    partner: null as CreatePartner | UpdatePartner | null,
    partners: [] as TablePartner[],
  }),

  actions: {
    async getPartners(input?: PartnerType) {
      const { $trpc } = useNuxtApp()
      
      try {
        this.loading = true
        const { success, message, data } = await $trpc.getPartners.query(input ?? undefined)
        
        if (success && data) {
          this.partners = data
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
          message: "Failed to fetch partners.",
          data: null,
        }
      }
    },

    async getPartner(input: GetPartner) {
      const { $trpc } = useNuxtApp()
      
      try {
        this.loading = true
        const { success, message, data } = await $trpc.partner.getPartner.query(input)
        
        if (success && data) {
          this.partner = data
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
          message: "Failed to fetch partner.",
          data: null,
        }
      }
    },

    async createPartner(input: CreatePartner) {
      const { $trpc } = useNuxtApp()
      
      try {
        this.loading = true
        const { success, message, data } = await $trpc.partner.createPartner.mutate(input)
        
        if (success && data) {
          this.partner = data
          this.loading = false
          useToast("success", "Partner", "Partner created successfully.")
          await navigateTo("/partner")
        }
        
        this.loading = false
        return { success, message, data }
      } catch(error) {
        console.log(error)
        this.loading = false
        useToast("error", "Partner", "Failed to create partner.")
      }
    },

    async updatePartner(input: UpdatePartner) {
      const { $trpc } = useNuxtApp()
      
      try {
        this.loading = true
        const { success, message, data } = await $trpc.partner.updatePartner.mutate(input)
        
        if (success && data) {
          this.partner = data
          this.loading = false
          useToast("success", "Partner", "Partner updated successfully.")
          await navigateTo("/partner")
        }
        
        this.loading = false
        return { success, message, data }
      } catch(error) {
        console.log(error)
        this.loading = false
        useToast("error", "Partner", "Failed to update partner.")
      }
    },

    async deletePartner(input: DeletePartner) {
      const { $trpc } = useNuxtApp()
      
      try {
        this.loading = true
        const { success, message, data } = await $trpc.deletePartner.mutate(input)
        
        if (success && data) {
          this.partners = this.partners.filter((partner) => partner.id !== input.id)
          this.loading = false
          useToast("success", "Partner", "Partner deleted successfully.")
        }
        
        this.loading = false
        return { success, message, data }
      } catch(error) {
        console.log(error)
        this.loading = false
        useToast("error", "Partner", "Failed to delete partner.")
      }
    },
  },
})