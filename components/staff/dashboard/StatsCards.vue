<script setup lang="ts">
// Mock data for dashboard stats
const stats = ref([
  {
    title: "Today's Patients",
    value: "2,318",
    change: "+12%",
    changeType: "positive",
    icon: "lucide:users",
    color: "bg-blue-500"
  },
  {
    title: "Appointments",
    value: "1,546",
    change: "+8%", 
    changeType: "positive",
    icon: "lucide:calendar",
    color: "bg-green-500"
  },
  {
    title: "Revenue",
    value: "$12,489",
    change: "+15%",
    changeType: "positive", 
    icon: "lucide:dollar-sign",
    color: "bg-orange-500"
  },
  {
    title: "Pending Bills",
    value: "342",
    change: "-3%",
    changeType: "negative",
    icon: "lucide:file-text",
    color: "bg-purple-500"
  }
])
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div 
      v-for="stat in stats" 
      :key="stat.title"
      class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 mb-1">{{ stat.title }}</p>
          <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
          <div class="flex items-center mt-2">
            <span 
              :class="[
                'text-sm font-medium',
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              ]"
            >
              {{ stat.change }}
            </span>
            <span class="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>
        <div :class="[stat.color, 'w-12 h-12 rounded-lg flex items-center justify-center']">
          <Icon :name="stat.icon" class="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  </div>
</template>