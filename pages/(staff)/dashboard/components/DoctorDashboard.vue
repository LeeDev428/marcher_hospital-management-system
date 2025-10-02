<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { useDashboardStore } from "~/stores/dashboard/useDashboardStore"
import { useAuthStore } from "@/stores/app" 
import DashboardSummaryCards from "@/pages/(staff)/dashboard/components/DashboardSummaryCards.vue"
import AppointmentsList from "~/pages/(staff)/dashboard/components/AppointmentsList.vue"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const breadcrumbsStore = useBreadcrumbsStore()
const dashboardStore = useDashboardStore()
const authStore = useAuthStore() // Get current user info

// Doctor-specific filters
const doctorId = computed(() => authStore.user?.id) // Assuming user is the doctor

const nextAppointment = computed(() => {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const currentTime = now.getHours() * 60 + now.getMinutes()
  
  return dashboardStore.appointmentsList
    .filter(apt => {
      if (apt.date !== today) return false
      const [hours, minutes] = apt.time.split(':').map(Number)
      const aptTime = hours * 60 + minutes
      return aptTime > currentTime && (apt.status === 'PENDING' || apt.status === 'SCHEDULED')
    })
    .sort((a, b) => a.time.localeCompare(b.time))[0]
})

const todayStats = computed(() => ({
  total: dashboardStore.dashboardData?.summary.todayAppointments ?? 0,
  pending: dashboardStore.dashboardData?.summary.todayByStatus?.pending ?? 0,
  scheduled: dashboardStore.dashboardData?.summary.todayByStatus?.scheduled ?? 0,
  completed: dashboardStore.dashboardData?.summary.todayByStatus?.completed ?? 0,
  cancelled: dashboardStore.dashboardData?.summary.todayByStatus?.cancelled ?? 0,
}))

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

onMounted(async () => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Dashboard", link: "doctor/dashboard" },
  ])
  
  // Load dashboard data filtered by doctor
  if (doctorId.value) {
    dashboardStore.setFilters({ doctorId: doctorId.value })
    await dashboardStore.refreshDashboard()
  }
})
</script>

<template>
  <NuxtLayout name="staff" title="My Dashboard">
    <div class="space-y-6">
      <!-- Welcome Section -->
      <Card>
        <CardContent class="pt-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-foreground">
                Good {{ new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening' }}, 
                Dr. {{ authStore.user?.firstName }}!
              </h1>
              <p class="text-muted-foreground mt-1">
                {{ new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) }}
              </p>
            </div>
            
            <!-- Next Appointment Card -->
            <div v-if="nextAppointment" class="text-right">
              <div class="text-sm text-muted-foreground mb-1">Next Appointment</div>
              <div class="font-semibold">{{ formatTime(nextAppointment.time) }}</div>
              <div class="text-sm">{{ getPatientName(nextAppointment.patient) }}</div>
              <Badge variant="outline" class="mt-1">
                {{ nextAppointment.facility.building.name }} - {{ nextAppointment.facility.identifier }}
              </Badge>
            </div>
            <div v-else class="text-right text-muted-foreground">
              <Icon name="mdi:calendar-check" size="24" />
              <div class="text-sm mt-1">No more appointments today</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Today's Overview -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent class="pt-6">
            <div class="text-2xl font-bold text-blue-600">{{ todayStats.total }}</div>
            <p class="text-sm text-muted-foreground">Total Today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent class="pt-6">
            <div class="text-2xl font-bold text-amber-600">{{ todayStats.pending }}</div>
            <p class="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent class="pt-6">
            <div class="text-2xl font-bold text-green-600">{{ todayStats.scheduled }}</div>
            <p class="text-sm text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent class="pt-6">
            <div class="text-2xl font-bold text-indigo-600">{{ todayStats.completed }}</div>
            <p class="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent class="pt-6">
            <div class="text-2xl font-bold text-red-600">{{ todayStats.cancelled }}</div>
            <p class="text-sm text-muted-foreground">Cancelled</p>
          </CardContent>
        </Card>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Today's Appointments -->
        <TodayAppointmentsList />
        
        <!-- Upcoming Appointments -->
        <UpcomingAppointments />
      </div>

      <!-- Quick Actions for Doctors -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Icon name="mdi:lightning-bolt" class="text-yellow-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              class="h-auto p-4 flex flex-col items-center gap-2"
              @click="navigateTo('/appointments')"
            >
              <Icon name="mdi:calendar" size="24" />
              <span class="text-sm">My Appointments</span>
            </Button>
            
            <Button 
              variant="outline" 
              class="h-auto p-4 flex flex-col items-center gap-2"
              @click="navigateTo('/patients')"
            >
              <Icon name="mdi:account-group" size="24" />
              <span class="text-sm">My Patients</span>
            </Button>
            
            <Button 
              variant="outline" 
              class="h-auto p-4 flex flex-col items-center gap-2"
              @click="navigateTo('/schedule')"
            >
              <Icon name="mdi:clock" size="24" />
              <span class="text-sm">My Schedule</span>
            </Button>
            
            <Button 
              variant="outline" 
              class="h-auto p-4 flex flex-col items-center gap-2"
              @click="navigateTo('/reports')"
            >
              <Icon name="mdi:chart-line" size="24" />
              <span class="text-sm">Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </NuxtLayout>
</template>
