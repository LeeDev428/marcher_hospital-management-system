<script setup lang="ts">
import { useAuthStore } from '@/stores/app'
import { usePOSStore } from '@/stores/pharmacy'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'

definePageMeta({
  layout: 'pharmacist',
})

useHead({
  title: 'Pharmacist Dashboard - Marcher Hospital'
})

const authStore = useAuthStore()
const posStore = usePOSStore()
const { $trpc } = useNuxtApp()

// Dashboard Statistics
const stats = ref({
  inventoryItems: 0,
  lowStockItems: 0,
  todaySales: 0,
  todayRevenue: 0,
  pendingPrescriptions: 0
})

const lowStockItems = ref<any[]>([])
const recentSales = ref<any[]>([])
const isLoading = ref(true)

// Load dashboard data
const loadDashboardData = async () => {
  try {
    isLoading.value = true
    
    // Fetch all pharmacy items for inventory count
    const itemsResponse = await $trpc.pharmacy.items.getPharmacyItems.query({})
    const allItems = itemsResponse.data || []
    
    // Calculate inventory stats
    stats.value.inventoryItems = allItems.length
    stats.value.lowStockItems = allItems.filter((item: any) => item.stock < 10).length
    
    // Get low stock items (less than 10 units)
    lowStockItems.value = allItems
      .filter((item: any) => item.stock < 10)
      .sort((a: any, b: any) => a.stock - b.stock)
      .slice(0, 5) // Show only top 5 low stock items
    
    // Fetch all sales
    const salesResponse = await $trpc.pharmacy.sales.getPharmacySales.query()
    const allSales = salesResponse.data || []
    
    // Calculate today's sales
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todaySales = allSales.filter((sale: any) => {
      const saleDate = new Date(sale.createdAt)
      saleDate.setHours(0, 0, 0, 0)
      return saleDate.getTime() === today.getTime()
    })
    
    stats.value.todaySales = todaySales.length
    stats.value.todayRevenue = todaySales.reduce((sum: number, sale: any) => 
      sum + Number(sale.total || 0), 0
    )
    
    // Get recent sales (last 5)
    recentSales.value = allSales
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
    
    // TODO: Add prescription count when prescription module is ready
    stats.value.pendingPrescriptions = 0
    
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    useToast('error', 'Error', 'Failed to load dashboard data')
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStockBadgeColor = (stock: number) => {
  if (stock === 0) return 'bg-red-600 text-white'
  if (stock < 5) return 'bg-red-500 text-white'
  if (stock < 10) return 'bg-orange-500 text-white'
  return 'bg-green-500 text-white'
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return { text: "Completed", class: "bg-green-100 text-green-800 border-green-300" }
    case "PENDING":
      return { text: "Pending", class: "bg-yellow-100 text-yellow-800 border-yellow-300" }
    default:
      return { text: status, class: "bg-gray-100 text-gray-800 border-gray-300" }
  }
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
            <Button class="w-full h-24 flex flex-col items-center justify-center bg-teal-600 hover:bg-teal-700 cursor-pointer">
              <Icon name="lucide:credit-card" class="w-8 h-8 mb-2" />
              <span>New Sale (POS)</span>
            </Button>
          </NuxtLink>

          <NuxtLink to="/pharmacist/pharmacy">
            <Button class="w-full h-24 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700 cursor-pointer">
              <Icon name="lucide:pill" class="w-8 h-8 mb-2" />
              <span>Manage Inventory</span>
            </Button>
          </NuxtLink>

          <NuxtLink to="/pharmacist/pharmacy/new">
            <Button class="w-full h-24 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700 cursor-pointer">
              <Icon name="lucide:package-plus" class="w-8 h-8 mb-2" />
              <span>Add New Item</span>
            </Button>
          </NuxtLink>

          <NuxtLink to="/pharmacist/sales_history">
            <Button class="w-full h-24 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700 cursor-pointer">
              <Icon name="lucide:bar-chart" class="w-8 h-8 mb-2" />
              <span>Sales History</span>
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
            <CardDescription>Items that need restocking ({{ stats.lowStockItems }} items)</CardDescription>
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
        <div v-else-if="lowStockItems.length > 0" class="space-y-3">
          <div 
            v-for="item in lowStockItems" 
            :key="item.id"
            class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div class="flex-1">
              <p class="font-semibold">{{ item.name }}</p>
              <p class="text-sm text-gray-600">{{ item.brand.name }} - {{ item.strength }} {{ item.unit }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ item.category.name }}</p>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-right">
                <p class="text-sm text-gray-600">Stock</p>
                <Badge :class="getStockBadgeColor(item.stock)" class="font-bold">
                  {{ item.stock }} {{ item.stock === 1 ? 'unit' : 'units' }}
                </Badge>
              </div>
              <NuxtLink :to="`/pharmacist/pharmacy/${item.id}`">
                <Button variant="outline" size="sm">
                  <Icon name="lucide:edit" class="w-4 h-4" />
                </Button>
              </NuxtLink>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-muted-foreground">
          <Icon name="lucide:package-check" class="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>All items are well stocked</p>
          <p class="text-sm">Check inventory regularly for updates</p>
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
          <NuxtLink to="/pharmacist/sales_history">
            <Button variant="outline" size="sm">View All</Button>
          </NuxtLink>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="flex items-center justify-center py-8">
          <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mr-2" />
          Loading...
        </div>
        <div v-else-if="recentSales.length > 0" class="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead class="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="sale in recentSales" 
                :key="sale.id"
                class="cursor-pointer hover:bg-gray-50"
                @click="$router.push(`/pharmacist/sales_history/${sale.id}`)"
              >
                <TableCell class="font-mono font-semibold text-blue-600">
                  {{ sale.invoiceNumber }}
                </TableCell>
                <TableCell>
                  {{ sale.customerName || 'Walk-in' }}
                </TableCell>
                <TableCell class="text-sm text-gray-600">
                  {{ formatDate(sale.createdAt) }}
                </TableCell>
                <TableCell class="text-right font-semibold">
                  {{ formatCurrency(sale.total) }}
                </TableCell>
                <TableCell>
                  <Badge :class="getStatusBadge(sale.paymentStatus).class" variant="outline">
                    {{ getStatusBadge(sale.paymentStatus).text }}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div v-else class="text-center py-8 text-muted-foreground">
          <Icon name="lucide:shopping-cart" class="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No recent sales</p>
          <p class="text-sm">Sales will appear here</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
