import { defineStore } from "pinia"
import type { TableBuilding, CreateBuilding, UpdateBuilding } from "@/types/facilities/building"
import { useToast } from "@/composables/useToast"

export const useBuildingStore = defineStore("building", {
	state: () => ({
		loading: true,
		buildings: [] as TableBuilding[],
		building: null as CreateBuilding | UpdateBuilding | null,
	}),

	actions: {
		async getBuildings() {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.facilities.buildings.getBuildings.query()

				if (success && data) {
					this.buildings = data
					this.loading = false
					return {
						success,
						message,
						data,
					}
				}

				this.loading = false
				return {
					success,
					message,
					data,
				}
			} catch (error) {
				console.log(error)
				useToast(
					"error",
					"Buildings",
					"Failed to fetch buildings."
				)
			}
		},

		async getBuilding(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.facilities.buildings.getBuilding.query({ id })

				if (success && data) {
					this.building = data
					this.loading = false
					return {
						success,
						message,
						data,
					}
				}

				this.loading = false
				return {
					success,
					message,
					data,
				}
			} catch (error) {
				console.log(error)
				useToast(
					"error",
					"Building",
					"Failed to fetch building."
				)
			}
		},

		async createBuilding(building: CreateBuilding) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.facilities.buildings.createBuilding.mutate(building)

				if (success && data) {
					this.building = data
					this.loading = false
					useToast(
						"success",
						"Building",
						"Building created successfully."
					)
					await navigateTo("/facilities/buildings")
				}

				this.loading = false
				return {
					success,
					message,
					data,
				}
			} catch (error) {
				console.log(error)
				useToast(
					"error",
					"Building",
					"Failed to create building."
				)
			}
		},

		async updateBuilding(building: UpdateBuilding) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.facilities.buildings.updateBuilding.mutate(building)

				if (success && data) {
					this.building = data
					this.loading = false
					useToast(
						"success",
						"Building",
						"Building updated successfully."
					)
					await navigateTo("/facilities/buildings")
				}

				this.loading = false
				return {
					success,
					message,
					data,
				}
			} catch (error) {
				console.log(error)
				useToast(
					"error",
					"Building",
					"Failed to update building."
				)
			}
		},

		async deleteBuilding(id: string) {
			const { $trpc } = useNuxtApp()

			try {
				this.loading = true
				const { success, message, data } = await $trpc.facilities.buildings.deleteBuilding.mutate({ id })

				if (success && data) {
					this.buildings = this.buildings.filter((building) => building.id !== id)
					this.loading = false
					useToast(
						"success",
						"Building",
						"Building deleted successfully."
					)
				}

				this.loading = false
				return {
					success,
					message,
					data,
				}
			} catch (error) {
				console.log(error)
				useToast(
					"error",
					"Building",
					"Failed to delete building."
				)
			}
		},
	}
})