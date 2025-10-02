<script setup lang="ts">
import { usePaymentInstalmentStore, usePaymentStore, usePaymentPlanStore } from "@/stores/billing"
import {
  createPaymentInstalmentSchema,
  updatePaymentInstalmentSchema,
  type CreatePaymentInstalment,
  type UpdatePaymentInstalment,
} from "@/types/billing"
import { TypedForm, TypedSelect, TypedNumber } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const paymentInstalmentStore = usePaymentInstalmentStore()
const paymentStore = usePaymentStore()
const paymentPlanStore = usePaymentPlanStore()

const props = defineProps<{
  paymentInstalmentId?: string
}>()

const paymentOptions = computed(() => {
  paymentStore.getPayments()
  return paymentStore.payments.map((payment) => ({
    label: `${payment.transaction.encounter.patient.firstName} ${payment.transaction.encounter.patient.lastName} - ${payment.amount}`,
    value: payment.id,
  }))
})

const planOptions = computed(() => {
  paymentPlanStore.getPaymentPlans()
  return paymentPlanStore.paymentPlans.map((plan) => ({
    label: `${plan.name} - ${plan.cycle}`,
    value: plan.id,
  }))
})

const onSubmit = async (values: CreatePaymentInstalment | UpdatePaymentInstalment) => {
  if (props.paymentInstalmentId) {
    await paymentInstalmentStore.updatePaymentInstalment({
      id: props.paymentInstalmentId,
      ...values,
    })
  } else {
    await paymentInstalmentStore.createPaymentInstalment(values)
  }
}

onMounted(async () => {
  if (props.paymentInstalmentId) {
    await paymentInstalmentStore.getPaymentInstalment(props.paymentInstalmentId)
  }
})
</script>

<template>
  <TypedForm
    :schema="props.paymentInstalmentId ? updatePaymentInstalmentSchema : createPaymentInstalmentSchema"
    :initial-values="props.paymentInstalmentId ? paymentInstalmentStore.paymentInstalment || {} : {}"
    @submit="onSubmit"
  >
    <TypedSelect 
      name="paymentId" 
      label="Payment" 
      placeholder="Select payment"
      :options="paymentOptions" 
    />
    <TypedSelect 
      name="planId" 
      label="Payment Plan" 
      placeholder="Select plan"
      :options="planOptions" 
    />
    <TypedNumber name="instalmentNumber" label="Instalment Number" placeholder="Enter instalment number" />
    <TypedNumber name="amountDue" label="Amount Due" placeholder="Enter amount due" />
    <TypedNumber name="amountPaid" label="Amount Paid" placeholder="Enter amount paid" />

    <div class="flex gap-2">
      <Button type="submit" variant="outline">
        <Icon name="mdi:floppy" />
        Save
      </Button>
      <Button type="button" variant="outline" @click="navigateTo('/billing/payment-instalments')">
        <Icon name="mdi:arrow-left" />
        Back
      </Button>
    </div>
  </TypedForm>
</template>