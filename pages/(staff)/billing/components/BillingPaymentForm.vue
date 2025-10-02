<script setup lang="ts">
import { usePaymentStore, useTransactionStore } from "@/stores/billing"
import {
  createPaymentSchema,
  updatePaymentSchema,
  type CreatePayment,
  type UpdatePayment,
} from "@/types/billing"
import { TypedForm, TypedSelect, TypedNumber } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const paymentStore = usePaymentStore()
const transactionStore = useTransactionStore()

const props = defineProps<{
  paymentId?: string
}>()

const transactionOptions = computed(() => {
  transactionStore.getTransactions()
  return transactionStore.transactions.map((transaction) => ({
    label: `${transaction.encounter.patient.firstName} ${transaction.encounter.patient.lastName} - ${transaction.status}`,
    value: transaction.id,
  }))
})

const onSubmit = async (values: CreatePayment | UpdatePayment) => {
  if (props.paymentId) {
    await paymentStore.updatePayment({
      id: props.paymentId,
      ...values,
    })
  } else {
    await paymentStore.createPayment(values)
  }
}

onMounted(async () => {
  if (props.paymentId) {
    await paymentStore.getPayment(props.paymentId)
  }
})
</script>

<template>
  <TypedForm
    :schema="props.paymentId ? updatePaymentSchema : createPaymentSchema"
    :initial-values="props.paymentId ? paymentStore.payment || {} : {}"
    @submit="onSubmit"
  >
    <TypedSelect 
      name="transactionId" 
      label="Transaction" 
      placeholder="Select transaction"
      :options="transactionOptions" 
    />
    <TypedNumber name="amount" label="Amount" placeholder="Enter amount" />

    <div class="flex gap-2">
      <Button type="submit" variant="outline">
        <Icon name="mdi:floppy" />
        Save
      </Button>
      <Button type="button" variant="outline" @click="navigateTo('/billing/payments')">
        <Icon name="mdi:arrow-left" />
        Back
      </Button>
    </div>
  </TypedForm>
</template>