<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useBreadcrumbsStore } from "@/stores/app"
import { usePOSStore } from "@/stores/pharmacy"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

definePageMeta({
  layout: "pharmacist",
  middleware: ["staff-type"],
})

const route = useRoute()
const router = useRouter()
const breadcrumbsStore = useBreadcrumbsStore()
const posStore = usePOSStore()

const saleId = computed(() => route.params.id as string)

onMounted(async () => {
  if (saleId.value) {
    await posStore.fetchSale(saleId.value)
    
    if (posStore.currentSale) {
      breadcrumbsStore.setBreadcrumbs([
        { label: "Sales History", link: "/pharmacist/sales_history" },
        { label: posStore.currentSale.invoiceNumber, link: `/pharmacist/sales_history/${saleId.value}` },
      ])
      
      useHead({
        title: `Sale ${posStore.currentSale.invoiceNumber} - Pharmacist`
      })
    }
  }
})

const sale = computed(() => posStore.currentSale)

// Format currency
const formatCurrency = (amount: number | null) => {
  if (amount === null || amount === undefined) return "N/A"
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount)
}

// Format date
const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Payment status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return { text: "Completed", class: "bg-green-600 text-white" }
    case "PENDING":
      return { text: "Pending", class: "bg-yellow-500 text-white" }
    case "CANCELLED":
      return { text: "Cancelled", class: "bg-red-600 text-white" }
    case "REFUNDED":
      return { text: "Refunded", class: "bg-gray-500 text-white" }
    default:
      return { text: status, class: "bg-gray-300" }
  }
}

// Payment method badge
const getPaymentMethodBadge = (method: string) => {
  switch (method) {
    case "CASH":
      return { icon: "💵", text: "Cash", class: "bg-green-100 text-green-800" }
    case "CARD":
      return { icon: "💳", text: "Card", class: "bg-blue-100 text-blue-800" }
    case "ONLINE":
      return { icon: "📱", text: "Online", class: "bg-purple-100 text-purple-800" }
    case "INSURANCE":
      return { icon: "🏥", text: "Insurance", class: "bg-orange-100 text-orange-800" }
    default:
      return { icon: "💰", text: method, class: "bg-gray-100 text-gray-800" }
  }
}

// Print receipt
const printReceipt = () => {
  window.print()
}

// Go back
const goBack = () => {
  router.push("/pharmacist/sales_history")
}
</script>

<template>
  <div class="h-full w-full flex flex-col gap-6">
    <!-- Loading State -->
    <div v-if="posStore.loading" class="space-y-4">
      <Skeleton class="h-32 w-full" />
      <Skeleton class="h-64 w-full" />
      <Skeleton class="h-48 w-full" />
    </div>

    <!-- Sale Details -->
    <div v-else-if="sale" class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <Button @click="goBack" variant="ghost" size="sm">
            <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
            Back to Sales
          </Button>
          <div>
            <h1 class="text-3xl font-bold text-gray-800">{{ sale.invoiceNumber }}</h1>
            <p class="text-sm text-gray-600">{{ formatDateTime(sale.createdAt) }}</p>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <Badge :class="getStatusBadge(sale.paymentStatus).class" class="text-sm px-3 py-1">
            {{ getStatusBadge(sale.paymentStatus).text }}
          </Badge>
          <Button @click="printReceipt" variant="outline">
            <Icon name="lucide:printer" class="w-4 h-4 mr-2" />
            Print Receipt
          </Button>
        </div>
      </div>

      <!-- Customer & Payment Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Customer Information -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center">
              <Icon name="lucide:user" class="w-5 h-5 mr-2" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div>
              <p class="text-sm text-gray-600">Name</p>
              <p class="font-semibold">{{ sale.customerName || 'Walk-in Customer' }}</p>
            </div>
            <div v-if="sale.customerPhone">
              <p class="text-sm text-gray-600">Phone</p>
              <p class="font-semibold">{{ sale.customerPhone }}</p>
            </div>
            <div v-if="sale.notes">
              <p class="text-sm text-gray-600">Notes</p>
              <p class="text-sm">{{ sale.notes }}</p>
            </div>
          </CardContent>
        </Card>

        <!-- Payment Information -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center">
              <Icon name="lucide:credit-card" class="w-5 h-5 mr-2" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div>
              <p class="text-sm text-gray-600">Payment Method</p>
              <Badge :class="getPaymentMethodBadge(sale.paymentMethod).class" class="text-sm px-3 py-1">
                {{ getPaymentMethodBadge(sale.paymentMethod).icon }}
                {{ getPaymentMethodBadge(sale.paymentMethod).text }}
              </Badge>
            </div>
            <div>
              <p class="text-sm text-gray-600">Amount Paid</p>
              <p class="text-2xl font-bold text-green-600">{{ formatCurrency(sale.amountPaid) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Change Given</p>
              <p class="text-xl font-semibold text-purple-600">{{ formatCurrency(sale.changeGiven) }}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Items Table -->
      <Card>
        <CardHeader>
          <CardTitle>Items ({{ sale.items?.length || 0 }})</CardTitle>
          <CardDescription>Products sold in this transaction</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead class="text-center">Form</TableHead>
                  <TableHead class="text-center">Quantity</TableHead>
                  <TableHead class="text-right">Unit Price</TableHead>
                  <TableHead class="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="item in sale.items" :key="item.id">
                  <TableCell>
                    <div>
                      <p class="font-semibold">{{ item.pharmacyItem.name }}</p>
                      <p class="text-sm text-gray-600">{{ item.pharmacyItem.strength }} {{ item.pharmacyItem.unit }}</p>
                    </div>
                  </TableCell>
                  <TableCell>{{ item.pharmacyItem.brand.name }}</TableCell>
                  <TableCell class="text-center">
                    <Badge variant="outline">{{ item.pharmacyItem.form }}</Badge>
                  </TableCell>
                  <TableCell class="text-center font-medium">{{ item.quantity }}</TableCell>
                  <TableCell class="text-right">{{ formatCurrency(item.unitPrice) }}</TableCell>
                  <TableCell class="text-right font-semibold">{{ formatCurrency(item.subtotal) }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <!-- Payment Summary -->
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3 max-w-md ml-auto">
            <div class="flex justify-between text-base">
              <span class="text-gray-600">Subtotal:</span>
              <span class="font-medium">{{ formatCurrency(sale.subtotal) }}</span>
            </div>
            
            <div v-if="sale.discount > 0" class="flex justify-between text-base text-red-600">
              <span>Discount:</span>
              <span class="font-medium">-{{ formatCurrency(sale.discount) }}</span>
            </div>
            
            <div v-if="sale.tax > 0" class="flex justify-between text-base">
              <span class="text-gray-600">Tax:</span>
              <span class="font-medium">{{ formatCurrency(sale.tax) }}</span>
            </div>
            
            <div class="border-t pt-3 flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span class="text-blue-600">{{ formatCurrency(sale.total) }}</span>
            </div>
            
            <div class="border-t pt-3 space-y-2">
              <div class="flex justify-between text-lg">
                <span class="text-gray-600">Amount Paid:</span>
                <span class="font-semibold text-green-600">{{ formatCurrency(sale.amountPaid) }}</span>
              </div>
              
              <div class="flex justify-between text-lg">
                <span class="text-gray-600">Change Given:</span>
                <span class="font-semibold text-purple-600">{{ formatCurrency(sale.changeGiven) }}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Payment History (if any) -->
      <Card v-if="sale.payments && sale.payments.length > 0">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>All payments made for this transaction</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead class="text-right">Amount</TableHead>
                  <TableHead>Transaction ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="payment in sale.payments" :key="payment.id">
                  <TableCell>{{ formatDateTime(payment.paidAt) }}</TableCell>
                  <TableCell>
                    <Badge :class="getPaymentMethodBadge(payment.method).class" variant="outline">
                      {{ getPaymentMethodBadge(payment.method).icon }}
                      {{ getPaymentMethodBadge(payment.method).text }}
                    </Badge>
                  </TableCell>
                  <TableCell class="text-right font-semibold">{{ formatCurrency(payment.amount) }}</TableCell>
                  <TableCell>
                    <span class="font-mono text-sm">{{ payment.transactionId || '—' }}</span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Error State -->
    <div v-else class="flex flex-col items-center justify-center p-12">
      <Icon name="lucide:alert-circle" class="w-16 h-16 text-red-500 mb-4" />
      <h2 class="text-2xl font-semibold text-gray-800 mb-2">Sale Not Found</h2>
      <p class="text-gray-600 mb-6">The sale you're looking for doesn't exist or has been deleted.</p>
      <Button @click="goBack">
        <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
        Back to Sales History
      </Button>
    </div>
  </div>
</template>

<style>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
