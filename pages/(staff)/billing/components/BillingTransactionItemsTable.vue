<script setup lang="ts">
import { useTransactionItemStore } from "@/stores/billing"
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

const transactionItemStore = useTransactionItemStore()

const onEdit = async (id: string) => {
  await navigateTo(`/billing/transaction-items/${id}`)
}

onMounted(async () => {
  await transactionItemStore.getTransactionItems()
})
</script>

<template>
  <div v-if="transactionItemStore.loading" class="flex flex-col gap-2">
    <Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
  </div>
  <div v-else>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Transaction Status</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in transactionItemStore.transactionItems" :key="item.id">
          <TableCell>{{ item.name }}</TableCell>
          <TableCell>
            {{ item.transaction.encounter.patient.firstName }} {{ item.transaction.encounter.patient.lastName }}
          </TableCell>
          <TableCell>{{ item.transaction.status }}</TableCell>
          <TableCell>${{ item.amount.toLocaleString() }}</TableCell>
          <TableCell>{{ item.description || 'N/A' }}</TableCell>
          <TableCell>{{ new Date(item.createdAt).toLocaleDateString() }}</TableCell>
          <TableCell class="flex gap-2">
            <Button variant="outline" size="icon" @click="onEdit(item.id)">
              <Icon name="mdi:pencil" />
            </Button>
            <Button variant="outline" size="icon" @click="transactionItemStore.deleteTransaction(item.id)">
              <Icon name="mdi:trash" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

 
