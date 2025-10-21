<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

definePageMeta({
  layout: "pharmacist",
  middleware: ["staff-type"],
})

const router = useRouter()
const { $client } = useNuxtApp() as any

const sales = ref<any[]>([])
const loading = ref(false)
const searchQuery = ref("")

// Fetch all sales
const fetchSales = async () => {
  loading.value = true
  try {
    const data = await $client.pharmacy.sales.list.query()
    sales.value = data
  } catch (error) {
    console.error("Failed to fetch sales:", error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSales()
})

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount)
}

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Payment status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return { text: "Completed", class: "bg-green-500 text-white" }
    case "PENDING":
      return { text: "Pending", class: "bg-yellow-500 text-white" }
    case "CANCELLED":
      return { text: "Cancelled", class: "bg-red-500 text-white" }
    case "REFUNDED":
      return { text: "Refunded", class: "bg-gray-500 text-white" }
    default:
      return { text: status, class: "bg-gray-300" }
  }
}

// Payment method icon
const getPaymentIcon = (method: string) => {
  switch (method) {
    case "CASH":
      return "💵"
    case "CARD":
      return "💳"
    case "ONLINE":
      return "📱"
    case "INSURANCE":
      return "🏥"
    default:
      return "💰"
  }
}

// Filter sales by search query
const filteredSales = computed(() => {
  if (!searchQuery.value) return sales.value
  
  const query = searchQuery.value.toLowerCase()
  return sales.value.filter(sale => 
    sale.invoiceNumber.toLowerCase().includes(query) ||
    sale.customerName?.toLowerCase().includes(query) ||
    sale.customerPhone?.toLowerCase().includes(query) ||
    sale.id.toLowerCase().includes(query)
  )
})

// View receipt
const viewReceipt = (saleId: string) => {
  router.push(`/pharmacist/pharmacy/sales/${saleId}`)
}

// Calculate statistics
const stats = computed(() => {
  const total = sales.value.reduce((sum, sale) => sum + Number(sale.total), 0)
  const completed = sales.value.filter(s => s.paymentStatus === "COMPLETED").length
  const pending = sales.value.filter(s => s.paymentStatus === "PENDING").length
  const today = sales.value.filter(s => {
    const saleDate = new Date(s.createdAt).toDateString()
    const todayDate = new Date().toDateString()
    return saleDate === todayDate
  })
  const todayTotal = today.reduce((sum, sale) => sum + Number(sale.total), 0)

  return {
    total,
    completed,
    pending,
    todayTotal,
    todayCount: today.length
  }
})

useHead({
  title: 'Sales History - Billing'
})
</script>

<template>
  <div class="container mx-auto p-6 max-w-screen-2xl">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Sales History</h1>
        <p class="text-gray-500 mt-1">View and manage all pharmacy sales transactions</p>
      </div>
      <Button variant="outline" @click="router.back()">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to POS
      </Button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Today's Sales</p>
              <p class="text-2xl font-bold text-blue-600 mt-1">{{ formatCurrency(stats.todayTotal) }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ stats.todayCount }} transactions</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Total Sales</p>
              <p class="text-2xl font-bold text-green-600 mt-1">{{ formatCurrency(stats.total) }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ sales.length }} transactions</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Completed</p>
              <p class="text-2xl font-bold text-green-600 mt-1">{{ stats.completed }}</p>
              <p class="text-xs text-gray-500 mt-1">Successful payments</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Pending</p>
              <p class="text-2xl font-bold text-yellow-600 mt-1">{{ stats.pending }}</p>
              <p class="text-xs text-gray-500 mt-1">Awaiting payment</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Search and Filter -->
    <Card class="mb-6">
      <CardContent class="p-4">
        <div class="flex gap-3 items-center">
          <div class="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              v-model="searchQuery"
              placeholder="Search by invoice number, customer name, phone..."
              class="pl-10"
            />
          </div>
          <Button variant="outline" @click="fetchSales">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Sales Table -->
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
        <CardDescription>Complete list of pharmacy sales and billing transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <!-- Loading State -->
        <div v-if="loading" class="space-y-3">
          <Skeleton v-for="i in 5" :key="i" class="h-16 w-full" />
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredSales.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-gray-600 text-lg">No sales found</p>
          <p class="text-gray-400 text-sm mt-1">Start making sales to see transactions here</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead class="text-right">Total Amount</TableHead>
                <TableHead class="text-right">Amount Paid</TableHead>
                <TableHead class="text-right">Change</TableHead>
                <TableHead class="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="sale in filteredSales" 
                :key="sale.id"
                class="hover:bg-gray-50 cursor-pointer"
                @click="viewReceipt(sale.id)"
              >
                <TableCell>
                  <div class="font-mono font-semibold text-blue-600">{{ sale.invoiceNumber }}</div>
                  <div class="text-xs text-gray-500">ID: {{ sale.id.slice(0, 8) }}</div>
                </TableCell>
                <TableCell>
                  <div class="text-sm">{{ formatDate(sale.createdAt) }}</div>
                  <div class="text-xs text-gray-500">{{ formatDateTime(sale.createdAt).split(',')[1] }}</div>
                </TableCell>
                <TableCell>
                  <div v-if="sale.customerName">
                    <div class="font-medium">{{ sale.customerName }}</div>
                    <div class="text-xs text-gray-500">{{ sale.customerPhone }}</div>
                  </div>
                  <Badge v-else variant="outline" class="text-xs">Walk-in</Badge>
                </TableCell>
                <TableCell>
                  <Badge class="bg-gray-100 text-gray-900">
                    {{ sale.items?.length || 0 }} items
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge class="bg-blue-100 text-blue-800">
                    <span class="mr-1">{{ getPaymentIcon(sale.paymentMethod) }}</span>
                    {{ sale.paymentMethod }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge :class="getStatusBadge(sale.paymentStatus).class">
                    {{ getStatusBadge(sale.paymentStatus).text }}
                  </Badge>
                </TableCell>
                <TableCell class="text-right font-bold text-gray-900">
                  {{ formatCurrency(sale.total) }}
                </TableCell>
                <TableCell class="text-right font-semibold text-green-600">
                  {{ formatCurrency(sale.amountPaid || sale.total) }}
                </TableCell>
                <TableCell class="text-right text-sm text-gray-600">
                  {{ formatCurrency((sale.amountPaid || sale.total) - sale.total) }}
                </TableCell>
                <TableCell class="text-center">
                  <Button 
                    size="sm" 
                    variant="outline"
                    @click.stop="viewReceipt(sale.id)"
                    class="hover:bg-blue-50 hover:text-blue-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
