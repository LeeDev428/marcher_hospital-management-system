<script setup lang="ts">
import { useTitle } from "@vueuse/core"
import { useSidebarStore, useBreadcrumbsStore } from "~/stores/app"

import { SidebarBase, SidebarItem } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"

import { LayoutBreadcrumbs } from "@/components/layout/breadcrumbs"
import { QRCodeScanner } from "@/components/app/qrcode"

const sidebarStore = useSidebarStore()
const breadcrumbsStore = useBreadcrumbsStore()
const { title } = defineProps<{
	title: string
}>()

const links = [
	{
		label: "Dashboard",
		links: [
			{
				label: "Overview",
				icon: "mdi:view-dashboard",
				link: "/admin/dashboard",
			},
		]
	},
	{
		label: "User Management", 
		links: [
			{
				label: "Users",
				icon: "mdi:account-group",
				link: "/admin/users",
			},
			{
				label: "Staff",
				icon: "mdi:doctor",
				link: "/admin/staff",
			},
		]
	},
	{
		label: "System Administration",
		links: [
			{
				label: "Settings",
				icon: "mdi:cog",
				link: "/admin/settings",
			},
			{
				label: "Logs",
				icon: "mdi:file-document",
				link: "/admin/logs",
			},
		]
	},
	{
		label: "Analytics & Reports",
		links: [
			{
				label: "Analytics",
				icon: "mdi:chart-line",
				link: "/admin/analytics",
			},
			{
				label: "Reports",
				icon: "mdi:file-chart",
				link: "/admin/reports",
			},
		]
	}
]

onMounted(() => {
	useTitle(title)
})
</script>

<template>
	<div class="flex h-full w-full">
		<!-- Make Sidebar Component -->
		<SidebarBase>
			<template v-for="link in links" :key="link.label">
				<p class="text-xs text-gray-500 uppercase font-medium">{{ link.label }}</p>
				<ul class="h-fit flex flex-col gap-1.5">
					<SidebarItem
						v-for="item in link.links"
						:key="item.label"
						:label="item.label"
						:icon="item.icon"
						:link="item.link"
						:active="breadcrumbsStore.breadcrumbs[0]?.link === item.link"
					/>
				</ul>
			</template>
		</SidebarBase>
		<!-- Make Header Component -->
		<div class="h-full w-full flex flex-col">
			<div class="flex-none p-6 bg-white shadow-sm">
				<div class="flex justify-between">
					<div class="flex items-center gap-4">
						<Button variant="outline" size="icon" @click="sidebarStore.toggleSidebar">
							<Icon name="mdi:menu" />
						</Button>
						<LayoutBreadcrumbs :items="breadcrumbsStore.breadcrumbs" />
					</div>
					<div class="flex items-center gap-2">
						<QRCodeScanner />
					</div>
				</div>
			</div>
			<div class="h-full w-full flex flex-col gap-4 p-4 overflow-y-auto">
				<slot />
			</div>
		</div>
	</div>
</template>