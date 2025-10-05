<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({
  title: 'New User - Admin Portal'
})

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Users", link: "/admin/users" },
		{ label: "New User", link: "/admin/users/new" },
	])
})
</script>

<template>
	<div class="container mx-auto p-6">
		<div class="mb-6">
			<h1 class="text-3xl font-bold text-gray-900">Create New User</h1>
			<p class="text-gray-600 mt-2">Add a new user to the system</p>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<p class="text-gray-600">New user creation form will be implemented here.</p>
		</div>
	</div>
</template>