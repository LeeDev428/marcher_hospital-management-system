<script setup lang="ts">
import { usePartnerClaimRequestStore } from "@/stores/partner"
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

const claimRequestStore = usePartnerClaimRequestStore()

const onEdit = (id: string) => {
  navigateTo(`/partner/claim-requests/${id}`)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount / 100)
}

onMounted(async () => {
  await claimRequestStore.getClaimRequests()
})
</script>

<template>
  <div v-if="claimRequestStore.loading" class="flex flex-col gap-2">
    <Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
  </div>
  <div v-else>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Partner</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Items Count</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="request in claimRequestStore.claimRequests" :key="request.id">
          <TableCell>{{ request.partner.organizationName }}</TableCell>
          <TableCell>
            <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {{ request.partner.type.replace('_', ' ') }}
            </span>
          </TableCell>
          <TableCell>
            <span
                  class="px-2 py-1 rounded-full text-xs font-medium" 
                  :class="{
                    'bg-green-100 text-green-800': request.status === 'APPROVED',
                    'bg-yellow-100 text-yellow-800': request.status === 'PENDING',
                    'bg-red-100 text-red-800': request.status === 'REJECTED'
                  }">
              {{ request.status }}
            </span>
          </TableCell>
          <TableCell>{{ formatCurrency(request.amount) }}</TableCell>
          <TableCell>{{ request.items?.length || 0 }}</TableCell>
          <TableCell>{{ new Date(request.createdAt).toLocaleDateString() }}</TableCell>
          <TableCell class="flex gap-2">
            <Button variant="outline" size="icon" @click="onEdit(request.id)">
              <Icon name="mdi:eye" />
            </Button>
            <Button variant="outline" size="icon" @click="claimRequestStore.deleteClaimRequest({ id: request.id })">
              <Icon name="mdi:trash" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>