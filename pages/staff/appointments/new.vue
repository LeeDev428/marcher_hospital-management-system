<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import AppointmentForm from "./components/AppointmentForm.vue"
import AppointmentsAvailability from "./components/AppointmentsAvailability.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
	breadcrumbsStore.setBreadcrumbs([
		{ label: "Appointments", link: "/appointments" },
		{ label: "New Appointment", link: "/appointments/new" },
	])
})
</script>

<template>
  <NuxtLayout name="staff" title="New Appointment">
    <div class="flex gap-4 w-full h-auto">
      <!-- Appointment Form Panel -->
      <div class="flex-1 bg-white p-4 rounded-lg">
        <AppointmentForm />
      </div>

      <!-- Doctor Availability Panel -->
      <div class="w-[300px] shrink-0 bg-white p-4 rounded-lg overflow-y-auto max-h-[calc(100vh-100px)]">
        <AppointmentsAvailability />
      </div>
    </div>
  </NuxtLayout>
</template>
