<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"
import { useBreadcrumbsStore } from "@/stores/app"
import { usePOSStore } from "@/stores/pharmacy"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

definePageMeta({
  layout: "pharmacist",
  middleware: ["staff-type"],
})

useHead({
  title: 'Sales History - Pharmacist'
})

const router = useRouter()
const breadcrumbsStore = useBreadcrumbsStore()
const posStore = usePOSStore()

const searchQuery = ref("")
const statusFilter = ref("ALL")
const paymentMethodFilter = ref("ALL")
const dateFilter = ref("ALL") // TODAY, WEEK, MONTH, ALL

onMounted(async () => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Sales History", link: "/pharmacist/sales_history" },
  ])
  
  await posStore.fetchSales()
})

// Format currency
const formatCurrency = (amount: number | null) => {
  if (amount === null || amount === undefined) return "N/A"
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
      return { text: "Completed", variant: "default", class: "bg-green-600" }
    case "PENDING":
      return { text: "Pending", variant: "outline", class: "bg-yellow-100 text-yellow-800 border-yellow-300" }
    case "CANCELLED":
      return { text: "Cancelled", variant: "destructive", class: "bg-red-600" }
    case "REFUNDED":
      return { text: "Refunded", variant: "secondary", class: "bg-gray-500" }
    default:
      return { text: status, variant: "outline", class: "" }
  }
}

// Payment method badge
const getPaymentMethodBadge = (method: string) => {
  switch (method) {
    case "CASH":
      return { icon: "💵", text: "Cash", class: "bg-green-100 text-green-800 border-green-300" }
    case "CARD":
      return { icon: "💳", text: "Card", class: "bg-blue-100 text-blue-800 border-blue-300" }
    case "ONLINE":
      return { icon: "📱", text: "Online", class: "bg-purple-100 text-purple-800 border-purple-300" }
    case "INSURANCE":
      return { icon: "🏥", text: "Insurance", class: "bg-orange-100 text-orange-800 border-orange-300" }
    default:
      return { icon: "💰", text: method, class: "bg-gray-100 text-gray-800 border-gray-300" }
  }
}

// Filter sales by search query and filters
const filteredSales = computed(() => {
  let filtered = posStore.sales || []
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((sale: any) => 
      sale.invoiceNumber.toLowerCase().includes(query) ||
      sale.customerName?.toLowerCase().includes(query) ||
      sale.customerPhone?.includes(query)
    )
  }
  
  // Status filter
  if (statusFilter.value !== "ALL") {
    filtered = filtered.filter((sale: any) => sale.paymentStatus === statusFilter.value)
  }
  
  // Payment method filter
  if (paymentMethodFilter.value !== "ALL") {
    filtered = filtered.filter((sale: any) => sale.paymentMethod === paymentMethodFilter.value)
  }
  
  // Date filter
  if (dateFilter.value !== "ALL") {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    filtered = filtered.filter((sale: any) => {
      const saleDate = new Date(sale.createdAt)
      
      if (dateFilter.value === "TODAY") {
        return saleDate >= today
      } else if (dateFilter.value === "WEEK") {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        return saleDate >= weekAgo
      } else if (dateFilter.value === "MONTH") {
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        return saleDate >= monthAgo
      }
      
      return true
    })
  }
  
  return filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

// Statistics
const totalSales = computed(() => filteredSales.value.length)
const totalRevenue = computed(() => 
  filteredSales.value.reduce((sum: number, sale: any) => sum + Number(sale.total || 0), 0)
)
const completedSales = computed(() => 
  filteredSales.value.filter((sale: any) => sale.paymentStatus === "COMPLETED").length
)
const totalChangeGiven = computed(() => 
  filteredSales.value.reduce((sum: number, sale: any) => sum + Number(sale.changeGiven || 0), 0)
)

// View sale details
const viewSaleDetails = (saleId: string) => {
  router.push(`/pharmacist/sales_history/${saleId}`)
}

// Print receipt
const printReceipt = (saleId: string) => {
  // TODO: Implement receipt printing
  console.log("Print receipt for sale:", saleId)
  useToast("info", "Print Receipt", "Receipt printing feature coming soon")
}

// Refresh data
const refreshSales = async () => {
  await posStore.fetchSales()
  useToast("success", "Refreshed", "Sales data has been refreshed")
}
</script>

<template>
  <div class="h-full w-full flex flex-col gap-6">
    <!-- Header Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader class="pb-2">
          <CardDescription>Total Sales</CardDescription>
          <CardTitle class="text-3xl">{{ totalSales }}</CardTitle>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader class="pb-2">
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle class="text-3xl text-green-600">{{ formatCurrency(totalRevenue) }}</CardTitle>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader class="pb-2">
          <CardDescription>Completed</CardDescription>
          <CardTitle class="text-3xl text-blue-600">{{ completedSales }}</CardTitle>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader class="pb-2">
          <CardDescription>Total Change Given</CardDescription>
          <CardTitle class="text-3xl text-purple-600">{{ formatCurrency(totalChangeGiven) }}</CardTitle>
        </CardHeader>
      </Card>
    </div>

    <!-- Filters and Search -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Sales History</CardTitle>
            <CardDescription>Complete transaction history with payment details</CardDescription>
          </div>
          <div class="flex gap-2">
            <Button @click="refreshSales" variant="outline" size="sm">
              <Icon name="lucide:refresh-cw" class="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <NuxtLink to="/pharmacist/billing">
              <Button size="sm">
                <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
                New Sale
              </Button>
            </NuxtLink>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <!-- Filters -->
        <div class="flex flex-wrap gap-4 mb-4">
          <div class="flex-1 min-w-[250px]">
            <Input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search by invoice, customer name, or phone..." 
              class="w-full"
            >
              <template #prefix>
                <Icon name="lucide:search" class="w-4 h-4 text-gray-400" />
              </template>
            </Input>
          </div>
          
          <Select v-model="dateFilter">
            <SelectTrigger class="w-[150px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Time</SelectItem>
              <SelectItem value="TODAY">Today</SelectItem>
              <SelectItem value="WEEK">This Week</SelectItem>
              <SelectItem value="MONTH">This Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Select v-model="statusFilter">
            <SelectTrigger class="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
            </SelectContent>
          </Select>
          
          <Select v-model="paymentMethodFilter">
            <SelectTrigger class="w-[150px]">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Methods</SelectItem>
              <SelectItem value="CASH">Cash</SelectItem>
              <SelectItem value="CARD">Card</SelectItem>
              <SelectItem value="ONLINE">Online</SelectItem>
              <SelectItem value="INSURANCE">Insurance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Results Count -->
        <div class="mb-4 text-sm text-gray-600">
          Showing <span class="font-semibold">{{ filteredSales.length }}</span> 
          {{ filteredSales.length === 1 ? 'transaction' : 'transactions' }}
        </div>

        <!-- Sales Table -->
        <div class="border rounded-lg overflow-hidden">
          <Table v-if="!posStore.loading && filteredSales.length > 0">
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead class="text-right">Subtotal</TableHead>
                <TableHead class="text-right">Discount</TableHead>
                <TableHead class="text-right">Total</TableHead>
                <TableHead class="text-right">Amount Paid</TableHead>
                <TableHead class="text-right">Change</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="sale in filteredSales" 
                :key="sale.id"
                class="cursor-pointer hover:bg-gray-50"
                @click="viewSaleDetails(sale.id)"
              >
                <TableCell class="font-mono font-semibold text-blue-600">
                  {{ sale.invoiceNumber }}
                </TableCell>
                <TableCell class="text-sm">
                  {{ formatDateTime(sale.createdAt) }}
                </TableCell>
                <TableCell>
                  <div class="flex flex-col">
                    <span class="font-medium">{{ sale.customerName || 'Walk-in' }}</span>
                    <span v-if="sale.customerPhone" class="text-xs text-gray-500">{{ sale.customerPhone }}</span>
                  </div>
                </TableCell>
                <TableCell class="text-right">{{ formatCurrency(sale.subtotal) }}</TableCell>
                <TableCell class="text-right text-red-600">
                  {{ sale.discount > 0 ? '-' + formatCurrency(sale.discount) : '—' }}
                </TableCell>
                <TableCell class="text-right font-semibold">{{ formatCurrency(sale.total) }}</TableCell>
                <TableCell class="text-right text-green-600 font-medium">
                  {{ formatCurrency(sale.amountPaid) }}
                </TableCell>
                <TableCell class="text-right text-purple-600">
                  {{ formatCurrency(sale.changeGiven) }}
                </TableCell>
                <TableCell>
                  <Badge :class="getPaymentMethodBadge(sale.paymentMethod).class" variant="outline">
                    {{ getPaymentMethodBadge(sale.paymentMethod).icon }} 
                    {{ getPaymentMethodBadge(sale.paymentMethod).text }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge :class="getStatusBadge(sale.paymentStatus).class">
                    {{ getStatusBadge(sale.paymentStatus).text }}
                  </Badge>
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex items-center justify-end gap-2">
                    <Button 
                      @click.stop="viewSaleDetails(sale.id)" 
                      variant="ghost" 
                      size="sm"
                      class="h-8 w-8 p-0"
                    >
                      <Icon name="lucide:eye" class="w-4 h-4" />
                    </Button>
                    <Button 
                      @click.stop="printReceipt(sale.id)" 
                      variant="ghost" 
                      size="sm"
                      class="h-8 w-8 p-0"
                    >
                      <Icon name="lucide:printer" class="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <!-- Loading State -->
          <div v-else-if="posStore.loading" class="p-8">
            <div class="space-y-4">
              <Skeleton class="h-12 w-full" />
              <Skeleton class="h-12 w-full" />
              <Skeleton class="h-12 w-full" />
              <Skeleton class="h-12 w-full" />
              <Skeleton class="h-12 w-full" />
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="p-12 text-center">
            <Icon name="lucide:receipt" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 class="text-lg font-semibold text-gray-700 mb-2">No sales found</h3>
            <p class="text-gray-500 mb-4">
              {{ searchQuery || statusFilter !== 'ALL' || paymentMethodFilter !== 'ALL' 
                ? 'Try adjusting your filters' 
                : 'Start making sales to see transaction history here' }}
            </p>
            <NuxtLink to="/pharmacist/billing">
              <Button>
                <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
                Create First Sale
              </Button>
            </NuxtLink>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
