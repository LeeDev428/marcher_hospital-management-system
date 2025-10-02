<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { Button } from "@/components/ui/button"
import PatientAppointmentsTable from "./components/PatientAppointmentsTable.vue"
import PatientAppointmentFilters from "./components/PatientAppointmentFilters.vue"

const breadcrumbsStore = useBreadcrumbsStore()

onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "My Appointments", link: "/patient/appointments" },
  ])
})
</script>

<template> 
  <NuxtLayout name="patient" title="My Appointments">

    <!-- Header Section -->
    <div class="mb-6 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p class="text-gray-600 mt-1">
            View and manage your medical appointments
          </p>
        </div>
        <NuxtLink to="/patient/appointments/new">
            <Button variant="outline">
              <Icon name="mdi:calendar" /> Book Appointment
            </Button>
        </NuxtLink>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex gap-6">
      <!-- Appointments Table -->
      <div class="flex-1 bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6">
          <PatientAppointmentsTable />
        </div>
      </div>

      <!-- Filters Sidebar -->
      <div class="w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <PatientAppointmentFilters />
      </div>
    </div>
  </NuxtLayout>
</template>