<script setup lang="ts">
import { useAuthStore } from '@/stores/app'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'admissions-staff',
})

useHead({
  title: 'Admissions Dashboard - Marcher Hospital'
})

const authStore = useAuthStore()
const { $client } = useNuxtApp() as any

// Dashboard Statistics
const stats = ref({
  todayAdmissions: 0,
  pendingEncounters: 0,
  totalPatients: 0,
  unassignedEncounters: 0
})

const recentEncounters = ref<any[]>([])
const isLoading = ref(true)

// Load dashboard data
const loadDashboardData = async () => {
  try {
    isLoading.value = true
    // TODO: Add tRPC endpoints for admissions statistics
    // For now, using placeholder data
    stats.value = {
      todayAdmissions: 12,
      pendingEncounters: 5,
      totalPatients: 245,
      unassignedEncounters: 3
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
      <h2 class="text-2xl font-bold mb-2">Welcome, {{ authStore.fullName }}!</h2>
      <p class="text-green-50">Admissions Staff - Patient Intake & Encounter Management</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Today's Admissions</p>
              <p class="text-3xl font-bold text-green-600">{{ stats.todayAdmissions }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:user-plus" class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Pending Encounters</p>
              <p class="text-3xl font-bold text-orange-600">{{ stats.pendingEncounters }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:clipboard-list" class="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Total Patients</p>
              <p class="text-3xl font-bold text-blue-600">{{ stats.totalPatients }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:users" class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Unassigned</p>
              <p class="text-3xl font-bold text-red-600">{{ stats.unassignedEncounters }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:alert-circle" class="w-6 h-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Quick Actions -->
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks for admissions staff</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NuxtLink to="/admissions_staff/encounters">
            <Button class="w-full h-24 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700">
              <Icon name="lucide:clipboard-plus" class="w-8 h-8 mb-2" />
              <span>Create New Encounter</span>
            </Button>
          </NuxtLink>

          <NuxtLink to="/admissions_staff/patients">
            <Button class="w-full h-24 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700">
              <Icon name="lucide:search" class="w-8 h-8 mb-2" />
              <span>Search Patients</span>
            </Button>
          </NuxtLink>

          <NuxtLink to="/admissions_staff/assign">
            <Button class="w-full h-24 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700">
              <Icon name="lucide:user-plus" class="w-8 h-8 mb-2" />
              <span>Assign to Doctor/Nurse</span>
            </Button>
          </NuxtLink>
        </div>
      </CardContent>
    </Card>

    <!-- Recent Activity -->
    <Card>
      <CardHeader>
        <CardTitle>Recent Encounters</CardTitle>
        <CardDescription>Latest patient admissions and encounters</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="flex items-center justify-center py-8">
          <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mr-2" />
          Loading...
        </div>
        <div v-else class="space-y-4">
          <div class="text-center py-8 text-muted-foreground">
            <Icon name="lucide:clipboard-list" class="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent encounters</p>
            <p class="text-sm">Create a new encounter to get started</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
