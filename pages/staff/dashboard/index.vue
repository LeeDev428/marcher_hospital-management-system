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

// Exact reference design data
const dashboardStats = ref([
  {
    id: 1,
    label: "Today's Patients",
    value: "2,318",
    change: "+12%",
    changeType: "increase",
    icon: "lucide:users",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    id: 2,
    label: "Appointments", 
    value: "1,546",
    change: "+8%",
    changeType: "increase",
    icon: "lucide:calendar",
    iconBg: "bg-green-100", 
    iconColor: "text-green-600"
  },
  {
    id: 3,
    label: "Revenue",
    value: "$12,489",
    change: "+15%", 
    changeType: "increase",
    icon: "lucide:trending-up",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600"
  },
  {
    id: 4,
    label: "Pending Bills",
    value: "342",
    change: "-3%",
    changeType: "decrease", 
    icon: "lucide:file-text",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600"
  }
])

const recentActivities = ref([
  { id: 1, user: "Dr. Sarah Johnson", action: "Updated patient records", time: "2 mins ago", avatar: "SJ" },
  { id: 2, user: "Nurse Mike Chen", action: "Scheduled appointment", time: "5 mins ago", avatar: "MC" },
  { id: 3, user: "Dr. Lisa Wong", action: "Completed consultation", time: "12 mins ago", avatar: "LW" },
  { id: 4, user: "Admin Staff", action: "Generated monthly report", time: "18 mins ago", avatar: "AS" },
  { id: 5, user: "Dr. James Miller", action: "Prescribed medication", time: "25 mins ago", avatar: "JM" }
])

const chartData = ref([
  { day: 'Mon', patients: 120, appointments: 85 },
  { day: 'Tue', patients: 140, appointments: 95 },
  { day: 'Wed', patients: 160, appointments: 110 },
  { day: 'Thu', patients: 180, appointments: 125 },
  { day: 'Fri', patients: 150, appointments: 100 },
  { day: 'Sat', patients: 90, appointments: 60 },
  { day: 'Sun', patients: 70, appointments: 45 }
])

const getMaxValue = computed(() => {
  return Math.max(...chartData.value.map(d => Math.max(d.patients, d.appointments)))
})
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome Header with Gradient -->
    <div class="bg-gradient-to-r from-cyan-400 to-blue-600 rounded-xl p-6 text-white">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold mb-2">Hello, {{ user?.name || 'Lee' }}! 👋</h1>
          <p class="text-cyan-100 mb-4">Ready to make a difference in healthcare today?</p>
          <div class="flex items-center text-cyan-100">
            <Icon name="lucide:calendar" class="w-4 h-4 mr-2" />
            <span class="mr-4">Sunday, October 5, 2025</span>
            <Icon name="lucide:clock" class="w-4 h-4 mr-2" />
            <span>03:24 AM</span>
          </div>
        </div>
        <div class="flex space-x-3">
          <Button class="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Icon name="lucide:calendar-plus" class="w-4 h-4 mr-2" />
            New Appointment
          </Button>
          <Button class="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Icon name="lucide:user-plus" class="w-4 h-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>
    </div>

    <!-- Stats Cards - Exact Reference Design -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="stat in dashboardStats" 
        :key="stat.id"
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 mb-1">{{ stat.label }}</p>
            <p class="text-3xl font-bold text-gray-900 mb-2">{{ stat.value }}</p>
            <div class="flex items-center">
              <Icon 
                :name="stat.changeType === 'increase' ? 'lucide:trending-up' : 'lucide:trending-down'"
                :class="stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
                class="w-4 h-4 mr-1"
              />
              <span 
                :class="stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
                class="text-sm font-medium"
              >
                {{ stat.change }}
              </span>
              <span class="text-xs text-gray-500 ml-1">from last month</span>
            </div>
          </div>
          <div :class="[stat.iconBg, 'w-12 h-12 rounded-lg flex items-center justify-center']">
            <Icon :name="stat.icon" :class="stat.iconColor" class="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Activity Chart - 3/4 width -->
      <div class="lg:col-span-3 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Activity</h3>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span class="text-sm text-gray-600">Patients</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-600">Appointments</span>
            </div>
          </div>
        </div>
        
        <!-- Simple Chart Visualization -->
        <div class="h-64 flex items-end space-x-4 bg-gray-50 rounded-lg p-4">
          <div 
            v-for="data in chartData" 
            :key="data.day"
            class="flex-1 flex flex-col items-center space-y-2"
          >
            <!-- Bars -->
            <div class="flex items-end space-x-1 w-full justify-center h-40">
              <!-- Patients Bar -->
              <div 
                class="bg-blue-500 rounded-t-sm w-3"
                :style="`height: ${(data.patients / getMaxValue) * 100}%`"
              ></div>
              <!-- Appointments Bar -->
              <div 
                class="bg-green-500 rounded-t-sm w-3"
                :style="`height: ${(data.appointments / getMaxValue) * 100}%`"
              ></div>
            </div>
            <!-- Day Label -->
            <span class="text-xs text-gray-600">{{ data.day }}</span>
          </div>
        </div>

        <!-- Chart Summary -->
        <div class="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">1,010</div>
            <div class="text-sm text-gray-600">Total Patients</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">620</div>
            <div class="text-sm text-gray-600">Total Appointments</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-600">85%</div>
            <div class="text-sm text-gray-600">Completion Rate</div>
          </div>
        </div>
      </div>

      <!-- Recent Activity Sidebar - 1/4 width -->
      <div class="lg:col-span-1 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div class="space-y-4">
          <div 
            v-for="activity in recentActivities" 
            :key="activity.id"
            class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <!-- Avatar -->
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-xs font-medium text-blue-700">{{ activity.avatar }}</span>
            </div>
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 mb-1">{{ activity.user }}</p>
              <p class="text-sm text-gray-600 mb-1">{{ activity.action }}</p>
              <p class="text-xs text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
        
        <!-- View All Button -->
        <div class="mt-4 pt-4 border-t border-gray-100">
          <Button variant="outline" size="sm" class="w-full">
            <Icon name="lucide:external-link" class="w-4 h-4 mr-2" />
            View All Activities
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
