<script setup lang="ts">
import { useInsuranceClaimItemStore } from "@/stores/insurance"
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

const insuranceClaimItemStore = useInsuranceClaimItemStore()

const onEdit = async (id: string) => {
  await navigateTo(`/insurance/claim-items/${id}`)
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
  await insuranceClaimItemStore.getInsuranceClaimItems()
})
</script>

<template>
  <div v-if="insuranceClaimItemStore.loading" class="flex flex-col gap-2">
    <Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
  </div>
  <div v-else>
    <Table>
      <TableHeader>
        <TableRow>
          <!-- <TableHead>ID</TableHead> -->
          <TableHead>Name</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Claim Status</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in insuranceClaimItemStore.claimItems" :key="item.id">
          <!-- <TableCell>{{ item.id }}</TableCell> -->
          <TableCell>{{ item.name }}</TableCell>
          <TableCell>{{ item.claim.provider.name }}</TableCell>
          <TableCell>
            <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.claim.status)}`">
              {{ item.claim.status }}
            </span>
          </TableCell>
          <TableCell>P{{ item.amount.toLocaleString() }}</TableCell>
          <TableCell>{{ item.description || 'N/A' }}</TableCell>
          <TableCell class="flex gap-2">
            <Button variant="outline" size="icon" @click="onEdit(item.id)">
              <Icon name="mdi:pencil" />
            </Button>
            <Button variant="outline" size="icon" @click="insuranceClaimItemStore.deleteInsuranceClaimItem(item.id)">
              <Icon name="mdi:trash" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>