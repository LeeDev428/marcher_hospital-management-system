import { defineStore } from "pinia"
import type { TableLog } from "@/types/logs"

export const useLogsStore = defineStore("logs", {
	state: () => ({
		loading: false,
		logs: [] as TableLog[],
	}),

	actions: {
		async getLogs() {
			const { $trpc } = useNuxtApp()

			this.loading = true
			try {
				const { success, message, data } = await $trpc.logs.getLogs.query()

				if (success && data) {
					this.logs = data
					return
				}

				useToast(
					"error",
					"Logs",
					"Failed to fetch logs."
				)
			} catch (error) {
				console.log(error)
				useToast(
					"error",
					"Logs",
					"Failed to fetch logs."
				)
			} finally {
				this.loading = false
			}
		},
	}
})
