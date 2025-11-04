import { defineStore } from "pinia"
import type { CreateTransaction, UpdateTransaction, TableTransaction } from "@/types/billing"

export const useTransactionStore = defineStore("transaction", {
  state: () => ({
    loading: true,
    transaction: null as CreateTransaction | UpdateTransaction | null,
    transactions: [] as TableTransaction[],
  }),

  actions: {
    async getTransactions() {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message: _message, data } = await $trpc.billing.transactions.getTransactions.query()

        if (success && data) {
          // Data is already properly formatted from the router
          this.transactions = data
          this.loading = false
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Transaction",
          "Transactions could not be fetched."
        )
      }
    },

    async getTransaction(id: string) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message: _message, data } = await $trpc.billing.transactions.getTransaction.query({ id })

        if (success && data) {
          this.transaction = {
            ...data,
            status: data.status as "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "FAILED",
          }
          this.loading = false
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Transaction",
          "Transaction could not be fetched."
        )
      }
    },

    async createTransaction(transaction: CreateTransaction) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.transactions.createTransaction.mutate(transaction)

        if (success && data) {
          this.loading = false
          useToast(
            "success",
            "Transaction",
            message || "Transaction created successfully."
          )
          await navigateTo(`/billing_staff/invoices`)
        } else {
          this.loading = false
          useToast(
            "error",
            "Transaction",
            message || "Transaction could not be created."
          )
        }
      } catch (error: any) {
        this.loading = false
        console.error("Create transaction error:", error)
        useToast(
          "error",
          "Transaction",
          error?.message || "Transaction could not be created."
        )
      }
    },

    async updateTransaction(transaction: UpdateTransaction) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message: _message, data } = await $trpc.billing.transactions.updateTransaction.mutate(transaction)

        if (success && data) {
          this.loading = false
          useToast(
            "success",
            "Transaction",
            "Transaction updated successfully."
          )
          await navigateTo(`/billing/transactions`)
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Transaction",
          "Transaction could not be updated."
        )
      }
    },

    async deleteTransaction(id: string) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message: _message, data } = await $trpc.billing.transactions.deleteTransaction.mutate({ id })

        if (success && data) {
          this.transactions = this.transactions.filter((transaction) => transaction.id !== id)
          this.loading = false
          useToast(
            "success",
            "Transaction",
            "Transaction deleted successfully."
          )
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Transaction",
          "Transaction could not be deleted."
        )
      }
    },
  },
})