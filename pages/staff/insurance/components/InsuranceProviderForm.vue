<script setup lang="ts">
import { useInsuranceProviderStore } from "@/stores/insurance"
import {
  createInsuranceProviderSchema,
  updateInsuranceProviderSchema,
  type CreateInsuranceProvider,
  type UpdateInsuranceProvider,
} from "@/types/insurance"
import { TypedForm, TypedInput, TypedTextarea } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const insuranceProviderStore = useInsuranceProviderStore()

const props = defineProps<{
  insuranceProviderId?: string
}>()

const onSubmit = async (values: CreateInsuranceProvider | UpdateInsuranceProvider) => {
  if (props.insuranceProviderId) {
    await insuranceProviderStore.updateInsuranceProvider({
      id: props.insuranceProviderId,
      ...values,
    })
  } else {
    await insuranceProviderStore.createInsuranceProvider(values)
  }
}

onMounted(async () => {
  if (props.insuranceProviderId) {
    await insuranceProviderStore.getInsuranceProvider(props.insuranceProviderId)
  }
})
</script>

<template>
  <TypedForm
    :schema="props.insuranceProviderId ? updateInsuranceProviderSchema : createInsuranceProviderSchema"
    :initial-values="props.insuranceProviderId ? insuranceProviderStore.provider || {} : {}"
    @submit="onSubmit"
  >
    <TypedInput name="name" label="Name" placeholder="Enter provider name" type="text" />
    <TypedTextarea name="description" label="Description" placeholder="Enter description" />
    <TypedInput name="email" label="Email" placeholder="Enter email" type="email" />
    <TypedInput name="phone" label="Phone" placeholder="Enter phone" type="text" />
    <TypedInput name="address" label="Address" placeholder="Enter address" type="text" />
    <TypedInput name="city" label="City" placeholder="Enter city" type="text" />
    <TypedInput name="state" label="State" placeholder="Enter state" type="text" />
    <TypedInput name="zip" label="ZIP Code" placeholder="Enter ZIP code" type="text" />
    <TypedInput name="country" label="Country" placeholder="Enter country" type="text" />

    <div class="flex gap-2">
      <Button type="submit" variant="outline">
        <Icon name="mdi:floppy" />
        Save
      </Button>
      <Button type="button" variant="outline" @click="navigateTo('/insurance/providers')">
        <Icon name="mdi:arrow-left" />
        Back
      </Button>
    </div>
  </TypedForm>
</template>