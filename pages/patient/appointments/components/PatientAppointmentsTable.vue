<script setup lang="ts">
import { useAppointmentStore } from "@/stores/appointments"
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const appointmentStore = useAppointmentStore()

const currentPage = computed(() => appointmentStore.pagination.page)
const totalPages = computed(() => appointmentStore.pagination.totalPages)
const totalRecords = computed(() => appointmentStore.pagination.total)

const goToPreviousPage = () => { if (currentPage.value > 1) appointmentStore.changePage(currentPage.value - 1) }
const goToNextPage = () => { if (currentPage.value < totalPages.value) appointmentStore.changePage(currentPage.value + 1) }

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })
const formatTime = (t: string) =>
  new Date(`2000-01-01T${t}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })

const pillClass = (status: string) => {
  const base = "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
  switch (status) {
    case "PENDING": return `${base} bg-orange-100 text-orange-800`
    case "SCHEDULED": return `${base} bg-blue-100 text-blue-800`
    case "COMPLETED": return `${base} bg-green-100 text-green-800`
    case "CANCELLED": return `${base} bg-red-100 text-red-800`
    default: return base
  }
}
const canCancelAppointment = (apt: any) => apt.status === "PENDING" || apt.status === "SCHEDULED"
const getFacilityDisplay = (facility: any) => !facility ? "Room not assigned yet" : `${facility.building.name} - ${facility.identifier}`
const getDoctorDisplay = (doctor: any) => `Dr. ${doctor.firstName} ${doctor.lastName}${doctor.middleName ? ` ${doctor.middleName}` : ""} ${doctor.suffix ? ` ${doctor.suffix}` : ""}`

onMounted(() => { appointmentStore.getPatientAppointments() })
</script>

<template>
  <div v-if="appointmentStore.loading" class="flex flex-col gap-2">
    <Skeleton v-for="i in 5" :key="i" class="h-[60px] w-full rounded-md" />
  </div>
  <div v-else>
    <div v-if="totalRecords > 0" class="text-sm text-muted-foreground mb-4">
      Showing {{ Math.min((currentPage - 1) * 10 + 1, totalRecords) }}-{{ Math.min(currentPage * 10, totalRecords) }} of {{ totalRecords }} appointments
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Doctor</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>Clinic Room</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="appointment in appointmentStore.appointments"
          :key="appointment.id"
          :class="{
            'bg-red-50': appointment.status === 'CANCELLED',
            'bg-green-50': appointment.status === 'COMPLETED'
          }"
        >
          <TableCell>
            <div class="font-medium">
              {{ appointment.patient.lastName }}, {{ appointment.patient.firstName }}
              <span v-if="appointment.patient.middleName"> {{ appointment.patient.middleName }}</span>
              <span v-if="appointment.patient.suffix"> {{ appointment.patient.suffix }}</span>
            </div>
          </TableCell>
          <TableCell><div class="font-medium">{{ getDoctorDisplay(appointment.doctor) }}</div></TableCell>

          <TableCell>
            <div class="space-y-1">
              <div class="font-medium">{{ formatDate(appointment.date) }}</div>
              <div class="text-sm text-muted-foreground">{{ formatTime(appointment.time) }}</div>
            </div>
          </TableCell>

          <TableCell>
            <div :class="{ 'text-muted-foreground italic': !appointment.facility, 'font-medium': appointment.facility }">
              {{ getFacilityDisplay(appointment.facility) }}
            </div>
          </TableCell>

          <TableCell>
            <span :class="pillClass(appointment.status)">{{ appointment.status }}</span>
          </TableCell>

          <TableCell>
            <div class="flex gap-2">
              <AlertDialog v-if="canCancelAppointment(appointment)">
                <AlertDialogTrigger as-child>
                  <Button variant="outline" size="icon" class="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Icon name="mdi:cancel" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel this appointment?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will set the status to <b>CANCELLED</b> and free the time slot.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep</AlertDialogCancel>
                    <AlertDialogAction @click="appointmentStore.cancelAppointment(appointment.id)">
                      Cancel Appointment
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div v-else class="text-sm text-muted-foreground">
                <template v-if="appointment.status === 'COMPLETED'">
                  <Icon name="mdi:check-circle" class="inline text-green-600 mr-1" /> Completed
                </template>
                <template v-else-if="appointment.status === 'CANCELLED'">
                  <Icon name="mdi:cancel" class="inline text-red-600 mr-1" /> Cancelled
                </template>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div v-if="appointmentStore.appointments.length === 0" class="text-center py-12">
      <Icon name="mdi:calendar-blank" size="48" class="mx-auto text-muted-foreground mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No appointments yet</h3>
      <p class="text-muted-foreground mb-4">You haven't booked any appointments. Start by scheduling your first appointment.</p>
      <Button @click="navigateTo('/patient/appointments/new')" class="bg-black hover:bg-black/80 text-white">
        <Icon name="mdi:calendar-plus" class="mr-2" /> Book Your First Appointment
      </Button>
    </div>

    <div v-if="totalPages > 1" class="flex justify-between items-center mt-6 pt-4 border-t">
      <div class="text-sm text-muted-foreground">Page {{ currentPage }} of {{ totalPages }}</div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" :disabled="currentPage === 1" @click="goToPreviousPage">
          <Icon name="mdi:chevron-left" /> Previous
        </Button>
        <Button variant="outline" size="sm" :disabled="currentPage >= totalPages" @click="goToNextPage">
          Next <Icon name="mdi:chevron-right" />
        </Button>
      </div>
    </div>
  </div>
</template>
