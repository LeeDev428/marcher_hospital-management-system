<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Add Items to Bill</DialogTitle>
        <DialogDescription>
          Transaction: {{ bill?.transactionNumber }}
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <!-- Item Type -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Item Type</label>
          <select v-model="newItem.itemType" class="w-full px-3 py-2 border rounded-md">
            <option value="">Select type...</option>
            <option value="ROOM_CHARGE">Room Charge</option>
            <option value="CONSULTATION">Consultation</option>
            <option value="LABORATORY">Laboratory</option>
            <option value="RADIOLOGY">Radiology</option>
            <option value="MEDICATION">Medication</option>
            <option value="PROCEDURE">Procedure</option>
            <option value="SURGERY">Surgery</option>
            <option value="SUPPLIES">Supplies</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Description</label>
          <input
            v-model="newItem.description"
            type="text"
            placeholder="Enter item description"
            class="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <!-- Quantity and Unit Price -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Quantity</label>
            <input
              v-model.number="newItem.quantity"
              type="number"
              min="1"
              class="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Unit Price</label>
            <input
              v-model.number="newItem.unitPrice"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <!-- Total -->
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="flex justify-between items-center">
            <span class="font-medium">Total</span>
            <span class="text-xl font-bold">{{ peso(newItem.quantity * newItem.unitPrice) }}</span>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="$emit('update:open', false)">Cancel</Button>
        <Button @click="addItem" :disabled="!canAdd">Add Item</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  open: boolean
  bill: any
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'item-added': [item: any]
}>()

const newItem = ref({
  itemType: '',
  description: '',
  quantity: 1,
  unitPrice: 0
})

const canAdd = computed(() => {
  return newItem.value.itemType && 
         newItem.value.description && 
         newItem.value.quantity > 0 && 
         newItem.value.unitPrice > 0
})

const addItem = () => {
  if (!canAdd.value) return

  emit('item-added', {
    ...newItem.value,
    totalAmount: newItem.value.quantity * newItem.value.unitPrice
  })

  // Reset form
  newItem.value = {
    itemType: '',
    description: '',
    quantity: 1,
    unitPrice: 0
  }

  emit('update:open', false)
}

const peso = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount)
}
</script>
