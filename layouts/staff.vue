<script setup lang="ts">
import { useAuthStore } from "~/stores/app"

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const sidebarCollapsed = ref(false)

const navigationItems = [
	{
		name: "Overview",
		icon: "lucide:layout-dashboard",
		to: "/staff/dashboard",
		active: true
	},
	{
		name: "Patients", 
		icon: "lucide:users",
		to: "/staff/patients"
	},
	{
		name: "Appointments",
		icon: "lucide:calendar", 
		to: "/staff/appointments"
	},
	{
		name: "Staff",
		icon: "lucide:user-check",
		to: "/staff/staff"
	},
	{
		name: "Pharmacy",
		icon: "lucide:pill",
		to: "/staff/pharmacy"
	},
	{
		name: "Facilities",
		icon: "lucide:building",
		to: "/staff/facilities"
	},
	{
		name: "Billing",
		icon: "lucide:credit-card",
		to: "/staff/billing"
	},
	{
		name: "Insurance",
		icon: "lucide:shield",
		to: "/staff/insurance"
	}
]
</script>
</script>

<template>
	<div class="flex h-screen bg-gray-100">
		<!-- Sidebar -->
		<div :class="[sidebarCollapsed ? 'w-16' : 'w-64', 'bg-white shadow-lg transition-all duration-300 flex flex-col']">
			<!-- Hospital Header -->
			<div class="p-4 border-b border-gray-200">
				<div v-if="!sidebarCollapsed" class="flex items-center space-x-3">
					<div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
						<Icon name="lucide:cross" class="w-5 h-5 text-white" />
					</div>
					<div>
						<h1 class="text-lg font-bold text-gray-900">St. Luke's Medical Center</h1>
						<p class="text-sm text-gray-500">Quezon City</p>
					</div>
				</div>
				<div v-else class="flex justify-center">
					<div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
						<Icon name="lucide:cross" class="w-5 h-5 text-white" />
					</div>
				</div>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 p-4">
				<div class="space-y-2">
					<div v-if="!sidebarCollapsed" class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
						Dashboard
					</div>
					<NuxtLink
						v-for="item in navigationItems"
						:key="item.name"
						:to="item.to"
						class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100"
						:class="$route.path === item.to ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-700'"
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
							<h2 class="text-xl font-semibold text-gray-900">St. Luke's Medical Center</h2>
							<p class="text-sm text-gray-500">Quezon City</p>
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
							<div class="w-8 h-8 bg-gray-300 rounded-full"></div>
							<span class="text-sm font-medium text-gray-700">{{ user?.name || 'Staff' }}</span>
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
