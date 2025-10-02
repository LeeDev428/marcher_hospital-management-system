<script setup lang="ts">
import { useTitle } from "@vueuse/core"
import { useSidebarStore, useBreadcrumbsStore } from "~/stores/app"

import { SidebarBase, SidebarItem } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"

import { LayoutBreadcrumbs } from "@/components/layout/breadcrumbs"
import { QRCodeScanner } from "@/components/app/qrcode"
import { CommandPalette } from "@/components/layout/command"
import { NotificationsPopover } from "@/components/layout/notifications"

const { title } = defineProps<{
	title: string
}>()

const sidebarStore = useSidebarStore()
const breadcrumbsStore = useBreadcrumbsStore()

const links = [
	{
		label: "Partner",
		links: [
			{
				label: "Partner",
				icon: "mdi:handshake",
				link: "/partner",
			},
			{
				label: "Claim Request",
				icon: "mdi:clipboard-check",
				link: "/partner/claim-requests",
			},
			{
				label: "Data Request",
				icon: "mdi:database-search",
				link: "/partner/data-requests",
			},
		],
	},
]

onMounted(() => {
	useTitle(title)
})
</script>

<template>
	<div class="flex h-full w-full">
		<!-- Sidebar -->
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

		<!-- Header + Content -->
		<div class="h-full w-full flex flex-col">
			<!-- Header -->
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
						<CommandPalette />
						<NotificationsPopover />
					</div>
				</div>
			</div>

			<!-- Page Content -->
			<div class="h-full w-full flex flex-col gap-4 p-4 overflow-y-auto">
				<h1 class="text-2xl font-bold">{{ title }}</h1>
				<slot />
			</div>
		</div>
	</div>
</template>
