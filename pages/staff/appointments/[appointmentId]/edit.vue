<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { useAppointmentStore } from "@/stores/appointments"
import AppointmentForm from "../components/AppointmentForm.vue"
import AppointmentsAvailability from "../components/AppointmentsAvailability.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const appointmentStore = useAppointmentStore()
const route = useRoute()
const { appointmentId } = route.params as { appointmentId: string }

onMounted(async () => {
  // Fetch the appointment details
  await appointmentStore.getAppointment({ id: appointmentId })

  breadcrumbsStore.setBreadcrumbs([
    { label: "Appointments", link: "/staff/appointments" },
    { label: "Edit Appointment", link: `/staff/appointments/${appointmentId}/edit` },
  ])
})

useHead({
  title: 'Edit Appointment'
})
</script>

<template>
  <NuxtLayout name="staff" title="Edit Appointment">
    <div class="flex gap-4 w-full h-auto">
      <!-- Appointment Form Panel -->
      <div class="flex-1 bg-white p-4 rounded-lg">
        <AppointmentForm :appointment-id="appointmentId" />
      </div>

      <!-- Doctor Availability Panel -->
      <div class="w-[300px] shrink-0 bg-white p-4 rounded-lg overflow-y-auto max-h-[calc(100vh-100px)]">
        <AppointmentsAvailability />
      </div>
    </div>
  </NuxtLayout>
</template>
