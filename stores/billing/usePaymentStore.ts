import { defineStore } from "pinia"
import type { CreatePayment, UpdatePayment, TablePayment } from "@/types/billing"

export const usePaymentStore = defineStore("payment", {
  state: () => ({
    loading: true,
    payment: null as CreatePayment | UpdatePayment | null,
    payments: [] as TablePayment[],
  }),

  actions: {
    async getPayments() {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.payments.getPayments.query()

        if (success && data) {
          this.payments = data.map((item: any) => ({
            id: item.id,
            transactionId: item.transactionId ?? "", // Provide fallback if missing
            amount: item.amount ?? 0,
            transaction: item.transaction ?? {
              id: "",
              status: "",
              encounter: {
                id: "",
                patient: {
                  id: "",
                  firstName: "",
                  lastName: "",
                  email: null,
                },
              },
              createdAt: "",
              updatedAt: "",
            },
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            instalments: item.instalments ?? [],
          }))
          this.loading = false
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Payment",
          "Payments could not be fetched."
        )
      }
    },

    async getPayment(id: string) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.payments.getPayment.query({ id })

        if (success && data) {
          this.payment = data
          this.loading = false
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Payment",
          "Payment could not be fetched."
        )
      }
    },

    async createPayment(payment: CreatePayment) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.payments.createPayment.mutate(payment)

        if (success && data) {
          this.loading = false
          useToast(
            "success",
            "Payment",
            "Payment created successfully."
          )
          await navigateTo(`/billing/payments`)
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Payment",
          "Payment could not be created."
        )
      }
    },

    async updatePayment(payment: UpdatePayment) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.payments.updatePayment.mutate(payment)

        if (success && data) {
          this.loading = false
          useToast(
            "success",
            "Payment",
            "Payment updated successfully."
          )
          await navigateTo(`/billing/payments`)
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Payment",
          "Payment could not be updated."
        )
      }
    },

    async deletePayment(id: string) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.payments.deletePayment.mutate({ id })

        if (success && data) {
          this.payments = this.payments.filter((payment) => payment.id !== id)
          this.loading = false
          useToast(
            "success",
            "Payment",
            "Payment deleted successfully."
          )
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Payment",
          "Payment could not be deleted."
        )
      }
    },
  },
})
