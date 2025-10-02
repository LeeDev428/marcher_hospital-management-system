<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import OutpatientForm from "../components/OutpatientForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { patientProfileId, outpatientEncounterId } = useRoute().params as {
	patientProfileId: string
	outpatientEncounterId: string
}

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Patients", link: "/patients" },
		{ label: "Patient Profile", link: `/patients/${patientProfileId}#encounters` },
		{
			label: "Outpatient Encounter",
			link: `/patients/${patientProfileId}/encounters/outpatient/${outpatientEncounterId}`,
		},
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="Outpatient Encounter">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<OutpatientForm :encounter-id="outpatientEncounterId" />
		</div>
	</NuxtLayout>
</template>
