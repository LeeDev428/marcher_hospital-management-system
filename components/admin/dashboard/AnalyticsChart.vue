<script setup lang="ts">
// Mock analytics data
const analyticsData = ref({
  daily: [
    { date: '2024-01-08', users: 120, appointments: 45, revenue: 15600 },
    { date: '2024-01-09', users: 135, appointments: 52, revenue: 18200 },
    { date: '2024-01-10', users: 142, appointments: 48, revenue: 16800 },
    { date: '2024-01-11', users: 156, appointments: 61, revenue: 21400 },
    { date: '2024-01-12', users: 178, appointments: 67, revenue: 24300 },
    { date: '2024-01-13', users: 164, appointments: 58, revenue: 19900 },
    { date: '2024-01-14', users: 189, appointments: 73, revenue: 26700 }
  ]
})

const selectedMetric = ref('users')
const timeRange = ref('7d')

const metricOptions = [
  { value: 'users', label: 'Active Users', color: 'text-blue-600' },
  { value: 'appointments', label: 'Appointments', color: 'text-green-600' },
  { value: 'revenue', label: 'Revenue ($)', color: 'text-purple-600' }
]

const timeRangeOptions = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' }
]

const getMaxValue = computed(() => {
  const values = analyticsData.value.daily.map(item => item[selectedMetric.value])
  return Math.max(...values)
})

const getCurrentMetricColor = computed(() => {
  return metricOptions.find(option => option.value === selectedMetric.value)?.color || 'text-blue-600'
})

const formatValue = (value: number) => {
  if (selectedMetric.value === 'revenue') {
    return `$${value.toLocaleString()}`
  }
  return value.toString()
}

const getBarHeight = (value: number) => {
  return `${(value / getMaxValue.value) * 100}%`
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
      <h3 class="text-lg font-semibold text-gray-900">Analytics Overview</h3>
      
      <div class="flex items-center space-x-4">
        <!-- Metric Selector -->
        <Select v-model="selectedMetric">
          <SelectTrigger class="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem 
              v-for="option in metricOptions" 
              :key="option.value" 
              :value="option.value"
            >
              <span :class="option.color">{{ option.label }}</span>
            </SelectItem>
          </SelectContent>
        </Select>
        
        <!-- Time Range Selector -->
        <Select v-model="timeRange">
          <SelectTrigger class="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem 
              v-for="option in timeRangeOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="relative">
      <!-- Chart Area -->
      <div class="flex items-end justify-between h-64 mb-4 bg-gray-50 rounded-lg p-4">
        <div 
          v-for="(dataPoint, index) in analyticsData.daily" 
          :key="dataPoint.date"
          class="flex flex-col items-center space-y-2 flex-1"
        >
          <!-- Value Label -->
          <div class="text-xs font-medium text-gray-600 mb-1">
            {{ formatValue(dataPoint[selectedMetric]) }}
          </div>
          
          <!-- Bar -->
          <div class="relative w-full max-w-8 flex items-end">
            <div 
              :class="[getCurrentMetricColor, 'w-full bg-current rounded-t-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer']"
              :style="`height: ${getBarHeight(dataPoint[selectedMetric])}`"
              :title="`${formatDate(dataPoint.date)}: ${formatValue(dataPoint[selectedMetric])}`"
            ></div>
          </div>
          
          <!-- Date Label -->
          <div class="text-xs text-gray-500 text-center">
            {{ formatDate(dataPoint.date) }}
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">
            {{ analyticsData.daily.reduce((sum, item) => sum + item.users, 0).toLocaleString() }}
          </div>
          <div class="text-sm text-gray-600">Total Users (7 days)</div>
        </div>
        
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">
            {{ analyticsData.daily.reduce((sum, item) => sum + item.appointments, 0) }}
          </div>
          <div class="text-sm text-gray-600">Total Appointments</div>
        </div>
        
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">
            ${{ analyticsData.daily.reduce((sum, item) => sum + item.revenue, 0).toLocaleString() }}
          </div>
          <div class="text-sm text-gray-600">Total Revenue</div>
        </div>
      </div>
    </div>

    <!-- Additional Controls -->
    <div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
      <div class="flex items-center space-x-2">
        <Icon name="lucide:trending-up" class="w-4 h-4 text-green-600" />
        <span class="text-sm text-gray-600">Showing positive growth trend</span>
      </div>
      
      <Button variant="outline" size="sm" @click="navigateTo('/admin/analytics')">
        View Detailed Analytics
        <Icon name="lucide:bar-chart-3" class="w-4 h-4 ml-2" />
      </Button>
    </div>
  </div>
</template>