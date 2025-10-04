<script setup lang="ts">
// Mock chart data - in real app this would come from API
const chartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Patients',
      data: [65, 59, 80, 81, 56, 90],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    },
    {
      label: 'Revenue',
      data: [28, 48, 40, 19, 86, 70],
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
})
</script>

<template>
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Analytics Overview</h3>
      <div class="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Icon name="lucide:download" class="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm">
          <Icon name="lucide:calendar" class="w-4 h-4 mr-2" />
          This Month
        </Button>
      </div>
    </div>
    
    <!-- Chart Container -->
    <div class="h-80 w-full">
      <!-- Placeholder for chart - you can integrate Chart.js, recharts, or similar -->
      <div class="h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
        <div class="text-center">
          <Icon name="lucide:trending-up" class="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h4 class="text-lg font-semibold text-gray-700 mb-2">Analytics Chart</h4>
          <p class="text-gray-500">Chart.js or similar library integration needed</p>
          <div class="grid grid-cols-2 gap-4 mt-6 max-w-xs mx-auto">
            <div class="text-center p-3 bg-white rounded-lg">
              <div class="text-2xl font-bold text-blue-600">+15%</div>
              <div class="text-sm text-gray-600">Patients</div>
            </div>
            <div class="text-center p-3 bg-white rounded-lg">
              <div class="text-2xl font-bold text-green-600">+23%</div>
              <div class="text-sm text-gray-600">Revenue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>