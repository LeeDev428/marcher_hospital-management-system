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

// Comprehensive admin stats - same layout but enhanced data
const dashboardStats = ref([
  {
    id: 1,
    label: "Total System Users",
    value: "1,247",
    change: "+18%",
    changeType: "increase",
    icon: "lucide:users",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    id: 2,
    label: "Active Staff Members", 
    value: "89",
    change: "+5%",
    changeType: "increase",
    icon: "lucide:user-check",
    iconBg: "bg-green-100", 
    iconColor: "text-green-600"
  },
  {
    id: 3,
    label: "System Revenue",
    value: "$156,789",
    change: "+24%", 
    changeType: "increase",
    icon: "lucide:trending-up",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600"
  },
  {
    id: 4,
    label: "System Health",
    value: "99.2%",
    change: "+0.3%",
    changeType: "increase", 
    icon: "lucide:activity",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600"
  }
])

const systemActivities = ref([
  { id: 1, user: "Dr. Sarah Johnson", action: "User account created", time: "2 mins ago", avatar: "SJ", type: "user" },
  { id: 2, user: "System Backup", action: "Database backup completed", time: "15 mins ago", avatar: "SB", type: "system" },
  { id: 3, user: "Security Monitor", action: "Failed login attempt blocked", time: "32 mins ago", avatar: "SM", type: "security" },
  { id: 4, user: "Admin Panel", action: "System settings updated", time: "1 hour ago", avatar: "AP", type: "config" },
  { id: 5, user: "Data Analytics", action: "Weekly report generated", time: "2 hours ago", avatar: "DA", type: "report" }
])

const systemMetrics = ref([
  { day: 'Mon', users: 180, sessions: 245, revenue: 18500 },
  { day: 'Tue', users: 220, sessions: 290, revenue: 22300 },
  { day: 'Wed', users: 195, sessions: 270, revenue: 19800 },
  { day: 'Thu', users: 240, sessions: 315, revenue: 26200 },
  { day: 'Fri', users: 210, sessions: 285, revenue: 23100 },
  { day: 'Sat', users: 160, sessions: 195, revenue: 16800 },
  { day: 'Sun', users: 140, sessions: 175, revenue: 14200 }
])

const getMaxValue = computed(() => {
  return Math.max(...systemMetrics.value.map(d => Math.max(d.users, d.sessions, d.revenue / 100)))
})

const getActivityTypeColor = (type: string) => {
  switch (type) {
    case 'user': return 'bg-blue-100 text-blue-700'
    case 'system': return 'bg-green-100 text-green-700'
    case 'security': return 'bg-red-100 text-red-700'
    case 'config': return 'bg-purple-100 text-purple-700'
    case 'report': return 'bg-orange-100 text-orange-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Admin Welcome Header with Professional Gradient -->
    <div class="bg-gradient-to-r from-slate-800 via-purple-800 to-slate-900 rounded-xl p-6 text-white">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold mb-2">System Administration, {{ authStore.fullName || 'Administrator' }}! 🚀</h1>
          <p class="text-purple-200 mb-4">Complete system oversight and administrative control center</p>
          <div class="flex items-center text-purple-200">
            <Icon name="lucide:calendar" class="w-4 h-4 mr-2" />
            <span class="mr-4">Sunday, October 5, 2025</span>
            <Icon name="lucide:clock" class="w-4 h-4 mr-2" />
            <span>03:24 AM</span>
          </div>
        </div>
        <div class="flex space-x-3">
          <Button class="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Icon name="lucide:users" class="w-4 h-4 mr-2" />
            Manage Users
          </Button>
          <Button class="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Icon name="lucide:settings" class="w-4 h-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>
    </div>

    <!-- Enhanced Admin Stats Cards - Same Layout -->
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

    <!-- Main Content Grid - Same Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- System Analytics Chart - 3/4 width -->
      <div class="lg:col-span-3 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">System Analytics</h3>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span class="text-sm text-gray-600">Users</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-600">Sessions</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span class="text-sm text-gray-600">Revenue</span>
            </div>
          </div>
        </div>
        
        <!-- Enhanced Chart Visualization -->
        <div class="h-64 flex items-end space-x-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
          <div 
            v-for="data in systemMetrics" 
            :key="data.day"
            class="flex-1 flex flex-col items-center space-y-2"
          >
            <!-- Bars -->
            <div class="flex items-end space-x-1 w-full justify-center h-40">
              <!-- Users Bar -->
              <div 
                class="bg-blue-500 rounded-t-sm w-2"
                :style="`height: ${(data.users / getMaxValue) * 100}%`"
              ></div>
              <!-- Sessions Bar -->
              <div 
                class="bg-green-500 rounded-t-sm w-2"
                :style="`height: ${(data.sessions / getMaxValue) * 100}%`"
              ></div>
              <!-- Revenue Bar (scaled down) -->
              <div 
                class="bg-purple-500 rounded-t-sm w-2"
                :style="`height: ${((data.revenue / 100) / getMaxValue) * 100}%`"
              ></div>
            </div>
            <!-- Day Label -->
            <span class="text-xs text-gray-600">{{ data.day }}</span>
          </div>
        </div>

        <!-- Enhanced Chart Summary -->
        <div class="mt-6 grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">1,345</div>
            <div class="text-sm text-gray-600">Total Users</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">1,875</div>
            <div class="text-sm text-gray-600">Total Sessions</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">$141K</div>
            <div class="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-emerald-600">94%</div>
            <div class="text-sm text-gray-600">System Uptime</div>
          </div>
        </div>
      </div>

      <!-- System Activity Sidebar - 1/4 width -->
      <div class="lg:col-span-1 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">System Activity</h3>
        <div class="space-y-4">
          <div 
            v-for="activity in systemActivities" 
            :key="activity.id"
            class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <!-- Enhanced Avatar with Type Color -->
            <div :class="[getActivityTypeColor(activity.type), 'w-8 h-8 rounded-full flex items-center justify-center']">
              <span class="text-xs font-bold">{{ activity.avatar }}</span>
            </div>
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 mb-1">{{ activity.user }}</p>
              <p class="text-sm text-gray-600 mb-1">{{ activity.action }}</p>
              <p class="text-xs text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
        
        <!-- Enhanced Admin Controls -->
        <div class="mt-4 pt-4 border-t border-gray-100 space-y-2">
          <Button variant="outline" size="sm" class="w-full justify-start">
            <Icon name="lucide:shield-check" class="w-4 h-4 mr-2" />
            Security Logs
          </Button>
          <Button variant="outline" size="sm" class="w-full justify-start">
            <Icon name="lucide:database" class="w-4 h-4 mr-2" />
            Database Status
          </Button>
          <Button variant="outline" size="sm" class="w-full justify-start">
            <Icon name="lucide:server" class="w-4 h-4 mr-2" />
            Server Monitoring
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>