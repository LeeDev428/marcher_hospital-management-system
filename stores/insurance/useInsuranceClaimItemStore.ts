import { defineStore } from "pinia"
import type { CreateInsuranceClaimItem, UpdateInsuranceClaimItem, TableInsuranceClaimItem } from "@/types/insurance"

export const useInsuranceClaimItemStore = defineStore("insuranceClaimItem", {
	state: () => ({
		loading: true,
		claimItem: null as CreateInsuranceClaimItem | UpdateInsuranceClaimItem | null,
		claimItems: [] as TableInsuranceClaimItem[],
	}),

	actions: {
		async getInsuranceClaimItems() {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.insurance.claimItems.getInsuranceClaimItems.query()

				if (success && data) {
					this.claimItems = data
					this.loading = false
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Insurance Claim Item",
					"Insurance claim items could not be fetched."
				)
			}
		},

		async getInsuranceClaimItem(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.insurance.claimItems.getInsuranceClaimItem.query({ id })

				if (success && data) {
					this.claimItem = data
					this.loading = false
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Insurance Claim Item",
					"Insurance claim item could not be fetched."
				)
			}
		},

		async createInsuranceClaimItem(claimItem: CreateInsuranceClaimItem) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.insurance.claimItems.createInsuranceClaimItem.mutate(claimItem)

				if (success && data) {
					this.loading = false
					useToast(
						"success",
						"Insurance Claim Item",
						"Insurance claim item created successfully."
					)
					await navigateTo(`/insurance/claim-items`)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Insurance Claim Item",
					"Insurance claim item could not be created."
				)
			}
		},

		async updateInsuranceClaimItem(claimItem: UpdateInsuranceClaimItem) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.insurance.claimItems.updateInsuranceClaimItem.mutate(claimItem)

				if (success && data) {
					this.loading = false
					useToast(
						"success",
						"Insurance Claim Item",
						"Insurance claim item updated successfully."
					)
					await navigateTo(`/insurance/claim-items`)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Insurance Claim Item",
					"Insurance claim item could not be updated."
				)
			}
		},

		async deleteInsuranceClaimItem(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.insurance.claimItems.deleteInsuranceClaimItem.mutate({ id })

				if (success && data) {
					this.claimItems = this.claimItems.filter((claimItem) => claimItem.id !== id)
					this.loading = false
					useToast(
						"success",
						"Insurance Claim Item",
						"Insurance claim item deleted successfully."
					)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Insurance Claim Item",
					"Insurance claim item could not be deleted."
				)
			}
		},
	},
})