<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { usePOSStore } from "@/stores/pharmacy"
import { useBreadcrumbsStore } from "@/stores/app"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"

definePageMeta({
  layout: "staff",
  middleware: ["auth"],
})

const breadcrumbsStore = useBreadcrumbsStore()
const posStore = usePOSStore()

// Fetch available items on mount
onMounted(() => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Billing (POS)", link: "/staff/billing" },
  ])
  posStore.fetchAvailableItems()
})

// Search debounce
const searchQuery = ref("")
let searchTimeout: NodeJS.Timeout | null = null

const handleSearch = (value: string) => {
  searchQuery.value = value
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    posStore.setSearch(value)
  }, 300)
}

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount)
}

// Stock badge color
const getStockBadge = (stock: number) => {
  if (stock === 0) return { text: "Out of Stock", class: "bg-red-500" }
  if (stock < 10) return { text: `Low Stock: ${stock}`, class: "bg-yellow-500" }
  return { text: `In Stock: ${stock}`, class: "bg-green-500" }
}

// Checkout handler
const handleCheckout = async () => {
  const sale = await posStore.checkout()
  if (sale) {
    // Navigate to receipt page
    await navigateTo(`/staff/pharmacy/sales/${sale.id}`)
  }
}

useHead({
  title: 'Staff Billing - POS'
})
</script>

<template>
  <div class="h-full w-full flex flex-col bg-white p-6">
    <div class="container mx-auto max-w-screen-2xl">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Point of Sale (POS)</h1>
        <p class="text-gray-500 mt-1">Pharmacy Billing System</p>
      </div>

      <!-- Main Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Panel: Available Items -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Search Bar -->
          <Card>
            <CardContent class="p-4">
              <div class="flex gap-3">
                <Input
                  :model-value="searchQuery"
                  @update:model-value="(val: any) => handleSearch(String(val))"
                  placeholder="Search by name, strength, or SKU..."
                  class="flex-1"
                />
                <Button variant="outline" @click="posStore.fetchAvailableItems()">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- Items Grid -->
          <div v-if="posStore.loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Card v-for="i in 6" :key="i">
              <CardContent class="p-4">
                <Skeleton class="h-24 w-full" />
              </CardContent>
            </Card>
          </div>

          <div v-else-if="posStore.availableItems.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p class="text-gray-600 text-lg">No items available</p>
            <p class="text-gray-400 text-sm">Try adjusting your search or filters</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Card
              v-for="item in posStore.availableItems"
              :key="item.id"
              class="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
              @click="posStore.addToCart(item)"
            >
              <CardHeader class="pb-3">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <CardTitle class="text-base font-semibold text-gray-900">{{ item.name }}</CardTitle>
                    <p class="text-sm text-gray-500 mt-1">{{ item.brand.name }}</p>
                  </div>
                  <Badge :class="getStockBadge(item.stock).class" class="text-xs text-white">
                    {{ getStockBadge(item.stock).text }}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent class="pt-0">
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Strength:</span>
                    <span class="font-medium">{{ item.strength }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Form:</span>
                    <span class="font-medium">{{ item.form }}</span>
                  </div>
                  <div class="flex justify-between items-center pt-2 border-t">
                    <span class="text-lg font-bold text-blue-600">{{ formatCurrency(Number(item.price || 0)) }}</span>
                    <span class="text-xs text-gray-500">per {{ item.unit }}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- Right Panel: Cart -->
        <div class="lg:col-span-1">
          <Card class="sticky top-6">
            <CardHeader class="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardTitle class="flex items-center justify-between">
                <span>Shopping Cart</span>
                <Badge class="bg-white text-blue-600 text-sm">{{ posStore.cartItemCount }} items</Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent class="p-4 max-h-[500px] overflow-y-auto">
              <!-- Empty Cart State -->
              <div v-if="posStore.cart.length === 0" class="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p class="text-gray-500">Your cart is empty</p>
                <p class="text-gray-400 text-sm mt-1">Add items to get started</p>
              </div>

              <!-- Cart Items -->
              <div v-else class="space-y-3">
                <div
                  v-for="item in posStore.cart"
                  :key="item.pharmacyItemId"
                  class="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                      <p class="font-medium text-sm text-gray-900">{{ item.name }}</p>
                      <p class="text-xs text-gray-500">{{ item.strength }} / {{ item.unit }}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      class="h-6 w-6 p-0 hover:bg-red-100"
                      @click="posStore.removeFromCart(item.pharmacyItemId)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        class="h-7 w-7 p-0"
                        @click="posStore.updateQuantity(item.pharmacyItemId, item.quantity - 1)"
                      >
                        -
                      </Button>
                      <Input
                        :model-value="item.quantity"
                        @update:model-value="(val) => posStore.updateQuantity(item.pharmacyItemId, Number(val))"
                        type="number"
                        min="1"
                        :max="item.availableStock"
                        class="h-7 w-14 text-center p-1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        class="h-7 w-7 p-0"
                        @click="posStore.updateQuantity(item.pharmacyItemId, item.quantity + 1)"
                      >
                        +
                      </Button>
                    </div>
                    <p class="font-semibold text-blue-600">{{ formatCurrency(item.subtotal) }}</p>
                  </div>
                </div>
              </div>
            </CardContent>

            <!-- Cart Summary & Checkout -->
            <CardFooter class="flex-col p-4 bg-gray-50 border-t space-y-3">
              <!-- Customer Info -->
              <div class="w-full space-y-2">
                <Label class="text-xs text-gray-600">Customer Info (Optional)</Label>
                <Input
                  :model-value="posStore.customerName || ''"
                  @update:model-value="(val) => posStore.customerName = String(val)"
                  placeholder="Customer Name"
                  class="h-9 text-sm"
                />
                <Input
                  :model-value="posStore.customerPhone || ''"
                  @update:model-value="(val) => posStore.customerPhone = String(val)"
                  placeholder="Phone Number"
                  class="h-9 text-sm"
                />
              </div>

              <!-- Payment Method -->
              <div class="w-full space-y-2">
                <Label class="text-xs text-gray-600">Payment Method</Label>
                <Select v-model="posStore.paymentMethod">
                  <SelectTrigger class="h-9">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                    <SelectItem value="ONLINE">Online</SelectItem>
                    <SelectItem value="INSURANCE">Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Discount & Tax -->
              <div class="w-full grid grid-cols-2 gap-2">
                <div class="space-y-1">
                  <Label class="text-xs text-gray-600">Discount</Label>
                  <Input
                    v-model.number="posStore.discount"
                    type="number"
                    min="0"
                    placeholder="0"
                    class="h-9 text-sm"
                  />
                </div>
                <div class="space-y-1">
                  <Label class="text-xs text-gray-600">Tax</Label>
                  <Input
                    v-model.number="posStore.tax"
                    type="number"
                    min="0"
                    placeholder="0"
                    class="h-9 text-sm"
                  />
                </div>
              </div>

              <!-- Notes -->
              <div class="w-full space-y-1">
                <Label class="text-xs text-gray-600">Notes</Label>
                <Textarea
                  :model-value="posStore.notes || ''"
                  @update:model-value="(val) => posStore.notes = String(val)"
                  placeholder="Add notes..."
                  class="h-16 text-sm resize-none"
                />
              </div>

              <!-- Payment Amount -->
              <div class="w-full space-y-1">
                <Label class="text-xs text-gray-600">Amount Paid</Label>
                <Input
                  v-model.number="posStore.amountPaid"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter amount paid"
                  class="h-10 text-base font-semibold"
                />
              </div>

              <!-- Totals -->
              <div class="w-full space-y-2 pt-2 border-t">
                <div class="flex justify-between text-sm text-gray-600">
                  <span>Subtotal:</span>
                  <span>{{ formatCurrency(posStore.cartSubtotal) }}</span>
                </div>
                <div v-if="posStore.discount > 0" class="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span>- {{ formatCurrency(posStore.discount) }}</span>
                </div>
                <div v-if="posStore.tax > 0" class="flex justify-between text-sm text-gray-600">
                  <span>Tax:</span>
                  <span>{{ formatCurrency(posStore.tax) }}</span>
                </div>
                <div class="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                  <span>Total:</span>
                  <span class="text-blue-600">{{ formatCurrency(posStore.cartTotal) }}</span>
                </div>
                <div v-if="posStore.amountPaid > 0" class="flex justify-between text-base font-semibold pt-1" :class="posStore.change >= 0 ? 'text-green-600' : 'text-red-600'">
                  <span>Change:</span>
                  <span>{{ formatCurrency(posStore.change) }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="w-full flex gap-2">
                <Button
                  variant="outline"
                  class="flex-1"
                  @click="posStore.clearCart()"
                  :disabled="!posStore.hasItems"
                >
                  Clear
                </Button>
                <Button
                  class="flex-1 bg-blue-600 hover:bg-blue-700"
                  @click="handleCheckout"
                  :disabled="!posStore.hasItems || posStore.loading || posStore.amountPaid < posStore.cartTotal"
                  :title="posStore.amountPaid < posStore.cartTotal ? 'Payment amount is insufficient' : ''"
                >
                  <span v-if="posStore.loading">Processing...</span>
                  <span v-else>Checkout</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for cart */
.max-h-\[500px\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[500px\]::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.max-h-\[500px\]::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.max-h-\[500px\]::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>