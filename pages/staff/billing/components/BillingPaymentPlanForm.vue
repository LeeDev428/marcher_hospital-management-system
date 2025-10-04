<script setup lang="ts">
import { usePaymentPlanStore } from "@/stores/billing"
import {
  createPaymentPlanSchema,
  updatePaymentPlanSchema,
  type CreatePaymentPlan,
  type UpdatePaymentPlan,
  paymentPlanCycleOptions,
} from "@/types/billing"
import { TypedForm, TypedSelect, TypedInput, TypedTextarea, TypedNumber } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const paymentPlanStore = usePaymentPlanStore()

const props = defineProps<{
  paymentPlanId?: string
}>()

const onSubmit = async (values: CreatePaymentPlan | UpdatePaymentPlan) => {
  if (props.paymentPlanId) {
    await paymentPlanStore.updatePaymentPlan({
      id: props.paymentPlanId,
      ...values,
    })
  } else {
    await paymentPlanStore.createPaymentPlan(values)
  }
}

onMounted(async () => {
  if (props.paymentPlanId) {
    await paymentPlanStore.getPaymentPlan(props.paymentPlanId)
  }
})
</script>

<template>
  <TypedForm
    :schema="props.paymentPlanId ? updatePaymentPlanSchema : createPaymentPlanSchema"
    :initial-values="props.paymentPlanId ? paymentPlanStore.paymentPlan || {} : {}"
    @submit="onSubmit"
  >
    <TypedInput name="name" label="Plan Name" placeholder="Enter plan name" type="text" />
    <TypedTextarea name="description" label="Description" placeholder="Enter description" />
    <TypedSelect 
      name="cycle" 
      label="Payment Cycle" 
      placeholder="Select cycle"
      :options="paymentPlanCycleOptions" 
    />
    <TypedNumber name="numberOfPayments" label="Number of Payments" placeholder="Enter number of payments" />

    <div class="flex gap-2">
      <Button type="submit" variant="outline">
        <Icon name="mdi:floppy" />
        Save
      </Button>
      <Button type="button" variant="outline" @click="navigateTo('/billing/payment-plans')">
        <Icon name="mdi:arrow-left" />
        Back
      </Button>
    </div>
  </TypedForm>
</template>