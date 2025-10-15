<script setup lang="ts">
import { ref, onMounted } from "vue"
import { usePOSStore } from "@/stores/pharmacy"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

definePageMeta({
  layout: "staff",
  middleware: ["auth"],
})

const posStore = usePOSStore()
const searchQuery = ref("")

onMounted(() => {
  posStore.fetchSales()
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

// Payment method badge
const getMethodBadge = (method: string) => {
  switch (method) {
    case "CASH":
      return { text: "Cash", class: "bg-blue-100 text-blue-800" }
    case "CARD":
      return { text: "Card", class: "bg-purple-100 text-purple-800" }
    case "ONLINE":
      return { text: "Online", class: "bg-indigo-100 text-indigo-800" }
    case "INSURANCE":
      return { text: "Insurance", class: "bg-teal-100 text-teal-800" }
    default:
      return { text: method, class: "bg-gray-100 text-gray-800" }
  }
}

// Filtered sales
const filteredSales = computed(() => {
  if (!searchQuery.value) return posStore.sales
  
  const query = searchQuery.value.toLowerCase()
  return posStore.sales.filter((sale) => 
    sale.invoiceNumber.toLowerCase().includes(query) ||
    sale.customerName?.toLowerCase().includes(query) ||
    sale.customerPhone?.includes(query)
  )
})

// View sale detail
const viewSale = (id: string) => {
  navigateTo(`/staff/pharmacy/sales/${id}`)
}
</script>

<template>
  <div class="container mx-auto p-6 max-w-screen-2xl">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Sales History</h1>
        <p class="text-gray-500 mt-1">View all pharmacy sales transactions</p>
      </div>
      <Button @click="$router.push('/staff/pharmacy/pos')" class="bg-blue-600 hover:bg-blue-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Sale
      </Button>
    </div>

    <!-- Filters Card -->
    <Card class="mb-6">
      <CardContent class="p-4">
        <div class="flex gap-3">
          <Input
            v-model="searchQuery"
            placeholder="Search by invoice, customer name, or phone..."
            class="flex-1"
          />
          <Button variant="outline" @click="posStore.fetchSales()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Sales Table -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center justify-between">
          <span>All Sales</span>
          <Badge variant="outline" class="text-sm">{{ filteredSales.length }} transactions</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent class="p-0">
        <!-- Loading State -->
        <div v-if="posStore.loading" class="p-6 space-y-3">
          <Skeleton v-for="i in 5" :key="i" class="h-16 w-full" />
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredSales.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-gray-600 text-lg">No sales found</p>
          <p class="text-gray-400 text-sm mt-1">Start selling to see transactions here</p>
        </div>

        <!-- Sales Table -->
        <div v-else class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead class="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead class="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="sale in filteredSales"
                :key="sale.id"
                class="hover:bg-gray-50 cursor-pointer"
                @click="viewSale(sale.id)"
              >
                <TableCell class="font-medium text-blue-600">{{ sale.invoiceNumber }}</TableCell>
                <TableCell>
                  <div v-if="sale.customerName">
                    <p class="font-medium">{{ sale.customerName }}</p>
                    <p class="text-xs text-gray-500">{{ sale.customerPhone }}</p>
                  </div>
                  <span v-else class="text-gray-400 text-sm">Walk-in</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" class="text-xs">{{ sale.itemCount }} items</Badge>
                </TableCell>
                <TableCell>
                  <Badge :class="getMethodBadge(sale.paymentMethod).class" class="text-xs">
                    {{ getMethodBadge(sale.paymentMethod).text }}
                  </Badge>
                </TableCell>
                <TableCell class="text-right font-semibold">
                  <div>{{ formatCurrency(sale.total) }}</div>
                  <div v-if="sale.discount > 0" class="text-xs text-green-600">
                    -{{ formatCurrency(sale.discount) }} discount
                  </div>
                </TableCell>
                <TableCell>
                  <Badge :class="getStatusBadge(sale.paymentStatus).class" class="text-xs">
                    {{ getStatusBadge(sale.paymentStatus).text }}
                  </Badge>
                </TableCell>
                <TableCell class="text-sm text-gray-600">
                  {{ formatDate(sale.createdAt) }}
                </TableCell>
                <TableCell class="text-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    @click.stop="viewSale(sale.id)"
                    class="hover:bg-blue-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
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
