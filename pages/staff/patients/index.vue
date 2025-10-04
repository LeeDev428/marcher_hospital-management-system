<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import PatientProfileTable from "./components/PatientProfileTable.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(async () => {
	breadcrumbsStore.setBreadcrumbs([{ label: "Patients", link: "/patients" }])
})
</script>

<template>
	<NuxtLayout name="staff" title="Patients">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<div class="w-full flex gap-2 justify-between">
				<div class="w-full flex items-center gap-2">
					<Input type="text" placeholder="Search" class="bg-white max-w-xs" />
				</div>
				<NuxtLink to="/patients/new">
					<Button variant="outline" size="icon">
						<Icon name="mdi:plus" />
					</Button>
				</NuxtLink>
			</div>
			<PatientProfileTable />
		</div>
	</NuxtLayout>
</template>
