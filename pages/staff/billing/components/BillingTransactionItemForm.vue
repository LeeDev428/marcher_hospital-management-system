<script setup lang="ts">
import { useTransactionItemStore, useTransactionStore } from "@/stores/billing"
import {
  createTransactionItemSchema,
  updateTransactionItemSchema,
  type CreateTransactionItem,
  type UpdateTransactionItem,
} from "@/types/billing"
import { TypedForm, TypedSelect, TypedInput, TypedTextarea, TypedNumber } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const transactionItemStore = useTransactionItemStore()
const transactionStore = useTransactionStore()

const props = defineProps<{
  transactionItemId?: string
}>()

const transactionOptions = computed(() => {
  transactionStore.getTransactions()
  return transactionStore.transactions.map((transaction) => ({
    label: `${transaction.encounter.patient.firstName} ${transaction.encounter.patient.lastName} - ${transaction.status}`,
    value: transaction.id,
  }))
})

const onSubmit = async (values: CreateTransactionItem | UpdateTransactionItem) => {
  if (props.transactionItemId) {
    await transactionItemStore.updateTransaction({
      id: props.transactionItemId,
      ...values,
      status: "PENDING",
      encounterId: ""
    })
  } else {
    await transactionItemStore.createTransactionItem(values)
  }
}

onMounted(async () => {
  if (props.transactionItemId) {
    await transactionItemStore.getTransactionItem(props.transactionItemId)
  }
})
</script>

<template>
  <TypedForm
    :schema="props.transactionItemId ? updateTransactionItemSchema : createTransactionItemSchema"
    :initial-values="props.transactionItemId ? transactionItemStore.transactionItem || {} : {}"
    @submit="onSubmit"
  >
    <TypedSelect 
      name="transactionId" 
      label="Transaction" 
      placeholder="Select transaction"
      :options="transactionOptions" 
    />
    <TypedInput name="name" label="Item Name" placeholder="Enter item name" type="text" />
    <TypedTextarea name="description" label="Description" placeholder="Enter description" />
    <TypedNumber name="amount" label="Amount" placeholder="Enter amount" />

    <div class="flex gap-2">
      <Button type="submit" variant="outline">
        <Icon name="mdi:floppy" />
        Save
      </Button>
      <Button type="button" variant="outline" @click="navigateTo('/billing/transaction-items')">
        <Icon name="mdi:arrow-left" />
        Back
      </Button>
    </div>
  </TypedForm>
</template>