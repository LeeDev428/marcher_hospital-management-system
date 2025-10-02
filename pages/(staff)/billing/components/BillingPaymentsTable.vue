<script setup lang="ts">
import { usePaymentStore } from "@/stores/billing"
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

const paymentStore = usePaymentStore()

const onEdit = async (id: string) => {
  await navigateTo(`/billing/payments/${id}`)
}

onMounted(async () => {
  await paymentStore.getPayments()
})
</script>

<template>
  <div v-if="paymentStore.loading" class="flex flex-col gap-2">
    <Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
  </div>
  <div v-else>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Transaction Status</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Instalments</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="payment in paymentStore.payments" :key="payment.id">
          <TableCell>
            {{ payment.transaction.encounter.patient.firstName }} {{ payment.transaction.encounter.patient.lastName }}
          </TableCell>
          <TableCell>{{ payment.transaction.status }}</TableCell>
          <TableCell>${{ payment.amount.toLocaleString() }}</TableCell>
          <TableCell>{{ payment.instalments?.length || 0 }} instalments</TableCell>
          <TableCell>{{ new Date(payment.createdAt).toLocaleDateString() }}</TableCell>
          <TableCell class="flex gap-2">
            <Button variant="outline" size="icon" @click="onEdit(payment.id)">
              <Icon name="mdi:pencil" />
            </Button>
            <Button variant="outline" size="icon" @click="paymentStore.deletePayment(payment.id)">
              <Icon name="mdi:trash" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>