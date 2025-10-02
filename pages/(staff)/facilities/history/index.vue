<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import FacilityLogsTable from "../components/FacilityLogsTable.vue";

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Facility Logs", link: "/logs" },
	])
})
</script>

<template>
  <NuxtLayout name="staff" title="Logs">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<div class="w-full flex gap-2 justify-between">
				<div class="w-full flex items-center gap-2">
					<label><b>Historical Data for Facilities</b></label>
				</div>
				<div class="flex gap-2">
					<NuxtLink to="/facilities">
						<Button variant="outline">
							<Icon name="mdi:building" />
							Back to Rooms
						</Button>
					</NuxtLink>
				</div>
			</div>
			<FacilityLogsTable />
		</div>
	</NuxtLayout>
</template>


