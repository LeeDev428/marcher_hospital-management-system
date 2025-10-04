<script setup lang="ts">
import { useInsuranceClaimStore, useInsuranceProviderStore } from "@/stores/insurance"
import {
  createInsuranceClaimSchema,
  updateInsuranceClaimSchema,
  type CreateInsuranceClaim,
  type UpdateInsuranceClaim,
  insuranceClaimStatusOptions,
} from "@/types/insurance"
import { TypedForm, TypedSelect, TypedInput, TypedTextarea, TypedNumber } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const insuranceClaimStore = useInsuranceClaimStore()
const insuranceProviderStore = useInsuranceProviderStore()

const props = defineProps<{
  insuranceClaimId?: string
}>()

const providerOptions = computed(() => {
  insuranceProviderStore.getInsuranceProviders()
  return insuranceProviderStore.providers.map((provider) => ({
    label: provider.name,
    value: provider.id,
  }))
})

const onSubmit = async (values: CreateInsuranceClaim | UpdateInsuranceClaim) => {
  if (props.insuranceClaimId) {
    await insuranceClaimStore.updateInsuranceClaim({
      id: props.insuranceClaimId,
      ...values,
    })
  } else {
    await insuranceClaimStore.createInsuranceClaim(values)
  }
}

onMounted(async () => {
  if (props.insuranceClaimId) {
    await insuranceClaimStore.getInsuranceClaim(props.insuranceClaimId)
  }
})
</script>

<template>
  <TypedForm
    :schema="props.insuranceClaimId ? updateInsuranceClaimSchema : createInsuranceClaimSchema"
    :initial-values="props.insuranceClaimId ? insuranceClaimStore.claim || {} : {}"
    @submit="onSubmit"
  >
    <TypedSelect name="providerId" label="Provider" placeholder="Select provider" :options="providerOptions" />
    <TypedSelect name="status" label="Status" placeholder="Select status" :options="insuranceClaimStatusOptions" />
    <TypedNumber name="amount" label="Amount" placeholder="Enter amount" />
    <TypedTextarea name="message" label="Message" placeholder="Enter message" />

    <div class="flex gap-2">
      <Button type="submit" variant="outline">
        <Icon name="mdi:floppy" />
        Save
      </Button>
      <Button type="button" variant="outline" @click="navigateTo('/insurance')">
        <Icon name="mdi:arrow-left" />
        Back
      </Button>
    </div>
  </TypedForm>
</template>