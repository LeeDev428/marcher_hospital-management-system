<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { useDashboardStore } from "~/stores/dashboard/useDashboardStore"
import DashboardSummaryCards from "@/pages/(staff)/dashboard/components/DashboardSummaryCards.vue"
import AppointmentsList from "~/pages/(staff)/dashboard/components/AppointmentsList.vue" 
import DashboardFilters from "@/pages/(staff)/dashboard/components/DashboardFilters.vue"

const breadcrumbsStore = useBreadcrumbsStore()
const dashboardStore = useDashboardStore()

onMounted(async () => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Dashboard", link: "/" },
  ])
  
  // Load initial dashboard data
  await dashboardStore.refreshDashboard()
})
</script>

<template>
  <NuxtLayout name="staff" title="Dashboard">
    <div class="space-y-6">
      <!-- Summary Cards -->
      <DashboardSummaryCards />

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Appointments List - Takes up 2 columns on large screens -->
        <div class="lg:col-span-2">
          <AppointmentsList />
        </div>

        <!-- Sidebar - Filters -->
        <div class="space-y-6">
          <!-- Dashboard Filters -->
          <DashboardFilters />
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex gap-4 flex-wrap">
        <NuxtLink to="/appointments/new">
          <Button class="flex items-center gap-2">
            <Icon name="mdi:calendar-plus" />
            Book New Appointment
          </Button>
        </NuxtLink>
        
        <NuxtLink to="/appointments">
          <Button variant="outline" class="flex items-center gap-2">
            <Icon name="mdi:calendar-multiple" />
            View All Appointments
          </Button>
        </NuxtLink>
        
        <NuxtLink to="/patients">
          <Button variant="outline" class="flex items-center gap-2">
            <Icon name="mdi:account-group" />
            Manage Patients
          </Button>
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>