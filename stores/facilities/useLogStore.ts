import { defineStore } from "pinia"
import type { FacilityLog } from "@/types/facilities/facilitylogs"
import { useToast } from "@/composables/useToast"

export const useFacilityLogStore = defineStore("facilityLogs", {
	state: () => ({
		logs: [] as FacilityLog[],
		loading: false,
	}),

	actions: {
		async fetchLogs() {
			const { $trpc } = useNuxtApp()

			this.loading = true
			try {
				const { success, message, data } =
					await $trpc.facilityLogs.getFacilityLogs.query()

				if (success && data) {
					this.logs = data as FacilityLog[]
				} else {
					useToast("error", "Facility Logs", message || "Unknown error")
				}
			} catch (error) {
				console.error("Failed to fetch facility logs:", error)
				useToast("error", "Facility Logs", "Failed to fetch logs.")
				this.logs = []
			} finally {
				this.loading = false
			}
		},
	},
})
