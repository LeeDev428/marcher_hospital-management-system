<template>
  <NuxtLayout name="admin" title="Insurance Claims">
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Insurance Claims</h1>
          <p class="text-sm text-gray-600 mt-1">View and monitor insurance claims submitted by billing staff</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent class="p-4">
            <div class="text-sm text-gray-600">Total Claims</div>
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
            <div class="text-sm text-gray-600">Total Approved Amount</div>
            <div class="text-2xl font-bold text-blue-600">{{ peso(stats.approvedAmount) }}</div>
          </CardContent>
        </Card>
      </div>

      <!-- Claims Table -->
      <Card>
        <CardContent class="p-6">
          <div class="space-y-4">
            <!-- Search and Filter -->
            <div class="flex gap-4">
              <div class="flex-1">
                <Input
                  v-model="search"
                  placeholder="Search by claim number, patient name, insurance provider..."
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
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="DENIED">Denied</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Table -->
            <div class="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow class="bg-gray-50">
                    <TableHead>Claim Number</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Insurance Provider</TableHead>
                    <TableHead class="text-right">Claim Amount</TableHead>
                    <TableHead class="text-right">Approved Amount</TableHead>
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
                  <TableRow v-else-if="filteredClaims.length === 0">
                    <TableCell colspan="7" class="text-center py-8 text-gray-500">
                      No insurance claims found
                    </TableCell>
                  </TableRow>
                  <TableRow v-else v-for="claim in paginatedClaims" :key="claim.id" class="hover:bg-gray-50">
                    <TableCell class="font-mono text-sm">{{ claim.claimNumber }}</TableCell>
                    <TableCell>
                      <div class="font-medium">{{ claim.patientName }}</div>
                      <div class="text-sm text-gray-500">{{ claim.insuranceNumber || 'N/A' }}</div>
                    </TableCell>
                    <TableCell>{{ claim.insuranceProvider }}</TableCell>
                    <TableCell class="text-right font-medium">{{ peso(claim.claimAmount) }}</TableCell>
                    <TableCell class="text-right font-medium text-green-600">
                      {{ claim.approvedAmount ? peso(claim.approvedAmount) : '-' }}
                    </TableCell>
                    <TableCell>
                      <Badge :variant="getStatusVariant(claim.status)">
                        {{ claim.status }}
                      </Badge>
                    </TableCell>
                    <TableCell>{{ formatDate(claim.submittedAt) }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-600">
                Showing {{ ((currentPage - 1) * pageSize) + 1 }} to {{ Math.min(currentPage * pageSize, filteredClaims.length) }} of {{ filteredClaims.length }} results
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
const claims = ref<any[]>([])
const search = ref('')
const filterStatus = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)

// Computed
const stats = computed(() => {
  return {
    total: claims.value.length,
    pending: claims.value.filter(c => c.status === 'PENDING' || c.status === 'SUBMITTED').length,
    approved: claims.value.filter(c => c.status === 'APPROVED').length,
    approvedAmount: claims.value
      .filter(c => c.status === 'APPROVED')
      .reduce((sum, c) => sum + (Number(c.approvedAmount) || 0), 0)
  }
})

const filteredClaims = computed(() => {
  let result = claims.value

  // Filter by status
  if (filterStatus.value !== 'all') {
    result = result.filter(c => c.status === filterStatus.value)
  }

  // Search
  if (search.value) {
    const query = search.value.toLowerCase()
    result = result.filter(c =>
      c.claimNumber.toLowerCase().includes(query) ||
      c.patientName.toLowerCase().includes(query) ||
      c.insuranceProvider.toLowerCase().includes(query)
    )
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredClaims.value.length / pageSize.value))

const paginatedClaims = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredClaims.value.slice(start, start + pageSize.value)
})

// Methods
const fetchClaims = async () => {
  loading.value = true
  try {
    const { success, data } = await $trpc.insurance.claims.getInsuranceClaims.query()
    if (success && data) {
      claims.value = data
    }
  } catch (error) {
    console.error('Error fetching insurance claims:', error)
  } finally {
    loading.value = false
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'APPROVED': return 'success'
    case 'DENIED': return 'destructive'
    case 'SUBMITTED': return 'default'
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
  fetchClaims()
})
</script>
