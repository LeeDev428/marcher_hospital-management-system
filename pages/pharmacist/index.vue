<script setup lang="ts">
import { useAuthStore } from '@/stores/app'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'pharmacist',
})

useHead({
  title: 'Pharmacist Dashboard - Marcher Hospital'
})

const authStore = useAuthStore()
const { $client } = useNuxtApp() as any

// Dashboard Statistics
const stats = ref({
  inventoryItems: 0,
  lowStockItems: 0,
  todaySales: 0,
  todayRevenue: 0,
  pendingPrescriptions: 0
})

const recentSales = ref<any[]>([])
const isLoading = ref(true)

// Load dashboard data
const loadDashboardData = async () => {
  try {
    isLoading.value = true
    // TODO: Add tRPC endpoints for pharmacist statistics
    // For now, using placeholder data
    stats.value = {
      inventoryItems: 350,
      lowStockItems: 12,
      todaySales: 28,
      todayRevenue: 18750,
      pendingPrescriptions: 5
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount)
}

onMounted(() => {
  loadDashboardData()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-6 text-white">
      <h2 class="text-2xl font-bold mb-2">Welcome, {{ authStore.fullName }}!</h2>
      <p class="text-teal-50">Pharmacist - Pharmacy Inventory & Billing Management</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Inventory Items</p>
              <p class="text-3xl font-bold text-blue-600">{{ stats.inventoryItems }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:package" class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Low Stock</p>
              <p class="text-3xl font-bold text-orange-600">{{ stats.lowStockItems }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:alert-triangle" class="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Today's Sales</p>
              <p class="text-3xl font-bold text-green-600">{{ stats.todaySales }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:shopping-cart" class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Today's Revenue</p>
              <p class="text-2xl font-bold text-teal-600">{{ formatCurrency(stats.todayRevenue) }}</p>
            </div>
            <div class="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:trending-up" class="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Pending Rx</p>
              <p class="text-3xl font-bold text-purple-600">{{ stats.pendingPrescriptions }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:file-text" class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Quick Actions -->
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common pharmacist tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <NuxtLink to="/pharmacist/billing">
            <Button class="w-full h-24 flex flex-col items-center justify-center bg-teal-600 hover:bg-teal-700">
              <Icon name="lucide:credit-card" class="w-8 h-8 mb-2" />
              <span>New Sale (POS)</span>
            </Button>
          </NuxtLink>

          <NuxtLink to="/pharmacist/pharmacy">
            <Button class="w-full h-24 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700">
              <Icon name="lucide:pill" class="w-8 h-8 mb-2" />
              <span>Manage Inventory</span>
            </Button>
          </NuxtLink>

          <NuxtLink to="/pharmacist/prescriptions">
            <Button class="w-full h-24 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700">
              <Icon name="lucide:file-text" class="w-8 h-8 mb-2" />
              <span>Prescriptions</span>
            </Button>
          </NuxtLink>

          <NuxtLink to="/pharmacist/sales">
            <Button class="w-full h-24 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700">
              <Icon name="lucide:bar-chart" class="w-8 h-8 mb-2" />
              <span>Sales Reports</span>
            </Button>
          </NuxtLink>
        </div>
      </CardContent>
    </Card>

    <!-- Low Stock Alerts -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>Items that need restocking</CardDescription>
          </div>
          <NuxtLink to="/pharmacist/pharmacy">
            <Button variant="outline" size="sm">View All</Button>
          </NuxtLink>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="flex items-center justify-center py-8">
          <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mr-2" />
          Loading...
        </div>
        <div v-else class="space-y-4">
          <div class="text-center py-8 text-muted-foreground">
            <Icon name="lucide:package-check" class="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>All items are well stocked</p>
            <p class="text-sm">Check inventory regularly for updates</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Recent Sales -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest pharmacy transactions</CardDescription>
          </div>
          <NuxtLink to="/pharmacist/sales">
            <Button variant="outline" size="sm">View All</Button>
          </NuxtLink>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="flex items-center justify-center py-8">
          <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mr-2" />
          Loading...
        </div>
        <div v-else class="space-y-4">
          <div class="text-center py-8 text-muted-foreground">
            <Icon name="lucide:shopping-cart" class="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent sales</p>
            <p class="text-sm">Sales will appear here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
