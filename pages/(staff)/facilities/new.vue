<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import FacilityForm from "./components/FacilityForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Facilities", link: "/facilities" },
		{ label: "New Facility", link: "/facilities/new" },
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="New Facility">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<FacilityForm />
		</div>
	</NuxtLayout>
</template>