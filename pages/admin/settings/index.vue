<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from "@/components/ui/tabs"

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({
  title: 'System Settings - Admin Portal'
})

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Settings", link: "/admin/settings" },
	])
})
</script>

<template>
	<div class="container mx-auto p-6">
		<div class="mb-6">
			<h1 class="text-3xl font-bold text-gray-900">System Settings</h1>
			<p class="text-gray-600 mt-2">Configure system-wide settings and preferences</p>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<Tabs default-value="general">
				<TabsList class="mb-4 gap-1">
					<TabsTrigger value="general" class="hover:bg-zinc-200">General</TabsTrigger>
					<TabsTrigger value="access" class="hover:bg-zinc-200">Access Control</TabsTrigger>
					<TabsTrigger value="security" class="hover:bg-zinc-200">Security</TabsTrigger>
					<TabsTrigger value="communication" class="hover:bg-zinc-200">Communication</TabsTrigger>
				</TabsList>
				<TabsContent value="general">
					<div class="space-y-4">
						<h3 class="text-lg font-semibold text-gray-900">General Settings</h3>
						<p class="text-gray-600">General system configuration options will be available here.</p>
					</div>
				</TabsContent>
				<TabsContent value="access">
					<div class="space-y-4">
						<h3 class="text-lg font-semibold text-gray-900">Access Control</h3>
						<p class="text-gray-600">User access and permission settings will be available here.</p>
					</div>
				</TabsContent>
				<TabsContent value="security">
					<div class="space-y-4">
						<h3 class="text-lg font-semibold text-gray-900">Security Settings</h3>
						<p class="text-gray-600">Security configuration options will be available here.</p>
					</div>
				</TabsContent>
				<TabsContent value="communication">
					<div class="space-y-4">
						<h3 class="text-lg font-semibold text-gray-900">Communication Settings</h3>
						<p class="text-gray-600">Communication and notification settings will be available here.</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	</div>
</template>
