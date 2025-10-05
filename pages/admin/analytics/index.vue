<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({
  title: 'Analytics - Admin Portal'
})
</script>

<template>
  <div class="container mx-auto p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
      <p class="text-gray-600 mt-2">Monitor system performance and usage statistics</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Sample Analytics Cards -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
        <p class="text-3xl font-bold text-blue-600">1,234</p>
        <p class="text-sm text-gray-500 mt-1">+12% from last month</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Active Sessions</h3>
        <p class="text-3xl font-bold text-green-600">89</p>
        <p class="text-sm text-gray-500 mt-1">Currently online</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">System Uptime</h3>
        <p class="text-3xl font-bold text-purple-600">99.9%</p>
        <p class="text-sm text-gray-500 mt-1">Last 30 days</p>
      </div>
    </div>

    <div class="mt-8 bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Analytics Coming Soon</h2>
      <p class="text-gray-600">Advanced analytics and reporting features will be available in a future update.</p>
    </div>
  </div>
</template>