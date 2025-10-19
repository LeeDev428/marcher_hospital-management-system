<script setup lang="ts">
import { useAuthStore } from '@/stores/app'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'billing-staff',
})

useHead({
  title: 'Billing Dashboard - Marcher Hospital'
})

const authStore = useAuthStore()
const { $client } = useNuxtApp() as any

// Dashboard Statistics
const stats = ref({
  pendingPayments: 0,
  todayRevenue: 0,
  processedToday: 0,
  outstandingBalance: 0
})

const recentTransactions = ref<any[]>([])
const isLoading = ref(true)

// Load dashboard data
const loadDashboardData = async () => {
  try {
    isLoading.value = true
    // TODO: Add tRPC endpoints for billing statistics
    // For now, using placeholder data
    stats.value = {
      pendingPayments: 8,
      todayRevenue: 45250,
      processedToday: 15,
      outstandingBalance: 125000
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
    <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
      <h2 class="text-2xl font-bold mb-2">Welcome, {{ authStore.fullName }}!</h2>
      <p class="text-purple-50">Billing Staff - Payment Processing & Balance Settlements</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Pending Payments</p>
              <p class="text-3xl font-bold text-orange-600">{{ stats.pendingPayments }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:clock" class="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Today's Revenue</p>
              <p class="text-2xl font-bold text-green-600">{{ formatCurrency(stats.todayRevenue) }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:trending-up" class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Processed Today</p>
              <p class="text-3xl font-bold text-blue-600">{{ stats.processedToday }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:check-circle" class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Outstanding Balance</p>
              <p class="text-xl font-bold text-red-600">{{ formatCurrency(stats.outstandingBalance) }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:alert-triangle" class="w-6 h-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Quick Actions -->
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks for billing staff</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NuxtLink to="/billing_staff/payments">
            <Button class="w-full h-24 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700">
              <Icon name="lucide:credit-card" class="w-8 h-8 mb-2" />
              <span>Process Payment</span>
            </Button>
          </NuxtLink>

          <NuxtLink to="/billing_staff/settlements">
            <Button class="w-full h-24 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700">
              <Icon name="lucide:wallet" class="w-8 h-8 mb-2" />
              <span>Settle Balance</span>
            </Button>
          </NuxtLink>

          <NuxtLink to="/billing_staff/invoices">
            <Button class="w-full h-24 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700">
              <Icon name="lucide:file-invoice" class="w-8 h-8 mb-2" />
              <span>View Invoices</span>
            </Button>
          </NuxtLink>
        </div>
      </CardContent>
    </Card>

    <!-- Recent Transactions -->
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Latest payment activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="flex items-center justify-center py-8">
          <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mr-2" />
          Loading...
        </div>
        <div v-else class="space-y-4">
          <div class="text-center py-8 text-muted-foreground">
            <Icon name="lucide:credit-card" class="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent transactions</p>
            <p class="text-sm">Process a payment to get started</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
