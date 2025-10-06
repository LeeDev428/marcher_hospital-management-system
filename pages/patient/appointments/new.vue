<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import PatientAppointmentForm from "./components/PatientAppointmentForm.vue"
import PatientAppointmentsAvailability from "./components/PatientAppointmentsAvailability.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "My Appointments", link: "/patient/appointments" },
    { label: "Book Appointment", link: "/patient/appointments/new" },
  ])
})
</script>

<template>
  <NuxtLayout name="patient" title="Book New Appointment">
    <!-- Main Content -->
    <div class="flex gap-6">
      <!-- Appointment Form -->
      <div class="flex-1 bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6">
          <PatientAppointmentForm />
        </div>
      </div>

   
    </div>
  </NuxtLayout>
</template>