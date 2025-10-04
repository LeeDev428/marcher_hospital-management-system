<script setup lang="ts">
import { useAuthStore } from "@/stores/app" 
import WelcomeHeader from "@/components/staff/dashboard/WelcomeHeader.vue"
import StatsCards from "@/components/staff/dashboard/StatsCards.vue"
import AnalyticsChart from "@/components/staff/dashboard/AnalyticsChart.vue"
import RecentActivities from "@/components/staff/dashboard/RecentActivities.vue"
import TodaysAppointments from "@/components/staff/dashboard/TodaysAppointments.vue"

const authStore = useAuthStore()

// Determine which dashboard to show based on user role
const userRole = computed(() => authStore.user?.role || 'STAFF')

definePageMeta({
  layout: 'staff'
})
</script>

<template>
  <NuxtLayout name="staff" title="Staff Dashboard">
    <div class="min-h-screen bg-gray-50 p-6">
      <!-- Welcome Header -->
      <WelcomeHeader />
      
      <!-- Stats Cards -->
      <StatsCards />
      
      <!-- Main Dashboard Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Analytics Chart (spans 2 columns) -->
        <div class="lg:col-span-2">
          <AnalyticsChart />
        </div>
        
        <!-- Right Column - Today's Appointments -->
        <div class="lg:col-span-1">
          <TodaysAppointments />
        </div>
      </div>
      
      <!-- Recent Activities Section -->
      <div class="mt-6">
        <RecentActivities />
      </div>
    </div>
  </NuxtLayout>
</template>
