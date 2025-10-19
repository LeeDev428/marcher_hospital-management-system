import { defineStore } from "pinia"
import type { CreatePharmacyItem, PharmacyItem, TablePharmacyItem, UpdatePharmacyItem } from "@/types/pharmacy"

export const usePharmacyItemStore = defineStore("pharmacyItem", {
	state: () => ({
		loading: true,
		item: null as CreatePharmacyItem | UpdatePharmacyItem | null,
		items: [] as TablePharmacyItem[],
	}),

	actions: {
		async getPharmacyItems() {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.items.getPharmacyItems.query()
				if (success && data) {
					// Convert price from string (Decimal) to number
					this.items = data.map((item: any) => ({
						...item,
						price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
					}))
					this.loading = false
				}

			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Items",
					"Pharmacy items could not be fetched."
				)
			}
		},

		async getPharmacyItem(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.items.getPharmacyItem.query({ id })

				if (success && data) {
					// Convert price from string (Decimal) to number for form
					this.item = {
						...data,
						price: typeof data.price === 'string' ? parseFloat(data.price) : data.price
					}
					this.loading = false
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Item",
					"Pharmacy item could not be fetched."
				)
			}
		},

		async createPharmacyItem(item: CreatePharmacyItem) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.items.createPharmacyItem.mutate(item)

				if (success && data) {
					this.loading = false
					useToast(
						"success",
						"Pharmacy Item",
						"Pharmacy item created successfully."
					)
					await navigateTo(`/staff/pharmacy`)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Item",
					"Pharmacy item could not be created."
				)
			}
		},

		async updatePharmacyItem(item: UpdatePharmacyItem) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.items.updatePharmacyItem.mutate(item)

				if (success && data) {
					this.loading = false
					useToast(
						"success",
						"Pharmacy Item",
						"Pharmacy item updated successfully."
					)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Item",
					"Pharmacy item could not be updated."
				)
			}
		},

		async deletePharmacyItem(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.pharmacy.items.deletePharmacyItem.mutate({ id })

				if (success && data) {
					this.items = this.items.filter((item) => item.id !== id)
					this.loading = false
					useToast(
						"success",
						"Pharmacy Item",
						"Pharmacy item deleted successfully."
					)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Pharmacy Item",
					"Pharmacy item could not be deleted."
				)
			}
		},
	}
})