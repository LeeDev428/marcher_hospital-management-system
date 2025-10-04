<script setup lang="ts">
// Mock system metrics and analytics data
const systemMetrics = ref({
  cpu: { value: 23, label: "CPU Usage", color: "text-blue-600" },
  memory: { value: 67, label: "Memory Usage", color: "text-green-600" },
  storage: { value: 45, label: "Storage Used", color: "text-yellow-600" },
  network: { value: 89, label: "Network Load", color: "text-purple-600" }
})

const recentActivities = ref([
  {
    id: 1,
    action: "New user registration",
    user: "Dr. Sarah Wilson",
    timestamp: "2 minutes ago",
    type: "user",
    severity: "info"
  },
  {
    id: 2,
    action: "System backup completed",
    user: "System",
    timestamp: "15 minutes ago", 
    type: "system",
    severity: "success"
  },
  {
    id: 3,
    action: "Failed login attempt",
    user: "Unknown IP: 192.168.1.100",
    timestamp: "1 hour ago",
    type: "security",
    severity: "warning"
  },
  {
    id: 4,
    action: "Database maintenance",
    user: "Admin",
    timestamp: "2 hours ago",
    type: "maintenance", 
    severity: "info"
  }
])

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'success':
      return 'text-green-600 bg-green-50'
    case 'warning':
      return 'text-yellow-600 bg-yellow-50'
    case 'error':
      return 'text-red-600 bg-red-50'
    default:
      return 'text-blue-600 bg-blue-50'
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'user':
      return 'lucide:user-plus'
    case 'system':
      return 'lucide:server'
    case 'security':
      return 'lucide:shield-alert'
    case 'maintenance':
      return 'lucide:wrench'
    default:
      return 'lucide:activity'
  }
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <!-- System Performance Metrics -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">System Performance</h3>
      
      <div class="space-y-6">
        <div 
          v-for="metric in systemMetrics" 
          :key="metric.label"
          class="flex items-center justify-between"
        >
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 rounded-full bg-current opacity-20"></div>
            <span class="text-sm font-medium text-gray-700">{{ metric.label }}</span>
          </div>
          
          <div class="flex items-center space-x-3">
            <div class="w-32 bg-gray-200 rounded-full h-2">
              <div 
                :class="[metric.color, 'h-2 rounded-full bg-current']"
                :style="`width: ${metric.value}%`"
              ></div>
            </div>
            <span :class="[metric.color, 'text-sm font-semibold min-w-[3rem] text-right']">
              {{ metric.value }}%
            </span>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-6 border-t border-gray-100">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">Overall System Health</span>
          <div class="flex items-center space-x-2">
            <Icon name="lucide:check-circle" class="w-4 h-4 text-green-600" />
            <span class="text-sm font-semibold text-green-600">Excellent</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent System Activities -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">System Activities</h3>
        <Button variant="ghost" size="sm" @click="navigateTo('/admin/logs')">
          View All
          <Icon name="lucide:arrow-right" class="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div class="space-y-4">
        <div 
          v-for="activity in recentActivities" 
          :key="activity.id"
          class="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div :class="[getSeverityColor(activity.severity), 'w-8 h-8 rounded-full flex items-center justify-center']">
            <Icon :name="getTypeIcon(activity.type)" class="w-4 h-4" />
          </div>
          
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ activity.action }}</p>
            <p class="text-sm text-gray-600">{{ activity.user }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ activity.timestamp }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>