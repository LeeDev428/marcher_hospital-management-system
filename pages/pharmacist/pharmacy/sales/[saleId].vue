<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { usePOSStore } from "@/stores/pharmacy"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

definePageMeta({
  layout: "pharmacist",
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

// Format date and time
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
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

// Print receipt
const printReceipt = () => {
  window.print()
}

// Calculate change
const calculateChange = computed(() => {
  if (!sale.value || !sale.value.payments || sale.value.payments.length === 0) return 0
  const totalPaid = sale.value.payments.reduce((sum, payment) => sum + Number(payment.amount), 0)
  return Math.max(0, totalPaid - Number(sale.value.total))
})

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
      <Card class="mb-6 shadow-2xl border-2">
        <!-- Receipt Header -->
        <CardHeader class="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white print:bg-white print:text-black border-b-4 border-blue-900 print:border-gray-300">
          <div class="text-center space-y-3">
            <!-- Hospital Logo/Icon -->
            <div class="inline-block p-3 bg-white/10 rounded-full print:bg-gray-100 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 print:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h2 class="text-3xl font-bold tracking-wide print:text-black">MARCHER HOSPITAL</h2>
              <p class="text-sm font-semibold uppercase tracking-wider mt-1 print:text-gray-600">Pharmacy Department</p>
              <p class="text-xs mt-2 opacity-90 print:text-gray-500">123 Medical Center Drive, Healthcare City, Philippines</p>
              <p class="text-xs opacity-90 print:text-gray-500">Tel: (02) 8123-4567 | pharmacy@marcherhospital.ph</p>
            </div>
            <div class="pt-4 mt-4 border-t border-white/30 print:border-gray-300">
              <p class="text-sm font-semibold uppercase tracking-wider print:text-gray-600">Official Receipt</p>
              <p class="text-4xl font-bold tracking-wider mt-2 print:text-black">{{ sale.invoiceNumber }}</p>
              <p class="text-sm mt-2 opacity-90 print:text-gray-600">
                <span class="font-semibold">Date:</span> {{ formatDate(sale.createdAt) }} | 
                <span class="font-semibold">Time:</span> {{ formatTime(sale.createdAt) }}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent class="p-8 space-y-8">
          <!-- Transaction Details -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b-2 border-gray-200">
            <!-- Customer Information -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wide">Customer</h3>
              </div>
              <div v-if="sale.customerName" class="space-y-1 pl-7">
                <p class="font-semibold text-base text-gray-900">{{ sale.customerName }}</p>
                <p class="text-sm text-gray-600 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {{ sale.customerPhone }}
                </p>
              </div>
              <div v-else class="pl-7">
                <Badge class="bg-gray-100 text-gray-600 border border-gray-300">Walk-in Customer</Badge>
              </div>
            </div>

            <!-- Payment Information -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wide">Payment</h3>
              </div>
              <div class="space-y-2 pl-7">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-600">Method:</span>
                  <Badge class="bg-blue-500 text-white font-semibold">
                    <span class="mr-1">{{ getPaymentIcon(sale.paymentMethod) }}</span>
                    {{ sale.paymentMethod }}
                  </Badge>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-600">Status:</span>
                  <Badge :class="getStatusBadge(sale.paymentStatus).class" class="font-semibold">
                    {{ getStatusBadge(sale.paymentStatus).text }}
                  </Badge>
                </div>
              </div>
            </div>

            <!-- Transaction Info -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wide">Transaction</h3>
              </div>
              <div class="space-y-1 pl-7 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Sale ID:</span>
                  <span class="font-mono text-gray-900">{{ sale.id.slice(0, 8) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Items:</span>
                  <span class="font-semibold text-gray-900">{{ sale.items.length }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Processed:</span>
                  <span class="font-semibold text-gray-900">{{ formatTime(sale.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Items Table -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 class="text-lg font-bold text-gray-700 uppercase tracking-wide">Purchased Items</h3>
            </div>
            <div class="border-2 border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow class="bg-gray-50 border-b-2 border-gray-200">
                    <TableHead class="font-bold text-gray-700">#</TableHead>
                    <TableHead class="font-bold text-gray-700">Item Description</TableHead>
                    <TableHead class="text-center font-bold text-gray-700">Qty</TableHead>
                    <TableHead class="text-right font-bold text-gray-700">Unit Price</TableHead>
                    <TableHead class="text-right font-bold text-gray-700">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="(item, index) in sale.items" :key="item.id" class="hover:bg-gray-50 border-b border-gray-100">
                    <TableCell class="font-semibold text-gray-600">{{ index + 1 }}</TableCell>
                    <TableCell>
                      <div class="space-y-1">
                        <p class="font-semibold text-gray-900">{{ item.pharmacyItem.name }}</p>
                        <div class="flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline" class="bg-blue-50 text-blue-700 border-blue-200">
                            {{ item.pharmacyItem.brand.name }}
                          </Badge>
                          <Badge variant="outline" class="bg-purple-50 text-purple-700 border-purple-200">
                            {{ item.pharmacyItem.strength }}
                          </Badge>
                          <Badge variant="outline" class="bg-green-50 text-green-700 border-green-200">
                            {{ item.pharmacyItem.form }}
                          </Badge>
                          <Badge v-if="(item.pharmacyItem as any).route" variant="outline" class="bg-orange-50 text-orange-700 border-orange-200">
                            {{ (item.pharmacyItem as any).route }}
                          </Badge>
                        </div>
                        <p v-if="(item.pharmacyItem as any).sku" class="text-xs text-gray-500 font-mono">
                          SKU: {{ (item.pharmacyItem as any).sku }}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell class="text-center">
                      <Badge class="bg-gray-100 text-gray-900 font-bold text-base">
                        {{ item.quantity }}
                      </Badge>
                    </TableCell>
                    <TableCell class="text-right font-medium text-gray-700">
                      {{ formatCurrency(item.unitPrice) }}
                    </TableCell>
                    <TableCell class="text-right font-bold text-gray-900">
                      {{ formatCurrency(item.subtotal) }}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <!-- Totals Section -->
          <div class="border-t-2 border-gray-200 pt-6">
            <div class="max-w-md ml-auto space-y-4">
              <div class="space-y-3 text-base">
                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                  <span class="text-gray-600 font-medium">Subtotal:</span>
                  <span class="font-semibold text-gray-900">{{ formatCurrency(sale.subtotal) }}</span>
                </div>
                <div v-if="sale.discount > 0" class="flex justify-between items-center py-2 border-b border-gray-200 text-green-600">
                  <span class="font-medium flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Discount:
                  </span>
                  <span class="font-bold">- {{ formatCurrency(sale.discount) }}</span>
                </div>
                <div v-if="sale.tax > 0" class="flex justify-between items-center py-2 border-b border-gray-200">
                  <span class="text-gray-600 font-medium">Tax (VAT):</span>
                  <span class="font-semibold text-gray-900">{{ formatCurrency(sale.tax) }}</span>
                </div>
              </div>
              
              <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-200 mt-4">
                <div class="flex justify-between items-center">
                  <span class="text-xl font-bold text-gray-700 uppercase">Total Amount:</span>
                  <span class="text-3xl font-bold text-blue-600">{{ formatCurrency(sale.total) }}</span>
                </div>
              </div>

              <!-- Payment Details -->
              <div v-if="sale.payments && sale.payments.length > 0" class="bg-green-50 p-4 rounded-lg border border-green-200 mt-4 space-y-2">
                <div class="flex justify-between items-center text-base">
                  <span class="font-semibold text-gray-700">Amount Paid:</span>
                  <span class="font-bold text-gray-900">
                    {{ formatCurrency(sale.payments.reduce((sum, p) => sum + Number(p.amount), 0)) }}
                  </span>
                </div>
                <div v-if="calculateChange > 0" class="flex justify-between items-center text-base pt-2 border-t border-green-300">
                  <span class="font-semibold text-green-700">Change:</span>
                  <span class="font-bold text-green-600 text-xl">{{ formatCurrency(calculateChange) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes Section -->
          <div v-if="sale.notes" class="border-t-2 border-gray-200 pt-6">
            <div class="flex items-start gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wide">Additional Notes</h3>
            </div>
            <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 ml-7">
              <p class="text-gray-700 text-sm leading-relaxed">{{ sale.notes }}</p>
            </div>
          </div>

          <!-- Important Information -->
          <div class="border-t-2 border-gray-200 pt-6 space-y-4">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h4 class="font-bold text-blue-900 text-sm mb-2">IMPORTANT REMINDERS:</h4>
              <ul class="text-xs text-blue-800 space-y-1 list-disc list-inside">
                <li>Please take medications as prescribed by your physician</li>
                <li>Keep medicines in a cool, dry place away from children</li>
                <li>Check expiration dates before use</li>
                <li>Present this receipt for warranty and returns (within 7 days for sealed items)</li>
              </ul>
            </div>
          </div>

          <!-- Footer -->
          <div class="border-t-2 border-gray-200 pt-6 space-y-4">
            <div class="text-center space-y-2">
              <p class="text-lg font-semibold text-gray-900">Thank you for choosing Marcher Hospital!</p>
              <p class="text-sm text-gray-600">Your health is our priority. Get well soon!</p>
            </div>
            <div class="flex items-center justify-center gap-2 text-xs text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>This is an official computer-generated receipt. No signature required.</span>
            </div>
            <div class="text-center text-xs text-gray-400 pt-2">
              <p>Generated on {{ formatDateTime(sale.createdAt) }}</p>
              <p class="mt-1">Marcher Hospital Management System v2.0</p>
            </div>
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
                <TableHead class="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="payment in sale.payments" :key="payment.id">
                <TableCell>{{ formatDate(payment.paidAt) }}</TableCell>
                <TableCell>
                  <Badge class="bg-blue-100 text-blue-800">{{ payment.method }}</Badge>
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
