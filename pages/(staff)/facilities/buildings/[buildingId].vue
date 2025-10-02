<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import BuildingForm from "../components/BuildingForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { buildingId } = useRoute().params as { buildingId: string }

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Facilities", link: "/facilities" },
		{ label: "Buildings", link: "/facilities/buildings" },
		{ label: "Building", link: `/facilities/buildings/${buildingId}` },
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="Building">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<BuildingForm :building-id="buildingId" />
		</div>
	</NuxtLayout>
</template>