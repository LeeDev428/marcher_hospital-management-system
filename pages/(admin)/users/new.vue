<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Users", link: "/users" },
		{ label: "New User", link: "/users/new" },
	])
})
</script>

<template>
	<NuxtLayout name="staff">

	</NuxtLayout>
</template>