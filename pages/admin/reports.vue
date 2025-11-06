<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Admin Reports - Marcher Hospital'
})

const { $trpc } = useNuxtApp()

// Date range filters
const dateFrom = ref('')
const dateTo = ref('')
const reportType = ref('overview')
const loading = ref(false)
const reportData = ref<any>(null)

// Set default dates (last 30 days)
const setDefaultDates = () => {
  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 30)
  
  dateTo.value = today.toISOString().split('T')[0]
  dateFrom.value = thirtyDaysAgo.toISOString().split('T')[0]
}

onMounted(() => {
  setDefaultDates()
  fetchReportData()
})

// Report statistics
const reportStats = computed(() => {
  if (!reportData.value?.stats) return []
  
  const stats = reportData.value.stats
  
  return [
    {
      id: 1,
      title: 'Total Patients',
      value: stats.totalPatients?.toLocaleString() || '0',
      change: stats.patientGrowth || '+0%',
      trend: 'up',
      icon: 'lucide:users',
      color: 'blue',
      description: 'Registered patients'
    },
    {
      id: 2,
      title: 'Total Appointments',
      value: stats.totalAppointments?.toLocaleString() || '0',
      change: stats.appointmentGrowth || '+0%',
      trend: 'up',
      icon: 'lucide:calendar',
      color: 'green',
      description: 'All appointments in period'
    },
    {
      id: 3,
      title: 'Total Revenue',
      value: `₱${stats.totalRevenue?.toLocaleString() || '0'}`,
      change: stats.revenueGrowth || '+0%',
      trend: 'up',
      icon: 'lucide:dollar-sign',
      color: 'purple',
      description: 'From billing transactions'
    },
    {
      id: 4,
      title: 'Active Staff',
      value: stats.activeStaff?.toString() || '0',
      change: stats.staffGrowth || '+0%',
      trend: 'up',
      icon: 'lucide:user-check',
      color: 'orange',
      description: 'Currently active staff members'
    }
  ]
})

// Weekly activity data
const weeklyActivity = computed(() => {
  return reportData.value?.weeklyActivity || []
})

// Appointments by status
const appointmentsByStatus = computed(() => {
  return reportData.value?.appointmentsByStatus || []
})

// Top doctors
const topDoctors = computed(() => {
  return reportData.value?.topDoctors || []
})

// Recent activities
const recentActivities = computed(() => {
  return reportData.value?.recentActivities || []
})

// Department statistics
const departmentStats = computed(() => {
  return reportData.value?.departmentStats || []
})

// Fetch report data
const fetchReportData = async () => {
  try {
    loading.value = true
    
    // Small delay to ensure cookies are set
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const response = await $trpc.dashboard.getStaffDashboardData.query()
    
    if (response.success && response.data) {
      reportData.value = response.data
    }
  } catch (error: any) {
    console.error('Failed to fetch report data:', error)
    
    if (error?.data?.code === 'UNAUTHORIZED' || error?.message?.includes('session')) {
      console.log('❌ Authentication error, redirecting to login')
      await navigateTo('/login', { replace: true })
    }
  } finally {
    loading.value = false
  }
}

// Apply filters
const applyFilters = () => {
  fetchReportData()
}

// Reset filters
const resetFilters = () => {
  setDefaultDates()
  reportType.value = 'overview'
  fetchReportData()
}

// Export report
const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
  useToast('info', 'Export', `Exporting report as ${format.toUpperCase()}...`)
  // TODO: Implement export functionality
}

// Print report
const printReport = () => {
  window.print()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">System Reports</h1>
        <p class="text-gray-600 mt-1">Comprehensive analytics and insights</p>
      </div>
      <div class="flex space-x-2">
        <Button variant="outline" size="sm" @click="printReport">
          <Icon name="lucide:printer" class="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" size="sm" @click="exportReport('pdf')">
          <Icon name="lucide:file-text" class="w-4 h-4 mr-2" />
          Export PDF
        </Button>
        <Button variant="outline" size="sm" @click="exportReport('excel')">
          <Icon name="lucide:file-spreadsheet" class="w-4 h-4 mr-2" />
          Export Excel
        </Button>
      </div>
    </div>

    <!-- Filters Card -->
    <Card>
      <CardHeader>
        <CardTitle>Report Filters</CardTitle>
        <CardDescription>Customize your report date range and type</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Date From -->
          <div class="space-y-2">
            <Label for="dateFrom">From Date</Label>
            <Input
              id="dateFrom"
              v-model="dateFrom"
              type="date"
              class="w-full"
            />
          </div>

          <!-- Date To -->
          <div class="space-y-2">
            <Label for="dateTo">To Date</Label>
            <Input
              id="dateTo"
              v-model="dateTo"
              type="date"
              class="w-full"
            />
          </div>

          <!-- Report Type -->
          <div class="space-y-2">
            <Label for="reportType">Report Type</Label>
            <Select v-model="reportType">
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="patients">Patients</SelectItem>
                <SelectItem value="appointments">Appointments</SelectItem>
                <SelectItem value="billing">Billing & Revenue</SelectItem>
                <SelectItem value="staff">Staff Performance</SelectItem>
                <SelectItem value="departments">Departments</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Actions -->
          <div class="space-y-2">
            <Label>&nbsp;</Label>
            <div class="flex space-x-2">
              <Button @click="applyFilters" class="flex-1" :disabled="loading">
                <Icon name="lucide:filter" class="w-4 h-4 mr-2" />
                Apply
              </Button>
              <Button variant="outline" @click="resetFilters" :disabled="loading">
                <Icon name="lucide:rotate-ccw" class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card v-for="i in 4" :key="i">
          <CardContent class="p-6">
            <div class="h-24 animate-pulse bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Main Report Content -->
    <div v-else class="space-y-6">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          v-for="stat in reportStats" 
          :key="stat.id"
          class="hover:shadow-lg transition-all"
        >
          <CardContent class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-muted-foreground">{{ stat.title }}</p>
                <p class="text-3xl font-bold mt-2">{{ stat.value }}</p>
                <p class="text-xs text-muted-foreground mt-1">{{ stat.description }}</p>
                <p :class="`text-sm mt-2 flex items-center font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`">
                  <Icon :name="stat.trend === 'up' ? 'lucide:trending-up' : 'lucide:trending-down'" class="w-4 h-4 mr-1" />
                  {{ stat.change }}
                </p>
              </div>
              <div :class="`w-14 h-14 rounded-xl flex items-center justify-center ${
                stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' :
                stat.color === 'green' ? 'bg-green-100 dark:bg-green-900' :
                stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900' :
                'bg-orange-100 dark:bg-orange-900'
              }`">
                <Icon :name="stat.icon" :class="`w-7 h-7 ${
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'green' ? 'text-green-600' :
                  stat.color === 'purple' ? 'text-purple-600' :
                  'text-orange-600'
                }`" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Weekly Activity Chart -->
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Patients, appointments and revenue trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="h-80 relative">
              <div class="flex items-end justify-between h-full space-x-2 px-4">
                <div v-for="day in weeklyActivity" :key="day.day" class="flex flex-col items-center space-y-2 flex-1">
                  <div class="w-full relative" style="height: 260px;">
                    <!-- Patients bar -->
                    <div 
                      class="w-1/3 bg-blue-500 rounded-t absolute bottom-0 left-0 flex items-end justify-center text-white text-xs font-medium hover:bg-blue-600 transition-colors"
                      :style="`height: ${(day.patients / 70) * 100}%`"
                      :title="`${day.patients} patients`"
                    >
                      <span class="pb-1">{{ day.patients }}</span>
                    </div>
                    <!-- Appointments bar -->
                    <div 
                      class="w-1/3 bg-green-500 rounded-t absolute bottom-0 left-1/3 flex items-end justify-center text-white text-xs font-medium hover:bg-green-600 transition-colors"
                      :style="`height: ${(day.appointments / 70) * 100}%`"
                      :title="`${day.appointments} appointments`"
                    >
                      <span class="pb-1">{{ day.appointments }}</span>
                    </div>
                    <!-- Revenue bar -->
                    <div 
                      class="w-1/3 bg-purple-500 rounded-t absolute bottom-0 right-0 flex items-end justify-center text-white text-xs font-medium hover:bg-purple-600 transition-colors"
                      :style="`height: ${(day.revenue / 2000) * 100}%`"
                      :title="`₱${day.revenue.toLocaleString()}`"
                    >
                      <span class="pb-1">{{ (day.revenue / 1000).toFixed(1) }}k</span>
                    </div>
                  </div>
                  <span class="text-xs text-muted-foreground font-medium">{{ day.day }}</span>
                </div>
              </div>
            </div>

            <!-- Legend -->
            <div class="flex items-center justify-center space-x-6 mt-6 pt-6 border-t">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-blue-500 rounded"></div>
                <span class="text-sm text-muted-foreground">Patients</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-500 rounded"></div>
                <span class="text-sm text-muted-foreground">Appointments</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-purple-500 rounded"></div>
                <span class="text-sm text-muted-foreground">Revenue (₱K)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Appointments by Status -->
        <Card>
          <CardHeader>
            <CardTitle>Appointment Status Distribution</CardTitle>
            <CardDescription>Breakdown of appointments by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div v-for="status in appointmentsByStatus" :key="status.name" class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="font-medium">{{ status.name }}</span>
                  <span class="text-muted-foreground">{{ status.count }} ({{ status.percentage }}%)</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    :class="`h-2 rounded-full ${
                      status.name === 'Completed' ? 'bg-green-500' :
                      status.name === 'Scheduled' ? 'bg-blue-500' :
                      status.name === 'Pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`"
                    :style="`width: ${status.percentage}%`"
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Bottom Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Top Performing Doctors -->
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Doctors</CardTitle>
            <CardDescription>Based on appointments completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div v-for="(doctor, index) in topDoctors" :key="doctor.id" class="flex items-center space-x-3">
                <div :class="`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-orange-600' :
                  'bg-gray-300'
                }`">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">{{ doctor.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ doctor.specialization }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold">{{ doctor.appointments }}</p>
                  <p class="text-xs text-muted-foreground">appointments</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Recent Activities -->
        <Card>
          <CardHeader>
            <CardTitle>Recent System Activities</CardTitle>
            <CardDescription>Latest system events and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-3 max-h-80 overflow-y-auto">
              <div 
                v-for="activity in recentActivities" 
                :key="activity.id"
                class="flex items-start space-x-3 p-2 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div :class="`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'appointment' ? 'bg-blue-100 dark:bg-blue-900' :
                  activity.type === 'payment' ? 'bg-green-100 dark:bg-green-900' :
                  activity.type === 'staff' ? 'bg-purple-100 dark:bg-purple-900' :
                  'bg-orange-100 dark:bg-orange-900'
                }`">
                  <Icon :name="
                    activity.type === 'appointment' ? 'lucide:calendar' :
                    activity.type === 'payment' ? 'lucide:credit-card' :
                    activity.type === 'staff' ? 'lucide:user' :
                    'lucide:activity'
                  " :class="`w-4 h-4 ${
                    activity.type === 'appointment' ? 'text-blue-600' :
                    activity.type === 'payment' ? 'text-green-600' :
                    activity.type === 'staff' ? 'text-purple-600' :
                    'text-orange-600'
                  }`" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium">{{ activity.title }}</p>
                  <p class="text-xs text-muted-foreground truncate">{{ activity.description }}</p>
                  <p class="text-xs text-muted-foreground mt-1">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Department Statistics -->
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>Staff distribution by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div v-for="dept in departmentStats" :key="dept.name" class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="font-medium">{{ dept.name }}</span>
                  <span class="text-muted-foreground">{{ dept.count }} staff</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-blue-500 h-2 rounded-full"
                    :style="`width: ${dept.percentage}%`"
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
