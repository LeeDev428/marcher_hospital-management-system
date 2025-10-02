import { defineStore } from "pinia"
import type { CreateInsuranceClaim, UpdateInsuranceClaim, TableInsuranceClaim } from "@/types/insurance"

export const useInsuranceClaimStore = defineStore("insuranceClaim", {
	state: () => ({
		loading: true,
		claim: null as CreateInsuranceClaim | UpdateInsuranceClaim | null,
		claims: [] as TableInsuranceClaim[],
	}),

	actions: {
		async getInsuranceClaims() {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.insurance.claims.getInsuranceClaims.query()

				if (success && data) {
					this.claims = data.map((claim: any) => ({
						...claim,
						status: claim.status as "PENDING" | "APPROVED" | "REJECTED" | "PROCESSING" | "COMPLETED" | "CANCELLED"
					}))
					this.loading = false
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Insurance Claim",
					"Insurance claims could not be fetched."
				)
			}
		},

		async getInsuranceClaim(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.insurance.claims.getInsuranceClaim.query({ id })

				if (success && data) {
					this.claim = {
						...data,
						status: data.status as "PENDING" | "APPROVED" | "REJECTED" | "PROCESSING" | "COMPLETED" | "CANCELLED"
					}
					this.loading = false
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Insurance Claim",
					"Insurance claim could not be fetched."
				)
			}
		},

		async createInsuranceClaim(claim: CreateInsuranceClaim) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.insurance.claims.createInsuranceClaim.mutate(claim)

				if (success && data) {
					this.loading = false
					useToast(
						"success",
						"Insurance Claim",
						"Insurance claim created successfully."
					)
					await navigateTo(`/insurance/claims`)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Insurance Claim",
					"Insurance claim could not be created."
				)
			}
		},

		async updateInsuranceClaim(claim: UpdateInsuranceClaim) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.insurance.claims.updateInsuranceClaim.mutate(claim)

				if (success && data) {
					this.loading = false
					useToast(
						"success",
						"Insurance Claim",
						"Insurance claim updated successfully."
					)
					await navigateTo(`/insurance/claims`)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Insurance Claim",
					"Insurance claim could not be updated."
				)
			}
		},

		async deleteInsuranceClaim(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.insurance.claims.deleteInsuranceClaim.mutate({ id })

				if (success && data) {
					this.claims = this.claims.filter((claim) => claim.id !== id)
					this.loading = false
					useToast(
						"success",
						"Insurance Claim",
						"Insurance claim deleted successfully."
					)
				}
			} catch (error) {
				this.loading = false
				console.error(error)
				useToast(
					"error",
					"Insurance Claim",
					"Insurance claim could not be deleted."
				)
			}
		},
	},
})