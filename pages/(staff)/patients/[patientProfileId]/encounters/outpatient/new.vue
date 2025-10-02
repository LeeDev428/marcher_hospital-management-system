<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { Button } from "@/components/ui/button"
import OutpatientForm from "../components/OutpatientForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { patientProfileId } = useRoute().params as { patientProfileId: string }

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Patients", link: "/patients" },
		{ label: "Patient Profile", link: `/patients/${patientProfileId}#encounters` },
		{
			label: "New Outpatient Encounter",
			link: `/patients/${patientProfileId}/encounters/outpatient/new`,
		},
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="New Outpatient Encounter">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<div class="w-full flex gap-2 justify-end">
				<NuxtLink :to="`/patients/${patientProfileId}#encounters`">
					<Button variant="outline">
						<Icon name="mdi:arrow-left" />
						Back
					</Button>
				</NuxtLink>
			</div>
			<OutpatientForm />
		</div>
	</NuxtLayout>
</template>
