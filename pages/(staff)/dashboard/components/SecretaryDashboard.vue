<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { useDashboardStore } from "~/stores/dashboard/useDashboardStore"
import DashboardSummaryCards from "@/pages/(staff)/dashboard/components/DashboardSummaryCards.vue"
import AppointmentsList from "~/pages/(staff)/dashboard/components/AppointmentsList.vue" // Fixed: Renamed component
import DashboardFilters from "@/pages/(staff)/dashboard/components/DashboardFilters.vue"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
//import { Alert, AlertDescription } from "@/components/ui/alert"
//import { Badge } from "@/components/ui/badge"

const breadcrumbsStore = useBreadcrumbsStore()
const dashboardStore = useDashboardStore()

// Secretary-specific computed properties
const urgentTasks = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()
  
  return dashboardStore.appointmentsList.filter(apt => {
    if (apt.status !== 'PENDING' || apt.date !== today) return false
    
    const [hours, minutes] = apt.time.split(':').map(Number)
    const aptTime = hours * 60 + minutes
    const timeDiff = aptTime - currentTime
    
    // Show appointments that need confirmation within next 2 hours
    return timeDiff > 0 && timeDiff <= 120
  })
})

const overdueTasks = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()
  
  return dashboardStore.appointmentsList.filter(apt => {
    if (apt.status !== 'PENDING' || apt.date !== today) return false
    
    const [hours, minutes] = apt.time.split(':').map(Number)
    const aptTime = hours * 60 + minutes
    
    // Show overdue pending appointments
    return aptTime < currentTime
  })
})

const roomUtilization = computed(() => {
  if (dashboardStore.appointmentsList.length === 0) return 0
  
  const uniqueRooms = new Set(dashboardStore.appointmentsList.map(apt => apt.facility.id))
  const totalSlots = uniqueRooms.size * 20 // Assuming 20 slots per room per day
  const bookedSlots = dashboardStore.appointmentsList.length
  
  return Math.round((bookedSlots / totalSlots) * 100)
})

const formatTime = (time: string) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  })
}

const getPatientName = (patient: any) => {
  return `${patient.lastName}, ${patient.firstName}${patient.middleName ? ` ${patient.middleName}` : ""}${patient.suffix ? ` ${patient.suffix}` : ""}`
}

const getDoctorName = (doctor: any) => {
  return `Dr. ${doctor.firstName} ${doctor.lastName}`
}

onMounted(async () => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Dashboard", link: "secretary/dashboard" },
  ])
  
  // Load full dashboard data for secretary view
  await dashboardStore.refreshDashboard()
})
</script>

<template>
  <NuxtLayout name="staff" title="Secretary Dashboard">
    <div class="space-y-6">
      <!-- Alert Section for Urgent Tasks -->
      <div v-if="urgentTasks.length > 0 || overdueTasks.length > 0" class="space-y-3">
        <Alert v-if="overdueTasks.length > 0" variant="destructive">
          <Icon name="mdi:alert-circle" />
          <AlertDescription>
            <strong>{{ overdueTasks.length }} overdue appointment(s)</strong> need immediate attention.
            <Button size="sm" variant="outline" class="ml-2" @click="navigateTo('/appointments?status=PENDING')">
              Review Now
            </Button>
          </AlertDescription>
        </Alert>
        
        <Alert v-if="urgentTasks.length > 0">
          <Icon name="mdi:clock-alert" />
          <AlertDescription>
            <strong>{{ urgentTasks.length }} appointment(s)</strong> need confirmation within 2 hours.
            <Button size="sm" variant="outline" class="ml-2" @click="navigateTo('/appointments?status=PENDING')">
              View Details
            </Button>
          </AlertDescription>
        </Alert>
      </div>

      <!-- Summary Cards -->
      <DashboardSummaryCards />

      <!-- Secretary-Specific Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Room Utilization</CardTitle>
            <Icon name="mdi:door" class="text-purple-600" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ roomUtilization }}%</div>
            <p class="text-xs text-muted-foreground">Today's occupancy rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Pending Confirmations</CardTitle>
            <Icon name="mdi:phone" class="text-amber-600" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ dashboardStore.todayPendingCount }}</div>
            <p class="text-xs text-muted-foreground">Need to be confirmed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">No-Shows</CardTitle>
            <Icon name="mdi:account-cancel" class="text-red-600" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ dashboardStore.todayCancelledCount }}</div>
            <p class="text-xs text-muted-foreground">Cancelled appointments</p>
          </CardContent>
        </Card>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <!-- Today's Appointments - Takes up 2 columns -->
        <div class="xl:col-span-2">
          <AppointmentsList />
        </div>

        <!-- Urgent Tasks -->
        <div class="xl:col-span-1">
          <Card class="h-full">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Icon name="mdi:alert-circle" class="text-red-600" />
                Urgent Tasks
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <!-- Overdue Appointments -->
              <div v-if="overdueTasks.length > 0">
                <h4 class="font-medium text-red-600 mb-2">Overdue</h4>
                <div class="space-y-2">
                  <div 
                    v-for="apt in overdueTasks" 
                    :key="apt.id"
                    class="p-3 border border-red-200 rounded-lg bg-red-50"
                  >
                    <div class="font-medium text-sm">{{ formatTime(apt.time) }}</div>
                    <div class="text-sm text-muted-foreground">{{ getPatientName(apt.patient) }}</div>
                    <div class="text-xs text-muted-foreground">{{ getDoctorName(apt.doctor) }}</div>
                    <Button size="sm" class="mt-2 w-full" @click="navigateTo(`/appointments/${apt.id}`)">
                      Confirm Now
                    </Button>
                  </div>
                </div>
              </div>

              <!-- Upcoming Urgent -->
              <div v-if="urgentTasks.length > 0">
                <h4 class="font-medium text-amber-600 mb-2">Needs Confirmation (Next 2 Hours)</h4>
                <div class="space-y-2">
                  <div 
                    v-for="apt in urgentTasks" 
                    :key="apt.id"
                    class="p-3 border border-amber-200 rounded-lg bg-amber-50"
                  >
                    <div class="font-medium text-sm">{{ formatTime(apt.time) }}</div>
                    <div class="text-sm text-muted-foreground">{{ getPatientName(apt.patient) }}</div>
                    <div class="text-xs text-muted-foreground">{{ getDoctorName(apt.doctor) }}</div>
                    <Button size="sm" variant="outline" class="mt-2 w-full" @click="navigateTo(`/appointments/${apt.id}`)">
                      Confirm
                    </Button>
                  </div>
                </div>
              </div>

              <!-- No Urgent Tasks -->
              <div v-if="urgentTasks.length === 0 && overdueTasks.length === 0" class="text-center py-4">
                <Icon name="mdi:check-circle" size="32" class="text-green-600 mx-auto mb-2" />
                <p class="text-sm text-muted-foreground">All tasks up to date!</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Filters -->
        <div class="xl:col-span-1 space-y-6">
          <DashboardFilters />
        </div>
      </div>

      <!-- Secretary Quick Actions -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Icon name="mdi:lightning-bolt" class="text-yellow-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button 
              variant="outline" 
              class="h-auto p-4 flex flex-col items-center gap-2 relative"
              @click="navigateTo('/appointments/new')"
            >
              <Icon name="mdi:calendar-plus" size="24" />
              <span class="text-sm">Book Appointment</span>
            </Button>
            
            <Button 
              variant="outline" 
              class="h-auto p-4 flex flex-col items-center gap-2 relative"
              @click="navigateTo('/appointments?status=PENDING')"
            >
              <Icon name="mdi:phone" size="24" />
              <span class="text-sm">Pending Calls</span>
              <Badge v-if="dashboardStore.todayPendingCount > 0" variant="destructive" class="absolute -top-1 -right-1">
                {{ dashboardStore.todayPendingCount }}
              </Badge>
            </Button>
            
            <Button 
              variant="outline" 
              class="h-auto p-4 flex flex-col items-center gap-2"
              @click="navigateTo('/patients/new')"
            >
              <Icon name="mdi:account-plus" size="24" />
              <span class="text-sm">New Patient</span>
            </Button>
            
            <Button 
              variant="outline" 
              class="h-auto p-4 flex flex-col items-center gap-2"
              @click="navigateTo('/rooms')"
            >
              <Icon name="mdi:door" size="24" />
              <span class="text-sm">Room Status</span>
            </Button>
            
            <Button 
              variant="outline" 
              class="h-auto p-4 flex flex-col items-center gap-2"
              @click="navigateTo('/reports')"
            >
              <Icon name="mdi:file-chart" size="24" />
              <span class="text-sm">Daily Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </NuxtLayout>
</template>