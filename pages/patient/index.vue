<script setup lang="ts">
import { useAuthStore } from '~/stores/app/useAuthStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Add definePageMeta to use patient layout
definePageMeta({
  layout: 'patient'
})

// Set page title
useHead({
  title: 'Patient Dashboard - Marcher'
})

// Patient dashboard statistics
const patientStats = ref([
  {
    id: 1,
    title: 'Next Appointment',
    value: 'Oct 15',
    subtitle: 'Dr. Smith - Cardiology',
    icon: 'lucide:calendar',
    color: 'blue'
  },
  {
    id: 2,
    title: 'Last Visit',
    value: 'Sep 28',
    subtitle: 'General Checkup',
    icon: 'lucide:stethoscope',
    color: 'green'
  },
  {
    id: 3,
    title: 'Prescriptions',
    value: '3',
    subtitle: 'Active medications',
    icon: 'lucide:pill',
    color: 'purple'
  },
  {
    id: 4,
    title: 'Test Results',
    value: '2',
    subtitle: 'Pending results',
    icon: 'lucide:activity',
    color: 'orange'
  }
])

// Monthly overview data
const monthlyData = ref({
  currentMonth: 'October 2025',
  totalAppointments: 4,
  completedAppointments: 2,
  upcomingAppointments: 2,
  prescriptions: 3
})

// Recent appointments
const recentAppointments = ref([
  {
    id: 1,
    doctor: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    date: '2025-10-15',
    time: '10:00 AM',
    status: 'upcoming',
    type: 'Consultation'
  },
  {
    id: 2,
    doctor: 'Dr. Michael Chen',
    specialty: 'General Medicine',
    date: '2025-09-28',
    time: '2:30 PM',
    status: 'completed',
    type: 'Check-up'
  },
  {
    id: 3,
    doctor: 'Dr. Lisa Wong',
    specialty: 'Dermatology',
    date: '2025-09-15',
    time: '11:15 AM',
    status: 'completed',
    type: 'Follow-up'
  }
])

// Health metrics
const healthMetrics = ref([
  { label: 'Blood Pressure', value: '120/80', status: 'normal', color: 'green' },
  { label: 'Heart Rate', value: '72 bpm', status: 'normal', color: 'green' },
  { label: 'Weight', value: '68 kg', status: 'stable', color: 'blue' },
  { label: 'BMI', value: '22.5', status: 'normal', color: 'green' }
])
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <Card class="bg-gradient-to-r from-teal-600 to-teal-700 border-0">
      <CardContent class="p-6">
        <div class="flex items-center justify-between text-white">
          <div>
            <h1 class="text-2xl font-bold">Welcome back, {{ authStore.fullName }}!</h1>
            <p class="text-teal-100 mt-1">Here's your health overview for {{ monthlyData.currentMonth }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-teal-200">Patient ID</p>
            <p class="text-lg font-semibold">{{ user?.id || 'P12345' }}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Stats Cards Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card 
        v-for="stat in patientStats" 
        :key="stat.id"
        class="hover:shadow-md transition-shadow"
      >
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-muted-foreground">{{ stat.title }}</p>
              <p class="text-2xl font-bold mt-1">{{ stat.value }}</p>
              <p class="text-sm text-muted-foreground mt-1">{{ stat.subtitle }}</p>
            </div>
            <div :class="`w-12 h-12 rounded-lg flex items-center justify-center ${
              stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' :
              stat.color === 'green' ? 'bg-green-100 dark:bg-green-900' :
              stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900' :
              'bg-orange-100 dark:bg-orange-900'
            }`">
              <Icon :name="stat.icon" :class="`w-6 h-6 ${
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

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Monthly Overview Chart (Left - 2 columns) -->
      <div class="lg:col-span-2">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>Monthly Overview</CardTitle>
                <CardDescription>Your health activity this month</CardDescription>
              </div>
              <div class="flex space-x-2">
                <Button size="sm" variant="secondary">This Month</Button>
                <Button size="sm" variant="outline">Last Month</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <!-- Chart area with data visualization -->
            <div class="h-64 relative">
              <!-- Chart representation with bars -->
              <div class="flex items-end justify-between h-full space-x-4 px-4">
                <div class="flex flex-col items-center space-y-2 flex-1">
                  <div class="w-full bg-teal-500 rounded-t flex items-end justify-center text-white text-sm font-medium" style="height: 60%">
                    4
                  </div>
                  <span class="text-xs text-muted-foreground">Week 1</span>
                </div>
                <div class="flex flex-col items-center space-y-2 flex-1">
                  <div class="w-full bg-teal-500 rounded-t flex items-end justify-center text-white text-sm font-medium" style="height: 20%">
                    2
                  </div>
                  <span class="text-xs text-muted-foreground">Week 2</span>
                </div>
                <div class="flex flex-col items-center space-y-2 flex-1">
                  <div class="w-full bg-teal-500 rounded-t flex items-end justify-center text-white text-sm font-medium" style="height: 20%">
                    2
                  </div>
                  <span class="text-xs text-muted-foreground">Week 3</span>
                </div>
                <div class="flex flex-col items-center space-y-2 flex-1">
                  <div class="w-full bg-teal-500 rounded-t flex items-end justify-center text-white text-sm font-medium" style="height: 30%">
                    3
                  </div>
                  <span class="text-xs text-muted-foreground">Week 4</span>
                </div>
              </div>
            </div>

            <!-- Monthly Stats Summary -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
              <div class="text-center">
                <p class="text-2xl font-bold text-teal-600">{{ monthlyData.totalAppointments }}</p>
                <p class="text-sm text-muted-foreground">Total Appointments</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-green-600">{{ monthlyData.completedAppointments }}</p>
                <p class="text-sm text-muted-foreground">Completed</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-blue-600">{{ monthlyData.upcomingAppointments }}</p>
                <p class="text-sm text-muted-foreground">Upcoming</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-purple-600">{{ monthlyData.prescriptions }}</p>
                <p class="text-sm text-muted-foreground">Prescriptions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Health Metrics (Right sidebar) -->
      <div class="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Health Metrics</CardTitle>
            <CardDescription>Your latest vital signs</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div 
                v-for="metric in healthMetrics" 
                :key="metric.label"
                class="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p class="text-sm font-medium">{{ metric.label }}</p>
                  <p class="text-lg font-semibold">{{ metric.value }}</p>
                </div>
                <div :class="`px-2 py-1 rounded-full text-xs font-medium ${
                  metric.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  metric.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`">
                  {{ metric.status }}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Appointments -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>Your appointment history</CardDescription>
            </div>
            <Button variant="outline" size="sm" as-child>
              <NuxtLink to="/patient/appointments">View All</NuxtLink>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div 
              v-for="appointment in recentAppointments" 
              :key="appointment.id"
              class="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <Icon name="lucide:user-md" class="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p class="text-sm font-medium">{{ appointment.doctor }}</p>
                  <p class="text-xs text-muted-foreground">{{ appointment.specialty }} • {{ appointment.type }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium">{{ new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</p>
                <span :class="`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  appointment.status === 'upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  appointment.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`">
                  {{ appointment.status }}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Quick Actions -->
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" class="h-auto p-4 flex flex-col items-center space-y-2" as-child>
              <NuxtLink to="/patient/appointments/new">
                <Icon name="lucide:calendar-plus" class="w-6 h-6 text-teal-600" />
                <span class="text-sm font-medium">Book Appointment</span>
              </NuxtLink>
            </Button>
            
            <Button variant="outline" size="lg" class="h-auto p-4 flex flex-col items-center space-y-2" as-child>
              <NuxtLink to="/patient/medical-records">
                <Icon name="lucide:file-text" class="w-6 h-6 text-blue-600" />
                <span class="text-sm font-medium">View Records</span>
              </NuxtLink>
            </Button>
            
            <Button variant="outline" size="lg" class="h-auto p-4 flex flex-col items-center space-y-2" as-child>
              <NuxtLink to="/patient/billing">
                <Icon name="lucide:credit-card" class="w-6 h-6 text-green-600" />
                <span class="text-sm font-medium">Pay Bills</span>
              </NuxtLink>
            </Button>
            
            <Button variant="outline" size="lg" class="h-auto p-4 flex flex-col items-center space-y-2">
              <Icon name="lucide:phone" class="w-6 h-6 text-purple-600" />
              <span class="text-sm font-medium">Contact Support</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>