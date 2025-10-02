import { defineStore } from "pinia"
import type { CreatePharmacyBrand, UpdatePharmacyBrand, TablePharmacyBrand } from "~/types/pharmacy"

export const usePharmacyBrandStore = defineStore("pharmacyBrand", {
	state: () => ({
		loading: true,
		brand: null as CreatePharmacyBrand | UpdatePharmacyBrand | null,
		brands: [] as TablePharmacyBrand[],
	}),

	actions: {
		async getPharmacyBrands() {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.brands.getPharmacyBrands.query()

				if (success && data) {
					this.brands = data
					this.loading = false
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Brand",
					"Pharmacy brands could not be fetched."
				)
			}
		},

		async getPharmacyBrand(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.brands.getPharmacyBrand.query({ id })

				if (success && data) {
					this.brand = data
					this.loading = false
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Brand",
					"Pharmacy brand could not be fetched."
				)
			}
		},

		async createPharmacyBrand(brand: CreatePharmacyBrand) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.brands.createPharmacyBrand.mutate(brand)

				if (success && data) {
					this.loading = false
					useToast(
						"success",
						"Pharmacy Brand",
						"Pharmacy brand created successfully."
					)
					await navigateTo(`/pharmacy/brands`)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Brand",
					"Pharmacy brand could not be created."
				)
			}
		},

		async updatePharmacyBrand(brand: UpdatePharmacyBrand) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.brands.updatePharmacyBrand.mutate(brand)

				if (success && data) {
					this.loading = false
					useToast(
						"success",
						"Pharmacy Brand",
						"Pharmacy brand updated successfully."
					)
					await navigateTo(`/pharmacy/brands`)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Brand",
					"Pharmacy brand could not be updated."
				)
			}
		},

		async deletePharmacyBrand(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.brands.deletePharmacyBrand.mutate({ id })

				if (success && data) {
					this.brands = this.brands.filter((brand) => brand.id !== id)
					this.loading = false
					useToast(
						"success",
						"Pharmacy Brand",
						"Pharmacy brand deleted successfully."
					)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Brand",
					"Pharmacy brand could not be deleted."
				)
			}
		},
	},
})
