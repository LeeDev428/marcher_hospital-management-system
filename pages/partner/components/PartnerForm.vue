<script setup lang="ts">
import { usePartnerStore } from "@/stores/partner"
import { createPartnerSchema, updatePartnerSchema, partnerTypeOptions } from "@/types/partner"
import type { CreatePartner, UpdatePartner } from "@/types/partner"
import { TypedForm, TypedInput, TypedSelect, TypedTextarea } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const partnerStore = usePartnerStore()

const props = defineProps<{
  partnerId?: string
}>()

const onSubmit = async (data: CreatePartner | UpdatePartner) => {
  if (props.partnerId) {
    const result = await partnerStore.updatePartner({
      id: props.partnerId,
      ...data,
    })
    if (result.success) {
      // Navigate back to partners list (you can implement navigation here)
      console.log("Redirecting to /partner")
    }
  } else {
    const result = await partnerStore.createPartner(data)
    if (result.success) {
      // Navigate back to partners list
      console.log("Redirecting to /partner")
    }
  }
}

onMounted(async () => {
  if (props.partnerId) {
    await partnerStore.getPartner({ id: props.partnerId })
  }
})
</script>

<template>
  <TypedForm
    :schema="props.partnerId ? updatePartnerSchema : createPartnerSchema"
    :initial-values="props.partnerId ? partnerStore.partner || {} : {}"
    @submit="onSubmit"
  >
    <TypedSelect 
      name="type" 
      label="Partner Type" 
      :options="partnerTypeOptions" 
      placeholder="Select Partner Type" 
    />
    
    <TypedInput 
      name="organizationName" 
      label="Organization Name" 
      type="text" 
      placeholder="Organization Name" 
    />
    
    <TypedTextarea 
      name="organizationAddress" 
      label="Organization Address" 
      placeholder="Organization Address" 
    />
    
    <TypedInput 
      name="representativeName" 
      label="Representative Name" 
      type="text" 
      placeholder="Representative Name" 
    />
    
    <TypedInput 
      name="representativeEmail" 
      label="Representative Email" 
      type="email" 
      placeholder="Representative Email" 
    />
    
    <TypedInput 
      name="representativePhone" 
      label="Representative Phone" 
      type="text" 
      placeholder="Representative Phone" 
    />
    
    <div class="flex gap-2">
      <Button type="submit" variant="outline" :disabled="partnerStore.loading">
        <Icon name="mdi:floppy" />
        {{ partnerStore.loading ? 'Saving...' : 'Save' }}
      </Button>
      
      <Button type="button" variant="outline" @click="navigateTo('/partner')">
        <Icon name="mdi:arrow-left" />
        Back
      </Button>
    </div>
  </TypedForm>
</template>