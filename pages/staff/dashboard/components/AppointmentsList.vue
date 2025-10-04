<script setup lang="ts">
import { useDashboardStore } from "~/stores/dashboard/useDashboardStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
//import { Badge } from "@/components/ui/badge"
//import { ScrollArea } from "@/components/ui/scroll-area"

const dashboardStore = useDashboardStore()

const statusVariants = {
  PENDING: { variant: 'secondary', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  SCHEDULED: { variant: 'default', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  COMPLETED: { variant: 'default', color: 'text-green-700 bg-green-50 border-green-200' },
  CANCELLED: { variant: 'destructive', color: 'text-red-700 bg-red-50 border-red-200' },
}

const formatTime = (time: string) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  })
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getPatientName = (patient: any) => {
  return `${patient.lastName}, ${patient.firstName}${patient.middleName ? ` ${patient.middleName}` : ""}${patient.suffix ? ` ${patient.suffix}` : ""}`
}

const getDoctorName = (doctor: any) => {
  return `Dr. ${doctor.firstName} ${doctor.lastName}${doctor.middleName ? ` ${doctor.middleName}` : ""}${doctor.suffix ? ` ${doctor.suffix}` : ""}`
}

// Fixed: Updated tabs to show all appointments and filtered by status
const tabsData = computed(() => [
  {
    value: 'pending',
    label: 'Pending',
    count: dashboardStore.pendingAppointments.length,
    appointments: dashboardStore.pendingAppointments,
  },
  {
    value: 'scheduled',
    label: 'Scheduled',
    count: dashboardStore.scheduledAppointments.length,
    appointments: dashboardStore.scheduledAppointments,
  },
  {
    value: 'completed',
    label: 'Completed',
    count: dashboardStore.completedAppointments.length,
    appointments: dashboardStore.completedAppointments,
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
    count: dashboardStore.cancelledAppointments.length,
    appointments: dashboardStore.cancelledAppointments,
  },
])

// Fixed: Load appointments based on current filters
onMounted(() => {
  dashboardStore.fetchAppointmentsList()
})

// Watch for filter changes and reload appointments
watch(() => dashboardStore.filters, () => {
  dashboardStore.fetchAppointmentsList()
}, { deep: true })
</script>

<template>
  <Card class="h-full">
    <CardHeader>
      <CardTitle class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Icon name="mdi:calendar-today" class="text-blue-600" />
          Appointment Records
        </div>
        <div class="text-sm text-muted-foreground">
          <!-- Show filtered date range or current date -->
          <span v-if="dashboardStore.filters.dateFrom && dashboardStore.filters.dateTo">
            {{ formatDate(dashboardStore.filters.dateFrom) }} - {{ formatDate(dashboardStore.filters.dateTo) }}
          </span>
          <span v-else-if="dashboardStore.filters.dateFrom">
            From {{ formatDate(dashboardStore.filters.dateFrom) }}
          </span>
          <span v-else-if="dashboardStore.filters.dateTo">
            Until {{ formatDate(dashboardStore.filters.dateTo) }}
          </span>
          <span v-else>
            {{ new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) }}
          </span>
        </div>
      </CardTitle>
    </CardHeader>
   <CardContent class="p-0">
      <Tabs default-value="all" class="w-full">
        <div class="px-6 pb-4">
          <TabsList class="grid w-full grid-cols-4">
            <TabsTrigger 
              v-for="tab in tabsData" 
              :key="tab.value" 
              :value="tab.value"
              class="relative"
            >
              {{ tab.label }}
              <Badge 
                v-if="tab.count > 0" 
                variant="secondary" 
                class="ml-1 h-5 w-5 p-0 text-xs"
              >
                {{ tab.count }}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent v-for="tab in tabsData" :key="tab.value" :value="tab.value" class="mt-0">
          <ScrollArea class="h-96 px-6">
            <!-- Loading State -->
            <div v-if="dashboardStore.loading" class="space-y-3">
              <div v-for="i in 3" :key="i" class="p-4 border rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <Skeleton class="h-4 w-32" />
                  <Skeleton class="h-6 w-16" />
                </div>
                <div class="space-y-2">
                  <Skeleton class="h-3 w-24" />
                  <Skeleton class="h-3 w-40" />
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div 
              v-else-if="tab.appointments.length === 0" 
              class="flex flex-col items-center justify-center py-8 text-center"
            >
              <Icon name="mdi:calendar-blank" size="48" class="text-muted-foreground mb-4" />
              <h3 class="text-lg font-medium text-muted-foreground mb-2">
                No {{ tab.value === 'all' ? '' : tab.label.toLowerCase() }} appointments
              </h3>
              <p class="text-sm text-muted-foreground">
                {{ tab.value === 'all' 
                  ? "No appointments found for the selected criteria" 
                  : `No ${tab.label.toLowerCase()} appointments found` 
                }}
              </p>
            </div>

            <!-- Appointments List -->
            <div v-else class="space-y-3 pb-4">
              <div 
                v-for="appointment in tab.appointments" 
                :key="appointment.id"
                class="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div class="flex flex-col items-center gap-1">
                      <Icon name="mdi:calendar" size="16" class="text-muted-foreground" />
                      <span class="text-xs text-muted-foreground">{{ formatDate(appointment.date) }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Icon name="mdi:clock-outline" size="16" class="text-muted-foreground" />
                      <span class="font-medium">{{ formatTime(appointment.time) }}</span>
                    </div>
                  </div>
                  <Badge :class="statusVariants[appointment.status as keyof typeof statusVariants].color">
                    {{ appointment.status }}
                  </Badge>
                </div>

                <div class="space-y-2 text-sm">
                  <div class="flex items-center gap-2">
                    <Icon name="mdi:account" size="16" class="text-muted-foreground" />
                    <span class="font-medium">{{ getPatientName(appointment.patient) }}</span>
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <Icon name="mdi:doctor" size="16" class="text-muted-foreground" />
                    <span>{{ getDoctorName(appointment.doctor) }}</span>
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <Icon name="mdi:map-marker" size="16" class="text-muted-foreground" />
                    <span>{{ appointment.facility.building.name }} - {{ appointment.facility.identifier }}</span>
                  </div>
                </div>

                <div class="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    @click="navigateTo(`/appointments/${appointment.id}`)"
                  >
                    <Icon name="mdi:eye" size="14" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    @click="navigateTo(`/appointments/${appointment.id}`)"
                  >
                    <Icon name="mdi:pencil" size="14" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
</template>