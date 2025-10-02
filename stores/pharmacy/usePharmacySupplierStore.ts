import { defineStore } from "pinia"
import type { CreatePharmacySupplier, UpdatePharmacySupplier, TablePharmacySupplier } from "@/types/pharmacy"

export const usePharmacySupplierStore = defineStore("pharmacySupplier", {
	state: () => ({
		loading: true,
		supplier: null as CreatePharmacySupplier | UpdatePharmacySupplier | null,
		suppliers: [] as TablePharmacySupplier[],
	}),

	actions: {
		async getPharmacySuppliers() {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.suppliers.getPharmacySuppliers.query()

				if (success && data) {
					this.suppliers = data
					this.loading = false
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Supplier",
					"Pharmacy suppliers could not be fetched."
				)
			}
		},

		async getPharmacySupplier(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.suppliers.getPharmacySupplier.query({ id })

				if (success && data) {
					this.supplier = data
					this.loading = false
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Supplier",
					"Pharmacy supplier could not be fetched."
				)
			}
		},

		async createPharmacySupplier(supplier: CreatePharmacySupplier) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.suppliers.createPharmacySupplier.mutate(supplier)

				if (success && data) {
					this.loading = false
					useToast(
						"success",
						"Pharmacy Supplier",
						"Pharmacy supplier created successfully."
					)
					await navigateTo(`/pharmacy/suppliers`)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Supplier",
					"Pharmacy supplier could not be created."
				)
			}
		},

		async updatePharmacySupplier(supplier: UpdatePharmacySupplier) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.suppliers.updatePharmacySupplier.mutate(supplier)

				if (success && data) {
					this.loading = false
					useToast(
						"success",
						"Pharmacy Supplier",
						"Pharmacy supplier updated successfully."
					)
					await navigateTo(`/pharmacy/suppliers`)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Supplier",
					"Pharmacy supplier could not be updated."
				)
			}
		},

		async deletePharmacySupplier(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.suppliers.deletePharmacySupplier.mutate({ id })

				if (success && data) {
					this.suppliers = this.suppliers.filter((supplier) => supplier.id !== id)
					this.loading = false
					useToast(
						"success",
						"Pharmacy Supplier",
						"Pharmacy supplier deleted successfully."
					)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Supplier",
					"Pharmacy supplier could not be deleted."
				)
			}
		},
	},
})
