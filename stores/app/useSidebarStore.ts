import { defineStore } from "pinia"

export const useSidebarStore = defineStore("sidebar", {
	state: () => ({
		expanded: true,
	}),
	actions: {
		toggleSidebar() {
			this.expanded = !this.expanded
		},
	},
	persist: true,
})