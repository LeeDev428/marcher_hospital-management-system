<script setup lang="ts">
import { useInsuranceClaimItemStore, useInsuranceClaimStore } from "@/stores/insurance"
import {
  createInsuranceClaimItemSchema,
  updateInsuranceClaimItemSchema,
  type CreateInsuranceClaimItem,
  type UpdateInsuranceClaimItem,
} from "@/types/insurance"
import { TypedForm, TypedSelect, TypedInput, TypedTextarea, TypedNumber } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const insuranceClaimItemStore = useInsuranceClaimItemStore()
const insuranceClaimStore = useInsuranceClaimStore()

const props = defineProps<{
  insuranceClaimItemId?: string
}>()

const claimOptions = computed(() => {
  insuranceClaimStore.getInsuranceClaims()
  return insuranceClaimStore.claims.map((claim) => ({
    label: `${claim.provider.name} - P${claim.amount}`,
    value: claim.id,
  }))
})

const onSubmit = async (values: CreateInsuranceClaimItem | UpdateInsuranceClaimItem) => {
  if (props.insuranceClaimItemId) {
    await insuranceClaimItemStore.updateInsuranceClaimItem({
      id: props.insuranceClaimItemId,
      ...values,
    })
  } else {
    await insuranceClaimItemStore.createInsuranceClaimItem(values)
  }
}

onMounted(async () => {
  if (props.insuranceClaimItemId) {
    await insuranceClaimItemStore.getInsuranceClaimItem(props.insuranceClaimItemId)
  }
})
</script>

<template>
  <TypedForm
    :schema="props.insuranceClaimItemId ? updateInsuranceClaimItemSchema : createInsuranceClaimItemSchema"
    :initial-values="props.insuranceClaimItemId ? insuranceClaimItemStore.claimItem || {} : {}"
    @submit="onSubmit"
  >
    <TypedSelect name="claimId" label="Claim" placeholder="Select claim" :options="claimOptions" />
    <TypedInput name="name" label="Item Name" placeholder="Enter item name" type="text" />
    <TypedTextarea name="description" label="Description" placeholder="Enter description" />
    <TypedNumber name="amount" label="Amount" placeholder="Enter amount" />

    <div class="flex gap-2">
      <Button type="submit" variant="outline">
        <Icon name="mdi:floppy" />
        Save
      </Button>
      <Button type="button" variant="outline" @click="navigateTo('/insurance/claim-items')">
        <Icon name="mdi:arrow-left" />
        Back
      </Button>
    </div>
  </TypedForm>
</template>