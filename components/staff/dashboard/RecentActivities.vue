<script setup lang="ts">
// Mock recent activities data
const recentActivities = ref([
  {
    id: 1,
    patient: "John Doe",
    action: "Appointment Completed",
    doctor: "Dr. Sarah Wilson",
    time: "2 minutes ago",
    status: "completed",
    amount: "$150"
  },
  {
    id: 2,
    patient: "Maria Garcia", 
    action: "New Registration",
    doctor: "Dr. Michael Chen",
    time: "15 minutes ago",
    status: "pending",
    amount: "$0"
  },
  {
    id: 3,
    patient: "Robert Johnson",
    action: "Payment Received",
    doctor: "Dr. Emily Davis",
    time: "1 hour ago", 
    status: "completed",
    amount: "$320"
  },
  {
    id: 4,
    patient: "Lisa Anderson",
    action: "Lab Results Ready",
    doctor: "Dr. James Miller",
    time: "2 hours ago",
    status: "ready",
    amount: "$85"
  },
  {
    id: 5,
    patient: "David Wilson",
    action: "Appointment Scheduled",
    doctor: "Dr. Sarah Wilson", 
    time: "3 hours ago",
    status: "scheduled",
    amount: "$200"
  }
])

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'ready':
      return 'bg-blue-100 text-blue-800'
    case 'scheduled':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getActionIcon = (action: string) => {
  if (action.includes('Appointment')) return 'lucide:calendar'
  if (action.includes('Payment')) return 'lucide:dollar-sign'
  if (action.includes('Registration')) return 'lucide:user-plus'
  if (action.includes('Lab')) return 'lucide:flask'
  return 'lucide:activity'
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100">
    <div class="p-6 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Recent Activities</h3>
        <Button variant="ghost" size="sm" @click="navigateTo('/staff/reports')">
          View All
          <Icon name="lucide:arrow-right" class="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>

    <div class="divide-y divide-gray-100">
      <div 
        v-for="activity in recentActivities" 
        :key="activity.id"
        class="p-4 hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Icon :name="getActionIcon(activity.action)" class="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ activity.patient }}</p>
              <p class="text-sm text-gray-600">{{ activity.action }}</p>
              <p class="text-xs text-gray-500">with {{ activity.doctor }}</p>
            </div>
          </div>
          
          <div class="text-right">
            <div class="flex items-center justify-end space-x-3 mb-1">
              <span class="font-semibold text-gray-900">{{ activity.amount }}</span>
              <span 
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getStatusColor(activity.status)
                ]"
              >
                {{ activity.status }}
              </span>
            </div>
            <p class="text-xs text-gray-500">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>