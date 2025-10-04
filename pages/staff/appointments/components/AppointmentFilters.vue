<script setup lang="ts">
import { useAppointmentStore } from "@/stores/appointments"
import { useStaffStore } from "@/stores/staff"
import { appointmentStatusOptions } from "@/types/appointments"
import type { AppointmentFilters } from "@/types/appointments"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SelectItemText from "~/components/ui/select/SelectItemText.vue"

const appointmentStore = useAppointmentStore()
const staffStore = useStaffStore()

// Local reactive filters
const localFilters = ref<AppointmentFilters>({
  doctorId: appointmentStore.filters.doctorId,
  date: appointmentStore.filters.date,
  status: appointmentStore.filters.status,
})

const doctorOptions = computed(() => {
  return staffStore.staffProfiles.map((staff) => ({
    label: `${staff.lastName}, ${staff.firstName}${staff.middleName ? ` ${staff.middleName}` : ""} ${staff.suffix ? ` ${staff.suffix}` : ""}`,
    value: staff.id,
  }))
})

const applyFilters = async () => {
  await appointmentStore.filterAppointments(localFilters.value)
}

const clearFilters = async () => {
  localFilters.value = {
    doctorId: undefined,
    date: undefined,
    status: undefined,
  }
  appointmentStore.clearFilters()
  await appointmentStore.getAppointments()
}

// Watch for changes in store filters to update local filters
watch(() => appointmentStore.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

onMounted(async () => {
  await staffStore.getStaffProfiles("DOCTOR")
})
</script>

<template>
      <h1 class="text-base font-semibold mb-5">Appointment Search Filters</h1>
      <!-- Date -->
      <div class="space-y-1.5 mb-3">
        <label class="text-sm font-medium">Date</label>
        <Input v-model="localFilters.date" type="date" />
      </div>

      <!-- Status -->
      <!-- <div class="space-y-1.5 mb-3">
        <label class="text-sm font-medium">Status</label>
        <Select  v-model="localFilters.status" type="text" />
      </div> -->
      <div class="space-y-1.5 mb-3">
        <label class="text-sm font-medium">Status</label>
        <Select v-model="localFilters.status">
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <!-- <SelectItem value="all">All</SelectItem> -->
            <SelectItem 
              v-for="status in appointmentStatusOptions" 
              :key="status.value" 
              :value="status.value"
            >
              {{ status.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Patient Search (optional for future) 
      <div class="space-y-1.5 mb-3">
        <label class="text-sm font-medium">Patient</label>
        <Input type="text" placeholder="Search..."  />
      </div> -->

      <!-- Doctor -->
       <!-- <div class="space-y-1.5 mb-3">
        <label class="text-sm font-medium">Doctor</label>
        <Input v-model="localFilters.doctorId" type="text" />
      </div> -->
      <div class="space-y-1.5 mb-3">
        <label class="text-sm font-medium">Doctor</label>
        <Select v-model="localFilters.doctorId">
          <SelectTrigger>
            <SelectValue placeholder="Search..." />
          </SelectTrigger>
          <SelectContent>
            <!-- <SelectItem value="all">All</SelectItem> -->
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

      <!-- Actions -->
      <div class="flex flex-col gap-2 pt-2 mb-3">
        <Button @click="applyFilters" class="bg-black hover:bg-black/80 text-white w-full">
          Search
        </Button>
        <Button 
          @click="clearFilters" 
          variant="ghost"
          class="bg-muted text-muted-foreground hover:bg-muted/70 w-full"
          :disabled="!appointmentStore.hasFilters"
        >
          Clear
        </Button>
      </div>

      <!-- Active Filters Display -->
      <div v-if="appointmentStore.hasFilters" class="flex flex-wrap gap-2 pt-2 border-t">
        <div class="text-xs text-muted-foreground">Active filters:</div>
        <div 
          v-if="appointmentStore.filters.doctorId" 
          class="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
        >
          Doctor: {{ doctorOptions.find(d => d.value === appointmentStore.filters.doctorId)?.label }}
        </div>
        <div 
          v-if="appointmentStore.filters.date" 
          class="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
        >
          Date: {{ appointmentStore.filters.date }}
        </div>
        <div 
          v-if="appointmentStore.filters.status" 
          class="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
        >
          Status: {{ appointmentStore.filters.status }}
        </div>
      </div>
</template>