<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PatientProfileForm from "../components/PatientProfileForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { patientProfileId } = useRoute().params as { patientProfileId: string }

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Patients", link: "/patients" },
		{
			label: "Edit Patient Profile",
			link: `/patients/${patientProfileId}/edit`,
		},
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="Edit Patient">
		<div class="flex flex-col gap-4 bg-white p-4 rounded-lg">
			<h1 class="text-2xl font-bold">Edit Patient</h1>
			<PatientProfileForm :patient-profile-id="patientProfileId" />
		</div>
	</NuxtLayout>
</template>
