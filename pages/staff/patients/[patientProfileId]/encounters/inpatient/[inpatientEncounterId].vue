<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import InpatientForm from "../components/InpatientForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { patientProfileId, inpatientEncounterId } = useRoute().params as {
	patientProfileId: string
	inpatientEncounterId: string
}

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Patients", link: "/patients" },
		{ label: "Patient Profile", link: `/patients/${patientProfileId}#encounters` },
		{
			label: "Inpatient Encounter",
			link: `/patients/${patientProfileId}/encounters/inpatient/${inpatientEncounterId}`,
		},
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="Inpatient Encounter">
		<div
			class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg overflow-y-auto"
		>
			<InpatientForm :encounter-id="inpatientEncounterId" />
		</div>
	</NuxtLayout>
</template>
