<template>
  <NuxtLayout name="admin" title="Data Sharing Requests">
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Data Sharing Requests</h1>
          <p class="text-sm text-gray-600 mt-1">View and monitor patient data sharing requests to partner hospitals</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent class="p-4">
            <div class="text-sm text-gray-600">Total Requests</div>
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
            <div class="text-sm text-gray-600">Approved</div>
            <div class="text-2xl font-bold text-green-600">{{ stats.approved }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <div class="text-sm text-gray-600">Accessed</div>
            <div class="text-2xl font-bold text-blue-600">{{ stats.accessed }}</div>
          </CardContent>
        </Card>
      </div>

      <!-- Requests Table -->
      <Card>
        <CardContent class="p-6">
          <div class="space-y-4">
            <!-- Search and Filter -->
            <div class="flex gap-4">
              <div class="flex-1">
                <Input
                  v-model="search"
                  placeholder="Search by request number, patient name, hospital name..."
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
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="DENIED">Denied</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Table -->
            <div class="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow class="bg-gray-50">
                    <TableHead>Request Number</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Requesting Hospital</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Patient Consent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-if="loading">
                    <TableCell colspan="7" class="text-center py-8">
                      <div class="flex items-center justify-center gap-2">
                        <Icon name="mdi:loading" class="animate-spin" />
                        Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow v-else-if="filteredRequests.length === 0">
                    <TableCell colspan="7" class="text-center py-8 text-gray-500">
                      No data sharing requests found
                    </TableCell>
                  </TableRow>
                  <TableRow v-else v-for="request in paginatedRequests" :key="request.id" class="hover:bg-gray-50">
                    <TableCell class="font-mono text-sm">{{ request.requestNumber }}</TableCell>
                    <TableCell>
                      <div class="font-medium">{{ request.patientName }}</div>
                      <div class="text-sm text-gray-500">ID: {{ request.patientId }}</div>
                    </TableCell>
                    <TableCell>
                      <div class="font-medium">{{ request.hospitalName }}</div>
                      <div class="text-sm text-gray-500">{{ request.hospitalEmail }}</div>
                    </TableCell>
                    <TableCell class="max-w-xs truncate">{{ request.reason }}</TableCell>
                    <TableCell>
                      <Badge :variant="request.patientConsent ? 'success' : 'destructive'">
                        {{ request.patientConsent ? 'Yes' : 'No' }}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge :variant="getStatusVariant(request.status)">
                        {{ request.status }}
                      </Badge>
                    </TableCell>
                    <TableCell>{{ formatDate(request.submittedAt) }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-600">
                Showing {{ ((currentPage - 1) * pageSize) + 1 }} to {{ Math.min(currentPage * pageSize, filteredRequests.length) }} of {{ filteredRequests.length }} results
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
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

const { $trpc } = useNuxtApp()

// State
const loading = ref(true)
const requests = ref<any[]>([])
const search = ref('')
const filterStatus = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)

// Computed
const stats = computed(() => {
  return {
    total: requests.value.length,
    pending: requests.value.filter(r => r.status === 'PENDING').length,
    approved: requests.value.filter(r => r.status === 'APPROVED').length,
    accessed: requests.value.filter(r => r.accessedAt !== null).length
  }
})

const filteredRequests = computed(() => {
  let result = requests.value

  // Filter by status
  if (filterStatus.value !== 'all') {
    result = result.filter(r => r.status === filterStatus.value)
  }

  // Search
  if (search.value) {
    const query = search.value.toLowerCase()
    result = result.filter(r =>
      r.requestNumber.toLowerCase().includes(query) ||
      r.patientName.toLowerCase().includes(query) ||
      r.hospitalName.toLowerCase().includes(query)
    )
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredRequests.value.length / pageSize.value))

const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRequests.value.slice(start, start + pageSize.value)
})

// Methods
const fetchRequests = async () => {
  loading.value = true
  try {
    const { success, data } = await $trpc.datashare.getRequests.query({
      page: 1,
      limit: 100
    })
    if (success && data) {
      requests.value = data
    }
  } catch (error) {
    console.error('Error fetching data share requests:', error)
  } finally {
    loading.value = false
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'APPROVED': return 'success'
    case 'DENIED': return 'destructive'
    case 'EXPIRED': return 'secondary'
    case 'PENDING': return 'default'
    default: return 'default'
  }
}

const formatDate = (date: string | null) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  fetchRequests()
})
</script>
