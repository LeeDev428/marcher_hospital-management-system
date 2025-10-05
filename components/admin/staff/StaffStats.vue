<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  refreshTrigger?: number
}

const props = defineProps<Props>()

// TRPC Client
const { $trpc } = useNuxtApp()

// State
const stats = ref({ total: 0, doctors: 0, nurses: 0, active: 0 })
const isLoading = ref(true)

// Fetch statistics
const fetchStats = async () => {
  try {
    isLoading.value = true
    const response = await $trpc.staff.getStats.query()
    if (response.success) {
      stats.value = response.data
    }
  } catch (err) {
    console.error('Error fetching stats:', err)
  } finally {
    isLoading.value = false
  }
}

// Watch for refresh trigger
watch(() => props.refreshTrigger, () => {
  fetchStats()
}, { immediate: true })
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- Loading State -->
    <template v-if="isLoading">
      <Card v-for="i in 4" :key="i">
        <CardContent class="p-6">
          <div class="animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div class="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    </template>

    <!-- Statistics Cards -->
    <template v-else>
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Total Staff</p>
              <p class="text-2xl font-bold">{{ stats.total }}</p>
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
              <p class="text-sm font-medium text-muted-foreground">Doctors</p>
              <p class="text-2xl font-bold">{{ stats.doctors }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:stethoscope" class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Nurses</p>
              <p class="text-2xl font-bold">{{ stats.nurses }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:heart-pulse" class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Active Staff</p>
              <p class="text-2xl font-bold">{{ stats.active }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:user-check" class="w-6 h-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </template>
  </div>
</template>