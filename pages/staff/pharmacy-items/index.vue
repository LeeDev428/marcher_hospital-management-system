<script setup lang="ts">
import { useBreadcrumbsStore } from "@/stores/app"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table"

const breadcrumbsStore = useBreadcrumbsStore()
const { $trpc } = useNuxtApp()

const loading = ref(true)
const pharmacyItems = ref<any[]>([])
const searchQuery = ref("")
const currentPage = ref(1)
const itemsPerPage = 10

const filteredItems = computed(() => {
  if (!searchQuery.value) return pharmacyItems.value
  
  const query = searchQuery.value.toLowerCase()
  return pharmacyItems.value.filter(item => 
    item.name.toLowerCase().includes(query) ||
    item.brand?.name?.toLowerCase().includes(query) ||
    item.category?.name?.toLowerCase().includes(query)
  )
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredItems.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredItems.value.length / itemsPerPage)
)

const fetchPharmacyItems = async () => {
  try {
    loading.value = true
    const response = await $trpc.pharmacy.items.getPharmacyItems.query()
    
    if (response.success && response.data) {
      pharmacyItems.value = response.data
    }
  } catch (error) {
    console.error('Error fetching pharmacy items:', error)
  } finally {
    loading.value = false
  }
}

const formatPrice = (price: any) => {
  if (!price) return '₱0.00'
  return `₱${Number(price).toFixed(2)}`
}

const getStockStatus = (stock: number) => {
  if (stock === 0) return { text: 'Out of Stock', class: 'bg-red-100 text-red-800' }
  if (stock < 10) return { text: 'Low Stock', class: 'bg-orange-100 text-orange-800' }
  return { text: 'In Stock', class: 'bg-green-100 text-green-800' }
}

onMounted(async () => {
  breadcrumbsStore.setBreadcrumbs([
    { label: "Pharmacy Items", link: "/staff/pharmacy-items" },
  ])
  
  await fetchPharmacyItems()
})

useHead({
  title: 'Pharmacy Items'
})
</script>

<template> 
  <NuxtLayout name="staff" title="Pharmacy Items">
    <div class="flex flex-col gap-4">
      <!-- Header Section -->
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Pharmacy Items</h1>
            <p class="text-gray-600 mt-1">
              View available medicines and their stock levels
            </p>
          </div>
        </div>
      </div>

      <!-- Search and Table -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <!-- Search Bar -->
        <div class="mb-4">
          <Input
            v-model="searchQuery"
            placeholder="Search by name, brand, or category..."
            class="max-w-md"
          >
            <template #prefix>
              <Icon name="mdi:magnify" class="text-gray-400" />
            </template>
          </Input>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col gap-2">
          <Skeleton v-for="i in 5" :key="i" class="h-[60px] w-full rounded-md" />
        </div>

        <!-- Table -->
        <div v-else>
          <div v-if="filteredItems.length > 0" class="text-sm text-muted-foreground mb-4">
            Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredItems.length) }} of {{ filteredItems.length }} items
          </div>

          <div v-if="paginatedItems.length > 0" class="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Form</TableHead>
                  <TableHead>Strength</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="item in paginatedItems" :key="item.id">
                  <TableCell class="font-medium">{{ item.name }}</TableCell>
                  <TableCell>{{ item.brand?.name || 'N/A' }}</TableCell>
                  <TableCell>{{ item.category?.name || 'N/A' }}</TableCell>
                  <TableCell>{{ item.form }}</TableCell>
                  <TableCell>{{ item.strength }}</TableCell>
                  <TableCell>{{ item.stock }} {{ item.unit }}</TableCell>
                  <TableCell>{{ formatPrice(item.price) }}</TableCell>
                  <TableCell>
                    <span 
                      :class="getStockStatus(item.stock).class"
                      class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                    >
                      {{ getStockStatus(item.stock).text }}
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div v-else class="text-center py-8 text-gray-500">
            No pharmacy items found matching your search.
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-between mt-4">
            <div class="text-sm text-gray-600">
              Page {{ currentPage }} of {{ totalPages }}
            </div>
            <div class="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                <Icon name="mdi:chevron-left" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                Next
                <Icon name="mdi:chevron-right" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
