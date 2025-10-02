import { defineStore } from "pinia"
import type { CreatePaymentPlan, UpdatePaymentPlan, TablePaymentPlan } from "@/types/billing"

export const usePaymentPlanStore = defineStore("paymentPlan", {
  state: () => ({
    loading: true,
    paymentPlan: null as CreatePaymentPlan | UpdatePaymentPlan | null,
    paymentPlans: [] as TablePaymentPlan[],
  }),

  actions: {
    async getPaymentPlans() {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.paymentPlans.getPaymentPlans.query()

        if (success && data) {
          this.paymentPlans = data.map(plan => ({
            ...plan,
            cycle: plan.cycle as "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY"
          }))
          this.loading = false
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Payment Plan",
          "Payment plans could not be fetched."
        )
      }
    },

    async getPaymentPlan(id: string) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.paymentPlans.getPaymentPlan.query({ id })

        if (success && data) {
          this.paymentPlan = {
            ...data,
            cycle: data.cycle as "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY"
          }
          this.loading = false
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Payment Plan",
          "Payment plan could not be fetched."
        )
      }
    },

    async createPaymentPlan(paymentPlan: CreatePaymentPlan) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.paymentPlans.createPaymentPlan.mutate(paymentPlan)

        if (success && data) {
          this.loading = false
          useToast(
            "success",
            "Payment Plan",
            "Payment plan created successfully."
          )
          await navigateTo(`/billing/payment-plans`)
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Payment Plan",
          "Payment plan could not be created."
        )
      }
    },

    async updatePaymentPlan(paymentPlan: UpdatePaymentPlan) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.paymentPlans.updatePaymentPlan.mutate(paymentPlan)

        if (success && data) {
          this.loading = false
          useToast(
            "success",
            "Payment Plan",
            "Payment plan updated successfully."
          )
          await navigateTo(`/billing/payment-plans`)
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Payment Plan",
          "Payment plan could not be updated."
        )
      }
    },

    async deletePaymentPlan(id: string) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.paymentPlans.deletePaymentPlan.mutate({ id })

        if (success && data) {
          this.paymentPlans = this.paymentPlans.filter((plan) => plan.id !== id)
          this.loading = false
          useToast(
            "success",
            "Payment Plan",
            "Payment plan deleted successfully."
          )
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Payment Plan",
          "Payment plan could not be deleted."
        )
      }
    },
  },
})
