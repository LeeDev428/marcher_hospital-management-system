<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PatientAppointmentForm from "./components/PatientAppointmentForm.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const { appointmentId } = useRoute().params as { appointmentId: string }

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Appointments", link: "/appointments" },
		{ label: "Appointment", link: `/appointments/${appointmentId}` },
	])
})
</script>

<template>
	<NuxtLayout name="patient" title="Appointment">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<PatientAppointmentForm :appointment-id="appointmentId" />
		</div>
	</NuxtLayout>
</template>