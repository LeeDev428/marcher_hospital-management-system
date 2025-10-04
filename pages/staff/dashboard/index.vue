<script setup lang="ts">
import { useAuthStore } from "@/stores/app"

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Page metadata
definePageMeta({
  layout: 'staff',
  middleware: 'auth'
})

// Set page title
useHead({
  title: 'Staff Dashboard - Marcher Hospital Management System'
})

// Mock data matching the reference design
const todaysStats = ref({
  patients: { count: 2318, change: 12, changeType: 'increase' },
  appointments: { count: 1546, change: 8, changeType: 'increase' },
  revenue: { count: 12489, change: 15, changeType: 'increase' },
  pendingBills: { count: 342, change: 3, changeType: 'decrease' }
})

const recentActivities = ref([
  { id: 1, action: "New patient registration", user: "John Doe", time: "2 mins ago", type: "patient" },
  { id: 2, action: "Appointment scheduled", user: "Dr. Smith", time: "5 mins ago", type: "appointment" },
  { id: 3, action: "Payment received", user: "Jane Wilson", time: "10 mins ago", type: "payment" },
  { id: 4, action: "Medical record updated", user: "Dr. Brown", time: "15 mins ago", type: "record" }
])

const currentTime = ref(new Date().toLocaleTimeString('en-US', { 
  hour: '2-digit', 
  minute: '2-digit',
  hour12: true 
}))

const currentDate = ref(new Date().toLocaleDateString('en-US', { 
  weekday: 'long',
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
}))

// Update time every minute
onMounted(() => {
  setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }, 60000)
})
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Welcome Header with Gradient Background -->
    <div class="bg-gradient-to-r from-cyan-400 to-blue-600 text-white p-6 rounded-lg mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">Good morning, {{ user?.name || 'Lee' }}! 👋</h1>
          <p class="text-cyan-100 mt-1">Ready to make a difference in healthcare today?</p>
          <div class="flex items-center mt-3 text-cyan-100">
            <Icon name="lucide:calendar" class="w-4 h-4 mr-2" />
            <span class="mr-4">{{ currentDate }}</span>
            <Icon name="lucide:clock" class="w-4 h-4 mr-2" />
            <span>{{ currentTime }}</span>
          </div>
        </div>
        <div class="flex space-x-3">
          <Button variant="secondary" class="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Icon name="lucide:calendar-plus" class="w-4 h-4 mr-2" />
            New Appointment
          </Button>
          <Button variant="secondary" class="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Icon name="lucide:user-plus" class="w-4 h-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Today's Patients -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Today's Patients</p>
            <p class="text-3xl font-bold text-gray-900">{{ todaysStats.patients.count.toLocaleString() }}</p>
            <div class="flex items-center mt-2">
              <Icon 
                :name="todaysStats.patients.changeType === 'increase' ? 'lucide:trending-up' : 'lucide:trending-down'" 
                :class="todaysStats.patients.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
                class="w-4 h-4 mr-1" 
              />
              <span 
                :class="todaysStats.patients.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
                class="text-sm font-medium"
              >
                +{{ todaysStats.patients.change }}% from last month
              </span>
            </div>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon name="lucide:users" class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <!-- Appointments -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Appointments</p>
            <p class="text-3xl font-bold text-gray-900">{{ todaysStats.appointments.count.toLocaleString() }}</p>
            <div class="flex items-center mt-2">
              <Icon 
                :name="todaysStats.appointments.changeType === 'increase' ? 'lucide:trending-up' : 'lucide:trending-down'" 
                :class="todaysStats.appointments.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
                class="w-4 h-4 mr-1" 
              />
              <span 
                :class="todaysStats.appointments.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
                class="text-sm font-medium"
              >
                +{{ todaysStats.appointments.change }}% from last month
              </span>
            </div>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Icon name="lucide:calendar" class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <!-- Revenue -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Revenue</p>
            <p class="text-3xl font-bold text-gray-900">${{ todaysStats.revenue.count.toLocaleString() }}</p>
            <div class="flex items-center mt-2">
              <Icon 
                :name="todaysStats.revenue.changeType === 'increase' ? 'lucide:trending-up' : 'lucide:trending-down'" 
                :class="todaysStats.revenue.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
                class="w-4 h-4 mr-1" 
              />
              <span 
                :class="todaysStats.revenue.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
                class="text-sm font-medium"
              >
                +{{ todaysStats.revenue.change }}% last month
              </span>
            </div>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Icon name="lucide:dollar-sign" class="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      <!-- Pending Bills -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Pending Bills</p>
            <p class="text-3xl font-bold text-gray-900">{{ todaysStats.pendingBills.count }}</p>
            <div class="flex items-center mt-2">
              <Icon 
                :name="todaysStats.pendingBills.changeType === 'increase' ? 'lucide:trending-up' : 'lucide:trending-down'" 
                :class="todaysStats.pendingBills.changeType === 'increase' ? 'text-red-600' : 'text-green-600'"
                class="w-4 h-4 mr-1" 
              />
              <span 
                :class="todaysStats.pendingBills.changeType === 'increase' ? 'text-red-600' : 'text-green-600'"
                class="text-sm font-medium"
              >
                -{{ todaysStats.pendingBills.change }}% from last month
              </span>
            </div>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Icon name="lucide:file-text" class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Chart (2/3 width) -->
      <div class="lg:col-span-2">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Activity</h3>
          <!-- Simple line chart representation -->
          <div class="h-64 bg-gray-50 rounded-lg flex items-end justify-center p-4">
            <div class="text-gray-500 text-center">
              <Icon name="lucide:trending-up" class="w-12 h-12 mx-auto mb-2" />
              <p>Activity Chart</p>
              <p class="text-sm">Interactive chart will be displayed here</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Recent Activities -->
      <div class="lg:col-span-1">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div class="space-y-4">
            <div 
              v-for="activity in recentActivities" 
              :key="activity.id"
              class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Icon name="lucide:activity" class="w-4 h-4 text-blue-600" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ activity.action }}</p>
                <p class="text-sm text-gray-600">{{ activity.user }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
