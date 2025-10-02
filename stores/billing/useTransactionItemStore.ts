import { defineStore } from "pinia"
import type { CreateTransactionItem, UpdateTransactionItem, TableTransactionItem, CreateTransaction, UpdateTransaction } from "@/types/billing"

export const useTransactionItemStore = defineStore("transactionItem", {
  state: () => ({
    loading: true,
    transactionItem: null as CreateTransactionItem | UpdateTransactionItem | null,
    transactionItems: [] as TableTransactionItem[],
    transaction: null as any, // You may want to type this more strictly
    transactions: [] as any[], // Add this line to match actions that use transactions
  }),

  actions: {
    async getTransactionItems() {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.transactionItems.getTransactionItems.query()

        if (success && data) {
          this.transactionItems = data.map((item: any) => ({
            ...item,
            transaction: item.transaction ?? {
              id: "",
              status: "",
              encounter: {
                id: "",
                patient: {
                  id: "",
                  firstName: "",
                  lastName: "",
                  email: null
                }
              },
              createdAt: "",
              updatedAt: ""
            }
          }))
          this.loading = false
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Transaction Item",
          "Transaction items could not be fetched."
        )
      }
    },

    async getTransactionItem(id: string) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.transactionItems.getTransactionItem.query({ id })

        if (success && data) {
          this.transactionItem = data
          this.loading = false
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Transaction Item",
          "Transaction item could not be fetched."
        )
      }
    },

    async createTransactionItem(transactionItem: CreateTransactionItem) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.transactionItems.createTransactionItem.mutate(transactionItem)

        if (success && data) {
          this.loading = false
          useToast(
            "success",
            "Transaction Item",
            "Transaction item created successfully."
          )
          await navigateTo(`/billing/transaction-items`)
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
        const { success, message, data } = await $trpc.billing.transactions.getTransaction.query({ id })
        if (success && data) {
          this.transaction = data
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
            "Transaction created successfully."
          )
          await navigateTo(`/billing/transactions`)
        }
      } catch (error) {
        this.loading = false
        console.error(error)
        useToast(
          "error",
          "Transaction",
          "Transaction could not be created."
        )
      }
    },

    async updateTransaction(transaction: UpdateTransaction) {
      const { $trpc } = useNuxtApp()

      try {
        this.loading = true
        const { success, message, data } = await $trpc.billing.transactions.updateTransaction.mutate(transaction)

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
        const { success, message, data } = await $trpc.billing.transactions.deleteTransaction.mutate({ id })

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

function Toast(arg0: string, arg1: string, arg2: string) {
  throw new Error("Function not implemented.")
}
