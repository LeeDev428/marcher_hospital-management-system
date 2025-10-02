<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import AppointmentForm from "./components/AppointmentForm.vue"

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
	<NuxtLayout name="staff" title="Appointment">
		<div class="h-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg">
			<AppointmentForm :appointment-id="appointmentId" />
		</div>
	</NuxtLayout>
</template>