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
		name: "User Management", 
		icon: "lucide:users",
		to: "/admin/users"
	},
    {
        name: "Staff Management",
        icon: "lucide:stethoscope", 
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

const logout = async () => {
	await authStore.logout()
	await navigateTo('/auth/login')
}
</script>

<template>
	<div class="flex h-screen bg-gray-100">
		<!-- Sidebar -->
		<div :class="[sidebarCollapsed ? 'w-16' : 'w-64', 'bg-slate-900 shadow-lg transition-all duration-300 flex flex-col']">
			<!-- Hospital Header -->
			<div class="p-4 border-b border-slate-700">
				<div v-if="!sidebarCollapsed" class="flex items-center space-x-3">
					<div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
						<Icon name="lucide:shield-check" class="w-5 h-5 text-white" />
					</div>
					<div>
						<h1 class="text-lg font-bold text-white">Admin Control Center</h1>
						<p class="text-sm text-slate-400">System Administration</p>
					</div>
				</div>
				<div v-else class="flex justify-center">
					<div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
						<Icon name="lucide:shield-check" class="w-5 h-5 text-white" />
					</div>
				</div>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 p-4">
				<div class="space-y-2">
					<div v-if="!sidebarCollapsed" class="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
						Administration
					</div>
					<NuxtLink
						v-for="item in navigationItems"
						:key="item.name"
						:to="item.to"
						class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-slate-800"
						:class="$route.path === item.to ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white'"
					>
						<Icon :name="item.icon" class="w-5 h-5" :class="!sidebarCollapsed ? 'mr-3' : ''" />
						<span v-if="!sidebarCollapsed">{{ item.name }}</span>
					</NuxtLink>
				</div>
			</nav>
		</div>

		<!-- Main Content -->
		<div class="flex-1 flex flex-col overflow-hidden">
			<!-- Top Header -->
			<header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-4">
						<Button 
							variant="ghost" 
							size="sm" 
							@click="sidebarCollapsed = !sidebarCollapsed"
						>
							<Icon name="lucide:menu" class="w-5 h-5" />
						</Button>
						<div>
							<h2 class="text-xl font-semibold text-gray-900">Marcher Hospital System</h2>
							<p class="text-sm text-gray-500">Administrative Dashboard</p>
						</div>
					</div>
					<div class="flex items-center space-x-4">
						<Button variant="ghost" size="sm">
							<Icon name="lucide:bell" class="w-5 h-5" />
						</Button>
						<Button variant="ghost" size="sm">
							<Icon name="lucide:settings" class="w-5 h-5" />
						</Button>
						<div class="flex items-center space-x-2">
							<div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
								<Icon name="lucide:user" class="w-4 h-4 text-white" />
							</div>
							<span class="text-sm font-medium text-gray-700">{{ authStore.fullName || 'Administrator' }}</span>
							<Button variant="ghost" size="sm" @click="logout" class="text-red-600 hover:text-red-700">
								<Icon name="lucide:log-out" class="w-4 h-4 mr-1" />
								Logout
							</Button>
						</div>
					</div>
				</div>
			</header>

			<!-- Main Content Area -->
			<main class="flex-1 overflow-y-auto bg-gray-50 p-6">
				<slot />
			</main>
		</div>
	</div>
</template>