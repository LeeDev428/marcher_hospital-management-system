<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Bill Details</DialogTitle>
        <DialogDescription>
          Transaction: {{ bill?.transactionNumber }}
        </DialogDescription>
      </DialogHeader>

      <div v-if="bill" class="space-y-4 py-4">
        <!-- Patient Info -->
        <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <div class="text-sm text-gray-600">Patient</div>
            <div class="font-medium">{{ bill.patientName }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-600">Date</div>
            <div class="font-medium">{{ formatDate(bill.createdAt) }}</div>
          </div>
        </div>

        <!-- Amounts -->
        <div class="grid grid-cols-3 gap-4">
          <Card>
            <CardContent class="p-4">
              <div class="text-sm text-gray-600">Total Amount</div>
              <div class="text-xl font-bold">{{ peso(bill.totalAmount) }}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="p-4">
              <div class="text-sm text-gray-600">Paid</div>
              <div class="text-xl font-bold text-green-600">{{ peso(bill.paidAmount) }}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="p-4">
              <div class="text-sm text-gray-600">Balance</div>
              <div class="text-xl font-bold text-red-600">{{ peso(bill.balanceAmount) }}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DialogFooter>
        <Button @click="$emit('update:open', false)">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

defineProps<{
  open: boolean
  bill: any
}>()

defineEmits<{
  'update:open': [value: boolean]
}>()

const peso = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
