<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import BuildingForm from "../components/BuildingForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Facilities", link: "/facilities" },
		{ label: "Buildings", link: "/facilities/buildings" },
		{ label: "New Building", link: "/facilities/buildings/new" },
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="New Building">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<BuildingForm />
		</div>
	</NuxtLayout>
</template>