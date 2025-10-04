<script setup lang="ts">
import { useTransactionStore } from "@/stores/billing"
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

const transactionStore = useTransactionStore()

const onEdit = async (id: string) => {
  await navigateTo(`/billing/transactions/${id}`)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED': return 'bg-green-100 text-green-800'
    case 'FAILED': return 'bg-red-100 text-red-800'
    case 'PENDING': return 'bg-yellow-100 text-yellow-800'
    case 'PROCESSING': return 'bg-blue-100 text-blue-800'
    case 'CANCELLED': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

onMounted(async () => {
  await transactionStore.getTransactions()
})
</script>

<template>
  <div v-if="transactionStore.loading" class="flex flex-col gap-2">
    <Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
  </div>
  <div v-else>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Payments</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="transaction in transactionStore.transactions" :key="transaction.id">
          <TableCell>
            {{ transaction.encounter.patient.firstName }} {{ transaction.encounter.patient.lastName }}
          </TableCell>
          <TableCell>
            <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`">
              {{ transaction.status }}
            </span>
          </TableCell>
          <TableCell>{{ transaction.items?.length || 0 }} items</TableCell>
          <TableCell>{{ transaction.payments?.length || 0 }} payments</TableCell>
          <TableCell>{{ new Date(transaction.createdAt).toLocaleDateString() }}</TableCell>
          <TableCell class="flex gap-2">
            <Button variant="outline" size="icon" @click="onEdit(transaction.id)">
              <Icon name="mdi:pencil" />
            </Button>
            <Button variant="outline" size="icon" @click="transactionStore.deleteTransaction(transaction.id)">
              <Icon name="mdi:trash" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>