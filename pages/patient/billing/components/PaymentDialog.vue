<script setup lang="ts">
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const props = defineProps<{
  open: boolean
  bill: {
    id: string
    transactionId: string
    items: string
    cost: number
    date: string
  }
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'confirm-payment': [billId: string, paymentMethod: string]
}>()

const selectedPaymentMethod = ref<string>('paymaya')
const processing = ref(false)

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(amount)
}

const handleConfirmPayment = async () => {
  processing.value = true
  try {
    emit('confirm-payment', props.bill.id, selectedPaymentMethod.value)
    // Dialog will close after successful payment in parent component
  } catch (error) {
    console.error('Payment error:', error)
  } finally {
    processing.value = false
  }
}

const handleClose = () => {
  if (!processing.value) {
    emit('update:open', false)
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="handleClose">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Payment Details</DialogTitle>
        <DialogDescription>
          Complete your payment for this bill using your preferred payment method.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <!-- Bill Details -->
        <div class="rounded-lg border p-4 space-y-2 bg-gray-50">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Transaction ID:</span>
            <span class="font-medium">{{ bill.transactionId }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Date Posted:</span>
            <span class="font-medium">{{ bill.date }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Items:</span>
            <span class="font-medium">{{ bill.items }}</span>
          </div>
          <div class="flex justify-between text-base font-semibold pt-2 border-t">
            <span>Total Amount:</span>
            <span class="text-green-600">{{ formatCurrency(bill.cost) }}</span>
          </div>
        </div>

        <!-- Payment Method Selection -->
        <div class="space-y-3">
          <Label class="text-base font-medium">Select Payment Method</Label>
          <Select v-model="selectedPaymentMethod">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Choose payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paymaya">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold text-xs">
                    PM
                  </div>
                  <span>PayMaya</span>
                </div>
              </SelectItem>
              <SelectItem value="maya">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xs">
                    M
                  </div>
                  <span>Maya</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Payment Info -->
        <div class="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
          <div class="flex gap-2">
            <Icon name="mdi:information" class="flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-medium">Secure Payment</p>
              <p class="text-xs">You will be redirected to the payment gateway to complete your transaction securely.</p>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter class="gap-2">
        <Button 
          variant="outline" 
          @click="handleClose"
          :disabled="processing"
        >
          Cancel
        </Button>
        <Button 
          @click="handleConfirmPayment"
          :disabled="processing"
          class="bg-green-600 hover:bg-green-700"
        >
          <Icon v-if="processing" name="mdi:loading" class="animate-spin mr-2" />
          {{ processing ? 'Processing...' : 'Proceed to Payment' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
