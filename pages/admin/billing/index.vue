<template>
  <NuxtLayout name="admin" title="Billing Management">
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Billing Management</h1>
          <p class="text-sm text-gray-600 mt-1">Create and manage patient billing transactions</p>
        </div>
        <Button @click="showCreateDialog = true" class="bg-blue-600 hover:bg-blue-700">
          <Icon name="mdi:plus" class="mr-2" />
          Create New Bill
        </Button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent class="p-4">
            <div class="text-sm text-gray-600">Total Bills</div>
            <div class="text-2xl font-bold text-gray-900">{{ stats.total }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <div class="text-sm text-gray-600">Pending</div>
            <div class="text-2xl font-bold text-yellow-600">{{ stats.pending }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <div class="text-sm text-gray-600">Paid</div>
            <div class="text-2xl font-bold text-green-600">{{ stats.paid }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <div class="text-sm text-gray-600">Total Revenue</div>
            <div class="text-2xl font-bold text-blue-600">{{ peso(stats.revenue) }}</div>
          </CardContent>
        </Card>
      </div>

      <!-- Billing Table -->
      <Card>
        <CardContent class="p-6">
          <div class="space-y-4">
            <!-- Search and Filter -->
            <div class="flex gap-4">
              <div class="flex-1">
                <Input
                  v-model="search"
                  placeholder="Search by patient name, transaction ID..."
                  class="w-full"
                />
              </div>
              <Select v-model="filterStatus">
                <SelectTrigger class="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Table -->
            <div class="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow class="bg-gray-50">
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead class="text-right">Total Amount</TableHead>
                    <TableHead class="text-right">Paid</TableHead>
                    <TableHead class="text-right">Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead class="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-if="loading">
                    <TableCell colspan="8" class="text-center py-8">
                      <div class="flex items-center justify-center gap-2">
                        <Icon name="mdi:loading" class="animate-spin" />
                        Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow v-else-if="filteredBills.length === 0">
                    <TableCell colspan="8" class="text-center py-8 text-gray-500">
                      No bills found
                    </TableCell>
                  </TableRow>
                  <TableRow v-else v-for="bill in paginatedBills" :key="bill.id" class="hover:bg-gray-50">
                    <TableCell class="font-mono text-sm">{{ bill.transactionNumber }}</TableCell>
                    <TableCell>
                      <div class="font-medium">{{ bill.patientName }}</div>
                      <div class="text-sm text-gray-500">{{ bill.patientId }}</div>
                    </TableCell>
                    <TableCell>{{ formatDate(bill.createdAt) }}</TableCell>
                    <TableCell class="text-right font-medium">{{ peso(bill.totalAmount) }}</TableCell>
                    <TableCell class="text-right text-green-600">{{ peso(bill.paidAmount) }}</TableCell>
                    <TableCell class="text-right font-medium">{{ peso(bill.balanceAmount) }}</TableCell>
                    <TableCell>
                      <Badge :variant="getStatusVariant(bill.status)">
                        {{ bill.status }}
                      </Badge>
                    </TableCell>
                    <TableCell class="text-right">
                      <div class="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" @click="viewBill(bill)">
                          <Icon name="mdi:eye" />
                        </Button>
                        <Button size="sm" variant="outline" @click="addItems(bill)" v-if="bill.status !== 'PAID'">
                          <Icon name="mdi:plus" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-600">
                Showing {{ ((currentPage - 1) * pageSize) + 1 }} to {{ Math.min(currentPage * pageSize, filteredBills.length) }} of {{ filteredBills.length }} results
              </div>
              <div class="flex gap-2">
                <Button size="sm" variant="outline" @click="currentPage--" :disabled="currentPage === 1">
                  Previous
                </Button>
                <Button size="sm" variant="outline" @click="currentPage++" :disabled="currentPage >= totalPages">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Create Bill Dialog -->
      <CreateBillDialog
        :open="showCreateDialog"
        @update:open="showCreateDialog = $event"
        @bill-created="handleBillCreated"
      />

      <!-- View Bill Dialog -->
      <ViewBillDialog
        :open="showViewDialog"
        :bill="selectedBill"
        @update:open="showViewDialog = $event"
      />

      <!-- Add Items Dialog -->
      <AddItemsDialog
        :open="showAddItemsDialog"
        :bill="selectedBill"
        @update:open="showAddItemsDialog = $event"
        @items-added="handleItemsAdded"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import CreateBillDialog from './components/CreateBillDialog.vue'
import ViewBillDialog from './components/ViewBillDialog.vue'
import AddItemsDialog from './components/AddItemsDialog.vue'
import { useToast } from '@/composables/useToast'

const { $trpc } = useNuxtApp()

// State
const loading = ref(true)
const bills = ref<any[]>([])
const search = ref('')
const filterStatus = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)

// Dialogs
const showCreateDialog = ref(false)
const showViewDialog = ref(false)
const showAddItemsDialog = ref(false)
const selectedBill = ref<any>(null)

// Computed
const stats = computed(() => {
  return {
    total: bills.value.length,
    pending: bills.value.filter(b => b.status === 'PENDING').length,
    paid: bills.value.filter(b => b.status === 'PAID').length,
    revenue: bills.value.filter(b => b.status === 'PAID').reduce((sum, b) => sum + b.totalAmount, 0)
  }
})

const filteredBills = computed(() => {
  let result = bills.value

  // Filter by status
  if (filterStatus.value !== 'all') {
    result = result.filter(b => b.status === filterStatus.value)
  }

  // Search
  if (search.value) {
    const query = search.value.toLowerCase()
    result = result.filter(b =>
      b.transactionNumber.toLowerCase().includes(query) ||
      b.patientName.toLowerCase().includes(query) ||
      b.patientId.toLowerCase().includes(query)
    )
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredBills.value.length / pageSize.value))

const paginatedBills = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredBills.value.slice(start, start + pageSize.value)
})

// Methods
const fetchBills = async () => {
  loading.value = true
  try {
    const { success, data } = await $trpc.billing.transactions.getAllBills.query()
    
    if (success && data) {
      bills.value = data.map((bill: any) => ({
        id: bill.id,
        transactionNumber: bill.transactionNumber,
        patientName: `${bill.patient.user.firstName} ${bill.patient.user.lastName}`,
        patientId: bill.patientId,
        createdAt: bill.createdAt,
        date: new Date(bill.createdAt).toLocaleDateString('en-PH'),
        totalAmount: Number(bill.totalAmount) || 0,
        paidAmount: Number(bill.paidAmount) || 0,
        balanceAmount: Number(bill.balanceAmount) || 0,
        status: bill.status
      }))
    }
  } catch (error) {
    console.error('Error fetching bills:', error)
    useToast('error', 'Error', 'Failed to load bills')
  } finally {
    loading.value = false
  }
}

const viewBill = (bill: any) => {
  selectedBill.value = bill
  showViewDialog.value = true
}

const addItems = (bill: any) => {
  selectedBill.value = bill
  showAddItemsDialog.value = true
}

const handleBillCreated = () => {
  fetchBills()
  showCreateDialog.value = false
  useToast('success', 'Success', 'Bill created successfully')
}

const handleItemsAdded = () => {
  fetchBills()
  showAddItemsDialog.value = false
  useToast('success', 'Success', 'Items added successfully')
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'PAID': return 'success'
    case 'PARTIALLY_PAID': return 'warning'
    case 'PENDING': return 'secondary'
    default: return 'default'
  }
}

const peso = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  fetchBills()
})
</script>
