<script setup lang="ts">
import { usePaymentPlanStore } from "@/stores/billing"
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

const paymentPlanStore = usePaymentPlanStore()

const onEdit = async (id: string) => {
  await navigateTo(`/billing/payment-plans/${id}`)
}

onMounted(async () => {
  await paymentPlanStore.getPaymentPlans()
})
</script>

<template>
  <div v-if="paymentPlanStore.loading" class="flex flex-col gap-2">
    <Skeleton v-for="i in 3" :key="i" class="h-[40px] w-full rounded-md" />
  </div>
  <div v-else>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Cycle</TableHead>
          <TableHead>Number of Payments</TableHead>
          <TableHead>Instalments Count</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="plan in paymentPlanStore.paymentPlans" :key="plan.id">
          <TableCell>{{ plan.name }}</TableCell>
          <TableCell>{{ plan.description || 'N/A' }}</TableCell>
          <TableCell>{{ plan.cycle }}</TableCell>
          <TableCell>{{ plan.numberOfPayments }}</TableCell>
          <TableCell>{{ plan._count?.instalments || 0 }}</TableCell>
          <TableCell>{{ new Date(plan.createdAt).toLocaleDateString() }}</TableCell>
          <TableCell class="flex gap-2">
            <Button variant="outline" size="icon" @click="onEdit(plan.id)">
              <Icon name="mdi:pencil" />
            </Button>
            <Button variant="outline" size="icon" @click="paymentPlanStore.deletePaymentPlan(plan.id)">
              <Icon name="mdi:trash" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>