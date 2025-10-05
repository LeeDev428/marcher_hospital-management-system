<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({
  title: 'Reports - Admin Portal'
})
</script>

<template>
  <div class="container mx-auto p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Reports Center</h1>
      <p class="text-gray-600 mt-2">Generate and view system reports</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Report Categories -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center mb-4">
          <Icon name="lucide:users" class="w-8 h-8 text-blue-600 mr-3" />
          <h3 class="text-lg font-semibold text-gray-900">User Reports</h3>
        </div>
        <p class="text-gray-600 mb-4">Generate reports on user activity and registrations</p>
        <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
          Generate Report
        </button>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center mb-4">
          <Icon name="lucide:activity" class="w-8 h-8 text-green-600 mr-3" />
          <h3 class="text-lg font-semibold text-gray-900">System Activity</h3>
        </div>
        <p class="text-gray-600 mb-4">Monitor system usage and performance metrics</p>
        <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
          Generate Report
        </button>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center mb-4">
          <Icon name="lucide:shield-check" class="w-8 h-8 text-purple-600 mr-3" />
          <h3 class="text-lg font-semibold text-gray-900">Security Reports</h3>
        </div>
        <p class="text-gray-600 mb-4">Review security logs and access reports</p>
        <button class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
          Generate Report
        </button>
      </div>
    </div>

    <div class="mt-8 bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Report Generation</h2>
      <p class="text-gray-600">Advanced report generation features will be implemented in a future update.</p>
    </div>
  </div>
</template>