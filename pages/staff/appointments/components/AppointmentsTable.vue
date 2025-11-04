<script setup lang="ts">
import { useAppointmentStore } from "@/stores/appointments"
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"

const appointmentStore = useAppointmentStore()

// Dialog state
const showViewDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedAppointment = ref<any>(null)
const deletingAppointment = ref(false)

const onEdit = (appointment: any) => navigateTo(`/staff/appointments/${appointment.id}/edit`)

const confirmDelete = (appointment: any) => {
  selectedAppointment.value = appointment
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!selectedAppointment.value) return
  
  try {
    deletingAppointment.value = true
    await appointmentStore.deleteAppointment(selectedAppointment.value.id)
    useToast('success', 'Appointment', 'Appointment deleted successfully')
    showDeleteDialog.value = false
    selectedAppointment.value = null
    await appointmentStore.getAppointments() // Refresh the list
  } catch (error) {
    useToast('error', 'Appointment', 'Failed to delete appointment')
  } finally {
    deletingAppointment.value = false
  }
}

const handleAccept = async (appointment: any) => {
  await appointmentStore.updateAppointmentStatus({ 
    id: appointment.id, 
    status: 'CONFIRMED' 
  })
  useToast('success', 'Appointment', 'Appointment accepted successfully')
}

const handleDecline = async (appointment: any) => {
  await appointmentStore.updateAppointmentStatus({ 
    id: appointment.id, 
    status: 'CANCELLED' 
  })
  useToast('success', 'Appointment', 'Appointment declined successfully')
}

const viewDetails = (appointment: any) => {
  selectedAppointment.value = appointment
  showViewDialog.value = true
}

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
            <TableCell>
              <span 
                :class="{
                  'px-2 py-1 rounded-md text-xs font-medium': true,
                  'bg-orange-100 text-orange-800': appointment.status === 'SCHEDULED',
                  'bg-blue-100 text-blue-800': appointment.status === 'CONFIRMED',
                  'bg-yellow-100 text-yellow-800': appointment.status === 'IN_PROGRESS',
                  'bg-green-100 text-green-800': appointment.status === 'COMPLETED',
                  'bg-red-100 text-red-800': appointment.status === 'CANCELLED',
                  'bg-gray-100 text-gray-800': appointment.status === 'NO_SHOW'
                }"
              >
                {{ appointment.status }}
              </span>
            </TableCell>

            <TableCell class="flex gap-2 flex-wrap">
              <!-- Accept Button for SCHEDULED appointments -->
              <Button 
                v-if="appointment.status === 'SCHEDULED'" 
                variant="default"
                size="sm"
                class="bg-green-600 hover:bg-green-700 text-white"
                @click="handleAccept(appointment)"
              >
                <Icon name="mdi:check-circle" class="mr-1" /> Accept
              </Button>
              
              <!-- Decline Button for SCHEDULED appointments -->
              <Button 
                v-if="appointment.status === 'SCHEDULED'" 
                variant="destructive"
                size="sm"
                @click="handleDecline(appointment)"
              >
                <Icon name="mdi:close-circle" class="mr-1" /> Decline
              </Button>
              
              <!-- Edit Button (for all non-completed appointments) -->
              <Button 
                v-if="appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED'" 
                variant="outline" 
                size="sm"
                @click="onEdit(appointment)"
              >
                <Icon name="mdi:pencil" class="mr-1" /> Edit
              </Button>
              
              <!-- View Details Button -->
              <Button 
                variant="outline" 
                size="sm"
                @click="viewDetails(appointment)"
              >
                <Icon name="mdi:eye" class="mr-1" /> View
              </Button>

              <!-- Delete Button (for cancelled or scheduled appointments) -->
              <Button 
                v-if="appointment.status === 'SCHEDULED' || appointment.status === 'CANCELLED'" 
                variant="destructive" 
                size="sm"
                @click="confirmDelete(appointment)"
              >
                <Icon name="mdi:delete" class="mr-1" /> Delete
              </Button>
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

    <!-- View Appointment Details Dialog -->
    <Dialog v-model:open="showViewDialog">
      <DialogContent class="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>Complete information about this appointment</DialogDescription>
        </DialogHeader>

        <div v-if="selectedAppointment" class="space-y-6 mt-4">
          <!-- Patient Information -->
          <div class="space-y-2">
            <h3 class="font-semibold text-lg border-b pb-2">Patient Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-muted-foreground">Full Name</p>
                <p class="font-medium">
                  {{ selectedAppointment.patient.lastName }}, {{ selectedAppointment.patient.firstName }}
                  <span v-if="selectedAppointment.patient.middleName"> {{ selectedAppointment.patient.middleName }}</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Doctor Information -->
          <div class="space-y-2">
            <h3 class="font-semibold text-lg border-b pb-2">Doctor Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-muted-foreground">Doctor Name</p>
                <p class="font-medium">
                  Dr. {{ selectedAppointment.doctor.lastName }}, {{ selectedAppointment.doctor.firstName }}
                  {{ selectedAppointment.doctor.middleName || "" }}
                </p>
              </div>
            </div>
          </div>

          <!-- Medical Service Information -->
          <div v-if="selectedAppointment.medicalService" class="space-y-2">
            <h3 class="font-semibold text-lg border-b pb-2">Medical Service</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-muted-foreground">Service Name</p>
                <p class="font-medium">{{ selectedAppointment.medicalService.name }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Service Type</p>
                <p class="font-medium">{{ selectedAppointment.medicalService.type }}</p>
              </div>
              <div v-if="selectedAppointment.medicalService.category">
                <p class="text-sm text-muted-foreground">Category</p>
                <p class="font-medium">{{ selectedAppointment.medicalService.category }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Duration</p>
                <p class="font-medium">{{ selectedAppointment.medicalService.duration }} minutes</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Price</p>
                <p class="font-medium">₱{{ Number(selectedAppointment.medicalService.price).toFixed(2) }}</p>
              </div>
            </div>
          </div>
          <div v-else class="space-y-2">
            <h3 class="font-semibold text-lg border-b pb-2">Medical Service</h3>
            <p class="text-muted-foreground italic">No medical service specified</p>
          </div>

          <!-- Appointment Details -->
          <div class="space-y-2">
            <h3 class="font-semibold text-lg border-b pb-2">Appointment Details</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-muted-foreground">Date</p>
                <p class="font-medium">{{ new Date(selectedAppointment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Time</p>
                <p class="font-medium">{{ new Date(`2000-01-01T${selectedAppointment.time}`).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',hour12:true}) }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Status</p>
                <span 
                  :class="{
                    'px-2 py-1 rounded-md text-xs font-medium': true,
                    'bg-orange-100 text-orange-800': selectedAppointment.status === 'SCHEDULED',
                    'bg-blue-100 text-blue-800': selectedAppointment.status === 'CONFIRMED',
                    'bg-yellow-100 text-yellow-800': selectedAppointment.status === 'IN_PROGRESS',
                    'bg-green-100 text-green-800': selectedAppointment.status === 'COMPLETED',
                    'bg-red-100 text-red-800': selectedAppointment.status === 'CANCELLED',
                    'bg-gray-100 text-gray-800': selectedAppointment.status === 'NO_SHOW'
                  }"
                >
                  {{ selectedAppointment.status }}
                </span>
              </div>
              <div v-if="selectedAppointment.duration">
                <p class="text-sm text-muted-foreground">Duration</p>
                <p class="font-medium">{{ selectedAppointment.duration }} minutes</p>
              </div>
              <div v-if="selectedAppointment.type">
                <p class="text-sm text-muted-foreground">Type</p>
                <p class="font-medium">{{ selectedAppointment.type }}</p>
              </div>
            </div>
          </div>

          <!-- Additional Notes -->
          <div v-if="selectedAppointment.reason || selectedAppointment.notes" class="space-y-2">
            <h3 class="font-semibold text-lg border-b pb-2">Additional Information</h3>
            <div v-if="selectedAppointment.reason">
              <p class="text-sm text-muted-foreground">Reason</p>
              <p class="font-medium">{{ selectedAppointment.reason }}</p>
            </div>
            <div v-if="selectedAppointment.notes" class="mt-2">
              <p class="text-sm text-muted-foreground">Notes</p>
              <p class="font-medium">{{ selectedAppointment.notes }}</p>
            </div>
          </div>

          <!-- Action Buttons in Dialog -->
          <div v-if="selectedAppointment.status === 'SCHEDULED'" class="flex gap-2 pt-4 border-t">
            <Button 
              variant="default"
              class="bg-green-600 hover:bg-green-700 text-white flex-1"
              @click="handleAccept(selectedAppointment); showViewDialog = false"
            >
              <Icon name="mdi:check-circle" class="mr-2" /> Accept Appointment
            </Button>
            <Button 
              variant="destructive"
              class="flex-1"
              @click="handleDecline(selectedAppointment); showViewDialog = false"
            >
              <Icon name="mdi:close-circle" class="mr-2" /> Decline Appointment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="showDeleteDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Appointment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this appointment? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div v-if="selectedAppointment" class="space-y-4 mt-4">
          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div>
              <p class="text-sm text-muted-foreground">Patient</p>
              <p class="font-medium">
                {{ selectedAppointment.patient.lastName }}, {{ selectedAppointment.patient.firstName }}
                <span v-if="selectedAppointment.patient.middleName"> {{ selectedAppointment.patient.middleName }}</span>
              </p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Doctor</p>
              <p class="font-medium">
                Dr. {{ selectedAppointment.doctor.firstName }} {{ selectedAppointment.doctor.lastName }}
              </p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-muted-foreground">Date</p>
                <p class="font-medium">{{ selectedAppointment.date.split('T')[0] }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Time</p>
                <p class="font-medium">{{ new Date(`2000-01-01T${selectedAppointment.time}`).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',hour12:true}) }}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline"
              class="flex-1"
              @click="showDeleteDialog = false"
              :disabled="deletingAppointment"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              class="flex-1"
              @click="handleDelete"
              :disabled="deletingAppointment"
            >
              <Icon v-if="deletingAppointment" name="mdi:loading" class="mr-2 animate-spin" />
              <Icon v-else name="mdi:delete" class="mr-2" />
              {{ deletingAppointment ? 'Deleting...' : 'Delete Appointment' }}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
