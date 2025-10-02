<script setup lang="ts">
import { useInsuranceClaimStore } from "@/stores/insurance"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const insuranceClaimStore = useInsuranceClaimStore()

const onEdit = async (id: string) => {
  await navigateTo(`/insurance/claims/${id}`)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'APPROVED': return 'bg-green-100 text-green-800'
    case 'REJECTED': return 'bg-red-100 text-red-800'
    case 'PENDING': return 'bg-yellow-100 text-yellow-800'
    case 'PROCESSING': return 'bg-blue-100 text-blue-800'
    case 'COMPLETED': return 'bg-green-100 text-green-800'
    case 'CANCELLED': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

onMounted(async () => {
  await insuranceClaimStore.getInsuranceClaims()
})
</script>

<template>
  <div v-if="insuranceClaimStore.loading" class="flex flex-col gap-2">
    <Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
  </div>
  <div v-else>
    <Table>
      <TableHeader>
        <TableRow>
          <!-- <TableHead>ID</TableHead> -->
          <TableHead>Provider</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="claim in insuranceClaimStore.claims" :key="claim.id">
          <!-- <TableCell>{{ claim.id }}</TableCell> -->
          <TableCell>{{ claim.provider.name }}</TableCell>
          <TableCell>
            <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`">
              {{ claim.status }}
            </span>
          </TableCell>
          <TableCell>P{{ claim.amount.toLocaleString() }}</TableCell>
          <TableCell>{{ claim.items?.length || 0 }} items</TableCell>
          <TableCell>{{ new Date(claim.createdAt).toLocaleDateString() }}</TableCell>
          <TableCell class="flex gap-2">
            <Button variant="outline" size="icon" @click="onEdit(claim.id)">
              <Icon name="mdi:pencil" />
            </Button>
            <Button variant="outline" size="icon" @click="insuranceClaimStore.deleteInsuranceClaim(claim.id)">
              <Icon name="mdi:trash" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>