<script setup lang="ts">
import { useAuthStore } from "~/stores/app"

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const sidebarCollapsed = ref(false)

const navigationItems = [
	{
		name: "Overview",
		icon: "lucide:layout-dashboard",
		to: "/admin/dashboard",
		active: true
	},
	{
		name: "Users", 
		icon: "lucide:users",
		to: "/admin/users"
	},
	{
		name: "Staff Management",
		icon: "lucide:user-check", 
		to: "/admin/staff"
	},
	{
		name: "System Settings",
		icon: "lucide:settings",
		to: "/admin/settings"
	},
	{
		name: "Security Logs",
		icon: "lucide:shield-check",
		to: "/admin/logs"
	},
	{
		name: "Analytics",
		icon: "lucide:bar-chart-3",
		to: "/admin/analytics"
	},
	{
		name: "Reports",
		icon: "lucide:file-text",
		to: "/admin/reports"
	},
	{
		name: "Database",
		icon: "lucide:database",
		to: "/admin/database"
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