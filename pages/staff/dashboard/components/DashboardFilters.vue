<script setup lang="ts">
import { useDashboardStore } from "~/stores/dashboard/useDashboardStore"
import { useStaffStore } from "@/stores/staff/useStaffStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
//import { Badge } from "@/components/ui/badge"
import type { AppointmentsList } from "~/types/dashboard/dashboard"

const dashboardStore = useDashboardStore()
const staffStore = useStaffStore()

// Local reactive filters
const localFilters = ref<AppointmentsList>({
  doctorId: dashboardStore.filters.doctorId,
  facilityId: dashboardStore.filters.facilityId,
  dateFrom: dashboardStore.filters.dateFrom,
  dateTo: dashboardStore.filters.dateTo,
  status: dashboardStore.filters.status,
})

const doctorOptions = computed(() => {
  return staffStore.staffProfiles.map((staff) => ({
    label: `${staff.lastName}, ${staff.firstName}${staff.middleName ? ` ${staff.middleName}` : ""} ${staff.suffix ? ` ${staff.suffix}` : ""}`,
    value: staff.id,
  }))
})

const statusOptions = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Scheduled', value: 'SCHEDULED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

const applyFilters = async () => {
  // Clean up empty values
  const cleanFilters = Object.entries(localFilters.value).reduce((acc, [key, value]) => {
    if (value && value !== '') {
      acc[key as keyof AppointmentsList] = value as any
    }
    return acc
  }, {} as Partial<AppointmentsList>)
  
  await dashboardStore.applyFilters(cleanFilters)
}

const clearFilters = async () => {
  localFilters.value = {
    doctorId: undefined,
    facilityId: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    status: undefined,
  }
  dashboardStore.clearFilters()
  await dashboardStore.refreshDashboard()
}

const hasFilters = computed(() => {
  return !!(localFilters.value.doctorId || localFilters.value.facilityId || localFilters.value.dateFrom || localFilters.value.dateTo || localFilters.value.status)
})

// Fixed: Quick date filters
const setQuickFilter = async (filterType: 'today' | 'tomorrow' | 'week') => {
  const today = new Date()
  
  switch (filterType) {
    case 'today':
      const todayStr = today.toISOString().split('T')[0]
      localFilters.value.dateFrom = todayStr
      localFilters.value.dateTo = todayStr
      break
      
    case 'tomorrow':
      const tomorrow = new Date()
      tomorrow.setDate(today.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]
      localFilters.value.dateFrom = tomorrowStr
      localFilters.value.dateTo = tomorrowStr
      break
      
    case 'week':
      const nextWeek = new Date()
      nextWeek.setDate(today.getDate() + 7)
      localFilters.value.dateFrom = today.toISOString().split('T')[0]
      localFilters.value.dateTo = nextWeek.toISOString().split('T')[0]
      break
  }
  
  await applyFilters()
}

// Watch for changes in store filters to update local filters
watch(() => dashboardStore.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

onMounted(async () => {
  await staffStore.getStaffProfiles("DOCTOR")
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Icon name="mdi:filter" class="text-blue-600" />
        Dashboard Filters
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- Quick Date Filters -->
      <div class="space-y-2">
        <label class="text-sm font-medium">Quick Filters</label>
        <div class="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            @click="setQuickFilter('today')"
          >
            Today
          </Button>
          <Button
            size="sm"
            variant="outline"
            @click="setQuickFilter('tomorrow')"
          >
            Tomorrow
          </Button>
          <Button
            size="sm"
            variant="outline"
            @click="setQuickFilter('week')"
          >
            Upcoming Week
          </Button>
        </div>
      </div>

      <!-- Date Range -->
      <div class="grid grid-cols-2 gap-2">
        <div class="space-y-1.5">
          <label class="text-sm font-medium">From Date</label>
          <Input v-model="localFilters.dateFrom" type="date" />
        </div>
        <div class="space-y-1.5">
          <label class="text-sm font-medium">To Date</label>
          <Input v-model="localFilters.dateTo" type="date" />
        </div>
      </div>

      <!-- Doctor Filter -->
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Doctor</label>
        <Select v-model="localFilters.doctorId">
          <SelectTrigger>
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

      <!-- Actions -->
      <div class="flex flex-col gap-2 pt-2">
        <Button 
          @click="applyFilters" 
          class="w-full"
          :disabled="dashboardStore.loading"
        >
          <Icon name="mdi:magnify" size="16" />
          Apply Filters
        </Button>
        <Button 
          @click="clearFilters" 
          variant="outline"
          class="w-full"
          :disabled="!hasFilters || dashboardStore.loading"
        >
          <Icon name="mdi:filter-off" size="16" />
          Clear Filters
        </Button>
      </div>

      <!-- Active Filters Display -->
      <div v-if="hasFilters" class="space-y-2 pt-2 border-t">
        <div class="text-xs font-medium text-muted-foreground">Active Filters:</div>
        <div class="flex flex-wrap gap-2">
          <Badge 
            v-if="localFilters.doctorId" 
            variant="secondary"
            class="text-xs"
          >
            Doctor: {{ doctorOptions.find(d => d.value === localFilters.doctorId)?.label }}
          </Badge>
          <Badge 
            v-if="localFilters.status" 
            variant="secondary"
            class="text-xs"
          >
            Status: {{ localFilters.status }}
          </Badge>
          <Badge 
            v-if="localFilters.dateFrom && localFilters.dateTo" 
            variant="secondary"
            class="text-xs"
          >
            {{ localFilters.dateFrom }} to {{ localFilters.dateTo }}
          </Badge>
          <Badge 
            v-else-if="localFilters.dateFrom" 
            variant="secondary"
            class="text-xs"
          >
            From: {{ localFilters.dateFrom }}
          </Badge>
          <Badge 
            v-else-if="localFilters.dateTo" 
            variant="secondary"
            class="text-xs"
          >
            To: {{ localFilters.dateTo }}
          </Badge>
        </div>
      </div>

      <!-- Refresh Button -->
      <div class="pt-2 border-t">
        <Button 
          @click="dashboardStore.refreshDashboard()" 
          variant="ghost"
          size="sm"
          class="w-full"
          :disabled="dashboardStore.loading"
        >
          <Icon name="mdi:refresh" size="16" :class="{ 'animate-spin': dashboardStore.loading }" />
          {{ dashboardStore.loading ? 'Refreshing...' : 'Refresh Data' }}
        </Button>
      </div>
    </CardContent>
  </Card>
</template>