<script setup lang="ts">
import { usePaymentInstalmentStore } from "@/stores/billing"
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

const paymentInstalmentStore = usePaymentInstalmentStore()

const onEdit = async (id: string) => {
  await navigateTo(`/billing/payment-instalments/${id}`)
}

const getPaymentStatus = (amountDue: number, amountPaid: number) => {
  if (amountPaid >= amountDue) return { status: 'PAID', color: 'bg-green-100 text-green-800' }
  if (amountPaid > 0) return { status: 'PARTIAL', color: 'bg-yellow-100 text-yellow-800' }
  return { status: 'UNPAID', color: 'bg-red-100 text-red-800' }
}

onMounted(async () => {
  await paymentInstalmentStore.getPaymentInstalments()
})
</script>

<template>
  <div v-if="paymentInstalmentStore.loading" class="flex flex-col gap-2">
    <Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
  </div>
  <div v-else>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Instalment #</TableHead>
          <TableHead>Amount Due</TableHead>
          <TableHead>Amount Paid</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="instalment in paymentInstalmentStore.paymentInstalments" :key="instalment.id">
          <TableCell>
            {{ instalment.payment.transaction.encounter.patient.firstName }} {{ instalment.payment.transaction.encounter.patient.lastName }}
          </TableCell>
          <TableCell>{{ instalment.plan.name }}</TableCell>
          <TableCell>{{ instalment.instalmentNumber }}</TableCell>
          <TableCell>${{ instalment.amountDue.toLocaleString() }}</TableCell>
          <TableCell>${{ instalment.amountPaid.toLocaleString() }}</TableCell>
          <TableCell>
            <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatus(instalment.amountDue, instalment.amountPaid).color}`">
              {{ getPaymentStatus(instalment.amountDue, instalment.amountPaid).status }}
            </span>
          </TableCell>
          <TableCell>{{ new Date(instalment.createdAt).toLocaleDateString() }}</TableCell>
          <TableCell class="flex gap-2">
            <Button variant="outline" size="icon" @click="onEdit(instalment.id)">
              <Icon name="mdi:pencil" />
            </Button>
            <Button variant="outline" size="icon" @click="paymentInstalmentStore.deletePaymentInstalment(instalment.id)">
              <Icon name="mdi:trash" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>