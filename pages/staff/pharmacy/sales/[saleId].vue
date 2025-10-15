<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { usePOSStore } from "@/stores/pharmacy"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

definePageMeta({
  layout: "staff",
  middleware: ["auth"],
})

const route = useRoute()
const router = useRouter()
const posStore = usePOSStore()
const saleId = computed(() => route.params.saleId as string)

onMounted(() => {
  if (saleId.value) {
    posStore.fetchSale(saleId.value)
  }
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

// Print receipt
const printReceipt = () => {
  window.print()
}

const sale = computed(() => posStore.currentSale)
</script>

<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <!-- Back Button -->
    <Button variant="ghost" @click="router.back()" class="mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </Button>

    <!-- Loading State -->
    <Card v-if="posStore.loading" class="mb-6">
      <CardContent class="p-6 space-y-3">
        <Skeleton class="h-8 w-64" />
        <Skeleton class="h-32 w-full" />
        <Skeleton class="h-48 w-full" />
      </CardContent>
    </Card>

    <!-- Sale Details -->
    <div v-else-if="sale" id="receipt" class="print:p-8">
      <!-- Header Actions (no-print) -->
      <div class="mb-6 flex justify-between items-center print:hidden">
        <h1 class="text-3xl font-bold text-gray-900">Sale Receipt</h1>
        <Button @click="printReceipt" class="bg-blue-600 hover:bg-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Receipt
        </Button>
      </div>

      <!-- Receipt Card -->
      <Card class="mb-6">
        <!-- Receipt Header -->
        <CardHeader class="bg-gradient-to-r from-blue-500 to-blue-600 text-white print:bg-white print:text-black">
          <div class="text-center space-y-2">
            <h2 class="text-2xl font-bold">Marcher Hospital Pharmacy</h2>
            <p class="text-sm opacity-90 print:text-gray-600">Hospital Management System</p>
            <div class="pt-4 border-t border-white/20 print:border-gray-300">
              <p class="text-3xl font-bold">{{ sale.invoiceNumber }}</p>
              <p class="text-sm opacity-90 print:text-gray-600 mt-1">{{ formatDate(sale.createdAt) }}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent class="p-6 space-y-6">
          <!-- Customer & Payment Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b">
            <div>
              <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">Customer Information</h3>
              <div v-if="sale.customerName" class="space-y-1">
                <p class="font-medium text-lg">{{ sale.customerName }}</p>
                <p class="text-gray-600">{{ sale.customerPhone }}</p>
              </div>
              <p v-else class="text-gray-400 italic">Walk-in Customer</p>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">Payment Details</h3>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-gray-600">Method:</span>
                  <Badge class="bg-blue-100 text-blue-800">{{ sale.paymentMethod }}</Badge>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-600">Status:</span>
                  <Badge :class="getStatusBadge(sale.paymentStatus).class">
                    {{ getStatusBadge(sale.paymentStatus).text }}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <!-- Items Table -->
          <div>
            <h3 class="text-sm font-semibold text-gray-500 uppercase mb-3">Items Purchased</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead class="text-center">Qty</TableHead>
                  <TableHead class="text-right">Unit Price</TableHead>
                  <TableHead class="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="item in sale.items" :key="item.id">
                  <TableCell>
                    <div>
                      <p class="font-medium">{{ item.pharmacyItem.name }}</p>
                      <p class="text-sm text-gray-500">
                        {{ item.pharmacyItem.brand.name }} | 
                        {{ item.pharmacyItem.strength }} | 
                        {{ item.pharmacyItem.form }}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell class="text-center font-medium">{{ item.quantity }}</TableCell>
                  <TableCell class="text-right">{{ formatCurrency(item.unitPrice) }}</TableCell>
                  <TableCell class="text-right font-semibold">{{ formatCurrency(item.subtotal) }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <!-- Totals -->
          <div class="border-t pt-6">
            <div class="space-y-3 max-w-md ml-auto">
              <div class="flex justify-between text-lg">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-medium">{{ formatCurrency(sale.subtotal) }}</span>
              </div>
              <div v-if="sale.discount > 0" class="flex justify-between text-lg text-green-600">
                <span>Discount:</span>
                <span class="font-medium">- {{ formatCurrency(sale.discount) }}</span>
              </div>
              <div v-if="sale.tax > 0" class="flex justify-between text-lg">
                <span class="text-gray-600">Tax:</span>
                <span class="font-medium">{{ formatCurrency(sale.tax) }}</span>
              </div>
              <div class="flex justify-between text-2xl font-bold pt-3 border-t">
                <span>Total:</span>
                <span class="text-blue-600">{{ formatCurrency(sale.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="sale.notes" class="border-t pt-6">
            <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">Notes</h3>
            <p class="text-gray-700">{{ sale.notes }}</p>
          </div>

          <!-- Footer -->
          <div class="border-t pt-6 text-center text-sm text-gray-500">
            <p>Thank you for your purchase!</p>
            <p class="mt-1">This is a computer-generated receipt.</p>
          </div>
        </CardContent>
      </Card>

      <!-- Payment History (if multiple payments) -->
      <Card v-if="sale.payments && sale.payments.length > 0" class="print:hidden">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead class="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="payment in sale.payments" :key="payment.id">
                <TableCell>{{ formatDate(payment.paidAt) }}</TableCell>
                <TableCell>
                  <Badge class="bg-blue-100 text-blue-800">{{ payment.method }}</Badge>
                </TableCell>
                <TableCell class="font-mono text-sm">
                  {{ payment.transactionId || "N/A" }}
                </TableCell>
                <TableCell class="text-right font-semibold">
                  {{ formatCurrency(payment.amount) }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>

    <!-- Error State -->
    <Card v-else>
      <CardContent class="p-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-gray-600 text-lg">Sale not found</p>
        <Button @click="router.back()" class="mt-4" variant="outline">Go Back</Button>
      </CardContent>
    </Card>
  </div>
</template>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  #receipt, #receipt * {
    visibility: visible;
  }
  #receipt {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  .print\:hidden {
    display: none !important;
  }
  .print\:p-8 {
    padding: 2rem;
  }
  .print\:bg-white {
    background-color: white !important;
  }
  .print\:text-black {
    color: black !important;
  }
  .print\:text-gray-600 {
    color: #4b5563 !important;
  }
  .print\:border-gray-300 {
    border-color: #d1d5db !important;
  }
}
</style>
