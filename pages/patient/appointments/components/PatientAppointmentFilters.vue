<script setup lang="ts">
import { useAppointmentStore } from "@/stores/appointments"
import { useStaffStore } from "@/stores/staff"
import type { PatientAppointmentFilters } from "@/types/appointments"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const appointmentStore = useAppointmentStore()
const staffStore = useStaffStore()

// Local reactive filters (using patient filters)
const localFilters = ref<PatientAppointmentFilters>({
  doctorId: appointmentStore.patientFilters.doctorId,
  date: appointmentStore.patientFilters.date,
  status: appointmentStore.patientFilters.status,
})

const doctorOptions = computed(() => {
  return staffStore.staffProfiles.map((staff) => ({
    label: `Dr. ${staff.firstName} ${staff.lastName}${staff.middleName ? ` ${staff.middleName}` : ""} ${staff.suffix ? ` ${staff.suffix}` : ""}`,
    value: staff.id,
  }))
})

const applyFilters = async () => {
  await appointmentStore.filterPatientAppointments(localFilters.value)
}

const clearFilters = async () => {
  localFilters.value = {
    doctorId: undefined,
    date: undefined,
    status: undefined,
  }
  appointmentStore.clearPatientFilters()
  await appointmentStore.getPatientAppointments()
}

// Watch for changes in store filters to update local filters
watch(() => appointmentStore.patientFilters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

onMounted(async () => {
  await staffStore.getStaffProfiles("DOCTOR")
})
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold mb-4">Filter My Appointments</h2>
    
    <!-- Date Filter -->
    <div class="space-y-2">
      <label class="text-sm font-medium text-gray-700">Date</label>
      <Input 
        v-model="localFilters.date" 
        type="date" 
        class="w-full"
      />
    </div>

    <!-- Doctor Filter -->
    <div class="space-y-2">
      <label class="text-sm font-medium text-gray-700">Doctor</label>
      <Select v-model="localFilters.doctorId">
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Select Doctor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem 
            v-for="doctor in doctorOptions" 
            :key="doctor.value" 
            :value="doctor.value"
          >
            {{ doctor.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Filter Actions -->
    <div class="flex flex-col gap-2 pt-4">
      <Button 
        @click="applyFilters" 
        class="bg-black hover:bg-black/80 text-white w-full"
      >
        Search
      </Button>
      <Button 
        @click="clearFilters" 
        variant="outline"
        class="w-full"
        :disabled="!appointmentStore.hasPatientFilters"
      >
        Clear 
      </Button>
    </div>

    <!-- Active Filters Display -->
    <div v-if="appointmentStore.hasPatientFilters" class="pt-4 border-t border-gray-200">
      <div class="text-xs font-medium text-gray-700 mb-2">Active filters:</div>
      <div class="space-y-2">
        <div 
          v-if="appointmentStore.patientFilters.doctorId" 
          class="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200"
        >
          <Icon name="mdi:doctor" class="w-3 h-3" />
          {{ doctorOptions.find(d => d.value === appointmentStore.patientFilters.doctorId)?.label }}
        </div>
        <div 
          v-if="appointmentStore.patientFilters.date" 
          class="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200"
        >
          <Icon name="mdi:calendar" class="w-3 h-3" />
          {{ new Date(appointmentStore.patientFilters.date).toLocaleDateString() }}
        </div>
        <div 
          v-if="appointmentStore.patientFilters.status" 
          class="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200"
        >
          <Icon name="mdi:tag" class="w-3 h-3" />
          {{ appointmentStore.patientFilters.status }}
        </div>
      </div>
    </div>

    <!-- Quick Filter Buttons -->
    <div class="pt-4 border-t border-gray-200">
      <div class="text-xs font-medium text-gray-700 mb-2">Quick filters:</div>
      <div class="flex flex-col gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          class="w-full justify-start"
          @click="() => {
            localFilters.status = 'PENDING'
            applyFilters()
          }"
        >
          <Icon name="mdi:clock-outline" class="mr-2 w-4 h-4 text-orange-500" />
          Pending Appointments
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          class="w-full justify-start"
          @click="() => {
            localFilters.status = 'SCHEDULED'
            applyFilters()
          }"
        >
          <Icon name="mdi:calendar-check" class="mr-2 w-4 h-4 text-blue-500" />
          Scheduled Appointments
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          class="w-full justify-start"
          @click="() => {
            const today = new Date().toISOString().split('T')[0]
            localFilters.date = today
            applyFilters()
          }"
        >
          <Icon name="mdi:calendar-today" class="mr-2 w-4 h-4 text-green-500" />
          Today's Appointments
        </Button>
      </div>
    </div>
  </div>
</template>