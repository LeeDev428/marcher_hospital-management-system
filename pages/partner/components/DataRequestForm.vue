<script setup lang="ts">
import { usePartnerDataRequestStore, usePartnerStore } from "@/stores/partner"
import { createPartnerDataRequestSchema, updatePartnerDataRequestSchema } from "@/types/partner"
import type { CreatePartnerDataRequest, UpdatePartnerDataRequest } from "@/types/partner"
import { TypedForm, TypedInput, TypedSelect, TypedTextarea } from "@/components/app/form"
import { Button } from "@/components/ui/button"

const dataRequestStore = usePartnerDataRequestStore()
const partnerStore = usePartnerStore()

const props = defineProps<{
  dataRequestId?: string
}>()

const partnerOptions = computed(() =>
  partnerStore.partners.map(partner => ({
    label: partner.organizationName,
    value: partner.id,
  }))
)

const statusOptions = [
  { label: "Pending", value: "PENDING" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Rejected", value: "REJECTED" },
]

const onSubmit = async (data: CreatePartnerDataRequest | UpdatePartnerDataRequest) => {
  if (props.dataRequestId) {
    const result = await dataRequestStore.updateDataRequest({
      id: props.dataRequestId,
      ...data,
    })
    if (result.success) {
      console.log("Redirecting to /partner/data-requests")
    }
  } else {
    const result = await dataRequestStore.createDataRequest(data)
    if (result.success) {
      console.log("Redirecting to /partner/data-requests")
    }
  }
}

onMounted(async () => {
  await partnerStore.getPartners()
  if (props.dataRequestId) {
    await dataRequestStore.getDataRequest({ id: props.dataRequestId })
  }
})
</script>

<template>
  <TypedForm
    :schema="props.dataRequestId ? updatePartnerDataRequestSchema : createPartnerDataRequestSchema"
    :initial-values="props.dataRequestId ? dataRequestStore.dataRequest || {} : {}"
    @submit="onSubmit"
  >
    <TypedSelect 
      name="partnerId" 
      label="Partner" 
      :options="partnerOptions" 
      placeholder="Select Partner" 
    />
    
    <TypedInput 
      name="branchId" 
      label="Branch ID" 
      type="text" 
      placeholder="Branch ID" 
    />
    
    <TypedInput 
      name="encounterId" 
      label="Encounter ID" 
      type="text" 
      placeholder="Encounter ID" 
    />
    
    <TypedSelect 
      name="status" 
      label="Status" 
      :options="statusOptions" 
      placeholder="Select Status" 
    />
    
    <TypedTextarea 
      name="message" 
      label="Message" 
      placeholder="Additional message (optional)" 
    />
    
    <div class="flex gap-2">
      <Button type="submit" variant="outline" :disabled="dataRequestStore.loading">
        <Icon name="mdi:floppy" />
        {{ dataRequestStore.loading ? 'Saving...' : 'Save' }}
      </Button>
      
      <Button type="button" variant="outline" @click="navigateTo('/partner/data-requests')">
        <Icon name="mdi:arrow-left" />
        Back
      </Button>
    </div>
  </TypedForm>

</template>
