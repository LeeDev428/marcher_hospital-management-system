<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PatientProfileForm from "./components/PatientProfileForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Patients", link: "/patients" },
		{ label: "New Patient Profile", link: "/patients/new" },
	])
})
</script>

<template>
	<NuxtLayout name="staff" title="New Patient">
		<div class="flex flex-col gap-4 bg-white p-4 rounded-lg">
			<h1 class="text-2xl font-bold">New Patient Profile</h1>
			<PatientProfileForm />
		</div>
	</NuxtLayout>
</template>
