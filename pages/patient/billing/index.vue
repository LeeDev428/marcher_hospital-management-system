<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
//import { Input } from "@/components/ui/input"
//import { Button } from "@/components/ui/button"
import PatientBillingTable from "./components/PatientsBillingTable.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(async () => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Patient Billing", link: "/billing" },
	])
})
</script>

<template>
	<NuxtLayout name="patient" title="Billing">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<div class="w-full flex gap-2 justify-between">
			
				<PatientBillingTable />
			
		</div>
        </div>
	</NuxtLayout>
</template>
