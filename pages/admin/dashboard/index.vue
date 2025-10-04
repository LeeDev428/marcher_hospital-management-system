<script setup lang="ts">
import { useAuthStore } from "@/stores/app"

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Page metadata
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

// Set page title
useHead({
  title: 'Admin Dashboard - Marcher Hospital Management System'
})

// Mock comprehensive admin data
const systemStats = ref({
  totalUsers: { count: 1247, change: 12, changeType: 'increase' },
  activeStaff: { count: 89, change: 5, changeType: 'increase' },
  systemRevenue: { count: 156789, change: 18, changeType: 'increase' },
  systemHealth: { count: 99.2, change: 0.1, changeType: 'increase' }
})

const recentSystemEvents = ref([
  { id: 1, action: "New user registration", user: "Dr. Sarah Wilson", time: "2 mins ago", type: "user", severity: "info" },
  { id: 2, action: "System backup completed", user: "System", time: "15 mins ago", type: "system", severity: "success" },
  { id: 3, action: "Failed login attempt", user: "Unknown IP", time: "1 hour ago", type: "security", severity: "warning" },
  { id: 4, action: "Database maintenance", user: "Admin", time: "2 hours ago", type: "maintenance", severity: "info" }
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

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'success': return 'bg-green-100 text-green-800'
    case 'warning': return 'bg-yellow-100 text-yellow-800'
    case 'error': return 'bg-red-100 text-red-800'
    default: return 'bg-blue-100 text-blue-800'
  }
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Admin Welcome Header with Professional Gradient -->
    <div class="bg-gradient-to-r from-slate-800 via-purple-800 to-slate-900 text-white p-6 rounded-lg mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">Good morning, {{ user?.name || 'Administrator' }}! 🚀</h1>
          <p class="text-purple-200 mt-1">System overview and administrative controls at your fingertips</p>
          <div class="flex items-center mt-3 text-purple-200">
            <Icon name="lucide:calendar" class="w-4 h-4 mr-2" />
            <span class="mr-4">{{ currentDate }}</span>
            <Icon name="lucide:clock" class="w-4 h-4 mr-2" />
            <span>{{ currentTime }}</span>
          </div>
        </div>
        <div class="flex space-x-3">
          <Button variant="secondary" class="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Icon name="lucide:users" class="w-4 h-4 mr-2" />
            Manage Users
          </Button>
          <Button variant="secondary" class="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Icon name="lucide:settings" class="w-4 h-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>
    </div>

    <!-- Comprehensive Admin Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Total Users -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Users</p>
            <p class="text-3xl font-bold text-gray-900">{{ systemStats.totalUsers.count.toLocaleString() }}</p>
            <div class="flex items-center mt-2">
              <Icon 
                :name="systemStats.totalUsers.changeType === 'increase' ? 'lucide:trending-up' : 'lucide:trending-down'" 
                :class="systemStats.totalUsers.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
                class="w-4 h-4 mr-1" 
              />
              <span 
                :class="systemStats.totalUsers.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
                class="text-sm font-medium"
              >
                +{{ systemStats.totalUsers.change }}% from last month
              </span>
            </div>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon name="lucide:users" class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <!-- Active Staff -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Active Staff</p>
            <p class="text-3xl font-bold text-gray-900">{{ systemStats.activeStaff.count }}</p>
            <div class="flex items-center mt-2">
              <Icon 
                :name="systemStats.activeStaff.changeType === 'increase' ? 'lucide:trending-up' : 'lucide:trending-down'" 
                :class="systemStats.activeStaff.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
                class="w-4 h-4 mr-1" 
              />
              <span 
                :class="systemStats.activeStaff.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
                class="text-sm font-medium"
              >
                +{{ systemStats.activeStaff.change }}% from last month
              </span>
            </div>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Icon name="lucide:user-check" class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <!-- System Revenue -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">System Revenue</p>
            <p class="text-3xl font-bold text-gray-900">${{ systemStats.systemRevenue.count.toLocaleString() }}</p>
            <div class="flex items-center mt-2">
              <Icon 
                :name="systemStats.systemRevenue.changeType === 'increase' ? 'lucide:trending-up' : 'lucide:trending-down'" 
                :class="systemStats.systemRevenue.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
                class="w-4 h-4 mr-1" 
              />
              <span 
                :class="systemStats.systemRevenue.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
                class="text-sm font-medium"
              >
                +{{ systemStats.systemRevenue.change }}% last month
              </span>
            </div>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Icon name="lucide:trending-up" class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <!-- System Health -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">System Health</p>
            <p class="text-3xl font-bold text-gray-900">{{ systemStats.systemHealth.count }}%</p>
            <div class="flex items-center mt-2">
              <Icon 
                name="lucide:check-circle" 
                class="text-green-600 w-4 h-4 mr-1" 
              />
              <span class="text-green-600 text-sm font-medium">
                Excellent Performance
              </span>
            </div>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Icon name="lucide:activity" class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - System Analytics Chart (2/3 width) -->
      <div class="lg:col-span-2">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">System Analytics</h3>
            <div class="flex space-x-2">
              <Button variant="outline" size="sm">Users</Button>
              <Button variant="outline" size="sm">Revenue</Button>
              <Button variant="outline" size="sm">Performance</Button>
            </div>
          </div>
          <!-- Professional admin chart representation -->
          <div class="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-end justify-center p-4">
            <div class="text-gray-600 text-center">
              <Icon name="lucide:bar-chart-3" class="w-12 h-12 mx-auto mb-2" />
              <p class="font-semibold">Advanced Analytics Dashboard</p>
              <p class="text-sm">Real-time system metrics and performance indicators</p>
            </div>
          </div>
          
          <!-- Mini metrics bar -->
          <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">94%</div>
              <div class="text-sm text-gray-600">CPU Efficiency</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">67%</div>
              <div class="text-sm text-gray-600">Memory Usage</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-600">23ms</div>
              <div class="text-sm text-gray-600">Response Time</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - System Events & Monitoring -->
      <div class="lg:col-span-1">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">System Events</h3>
            <Button variant="ghost" size="sm">
              <Icon name="lucide:external-link" class="w-4 h-4" />
            </Button>
          </div>
          <div class="space-y-4">
            <div 
              v-for="event in recentSystemEvents" 
              :key="event.id"
              class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Icon name="lucide:shield-check" class="w-4 h-4 text-gray-600" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm font-medium text-gray-900">{{ event.action }}</p>
                  <span :class="getSeverityColor(event.severity)" class="text-xs px-2 py-1 rounded-full font-medium">
                    {{ event.severity }}
                  </span>
                </div>
                <p class="text-sm text-gray-600">{{ event.user }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ event.time }}</p>
              </div>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="mt-6 pt-4 border-t border-gray-100 space-y-2">
            <Button variant="outline" size="sm" class="w-full justify-start">
              <Icon name="lucide:database" class="w-4 h-4 mr-2" />
              Database Status
            </Button>
            <Button variant="outline" size="sm" class="w-full justify-start">
              <Icon name="lucide:server" class="w-4 h-4 mr-2" />
              Server Monitoring
            </Button>
            <Button variant="outline" size="sm" class="w-full justify-start">
              <Icon name="lucide:shield" class="w-4 h-4 mr-2" />
              Security Logs
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>