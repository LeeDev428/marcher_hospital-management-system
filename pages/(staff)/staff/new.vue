<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import StaffForm from "./components/StaffForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Staff", link: "/staff" },
		{ label: "New Staff Profile", link: "/staff/new" },
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="New Staff Profile">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<StaffForm />
		</div>
	</NuxtLayout>
</template>