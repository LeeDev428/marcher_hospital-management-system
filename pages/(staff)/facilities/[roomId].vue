<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import FacilityForm from "./components/FacilityForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { roomId } = useRoute().params as { roomId: string }

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Facilities", link: "/facilities" },
		{ label: "Facility", link: `/facilities/${roomId}` },
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="Facility">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<FacilityForm :room-id="roomId" />
		</div>
	</NuxtLayout>
</template>