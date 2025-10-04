<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <div class="p-6 space-y-8">
      <!-- Welcome Header -->
      <AdminWelcomeHeader />
      
      <!-- Stats Cards -->
      <AdminStatsCards />
      
      <!-- System Metrics & Activities -->
      <SystemMetrics />
      
      <!-- User Management -->
      <UserManagement />
      
      <!-- Analytics Chart -->
      <AnalyticsChart />
    </div>
  </div>
</template>

<script setup>
// Page metadata
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

// Set page title
useHead({
  title: 'Admin Dashboard - Marcher Hospital Management System'
})
</script>