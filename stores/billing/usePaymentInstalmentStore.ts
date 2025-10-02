import { defineStore } from "pinia"
import type { CreatePaymentInstalment, UpdatePaymentInstalment, TablePaymentInstalment } from "@/types/billing"

export const usePaymentInstalmentStore = defineStore("paymentInstalment", {
  state: () => ({
    loading: true,
    paymentInstalment: null as CreatePaymentInstalment | UpdatePaymentInstalment | null,
    paymentInstalments: [] as TablePaymentInstalment[],
  }),

  actions: {
    async getPaymentInstalments() {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.paymentInstalments.getPaymentInstalments.query()

        if (success && data) {
          this.paymentInstalments = data.map((instalment: any) => ({
            ...instalment,
            plan: instalment.plan ?? {},
            payment: instalment.payment ?? {},
          }))
          this.loading = false
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Payment Instalment",
          "Payment instalments could not be fetched."
        )
      }
    },

    async getPaymentInstalment(id: string) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.paymentInstalments.getPaymentInstalment.query({ id })

        if (success && data) {
          this.paymentInstalment = data
          this.loading = false
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Payment Instalment",
          "Payment instalment could not be fetched."
        )
      }
    },

    async createPaymentInstalment(paymentInstalment: CreatePaymentInstalment) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.paymentInstalments.createPaymentInstalment.mutate(paymentInstalment)

        if (success && data) {
          this.loading = false
          useToast(
            "success",
            "Payment Instalment",
            "Payment instalment created successfully."
          )
          await navigateTo(`/billing/payment-instalments`)
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Payment Instalment",
          "Payment instalment could not be created."
        )
      }
    },

    async updatePaymentInstalment(paymentInstalment: UpdatePaymentInstalment) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.paymentInstalments.updatePaymentInstalment.mutate(paymentInstalment)

        if (success && data) {
          this.loading = false
          useToast(
            "success",
            "Payment Instalment",
            "Payment instalment updated successfully."
          )
          await navigateTo(`/billing/payment-instalments`)
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Payment Instalment",
          "Payment instalment could not be updated."
        )
      }
    },

    async deletePaymentInstalment(id: string) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.paymentInstalments.deletePaymentInstalment.mutate({ id })

        if (success && data) {
          this.paymentInstalments = this.paymentInstalments.filter((instalment) => instalment.id !== id)
          this.loading = false
          useToast(
            "success",
            "Payment Instalment",
            "Payment instalment deleted successfully."
          )
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Payment Instalment",
          "Payment instalment could not be deleted."
        )
      }
    },
  },
})