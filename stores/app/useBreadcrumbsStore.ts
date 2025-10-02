import { defineStore } from "pinia"
import type { Breadcrumb } from "@/types/app"

export const useBreadcrumbsStore = defineStore("breadcrumbs", {
	state: () => ({
		breadcrumbs: [] as Breadcrumb[],
	}),
	actions: {
		setBreadcrumbs(breadcrumbs: Breadcrumb[]) {
			this.breadcrumbs = breadcrumbs
		},
	},
})
