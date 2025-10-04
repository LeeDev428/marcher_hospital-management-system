<script setup lang="ts">
// Mock comprehensive admin statistics
const adminStats = ref([
  {
    title: "Total Users",
    value: "15,847",
    change: "+12.3%",
    changeType: "positive",
    icon: "lucide:users",
    color: "bg-blue-600",
    description: "Active system users"
  },
  {
    title: "Active Staff",
    value: "1,243", 
    change: "+5.7%",
    changeType: "positive",
    icon: "lucide:user-check",
    color: "bg-green-600",
    description: "Healthcare professionals"
  },
  {
    title: "System Revenue",
    value: "$847,592",
    change: "+18.2%",
    changeType: "positive",
    icon: "lucide:trending-up",
    color: "bg-emerald-600",
    description: "Monthly revenue"
  },
  {
    title: "Active Sessions",
    value: "2,891",
    change: "+7.9%",
    changeType: "positive",
    icon: "lucide:activity",
    color: "bg-orange-600",
    description: "Current user sessions"
  },
  {
    title: "System Health",
    value: "99.8%",
    change: "+0.2%",
    changeType: "positive",
    icon: "lucide:shield-check",
    color: "bg-purple-600",
    description: "Server uptime"
  },
  {
    title: "Data Storage",
    value: "67.2TB",
    change: "+4.1%",
    changeType: "positive",
    icon: "lucide:database",
    color: "bg-indigo-600",
    description: "Total data stored"
  }
])
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    <div 
      v-for="stat in adminStats" 
      :key="stat.title"
      class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-gray-300"
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-semibold text-gray-600 uppercase tracking-wider">{{ stat.title }}</p>
            <div :class="[stat.color, 'w-10 h-10 rounded-lg flex items-center justify-center']">
              <Icon :name="stat.icon" class="w-5 h-5 text-white" />
            </div>
          </div>
          
          <p class="text-3xl font-bold text-gray-900 mb-2">{{ stat.value }}</p>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <span 
                :class="[
                  'text-sm font-semibold',
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                ]"
              >
                {{ stat.change }}
              </span>
              <span class="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>
          
          <p class="text-xs text-gray-500 mt-2">{{ stat.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>