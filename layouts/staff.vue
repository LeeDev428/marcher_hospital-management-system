<script setup lang="ts">
import { useTitle } from "@vueuse/core"
import { useSidebarStore, useBreadcrumbsStore } from "~/stores/app"

import { SidebarBase, SidebarItem } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"

import { LayoutBreadcrumbs } from "@/components/layout/breadcrumbs"
import { QRCodeScanner } from "@/components/app/qrcode"
// import { CommandPalette } from "@/components/layout/command"
// import { NotificationsPopover } from "@/components/layout/notifications"

const sidebarStore = useSidebarStore()
const breadcrumbsStore = useBreadcrumbsStore()
const { title } = defineProps<{
	title: string
}>()



const links = [
	{
		label: "Menu",
		links: [
			{
				label: "Dashboard",
				icon: "mdi:view-dashboard",
				link: "/",
			},
			{
				label: "Patients",
				icon: "mdi:identification-card",
				link: "/patients",
			},
			{
				label: "Staff",
				icon: "mdi:account-card",
				link: "/staff",
			},
			{
				label: "Appointments",
				icon: "mdi:calendar",
				link: "/appointments",
			},
			{
				label: "Pharmacy",
				icon: "mdi:pill",
				link: "/pharmacy",
			},
			{
				label: "Facilities",
				icon: "mdi:building",
				link: "/facilities",
			},
			{
				label: "Billing",
				icon: "mdi:cash",
				link: "/billing",
			},
			{
				label: "Insurance",
				icon: "mdi:ticket-account",
				link: "/insurance",
			},
			{
				label: "Reports",
				icon: "mdi:chart-box",
				link: "/reports",
			},
		]
	},
	{
		label: "Admin",
		links: [
			{
				label: "Users",
				icon: "mdi:account",
				link: "/users",
			},
			{
				label: "Logs",
				icon: "mdi:file-document",
				link: "/logs",
			},
			{
				label: "Settings",
				icon: "mdi:cog",
				link: "/settings",
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
						<!-- <CommandPalette />
						<NotificationsPopover /> -->
					</div>
				</div>
			</div>
			<div class="h-full w-full flex flex-col gap-4 p-4 overflow-y-auto">
				<slot />
			</div>
		</div>
	</div>
</template>
