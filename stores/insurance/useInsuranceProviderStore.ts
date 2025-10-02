import { defineStore } from "pinia"
import type { CreateInsuranceProvider, UpdateInsuranceProvider, TableInsuranceProvider } from "~/types/insurance"

export const useInsuranceProviderStore = defineStore("insuranceProvider", {
	state: () => ({
		loading: true,
		provider: null as CreateInsuranceProvider | UpdateInsuranceProvider | null,
		providers: [] as TableInsuranceProvider[],
	}),

	actions: {
		async getInsuranceProviders() {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.insurance.providers.getInsuranceProviders.query()

				if (success && data) {
					this.providers = data
					this.loading = false
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Insurance Provider",
					"Insurance providers could not be fetched."
				)
			}
		},

		async getInsuranceProvider(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.insurance.providers.getInsuranceProvider.query({ id })

				if (success && data) {
					this.provider = data
					this.loading = false
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Insurance Provider",
					"Insurance provider could not be fetched."
				)
			}
		},

		async createInsuranceProvider(provider: CreateInsuranceProvider) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.insurance.providers.createInsuranceProvider.mutate(provider)

				if (success && data) {
					this.loading = false
					useToast(
						"success",
						"Insurance Provider",
						"Insurance provider created successfully."
					)
					await navigateTo(`/insurance/providers`)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Insurance Provider",
					"Insurance provider could not be created."
				)
			}
		},

		async updateInsuranceProvider(provider: UpdateInsuranceProvider) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.insurance.providers.updateInsuranceProvider.mutate(provider)

				if (success && data) {
					this.loading = false
					useToast(
						"success",
						"Insurance Provider",
						"Insurance provider updated successfully."
					)
					await navigateTo(`/insurance/providers`)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Insurance Provider",
					"Insurance provider could not be updated."
				)
			}
		},

		async deleteInsuranceProvider(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.insurance.providers.deleteInsuranceProvider.mutate({ id })

				if (success && data) {
					this.providers = this.providers.filter((provider) => provider.id !== id)
					this.loading = false
					useToast(
						"success",
						"Insurance Provider",
						"Insurance provider deleted successfully."
					)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Insurance Provider",
					"Insurance provider could not be deleted."
				)
			}
		},
	},
})