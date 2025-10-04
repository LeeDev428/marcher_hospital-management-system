<script setup lang="ts">
import { useAuthStore } from '~/stores/app/useAuthStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Add definePageMeta to use staff layout
definePageMeta({
  layout: 'staff'
})

// Set page title
useHead({
  title: 'Staff Dashboard - MediFlow'
})

// Staff dashboard statistics - matching the provided image
const staffStats = ref([
  {
    id: 1,
    title: 'Total Patients',
    value: '2,370',
    change: '+12.5%',
    trend: 'up',
    icon: 'lucide:users',
    color: 'blue'
  },
  {
    id: 2,
    title: 'Appointments Today',
    value: '1,204',
    change: '+8.2%',
    trend: 'up',
    icon: 'lucide:calendar',
    color: 'green'
  },
  {
    id: 3,
    title: 'Total Revenue',
    value: '5,200',
    change: '+15.3%',
    trend: 'up',
    icon: 'lucide:dollar-sign',
    color: 'purple'
  },
  {
    id: 4,
    title: 'Active Staff',
    value: '34',
    change: '+2.1%',
    trend: 'up',
    icon: 'lucide:user-check',
    color: 'orange'
  }
])

// Recent activities for the sidebar
const recentActivities = ref([
  {
    id: 1,
    type: 'appointment',
    title: 'New Appointment',
    description: 'John Doe scheduled for 2:30 PM',
    time: '5 min ago',
    status: 'new'
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Received',
    description: 'Invoice #INV-001 paid by Sarah Johnson',
    time: '15 min ago',
    status: 'completed'
  },
  {
    id: 3,
    type: 'staff',
    title: 'Staff Check-in',
    description: 'Dr. Michael Chen checked in',
    time: '30 min ago',
    status: 'active'
  },
  {
    id: 4,
    type: 'prescription',
    title: 'Prescription Issued',
    description: 'Medication prescribed to Lisa Wong',
    time: '45 min ago',
    status: 'completed'
  },

])

// Today's appointments
const todayAppointments = ref([
  {
    id: 1,
    time: '09:00 AM',
    patient: 'Alice Johnson',
    doctor: 'Dr. Sarah Wilson',
    type: 'Consultation',
    status: 'confirmed'
  },
  {
    id: 2,
    time: '10:30 AM',
    patient: 'Robert Smith',
    doctor: 'Dr. Michael Chen',
    type: 'Check-up',
    status: 'in-progress'
  },
  {
    id: 3,
    time: '11:15 AM',
    patient: 'Emily Davis',
    doctor: 'Dr. Lisa Brown',
    type: 'Follow-up',
    status: 'waiting'
  },
  {
    id: 4,
    time: '02:30 PM',
    patient: 'John Miller',
    doctor: 'Dr. David Lee',
    type: 'Consultation',
    status: 'confirmed'
  },
  {
    id: 5,
    time: '03:45 PM',
    patient: 'Maria Garcia',
    doctor: 'Dr. Anna Kim',
    type: 'Surgery Prep',
    status: 'confirmed'
  }
])

// Activity chart data - representing weekly statistics
const weeklyActivity = ref([
  { day: 'Mon', patients: 45, appointments: 38, revenue: 1200 },
  { day: 'Tue', patients: 52, appointments: 44, revenue: 1450 },
  { day: 'Wed', patients: 38, appointments: 35, revenue: 980 },
  { day: 'Thu', patients: 61, appointments: 52, revenue: 1680 },
  { day: 'Fri', patients: 48, appointments: 41, revenue: 1320 },
  { day: 'Sat', patients: 35, appointments: 28, revenue: 890 },
  { day: 'Sun', patients: 28, appointments: 22, revenue: 720 }
])
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <Card class="bg-gradient-to-r from-blue-600 to-blue-700 border-0">
      <CardContent class="p-6">
        <div class="flex items-center justify-between text-white">
          <div>
            <h1 class="text-2xl font-bold">Welcome back, {{ authStore.fullName }}!</h1>
            <p class="text-blue-100 mt-1">Here's what's happening at Marcher today</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-blue-200">{{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
            <p class="text-lg font-semibold">{{ user?.role || 'Staff' }}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Stats Cards Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card 
        v-for="stat in staffStats" 
        :key="stat.id"
        class="hover:shadow-md transition-shadow"
      >
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-muted-foreground">{{ stat.title }}</p>
              <p class="text-2xl font-bold mt-1">{{ stat.value }}</p>
              <p :class="`text-sm mt-1 flex items-center ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`">
                <Icon :name="stat.trend === 'up' ? 'lucide:trending-up' : 'lucide:trending-down'" class="w-4 h-4 mr-1" />
                {{ stat.change }}
              </p>
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
      <!-- Activity Chart (Left - 2 columns) -->
      <div class="lg:col-span-2">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Patient visits, appointments and revenue overview</CardDescription>
              </div>
              <div class="flex space-x-2">
                <Button size="sm" variant="secondary">This Week</Button>
                <Button size="sm" variant="outline">Last Week</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <!-- Chart area with weekly data visualization -->
            <div class="h-64 relative">
              <!-- Chart representation with bars -->
              <div class="flex items-end justify-between h-full space-x-2 px-4">
                <div v-for="day in weeklyActivity" :key="day.day" class="flex flex-col items-center space-y-2 flex-1">
                  <div class="w-full relative" style="height: 200px;">
                    <!-- Patients bar -->
                    <div 
                      class="w-1/3 bg-blue-500 rounded-t absolute bottom-0 left-0 flex items-end justify-center text-white text-xs font-medium"
                      :style="`height: ${(day.patients / 70) * 100}%`"
                    >
                      {{ day.patients }}
                    </div>
                    <!-- Appointments bar -->
                    <div 
                      class="w-1/3 bg-green-500 rounded-t absolute bottom-0 left-1/3 flex items-end justify-center text-white text-xs font-medium"
                      :style="`height: ${(day.appointments / 70) * 100}%`"
                    >
                      {{ day.appointments }}
                    </div>
                    <!-- Revenue bar (scaled down for display) -->
                    <div 
                      class="w-1/3 bg-purple-500 rounded-t absolute bottom-0 right-0 flex items-end justify-center text-white text-xs font-medium"
                      :style="`height: ${(day.revenue / 2000) * 100}%`"
                    >
                      {{ (day.revenue / 1000).toFixed(1) }}k
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
                <span class="text-sm text-muted-foreground">Revenue (K)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Recent Activities (Right sidebar) -->
      <div class="lg:col-span-1">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Live updates from the system</CardDescription>
              </div>
              <Button size="sm" variant="ghost">
                <Icon name="lucide:refresh-cw" class="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div 
                v-for="activity in recentActivities" 
                :key="activity.id"
                class="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg"
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
                    'lucide:pill'
                  " :class="`w-4 h-4 ${
                    activity.type === 'appointment' ? 'text-blue-600' :
                    activity.type === 'payment' ? 'text-green-600' :
                    activity.type === 'staff' ? 'text-purple-600' :
                    'text-orange-600'
                  }`" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium">{{ activity.title }}</p>
                  <p class="text-xs text-muted-foreground mt-1">{{ activity.description }}</p>
                  <p class="text-xs text-muted-foreground mt-1">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Today's Appointments -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Today's Appointments</CardTitle>
              <CardDescription>{{ todayAppointments.length }} appointments scheduled</CardDescription>
            </div>
            <Button variant="outline" size="sm" as-child>
              <NuxtLink to="/staff/appointments">View All</NuxtLink>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div 
              v-for="appointment in todayAppointments.slice(0, 5)" 
              :key="appointment.id"
              class="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div class="text-center">
                  <p class="text-sm font-medium">{{ appointment.time }}</p>
                </div>
                <div class="w-px h-8 bg-border"></div>
                <div>
                  <p class="text-sm font-medium">{{ appointment.patient }}</p>
                  <p class="text-xs text-muted-foreground">{{ appointment.doctor }} • {{ appointment.type }}</p>
                </div>
              </div>
              <span :class="`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                appointment.status === 'in-progress' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                appointment.status === 'waiting' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`">
                {{ appointment.status }}
              </span>
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
              <NuxtLink to="/staff/patients/new">
                <Icon name="lucide:user-plus" class="w-6 h-6 text-blue-600" />
                <span class="text-sm font-medium">Add Patient</span>
              </NuxtLink>
            </Button>
            
            <Button variant="outline" size="lg" class="h-auto p-4 flex flex-col items-center space-y-2" as-child>
              <NuxtLink to="/staff/appointments/new">
                <Icon name="lucide:calendar-plus" class="w-6 h-6 text-green-600" />
                <span class="text-sm font-medium">New Appointment</span>
              </NuxtLink>
            </Button>
            
            <Button variant="outline" size="lg" class="h-auto p-4 flex flex-col items-center space-y-2" as-child>
              <NuxtLink to="/staff/billing">
                <Icon name="lucide:receipt" class="w-6 h-6 text-purple-600" />
                <span class="text-sm font-medium">Billing</span>
              </NuxtLink>
            </Button>
            
            <Button variant="outline" size="lg" class="h-auto p-4 flex flex-col items-center space-y-2" as-child>
              <NuxtLink to="/staff/reports">
                <Icon name="lucide:bar-chart" class="w-6 h-6 text-orange-600" />
                <span class="text-sm font-medium">Reports</span>
              </NuxtLink>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>