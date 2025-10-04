<script setup lang="ts">
import { useAppointmentStore } from "@/stores/appointments"
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const appointmentStore = useAppointmentStore()

const onEdit = (id: string) => navigateTo(`/appointments/${id}`)

const currentPage = computed(() => appointmentStore.pagination.page)
const totalPages = computed(() => appointmentStore.pagination.totalPages)
const totalRecords = computed(() => appointmentStore.pagination.total)
const recordsPerPage = computed(() => appointmentStore.pagination.limit)

const pageNumbers = computed(() => {
  const pages: (number | string)[] = []
  const current = currentPage.value
  const total = totalPages.value
  if (current > 3) { pages.push(1); if (current > 4) pages.push("...") }
  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) pages.push(i)
  if (current < total - 2) { if (current < total - 3) pages.push("..."); pages.push(total) }
  return pages
})

const goToPage = (page: number | string) => { if (typeof page === "number" && page !== currentPage.value) appointmentStore.changePage(page) }
const goToFirstPage = () => currentPage.value > 1 && appointmentStore.changePage(1)
const goToLastPage = () => currentPage.value < totalPages.value && appointmentStore.changePage(totalPages.value)
const goToPreviousPage = () => currentPage.value > 1 && appointmentStore.changePage(currentPage.value - 1)
const goToNextPage = () => currentPage.value < totalPages.value && appointmentStore.changePage(currentPage.value + 1)

onMounted(() => { appointmentStore.getAppointments() })
</script>

<template>
  <div class="space-y-4">
    <div v-if="appointmentStore.loading" class="flex flex-col gap-2">
      <Skeleton v-for="i in 5" :key="i" class="h-[40px] w-full rounded-md" />
    </div>

    <div v-else>
      <div class="text-sm text-muted-foreground mb-4">
        Showing {{ Math.min((currentPage - 1) * recordsPerPage + 1, totalRecords) }}-{{ Math.min(currentPage * recordsPerPage, totalRecords) }} of {{ totalRecords }} appointments
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Facility</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="appointment in appointmentStore.appointments" :key="appointment.id">
            <TableCell>
              {{ appointment.patient.lastName }}, {{ appointment.patient.firstName }}
              <span v-if="appointment.patient.middleName"> {{ appointment.patient.middleName }}</span>
              <span v-if="appointment.patient.suffix"> {{ appointment.patient.suffix }}</span>
            </TableCell>

            <TableCell>
              {{ appointment.doctor.lastName }}, {{ appointment.doctor.firstName }}
              {{ appointment.doctor.middleName || "" }} {{ appointment.doctor.suffix || "" }}
            </TableCell>

            <TableCell>
              <span v-if="appointment.facility">
                {{ appointment.facility?.building?.name }} - {{ appointment.facility?.identifier }}
              </span>
              <span v-else class="text-muted-foreground italic">Room not assigned yet</span>
            </TableCell>

            <TableCell>{{ appointment.date.split("T")[0] }}</TableCell>
            <TableCell>{{ new Date(`2000-01-01T${appointment.time}`).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',hour12:true}) }}</TableCell>
            <TableCell>{{ appointment.status }}</TableCell>

            <TableCell class="flex gap-2">
              <Button variant="outline" size="icon" @click="onEdit(appointment.id)"><Icon name="mdi:pencil" /></Button>
              <Button variant="outline" size="icon" @click="appointmentStore.deleteAppointment(appointment.id)"><Icon name="mdi:trash" /></Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div v-if="appointmentStore.appointments.length === 0" class="text-center py-8 text-muted-foreground">
        No appointments found
      </div>
    </div>

    <div v-if="totalPages > 1" class="flex items-center justify-between pt-4 border-t">
      <div class="text-sm text-muted-foreground">Page {{ currentPage }} of {{ totalPages }}</div>

      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" :disabled="currentPage === 1" @click="goToFirstPage"><Icon name="mdi:page-first" class="w-4 h-4" /> First</Button>
        <Button variant="outline" size="sm" :disabled="currentPage === 1" @click="goToPreviousPage"><Icon name="mdi:chevron-left" class="w-4 h-4" /> Previous</Button>

        <div class="flex items-center gap-1">
          <template v-for="(page, index) in pageNumbers" :key="index">
            <Button v-if="page === '...'" variant="ghost" size="sm" disabled class="px-2">...</Button>
            <Button v-else :variant="page === currentPage ? 'default' : 'outline'" size="sm" class="px-3" @click="goToPage(page as number)">{{ page }}</Button>
          </template>
        </div>

        <Button variant="outline" size="sm" :disabled="currentPage === totalPages" @click="goToNextPage">Next <Icon name="mdi:chevron-right" class="w-4 h-4" /></Button>
        <Button variant="outline" size="sm" :disabled="currentPage === totalPages" @click="goToLastPage">Last <Icon name="mdi:page-last" class="w-4 h-4" /></Button>
      </div>
    </div>
  </div>
</template>
