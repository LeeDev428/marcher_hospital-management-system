import { defineStore } from "pinia"
import type { TablePharmacyCategory, CreatePharmacyCategory, UpdatePharmacyCategory } from "@/types/pharmacy"

export const usePharmacyCategoryStore = defineStore("pharmacyCategory", {
	state: () => ({
		loading: true,
		category: null as CreatePharmacyCategory | UpdatePharmacyCategory | null,
		categories: [] as TablePharmacyCategory[],
	}),

	actions: {
		async getPharmacyCategories() {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.categories.getPharmacyCategories.query()

				if (success && data) {
					this.categories = data
					this.loading = false
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Category",
					"Pharmacy categories could not be fetched."
				)
			}
		},

		async getPharmacyCategory(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.categories.getPharmacyCategory.query({ id })

				if (success && data) {
					this.category = data
					this.loading = false
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Category",
					"Pharmacy category could not be fetched."
				)
			}
		},

		async createPharmacyCategory(category: CreatePharmacyCategory) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.categories.createPharmacyCategory.mutate(category)

				if (success && data) {
					this.loading = false
					useToast(
						"success",
						"Pharmacy Category",
						"Pharmacy category created successfully."
					)
					await navigateTo(`/pharmacy/categories`)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Category",
					"Pharmacy category could not be created."
				)
			}
		},

		async updatePharmacyCategory(category: UpdatePharmacyCategory) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.categories.updatePharmacyCategory.mutate(category)

				if (success && data) {
					this.loading = false
					useToast(
						"success",
						"Pharmacy Category",
						"Pharmacy category updated successfully."
					)
					await navigateTo(`/pharmacy/categories`)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Category",
					"Pharmacy category could not be updated."
				)
			}
		},

		async deletePharmacyCategory(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.categories.deletePharmacyCategory.mutate({ id })

				if (success && data) {
					this.categories = this.categories.filter((category) => category.id !== id)
					this.loading = false
					useToast(
						"success",
						"Pharmacy Category",
						"Pharmacy category deleted successfully."
					)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Category",
					"Pharmacy category could not be deleted."
				)
			}
		},
	},
})
